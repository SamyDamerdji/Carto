"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Crosshair, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/apprentissage", label: "Apprentissage", icon: BookOpen },
  { href: "#", label: "Entraînement", icon: Crosshair },
  { href: "#", label: "Tirages", icon: Sparkles },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full p-4 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-md items-center justify-around rounded-2xl bg-secondary/30 p-1.5 backdrop-blur-lg border border-white/10 shadow-lg">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : item.href !== "#" && pathname.startsWith(item.href);
          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-300",
                isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "text-foreground/70 hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                !isActive && "text-primary"
              )} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
