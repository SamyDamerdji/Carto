
"use client";

import { Header } from "@/components/layout/header";
import { 
  ArrowLeft, 
  Heart, 
  Briefcase, 
  Coins, 
  Sparkles,
  Mic,
  Send
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { getCardDetails, cardsList } from "@/lib/data/cards";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { ReactNode } from "react";

const getAssociatedCardImage = (id: string) => {
  return cardsList.find(c => c.id === id)?.image_url;
};

const Section = ({ title, children, className }: { title: string, children: ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-4 shadow-lg shadow-primary/20 backdrop-blur-lg md:p-6 ${className}`}>
    <div className="absolute -right-4 -top-4 h-24 w-24 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
    <div className="relative z-10">
      <h2 className="font-headline text-2xl font-bold uppercase tracking-wider text-primary mb-4">{title}</h2>
      {children}
    </div>
  </div>
);

const DomainCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: ReactNode }) => (
  <div className="relative h-full overflow-hidden rounded-xl border border-primary/30 bg-secondary/20 p-4 shadow-md shadow-primary/10 backdrop-blur-lg">
    <div className="absolute -right-2 -top-2 h-16 w-16 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
    <div className="relative z-10 flex h-full flex-col">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="h-7 w-7 text-primary" />
        <h3 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">{title}</h3>
      </div>
      <div className="flex-grow rounded-lg border border-secondary-foreground/20 bg-card-foreground/10 p-3 shadow-inner shadow-black/20">
        <p className="text-secondary-foreground/90 text-sm">{children}</p>
      </div>
    </div>
  </div>
);

export default function CardDetailsPage({ params }: { params: { cardId: string } }) {
  const card = getCardDetails(params.cardId);

  if (!card) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="container mx-auto px-4 pb-12">
        <div className="my-8">
          <Button asChild variant="outline">
            <Link href="/apprentissage">
              <ArrowLeft />
              Retour à la liste
            </Link>
          </Button>
        </div>

        {/* A. En-tête */}
        <header className="text-center mb-8">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl uppercase drop-shadow-lg">
            {card.nom_carte}
          </h1>
          <div className="relative w-full max-w-sm aspect-[2.5/3.5] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 mx-auto mt-6">
            <Image
              src={card.image_url}
              alt={`Image de la carte ${card.nom_carte}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </header>

        <div className="space-y-8 max-w-4xl mx-auto">
          {/* B. Synthèse */}
          <Section title="Synthèse">
            <p className="italic text-lg text-center text-foreground/90 my-4 p-4 border border-primary/20 rounded-lg bg-black/10">
              « {card.phrase_cle} »
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {card.mots_cles.map(keyword => (
                <Badge key={keyword} variant="secondary" className="text-sm">{keyword}</Badge>
              ))}
            </div>
          </Section>

          {/* C. Interprétations Détaillées */}
          <Section title="Interprétations">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="lumineux">Aspect Lumineux</TabsTrigger>
                <TabsTrigger value="defis">Défis & Obstacles</TabsTrigger>
                <TabsTrigger value="conseil">Le Conseil</TabsTrigger>
              </TabsList>
              <div className="mt-4 p-4 rounded-lg border border-secondary-foreground/20 bg-card-foreground/10 shadow-inner text-secondary-foreground/90">
                <TabsContent value="general"><p>{card.interpretations.general}</p></TabsContent>
                <TabsContent value="lumineux"><p>{card.interpretations.endroit}</p></TabsContent>
                <TabsContent value="defis"><p>{card.interpretations.ombre_et_defis}</p></TabsContent>
                <TabsContent value="conseil"><p>{card.interpretations.conseil}</p></TabsContent>
              </div>
            </Tabs>
          </Section>

          {/* D. Application par Domaine */}
          <Section title="Application par Domaine">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DomainCard icon={Heart} title="Amour">{card.domaines.amour}</DomainCard>
                <DomainCard icon={Briefcase} title="Travail">{card.domaines.travail}</DomainCard>
                <DomainCard icon={Coins} title="Finances">{card.domaines.finances}</DomainCard>
                <DomainCard icon={Sparkles} title="Spirituel">{card.domaines.spirituel}</DomainCard>
            </div>
          </Section>
          
          {/* E. Associations Clés */}
          {card.combinaisons && card.combinaisons.length > 0 && (
            <Section title="Associations Clés">
              <div className="space-y-4">
                {card.combinaisons.map((combo, index) => {
                  const associatedCardImage = getAssociatedCardImage(combo.carte_associee_id);
                  return (
                    <div key={index} className="flex items-center gap-4 relative overflow-hidden rounded-xl border border-primary/30 bg-secondary/20 p-4 shadow-md shadow-primary/10 backdrop-blur-sm">
                      {associatedCardImage && (
                        <div className="flex-shrink-0 relative w-16 aspect-[2.5/3.5] rounded-md overflow-hidden border border-primary/50">
                          <Image src={associatedCardImage} alt={`Image de la carte associée`} fill className="object-cover" />
                        </div>
                      )}
                      <p className="text-sm text-foreground/90">{combo.signification}</p>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* F. Mes Notes Personnelles */}
          <Section title={`Mes Notes sur le ${card.nom_carte}`}>
            <Textarea 
              className="bg-secondary/20 border-primary/30 min-h-[120px] text-base placeholder:text-muted-foreground"
              placeholder="Mes réflexions, associations personnelles, ou interprétations..." 
            />
          </Section>
          
          {/* G. Discuter avec le Mentor */}
          <Section title="Discuter avec le Mentor">
            <div className="space-y-4">
              <div className="h-48 border border-primary/30 rounded-lg p-3 overflow-y-auto bg-secondary/20 text-sm text-muted-foreground flex items-center justify-center">
                 <p>La conversation avec le mentor apparaîtra ici.</p>
              </div>
              <div className="flex gap-2">
                 <Input 
                   className="bg-secondary/20 border-primary/30 flex-grow text-base placeholder:text-muted-foreground"
                   placeholder="Posez votre question ici..."
                 />
                 <Button variant="outline" size="icon" aria-label="Saisie vocale">
                   <Mic className="h-5 w-5 text-primary" />
                 </Button>
                 <Button variant="default" size="icon" aria-label="Envoyer">
                   <Send className="h-5 w-5" />
                 </Button>
              </div>
            </div>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
