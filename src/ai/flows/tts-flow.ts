
'use server';
/**
 * @fileOverview A Genkit flow for text-to-speech conversion.
 * It converts text to speech and returns the audio in WAV format.
 */
import { ai } from '@/ai/genkit';
import { googleAI as googleAIPlugin } from '@genkit-ai/googleai';
import { z } from 'zod';

// Create a local, isolated instance of the Google AI plugin helper.
// This avoids cross-file import issues with Next.js server components.
const googleAI = googleAIPlugin();

const TtsOutputSchema = z.object({
  media: z.string().describe("The generated audio as a data URI."),
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
    
    let generatedMedia;
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
        generatedMedia = media;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorDetails = error?.details || 'No additional details available.';
      console.error(`TTS Flow - ai.generate call failed: ${errorMessage}`, JSON.stringify(error, null, 2));
      throw new Error(`[TTS-GENERATE-ERROR] ${errorMessage} - Details: ${errorDetails}`);
    }


    if (!generatedMedia || !generatedMedia.url) {
        throw new Error('[TTS] No media was returned from the TTS API.');
    }
    
    // For debugging: return raw PCM data without WAV conversion.
    // The browser will not be able to play this, but it confirms the API call worked.
    return {
        media: generatedMedia.url,
    };
  }
);

export async function textToSpeech(text: string): Promise<TtsOutput> {
  if (!text.trim()) {
    return { media: '' };
  }
  return ttsFlow(text);
}
