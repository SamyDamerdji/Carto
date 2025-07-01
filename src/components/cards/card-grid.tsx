"use client";

import type { CardSummary } from "@/lib/data/cards";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";

interface CardGridProps {
  cards: CardSummary[];
}

export function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div key={card.id} className="relative h-full overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-3 shadow-lg shadow-primary/20 backdrop-blur-lg flex flex-col">
          <div className="absolute -right-2 -top-2 h-16 w-16 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
          
          <h3 className="font-headline text-xs whitespace-nowrap font-bold text-center text-primary uppercase mb-2 h-5 flex items-center justify-center" style={{ textShadow: '0px 2px 3px rgba(0,0,0,0.7)' }}>
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
      ))}
    </div>
  );
}
