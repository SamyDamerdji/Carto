"use client";

import * as React from "react";
import type { CardSummary } from "@/lib/data/cards";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface CardCarouselProps {
  cards: CardSummary[];
}

export function CardCarousel({ cards }: CardCarouselProps) {
  return (
    <div className="w-full flex justify-center">
        <Carousel
        opts={{
            align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-xs"
        >
        <CarouselContent className="-mt-1 h-[480px]">
            {cards.map((card, index) => (
            <CarouselItem key={index} className="pt-1 basis-full">
                <div className="p-1">
                    <div className="relative w-full h-[470px] overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-4 shadow-lg shadow-primary/20 backdrop-blur-lg flex flex-col">
                        <h3 className="font-headline text-lg whitespace-nowrap font-bold text-center text-primary uppercase mb-2 h-7 flex items-center justify-center" style={{ textShadow: '0px 2px 3px rgba(0,0,0,0.7)' }}>
                        {card.nom_carte}
                        </h3>
                        
                        <Link href={`/apprentissage/${card.id}`} className="block cursor-pointer flex-grow group">
                            <div className="relative w-full h-full">
                                <div className="absolute inset-0 bg-card rounded-xl shadow-lg p-1 transition-transform duration-300 group-hover:scale-105">
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
                        </Link>
                        
                        <div className="mt-auto pt-3 flex flex-col gap-2">
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
        </Carousel>
    </div>
  );
}
