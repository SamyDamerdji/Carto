'use client';

import type { ReactNode } from 'react';
import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Card } from '@/lib/data/cards';
import { getCardDetails } from '@/lib/data/cards';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Heart,
  Briefcase,
  CircleDollarSign,
  Sparkles,
  Layers,
  LayoutGrid,
  Link2,
  Tags,
  NotebookText,
  BrainCircuit,
  Aperture,
  HeartPulse,
  PlusCircle,
  MinusCircle,
  List,
  GraduationCap, // Placeholder for Conseil, using Sparkles
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SectionWrapperProps {
  title: string;
  icon: React.ElementType;
  children: ReactNode;
  index: number;
  action?: ReactNode;
}

const SectionWrapperComponent = ({ title, icon: Icon, children, index, action }: SectionWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, amount: 0.2 }}
    className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6"
  >
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">
          {title}
        </h2>
      </div>
      {action}
    </div>
    {children}
  </motion.div>
);
SectionWrapperComponent.displayName = 'SectionWrapper';
const SectionWrapper = memo(SectionWrapperComponent);


export function CardDetailsView({ card }: { card: Card }) {
  const domainIcons: Record<string, ReactNode> = {
    amour: <Heart className="h-5 w-5" />,
    travail: <Briefcase className="h-5 w-5" />,
    finances: <CircleDollarSign className="h-5 w-5" />,
    sante: <HeartPulse className="h-5 w-5" />,
    spirituel: <Sparkles className="h-5 w-5" />,
  };

  const orderedDomains = [
    { key: 'amour', data: card.domaines.amour },
    { key: 'travail', data: card.domaines.travail },
    { key: 'finances', data: card.domaines.finances },
    { key: 'sante', data: card.domaines.sante },
    { key: 'spirituel', data: card.domaines.spirituel },
  ];

  const hasCombinaisons = card.combinaisons && card.combinaisons.length > 0;
  
  const getArticle = (cardName: string) => {
    if (cardName.startsWith('As')) {
      return "l'";
    }
    if (cardName.startsWith('Dame')) {
      return 'la';
    }
    return 'le';
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-8 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6 text-center"
      >
        <div className="mt-4 flex flex-col items-center">
          <div className="bg-card rounded-xl shadow-lg p-1 inline-block">
            <div className="relative w-[200px] aspect-[2.5/3.5] p-2">
              <Image
                src={card.image_url}
                alt={`Image de la carte ${card.nom_carte}`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl uppercase drop-shadow-lg whitespace-nowrap mt-4">
            {card.nom_carte}
          </h1>
          <blockquote className="mt-2 text-lg italic text-white/90">
              "{card.phrase_cle.texte}"
          </blockquote>
          <p className="mt-4 text-sm text-white/90 text-center">
            {card.narration_base?.texte || card.interpretations.general.texte}
          </p>
          <div className="mt-6">
            <Link href={`/apprentissage/lecon/${card.id}`} passHref>
                <Button size="lg">
                    <BrainCircuit className="mr-2 h-5 w-5" />
                    Leçon interactive
                </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {card.symbolique_image && (
        <SectionWrapper title="Symbolique & Archétype" icon={Aperture} index={1}>
          <div className="p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
            <p>{card.symbolique_image}</p>
          </div>
        </SectionWrapper>
      )}

      <SectionWrapper title="Interprétations" icon={Layers} index={2}>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="font-headline text-lg hover:no-underline text-card-foreground/90">
                    <div className="flex items-center gap-3">
                       <Heart className="h-5 w-5" /><span>Aspect Lumineux</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-background/20 rounded-b-lg border-x border-b border-primary/20 text-white/90">
                    <p>{card.interpretations.endroit.texte}</p>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-2">
                <AccordionTrigger className="font-headline text-lg hover:no-underline text-card-foreground/90">
                    <div className="flex items-center gap-3">
                       <Briefcase className="h-5 w-5" /><span>Défis & Obstacles</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-background/20 rounded-b-lg border-x border-b border-primary/20 text-white/90">
                    <p>{card.interpretations.ombre_et_defis.texte}</p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </SectionWrapper>

      <SectionWrapper title="Significations par Domaine" icon={LayoutGrid} index={3}>
        <Accordion type="single" collapsible className="w-full">
            {orderedDomains.map(({ key, data }) => (
                 data && (
                    <AccordionItem value={`item-${key}`} key={key}>
                        <AccordionTrigger className="font-headline text-lg hover:no-underline text-card-foreground/90">
                            <div className="flex items-center gap-3">
                                {domainIcons[key]}
                                <span className="capitalize">{key}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-background/20 rounded-b-lg border-x border-b border-primary/20 text-white/90">
                            <p>{data.texte}</p>
                        </AccordionContent>
                    </AccordionItem>
                 )
            ))}
        </Accordion>
      </SectionWrapper>
      
      {hasCombinaisons && (
        <SectionWrapper title="Associations Clés" icon={Link2} index={4}>
          <ScrollArea className="h-96 w-full pr-4">
            <div className="space-y-4">
              {card.combinaisons.map((combo) => {
                const associatedCard = getCardDetails(combo.carte_associee_id);
                if (!associatedCard) return null;

                const article = getArticle(associatedCard.nom_carte);
                const formattedTitle = article === "l'"
                  ? `Avec ${article}${associatedCard.nom_carte}`
                  : `Avec ${article} ${associatedCard.nom_carte}`;

                return (
                  <div key={combo.carte_associee_id} className="flex items-center gap-4 rounded-2xl bg-secondary/20 p-3 backdrop-blur-lg border border-primary/30 shadow-md">
                    <div className="relative h-20 w-14 flex-shrink-0">
                        <div className="bg-card rounded-xl shadow-lg p-1 w-full h-full">
                            <div className="relative h-full w-full p-1">
                                <Image
                                    src={associatedCard.image_url}
                                    alt={associatedCard.nom_carte}
                                    fill
                                    className="object-contain"
                                    sizes="56px"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-bold text-primary">{formattedTitle}</p>
                      <p className="mt-1 text-white/90">{combo.signification}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </SectionWrapper>
      )}

      <SectionWrapper title="Le Conseil de l'Oracle" icon={Sparkles} index={5}>
        <div className="p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
          <p>{card.interpretations.conseil.texte}</p>
        </div>
      </SectionWrapper>

      <SectionWrapper title="Mots-clés" icon={Tags} index={6}>
        <Accordion type="single" collapsible className="w-full">
          {card.mots_cles.positifs.length > 0 && (
            <AccordionItem value="item-positifs">
              <AccordionTrigger className="font-headline text-lg hover:no-underline text-card-foreground/90">
                <div className="flex items-center gap-3">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  <span>Positifs</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-background/20 rounded-b-lg border-x border-b border-primary/20">
                <ul className="list-disc list-inside space-y-1 text-white/90">
                  {card.mots_cles.positifs.map((keyword, i) => <li key={`pos-${i}`}>{keyword}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          {card.mots_cles.negatifs.length > 0 && (
            <AccordionItem value="item-negatifs">
              <AccordionTrigger className="font-headline text-lg hover:no-underline text-card-foreground/90">
                <div className="flex items-center gap-3">
                  <MinusCircle className="h-5 w-5 text-primary" />
                  <span>Négatifs</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-background/20 rounded-b-lg border-x border-b border-primary/20">
                <ul className="list-disc list-inside space-y-1 text-white/90">
                  {card.mots_cles.negatifs.map((keyword, i) => <li key={`neg-${i}`}>{keyword}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          {card.mots_cles.neutres.length > 0 && (
            <AccordionItem value="item-neutres">
              <AccordionTrigger className="font-headline text-lg hover:no-underline text-card-foreground/90">
                <div className="flex items-center gap-3">
                  <List className="h-5 w-5 text-primary" />
                  <span>Neutres</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-background/20 rounded-b-lg border-x border-b border-primary/20">
                <ul className="list-disc list-inside space-y-1 text-white/90">
                  {card.mots_cles.neutres.map((keyword, i) => <li key={`neu-${i}`}>{keyword}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </SectionWrapper>

       <SectionWrapper title="Mes Notes" icon={NotebookText} index={7}>
           <Textarea
               placeholder="Mes réflexions, associations personnelles, ou interprétations..."
               className="bg-secondary/20 backdrop-blur-lg border-primary/30 text-white placeholder:text-white/60"
               rows={5}
           />
       </SectionWrapper>
    </div>
  );
}
