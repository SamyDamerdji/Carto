'use client';

import { Features } from "@/components/sections/features";
import Image from "next/image";
import { motion } from "framer-motion";
import { SparkleParticles } from "@/components/common/sparkle-particles";

export function Hero() {
  return (
    <section className="w-full overflow-hidden py-4 md:py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <div
            className="w-full flex justify-center"
            style={{ transform: "translateY(8px)" }}
          >
            <motion.div
              animate={{
                scale: [1, 1.015, 1],
                filter: [
                  "drop-shadow(0 0 6px hsl(var(--primary) / 0.7))",
                  "drop-shadow(0 0 16px hsl(var(--primary) / 1))",
                  "drop-shadow(0 0 6px hsl(var(--primary) / 0.7))",
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "loop",
              }}
            >
              <Image
                src="https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/assets/cartomancien2.png"
                alt="Le Cartomancien"
                width={1024}
                height={226}
                className="mx-auto object-contain w-11/12 max-w-[450px]"
                priority
              />
            </motion.div>
          </div>
          
          <motion.div
            className="relative -mt-12 md:-mt-16 w-full max-w-2xl"
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

          <p className="mt-1 max-w-3xl text-lg text-white md:text-xl">
            Maîtrise l'art ancestral de la cartomancie traditionnelle.
            Le Cartomancien est votre guide personnel pour apprendre, pratiquer et interpréter le langage des 52 cartes.
          </p>
        </div>
        <div className="mt-3">
          <Features />
        </div>
      </div>
    </section>
  );
}
