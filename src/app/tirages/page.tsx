import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TiragesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pb-8 flex items-center justify-center">
        <div className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl uppercase">
              Tirages
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white">
              Cette section est en cours de construction. L'Oracle se prépare à vous dévoiler l'avenir.
            </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
