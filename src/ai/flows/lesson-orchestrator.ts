'use server';
/**
 * @fileOverview This file orchestrates the generation of interactive lesson steps.
 * It calls various flows to get content, audio, and images, and combines them.
 */
import { ai } from '@/ai/genkit';
import { getCardDetails } from '@/lib/data/cards';
import { getImmersionScript } from './oracle-flow';
import { textToSpeech } from './tts-flow';
import { generateImage } from './image-generation-flow';
import {
  LessonStepInputSchema,
  LessonStepOutputSchema,
  type LessonStepInput,
  type LessonStepOutput,
} from '@/ai/schemas/lesson-schemas';

// The main exported function that the UI will call
export async function getLessonStep(input: LessonStepInput): Promise<LessonStepOutput> {
  return await lessonOrchestratorFlow(input);
}
export type { LessonStepOutput };


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
