
'use server';
/**
 * @fileOverview A Genkit flow that orchestrates the creation of an interactive lesson step.
 * It generates the lesson content and its corresponding audio.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { getCardDetails } from '@/lib/data/cards';
import { 
    LearningInputSchema, 
    LearningOutputSchema, 
    QcmModelOutputSchema, 
    KeywordsModelOutputSchema,
    type LearningInput,
    type LearningOutput
} from '../schemas/lesson-schemas';
import wav from 'wav';

// --- Text-to-Speech Sub-flow ---

const TtsOutputSchema = z.object({
  media: z.string().describe("The generated audio as a data URI."),
});
export type TtsOutput = z.infer<typeof TtsOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d: Buffer) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeech = ai.defineFlow(
  {
    name: 'textToSpeech',
    inputSchema: z.string(),
    outputSchema: TtsOutputSchema,
  },
  async (query) => {
    if (!query || query.trim() === '') {
      console.warn("TTS flow received an empty query.");
      return { media: '' };
    }
    
    let generatedMedia;
    try {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-preview-tts',
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Algenib' },
                    },
                },
            },
            prompt: query,
        });
        generatedMedia = media;
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[TTS-GENERATE-ERROR] Detailed Error:`, JSON.stringify(error, null, 2));
        throw new Error(`[TTS-GENERATE-ERROR] ${errorMessage}`);
    }

    if (!generatedMedia || !generatedMedia.url) {
        throw new Error('[TTS] No media was returned from the TTS API.');
    }
    
    try {
        const audioBuffer = Buffer.from(
          generatedMedia.url.substring(generatedMedia.url.indexOf(',') + 1),
          'base64'
        );
        const wavBase64 = await toWav(audioBuffer);
        return {
            media: 'data:audio/wav;base64,' + wavBase64,
        };
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[TTS-WAV-CONVERSION-ERROR] Detailed Error:`, JSON.stringify(error, null, 2));
        throw new Error(`[TTS-WAV-CONVERSION-ERROR] ${errorMessage}`);
    }
  }
);


// --- Main Lesson Generation Flow ---

const LessonStepOutputSchema = z.object({
    step: LearningOutputSchema,
    audio: TtsOutputSchema,
});
export type LessonStepOutput = z.infer<typeof LessonStepOutputSchema>;

// The exported function that the UI will call
export async function getLessonStep(input: LearningInput): Promise<LessonStepOutput> {
  const flowResult = await chatWithOracleFlow(input);
  return flowResult;
}

const chatWithOracleFlow = ai.defineFlow(
  {
    name: 'chatWithOracleFlow',
    inputSchema: LearningInputSchema,
    outputSchema: LessonStepOutputSchema,
  },
  async (input) => {
    let stepResult: LearningOutput;
    
    // --- Step 1: Generate Text Content ---
    try {
        const stepIndex = input.historyLength;
        let systemPrompt = '';
        let userPrompt = '';
        let isFinalStep = false;

        const totalFixedSteps = 8;
        const totalCombinations = input.card.combinaisons?.length || 0;
        const keywordsStepIndex = totalFixedSteps + totalCombinations;
        const totalSteps = keywordsStepIndex + 1;

        isFinalStep = (stepIndex === totalSteps - 1);

        if (stepIndex < totalFixedSteps) {
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
                output: { schema: QcmModelOutputSchema },
            });

            if (!output) {
                throw new Error("L'IA n'a pas pu générer la prochaine étape de la leçon.");
            }
            stepResult = { ...output, exercice: output.exercice ? { ...output.exercice, type: 'qcm' } : undefined };

        } else if (stepIndex < keywordsStepIndex) {
            const combinationIndex = stepIndex - totalFixedSteps;
            if (combinationIndex >= totalCombinations) {
                throw new Error("Étape de combinaison invalide.");
            }

            const combination = input.card.combinaisons[combinationIndex];
            const associatedCard = getCardDetails(combination.carte_associee_id);

            if (!associatedCard) {
                console.warn(`Carte associée introuvable : ${combination.carte_associee_id}, étape ignorée.`);
                throw new Error(`Carte associée introuvable : ${combination.carte_associee_id}`);
            }

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
            output: { schema: QcmModelOutputSchema },
          });

          if (!output) {
            throw new Error("L'IA n'a pas pu générer la prochaine étape de la leçon.");
          }

          stepResult = {
            ...output,
            exercice: output.exercice ? { ...output.exercice, type: 'qcm' } : undefined,
            associatedCard: {
                id: associatedCard.id,
                nom_carte: associatedCard.nom_carte,
                image_url: associatedCard.image_url,
                couleur: associatedCard.couleur,
            }
          };
        } else if (stepIndex === keywordsStepIndex) {
            systemPrompt = `Tu es un tuteur expert en cartomancie. Ta mission est d'enseigner la synthèse des mots-clés d'une carte.

            Suis ces étapes dans ta réponse :
            1.  **Synthèse :** Dans ton 'paragraphe', crée un texte court et inspirant qui résume l'essence de la carte en se basant sur sa phrase-clé et ses mots-clés principaux.
            2.  **Exercice :** Crée un exercice de type 'keywords'.
                -   La 'question' doit demander de sélectionner les mots-clés qui correspondent à la carte.
                -   'all_keywords' doit être un tableau de 8 à 10 chaînes de caractères au total. Il doit contenir TOUS les 'correct_keywords' fournis, ainsi qu'un nombre au moins égal de distracteurs très plausibles (mots-clés de cartes similaires, synonymes, etc.). Le nombre de distracteurs doit être suffisant pour que l'exercice soit un véritable défi. Mélange bien l'ordre des mots-clés.
                -   'correct_keywords' doit être le tableau exact des mots-clés originaux fournis.
            3.  **Fin de Leçon :** 'finDeLecon' doit être mis à ${isFinalStep}.

            Ta réponse doit TOUJOURS suivre le format JSON demandé.`;

            userPrompt = `
              Le sujet de cette étape finale est la synthèse des mots-clés pour la carte **${input.card.nom_carte}**.
        
              - Phrase-clé à intégrer dans le paragraphe : "${input.card.phrase_cle}"
              - Mots-clés corrects à utiliser pour l'exercice : ${JSON.stringify(input.card.mots_cles)}
        
              Génère le paragraphe et l'exercice 'keywords' correspondants. Assure-toi que les distracteurs que tu inventes sont pertinents (par exemple, des mots-clés d'autres cartes) mais faux.
            `;
            
            const { output } = await ai.generate({
                model: 'googleai/gemini-2.0-flash',
                system: systemPrompt,
                prompt: userPrompt,
                output: { schema: KeywordsModelOutputSchema },
            });

            if (!output) {
                throw new Error("L'IA n'a pas pu générer l'étape des mots-clés.");
            }

            stepResult = {
                ...output,
                exercice: {
                    ...output.exercice,
                    type: 'keywords'
                },
            };
        } else {
            stepResult = {
                paragraphe: `Vous avez terminé la leçon sur ${input.card.nom_carte}. Votre voyage dans la cartomancie continue !`,
                finDeLecon: true,
            };
        }
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[ORACLE-FLOW-ERROR]", JSON.stringify(error, null, 2));
        throw new Error(`[TEXT-GEN-ERROR] ${errorMessage}`);
    }

    // --- Step 2: Generate Audio ---
    let audioResult: TtsOutput = { media: '' };
    if (stepResult && stepResult.paragraphe) {
      try {
        audioResult = await textToSpeech(stepResult.paragraphe);
      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[ORACLE-AUDIO-ERROR]", JSON.stringify(error, null, 2));
        // We throw the error so the UI can handle it.
        throw new Error(`[TTS-ERROR] ${errorMessage}`);
      }
    }

    // --- Step 3: Return Combined Results ---
    return {
      step: stepResult,
      audio: audioResult,
    };
  }
);
