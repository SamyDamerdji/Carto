
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const AudioVisualizer = () => {
  return (
    <div className="flex items-end justify-center gap-1.5 h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-full bg-primary rounded-full"
          style={{ transformOrigin: 'bottom' }}
          animate={{
            scaleY: [1, 1.8, 1, 0.7, 1.4, 1, 1],
          }}
          transition={{
            delay: i * 0.15,
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};


export default function LeconInteractivePage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const { toast } = useToast();
  const cardBackUrl = "https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/back.png";

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
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);
  
  const didInitialFetch = useRef(false);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const loadingMessages = useMemo(() => [
    "L'oracle consulte les astres...",
    "Les cartes murmurent leurs secrets...",
    "Préparation de votre leçon...",
    "Alignement des énergies...",
  ], []);

  useEffect(() => {
    if (lessonState !== 'preparing') return;

    const intervalId = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, [lessonState, loadingMessages.length]);

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
      setLessonState('ready');
      return null;
    }
  }, [card, toast]);

  useEffect(() => {
    if (!card || didInitialFetch.current) return;
    didInitialFetch.current = true;

    setLessonState('preparing');
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
    
    const newLessonStep = { model: prefetchedData.step, user: { answer: null } };
    setLessonSteps(prev => [...prev, newLessonStep]);
    setCurrentStepIndex(prev => prev + 1);
    
    setUiSubState('explaining');

    if (audioRef.current && prefetchedData.audioUrl) {
      audioRef.current.src = prefetchedData.audioUrl;
      audioPlayerManager.play(audioRef.current).catch(e => console.error("Audio play failed on advance", e));
    }
    
    setPrefetchedData(null);
    setLastAnswerStatus(null);
    setSelectedOption(null);
    setIsWaitingForNextStep(false);
  }, [prefetchedData]);
  
  // Pre-fetches the next lesson step as soon as the current one is displayed.
  useEffect(() => {
    const currentStep = lessonSteps[currentStepIndex];

    // Conditions for pre-fetching:
    // 1. The lesson must be active.
    // 2. We don't already have pre-fetched data.
    // 3. We are not already in the process of pre-fetching.
    if (
      lessonState === 'active' &&
      (!currentStep || !currentStep.model.finDeLecon) &&
      !prefetchedData &&
      !isPrefetching
    ) {
      setIsPrefetching(true);
      fetchStepAndAudio(lessonSteps).then(data => {
        if (data) {
          setPrefetchedData(data);
        }
        setIsPrefetching(false);
      });
    }
  }, [
    lessonState,
    lessonSteps, // Triggers when a new step is added or an answer is recorded.
    currentStepIndex,
    prefetchedData,
    isPrefetching,
    fetchStepAndAudio,
  ]);
  
  const handleStartLesson = useCallback(() => {
    if (!prefetchedData) return;
    setLessonState('active');
    setLessonSteps([{ model: prefetchedData.step, user: { answer: null } }]);
    setCurrentStepIndex(0);
    setUiSubState('explaining');

    if (audioRef.current && prefetchedData.audioUrl) {
        audioRef.current.src = prefetchedData.audioUrl;
        audioPlayerManager.play(audioRef.current).catch(e => console.error("Audio play failed on start", e));
    }
    setPrefetchedData(null);
  }, [prefetchedData]);

  const handleAnswerClick = (option: string) => {
    if (uiSubState !== 'exercising') return;

    const currentStepModel = lessonSteps[currentStepIndex].model;
    const isCorrect = option === currentStepModel.exercice?.reponseCorrecte;

    if (isCorrect) {
      if (correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0;
        audioPlayerManager.play(correctSoundRef.current).catch(e => console.error("Audio play failed", e));
      }
    } else {
      if (incorrectSoundRef.current) {
        incorrectSoundRef.current.currentTime = 0;
        audioPlayerManager.play(incorrectSoundRef.current).catch(e => console.error("Audio play failed", e));
      }
    }

    // Correctly update the state immutably using .map()
    setLessonSteps(prevSteps =>
      prevSteps.map((step, index) =>
        index === currentStepIndex
          ? { ...step, user: { answer: option } }
          : step
      )
    );

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
        if (uiSubState === 'explaining' && lessonSteps[currentStepIndex]?.model.exercice) {
            setUiSubState('exercising');
        } else if (uiSubState === 'explaining') {
            // If no exercise, wait a bit and then show continue button
            setTimeout(() => setUiSubState('feedback'), 500);
        }
    };

    audioElement.addEventListener('play', onPlay);
    audioElement.addEventListener('playing', onPlay);
    audioElement.addEventListener('pause', onPauseOrEnded);
    audioElement.addEventListener('ended', onEnded);
    
    // If there is no audio source, immediately move to the next state
    if (uiSubState === 'explaining' && !audioElement.src) {
        if (lessonSteps[currentStepIndex]?.model.exercice) {
            setTimeout(() => setUiSubState('exercising'), 100);
        } else {
            setTimeout(() => setUiSubState('feedback'), 100);
        }
    }

    return () => {
        audioElement.removeEventListener('play', onPlay);
        audioElement.removeEventListener('playing', onPlay);
        audioElement.removeEventListener('pause', onPauseOrEnded);
        audioElement.removeEventListener('ended', onEnded);
    };
  }, [uiSubState, lessonSteps, currentStepIndex]);


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

  if (!card) {
    notFound();
  }

  const renderContent = () => {
    if (lessonState === 'preparing') {
      return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6 text-center min-h-[400px] flex flex-col justify-center items-center"
        >
            <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">Leçon : {card.nom_carte}</h2>
            
            <div className="[perspective:1000px] w-[150px] aspect-[2.5/3.5] my-4">
                <motion.div
                    className="relative w-full h-full [transform-style:preserve-3d]"
                    animate={{ rotateY: [0, 0, 180, 180, 360] }}
                    transition={{
                        duration: 5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        times: [0, 0.4, 0.5, 0.9, 1],
                    }}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full [backface-visibility:hidden]">
                        <div className="bg-card rounded-xl shadow-lg p-1 h-full w-full">
                            <div className="relative h-full w-full p-2">
                                <Image src={card.image_url} alt={`Image de la carte ${card.nom_carte}`} fill className="object-contain" sizes="150px" />
                            </div>
                        </div>
                    </div>
                    {/* Back */}
                    <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <div className="bg-card rounded-xl shadow-lg p-1 h-full w-full">
                            <div className="relative h-full w-full">
                                <Image
                                    src={cardBackUrl}
                                    alt="Dos de la carte"
                                    fill
                                    className="object-cover rounded-lg"
                                    sizes="150px"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center gap-4 text-primary mt-4">
              <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
              <div className="relative h-6 w-64 text-left overflow-hidden">
                  <AnimatePresence mode="wait">
                      <motion.p
                          key={currentMessageIndex}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute w-full text-sm italic"
                      >
                          {loadingMessages[currentMessageIndex]}
                      </motion.p>
                  </AnimatePresence>
              </div>
            </div>
        </motion.div>
      );
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
        const associatedCardForStep = currentStep?.associatedCard;

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
                
                <div className="relative flex justify-center items-center min-h-[220px] mb-4 [perspective:1200px]">
                    <motion.div
                        className="relative w-[150px] aspect-[2.5/3.5] z-10"
                        animate={{
                            x: associatedCardForStep ? -40 : 0,
                            rotateY: associatedCardForStep ? -5 : 0,
                        }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="bg-card rounded-xl shadow-lg p-1 h-full w-full">
                            <div className="relative h-full w-full p-2">
                                <Image src={card.image_url} alt={`Image de la carte ${card.nom_carte}`} fill className="object-contain" sizes="150px" />
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {associatedCardForStep && (
                            <motion.div
                                key={associatedCardForStep.id}
                                className="absolute w-[150px] aspect-[2.5/3.5] z-0"
                                initial={{ x: 40, y: -10, opacity: 0, rotateY: 30, scale: 0.95 }}
                                animate={{ x: 40, y: 0, opacity: 1, rotateY: 5, scale: 1 }}
                                exit={{ x: 40, y: -10, opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <div className="bg-card rounded-xl shadow-lg p-1 h-full w-full">
                                    <div className="relative h-full w-full p-2">
                                        <Image src={associatedCardForStep.image_url} alt={`Image de la carte ${associatedCardForStep.nom_carte}`} fill className="object-contain" sizes="150px" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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
                    <div className="space-y-3 flex flex-col items-center text-center">
                        {currentStep.exercice && <p className="text-sm text-white/80 italic mb-2">{currentStep.exercice.question}</p>}
                        {currentStep.exercice?.options.map(opt => {
                            const isSelected = selectedOption === opt;
                            const isCorrect = opt === currentStep.exercice?.reponseCorrecte;
                            return (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswerClick(opt)}
                                    disabled={uiSubState === 'feedback'}
                                    className={cn(
                                        "relative h-full w-full overflow-hidden rounded-xl border border-primary/30 bg-secondary/20 p-4 shadow-lg shadow-primary/20 backdrop-blur-lg text-left transition-all duration-300 disabled:pointer-events-none",
                                        uiSubState !== 'feedback' && "hover:border-primary/60 hover:scale-105",
                                        uiSubState === 'feedback' && {
                                            'border-green-500/80 bg-green-900/40 text-white scale-105': isSelected && isCorrect,
                                            'border-destructive/80 bg-destructive/40 text-white scale-105': isSelected && !isCorrect,
                                            'border-green-600/50 bg-green-900/30 text-white': !isSelected && isCorrect,
                                            'border-secondary-foreground/20 bg-card-foreground/10 text-secondary-foreground/80 opacity-60': !isSelected && !isCorrect,
                                        }
                                    )}
                                >
                                    <div className="absolute -right-2 -top-2 h-16 w-16 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
                                    <div className="relative z-10 flex items-start gap-3">
                                        {uiSubState === 'feedback' && isCorrect && <Check className="h-5 w-5 flex-shrink-0 text-green-400 mt-0.5" />}
                                        {uiSubState === 'feedback' && isSelected && !isCorrect && <XIcon className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />}
                                        <div className="flex-1 rounded-lg border border-secondary-foreground/30 bg-card-foreground/25 p-3 shadow-lg shadow-black/20">
                                            <p className="text-sm text-secondary-foreground/90 whitespace-pre-wrap">{opt}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                         {uiSubState === 'feedback' && (
                          <Button onClick={handleContinue} className="mt-4" disabled={isPrefetching}>
                            {isPrefetching && isWaitingForNextStep ? (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>) : "Continuer"}
                            {!isPrefetching && !isWaitingForNextStep && <ArrowRight className="ml-2 h-4 w-4"/>}
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
                          <div className="flex flex-col items-center justify-center gap-3 text-primary">
                            <AudioVisualizer />
                            <p className="text-sm italic">Écoutez l'oracle...</p>
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
        {renderContent()}
        <audio ref={audioRef} className="hidden" />
        <audio ref={correctSoundRef} src="https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/sounds/correct.mp3" preload="auto" className="hidden" />
        <audio ref={incorrectSoundRef} src="https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/sounds/incorrect.mp3" preload="auto" className="hidden" />
      </main>
      <Footer />
    </div>
  );
}
