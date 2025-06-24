import { Features } from "@/components/sections/features";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24">
       <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.1),transparent)]"
      ></div>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Le Cartomancien
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-foreground/70 md:text-xl">
            Maîtrisez l'art ancestral de la cartomancie traditionnelle.
            Le Cartomancien est votre guide personnel pour apprendre, pratiquer et interpréter le langage des 52 cartes.
          </p>
        </div>
        <div className="mt-16">
          <Features />
        </div>
      </div>
    </section>
  );
}
