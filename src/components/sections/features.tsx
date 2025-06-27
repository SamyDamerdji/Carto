import { BookOpen, BrainCircuit, Stars } from "lucide-react";
import { FeatureCard } from "@/components/sections/feature-card";
import Link from "next/link";

const features = [
  {
    id: "apprentissage",
    icon: <BookOpen className="h-7 w-7 text-primary" />,
    title: "Apprentissage",
    description: "Plongez dans la signification divinatoire de chaque carte. Des leçons claires et concises pour construire une base solide.",
    href: "/apprentissage",
  },
  {
    id: "entrainement",
    icon: <BrainCircuit className="h-7 w-7 text-primary" />,
    title: "Entraînement",
    description: "Testez et renforcez vos connaissances avec des quiz assistés par IA. La mémorisation devient un jeu.",
    href: "#",
  },
  {
    id: "tirages",
    icon: <Stars className="h-7 w-7 text-primary" />,
    title: "Tirages",
    description: "Découvrez ce que l'avenir vous réserve et laissez l'Oracle interpréter le message des cartes.",
    href: "/tirages",
  },
];

export function Features() {
  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Link href={feature.href} key={feature.id} className="h-full">
          <FeatureCard
            id={feature.id}
            className="scroll-mt-24 h-full"
            index={index}
            title={feature.title}
            description={feature.description}
          >
            {feature.icon}
          </FeatureCard>
        </Link>
      ))}
    </div>
  );
}
