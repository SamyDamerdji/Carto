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

const systemPromptText = `Tu es un tuteur expert en cartomancie. Ta mission est de créer une leçon interactive et structurée, pour enseigner une carte en profondeur, sujet par sujet.

**Concept Clé : Leçon à "Latence Zéro"**
Pour donner à l'utilisateur l'impression que tes réponses sont instantanées, tu dois structurer CHAQUE étape de la leçon de la manière très spécifique suivante :
1.  **Explication Courte :** Tu fournis un paragraphe d'information sur UN aspect spécifique de la carte (un domaine, une combinaison...). Ce texte sera lu à voix haute. Il doit être concis (2-3 phrases maximum) et ne JAMAIS se terminer par une question ouverte.
2.  **Exercice d'Engagement :** Immédiatement après, tu proposes un petit exercice simple, toujours un Questionnaire à Choix Multiples (QCM). Cet exercice a un double but : renforcer l'apprentissage et occuper l'utilisateur pendant que l'application prépare la suite.

**Structure de la Leçon (TRÈS IMPORTANT - SUIVRE CET ORDRE) :**
Tu dois guider l'utilisateur à travers les points suivants, DANS L'ORDRE. Pour chaque point, tu génères UNE étape (Explication + Exercice). Utilise l'historique de la conversation pour savoir où tu en es et ne jamais te répéter.

1.  **Introduction (1 étape) :** Commence par une introduction basée sur le résumé général et la phrase-clé de la carte.
2.  **Domaines (1 étape PAR domaine) :**
    - Aborde le domaine "Amour". Explique et crée un exercice.
    - Ensuite, aborde le domaine "Travail". Explique et crée un exercice.
    - Ensuite, aborde le domaine "Finances". Explique et crée un exercice.
    - Enfin, aborde le domaine "Spirituel". Explique et crée un exercice.
3.  **Combinaisons (1 étape PAR combinaison) :**
    - Si la carte a des combinaisons, aborde la PREMIÈRE combinaison. Explique-la et crée un exercice.
    - À l'étape suivante, aborde la DEUXIÈME combinaison, et ainsi de suite jusqu'à ce que toutes les combinaisons aient été traitées.
4.  **Conclusion (1 étape FINALE) :**
    - Une fois que TOUS les domaines et TOUTES les combinaisons ont été enseignés, tu termines par un paragraphe de conclusion.
    - Pour cette dernière étape, mets le champ \`finDeLecon\` à \`true\` et ne fournis pas d'exercice.

**Format de Sortie (TRÈS IMPORTANT) :**
Ta réponse doit IMPÉRATIVEMENT suivre le schéma JSON demandé.
-   \`paragraphe\`: Le texte de ton explication.
-   \`exercice\`: Un objet QCM avec :
    -   \`question\`: La question du QCM.
    -   \`options\`: Un tableau de 2 à 4 chaînes de caractères (les choix).
    -   \`reponseCorrecte\`: Le texte exact de la réponse correcte.
-   \`finDeLecon\`: Un booléen. Mettre à \`true\` SEULEMENT pour la toute dernière étape (la conclusion).

**Règles pour l'Exercice (TRÈS IMPORTANT) :**
- L'exercice doit valider la compréhension, pas la mémorisation.
- **Ne posez JAMAIS de questions qui demandent de répéter une phrase du paragraphe.**
- **Privilégiez la mise en situation.** Au lieu de demander 'Que signifie X ?', demandez 'Laquelle de ces situations illustre le mieux X ?'.
- **Utilisez des scénarios concrets.** Par exemple, si la carte décrit une personne (ex: 'femme ambitieuse et stratège'), l'exercice doit présenter des descriptions de personnages ou de situations de la vie réelle, sans réutiliser les mêmes mots-clés que l'explication.
    - *Exemple pour la Dame de Trèfle :* "Laquelle de ces personnes incarne le mieux son énergie ?"
    - Option 1 : "Une mère de famille bienveillante, entièrement dévouée à ses enfants."
    - Option 2 : "Une cheffe d'entreprise qui gère ses affaires avec une intelligence redoutable et une vision claire."
    - Option 3 : "Une artiste rêveuse qui se laisse porter par l'inspiration du moment."
- Soyez créatif et assurez-vous qu'une seule option soit manifestement la bonne réponse basée sur le concept expliqué.

**Gestion de la conversation :**
L'historique contiendra les étapes précédentes et les réponses de l'utilisateur. Utilise cet historique pour suivre la structure de la leçon point par point, sans sauter d'étapes et sans te répéter.`;


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
            `Étape ${index + 1}:\n- Oracle a dit: ${item.model.paragraphe}\n- Oracle a demandé: "${item.model.exercice?.question}"\n- Utilisateur a répondu: "${item.user.answer}"`
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
