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
import { getCardDetails, type Card } from '@/lib/data/cards';

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
  couleur: z.enum(['Trèfle', 'Cœur', 'Carreau', 'Pique']),
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


const QCMExerciceSchema = z.object({
  question: z.string().describe("La question posée à l'utilisateur pour valider sa compréhension."),
  options: z.array(z.string()).min(2).max(4).describe("Un tableau de 2 à 4 chaînes de caractères pour les options de réponse."),
  reponseCorrecte: z.string().describe("Le texte exact de la réponse correcte parmi les options proposées."),
});

const CardSummarySchema = z.object({
    id: z.string(),
    nom_carte: z.string(),
    image_url: z.string(),
    couleur: z.enum(['Trèfle', 'Cœur', 'Carreau', 'Pique']),
});

const LearningOutputSchema = z.object({
  paragraphe: z.string().describe("Le segment textuel de la leçon à lire à haute voix. Doit être court (2-3 phrases) et ne JAMAIS se terminer par une question ouverte."),
  exercice: QCMExerciceSchema.optional().describe("Un exercice simple (QCM) pour engager l'utilisateur. Doit être omis uniquement si la leçon est terminée."),
  finDeLecon: z.boolean().describe("Mettre à true si c'est le dernier message de la leçon, auquel cas il n'y a pas d'exercice."),
  associatedCard: CardSummarySchema.optional().describe("Les détails de la carte associée pour cette étape de leçon, si applicable."),
});
export type LearningOutput = z.infer<typeof LearningOutputSchema>;

const ModelOutputSchema = z.object({
    paragraphe: LearningOutputSchema.shape.paragraphe,
    exercice: LearningOutputSchema.shape.exercice,
    finDeLecon: LearningOutputSchema.shape.finDeLecon
});

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
      let systemPrompt = '';
      let userPrompt = '';
      let isFinalStep = false;

      const totalFixedSteps = 8;
      const totalCombinations = input.card.combinaisons?.length || 0;
      const totalSteps = totalFixedSteps + totalCombinations;

      if (stepIndex < totalFixedSteps) {
        // Handle the 8 fixed lesson steps
        let stepTopic = '';
        let stepContent = '';
        
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
                break;
            default:
                throw new Error("Étape de leçon fixe inconnue.");
        }
        
        isFinalStep = (stepIndex === totalSteps - 1);

        systemPrompt = `Tu es un tuteur expert en cartomancie. Ta mission est de créer une étape de leçon interactive sur un sujet précis.

        Pour l'étape demandée, tu dois fournir :
        1.  Un 'paragraphe' de 2-3 phrases, qui est une reformulation pédagogique du concept. NE JAMAIS terminer par une question.
        2.  Un 'exercice' (QCM) créatif pour valider la compréhension du paragraphe.
            **Règle cruciale pour l'exercice :** Les options de réponse ne doivent pas être des définitions génériques. Elles doivent être des scénarios concrets de la vie quotidienne, avec des personnages nommés (ex: Julie, Michel) et des actions réalistes. Chaque option doit peindre une scène plausible.
            *   **Exemple de bonne option :** "Julie décide de confronter son père à un secret de famille qu’elle porte depuis l’adolescence."
            *   **Exemple de mauvaise option :** "La carte représente la fin d'un cycle."
        3.  'finDeLecon' doit être mis à ${isFinalStep}.
        
        Ta réponse doit TOUJOURS suivre le format JSON demandé.`;
        
        userPrompt = `
          Le sujet de cette étape est **${stepTopic}** de la carte ${input.card.nom_carte}.
          Voici le contenu original à reformuler : "${stepContent}"
          
          Génère le paragraphe et un exercice QCM correspondants.
        `;

        const { output } = await ai.generate({
            model: 'googleai/gemini-2.0-flash',
            system: systemPrompt,
            prompt: userPrompt,
            output: { schema: ModelOutputSchema },
        });

        if (!output) {
            throw new Error("L'IA n'a pas pu générer la prochaine étape de la leçon.");
        }
        return output;

      } else {
        // Handle combination steps
        const combinationIndex = stepIndex - totalFixedSteps;
        if (combinationIndex >= totalCombinations) {
            throw new Error("Étape de combinaison invalide.");
        }

        const combination = input.card.combinaisons[combinationIndex];
        const associatedCard = getCardDetails(combination.carte_associee_id);

        if (!associatedCard) {
            // If card is not found, we skip this step by returning the previous output.
            // This is a graceful failure to avoid crashing the lesson.
            console.warn(`Carte associée introuvable : ${combination.carte_associee_id}, étape ignorée.`);
            const lastStepOutput = input.history[input.history.length - 1]?.model;
            if(lastStepOutput) {
              return { ...lastStepOutput, finDeLecon: true }; // End lesson if card is missing
            }
            throw new Error(`Carte associée introuvable : ${combination.carte_associee_id}`);
        }
        
        isFinalStep = (stepIndex === totalSteps - 1);

        systemPrompt = `Tu es un tuteur expert en cartomancie. Ta mission est d'enseigner la signification d'une association de deux cartes de manière pédagogique.

        Suis ces étapes dans ta réponse :
        1.  **Rappel des Forces :** Dans ton 'paragraphe', rappelle brièvement l'énergie principale de chaque carte.
        2.  **Piste de Réflexion :** Continue le paragraphe en posant une question rhétorique qui guide l'utilisateur vers la signification de l'alliance.
        3.  **Exercice :** Crée un exercice QCM. La question doit demander ce que l'alliance révèle. L'option correcte doit être un scénario concret qui illustre la signification de la combinaison. Les autres options doivent être des scénarios distracteurs plausibles mais incorrects.
        4.  **Fin de Leçon :** 'finDeLecon' doit être mis à ${isFinalStep}.

        Ta réponse doit TOUJOURS suivre le format JSON demandé. NE JAMAIS donner la réponse directement dans le paragraphe.`;
        
        userPrompt = `
          Le sujet est l'association entre la carte **${input.card.nom_carte}** et la carte **${associatedCard.nom_carte}**.
    
          - Énergie principale de ${input.card.nom_carte}: "${input.card.resume_general}"
          - Énergie principale de ${associatedCard.nom_carte}: "${associatedCard.resume_general}"
          - Signification correcte de leur combinaison: "${combination.signification}"
    
          Génère le paragraphe et un exercice QCM correspondants, en suivant les 4 étapes.
        `;
      
      const { output } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        system: systemPrompt,
        prompt: userPrompt,
        output: { schema: ModelOutputSchema },
      });

      if (!output) {
        throw new Error("L'IA n'a pas pu générer la prochaine étape de la leçon.");
      }

      return {
        ...output,
        associatedCard: {
            id: associatedCard.id,
            nom_carte: associatedCard.nom_carte,
            image_url: associatedCard.image_url,
            couleur: associatedCard.couleur,
        }
      };
    }

    } catch (error) {
      console.error("Error in learningFlow:", error);
      throw new Error("Désolé, une erreur technique m'empêche de répondre. Veuillez réessayer plus tard.");
    }
  }
);
