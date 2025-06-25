"use client";

import { cn } from "@/lib/utils";
import { BookOpen, BrainCircuit, Rows3 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    id: "apprentissage",
    icon: BookOpen,
    title: "Apprentissage Guidé",
    description: "Plongez dans la signification divinatoire de chaque carte. Des leçons claires et concises pour construire une base solide.",
  },
  {
    id: "entrainement",
    icon: BrainCircuit,
    title: "Entraînement Interactif",
    description: "Testez et renforcez vos connaissances avec des quiz assistés par IA. La mémorisation devient un jeu.",
  },
  {
    id: "tirages",
    icon: Rows3,
    title: "Tirages Personnalisés",
    description: "Découvrez ce que l'avenir vous réserve et laissez l'Oracle interpréter le message des cartes.",
  },
];

const FeatureCard = ({ feature, index }: { feature: (typeof features)[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative h-full overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-6 shadow-lg shadow-primary/20 backdrop-blur-lg"
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center gap-4">
          <feature.icon className="h-7 w-7 text-primary" />
          <h3 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">
            {feature.title}
          </h3>
        </div>
        <div className="mt-4 flex-grow rounded-lg border border-secondary-foreground/20 bg-card-foreground/25 p-4 shadow-lg shadow-black/20">
          <p className="text-secondary-foreground/90">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  );
};


export function Features() {
  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
      {features.map((feature, index) => (
        <div key={feature.id} id={feature.id} className="scroll-mt-24">
          <FeatureCard feature={feature} index={index} />
        </div>
      ))}
    </div>
  );
}
