"use client";

import type { CardSummary } from "@/lib/data/cards";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardGridProps {
  cards: CardSummary[];
}

const colorClasses = {
  "Coeur": "hover:shadow-red-400/40",
  "Carreau": "hover:shadow-blue-400/40",
  "Trèfle": "hover:shadow-green-400/40",
  "Pique": "hover:shadow-gray-400/40",
}

export function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-6">
      {cards.map((card, index) => (
        <Link href={`/apprentissage/${card.id}`} key={card.id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className={cn(
                "group relative aspect-[2.5/3.5] w-full overflow-hidden rounded-2xl bg-white p-2 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl",
                colorClasses[card.couleur]
            )}
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image
                src={card.image_url}
                alt={`Image de la carte ${card.nom_carte}`}
                fill
                className="object-contain transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent to-80%" />
              <div className="absolute bottom-0 left-0 p-2 md:p-3">
                <h3 className="font-headline text-sm md:text-base font-bold text-white [text-shadow:0_2px_3px_rgba(0,0,0,0.9)]">
                  {card.nom_carte}
                </h3>
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
