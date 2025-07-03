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

const variants = {
  enter: (direction: number) => {
    return {
      rotateY: direction > 0 ? -180 : 180,
      opacity: 0,
      scale: 0.9,
    };
  },
  center: {
    zIndex: 1,
    rotateY: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      rotateY: direction > 0 ? 180 : -180,
      opacity: 0,
      scale: 0.9,
    };
  },
};

export function CardCarousel({ cards, activeIndex, setActiveIndex }: CardCarouselProps) {
  const router = useRouter();
  const [direction, setDirection] = React.useState(0);
  const flipSoundRef = React.useRef<HTMLAudioElement | null>(null);

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
  
  const playSound = () => {
    if (flipSoundRef.current) {
      flipSoundRef.current.currentTime = 0;
      flipSoundRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  };
  
  const paginate = (newDirection: number) => {
    playSound();
    setActiveIndex((prev) => {
        if (newDirection > 0) {
            return prev === cards.length - 1 ? 0 : prev + 1;
        }
        return prev === 0 ? cards.length - 1 : prev - 1;
    });
    setDirection(newDirection);
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.y < -swipeThreshold) {
      paginate(1);
    } else if (info.offset.y > swipeThreshold) {
      paginate(-1);
    } else if (Math.abs(info.offset.y) < 5) { // It's a click/tap
      router.push(`/apprentissage/${cards[activeIndex].id}`);
    }
  };

  const activeCard = cards[activeIndex];

  if (!activeCard) {
    return null; // or a loading state
  }
  
  return (
    <div className="w-full flex flex-col items-center">
      <audio ref={flipSoundRef} src="https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/sounds/flipcard-91468.mp3" preload="auto" className="hidden" />
      {/* Card Container */}
      <div className="relative w-full max-w-sm h-[320px] flex items-center justify-center" style={{ perspective: '1200px' }}>
        <motion.button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-[60] text-primary/70 hover:text-primary transition-colors"
            onClick={() => paginate(-1)}
            aria-label="Carte précédente"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
        >
            <ChevronLeft className="h-8 w-8" />
        </motion.button>
        
        <div
            className="relative w-48 h-[270px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: 'preserve-3d' }}
        >
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={activeIndex}
                    className="absolute w-full h-full flex items-center justify-center cursor-pointer"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        rotateY: { type: "tween", duration: 0.4, ease: "easeInOut" },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.4 },
                    }}
                    drag="y"
                    onDragEnd={onDragEnd}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElasticity={0.1}
                    style={{ rotateX, rotateY }}
                >
                    <div className="relative w-48 aspect-[2.5/3.5] pointer-events-none">
                        <div className="absolute inset-0 bg-card rounded-lg shadow-lg p-1">
                            <div className="relative h-full w-full p-2">
                                <Image
                                    src={activeCard.image_url}
                                    alt={`Image de la carte ${activeCard.nom_carte}`}
                                    fill
                                    className="object-contain"
                                    sizes="192px"
                                    priority
                                />
                            </div>
                            <motion.div
                                className="absolute inset-0 rounded-lg mix-blend-overlay"
                                style={{
                                background: useTransform(
                                    [rotateX, rotateY],
                                    ([latestX, latestY]) => `radial-gradient(at ${50 - (latestY as number) * 2}% ${50 + (latestX as number) * 2}%, rgba(255,255,255,0.2), transparent 80%)`
                                )
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        <motion.button
            className="absolute right-2 top-1/2 -translate-y-1/2 z-[60] text-primary/70 hover:text-primary transition-colors"
            onClick={() => paginate(1)}
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
