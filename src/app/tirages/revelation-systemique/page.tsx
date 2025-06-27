
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { CardSummary } from '@/lib/data/cards';
import { cardsList } from '@/lib/data/cards';
import { interpretSystemicRevelation, type SystemicRevelationOutput } from '@/ai/flows/systemic-revelation-flow';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2, Dices, BrainCircuit, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const cardPositions = [
  { position: 1, description: 'Polarité dominante' },
  { position: 2, description: 'Polarité opposée' },
  { position: 3, description: 'Figure médiatrice' },
  { position: 4, description: 'Tension n°1' },
  { position: 5, description: 'Tension n°2' },
  { position: 6, description: 'Tension n°3' },
  { position: 7, description: 'Résolution systémique' },
];

interface DrawnCard {
  position: number;
  description: string;
  card: CardSummary;
}

const CardSlot = ({ drawnCard, isRevealed, index }: { drawnCard: DrawnCard; isRevealed: boolean; index: number }) => {
  const cardBackUrl = "https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/back.png";

  return (
    <div className="[perspective:1000px] w-full aspect-[2.5/3.5]">
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden border border-primary/30 bg-secondary/20 p-3 shadow-lg shadow-primary/20 backdrop-blur-lg flex flex-col">
            <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-card rounded-xl shadow-lg p-2">
                    <div className="relative h-full w-full">
                        <Image
                        src={cardBackUrl}
                        alt="Dos de carte"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden border border-primary/30 bg-secondary/20 p-3 shadow-lg shadow-primary/20 backdrop-blur-lg flex flex-col">
            <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-card rounded-xl shadow-lg p-2">
                    <div className="relative h-full w-full">
                        <Image
                        src={drawnCard.card.image_url}
                        alt={`Image de la carte ${drawnCard.card.nom_carte}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};


export default function RevelationSystemiquePage() {
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState<SystemicRevelationOutput | null>(null);
  const [isDeepening, setIsDeepening] = useState(false);
  const [hasDeepened, setHasDeepened] = useState(false);
  const { toast } = useToast();

  const drawCards = useCallback(() => {
    setIsLoading(true);
    setIsRevealed(false);
    setInterpretation(null);
    setHasDeepened(false);
    
    // Give a moment for the flip-back animation to be noticeable
    setTimeout(() => {
        const shuffled = [...cardsList].sort(() => 0.5 - Math.random());
        const newDraw = cardPositions.map((pos, index) => ({
        ...pos,
        card: shuffled[index],
        }));
        setDrawnCards(newDraw);
        setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    drawCards();
  }, [drawCards]);

  const handleReveal = () => {
    setIsRevealed(true);
  }

  const handleInterpret = async () => {
    if (drawnCards.length < 7) return;
    setIsInterpreting(true);
    
    try {
      const input = {
        card1: `${drawnCards[0].card.nom_carte}`,
        card2: `${drawnCards[1].card.nom_carte}`,
        card3: `${drawnCards[2].card.nom_carte}`,
        card4: `${drawnCards[3].card.nom_carte}`,
        card5: `${drawnCards[4].card.nom_carte}`,
        card6: `${drawnCards[5].card.nom_carte}`,
        card7: `${drawnCards[6].card.nom_carte}`,
      };
      
      const result = await interpretSystemicRevelation(input);
      setInterpretation(result);

      toast({
        title: "Interprétation reçue !",
        description: "L'analyse de votre tirage est prête. Vous pouvez maintenant approfondir.",
      });

    } catch (error) {
      console.error("Error fetching interpretation:", error);
      toast({
        variant: 'destructive',
        title: "Erreur d'interprétation",
        description: "L'IA n'a pas pu analyser le tirage. Veuillez réessayer.",
      });
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleDeepen = async () => {
    setIsDeepening(true);
    // Placeholder for a future, more complex AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHasDeepened(true);
    setIsDeepening(false);
    toast({
      title: "Approfondissement terminé",
      description: "L'oracle a livré tous ses secrets sur ce tirage.",
    });
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6">

            <div className="text-center mb-8">
                <h1 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl uppercase drop-shadow-lg">
                    Tirage Révélation Systémique
                </h1>
                <p className="mt-2 max-w-3xl mx-auto text-lg text-white">
                    Analyse des forces et dynamiques relationnelles
                </p>
            </div>

            
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 max-w-4xl mx-auto items-start">
                    {drawnCards.map((c, i) => (
                        <div key={c.position} className={`flex flex-col items-center text-center ${c.position === 7 ? 'col-span-2 md:col-span-1 md:col-start-2' : ''}`}>
                            <div className="mb-2 flex h-14 items-center justify-center">
                                <p className="text-xs text-white/80 px-2">{c.description}</p>
                            </div>
                            <div className="w-28 sm:w-32">
                                <CardSlot drawnCard={c} isRevealed={isRevealed} index={i} />
                            </div>
                            <div className="h-7 pt-2 flex items-center justify-center">
                              {isRevealed && (
                                  <p className="font-headline text-xs whitespace-nowrap font-bold text-primary uppercase" style={{ textShadow: '0px 2px 3px rgba(0,0,0,0.7)' }}>
                                      {c.card.nom_carte}
                                  </p>
                              )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mx-auto max-w-md flex justify-center gap-4 mt-8">
                  {!isRevealed ? (
                      <Button onClick={handleReveal} disabled={isLoading || drawnCards.length < 7}>
                          <Eye className="mr-2 h-4 w-4" /> Révéler les cartes
                      </Button>
                  ) : (
                      <>
                        <Button onClick={drawCards} disabled={isLoading || isInterpreting || isDeepening}>
                            <Dices className="mr-2 h-4 w-4" /> Refaire le tirage
                        </Button>
                        
                        {!interpretation ? (
                          <Button onClick={handleInterpret} disabled={isInterpreting || drawnCards.length < 7}>
                            {isInterpreting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            )}
                            Interpréter avec l'IA
                          </Button>
                        ) : !hasDeepened ? (
                          <Button onClick={handleDeepen} disabled={isDeepening}>
                            {isDeepening ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Approfondir avec l'IA
                          </Button>
                        ) : (
                          <Button disabled>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            L'oracle a parlé
                          </Button>
                        )}
                      </>
                  )}
                </div>
              </>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
