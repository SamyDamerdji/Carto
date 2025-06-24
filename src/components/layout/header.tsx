"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-primary/10 bg-background/80 backdrop-blur-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M12 12V22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M16.121 9.497L7.878 13.62" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
             <path d="M12 2L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <span className="font-headline text-2xl font-bold text-primary">
            L'Oracle Royal
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#apprentissage"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Apprentissage
          </Link>
          <Link
            href="#entrainement"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Entraînement
          </Link>
          <Link
            href="#tirages"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Tirages
          </Link>
        </nav>
        <Button>Commencer</Button>
      </div>
    </header>
  );
}
