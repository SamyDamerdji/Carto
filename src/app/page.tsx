import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
    </div>
  );
}
