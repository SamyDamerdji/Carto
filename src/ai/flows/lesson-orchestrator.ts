'use server';
/**
 * @fileOverview This file orchestrates the generation of interactive lesson steps.
 * It calls various flows to get content, audio, and images, and combines them.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getCardDetails } from '@/lib/data/cards';
import { getImmersionScript } from './oracle-flow';
import { textToSpeech, TtsOutputSchema } from './tts-flow';
import { generateImage, GenerateImageOutputSchema } from './image-generation-flow';

// Input for the main orchestrator flow
export const LessonStepInputSchema = z.object({
  cardId: z.string(),
  step: z.number().int().min(0),
});
export type LessonStepInput = z.infer<typeof LessonStepInputSchema>;

// Output for a single lesson step
export const LessonStepOutputSchema = z.object({
  script: z.string(),
  audioUrl: TtsOutputSchema.shape.media,
  imageUrl: GenerateImageOutputSchema.shape.imageUrl.optional(),
  isLastStep: z.boolean(),
});
export type LessonStepOutput = z.infer<typeof LessonStepOutputSchema>;


// The main exported function that the UI will call
export async function getLessonStep(input: LessonStepInput): Promise<LessonStepOutput> {
  return await lessonOrchestratorFlow(input);
}


// The orchestrator flow
const lessonOrchestratorFlow = ai.defineFlow(
  {
    name: 'lessonOrchestratorFlow',
    inputSchema: LessonStepInputSchema,
    outputSchema: LessonStepOutputSchema,
  },
  async ({ cardId, step }) => {
    const card = getCardDetails(cardId);
    if (!card) {
      throw new Error(`Card with ID ${cardId} not found.`);
    }

    if (step === 0) {
      const { script, imagePrompt } = await getImmersionScript(card);

      const [ttsResult, imageResult] = await Promise.all([
        textToSpeech(script),
        generateImage(imagePrompt),
      ]);
      
      if (!ttsResult || !ttsResult.media) {
        throw new Error("TTS generation failed for the lesson step.");
      }

      return {
        script,
        audioUrl: ttsResult.media,
        imageUrl: imageResult.imageUrl,
        isLastStep: true, 
      };
    }

    throw new Error(`Lesson step ${step} is not defined for this card.`);
  }
);