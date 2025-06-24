import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32 lg:py-40">
       <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.1),transparent)]"
      ></div>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
            Découvrez les Secrets des Cartes
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-foreground/80 md:text-xl">
            Maîtrisez l'art ancestral de la cartomancie traditionnelle.
            L'Oracle Royal est votre guide personnel pour apprendre, pratiquer et interpréter le langage des 52 cartes.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/apprentissage">
                Débuter l'initiation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary" asChild>
              <a href="#apprentissage">
                Explorer les fonctionnalités
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
