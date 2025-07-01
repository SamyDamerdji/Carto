'use client';

import { Features } from "@/components/sections/features";
import Image from "next/image";
import { motion } from "framer-motion";
import { SparkleParticles } from "@/components/common/sparkle-particles";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-12 md:py-16">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg bg-gradient-to-r from-accent to-primary text-transparent bg-clip-text">
            Le Cartomancien
          </h1>
          
          <motion.div
            className="relative mt-4 w-full max-w-2xl"
            animate={{
              y: ["-8px", "8px"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            {/* The image and particles are wrapped to contain the effect */}
            <div className="relative">
              <Image
                src="https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/eventail.png"
                alt="Éventail de cartes à jouer"
                width={1024}
                height={512}
                className="mx-auto object-contain"
                priority
              />
              <SparkleParticles
                count={40}
                className="absolute inset-0"
              />
            </div>
          </motion.div>

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
