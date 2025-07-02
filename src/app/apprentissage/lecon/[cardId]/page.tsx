
'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCardDetails } from '@/lib/data/cards';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CardNavigation } from '@/components/cards/card-navigation';

const loadingMessages = [
  "L'oracle consulte les astres...",
  "Les cartes murmurent leurs secrets...",
  "Préparation de votre leçon...",
  "Alignement des énergies...",
];

export default function LeconInteractivePage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const cardBackUrl = "https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/back.png";

  const card = useMemo(() => {
    if (!cardId) return null;
    return getCardDetails(cardId);
  }, [cardId]);
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

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

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <CardNavigation currentCardId={cardId} />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6 text-center min-h-[400px] flex flex-col justify-center items-center"
        >
            <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90 whitespace-nowrap">Leçon : {card.nom_carte}</h2>
            
            <div className="[perspective:1000px] w-[150px] aspect-[2.5/3.5] my-4">
                <motion.div
                    className="relative w-full h-full [transform-style:preserve-3d]"
                    animate={{ rotateY: 360 }}
                    transition={{
                        duration: 4,
                        ease: "linear",
                        repeat: Infinity,
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
            <p className="text-center text-xs text-white/70 mt-4">La logique des leçons interactives est en cours de refonte.</p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
