
'use client';

import type { SVGProps } from 'react';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import type { CardColor } from '@/lib/data/cards';

const HeartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
const DiamondIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L2 12l10 10 10-10L12 2z" />
  </svg>
);
const ClubIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="7.5" r="3.5" />
    <circle cx="7" cy="14" r="3.5" />
    <circle cx="17" cy="14" r="3.5" />
    <polygon points="12,11.5 10,20 14,20" />
  </svg>
);
const SpadeIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C7.9-2.5 3.5 3.1 3.5 8.5c0 4.2 4.1 6.3 8.5 13.5 4.4-7.2 8.5-9.3 8.5-13.5C20.5 3.1 16.1-2.5 12 2z" clipRule="evenodd" fillRule="evenodd" />
    </svg>
);

const suits: { name: CardColor, icon: JSX.Element }[] = [
  { name: 'Trèfle', icon: <ClubIcon className="w-6 h-6 text-primary" /> },
  { name: 'Cœur', icon: <HeartIcon className="w-6 h-6 text-primary" /> },
  { name: 'Pique', icon: <SpadeIcon className="w-6 h-6 text-primary" /> },
  { name: 'Carreau', icon: <DiamondIcon className="w-6 h-6 text-primary" /> },
];

interface SuitNavigationProps {
  onSuitSelect: (suit: CardColor) => void;
}
    
const SuitNavigationComponent = ({ onSuitSelect }: SuitNavigationProps) => {
    return (
        <div className="w-full max-w-xs flex justify-around items-center mt-6 p-1.5 rounded-2xl bg-secondary/20 backdrop-blur-lg border border-primary/30 shadow-lg">
            {suits.map(suit => (
                <Button 
                    key={suit.name}
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full text-primary hover:bg-primary/20 h-10 w-10"
                    onClick={() => onSuitSelect(suit.name)}
                    aria-label={`Aller à la couleur ${suit.name}`}
                >
                    {suit.icon}
                </Button>
            ))}
        </div>
    )
}

SuitNavigationComponent.displayName = 'SuitNavigation';
export const SuitNavigation = memo(SuitNavigationComponent);
