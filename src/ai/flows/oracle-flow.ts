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

Voici l'ordre PÉDAGOGIQUE OBLIGATOIRE de la leçon, basé sur le nombre d'étapes déjà présentes dans l'historique :
1.  **Étape 1 (historique vide)** : Reformule la **Signification Principale**.
2.  **Étape 2 (1 élément dans l'historique)** : Reformule l'**Aspect lumineux**.
3.  **Étape 3 (2 éléments dans l'historique)** : Reformule les **Défis & Obstacles**.
4.  **Étape 4 (3 éléments dans l'historique)** : Reformule le **Conseil**.
5.  **Étape 5 (4 éléments dans l'historique)** : Reformule l'application dans le domaine de l'**Amour**.
6.  **Étape 6 (5 éléments dans l'historique)** : Reformule l'application dans le domaine du **Travail**.
7.  **Étape 7 (6 éléments dans l'historique)** : Reformule l'application dans le domaine des **Finances**.
8.  **Étape 8 (7 éléments dans l'historique)** : Reformule l'application dans le domaine **Spirituel**. C'est la dernière étape, tu dois donc mettre 'finDeLecon' à 'true'.

Pour chaque étape, tu dois fournir :
1.  Un 'paragraphe' de 2-3 phrases, qui est une reformulation pédagogique du concept de l'étape. NE JAMAIS terminer par une question.
2.  Un 'exercice' (QCM) créatif pour valider la compréhension du paragraphe.
3.  'finDeLecon' doit être 'false', sauf pour la toute dernière étape (l'étape 8).

Analyse l'historique pour savoir à quelle étape tu te trouves et suis l'ordre à la lettre.`;


const learningFlow = ai.defineFlow(
  {
    name: 'learningFlow',
    inputSchema: LearningInputSchema,
    outputSchema: LearningOutputSchema,
  },
  async (input) => {
    try {
      const cardDataString = `
        DONNÉES COMPLETES DE LA CARTE À ENSEIGNER:
        Nom: ${input.card.nom_carte}
        Signification Principale: ${input.card.interpretations.general}
        Aspect lumineux: ${input.card.interpretations.endroit}
        Défis & Obstacles: ${input.card.interpretations.ombre_et_defis}
        Conseil: ${input.card.interpretations.conseil}
        Application Amour: ${input.card.domaines.amour}
        Application Travail: ${input.card.domaines.travail}
        Application Finances: ${input.card.domaines.finances}
        Application Spirituel: ${input.card.domaines.spirituel}
      `;

      const historyString = `L'historique contient ${input.history.length} étape(s) terminée(s).`;

      const userPrompt = `
        Voici les données de la carte :
        ${cardDataString}
        ---
        ${historyString}
        ---
        Génère la prochaine étape.
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
