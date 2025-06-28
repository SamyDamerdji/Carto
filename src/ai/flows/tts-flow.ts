'use server';
/**
 * @fileOverview A Genkit flow for text-to-speech conversion.
 *
 * - textToSpeech - Converts text into spoken audio.
 * - TtsOutput - The return type for the textToSpeech function.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

const TtsOutputSchema = z.object({
  media: z.string().describe("The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
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
    writer.on('data', (d: Buffer) => {
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
    try {
      if (!query) {
        return { media: '' };
      }
      
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'fr-FR-Chirp3-HD-Charon' },
            },
          },
        },
        prompt: query,
      });

      if (!media || !media.url) {
        throw new Error('TTS flow: no media returned from Genkit for query.');
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      
      const wavData = await toWav(audioBuffer);
      
      return {
        media: 'data:audio/wav;base64,' + wavData,
      };
    } catch (error) {
      console.error("Error in ttsFlow:", error);
      // Re-throw the error so the client can handle it.
      throw new Error("Une erreur est survenue lors de la génération de l'audio. Veuillez réessayer.");
    }
  }
);

export async function textToSpeech(text: string): Promise<TtsOutput> {
  return ttsFlow(text);
}
