'use client';

import type { ReactNode } from 'react';
import type { Card } from '@/lib/data/cards';
import { getCardDetails } from '@/lib/data/cards';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Briefcase,
  CircleDollarSign,
  Sparkles,
  Mic,
  Send,
  Sun,
  ShieldAlert,
  Layers,
  LayoutGrid,
  Link2,
  Lightbulb,
  Tags,
  NotebookText,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SectionWrapperProps {
  title: string;
  icon: React.ElementType;
  children: ReactNode;
}

const SectionWrapper = ({ title, icon: Icon, children }: SectionWrapperProps) => (
  <div className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="h-6 w-6 text-primary" />
      <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

export function CardDetailsView({ card }: { card: Card }) {
  const domainIcons: Record<string, ReactNode> = {
    amour: <Heart className="h-5 w-5" />,
    travail: <Briefcase className="h-5 w-5" />,
    finances: <CircleDollarSign className="h-5 w-5" />,
    spirituel: <Sparkles className="h-5 w-5" />,
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      {/* A. En-tête */}
      <div className="mx-auto mt-8 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl uppercase drop-shadow-lg">
          {card.nom_carte}
        </h1>
        <div className="mt-4 flex flex-col items-center">
          <div className="bg-card rounded-xl shadow-lg p-2 inline-block">
            <div className="relative w-[200px] aspect-[2.5/3.5]">
              <Image
                src={card.image_url}
                alt={`Image de la carte ${card.nom_carte}`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-white/90 text-center">
            {card.interpretations.endroit}
          </p>
        </div>
      </div>
      
      {/* C. Interprétations Détaillées */}
      <SectionWrapper title="Interprétations" icon={Layers}>
        <Tabs defaultValue="endroit" className="w-full">
          <TabsList className="h-auto grid grid-cols-2 items-stretch justify-around rounded-2xl bg-secondary/20 p-1.5 backdrop-blur-lg border border-primary/30 shadow-lg">
            <TabsTrigger
              value="endroit"
              className="flex h-auto flex-1 flex-col items-center gap-1 rounded-lg bg-transparent p-2 text-xs font-medium text-card-foreground/90 shadow-none ring-offset-0 transition-all duration-300 hover:bg-accent/20 hover:text-primary focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <Sun className="h-5 w-5" />
              <span>Aspect Lumineux</span>
            </TabsTrigger>
            <TabsTrigger
              value="ombre_et_defis"
              className="flex h-auto flex-1 flex-col items-center gap-1 rounded-lg bg-transparent p-2 text-xs font-medium text-card-foreground/90 shadow-none ring-offset-0 transition-all duration-300 hover:bg-accent/20 hover:text-primary focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <ShieldAlert className="h-5 w-5" />
              <span>Défis & Obstacles</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="endroit" className="mt-4 p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
            <p>{card.interpretations.general}</p>
          </TabsContent>
          <TabsContent value="ombre_et_defis" className="mt-4 p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
            <p>{card.interpretations.ombre_et_defis}</p>
          </TabsContent>
        </Tabs>
      </SectionWrapper>

      {/* D. Application par Domaine */}
      <SectionWrapper title="Application par Domaine" icon={LayoutGrid}>
        <Tabs defaultValue="amour" className="w-full">
          <TabsList className="h-auto grid grid-cols-4 items-stretch justify-around rounded-2xl bg-secondary/20 p-1.5 backdrop-blur-lg border border-primary/30 shadow-lg">
            {Object.keys(card.domaines).map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex h-auto flex-1 flex-col items-center gap-1 rounded-lg bg-transparent p-2 text-xs font-medium text-card-foreground/90 shadow-none ring-offset-0 transition-all duration-300 hover:bg-accent/20 hover:text-primary focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {domainIcons[key]}
                <span className="capitalize">{key}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(card.domaines).map(([key, value]) => (
            <TabsContent key={key} value={key} className="mt-4 p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
              <p>{value}</p>
            </TabsContent>
          ))}
        </Tabs>
      </SectionWrapper>
      
      {/* E. Associations Clés */}
      {card.combinaisons && card.combinaisons.length > 0 && (
        <SectionWrapper title="Associations Clés" icon={Link2}>
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

      {/* F. Le Conseil */}
      <SectionWrapper title="Le Conseil" icon={Lightbulb}>
        <div className="p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
          <p>{card.interpretations.conseil}</p>
        </div>
      </SectionWrapper>

      {/* G. Mots-clés */}
      <SectionWrapper title="Mots-clés" icon={Tags}>
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

      {/* H. Mes Notes Personnelles */}
       <SectionWrapper title="Mes Notes" icon={NotebookText}>
           <Textarea
               placeholder="Mes réflexions, associations personnelles, ou interprétations..."
               className="bg-secondary/20 backdrop-blur-lg border-primary/30 text-white placeholder:text-white/60 focus:border-primary focus-visible:ring-primary"
               rows={5}
           />
       </SectionWrapper>

       {/* I. Chat avec le Mentor IA */}
       <SectionWrapper title="Parler à l'oracle" icon={Sparkles}>
           <div className="space-y-4">
               {/* Placeholder for chat history */}
               <div className="h-40 p-4 rounded-lg border border-primary/30 bg-background/20 text-white/70 overflow-y-auto">
                   <p><span className="font-bold text-primary">L'Oracle:</span> Bonjour! En quoi puis-je vous éclairer sur le ${card.nom_carte} aujourd'hui ?</p>
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
