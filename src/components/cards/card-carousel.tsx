'use client';

import * as React from 'react';
import { useState } from 'react';
import type { CardSummary } from '@/lib/data/cards';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BrainCircuit, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface CardCarouselProps {
  cards: CardSummary[];
}

export function CardCarousel({ cards }: CardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragThreshold = 50;
    if (info.offset.y > dragThreshold) {
      handlePrev();
    } else if (info.offset.y < -dragThreshold) {
      handleNext();
    }
  };

  const activeCard = cards[activeIndex];

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div
        className="relative w-full max-w-xs h-[400px] cursor-grab active:cursor-grabbing"
        drag="y"
        onDragEnd={onDragEnd}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
      >
        <div
          className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-secondary/80 to-transparent z-20 pointer-events-none"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-secondary/80 to-transparent z-20 pointer-events-none"
        />
        <AnimatePresence>
          {cards.map((card, index) => {
            const offset = index - activeIndex;
            
            if (Math.abs(offset) > 3) {
              return null; // Only render a few cards for performance
            }

            const scale = 1 - Math.abs(offset) * 0.15;
            const translateY = offset * 50; // Adjust vertical spacing
            const zIndex = cards.length - Math.abs(offset);

            return (
              <motion.div
                key={card.id}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  transformOrigin: 'center',
                  zIndex,
                }}
                initial={{ y: translateY, scale: 0.5, opacity: 0 }}
                animate={{ y: translateY, scale, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                  <div className="relative w-4/5 aspect-[2.5/3.5] pointer-events-none">
                      <div className="absolute inset-0 bg-card rounded-2xl shadow-lg p-1">
                          <div className="relative h-full w-full p-2">
                              <Image
                                src={card.image_url}
                                alt={`Image de la carte ${card.nom_carte}`}
                                fill
                                className="object-contain"
                                sizes="250px"
                              />
                          </div>
                      </div>
                  </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      <div className="relative z-30 -mt-12 flex flex-col items-center w-full max-w-xs">
          <AnimatePresence mode="wait">
            <motion.h3 
                key={activeCard.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="font-headline text-xl whitespace-nowrap font-bold text-center text-primary uppercase h-10 flex items-center justify-center mb-2" style={{ textShadow: '0px 2px 3px rgba(0,0,0,0.7)' }}>
                {activeCard.nom_carte}
            </motion.h3>
          </AnimatePresence>

          <div className="flex flex-col gap-2 w-full">
              <Link href={`/apprentissage/${activeCard.id}`} passHref>
                  <Button variant="secondary" size="sm" className="text-xs w-full">
                      Fiche détaillée
                  </Button>
              </Link>
              <Link href={`/apprentissage/lecon/${activeCard.id}`} passHref>
                  <Button variant="default" size="sm" className="text-xs w-full">
                      <BrainCircuit />
                      Leçon interactive
                  </Button>
              </Link>
          </div>

           <div className="flex justify-center w-full mt-4 gap-4">
              <Button onClick={handlePrev}><ChevronUp className="mr-2"/> Précédente</Button>
              <Button onClick={handleNext}>Suivante <ChevronDown className="ml-2"/></Button>
          </div>
      </div>
    </div>
  );
}
