import { BookOpen, BrainCircuit, Rows3 } from "lucide-react";
import { FeatureCard } from "@/components/sections/feature-card";

const features = [
  {
    id: "apprentissage",
    icon: <BookOpen className="h-7 w-7 text-primary" />,
    title: "Apprentissage",
    description: "Plongez dans la signification divinatoire de chaque carte. Des leçons claires et concises pour construire une base solide.",
  },
  {
    id: "entrainement",
    icon: <BrainCircuit className="h-7 w-7 text-primary" />,
    title: "Entraînement Interactif",
    description: "Testez et renforcez vos connaissances avec des quiz assistés par IA. La mémorisation devient un jeu.",
  },
  {
    id: "tirages",
    icon: <Rows3 className="h-7 w-7 text-primary" />,
    title: "Tirages Personnalisés",
    description: "Découvrez ce que l'avenir vous réserve et laissez l'Oracle interpréter le message des cartes.",
  },
];

export function Features() {
  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
      {features.map((feature, index) => (
        <div key={feature.id} id={feature.id} className="scroll-mt-24">
          <FeatureCard
            index={index}
            title={feature.title}
            description={feature.description}
          >
            {feature.icon}
          </FeatureCard>
        </div>
      ))}
    </div>
  );
}
