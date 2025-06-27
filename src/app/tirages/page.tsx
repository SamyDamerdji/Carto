
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { CardSummary } from '@/lib/data/cards';
import { cardsList } from '@/lib/data/cards';
import { interpretSystemicRevelation } from '@/ai/flows/systemic-revelation-flow';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2, Dices, BrainCircuit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const cardPositions = [
  { position: 1, title: 'Polarité dominante', description: 'La figure ou l’énergie la plus influente.' },
  { position: 2, title: 'Polarité opposée', description: 'Le contre-pouvoir ou la résistance active.' },
  { position: 3, title: 'Figure médiatrice', description: 'L’élément perturbateur ou stabilisateur.' },
  { position: 4, title: 'Tension n°1', description: 'Conflit latent ou blessure non verbalisée.' },
  { position: 5, title: 'Tension n°2', description: 'Pression extérieure ou peur.' },
  { position: 6, title: 'Tension n°3', description: 'Impulsion interne ou émotionnelle.' },
  { position: 7, title: 'Résolution systémique', description: 'La tendance naturelle si rien ne change.' },
];

interface DrawnCard {
  position: number;
  title: string;
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
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-lg overflow-hidden shadow-lg shadow-primary/20 bg-card p-2">
          <div className="relative h-full w-full">
            <Image src={cardBackUrl} alt="Dos de carte" fill className="object-contain" sizes="(max-width: 768px) 100vw, 33vw" priority={index < 3} />
          </div>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg overflow-hidden border border-primary/30 bg-secondary/20 p-1 text-center shadow-lg shadow-primary/20 backdrop-blur-lg flex flex-col items-center justify-between">
            <div className="relative flex-grow w-full my-1">
                <div className="relative h-full w-full">
                    <div className="absolute inset-0 bg-card rounded-md shadow-inner p-1">
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
            <p className="mt-1 font-body text-[10px] font-semibold text-card-foreground/90 leading-tight">
                {drawnCard.card.nom_carte}
            </p>
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
  const { toast } = useToast();

  const drawCards = useCallback(() => {
    setIsLoading(true);
    setIsRevealed(false);
    
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
      
      await interpretSystemicRevelation(input);

      toast({
        title: "Analyse en cours...",
        description: "L'IA interprète votre tirage. La fonctionnalité d'affichage sera bientôt disponible.",
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

            <div className="mx-auto max-w-md flex justify-center gap-4 mb-8">
                {!isRevealed ? (
                    <Button onClick={handleReveal} disabled={isLoading || drawnCards.length < 7}>
                        <Eye className="mr-2 h-4 w-4" /> Révéler les cartes
                    </Button>
                ) : (
                    <>
                        <Button onClick={drawCards} disabled={isLoading || isInterpreting}>
                            <Dices className="mr-2 h-4 w-4" /> Refaire le tirage
                        </Button>
                        <Button onClick={handleInterpret} disabled={isInterpreting || drawnCards.length < 7}>
                            {isInterpreting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            )}
                            Interpréter avec l'IA
                        </Button>
                    </>
                )}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 max-w-4xl mx-auto items-start">
                  {drawnCards.map((c, i) => (
                      <div key={c.position} className={`flex flex-col items-center text-center ${c.position === 7 ? 'col-span-2 md:col-span-1 md:col-start-2' : ''}`}>
                          <div className="mb-2 flex h-14 items-center justify-center">
                              <p className="text-xs text-white/80 px-2">{c.description}</p>
                          </div>
                          <div className="w-28 sm:w-32">
                              <CardSlot drawnCard={c} isRevealed={isRevealed} index={i} />
                          </div>
                      </div>
                  ))}
              </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
