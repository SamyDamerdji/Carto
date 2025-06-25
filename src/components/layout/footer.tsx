export function Footer() {
  return (
    <footer className="w-full border-t border-primary/10 bg-background/50 py-4 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center md:px-6">
        <p className="text-sm text-foreground/60">
          © {new Date().getFullYear()} Le Cartomancien. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
