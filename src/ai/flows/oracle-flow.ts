
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

const learningFlow = ai.defineFlow(
  {
    name: 'learningFlow',
    inputSchema: LearningInputSchema,
    outputSchema: LearningOutputSchema,
  },
  async (input) => {
    try {
      const stepIndex = input.history.length;
      let stepTopic = '';
      let stepContent = '';
      let isFinalStep = false;
      let systemPrompt = '';

      switch (stepIndex) {
          case 0:
              stepTopic = "la Signification Principale";
              stepContent = input.card.interpretations.general;
              break;
          case 1:
              stepTopic = "l'Aspect lumineux";
              stepContent = input.card.interpretations.endroit;
              break;
          case 2:
              stepTopic = "les Défis & Obstacles";
              stepContent = input.card.interpretations.ombre_et_defis;
              break;
          case 3:
              stepTopic = "le Conseil";
              stepContent = input.card.interpretations.conseil;
              break;
          case 4:
              stepTopic = "l'application dans le domaine de l'Amour";
              stepContent = input.card.domaines.amour;
              break;
          case 5:
              stepTopic = "l'application dans le domaine du Travail";
              stepContent = input.card.domaines.travail;
              break;
          case 6:
              stepTopic = "l'application dans le domaine des Finances";
              stepContent = input.card.domaines.finances;
              break;
          case 7:
              stepTopic = "l'application dans le domaine Spirituel";
              stepContent = input.card.domaines.spirituel;
              isFinalStep = true;
              break;
          default:
              throw new Error("Étape de leçon inconnue.");
      }

      systemPrompt = `Tu es un tuteur expert en cartomancie. Ta mission est de créer une étape de leçon interactive sur un sujet précis.

      Pour l'étape demandée, tu dois fournir :
      1.  Un 'paragraphe' de 2-3 phrases, qui est une reformulation pédagogique du concept. NE JAMAIS terminer par une question.
      2.  Un 'exercice' (QCM) créatif pour valider la compréhension du paragraphe.
          **Règle cruciale pour l'exercice :** Les options de réponse ne doivent pas être des définitions génériques. Elles doivent être des scénarios concrets de la vie quotidienne, avec des personnages nommés (ex: Julie, Michel) et des actions réalistes. Chaque option doit peindre une scène plausible.
          *   **Exemple de bonne option :** "Julie décide de confronter son père à un secret de famille qu’elle porte depuis l’adolescence."
          *   **Exemple de mauvaise option :** "La carte représente la fin d'un cycle."
      3.  'finDeLecon' doit être mis à ${isFinalStep}.
      
      Ta réponse doit TOUJOURS suivre le format JSON demandé.`;
      
      const userPrompt = `
        Le sujet de cette étape est **${stepTopic}** de la carte ${input.card.nom_carte}.
        Voici le contenu original à reformuler : "${stepContent}"
        
        Génère le paragraphe et un exercice QCM correspondants.
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
