export function Footer() {
  return (
    <footer className="w-full py-4">
      <div className="container mx-auto px-4 text-center md:px-6">
        <p className="text-sm text-foreground/80">
          © {new Date().getFullYear()} Le Cartomancien. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
