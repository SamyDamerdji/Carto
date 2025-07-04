'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCardDetails } from '@/lib/data/cards';
import type { Card } from '@/lib/data/cards';
import Image from 'next/image';
import { Loader2, Play, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getLessonStep, type LessonStepOutput } from '@/ai/flows/lesson-orchestrator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { audioPlayerManager } from '@/lib/audio-manager';
import { CardNavigation } from '@/components/cards/card-navigation';
import Link from 'next/link';

type LessonState = 'loading' | 'ready' | 'playing' | 'interacting' | 'finished';
const emotionChoices = [
  { emotion: 'Sérénité', icon: Smile },
  { emotion: 'Curiosité', icon: Sparkles },
  { emotion: 'Inspiration', icon: Meh },
  { emotion: 'Tension', icon: Frown },
];

const LoadingScreen = ({ card }: { card: Card }) => (
    <div className="text-center min-h-[400px] flex flex-col justify-center items-center">
        <div className="relative w-48 aspect-[2.5/3.5] my-4">
            <div className="bg-card rounded-xl shadow-lg p-1 h-full w-full">
                <div className="relative h-full w-full p-2">
                    <Image src={card.image_url} alt={`Image de la carte ${card.nom_carte}`} fill className="object-contain" sizes="192px" priority />
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4 text-primary mt-4">
            <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
            <p className="text-sm italic">L'oracle prépare votre leçon...</p>
        </div>
        <p className="text-center text-xs text-white/70 mt-4">La première étape peut prendre un moment à charger.</p>
    </div>
);

export default function LeconInteractivePage() {
    const params = useParams();
    const cardId = params.cardId as string;
    const { toast } = useToast();
    
    const [lessonState, setLessonState] = useState<LessonState>('loading');
    const [currentStepData, setCurrentStepData] = useState<LessonStepOutput | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const preloadedNextStep = useRef<LessonStepOutput | null>(null);


    const card = useMemo(() => {
        if (!cardId) return null;
        return getCardDetails(cardId);
    }, [cardId]);

    const loadStep = useCallback(async (stepIndex: number) => {
        if (!cardId) return;

        if (preloadedNextStep.current && stepIndex > history.length) {
            setCurrentStepData(preloadedNextStep.current);
            setLessonState('ready');
            preloadedNextStep.current = null;
            return;
        }

        setLessonState('loading');
        try {
            const stepData = await getLessonStep({ cardId, step: stepIndex });
            setCurrentStepData(stepData);
            setLessonState('ready');
        } catch (error) {
            console.error("Error fetching lesson step:", error);
            const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
            toast({
                variant: 'destructive',
                title: "Erreur de leçon",
                description: errorMessage,
            });
        }
    }, [cardId, history.length, toast]);

    useEffect(() => {
        loadStep(0);
    }, [loadStep]);
    
    useEffect(() => {
        const audioElement = audioRef.current;
        if (!audioElement) return;
    
        const onEnded = () => {
            setLessonState('interacting');
        };
        
        audioElement.addEventListener('ended', onEnded);
        return () => {
            audioElement.removeEventListener('ended', onEnded);
        };
    }, []);

    const handleStartLesson = useCallback(() => {
        if (currentStepData?.audioUrl && audioRef.current) {
            audioRef.current.src = currentStepData.audioUrl;
            audioPlayerManager.play(audioRef.current).catch(e => console.error("Audio play failed", e));
            setLessonState('playing');
        }
    }, [currentStepData]);
    
    const handleEmotionSelect = useCallback((emotion: string) => {
        console.log("Emotion selected:", emotion);
        setHistory(prev => [...prev, { ...currentStepData, userEmotion: emotion }]);
        
        if (currentStepData?.isLastStep) {
            setLessonState('finished');
        } else {
            setLessonState('finished');
        }
    }, [currentStepData]);


    if (!card) {
        return (
          <div className="flex min-h-dvh flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
    }

    if (!cardId) {
      notFound();
    }

    return (
        <div className="flex min-h-dvh flex-col">
            <Header />
            <CardNavigation currentCardId={cardId} />
            <audio ref={audioRef} className="hidden" />
            <main className="flex-grow container mx-auto px-4 pb-8">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mx-auto mt-6 max-w-2xl rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6"
                >
                    <AnimatePresence mode="wait">
                        {lessonState === 'loading' && (
                            <motion.div key="loading" exit={{ opacity: 0 }}>
                                <LoadingScreen card={card} />
                            </motion.div>
                        )}
                        
                        {(lessonState === 'ready' || lessonState === 'playing' || lessonState === 'interacting') && currentStepData && (
                             <motion.div key="lesson-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="grid md:grid-cols-2 gap-6 items-center">
                                    <div className="relative w-full aspect-[2.5/3.5] mx-auto max-w-xs">
                                        <div className="bg-card rounded-xl shadow-lg p-1 h-full w-full">
                                            <div className="relative h-full w-full p-2">
                                                <Image src={card.image_url} alt={`Image de la carte ${card.nom_carte}`} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h2 className="font-headline text-3xl font-bold uppercase tracking-wider text-primary drop-shadow-lg">{card.nom_carte}</h2>
                                        <div className="mt-4 p-4 bg-background/30 rounded-lg border border-primary/20 max-h-48 overflow-y-auto">
                                            <p className="text-white/90">{currentStepData.script}</p>
                                        </div>
                                        {lessonState === 'ready' && (
                                            <Button onClick={handleStartLesson} size="lg" className="mt-6">
                                                <Play className="mr-2 h-5 w-5" /> Commencer la leçon
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {currentStepData.imageUrl && (
                                    <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                        <h3 className="font-headline text-xl text-center text-primary mb-2">Visualisation de l'Oracle</h3>
                                        <div className="relative w-full aspect-video bg-black/30 rounded-lg overflow-hidden border border-primary/30">
                                            <Image src={currentStepData.imageUrl} alt="Visualisation générée par l'IA" layout="fill" objectFit="cover" />
                                        </div>
                                    </motion.div>
                                )}
                                {lessonState === 'interacting' && (
                                    <motion.div key="interaction" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
                                        <h3 className="font-headline text-lg text-white/90 mb-4">Que ressentez-vous maintenant ?</h3>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {emotionChoices.map(({emotion, icon: Icon}) => (
                                                <Button key={emotion} variant="outline" onClick={() => handleEmotionSelect(emotion)}>
                                                    <Icon className="mr-2 h-4 w-4" />
                                                    {emotion}
                                                </Button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                             </motion.div>
                        )}

                        {lessonState === 'finished' && (
                            <motion.div key="finished" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center min-h-[400px] flex flex-col justify-center items-center">
                                <Smile className="w-16 h-16 text-primary mb-4" />
                                <h2 className="font-headline text-2xl text-primary">Leçon terminée !</h2>
                                <p className="text-white/80 mt-2">Vous avez terminé la première étape de votre voyage avec cette carte.</p>
                                <Link href="/apprentissage" passHref>
                                    <Button className="mt-6">Retour à l'apprentissage</Button>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}