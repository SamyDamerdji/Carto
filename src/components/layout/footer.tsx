import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-primary/10 bg-background/50 py-6 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6">
        <p className="text-sm text-foreground/60">
          © {new Date().getFullYear()} L'Oracle Royal. Tous droits réservés.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm text-foreground/80 hover:text-foreground hover:underline">
            Termes & Conditions
          </Link>
          <Link href="#" className="text-sm text-foreground/80 hover:text-foreground hover:underline">
            Politique de confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
