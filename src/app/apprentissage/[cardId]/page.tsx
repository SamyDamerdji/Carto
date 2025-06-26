import { Header } from "@/components/layout/header";
import { BookOpen, Palette, KeyRound, ArrowLeft, Users, Brain, Coins, Sparkles } from "lucide-react";
import { InfoCard } from "@/components/common/info-card";
import { Footer } from "@/components/layout/footer";
import { getCardDetails, cardsList } from "@/lib/data/cards";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  return cardsList.map((card) => ({
    cardId: card.id,
  }));
}

export default function CardDetailsPage({ params }: { params: { cardId: string } }) {
  const card = getCardDetails(params.cardId);

  if (!card) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="my-8">
            <Button asChild variant="outline">
                <Link href="/apprentissage">
                    <ArrowLeft />
                    Retour à la liste
                </Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col items-center space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl uppercase text-center">
              {card.nom_carte}
            </h1>
            <div className="relative w-full max-w-sm aspect-[2.5/3.5] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border-2 border-primary/50">
              <Image
                src={card.image_url}
                alt={`Image de la carte ${card.nom_carte}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <InfoCard icon={BookOpen} title="Signification Générale">
              <p>{card.resume_general}</p>
            </InfoCard>

            <InfoCard icon={Palette} title="Phrase Clé">
              <p className="italic">« {card.phrase_cle} »</p>
            </InfoCard>

            <InfoCard icon={KeyRound} title="Mots-clés">
              <div className="flex flex-wrap gap-2">
                {card.mots_cles.map(keyword => (
                  <Badge key={keyword} variant="secondary">{keyword}</Badge>
                ))}
              </div>
            </InfoCard>
          </div>
        </div>

        <div className="mt-12 space-y-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl uppercase text-center">Interprétations Détaillées</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard icon={Users} title="Amour"><p>{card.domaines.amour}</p></InfoCard>
                <InfoCard icon={Brain} title="Travail"><p>{card.domaines.travail}</p></InfoCard>
                <InfoCard icon={Coins} title="Finances"><p>{card.domaines.finances}</p></InfoCard>
                <InfoCard icon={Sparkles} title="Spirituel"><p>{card.domaines.spirituel}</p></InfoCard>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
