'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeatureCard } from "@/components/sections/feature-card";
import { Stars } from "lucide-react";
import Link from "next/link";

const tirages = [
  {
    id: "revelation-systemique",
    icon: <Stars className="h-7 w-7 text-primary" />,
    title: "Révélation Systémique",
    description: "Analysez les forces, tensions et dynamiques cachées d'une situation relationnelle ou collective complexe avec ce tirage de 7 cartes.",
    href: "/tirages/revelation-systemique",
  },
];

export default function TiragesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="mx-auto mt-8 max-w-2xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl uppercase drop-shadow-lg">
              Les Tirages
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white">
              Explorez les dynamiques de votre vie à travers la sagesse des cartes.
            </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto grid gap-8">
          {tirages.map((tirage, index) => (
            <Link href={tirage.href} key={tirage.id} className="h-full">
                <FeatureCard
                  index={index}
                  title={tirage.title}
                  description={tirage.description}
                >
                  {tirage.icon}
                </FeatureCard>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
