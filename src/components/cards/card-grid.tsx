"use client";

import type { CardSummary } from "@/lib/data/cards";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, BrainCircuit } from "lucide-react";

interface CardGridProps {
  cards: CardSummary[];
}

export function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div key={card.id} className="relative h-full overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-3 shadow-lg shadow-primary/20 backdrop-blur-lg flex flex-col">
          <div className="absolute -right-2 -top-2 h-16 w-16 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
          
          <div className="relative w-full aspect-[2.5/3.5]">
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
            <div className="absolute inset-0 z-10 bg-gradient-to-tl from-black/60 to-transparent rounded-xl"></div>
             <h3 className="absolute bottom-3 left-0 right-0 z-20 font-headline text-base font-bold text-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)] uppercase">
                {card.nom_carte}
            </h3>
          </div>

          <div className="mt-auto pt-3 flex flex-col gap-2">
            <Button variant="secondary" size="sm" disabled>
                <BrainCircuit />
                Leçon interactive
            </Button>
            <Button asChild size="sm">
              <Link href={`/apprentissage/${card.id}`}>
                <BookOpen />
                Fiche détaillée
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
