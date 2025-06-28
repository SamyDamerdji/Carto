'use server';
/**
 * @fileOverview A Genkit flow that acts as a pedagogical assistant for learning cartomancy.
 *
 * - chatWithOracle - A function that allows a user to have a guided lesson about a card.
 * - LearningInput - The input type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Card } from '@/lib/data/cards';
import type { MessageData } from 'genkit';

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

const MessageSchema = z.object({
  role: z.enum(['user', 'oracle']), // Role from the UI
  content: z.string(),
});

// Input Schema for the flow
const LearningInputSchema = z.object({
  card: CardSchema.describe("The full data object for the card being taught."),
  history: z.array(MessageSchema).describe("The history of the conversation so far."),
});
export type LearningInput = z.infer<typeof LearningInputSchema>;

// The exported function that the UI will call
export async function chatWithOracle(input: LearningInput): Promise<string> {
    const flowResult = await learningFlow(input);
    return flowResult;
}

const systemPromptText = `Tu es un assistant pédagogique spécialisé en cartomancie. Ta mission est de guider l’utilisateur dans l’apprentissage d’une carte à jouer en t’appuyant sur les données de la carte fournies ci-dessous.

Ton rôle est de transmettre les informations de façon claire, engageante et progressive. Tu dois suivre une pédagogie active :
1.  Commence toujours par donner une information claire et structurée avant de poser une question. Ne commence jamais par une question.
2.  Pour le premier message (quand l'historique de conversation est vide), présente-toi brièvement et commence la leçon en introduisant la carte et sa signification de base.
3.  Utilise des métaphores ou des exemples pour aider à la mémorisation.
4.  Laisse l'utilisateur répondre et réfléchir.
5.  Adopte un ton bienveillant et captivant.

Ton objectif est que l'utilisateur retienne durablement les aspects de la carte. Tu ne gères pas l'interface, concentre-toi sur le contenu pédagogique.`;


// The Genkit Flow
const learningFlow = ai.defineFlow(
  {
    name: 'learningFlow',
    inputSchema: LearningInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
        const cardDataForPrompt = `
---
DONNÉES DE RÉFÉRENCE POUR LA CARTE :
Nom: ${input.card.nom_carte}
Résumé: ${input.card.resume_general}
Phrase-clé: ${input.card.phrase_cle}
Mots-clés: ${input.card.mots_cles.join(', ')}
Interprétations:
  - Générale: ${input.card.interpretations.general}
  - Aspect Lumineux: ${input.card.interpretations.endroit}
  - Défis & Obstacles: ${input.card.interpretations.ombre_et_defis}
  - Conseil: ${input.card.interpretations.conseil}
Domaines:
  - Amour: ${input.card.domaines.amour}
  - Travail: ${input.card.domaines.travail}
  - Finances: ${input.card.domaines.finances}
  - Spirituel: ${input.card.domaines.spirituel}
Combinaisons:
  ${input.card.combinaisons.map(c => `- Avec ${c.carte_associee_id}: ${c.signification}`).join('\n')}
---
        `;
        
        const fullSystemPrompt = systemPromptText + '\n\n' + cardDataForPrompt;

        const conversationHistory: MessageData[] = input.history.map((msg) => ({
          role: msg.role === 'oracle' ? 'model' : 'user',
          content: [{ text: msg.content }],
        }));

      const result = await ai.generate({
          system: fullSystemPrompt,
          // The prompt must not be an empty array.
          // If history is empty, the system prompt instructs the AI how to start.
          // We just need to give it a prompt to kick it off.
          prompt: conversationHistory.length > 0 ? conversationHistory : "Bonjour, commence la leçon.",
      });

      return result.text ?? "Désolé, une interférence cosmique perturbe ma vision. L'assistant reste silencieux pour l'instant.";
    } catch (error) {
      console.error("Error in learningFlow:", error);
      return "Désolé, une erreur technique m'empêche de répondre. Veuillez réessayer plus tard.";
    }
  }
);
