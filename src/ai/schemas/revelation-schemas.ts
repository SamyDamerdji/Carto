import { z } from 'zod';

// Input Schema for systemic-revelation-flow
export const SystemicRevelationInputSchema = z.object({
  card1: z.string().describe('Carte 1: Polarité dominante – La figure ou l’énergie la plus influente du système.'),
  card2: z.string().describe('Carte 2: Polarité opposée – Le contre-pouvoir ou la résistance active.'),
  card3: z.string().describe('Carte 3: Figure médiatrice ou instable – L’élément perturbateur ou stabilisateur.'),
  card4: z.string().describe('Carte 4: Tension n°1 – Source de conflit latente ou blessure non verbalisée.'),
  card5: z.string().describe('Carte 5: Tension n°2 – Élément extérieur perturbateur (pression sociale, peur).'),
  card6: z.string().describe('Carte 6: Tension n°3 – Impulsion interne ou émotionnellement chargée.'),
  card7: z.string().describe('Carte 7: Résolution systémique – La tendance naturelle du système si rien ne change.'),
});
export type SystemicRevelationInput = z.infer<typeof SystemicRevelationInputSchema>;

// Output Schema for systemic-revelation-flow
export const SystemicRevelationOutputSchema = z.object({
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
