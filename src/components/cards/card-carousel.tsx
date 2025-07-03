
"use client";

import type { CardSummary } from "@/lib/data/cards";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CardCarouselProps {
  cards: CardSummary[];
}

export function CardCarousel({ cards }: CardCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-xs sm:max-w-sm mx-auto"
    >
      <CarouselContent>
        {cards.map((card) => (
          <CarouselItem key={card.id}>
            <div className="p-1">
              <div key={card.id} className="relative h-full overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-4 shadow-lg shadow-primary/20 backdrop-blur-lg flex flex-col">
                <div className="absolute -right-2 -top-2 h-16 w-16 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
                
                <h3 className="font-headline text-lg whitespace-nowrap font-bold text-center text-primary uppercase mb-2 h-7 flex items-center justify-center" style={{ textShadow: '0px 2px 3px rgba(0,0,0,0.7)' }}>
                  {card.nom_carte}
                </h3>
                
                <Link href={`/apprentissage/${card.id}`} className="block cursor-pointer group">
                  <div className="relative w-full aspect-[2.5/3.5]">
                    <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-105">
                        <div className="absolute inset-0 bg-card rounded-xl shadow-lg p-2">
                            <div className="relative h-full w-full">
                                <Image
                                src={card.image_url}
                                alt={`Image de la carte ${card.nom_carte}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 640px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-auto pt-4 flex flex-col gap-2">
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
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
