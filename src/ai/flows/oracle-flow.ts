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

const systemPromptText = `Tu es un tuteur expert en cartomancie. Ta mission est de créer une leçon interactive et structurée pour enseigner une carte.
Pour donner l'impression que tes réponses sont instantanées, tu dois structurer CHAQUE réponse de la manière suivante :
1.  **Explication Courte :** Tu fournis un paragraphe d'information sur un aspect intéressant de la carte. Ce texte sera lu à voix haute. Il doit être concis (2-3 phrases maximum) et ne JAMAIS se terminer par une question ouverte.
2.  **Exercice d'Engagement :** Immédiatement après, tu proposes un petit exercice simple, toujours un Questionnaire à Choix Multiples (QCM), pour valider la compréhension.

**Règles pour l'Exercice (TRÈS IMPORTANT) :**
- L'exercice doit valider la compréhension par la mise en situation, pas la mémorisation.
- **Ne posez JAMAIS de questions qui demandent de répéter une phrase du paragraphe.**
- **Privilégiez la mise en situation.** Au lieu de demander 'Que signifie X ?', demandez 'Laquelle de ces situations illustre le mieux X ?'.
- **Utilisez des scénarios concrets.** Par exemple, si la carte décrit une personne (ex: 'femme ambitieuse et stratège'), l'exercice doit présenter des descriptions de personnages ou de situations de la vie réelle, sans réutiliser les mêmes mots-clés que l'explication.
    - *Exemple pour la Dame de Trèfle :* "Laquelle de ces personnes incarne le mieux son énergie ?"
    - Option 1 : "Une mère de famille bienveillante, entièrement dévouée à ses enfants."
    - Option 2 : "Une cheffe d'entreprise qui gère ses affaires avec une intelligence redoutable et une vision claire."
    - Option 3 : "Une artiste rêveuse qui se laisse porter par l'inspiration du moment."
- Soyez créatif et assurez-vous qu'une seule option soit manifestement la bonne réponse basée sur le concept expliqué.

**Gestion de la conversation :**
L'historique contiendra les étapes précédentes. Utilise-le pour ne pas te répéter et pour faire avancer la leçon de manière logique, en abordant un nouvel aspect de la carte à chaque fois. Termine la leçon quand tu juges que les aspects principaux ont été couverts, en mettant \`finDeLecon\` à \`true\`.
---
DONNÉES DE RÉFÉRENCE POUR LA CARTE :
Nom: {{card.nom_carte}}
Résumé: {{card.resume_general}}
Phrase-clé: {{card.phrase_cle}}
Mots-clés: {{#each card.mots_cles}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
Interprétations:
  - Générale: {{card.interpretations.general}}
  - Aspect Lumineux: {{card.interpretations.endroit}}
  - Défis & Obstacles: {{card.interpretations.ombre_et_defis}}
  - Conseil: {{card.interpretations.conseil}}
Domaines:
  - Amour: {{card.domaines.amour}}
  - Travail: {{card.domaines.travail}}
  - Finances: {{card.domaines.finances}}
  - Spirituel: {{card.domaines.spirituel}}
Combinaisons:
{{#if card.combinaisons}}
  {{#each card.combinaisons}}- Avec {{this.carte_associee_id}}: {{this.signification}}
  {{/each}}
{{else}}
  Aucune combinaison spécifique fournie.
{{/if}}
---`;

// Internal schema for the prompt object
const PromptInputSchema = z.object({
  card: CardSchema,
  userPrompt: z.string(),
});

// Define the prompt object for better structure and stability
const learningPrompt = ai.definePrompt({
  name: 'learningPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: { schema: PromptInputSchema },
  output: { schema: LearningOutputSchema },
  system: systemPromptText,
  prompt: `{{{userPrompt}}}`,
});

const learningFlow = ai.defineFlow(
  {
    name: 'learningFlow',
    inputSchema: LearningInputSchema,
    outputSchema: LearningOutputSchema,
  },
  async (input) => {
    try {
        const serializedHistory = input.history.map((item: any) => 
            `- Oracle a dit: ${item.model.paragraphe}`
        ).join('\n');

        let userPrompt: string;
        if (input.history.length === 0) {
            userPrompt = "Commence la leçon. C'est la toute première étape.";
        } else {
            userPrompt = `Voici l'historique de la leçon jusqu'à présent:\n${serializedHistory}\n\nTa mission est maintenant de générer la prochaine étape de la leçon. Aborde un nouvel aspect de la carte.`;
        }
        
        const { output } = await learningPrompt({
            card: input.card,
            userPrompt: userPrompt,
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
