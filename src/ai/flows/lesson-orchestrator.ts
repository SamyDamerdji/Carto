
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
export type LessonStepOutput = z.infer<typeof LessonStepOutputSchema>;

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
    let stepResult: LearningOutput;
    try {
      // 1. Generate the lesson content
      console.log('Orchestrator: Generating lesson content...');
      stepResult = await chatWithOracle(input);
      console.log('Orchestrator: Lesson content generated successfully.');
    } catch (error: any) {
      console.error("[ORCHESTRATOR-TEXT-ERROR] Failed to generate lesson content:", JSON.stringify(error, null, 2));
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`[ORCHESTRATOR-TEXT-ERROR] ${errorMessage}`);
    }

    let audioResult: TtsOutput = { media: '' };
    if (stepResult && stepResult.paragraphe) {
      try {
        // 2. Generate the audio for the lesson's paragraph
        console.log('Orchestrator: Generating audio for paragraph:', `"${stepResult.paragraphe}"`);
        audioResult = await textToSpeech(stepResult.paragraphe);
        console.log('Orchestrator: Audio generated successfully.');
      } catch (error: any) {
        console.error("[ORCHESTRATOR-AUDIO-ERROR] Failed to generate audio:", JSON.stringify(error, null, 2));
        const errorMessage = error instanceof Error ? error.message : String(error);
        // We throw the error so the UI can handle it.
        throw new Error(`[ORCHESTRATOR-AUDIO-ERROR] ${errorMessage}`);
      }
    }

    // 3. Return both results combined
    return {
      step: stepResult,
      audio: audioResult,
    };
  }
);
