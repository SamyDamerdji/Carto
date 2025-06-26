'use client';

import type { ReactNode } from 'react';
import type { Card } from '@/lib/data/cards';
import { getCardDetails } from '@/lib/data/cards';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Briefcase, CircleDollarSign, Sparkles, Mic, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SectionWrapperProps {
  title: string;
  children: ReactNode;
}

const SectionWrapper = ({ title, children }: SectionWrapperProps) => (
  <div className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6">
    <h2 className="font-headline text-2xl font-bold tracking-tight text-primary uppercase drop-shadow-lg mb-4">
      {title}
    </h2>
    {children}
  </div>
);

export function CardDetailsView({ card }: { card: Card }) {
  const domainIcons: Record<string, ReactNode> = {
    amour: <Heart className="h-6 w-6 text-primary" />,
    travail: <Briefcase className="h-6 w-6 text-primary" />,
    finances: <CircleDollarSign className="h-6 w-6 text-primary" />,
    spirituel: <Sparkles className="h-6 w-6 text-primary" />,
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      {/* A. En-tête */}
      <div className="mx-auto mt-8 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl uppercase drop-shadow-lg">
          {card.nom_carte}
        </h1>
        <div className="relative w-full max-w-[240px] mx-auto aspect-[2.5/3.5] mt-4">
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

      {/* B. Synthèse */}
      <SectionWrapper title="Synthèse">
        <blockquote className="border-l-4 border-primary pl-4 italic text-white/90 my-4">
          {card.phrase_cle}
        </blockquote>
        <div className="flex flex-wrap gap-2">
          {card.mots_cles.map((mot) => (
            <Badge key={mot} variant="secondary" className="bg-primary/20 text-primary-foreground/90 border border-primary/50">
              {mot}
            </Badge>
          ))}
        </div>
      </SectionWrapper>

      {/* C. Interprétations Détaillées */}
      <SectionWrapper title="Interprétations">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto flex-wrap md:grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="endroit">Aspect Lumineux</TabsTrigger>
            <TabsTrigger value="ombre_et_defis">Défis & Obstacles</TabsTrigger>
            <TabsTrigger value="conseil">Le Conseil</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4 p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
            <p>{card.interpretations.general}</p>
          </TabsContent>
          <TabsContent value="endroit" className="mt-4 p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
            <p>{card.interpretations.endroit}</p>
          </TabsContent>
          <TabsContent value="ombre_et_defis" className="mt-4 p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
            <p>{card.interpretations.ombre_et_defis}</p>
          </TabsContent>
          <TabsContent value="conseil" className="mt-4 p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
            <p>{card.interpretations.conseil}</p>
          </TabsContent>
        </Tabs>
      </SectionWrapper>

      {/* D. Application par Domaine */}
      <SectionWrapper title="Application par Domaine">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.entries(card.domaines).map(([key, value]) => (
             <div key={key} className="rounded-xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-md">
               <div className="flex items-center gap-3 mb-2">
                 {domainIcons[key]}
                 <h3 className="font-headline text-lg font-semibold capitalize text-primary">{key}</h3>
               </div>
               <p className="text-sm text-white/80">{value}</p>
             </div>
          ))}
        </div>
      </SectionWrapper>
      
      {/* E. Associations Clés */}
      {card.combinaisons && card.combinaisons.length > 0 && (
        <SectionWrapper title="Associations Clés">
            <div className="space-y-4">
                {card.combinaisons.map((combo) => {
                    const associatedCard = getCardDetails(combo.carte_associee_id);
                    if (!associatedCard) return null;
                    return (
                        <div key={combo.carte_associee_id} className="flex items-center gap-4 rounded-xl bg-secondary/20 p-3 backdrop-blur-lg border border-primary/30 shadow-md">
                            <div className="relative h-24 w-16 flex-shrink-0">
                                <Image
                                    src={associatedCard.image_url}
                                    alt={associatedCard.nom_carte}
                                    fill
                                    className="object-contain rounded-md"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white/80">{combo.signification}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </SectionWrapper>
      )}

      {/* F. Mes Notes Personnelles */}
       <SectionWrapper title={`Mes Notes sur le ${card.nom_carte}`}>
           <Textarea
               placeholder="Mes réflexions, associations personnelles, ou interprétations..."
               className="bg-secondary/20 backdrop-blur-lg border-primary/30 text-white placeholder:text-white/60 focus:border-primary focus-visible:ring-primary"
               rows={5}
           />
       </SectionWrapper>

       {/* G. Chat avec le Mentor IA */}
       <SectionWrapper title="Discuter avec le Mentor">
           <div className="space-y-4">
               {/* Placeholder for chat history */}
               <div className="h-40 p-4 rounded-lg border border-primary/30 bg-background/20 text-white/70 overflow-y-auto">
                   <p><span className="font-bold text-primary">Le Mentor:</span> Bonjour! En quoi puis-je vous éclairer sur le {card.nom_carte} aujourd'hui ?</p>
               </div>
               <div className="flex items-center gap-2">
                   <Input
                       type="text"
                       placeholder="Posez votre question ici..."
                       className="bg-secondary/20 backdrop-blur-lg border-primary/30 text-white placeholder:text-white/60 focus:border-primary focus-visible:ring-primary"
                   />
                   <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/20">
                       <Mic className="h-5 w-5" />
                   </Button>
                   <Button variant="default" size="icon" className="bg-primary hover:bg-primary/90">
                       <Send className="h-5 w-5" />
                   </Button>
               </div>
           </div>
       </SectionWrapper>

    </div>
  );
}
