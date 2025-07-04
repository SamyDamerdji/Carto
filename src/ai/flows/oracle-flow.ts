'use server';
/**
 * @fileOverview This flow generates the narrative script for the first module of an interactive lesson.
 * This module focuses on immersion and emotional connection with the card.
 */
import { ai } from '@/ai/genkit';
import { CardSchema, ImmersionScriptOutputSchema, type ImmersionScriptOutput } from '@/ai/schemas/lesson-schemas';
import type { Card } from '@/lib/data/cards';

// This is the input type for the flow, re-exporting for clarity
export type ImmersionScriptInput = Card;


export async function getImmersionScript(input: ImmersionScriptInput): Promise<ImmersionScriptOutput> {
  return await immersionScriptFlow(input);
}

const immersionScriptPrompt = ai.definePrompt({
  name: 'immersionScriptPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: { schema: CardSchema },
  output: { schema: ImmersionScriptOutputSchema },
  prompt: `Tu es un mentor-conteur pour une application d'apprentissage de la cartomancie, "L'Oracle Royal". Ton ton est chaleureux, bienveillant et pédagogue.
Ta mission est de créer le script pour le premier module d'une leçon interactive : "Immersion & Connexion Émotionnelle". Ce module n'est PAS une évaluation.

**Objectif :** Immerger l'utilisateur dans l'ambiance de la carte, créer une connexion émotionnelle, et ancrer sa phrase-clé.

**Données de la carte :**
- Nom de la carte : {{nom_carte}}
- Narration de base : {{{narration_base.texte}}}
- Symbolique de l'image : {{{symbolique_image}}}
- Phrase-clé : {{{phrase_cle.texte}}}

**Structure du script :**
1.  **Introduction (courte) :** Commence par nommer la carte et introduire son thème général. Par exemple : "Accueillons maintenant le {{nom_carte}}. C'est une carte qui nous parle de..."
2.  **Visualisation guidée :** En te basant sur la 'symbolique_image' et la 'narration_base', crée un petit récit symbolique. Invite l'utilisateur à fermer les yeux, à imaginer la scène, à ressentir les émotions. Utilise des phrases comme "Imagine...", "Ressens...", "Visualise...". Sois descriptif et évocateur.
3.  **Clôture :** Termine ton script en intégrant NATURELLEMENT la 'phrase_cle' comme une conclusion, un sceau mémoriel. Ajoute ensuite une phrase de transition douce, comme "Prends un instant pour laisser cette image infuser. Quand tu seras prêt, nous continuerons."

**Important :**
- Ne parle JAMAIS comme si tu étais la carte ("Je suis le..."). Tu es un guide qui parle DE la carte.
- Combine et reformule les données fournies pour créer un discours fluide et captivant.

**Génération d'Image :**
- Propose un prompt CONCIS et POÉTIQUE pour une IA générative d'images, qui capture l'essence de la 'symbolique_image'. Ce prompt doit créer une illustration complémentaire, pas une copie de la carte. Style: "digital painting, fantasy, mystical, high detail".

Génère maintenant la sortie JSON pour le script et le prompt d'image.`,
});

const immersionScriptFlow = ai.defineFlow(
  {
    name: 'immersionScriptFlow',
    inputSchema: CardSchema,
    outputSchema: ImmersionScriptOutputSchema,
  },
  async (input) => {
    const { output } = await immersionScriptPrompt(input);
    if (!output) {
      throw new Error("Le script d'immersion n'a pas pu être généré.");
    }
    return output;
  }
);
