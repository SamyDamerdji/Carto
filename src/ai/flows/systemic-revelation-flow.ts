'use server';
/**
 * @fileOverview A Genkit flow for interpreting a "Systemic Revelation" card spread.
 *
 * - interpretSystemicRevelation - A function that provides a systemic analysis of 7 cards.
 * - SystemicRevelationInput - The input type for the flow.
 * - SystemicRevelationOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input Schema
const SystemicRevelationInputSchema = z.object({
  card1: z.string().describe('Carte 1: Polarité dominante – La figure ou l’énergie la plus influente du système.'),
  card2: z.string().describe('Carte 2: Polarité opposée – Le contre-pouvoir ou la résistance active.'),
  card3: z.string().describe('Carte 3: Figure médiatrice ou instable – L’élément perturbateur ou stabilisateur.'),
  card4: z.string().describe('Carte 4: Tension n°1 – Source de conflit latente ou blessure non verbalisée.'),
  card5: z.string().describe('Carte 5: Tension n°2 – Élément extérieur perturbateur (pression sociale, peur).'),
  card6: z.string().describe('Carte 6: Tension n°3 – Impulsion interne ou émotionnellement chargée.'),
  card7: z.string().describe('Carte 7: Résolution systémique – La tendance naturelle du système si rien ne change.'),
});
export type SystemicRevelationInput = z.infer<typeof SystemicRevelationInputSchema>;

// Output Schema
const SystemicRevelationOutputSchema = z.object({
  polarites: z.object({
    dominante: z.string().describe("Analyse de la polarité dominante (Carte 1) et de son rôle dans le système."),
    opposee: z.string().describe("Analyse de la polarité opposée (Carte 2) et de sa dynamique de contre-pouvoir."),
    mediatrice: z.string().describe("Analyse du rôle de la figure médiatrice (Carte 3), qu'elle soit stabilisatrice ou perturbatrice."),
  }),
  tensions: z.object({
    tension1: z.string().describe("Analyse de la première tension (Carte 4), la blessure ou le conflit latent."),
    tension2: z.string().describe("Analyse de la deuxième tension (Carte 5), l'influence perturbatrice externe."),
    tension3: z.string().describe("Analyse de la troisième tension (Carte 6), l'impulsion émotionnelle interne."),
  }),
  resolution: z.string().describe("Analyse de la résolution systémique (Carte 7), l'issue probable si le système reste inchangé."),
  synthese: z.string().describe("Synthèse globale de la dynamique du système, mettant en lumière les principaux rapports de force et les leviers de changement possibles."),
});
export type SystemicRevelationOutput = z.infer<typeof SystemicRevelationOutputSchema>;

// The exported function that the UI will call
export async function interpretSystemicRevelation(input: SystemicRevelationInput): Promise<SystemicRevelationOutput> {
  const flowResult = await systemicRevelationFlow(input);
  return flowResult;
}

// The Genkit Prompt
const interpretationPrompt = ai.definePrompt({
    name: 'systemicRevelationPrompt',
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
    const { output } = await interpretationPrompt(input);
    if (!output) {
      throw new Error("L'analyse systémique n'a pas pu être générée.");
    }
    return output;
  }
);
