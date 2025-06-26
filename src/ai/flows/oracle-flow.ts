'use server';
/**
 * @fileOverview A Genkit flow that acts as a tarot oracle.
 *
 * - chatWithOracle - A function that allows a user to chat with an AI oracle about a specific card.
 * - OracleInput - The input type for the chatWithOracle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input Schema
const OracleInputSchema = z.object({
  cardName: z.string().describe('The name of the card the user is asking about.'),
  cardGeneralMeaning: z.string().describe('The general meaning of the card.'),
  userQuestion: z.string().describe("The user's question to the oracle."),
});
export type OracleInput = z.infer<typeof OracleInputSchema>;

// The exported function that the UI will call
export async function chatWithOracle(input: OracleInput): Promise<string> {
  const flowResult = await oracleFlow(input);
  return flowResult;
}

// The Genkit Prompt
const oraclePrompt = ai.definePrompt({
  name: 'oraclePrompt',
  input: { schema: OracleInputSchema },
  prompt: `Tu es "L'Oracle", un guide spirituel sage et bienveillant, expert en cartomancie. Tu réponds aux questions des utilisateurs concernant une carte spécifique du jeu.

Ton ton est mystérieux, poétique, mais toujours clair et encourageant. Tu ne donnes jamais de prédictions directes ou fatalistes, mais plutôt des pistes de réflexion et des conseils pour guider l'utilisateur.

La carte actuelle est le {{cardName}}.
Sa signification générale est : "{{cardGeneralMeaning}}".

L'utilisateur te pose la question suivante : "{{userQuestion}}"

Ta réponse doit être formulée comme si tu étais un oracle s'adressant directement à un consultant. Utilise cette carte comme point de départ pour ta réponse, en intégrant ses thèmes et son énergie pour éclairer la question de l'utilisateur.`,
});

// The Genkit Flow
const oracleFlow = ai.defineFlow(
  {
    name: 'oracleFlow',
    inputSchema: OracleInputSchema,
    outputSchema: z.string(), // The flow will output just the string response
  },
  async (input) => {
    const result = await oraclePrompt(input);
    // Handle cases where the model returns no text, which can happen with safety flags etc.
    return result.text ?? "Désolé, une interférence cosmique perturbe ma vision. L'oracle reste silencieux pour l'instant.";
  }
);
