'use client';

import * as React from 'react';
import type { CardSummary } from '@/lib/data/cards';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BrainCircuit, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface CardCarouselProps {
  cards: CardSummary[];
  activeIndex: number;
  setActiveIndex: (index: number | ((prevIndex: number) => number)) => void;
}

export function CardCarousel({ cards, activeIndex, setActiveIndex }: CardCarouselProps) {
  const router = useRouter();
  const wasDragged = React.useRef(false);

  // --- Logic for 3D effect ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  // --- End of 3D effect logic ---
  
  const handleNext = React.useCallback(() => {
    setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  }, [cards.length, setActiveIndex]);

  const handlePrev = React.useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  }, [cards.length, setActiveIndex]);

  const handleTap = (event: MouseEvent | TouchEvent | PointerEvent) => {
    if (!wasDragged.current) {
        router.push(`/apprentissage/${cards[activeIndex].id}`);
    }
    wasDragged.current = false;
  };

  const onDragStart = () => {
    wasDragged.current = false;
  };
  
  const onDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.y) > 5) {
        wasDragged.current = true;
    }
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (wasDragged.current) {
        const swipeThreshold = 50;
        if (info.offset.y > swipeThreshold) {
            handlePrev();
        } else if (info.offset.y < -swipeThreshold) {
            handleNext();
        }
    }
  };

  const activeCard = cards[activeIndex];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Card Stack Container */}
      <div className="relative w-full max-w-sm h-[320px] flex items-center justify-center" style={{ perspective: '800px' }}>
        <motion.button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-[60] text-primary/70 hover:text-primary transition-colors"
            onClick={handlePrev}
            aria-label="Carte précédente"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
        >
            <ChevronLeft className="h-8 w-8" />
        </motion.button>
        
        <motion.div
            className="relative w-48 h-[270px] cursor-pointer"
            drag="y"
            onTap={handleTap}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElasticity={0.1}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: 'preserve-3d' }}
        >
            <AnimatePresence initial={false}>
            {cards.map((card, index) => {
                const offset = index - activeIndex;
                const isActive = index === activeIndex;

                if (Math.abs(offset) > 3) {
                    return null;
                }

                const scale = 1 - Math.abs(offset) * 0.15;
                const translateY = offset * 30;
                const zIndex = cards.length - Math.abs(offset);

                return (
                <motion.div
                    key={card.id}
                    className="absolute w-full h-full flex items-center justify-center pointer-events-none"
                    style={{
                        transformOrigin: 'center',
                        zIndex,
                        transformStyle: 'preserve-3d',
                        ...(isActive && { rotateX, rotateY }),
                    }}
                    initial={{ y: translateY > 0 ? 100 : -100, scale: 0.5, opacity: 0 }}
                    animate={{ y: translateY, scale, opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                    <div className="relative w-48 aspect-[2.5/3.5]">
                        <div className="absolute inset-0 bg-card rounded-lg shadow-lg p-1">
                            <div className="relative h-full w-full p-2">
                                <Image
                                    src={card.image_url}
                                    alt={`Image de la carte ${card.nom_carte}`}
                                    fill
                                    className="object-contain"
                                    sizes="192px"
                                    priority={index === activeIndex}
                                />
                            </div>
                            {isActive && (
                                <motion.div
                                    className="absolute inset-0 rounded-lg mix-blend-overlay pointer-events-none"
                                    style={{
                                    background: useTransform(
                                        [rotateX, rotateY],
                                        ([latestX, latestY]) => `radial-gradient(at ${50 - (latestY as number) * 2}% ${50 + (latestX as number) * 2}%, rgba(255,255,255,0.2), transparent 80%)`
                                    )
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </motion.div>
                );
            })}
            </AnimatePresence>
        </motion.div>

        <motion.button
            className="absolute right-2 top-1/2 -translate-y-1/2 z-[60] text-primary/70 hover:text-primary transition-colors"
            onClick={handleNext}
            aria-label="Carte suivante"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
        >
            <ChevronRight className="h-8 w-8" />
        </motion.button>
      </div>
      
      {/* Controls and Info Container */}
      <div className="flex flex-col items-center w-full max-w-xs mt-4">
          <AnimatePresence mode="wait">
            <motion.h3 
                key={activeCard.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="font-headline text-xl whitespace-nowrap font-bold text-center text-primary uppercase h-10 flex items-center justify-center mb-2" 
                style={{ textShadow: '0px 2px 3px rgba(0,0,0,0.7)' }}>
                {activeCard.nom_carte}
            </motion.h3>
          </AnimatePresence>

          <div className="flex flex-col gap-2 w-full">
              <Link href={`/apprentissage/${activeCard.id}`} passHref>
                  <Button variant="secondary" size="sm" className="text-xs w-full">
                      <FileText className="mr-2"/>
                      Fiche détaillée
                  </Button>
              </Link>
              <Link href={`/apprentissage/lecon/${activeCard.id}`} passHref>
                  <Button variant="default" size="sm" className="text-xs w-full">
                      <BrainCircuit className="mr-2"/>
                      Leçon interactive
                  </Button>
              </Link>
          </div>
      </div>
    </div>
  );
}