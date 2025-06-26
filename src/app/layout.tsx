import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Cinzel, EB_Garamond } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800'],
});

const APP_NAME = "L'Oracle Royal";
const APP_DESCRIPTION = "Apprenez et mémorisez les significations divinatoires des 52 cartes à jouer.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#191970",
  display: "fullscreen",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head />
      <body className={cn(
        "font-body antialiased",
        "min-h-screen bg-background",
        "bg-[url('https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/fond.png')] bg-cover bg-center bg-fixed",
        cinzel.variable,
        ebGaramond.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
