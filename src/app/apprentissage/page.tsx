import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cardsList } from "@/lib/data/cards";
import { CardCarousel } from "@/components/cards/card-carousel";

export default function ApprentissagePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="mx-auto mt-8 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6">
            <div className="flex flex-col items-center text-center mb-6">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl uppercase drop-shadow-lg">
                  Apprentissage
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-white">
                  Faites défiler les cartes pour explorer leur signification.
                </p>
            </div>
            
            <CardCarousel cards={cardsList} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
