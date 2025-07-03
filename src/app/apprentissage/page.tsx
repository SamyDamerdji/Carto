
'use client';

import { useState, useCallback, memo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cardsList } from "@/lib/data/cards";
import type { CardColor } from "@/lib/data/cards";
import { CardCarousel } from "@/components/cards/card-carousel";
import { SuitNavigation } from "@/components/cards/suit-navigation";

const ApprentissagePageComponent = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSuitSelect = useCallback((suit: CardColor) => {
    const firstCardOfSuitIndex = cardsList.findIndex(card => card.couleur === suit);
    if (firstCardOfSuitIndex !== -1) {
      setActiveIndex(firstCardOfSuitIndex);
    }
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6">
            <div className="flex flex-col items-center text-center mb-6">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-title-foreground sm:text-5xl uppercase drop-shadow-lg">
                  Apprentissage
                </h1>
                <SuitNavigation onSuitSelect={handleSuitSelect} />
            </div>
            
            <CardCarousel 
              cards={cardsList}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
        </div>
      </main>
      <Footer />
    </div>
  );
}

ApprentissagePageComponent.displayName = "ApprentissagePage";
const ApprentissagePage = memo(ApprentissagePageComponent);
export default ApprentissagePage;
