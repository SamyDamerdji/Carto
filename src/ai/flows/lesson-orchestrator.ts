'use server';
/**
 * @fileOverview A Genkit flow that orchestrates the creation of an interactive lesson step.
 *
 * - getLessonStep - A function that generates lesson content and its corresponding audio.
 * - LessonStepOutput - The output type for the orchestrator.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { chatWithOracle, LearningInputSchema, type LearningInput, type LearningOutput } from './oracle-flow';
import { textToSpeech, type TtsOutput } from './tts-flow';

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
    inputSchema: LearningInputSchema, // Using the specific schema from oracle-flow
    outputSchema: LessonStepOutputSchema,
  },
  async (input: LearningInput) => {
    try {
      // DIAGNOSTIC STEP: Bypass complex text generation to isolate the TTS flow.
      // const stepResult = await chatWithOracle(input);
      const stepResult: LearningOutput = {
        paragraphe: `Voici la leçon pour la carte ${input.card.nom_carte}. Ceci est un test pour confirmer que la synthèse vocale fonctionne.`,
        finDeLecon: false,
      };

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
      console.error("Error in lessonOrchestratorFlow:", error);
      throw new Error("L'orchestrateur de la leçon a rencontré une erreur.");
    }
  }
);
