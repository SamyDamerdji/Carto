
import { z } from 'zod';

export const CardCombinationSchema = z.object({
  carte_associee_id: z.string(),
  signification: z.string(),
  scenarios_associes: z.array(z.string()).optional(),
  tonalite: z.string().optional(),
});

export const StructuredInterpretationSchema = z.object({
    texte: z.string(),
    ton: z.string(),
    perspective: z.string(),
});

export const CardInterpretationsSchema = z.object({
  general: StructuredInterpretationSchema,
  endroit: StructuredInterpretationSchema,
  ombre_et_defis: StructuredInterpretationSchema,
  conseil: StructuredInterpretationSchema,
});

export const StructuredDomainSchema = z.object({
    texte: z.string(),
    situation_type: z.string(),
    scenarios_associes: z.array(z.string()),
});

export const CardDomainsSchema = z.object({
  amour: StructuredDomainSchema,
  travail: StructuredDomainSchema,
  finances: StructuredDomainSchema,
  spirituel: StructuredDomainSchema,
});

export const CardSchema = z.object({
  id: z.string(),
  nom_carte: z.string(),
  valeur: z.union([z.number(), z.string()]),
  couleur: z.enum(['Trèfle', 'Cœur', 'Carreau', 'Pique']),
  image_url: z.string(),
  symbolique_image: z.string().optional(),
  narration_base: z.object({
    texte: z.string(),
    ton: z.string(),
    perspective: z.string(),
  }).optional(),
  phrase_cle: z.object({ 
    texte: z.string(), 
    usage: z.string() 
  }),
  mots_cles: z.object({
    positifs: z.array(z.string()),
    negatifs: z.array(z.string()),
    neutres: z.array(z.string()),
    priorite: z.array(z.string()).optional(),
  }),
  interpretations: CardInterpretationsSchema,
  domaines: CardDomainsSchema,
  prompts_visuels: z.array(z.object({
      scene: z.string(),
      symbolique: z.string(),
      usage: z.string(),
  })).optional(),
  modules_interactifs: z.array(z.object({
    id_module: z.string(),
    etapes: z.array(z.object({
      type: z.string(),
      contenu: z.string(),
      ton: z.string(),
      reponse_attendue: z.string(),
    })),
  })).optional(),
  combinaisons: z.array(CardCombinationSchema).optional(),
});


// --- Schémas pour les leçons (inchangés pour l'instant) ---

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

// === SCHEMAS FOR INTERACTIVE LESSONS (MODULE 1) ===

// From image-generation-flow.ts
export const GenerateImageInputSchema = z.string().describe('A descriptive prompt for the image to be generated.');
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The generated image as a data URI.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

// From tts-flow.ts
export const TtsOutputSchema = z.object({
  media: z.string().describe("The generated audio as a data URI."),
});
export type TtsOutput = z.infer<typeof TtsOutputSchema>;

// From oracle-flow.ts
export const ImmersionScriptOutputSchema = z.object({
  script: z.string().describe("The full narrative script for the mentor, combining introduction, symbolic visualization, and the key phrase. It should be warm, engaging, and guide the user to feel the card's essence."),
  imagePrompt: z.string().describe("A concise, evocative prompt for an image generation model, based on the card's symbolism. Example: 'An ancient, ornate key unlocking a glowing heart-shaped lock, mystical atmosphere.'")
});
export type ImmersionScriptOutput = z.infer<typeof ImmersionScriptOutputSchema>;

// From lesson-orchestrator.ts
export const LessonStepInputSchema = z.object({
  cardId: z.string(),
  step: z.number().int().min(0),
});
export type LessonStepInput = z.infer<typeof LessonStepInputSchema>;

export const LessonStepOutputSchema = z.object({
  script: z.string(),
  audioUrl: TtsOutputSchema.shape.media,
  imageUrl: GenerateImageOutputSchema.shape.imageUrl.optional(),
  isLastStep: z.boolean(),
});
export type LessonStepOutput = z.infer<typeof LessonStepOutputSchema>;
