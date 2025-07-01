import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Cinzel, EB_Garamond } from 'next/font/google';
import { PwaInstaller } from '@/components/pwa-installer';

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

const APP_NAME = "Le Cartomancien";
const APP_DESCRIPTION = "Apprenez et mémorisez les significations divinatoires des 52 cartes à jouer.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: "https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/icons/icon-512x512.png",
    apple: "https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/icons/icon-512x512.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2d2d4c",
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
        "font-body antialiased min-h-dvh bg-background",
        "bg-[url('https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/fond.png')] bg-cover bg-center bg-fixed",
        cinzel.variable,
        ebGaramond.variable
      )}>
        <PwaInstaller />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
