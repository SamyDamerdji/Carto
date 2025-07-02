'use client';

import { Features } from "@/components/sections/features";
import Image from "next/image";
import { motion } from "framer-motion";
import { SparkleParticles } from "@/components/common/sparkle-particles";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-8 md:py-8">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              animate={{
                scale: [1, 1.01, 1],
                filter: [
                  "drop-shadow(0 0 4px hsl(var(--primary) / 0.6))",
                  "drop-shadow(0 0 12px hsl(var(--primary) / 0.9))",
                  "drop-shadow(0 0 4px hsl(var(--primary) / 0.6))",
                ],
              }}
              transition={{
                duration: 3.5,
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
          </motion.div>
          
          <motion.div
            className="relative -mt-6 md:-mt-8 w-full max-w-2xl"
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

          <p className="mt-2 max-w-3xl text-lg text-white md:text-xl">
            Maîtrise l'art ancestral de la cartomancie traditionnelle.
            Le Cartomancien est votre guide personnel pour apprendre, pratiquer et interpréter le langage des 52 cartes.
          </p>
        </div>
        <div className="mt-6">
          <Features />
        </div>
      </div>
    </section>
  );
}
