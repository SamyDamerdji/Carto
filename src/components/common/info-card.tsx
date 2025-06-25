import type { ElementType, ReactNode } from "react";

interface InfoCardProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
}

export function InfoCard({ icon: Icon, title, children }: InfoCardProps) {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-6 shadow-lg shadow-primary/20 backdrop-blur-lg">
       <div className="absolute -right-4 -top-4 h-24 w-24 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-4">
          <Icon className="h-7 w-7 text-primary" />
          <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">{title}</h2>
        </div>
        <div className="mt-4 rounded-lg border border-secondary-foreground/30 bg-card-foreground/25 p-4 shadow-lg shadow-black/20">
          <div className="space-y-2 text-secondary-foreground/90">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
