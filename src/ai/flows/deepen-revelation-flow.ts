'use server';
/**
 * @fileOverview A Genkit flow for a deeper analysis of a "Systemic Revelation" spread.
 *
 * - deepenSystemicRevelation - Provides actionable advice based on an initial interpretation.
 * - DeepenRevelationInput - The input type for the flow.
 * - DeepenRevelationOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { SystemicRevelationInputSchema, SystemicRevelationOutputSchema } from '@/ai/schemas/revelation-schemas';
import type { SystemicRevelationInput, SystemicRevelationOutput } from '@/ai/schemas/revelation-schemas';

// Input Schema
const DeepenRevelationInputSchema = z.object({
  cards: SystemicRevelationInputSchema,
  initialInterpretation: SystemicRevelationOutputSchema,
});
export type DeepenRevelationInput = z.infer<typeof DeepenRevelationInputSchema>;

// Output Schema
const DeepenRevelationOutputSchema = z.object({
  conseilStrategique: z.string().describe("Conseil stratégique principal basé sur la dynamique globale. Doit être concret et actionnable."),
  levierDeChangement: z.string().describe("Identification du levier de changement le plus puissant et comment l'activer."),
  pointDeVigilance: z.string().describe("Le principal point de vigilance ou le piège à éviter pour le consultant."),
  questionReflexive: z.string().describe("Une question puissante et reflexive pour aider le consultant à poursuivre sa propre introspection.")
});
export type DeepenRevelationOutput = z.infer<typeof DeepenRevelationOutputSchema>;

// The exported function that the UI will call
export async function deepenSystemicRevelation(input: DeepenRevelationInput): Promise<DeepenRevelationOutput> {
  const flowResult = await deepenRevelationFlow(input);
  return flowResult;
}

// The Genkit Prompt
const deepenPrompt = ai.definePrompt({
    name: 'deepenRevelationPrompt',
    model: 'googleai/gemini-2.0-flash',
    input: { schema: DeepenRevelationInputSchema },
    output: { schema: DeepenRevelationOutputSchema },
    prompt: `Tu es un coach systémique et un mentor spirituel. Tu as déjà fourni une première analyse d'un tirage "Révélation Systémique". Maintenant, le consultant souhaite approfondir.

Ton rôle est de transformer l'analyse en sagesse actionnable. Sois direct, bienveillant mais sans complaisance.

Voici le tirage original :
- Pôle Dominant: {{cards.card1}}
- Pôle Opposé: {{cards.card2}}
- Pôle Médiateur: {{cards.card3}}
- Tension 1 (Blessure): {{cards.card4}}
- Tension 2 (Pression externe): {{cards.card5}}
- Tension 3 (Impulsion interne): {{cards.card6}}
- Résolution (Tendance): {{cards.card7}}

Voici la première interprétation :
- Analyse des Polarités: {{initialInterpretation.polarites.dominante}} {{initialInterpretation.polarites.opposee}} {{initialInterpretation.polarites.mediatrice}}
- Analyse des Tensions: {{initialInterpretation.tensions.tension1}} {{initialInterpretation.tensions.tension2}} {{initialInterpretation.tensions.tension3}}
- Analyse de la Résolution: {{initialInterpretation.resolution}}
- Synthèse: {{initialInterpretation.synthese}}

À partir de ces informations, fournis un approfondissement structuré en suivant le format de sortie JSON.
- **Conseil Stratégique**: Quel est LE conseil le plus important que tu donnerais pour naviguer cette dynamique ?
- **Levier de Changement**: Quelle est LA plus petite action qui pourrait avoir le plus grand impact pour changer la trajectoire du système ?
- **Point de Vigilance**: Quel est LE piège principal à éviter ou la plus grande illusion à déconstruire ?
- **Question Réflexive**: Pose UNE seule question ouverte et puissante qui pousse le consultant à une introspection plus profonde.
`,
});

// The Genkit Flow
const deepenRevelationFlow = ai.defineFlow(
  {
    name: 'deepenRevelationFlow',
    inputSchema: DeepenRevelationInputSchema,
    outputSchema: DeepenRevelationOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await deepenPrompt(input);
      if (!output) {
        throw new Error("L'approfondissement n'a pas pu être généré.");
      }
      return output;
    } catch (error) {
      console.error("Error in deepenRevelationFlow:", error);
      throw new Error("Une erreur est survenue lors de la communication avec l'oracle pour l'approfondissement.");
    }
  }
);
