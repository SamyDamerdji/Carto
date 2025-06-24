import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: "Le Cartomancien",
  description: "Apprenez et mémorisez les significations divinatoires des 52 cartes à jouer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(
        "font-body antialiased",
        "min-h-screen bg-background",
        "bg-[url('https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/fond.png')] bg-cover bg-center bg-fixed"
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
