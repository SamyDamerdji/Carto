
'use server';
/**
 * @fileOverview A Genkit flow for text-to-speech conversion.
 * It converts text to speech and returns the audio in WAV format.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { TtsOutputSchema, type TtsOutput } from '@/ai/schemas/lesson-schemas';

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

    let bufs: Buffer[] = [];
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
    if (!query || query.trim() === '') {
      console.warn("TTS flow received an empty query.");
      return { media: '' };
    }
    
    let generatedMedia;
    try {
        console.log('TTS Flow: Attempting to generate audio for query:', query);
        const modelToUse = 'googleai/gemini-2.5-flash-preview-tts';
        console.log('TTS Flow: Using model:', modelToUse);
        
        const { media } = await ai.generate({
            model: modelToUse,
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
      console.error(`[TTS-GENERATE-ERROR] Detailed Error:`, JSON.stringify(error, null, 2));
      console.error(`[TTS-GENERATE-ERROR] Message: ${errorMessage}`);
      console.error(`[TTS-GENERATE-ERROR] Stack: ${error?.stack}`);
      throw new Error(`[TTS-GENERATE-ERROR] ${errorMessage} - Details: ${errorDetails}`);
    }

    if (!generatedMedia || !generatedMedia.url) {
        throw new Error('[TTS] No media was returned from the TTS API.');
    }
    
    try {
        const audioBuffer = Buffer.from(
          generatedMedia.url.substring(generatedMedia.url.indexOf(',') + 1),
          'base64'
        );
        const wavBase64 = await toWav(audioBuffer);
        return {
            media: 'data:audio/wav;base64,' + wavBase64,
        };
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[TTS-WAV-CONVERSION-ERROR] Detailed Error:`, JSON.stringify(error, null, 2));
        throw new Error(`[TTS-WAV-CONVERSION-ERROR] ${errorMessage}`);
    }
  }
);

export async function textToSpeech(text: string): Promise<TtsOutput> {
  if (!text.trim()) {
    return { media: '' };
  }
  return ttsFlow(text);
}
