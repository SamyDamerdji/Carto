'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cardsList } from '@/lib/data/cards';
import { ChevronLeft, ChevronRight, Dices } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CardNavigationProps {
  currentCardId: string;
}

export function CardNavigation({ currentCardId }: CardNavigationProps) {
  const router = useRouter();
  const currentIndex = cardsList.findIndex((card) => card.id === currentCardId);

  if (currentIndex === -1) {
    return null;
  }

  const prevCard = currentIndex > 0 ? cardsList[currentIndex - 1] : null;
  const nextCard = currentIndex < cardsList.length - 1 ? cardsList[currentIndex + 1] : null;

  const handleRandomClick = () => {
    let randomIndex;
    let randomCard;

    // Ensure we don't navigate to the same card
    do {
      randomIndex = Math.floor(Math.random() * cardsList.length);
      randomCard = cardsList[randomIndex];
    } while (cardsList.length > 1 && randomCard.id === currentCardId);

    if (randomCard) {
      router.push(`/apprentissage/${randomCard.id}`);
    }
  };


  // Header is sticky top-0 with p-4. Nav inside is about 56px high. Total height ~88px.
  // The new nav should be sticky below the header.
  return (
    <div className="w-full px-4 sticky top-[88px] z-40">
      <nav className="mx-auto flex max-w-md items-center justify-between rounded-2xl bg-secondary/20 p-1.5 backdrop-blur-lg border border-primary/30 shadow-lg">
        <Link
          href={prevCard ? `/apprentissage/${prevCard.id}` : '#'}
          aria-disabled={!prevCard}
          tabIndex={!prevCard ? -1 : undefined}
          className={cn(
            "flex flex-1 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors text-card-foreground/90 hover:bg-accent/20 hover:text-primary",
            !prevCard && "pointer-events-none opacity-50"
          )}
        >
          <ChevronLeft className="h-5 w-5 flex-shrink-0" />
          <span className="truncate hidden sm:inline">{prevCard ? prevCard.nom_carte : 'Début'}</span>
          <span className="truncate sm:hidden">Préc.</span>
        </Link>
        
        <div className="h-8 w-px bg-primary/30 shrink-0" />

        <Button
            variant="ghost"
            size="icon"
            onClick={handleRandomClick}
            className="text-primary hover:bg-primary/20 shrink-0"
            aria-label="Carte aléatoire"
        >
            <Dices className="h-5 w-5" />
        </Button>

        <div className="h-8 w-px bg-primary/30 shrink-0" />

        <Link
          href={nextCard ? `/apprentissage/${nextCard.id}` : '#'}
          aria-disabled={!nextCard}
          tabIndex={!nextCard ? -1 : undefined}
          className={cn(
            "flex flex-1 items-center justify-end gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors text-card-foreground/90 hover:bg-accent/20 hover:text-primary text-right",
            !nextCard && "pointer-events-none opacity-50"
          )}
        >
          <span className="truncate hidden sm:inline">{nextCard ? nextCard.nom_carte : 'Fin'}</span>
          <span className="truncate sm:hidden">Suiv.</span>
          <ChevronRight className="h-5 w-5 flex-shrink-0" />
        </Link>
      </nav>
    </div>
  );
}
