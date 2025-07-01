import { Features } from "@/components/sections/features";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-12 md:py-16">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg">
            Le Cartomancien
          </h1>
          
          <div className="relative mt-4 w-full max-w-2xl">
            <Image
              src="https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/eventail.png"
              alt="Éventail de cartes à jouer"
              width={1024}
              height={512}
              className="mx-auto object-contain"
              priority
            />
          </div>

          <p className="mt-6 max-w-3xl text-lg text-white md:text-xl">
            Maîtrise l'art ancestral de la cartomancie traditionnelle.
            Le Cartomancien est votre guide personnel pour apprendre, pratiquer et interpréter le langage des 52 cartes.
          </p>
        </div>
        <div className="mt-8">
          <Features />
        </div>
      </div>
    </section>
  );
}
