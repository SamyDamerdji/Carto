'use server';
/**
 * @fileOverview A Genkit flow that acts as a pedagogical assistant for learning cartomancy.
 *
 * - chatWithOracle - A function that allows a user to have a guided lesson about a card.
 * - LearningInput - The input type for the function.
 * - LearningOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Card } from '@/lib/data/cards';

// Zod Schemas for Card data structure
const CardCombinationSchema = z.object({
  carte_associee_id: z.string(),
  signification: z.string(),
});

const CardInterpretationsSchema = z.object({
  general: z.string(),
  endroit: z.string(),
  ombre_et_defis: z.string(),
  conseil: z.string(),
});

const CardDomainsSchema = z.object({
  amour: z.string(),
  travail: z.string(),
  finances: z.string(),
  spirituel: z.string(),
});

const CardSchema = z.object({
  id: z.string(),
  nom_carte: z.string(),
  valeur: z.number(),
  couleur: z.enum(['Trèfle', 'Coeur', 'Carreau', 'Pique']),
  image_url: z.string(),
  resume_general: z.string(),
  phrase_cle: z.string(),
  mots_cles: z.array(z.string()),
  interpretations: CardInterpretationsSchema,
  domaines: CardDomainsSchema,
  prompts_visuels: z.array(z.string()),
  prompts_conversationnels: z.array(z.string()),
  combinaisons: z.array(CardCombinationSchema),
});


// New Output Schema
const QCMExerciceSchema = z.object({
  question: z.string().describe("La question posée à l'utilisateur pour valider sa compréhension."),
  options: z.array(z.string()).min(2).max(4).describe("Un tableau de 2 à 4 chaînes de caractères pour les options de réponse."),
  reponseCorrecte: z.string().describe("Le texte exact de la réponse correcte parmi les options proposées."),
});

const LearningOutputSchema = z.object({
  paragraphe: z.string().describe("Le segment textuel de la leçon à lire à haute voix. Doit être court (2-3 phrases) et ne JAMAIS se terminer par une question ouverte."),
  exercice: QCMExerciceSchema.optional().describe("Un exercice simple (QCM) pour engager l'utilisateur. Doit être omis uniquement si la leçon est terminée."),
  finDeLecon: z.boolean().describe("Mettre à true si c'est le dernier message de la leçon, auquel cas il n'y a pas d'exercice."),
});
export type LearningOutput = z.infer<typeof LearningOutputSchema>;

// Input Schema for the flow
const LearningInputSchema = z.object({
  card: CardSchema.describe("The full data object for the card being taught."),
  history: z.array(z.any()).describe("The history of the conversation so far, containing previous steps and user answers."),
});
export type LearningInput = z.infer<typeof LearningInputSchema>;


// The exported function that the UI will call
export async function chatWithOracle(input: LearningInput): Promise<LearningOutput> {
    const flowResult = await learningFlow(input);
    return flowResult;
}

const systemPrompt = `Tu es un tuteur expert en cartomancie. Ta mission est de créer une leçon interactive et structurée pour enseigner une carte.
Ta réponse doit TOUJOURS suivre le format JSON demandé.

Pour la **première étape de la leçon** (quand l'historique est vide), ton premier paragraphe doit expliquer la signification principale de la carte (le champ 'Interprétation').

Pour les étapes suivantes, base-toi sur l'historique pour aborder un nouvel aspect de la carte sans te répéter.

Chaque réponse doit contenir :
1.  Un 'paragraphe' de 2-3 phrases. NE JAMAIS terminer par une question.
2.  Un 'exercice' (QCM) créatif pour valider la compréhension.

Quand tu juges que la leçon est complète, mets 'finDeLecon' à 'true'.`;


const learningFlow = ai.defineFlow(
  {
    name: 'learningFlow',
    inputSchema: LearningInputSchema,
    outputSchema: LearningOutputSchema,
  },
  async (input) => {
    try {
      const cardDataString = `
        DONNÉES DE LA CARTE:
        Nom: ${input.card.nom_carte}
        Résumé: ${input.card.resume_general}
        Phrase-clé: ${input.card.phrase_cle}
        Mots-clés: ${input.card.mots_cles.join(', ')}
        Interprétation: ${input.card.interpretations.general}
        Aspect lumineux: ${input.card.interpretations.endroit}
        Défis: ${input.card.interpretations.ombre_et_defis}
        Conseil: ${input.card.interpretations.conseil}
      `;

      const historyString = input.history.length > 0
        ? 'HISTORIQUE DES SUJETS DÉJÀ ABORDÉS:\n' + input.history.map((step: any) => `- ${step.model.paragraphe}`).join('\n')
        : "C'est la première étape de la leçon.";

      const userPrompt = `
        ${cardDataString}
        ---
        ${historyString}
        ---
        INSTRUCTION: Génère la prochaine étape de la leçon.
      `;
      
      const { output } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        system: systemPrompt,
        prompt: userPrompt,
        output: { schema: LearningOutputSchema },
      });

      if (!output) {
        throw new Error("L'IA n'a pas pu générer la prochaine étape de la leçon.");
      }
      return output;

    } catch (error) {
      console.error("Error in learningFlow:", error);
      throw new Error("Désolé, une erreur technique m'empêche de répondre. Veuillez réessayer plus tard.");
    }
  }
);
