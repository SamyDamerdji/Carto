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
import { Loader2, Dices, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const cardPositions = [
  { position: 1, title: 'Polarité dominante', description: 'La figure ou l’énergie la plus influente du système.' },
  { position: 2, title: 'Polarité opposée', description: 'Le contre-pouvoir ou la résistance active.' },
  { position: 3, title: 'Figure médiatrice ou instable', description: 'L’élément perturbateur ou stabilisateur.' },
  { position: 4, title: 'Tension n°1', description: 'Source de conflit latente ou blessure non verbalisée.' },
  { position: 5, title: 'Tension n°2', description: 'Élément extérieur perturbateur (pression sociale, peur).' },
  { position: 6, title: 'Tension n°3', description: 'Impulsion interne ou émotionnellement chargée.' },
  { position: 7, title: 'Résolution systémique', description: 'La tendance naturelle du système si rien ne change.' },
];

interface DrawnCard {
  position: number;
  title: string;
  description: string;
  card: CardSummary;
}

export default function RevelationSystemiquePage() {
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const { toast } = useToast();

  const drawCards = useCallback(() => {
    setIsLoading(true);
    const shuffled = [...cardsList].sort(() => 0.5 - Math.random());
    const newDraw = cardPositions.map((pos, index) => ({
      ...pos,
      card: shuffled[index],
    }));
    setDrawnCards(newDraw);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    drawCards();
  }, [drawCards]);

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
      
      // We call the function but don't display the result yet as per instructions.
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

  const CardDisplay = ({ drawnCard, index }: { drawnCard: DrawnCard; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-4 text-center shadow-lg shadow-primary/20 backdrop-blur-lg"
    >
      <div className="absolute -right-2 -top-2 h-16 w-16 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
      <h3 className="font-headline text-lg font-bold uppercase tracking-wider text-primary">
        {drawnCard.title}
      </h3>
      <p className="mb-3 text-sm text-white/80 h-10">{drawnCard.description}</p>
      <div className="relative w-[150px] aspect-[2.5/3.5]">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-card rounded-xl shadow-lg p-2">
            <div className="relative h-full w-full">
              {drawnCard.card && (
                <Image
                  src={drawnCard.card.image_url}
                  alt={`Image de la carte ${drawnCard.card.nom_carte}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 font-body text-base font-semibold text-card-foreground/90">
        {drawnCard.card.nom_carte}
      </p>
    </motion.div>
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="text-center my-8">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl uppercase drop-shadow-lg">
            Tirage Révélation Systémique
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-white">
            Analyse des forces et dynamiques relationnelles
          </p>
        </div>

        <div className="mx-auto max-w-md flex justify-center gap-4 mb-8">
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
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {drawnCards.slice(0, 3).map((c, i) => <CardDisplay key={c.position} drawnCard={c} index={i} />)}
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {drawnCards.slice(3, 6).map((c, i) => <CardDisplay key={c.position} drawnCard={c} index={i + 3} />)}
            </div>
            {/* Row 3 */}
            <div className="flex justify-center">
              <div className="w-full md:w-1/3">
                 {drawnCards.slice(6, 7).map((c, i) => <CardDisplay key={c.position} drawnCard={c} index={i + 6} />)}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
