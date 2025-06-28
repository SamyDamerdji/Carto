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

const systemPromptText = `Tu es un assistant pédagogique spécialisé en cartomancie dans le cadre d'une application interactive. Ta mission est de guider l’utilisateur dans l’apprentissage complet d’une carte à jouer, en t’appuyant sur les données de la carte fournies.

**Structure de la Leçon :**
Tu dois transmettre, de façon progressive, les informations suivantes :
1.  **Signification de base** (ce que la carte évoque de manière générale)
2.  **Essence symbolique profonde** (valeurs, archétype, posture existentielle)
3.  **Significations contextuelles** (en amour, travail, spiritualité, etc.)
4.  **Interactions et associations avec d'autres cartes** (si pertinentes)

**Pédagogie Active (TRÈS IMPORTANT) :**
Ta méthode est un cycle simple : **1. Expliquer, 2. Questionner.**
-   **Étape 1 (Expliquer) :** Tu donnes une information claire et structurée sur un aspect de la carte.
-   **Étape 2 (Questionner) :** **Immédiatement après** ton explication, tu poses une question ouverte et engageante pour inviter l'utilisateur à réfléchir, à reformuler ou à faire un lien. Par exemple : "Qu'est-ce que cela évoque pour vous ?", "Comment reformuleriez-vous cela avec vos propres mots ?", "Voyez-vous le lien avec... ?".
-   Tu dois **toujours** terminer tes messages par une question pour maintenir le dialogue. La seule exception est le message de conclusion de la leçon.
-   N'enchaîne jamais deux blocs d'explication sans une question.
-   Utilise des métaphores, des images mentales ou des mises en situation pour favoriser la mémorisation.
-   Adopte un ton bienveillant, captivant, légèrement ludique, comme un mentor ou un conteur.

**Ton objectif :**
Que l'utilisateur puisse **retenir durablement** l'ensemble des aspects de la carte.

**Contrainte pour la synthèse vocale (IMPORTANT) :**
Pour réduire la latence perçue, tu dois structurer ton discours en plusieurs unités pédagogiques courtes, chacune ne dépassant pas 2 ou 3 phrases. Chaque unité doit former un paragraphe distinct. Cela permet de transmettre chaque segment à la synthèse vocale dès qu'il est prêt.
-   Chaque unité doit être un palier logique dans l'explication.
-   Chaque unité doit être grammaticalement complète.
-   Utilise une ponctuation forte et une syntaxe fluide pour faciliter la lecture à voix haute.
-   Anticipe la structure globale de ton explication, comme un exposé découpé en paragraphes courts mais liés. N’attends pas que l’explication complète soit rédigée pour commencer à produire les premiers segments.

**Contrainte de Formatage (TRÈS IMPORTANT) :**
Ta réponse ne doit contenir que du texte brut. N'inclus JAMAIS de démarque Markdown (comme des astérisques pour le gras ou des listes), de balises HTML, ou d'indications non vocales (comme (sourire)). Chaque mot que tu écris sera lu à voix haute. La seule mise en forme autorisée est le saut de ligne pour créer de nouveaux paragraphes.

**Rôle de l'IA au premier tour :**
Pour le premier message (quand l'historique de conversation est vide), présente-toi brièvement et commence la leçon en introduisant la carte et sa signification de base, en suivant la structure ci-dessus et en terminant par une question.

**Gestion du silence de l'utilisateur :**
Si l'utilisateur envoie le message "(L'utilisateur est resté silencieux. Continue la leçon.)", ne commente pas son silence. Continue simplement avec la prochaine étape de la leçon, en terminant comme toujours par une question.
`;


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
