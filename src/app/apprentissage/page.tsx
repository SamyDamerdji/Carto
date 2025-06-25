import { Header } from "@/components/layout/header";
import { BookOpen, Palette, KeyRound } from "lucide-react";
import { InfoCard } from "@/components/common/info-card";

export default function ApprentissagePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <div className="flex flex-col items-center text-center my-8">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl uppercase">
              Signification de Sept<br/>de Coeur
            </h1>
        </div>
        
        <div className="space-y-6 max-w-2xl mx-auto">
          <InfoCard icon={BookOpen} title="Signification Générale">
            <p>
              Le Sept de Cœur est la carte du choix et de l'illusion. Elle représente une situation où de nombreuses options se présentent, mais où l'imagination et la rêverie prennent le pas sur la réalité. Il y a un risque de se perdre dans des fantasmes, d'idéaliser des personnes ou des situations, et de manquer de pragmatisme. C'est l'indécision causée par une surabondance de possibilités. La carte met en garde contre la procrastination et la dispersion, et invite à faire un choix éclairé et ancré dans le réel.
            </p>
          </InfoCard>

          <InfoCard icon={Palette} title="Archétype / Thème Principal">
            <p>Le Rêveur / Le Mirage Émotionnel</p>
          </InfoCard>

          <InfoCard icon={KeyRound} title="Mots-clés">
            <p>Choix, illusions, rêverie, fantasmes, indécision, procrastination, nécessité de pragmatisme, clarification.</p>
          </InfoCard>
        </div>
      </main>
    </div>
  );
}
