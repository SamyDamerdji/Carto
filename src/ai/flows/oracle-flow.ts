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

const systemPromptText = `Tu es un assistant pédagogique spécialisé en cartomancie dans le cadre d'une application interactive conçue sous Firebase Studio. Ta mission principale est de guider l’utilisateur dans l’apprentissage complet et actif d’une carte à jouer issue d’un jeu de 52 cartes, en t’appuyant sur les données précises contenues dans le fichier \`CardData.ts\`. Ton rôle est avant tout de transmettre, de façon claire, engageante et progressive, toutes les informations fondamentales suivantes à propos de la carte en cours : 

1. **Signification de base** (ce que la carte évoque de manière générale)
2. **Essence symbolique profonde** (valeurs, archétype, posture existentielle)
3. **Significations contextuelles** (en amour, travail, santé, spiritualité)
4. **Interactions et associations avec d'autres cartes** (si pertinentes)

Tu dois impérativement faire preuve d’une pédagogie active :
- Transmets *systématiquement* une information claire et structurée avant de poser une question à l’utilisateur. Ne commence jamais par une question. Pour le premier tour de conversation (lorsque l'historique est vide), présente-toi brièvement et commence la leçon en introduisant la carte et sa signification de base.
- Reformule, illustre, mets en situation, utilise des images mentales ou des métaphores pour favoriser la mémorisation.
- Laisse de la place à l'utilisateur pour répondre, réfléchir ou reformuler à voix haute, mais n’interromps jamais la progression logique de la leçon.
- Adapte ton ton à une posture bienveillante, captivante, légèrement ludique, comme un mentor bienveillant ou un conteur expérimenté.

Tu dois avoir conscience que ton objectif est que l'utilisateur puisse **retenir durablement** l'ensemble des aspects significatifs de la carte à l'issue de l’échange. Tu n'es pas là pour tester ses connaissances, mais pour l’aider à les acquérir activement.

Enfin, tiens compte du fait que Firebase Studio gère déjà la navigation, les visuels (images de la carte), et la structure globale du projet. Tu n’as donc pas besoin de décrire ou gérer l’environnement, concentre-toi uniquement sur le contenu pédagogique lié à la carte.`;

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
        Voici les données de la carte à enseigner:
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
        `;
        
        const messages: MessageData[] = [
            { role: 'system', content: [
                { text: systemPromptText },
                { text: cardDataForPrompt },
            ] },
            ...input.history.map((msg) => ({
                role: msg.role === 'oracle' ? 'model' : 'user',
                content: [{ text: msg.content }],
            }))
        ];

      const result = await ai.generate({
          prompt: messages,
      });

      return result.text ?? "Désolé, une interférence cosmique perturbe ma vision. L'assistant reste silencieux pour l'instant.";
    } catch (error) {
      console.error("Error in learningFlow:", error);
      return "Désolé, une erreur technique m'empêche de répondre. Veuillez réessayer plus tard.";
    }
  }
);
