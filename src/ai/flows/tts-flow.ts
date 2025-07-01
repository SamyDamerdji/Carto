'use server';
/**
 * @fileOverview A Genkit flow for text-to-speech conversion.
 * It converts text to speech and returns the audio in WAV format.
 */
import { ai } from '@/ai/genkit';
import { googleAI as googleAIPlugin } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

// Create a local instance of the Google AI plugin to safely access its model helper.
// This avoids a cross-file import issue with the Next.js server module compiler.
const googleAI = googleAIPlugin();

const TtsOutputSchema = z.object({
  media: z.string().describe("The generated audio as a data URI in WAV format."),
});
export type TtsOutput = z.infer<typeof TtsOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: z.string(),
    outputSchema: TtsOutputSchema,
  },
  async (query) => {
    if (!query || query.trim() === '') {
      console.warn("TTS flow received an empty query.");
      return { media: '' };
    }
    
    try {
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: query,
      });

      if (!media || !media.url) {
        throw new Error('No media was returned from the TTS API.');
      }
      
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );

      const wavBase64 = await toWav(audioBuffer);

      return {
        media: `data:audio/wav;base64,${wavBase64}`,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error in ttsFlow for query: "${query}"`, error);
      throw new Error(`Failed to generate audio. Details: ${errorMessage}`);
    }
  }
);

export async function textToSpeech(text: string): Promise<TtsOutput> {
  if (!text.trim()) {
    return { media: '' };
  }
  return ttsFlow(text);
}
