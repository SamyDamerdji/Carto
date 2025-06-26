import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
