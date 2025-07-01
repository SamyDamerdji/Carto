import { z } from 'zod';

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

export const CardSchema = z.object({
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
  prompts_visuels: z.array(z.string()).optional(),
  prompts_conversationnels: z.array(z.string()).optional(),
  combinaisons: z.array(CardCombinationSchema),
});


export const QCMExerciceSchema = z.object({
  type: z.literal('qcm'),
  question: z.string().describe("La question posée à l'utilisateur pour valider sa compréhension."),
  options: z.array(z.string()).min(2).max(4).describe("Un tableau de 2 à 4 chaînes de caractères pour les options de réponse."),
  reponseCorrecte: z.string().describe("Le texte exact de la réponse correcte parmi les options proposées."),
});

export const KeywordsExerciceSchema = z.object({
    type: z.literal('keywords'),
    question: z.string().describe("La question pour l'exercice sur les mots-clés."),
    all_keywords: z.array(z.string()).describe("Une liste de 6 à 8 mots-clés, incluant les corrects et des distracteurs plausibles."),
    correct_keywords: z.array(z.string()).describe("Le sous-ensemble de mots-clés qui sont corrects pour la carte."),
});

export const ExerciceSchema = z.union([QCMExerciceSchema, KeywordsExerciceSchema]);


export const CardSummarySchema = z.object({
    id: z.string(),
    nom_carte: z.string(),
    image_url: z.string(),
    couleur: z.enum(['Trèfle', 'Cœur', 'Carreau', 'Pique']),
});

export const LearningOutputSchema = z.object({
  paragraphe: z.string().describe("Le segment textuel de la leçon à lire à haute voix. Doit être court (2-3 phrases) et ne JAMAIS se terminer par une question ouverte."),
  exercice: ExerciceSchema.optional().describe("Un exercice simple (QCM ou sélection de mots-clés) pour engager l'utilisateur. Doit être omis uniquement si la leçon est terminée."),
  finDeLecon: z.boolean().describe("Mettre à true si c'est le dernier message de la leçon, auquel cas il n'y a pas d'exercice."),
  associatedCard: CardSummarySchema.optional().describe("Les détails de la carte associée pour cette étape de leçon, si applicable."),
});
export type LearningOutput = z.infer<typeof LearningOutputSchema>;

export const QcmModelOutputSchema = z.object({
    paragraphe: LearningOutputSchema.shape.paragraphe,
    exercice: QCMExerciceSchema.omit({ type: true }).optional(),
    finDeLecon: LearningOutputSchema.shape.finDeLecon,
});

export const KeywordsModelOutputSchema = z.object({
    paragraphe: LearningOutputSchema.shape.paragraphe,
    exercice: KeywordsExerciceSchema.omit({ type: true }),
    finDeLecon: LearningOutputSchema.shape.finDeLecon,
});

// Input Schema for the flow
export const LearningInputSchema = z.object({
  card: CardSchema.describe("The full data object for the card being taught."),
  historyLength: z.number().describe("The number of steps already completed in the lesson."),
});
export type LearningInput = z.infer<typeof LearningInputSchema>;
