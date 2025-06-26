"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Target, Stars } from "lucide-react";
import { memo } from "react";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/apprentissage", label: "Apprentissage", icon: BookOpen },
  { href: "/entrainement", label: "Entraînement", icon: Target },
  { href: "/tirages", label: "Tirages", icon: Stars },
];

const HeaderComponent = () => {
  const pathname = usePathname();

  return (
    <header className="w-full p-4 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-md items-center justify-around rounded-2xl bg-secondary/20 p-1.5 backdrop-blur-lg border border-primary/30 shadow-lg">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : item.href !== "#" && pathname.startsWith(item.href);
          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-300",
                isActive
                  ? "text-primary"
                  : "text-card-foreground/90 hover:bg-accent/20 hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

HeaderComponent.displayName = "Header";

export const Header = memo(HeaderComponent);
