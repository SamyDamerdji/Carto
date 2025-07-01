'use server';
/**
 * @fileOverview A Genkit flow for text-to-speech conversion.
 * This is a simplified diagnostic version to isolate potential issues.
 * It returns raw PCM audio data without WAV conversion.
 */
import { ai, googleAI } from '@/ai/genkit';
import { z } from 'zod';
// The 'wav' package is removed for this diagnostic version.

const TtsOutputSchema = z.object({
  media: z.string().describe("The generated audio as a data URI. This may be raw PCM data."),
});
export type TtsOutput = z.infer<typeof TtsOutputSchema>;


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
      
      // DIAGNOSTIC: Return the raw PCM data URI directly without WAV conversion.
      return {
        media: media.url,
      };
    } catch (error) {
      console.error(`Error in ttsFlow for query: "${query}"`, error);
      throw new Error(`Failed to generate audio. Details: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);

export async function textToSpeech(text: string): Promise<TtsOutput> {
  if (!text.trim()) {
    return { media: '' };
  }
  return ttsFlow(text);
}
