'use server';
/**
 * @fileOverview A Genkit flow for interpreting a "Systemic Revelation" card spread.
 *
 * - interpretSystemicRevelation - A function that provides a systemic analysis of 7 cards.
 * - SystemicRevelationInput - The input type for the flow.
 * - SystemicRevelationOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { SystemicRevelationInputSchema, SystemicRevelationOutputSchema } from '@/ai/schemas/revelation-schemas';
import type { SystemicRevelationInput, SystemicRevelationOutput } from '@/ai/schemas/revelation-schemas';

// Re-export types for client-side usage
export type { SystemicRevelationInput, SystemicRevelationOutput };


// The exported function that the UI will call
export async function interpretSystemicRevelation(input: SystemicRevelationInput): Promise<SystemicRevelationOutput> {
  const flowResult = await systemicRevelationFlow(input);
  return flowResult;
}

// The Genkit Prompt
const interpretationPrompt = ai.definePrompt({
    name: 'systemicRevelationPrompt',
    model: 'googleai/gemini-2.0-flash',
    input: { schema: SystemicRevelationInputSchema },
    output: { schema: SystemicRevelationOutputSchema },
    prompt: `Tu es un analyste systémique expert, spécialisé dans la dynamique des relations humaines. Tu utilises un tirage de 7 cartes à jouer pour décrypter les rapports de force, les tensions et les issues probables d'une situation relationnelle ou collective complexe. Ton analyse est psychologique et stratégique, jamais divinatoire. Tu ne prédis pas l'avenir, tu éclaires le présent.

Voici le tirage "Révélation Systémique" :

- **Pôle Dominant (Carte 1)**: {{card1}}
- **Pôle Opposé (Carte 2)**: {{card2}}
- **Pôle Médiateur (Carte 3)**: {{card3}}
- **Tension 1 (Blessure latente, Carte 4)**: {{card4}}
- **Tension 2 (Pression externe, Carte 5)**: {{card5}}
- **Tension 3 (Impulsion interne, Carte 6)**: {{card6}}
- **Résolution (Tendance naturelle, Carte 7)**: {{card7}}

Fournis une analyse structurée en suivant le format de sortie JSON demandé.
- **Analyse des Polarités**: Décris comment les trois forces principales (cartes 1, 2, 3) interagissent. Quelle est la nature du pouvoir dominant ? Comment la résistance s'exprime-t-elle ? Le médiateur est-il un pont ou un facteur de chaos ?
- **Analyse des Tensions**: Explique comment les trois tensions (cartes 4, 5, 6) alimentent la dynamique globale. Quelle est la blessure qui n'est pas dite ? Quelle pression extérieure fragilise le système ? Quelle émotion interne met de l'huile sur le feu ?
- **Analyse de la Résolution**: Décris la trajectoire la plus probable du système si aucune action n'est entreprise. Comment les forces et tensions actuelles convergent-elles vers cette issue ?
- **Synthèse**: Fais une synthèse globale percutante. Mets en lumière les principaux leviers de changement et les schémas répétitifs à l'œuvre. Donne une perspective claire sur la dynamique globale.
`,
});

// The Genkit Flow
const systemicRevelationFlow = ai.defineFlow(
  {
    name: 'systemicRevelationFlow',
    inputSchema: SystemicRevelationInputSchema,
    outputSchema: SystemicRevelationOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await interpretationPrompt(input);
      if (!output) {
        throw new Error("L'analyse systémique n'a pas pu être générée.");
      }
      return output;
    } catch (error) {
        console.error("Error in systemicRevelationFlow:", error);
        throw new Error("Une erreur est survenue lors de la communication avec l'oracle pour l'interprétation.");
    }
  }
);
