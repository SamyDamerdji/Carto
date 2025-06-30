'use server';
/**
 * @fileOverview A Genkit flow for text-to-speech conversion.
 * This version is rebuilt for robustness and clearer error handling.
 */
import { ai, googleAI } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';

const TtsOutputSchema = z.object({
  media: z.string().describe("The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type TtsOutput = z.infer<typeof TtsOutputSchema>;

// Helper function to convert raw PCM audio data to WAV format
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
    writer.on('data', (d: Buffer) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

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
    // If the query is empty, it's better to throw an error than to fail silently.
    if (!query || query.trim() === '') {
      console.warn("TTS flow received an empty query.");
      return { media: '' }; // Returning empty is okay, the orchestrator will handle it.
    }
    
    // The main API call is wrapped in a try...catch to handle any potential errors.
    try {
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Using a standard voice
            },
          },
        },
        prompt: query,
      });

      // If the API returns no media, throw an error.
      if (!media || !media.url) {
        throw new Error('No media was returned from the TTS API.');
      }

      // Extract the base64 data from the data URI.
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      
      if (audioBuffer.length === 0) {
        throw new Error('The TTS API returned an empty audio buffer.');
      }
      
      // Convert the raw PCM audio to WAV format.
      const wavData = await toWav(audioBuffer);
      
      // Return the audio data in the correct format for the client.
      return {
        media: 'data:audio/wav;base64,' + wavData,
      };
    } catch (error) {
      console.error(`Error in ttsFlow for query: "${query}"`, error);
      // Re-throw the error so the calling flow (the orchestrator) can catch it.
      throw new Error(`Failed to generate audio. Details: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);

// The exported function that the orchestrator will call.
export async function textToSpeech(text: string): Promise<TtsOutput> {
  // If the input text is empty, we can short-circuit here to avoid an unnecessary flow run.
  if (!text.trim()) {
    return { media: '' };
  }
  return ttsFlow(text);
}
