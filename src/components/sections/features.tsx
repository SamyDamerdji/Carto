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
    description: "Testez et renforcez vos connaissances avec des quiz ludiques et adaptatifs. La mémorisation devient un jeu.",
  },
  {
    id: "tirages",
    icon: Rows3,
    title: "Tirages Personnalisés",
    description: "Utilisez des dispositions classiques pour vos tirages. Sauvegardez vos lectures et suivez l'évolution de votre intuition.",
  },
];

const FeatureCard = ({ feature, index }: { feature: (typeof features)[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/25 p-8 shadow-xl backdrop-blur-md"
    >
      <div
        className="absolute right-0 top-0 h-32 w-32 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)] -translate-y-1/2 translate-x-1/2"
      ></div>
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <feature.icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-headline text-2xl font-bold text-primary">
          {feature.title}
        </h3>
      </div>
      <p className="mt-4 text-card-foreground/80">{feature.description}</p>
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
