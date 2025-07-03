import { memo } from 'react';

const FooterComponent = () => {
  return (
    <footer className="w-full py-4">
      <div className="container mx-auto px-4 text-center md:px-6">
        <p className="text-sm text-card-foreground/90">
          © {new Date().getFullYear()} Le Cartomancien. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

FooterComponent.displayName = 'Footer';
export const Footer = memo(FooterComponent);
