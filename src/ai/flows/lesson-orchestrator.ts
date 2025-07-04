'use server';
/**
 * @fileOverview This file orchestrates the generation of interactive lesson steps.
 * It now includes a caching layer to generate content only once per card.
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
import { getCachedLesson, cacheLesson } from '@/services/lesson-cache';

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
    // 1. Check cache first
    const cachedLesson = await getCachedLesson(cardId);
    if (cachedLesson) {
      console.log(`[Cache] Found lesson for ${cardId}. Serving from cache.`);
      return cachedLesson;
    }

    console.log(`[Cache] No lesson found for ${cardId}. Generating new content...`);
    
    // 2. If not in cache, generate content
    const card = getCardDetails(cardId);
    if (!card) {
      throw new Error(`Card with ID ${cardId} not found.`);
    }

    if (step === 0) { // For now, we only have one step. This logic can be expanded.
      const { script, imagePrompt } = await getImmersionScript(card);

      // Generate audio and image in parallel
      const [ttsResult, imageResult] = await Promise.all([
        textToSpeech(script),
        generateImage(imagePrompt),
      ]);
      
      if (!ttsResult || !ttsResult.media) {
        throw new Error("TTS generation failed for the lesson step.");
      }

      const newLessonData: LessonStepOutput = {
        script,
        audioUrl: ttsResult.media,
        imageUrl: imageResult.imageUrl,
        isLastStep: true, 
      };

      // 3. Save the newly generated data to the cache
      await cacheLesson(cardId, newLessonData);
      console.log(`[Cache] Saved new lesson for ${cardId}.`);

      return newLessonData;
    }

    // This part can be expanded for multi-step lessons in the future.
    throw new Error(`Lesson step ${step} is not defined for this card.`);
  }
);
