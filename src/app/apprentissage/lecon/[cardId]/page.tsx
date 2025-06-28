
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Card } from '@/lib/data/cards';
import { getCardDetails } from '@/lib/data/cards';
import { chatWithOracle, type LearningOutput } from '@/ai/flows/oracle-flow';
import { textToSpeech } from '@/ai/flows/tts-flow';
import Image from 'next/image';
import { Loader2, Volume2, VolumeX, Check, X as XIcon, ArrowRight } from 'lucide-react';
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
  const { toast } = useToast();

  const card = useMemo(() => {
    if (!cardId) return null;
    return getCardDetails(cardId);
  }, [cardId]);

  const [lessonState, setLessonState] = useState<LessonState>('preparing');
  const [uiSubState, setUiSubState] = useState<UiSubState>('explaining');
  const [lessonSteps, setLessonSteps] = useState<LessonStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [prefetchedData, setPrefetchedData] = useState<{ step: LearningOutput; audioUrl: string } | null>(null);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [isWaitingForNextStep, setIsWaitingForNextStep] = useState(false);

  const [lastAnswerStatus, setLastAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // This ref ensures the initial fetch is only called once, preventing Strict Mode issues.
  const didInitialFetch = useRef(false);

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
      setLessonState('ready'); // Go back to a safe state
      return null;
    }
  }, [card, toast]);

  // Initial fetch on mount
  useEffect(() => {
    if (!card || didInitialFetch.current) return;
    didInitialFetch.current = true;

    setIsPrefetching(true);
    fetchStepAndAudio([]).then(data => {
      if (data) {
        setPrefetchedData(data);
        setLessonState('ready');
      }
      setIsPrefetching(false);
    });
  }, [card, fetchStepAndAudio]);

  const advanceToNextStep = useCallback(() => {
    if (!prefetchedData) return;
    
    // The history is already updated from handleAnswerClick
    const newLessonStep = { model: prefetchedData.step, user: { answer: null } };
    setLessonSteps(prev => [...prev, newLessonStep]);
    setCurrentStepIndex(prev => prev + 1);
    
    if (audioRef.current) {
      audioRef.current.src = prefetchedData.audioUrl;
      audioPlayerManager.play(audioRef.current).catch(e => console.error("Audio play failed on advance", e));
    }
    
    setPrefetchedData(null);
    setUiSubState('explaining');
    setLastAnswerStatus(null);
    setSelectedOption(null);
    setIsWaitingForNextStep(false);
  }, [prefetchedData]);
  

  // Prefetching logic for subsequent steps
  useEffect(() => {
    if (uiSubState === 'feedback' && !prefetchedData && !isPrefetching) {
        setIsPrefetching(true);
        fetchStepAndAudio(lessonSteps).then(data => {
            if (data) {
                setPrefetchedData(data);
            }
            setIsPrefetching(false);
        });
    }
  }, [uiSubState, prefetchedData, isPrefetching, lessonSteps, fetchStepAndAudio]);

  
  const handleStartLesson = useCallback(() => {
    if (!prefetchedData) return;
    setLessonState('active');
    setLessonSteps([{ model: prefetchedData.step, user: { answer: null } }]);
    if (audioRef.current) {
        audioRef.current.src = prefetchedData.audioUrl;
        audioPlayerManager.play(audioRef.current).catch(e => console.error("Audio play failed on start", e));
    }
    setPrefetchedData(null);
    setUiSubState('explaining');
  }, [prefetchedData]);

  const handleAnswerClick = (option: string) => {
    if (uiSubState !== 'exercising') return;

    const currentStepModel = lessonSteps[currentStepIndex].model;
    const isCorrect = option === currentStepModel.exercice?.reponseCorrecte;

    // Update history immediately for the next prefetch
    const updatedSteps = [...lessonSteps];
    updatedSteps[currentStepIndex].user.answer = option;
    setLessonSteps(updatedSteps);

    setLastAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    setSelectedOption(option);
    setUiSubState('feedback');
  };
  
  const handleContinue = () => {
    const currentStep = lessonSteps[currentStepIndex]?.model;
    if (currentStep.finDeLecon) {
        setLessonState('finished');
        return;
    }

    if (prefetchedData) {
        advanceToNextStep();
    } else {
        setIsWaitingForNextStep(true);
    }
  }

  // This effect handles the case where user clicks "Continue" before prefetch is done.
  useEffect(() => {
    if (isWaitingForNextStep && prefetchedData) {
      advanceToNextStep();
    }
  }, [isWaitingForNextStep, prefetchedData, advanceToNextStep]);


  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const onPlay = () => setIsTtsPlaying(true);
    const onPauseOrEnded = () => setIsTtsPlaying(false);
    const onEnded = () => {
        // Only transition if we were explaining. Prevents race conditions.
        if (uiSubState === 'explaining') {
            setUiSubState('exercising');
        }
    };

    audioElement.addEventListener('play', onPlay);
    audioElement.addEventListener('playing', onPlay); // Some browsers use this
    audioElement.addEventListener('pause', onPauseOrEnded);
    audioElement.addEventListener('ended', onEnded);
    
    // Cleanup function
    return () => {
        audioElement.removeEventListener('play', onPlay);
        audioElement.removeEventListener('playing', onPlay);
        audioElement.removeEventListener('pause', onPauseOrEnded);
        audioElement.removeEventListener('ended', onEnded);
    };
  }, [uiSubState]); // Rerun when uiSubState changes to correctly handle the onEnded logic.


  // Gracefully handle the case where cardId is not available on initial render.
  if (!cardId) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  // Once cardId is available, if the card is not found, render the 404 page.
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
            <Button onClick={handleStartLesson} size="lg" disabled={isPrefetching}>
              {isPrefetching ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Volume2 className="mr-2 h-5 w-5" />}
              Commencer la leçon audio
            </Button>
        </div>
      );
    }
    if (lessonState === 'active' || lessonState === 'finished') {
        const currentStep = lessonSteps[currentStepIndex]?.model;

        if (!currentStep) {
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6 min-h-[400px] flex flex-col justify-center items-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm italic mt-4 text-primary">L'oracle prépare la suite...</p>
            </motion.div>
          );
        }

        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">Leçon : {card.nom_carte}</h2>
                    <Button variant="ghost" size="icon" onClick={() => audioPlayerManager.pause()} className="text-primary hover:bg-primary/20" aria-label="Arrêter la lecture">
                        {isTtsPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                </div>
                <div className="bg-card rounded-xl shadow-lg p-1 mx-auto w-fit mb-4"><div className="relative w-[150px] aspect-[2.5/3.5] p-2"><Image src={card.image_url} alt={`Image de la carte ${card.nom_carte}`} fill className="object-contain" sizes="150px" /></div></div>
                <div className="min-h-[7rem] text-white/90 text-center p-4 rounded-lg bg-background/20 border border-primary/20">
                    <p className="text-sm whitespace-pre-wrap">{currentStep.paragraphe}</p>
                </div>

                <div className="mt-4 min-h-[250px] flex flex-col justify-center">
                  {isWaitingForNextStep ? (
                     <div className="flex flex-col justify-center items-center h-full">
                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
                       <p className="text-sm italic mt-4 text-primary">L'oracle prépare la suite...</p>
                     </div>
                  ) : uiSubState === 'exercising' || uiSubState === 'feedback' ? (
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
                                        "w-full justify-start text-left h-auto py-2",
                                        uiSubState === 'feedback' && isSelected && lastAnswerStatus === 'correct' && "bg-green-700 hover:bg-green-700",
                                        uiSubState === 'feedback' && isSelected && lastAnswerStatus === 'incorrect' && "bg-destructive hover:bg-destructive",
                                        uiSubState === 'feedback' && !isSelected && isCorrect && "bg-green-800/50 hover:bg-green-800/50"
                                    )}
                                >
                                    {uiSubState === 'feedback' && isSelected && lastAnswerStatus === 'correct' && <Check className="mr-2 h-4 w-4" />}
                                    {uiSubState === 'feedback' && isSelected && lastAnswerStatus === 'incorrect' && <XIcon className="mr-2 h-4 w-4" />}
                                    <span className="whitespace-pre-wrap">{opt}</span>
                                </Button>
                            );
                        })}
                         {uiSubState === 'feedback' && (
                          <Button onClick={handleContinue} className="mt-4" disabled={isPrefetching}>
                            Continuer <ArrowRight className="ml-2 h-4 w-4"/>
                          </Button>
                        )}
                    </div>
                  ) : lessonState === 'finished' ? (
                      <div className="text-center text-white/90 p-4">
                        <Check className="h-8 w-8 mx-auto text-green-500 mb-2"/>
                        <p>Leçon terminée !</p>
                        <p className="text-xs text-white/70">Vous pouvez maintenant explorer une autre carte.</p>
                      </div>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                        {isTtsPlaying && uiSubState === 'explaining' ? (
                          <div className="flex items-center gap-2 text-primary">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <p className="text-sm italic">Écoutez...</p>
                          </div>
                        ) : uiSubState === 'explaining' && !isTtsPlaying ? (
                          <div className="flex items-center gap-2 text-primary">
                            <Check className="h-5 w-5"/>
                            <p className="text-sm italic">Préparez-vous pour l'exercice...</p>
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
