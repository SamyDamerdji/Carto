import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cardsList } from "@/lib/data/cards";
import { CardGrid } from "@/components/cards/card-grid";

export default function ApprentissagePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="flex flex-col items-center text-center my-8">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl uppercase">
              Apprentissage
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white">
              Explorez la signification de chaque carte. Cliquez sur une carte pour en apprendre plus.
            </p>
        </div>
        
        <CardGrid cards={cardsList} />
        
      </main>
      <Footer />
    </div>
  );
}
