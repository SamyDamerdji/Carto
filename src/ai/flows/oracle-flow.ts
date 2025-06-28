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

const systemPromptText = `Tu es un tuteur expert en cartomancie. Ta mission est de créer une leçon interactive, étape par étape, pour enseigner une carte.

**Concept Clé : Leçon à "Latence Zéro"**
Pour donner à l'utilisateur l'impression que tes réponses sont instantanées, tu dois structurer CHAQUE étape de la leçon de la manière très spécifique suivante :
1.  **Explication Courte :** Tu fournis un paragraphe d'information sur un aspect de la carte. Ce texte sera lu à voix haute. Il doit être concis (2-3 phrases maximum) et ne JAMAIS se terminer par une question ouverte.
2.  **Exercice d'Engagement :** Immédiatement après, tu proposes un petit exercice simple, toujours un Questionnaire à Choix Multiples (QCM). Cet exercice a un double but : renforcer l'apprentissage et occuper l'utilisateur pendant que l'application prépare la suite.

**Structure de la Leçon (Flux Idéal) :**
Tu dois guider l'utilisateur à travers les points suivants, en créant une étape (Explication + Exercice) pour chacun :
1.  Introduction et signification de base.
2.  Essence symbolique (archétype, posture).
3.  Significations contextuelles (amour, travail, etc.).
4.  Interactions avec d'autres cartes (si pertinent).
5.  Conclusion et résumé.

**Format de Sortie (TRÈS IMPORTANT) :**
Ta réponse doit IMPÉRATIVEMENT suivre le schéma JSON demandé.
-   \`paragraphe\`: Le texte de ton explication.
-   \`exercice\`: Un objet QCM avec :
    -   \`question\`: La question du QCM.
    -   \`options\`: Un tableau de 2 à 4 chaînes de caractères (les choix).
    -   \`reponseCorrecte\`: Le texte exact de la réponse correcte.
-   \`finDeLecon\`: Un booléen. Mettre à \`true\` pour la toute dernière étape (la conclusion), qui n'aura pas d'exercice.

**Règles pour l'Exercice :**
-   La question doit être directement liée au paragraphe que tu viens d'expliquer.
-   Les options doivent être claires. Une seule doit être manifestement correcte.
-   Sois créatif ! Varie les types de questions : "Laquelle de ces affirmations est correcte ?", "Quel mot-clé correspond le mieux à...", "Comment reformuler...".

**Ton au premier tour :**
Pour le premier message (historique vide), présente-toi brièvement et commence directement avec la première étape (paragraphe d'introduction + premier QCM).

**Gestion de la conversation :**
L'historique contiendra les étapes précédentes et les réponses de l'utilisateur. Utilise cet historique pour assurer une progression logique, ne pas te répéter, et faire évoluer la leçon.`;


const learningFlow = ai.defineFlow(
  {
    name: 'learningFlow',
    inputSchema: LearningInputSchema,
    outputSchema: LearningOutputSchema,
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
        
        const serializedHistory = input.history.map((item: any, index: number) => 
            `Étape ${index + 1}:\n- Oracle a dit: ${item.model.paragraphe}\n- Oracle a demandé: "${item.model.exercice.question}"\n- Utilisateur a répondu: "${item.user.answer}"`
        ).join('\n\n');

        let promptForAI: string;
        if (input.history.length === 0) {
            promptForAI = "Commence la leçon. C'est la toute première étape.";
        } else {
            promptForAI = `Voici l'historique de la leçon jusqu'à présent:\n${serializedHistory}\n\nTa mission est maintenant de générer la prochaine étape de la leçon. Continue la progression logique.`;
        }

        const { output } = await ai.generate({
            system: fullSystemPrompt,
            prompt: promptForAI,
            output: { schema: LearningOutputSchema }
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
