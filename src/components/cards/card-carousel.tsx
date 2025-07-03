"use client";

import type { CardSummary } from "@/lib/data/cards";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BrainCircuit, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

interface CardCarouselProps {
  cards: CardSummary[];
}

export function CardCarousel({ cards }: CardCarouselProps) {
  const [index, setIndex] = useState(Math.floor(cards.length / 2));

  const handleNext = () => {
    if (index < cards.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };
  
  const canGoNext = index < cards.length - 1;
  const canGoPrev = index > 0;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative h-[420px] w-full" style={{ perspective: "1000px" }}>
        {cards.map((card, i) => {
          const offset = i - index;
          const isVisible = Math.abs(offset) <= 2;

          return (
            <motion.div
              key={card.id}
              className="absolute w-[200px]"
              style={{
                transformStyle: "preserve-3d",
                top: "50%",
                left: "50%",
                marginTop: "-190px",
                marginLeft: "-100px",
              }}
              animate={{
                x: offset * 110,
                rotateY: offset * -25,
                scale: 1 - Math.abs(offset) * 0.2,
                zIndex: cards.length - Math.abs(offset),
                opacity: isVisible ? 1 : 0,
                transition: { type: "spring", stiffness: 100, damping: 20 },
              }}
            >
              <div className="relative w-full h-[380px] overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-4 shadow-lg shadow-primary/20 backdrop-blur-lg flex flex-col">
                <motion.h3 
                  animate={{ opacity: offset === 0 ? 1 : 0, y: offset === 0 ? 0 : -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-headline text-base whitespace-nowrap font-bold text-center text-primary uppercase mb-2 h-7 flex items-center justify-center" style={{ textShadow: '0px 2px 3px rgba(0,0,0,0.7)' }}>
                  {card.nom_carte}
                </motion.h3>
                
                <Link href={`/apprentissage/${card.id}`} className="block cursor-pointer flex-grow">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-card rounded-xl shadow-lg p-1">
                        <div className="relative h-full w-full p-2">
                            <Image
                              src={card.image_url}
                              alt={`Image de la carte ${card.nom_carte}`}
                              fill
                              className="object-contain"
                              sizes="200px"
                            />
                        </div>
                    </div>
                  </div>
                </Link>
                
                <motion.div 
                  animate={{ opacity: offset === 0 ? 1 : 0, y: offset === 0 ? 0 : 10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-auto pt-3 flex flex-col gap-2">
                  <Link href={`/apprentissage/${card.id}`} passHref>
                      <Button variant="secondary" size="sm" className="text-xs w-full">
                          Fiche détaillée
                      </Button>
                  </Link>
                  <Link href={`/apprentissage/lecon/${card.id}`} passHref>
                      <Button variant="default" size="sm" className="text-xs w-full">
                          <BrainCircuit />
                          Leçon interactive
                      </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <Button onClick={handlePrev} size="icon" variant="outline" disabled={!canGoPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button onClick={handleNext} size="icon" variant="outline" disabled={!canGoNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
