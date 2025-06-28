'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Card } from '@/lib/data/cards';
import { getCardDetails } from '@/lib/data/cards';
import { chatWithOracle, type LearningOutput } from '@/ai/flows/oracle-flow';
import { textToSpeech, type TtsOutput } from '@/ai/flows/tts-flow';
import Image from 'next/image';
import { Loader2, Volume2, VolumeX, BrainCircuit, Check, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { audioPlayerManager } from '@/lib/audio-manager';
import { notFound, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CardNavigation } from '@/components/cards/card-navigation';

type LessonStep = {
  model: LearningOutput;
  user: { answer: string | null };
};

type LessonState = 'preparing' | 'ready' | 'active' | 'finished';
type UiSubState = 'explaining' | 'exercising' | 'feedback';

export default function LeconInteractivePage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const card = getCardDetails(cardId);
  const { toast } = useToast();

  const [lessonState, setLessonState] = useState<LessonState>('preparing');
  const [initialStepData, setInitialStepData] = useState<{ step: LearningOutput; audioUrl: string } | null>(null);
  
  const [lessonSteps, setLessonSteps] = useState<LessonStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [nextStepData, setNextStepData] = useState<{ step: LearningOutput; audioUrl: string } | null>(null);
  const [isFetchingNextStep, setIsFetchingNextStep] = useState(false);
  
  const [uiSubState, setUiSubState] = useState<UiSubState>('explaining');
  const [lastAnswerStatus, setLastAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Data Fetching and Pipelining ---
  const fetchStepAndAudio = useCallback(async (history: LessonStep[]) => {
    if (!card) return null;
    try {
      const step = await chatWithOracle({ card, history });
      let audioUrl = '';
      if (step.paragraphe) {
        const { media } = await textToSpeech(step.paragraphe);
        audioUrl = media;
      }
      return { step, audioUrl };
    } catch (error) {
      console.error("Error fetching step or audio:", error);
      toast({
        variant: 'destructive',
        title: "Erreur de l'Oracle",
        description: "Impossible de continuer la leçon. Veuillez rafraîchir la page.",
      });
      return null;
    }
  }, [card, toast]);

  // Pre-fetch initial step
  useEffect(() => {
    if (!card || initialStepData) return;
    const prepareFirstStep = async () => {
      setLessonState('preparing');
      const data = await fetchStepAndAudio([]);
      if (data) {
        setInitialStepData(data);
        setLessonState('ready');
      }
    };
    prepareFirstStep();
  }, [card, fetchStepAndAudio, initialStepData]);

  // Pre-fetch next step
  useEffect(() => {
    if (uiSubState === 'exercising' && !nextStepData && !isFetchingNextStep) {
      setIsFetchingNextStep(true);
      fetchStepAndAudio(lessonSteps).then(data => {
        if (data) {
          setNextStepData(data);
        }
        setIsFetchingNextStep(false);
      });
    }
  }, [uiSubState, lessonSteps, nextStepData, isFetchingNextStep, fetchStepAndAudio]);

  // --- Lesson Flow Management ---
  const handleStartLesson = () => {
    if (!initialStepData) return;
    setLessonSteps([{ model: initialStepData.step, user: { answer: null } }]);
    setLessonState('active');
  };

  useEffect(() => {
    if (lessonState !== 'active') return;

    const currentStep = lessonSteps[currentStepIndex];
    if (!currentStep) return;

    setUiSubState('explaining');
    setLastAnswerStatus(null);
    setSelectedOption(null);

    const audioUrl = (currentStepIndex === 0 ? initialStepData?.audioUrl : nextStepData?.audioUrl);

    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioPlayerManager.play(audioRef.current).catch(e => console.error(e));
    } else if (currentStep.paragraphe) {
      // Fallback if audio wasn't pre-fetched
      textToSpeech(currentStep.paragraphe).then(({ media }) => {
        if (media && audioRef.current) {
          audioRef.current.src = media;
          audioPlayerManager.play(audioRef.current).catch(e => console.error(e));
        }
      });
    }

  }, [lessonState, lessonSteps, currentStepIndex]);
  
  const handleAnswerClick = (option: string) => {
    if (uiSubState !== 'exercising') return;

    const currentStepModel = lessonSteps[currentStepIndex].model;
    const isCorrect = option === currentStepModel.exercice?.reponseCorrecte;

    setLastAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    setSelectedOption(option);
    setUiSubState('feedback');

    // Update history
    const updatedSteps = [...lessonSteps];
    updatedSteps[currentStepIndex].user.answer = option;
    setLessonSteps(updatedSteps);

    setTimeout(() => {
      if (currentStepModel.finDeLecon) {
        setLessonState('finished');
        return;
      }
      
      if (nextStepData) {
        setLessonSteps(prev => [...prev, { model: nextStepData.step, user: { answer: null } }]);
        setCurrentStepIndex(prev => prev + 1);
        setNextStepData(null); // Reset for next pre-fetch
      } else {
        // This case should be rare if pre-fetching works well
        setIsFetchingNextStep(true); 
      }
    }, 1500); // Wait 1.5s to show feedback
  };

  // --- Audio Player Event Listeners ---
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const onPlay = () => setIsTtsPlaying(true);
    const onPauseOrEnded = () => {
      setIsTtsPlaying(false);
      if (uiSubState === 'explaining') {
        const currentStepModel = lessonSteps[currentStepIndex]?.model;
        if (currentStepModel && !currentStepModel.finDeLecon) {
          setUiSubState('exercising');
        } else if (currentStepModel?.finDeLecon) {
          setLessonState('finished');
        }
      }
    };

    audioElement.addEventListener('play', onPlay);
    audioElement.addEventListener('pause', onPauseOrEnded);
    audioElement.addEventListener('ended', onPauseOrEnded);
    
    return () => {
      audioElement.removeEventListener('play', onPlay);
      audioElement.removeEventListener('pause', onPauseOrEnded);
      audioElement.removeEventListener('ended', onPauseOrEnded);
      if (audioPlayerManager.current === audioElement) {
        audioPlayerManager.pause();
      }
    };
  }, [uiSubState, lessonSteps, currentStepIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioPlayerManager.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  if (!card) {
    notFound();
  }

  const renderContent = () => {
    if (lessonState === 'preparing') {
      return <div className="flex justify-center items-center min-h-[400px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }
    if (lessonState === 'ready') {
      return (
        <div className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6 text-center">
            <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">Leçon : {card.nom_carte}</h2>
            <div className="bg-card rounded-xl shadow-lg p-1 mx-auto w-fit my-4"><div className="relative w-[150px] aspect-[2.5/3.5] p-2"><Image src={card.image_url} alt={`Image de la carte ${card.nom_carte}`} fill className="object-contain" sizes="150px" /></div></div>
            <p className="text-white/90 my-4">L'oracle est prêt à vous enseigner les secrets de cette carte.</p>
            <Button onClick={handleStartLesson} size="lg"><Volume2 className="mr-2 h-5 w-5" />Commencer la leçon audio</Button>
        </div>
      );
    }
    if (lessonState === 'active' || lessonState === 'finished') {
        const currentStep = lessonSteps[currentStepIndex]?.model;
        if (!currentStep) return <div className="flex justify-center items-center min-h-[400px]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;

        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">Leçon : {card.nom_carte}</h2>
                    <Button variant="ghost" size="icon" onClick={() => audioPlayerManager.pause()} className="text-primary hover:bg-primary/20" aria-label="Arrêter la lecture">
                        {isTtsPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                </div>
                <div className="bg-card rounded-xl shadow-lg p-1 mx-auto w-fit mb-4"><div className="relative w-[150px] aspect-[2.5/3.5] p-2"><Image src={card.image_url} alt={`Image de la carte ${card.nom_carte}`} fill className="object-contain" sizes="150px" /></div></div>
                <div className="h-28 text-white/90 text-center flex items-center justify-center p-2 rounded-lg bg-background/20 border border-primary/20">
                    <p className="text-sm whitespace-pre-wrap">{currentStep.paragraphe}</p>
                </div>

                <div className="mt-4 min-h-[160px]">
                  {uiSubState === 'exercising' || uiSubState === 'feedback' ? (
                    <div className="space-y-2 flex flex-col items-center text-center">
                        <p className="text-sm text-white/80 italic mb-2">{currentStep.exercice?.question}</p>
                        {currentStep.exercice?.options.map(opt => {
                            const isSelected = selectedOption === opt;
                            const isCorrect = opt === currentStep.exercice?.reponseCorrecte;
                            return (
                                <Button
                                    key={opt}
                                    onClick={() => handleAnswerClick(opt)}
                                    disabled={uiSubState === 'feedback'}
                                    className={cn(
                                        "w-full justify-start text-left",
                                        uiSubState === 'feedback' && isSelected && lastAnswerStatus === 'correct' && "bg-green-700 hover:bg-green-700",
                                        uiSubState === 'feedback' && isSelected && lastAnswerStatus === 'incorrect' && "bg-destructive hover:bg-destructive",
                                        uiSubState === 'feedback' && !isSelected && isCorrect && "bg-green-800/50 hover:bg-green-800/50"
                                    )}
                                >
                                    {uiSubState === 'feedback' && isSelected && lastAnswerStatus === 'correct' && <Check className="mr-2 h-4 w-4" />}
                                    {uiSubState === 'feedback' && isSelected && lastAnswerStatus === 'incorrect' && <XIcon className="mr-2 h-4 w-4" />}
                                    {opt}
                                </Button>
                            );
                        })}
                    </div>
                  ) : lessonState === 'finished' ? (
                      <div className="text-center text-white/90 p-4">
                        <Check className="h-8 w-8 mx-auto text-green-500 mb-2"/>
                        <p>Leçon terminée !</p>
                        <p className="text-xs text-white/70">Vous pouvez maintenant explorer une autre carte.</p>
                      </div>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                        {isFetchingNextStep || (isTtsPlaying && uiSubState === 'explaining') ? (
                          <div className="flex items-center gap-2 text-primary">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <p className="text-sm italic">{isTtsPlaying ? 'Écoutez...' : 'L\'oracle prépare la suite...'}</p>
                          </div>
                        ) : null}
                    </div>
                  )}
                </div>
            </motion.div>
        );
    }
    return null;
  };


  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <CardNavigation currentCardId={cardId} />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <audio ref={audioRef} className="hidden" />
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
