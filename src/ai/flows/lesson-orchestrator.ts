
'use server';
/**
 * @fileOverview A Genkit flow that orchestrates the creation of an interactive lesson step.
 *
 * - getLessonStep - A function that generates lesson content and its corresponding audio.
 * - LessonStepOutput - The output type for the orchestrator.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { chatWithOracle } from './oracle-flow';
import { textToSpeech, type TtsOutput } from './tts-flow';
import { LearningInputSchema, type LearningInput, type LearningOutput } from '../schemas/lesson-schemas';

// Output schema for the orchestrator, combining lesson and audio
const LessonStepOutputSchema = z.object({
    step: z.any(), // Using z.any() for simplicity, maps to LearningOutput
    audio: z.any(), // Using z.any() for simplicity, maps to TtsOutput
});

// The exported function that the UI will call
export async function getLessonStep(input: LearningInput): Promise<{ step: LearningOutput, audio: TtsOutput }> {
    const flowResult = await lessonOrchestratorFlow(input);
    return flowResult;
}

const lessonOrchestratorFlow = ai.defineFlow(
  {
    name: 'lessonOrchestratorFlow',
    inputSchema: LearningInputSchema, // Using the specific schema from lesson-schemas
    outputSchema: LessonStepOutputSchema,
  },
  async (input: LearningInput) => {
    try {
      // 1. Generate the lesson content
      const stepResult = await chatWithOracle(input);

      // 2. Generate the audio for the lesson's paragraph
      let audioResult: TtsOutput = { media: '' };
      if (stepResult && stepResult.paragraphe) {
        audioResult = await textToSpeech(stepResult.paragraphe);
      }

      // 3. Return both results combined
      return {
        step: stepResult,
        audio: audioResult,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error in lessonOrchestratorFlow:", errorMessage);
      // Re-throw a detailed error to be caught by the client
      throw new Error(`Erreur dans l'orchestrateur : ${errorMessage}`);
    }
  }
);
