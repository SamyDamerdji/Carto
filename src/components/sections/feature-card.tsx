"use client";

import type { ReactNode } from "react";
import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  children: ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCardComponent = ({ children, title, description, index, className, ...props }: FeatureCardProps & React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true, amount: 0.3 }}
      className={cn(
        "relative h-full overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-6 shadow-lg shadow-primary/20 backdrop-blur-lg",
        className
      )}
      {...props}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center gap-4">
          {children}
          <h3 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">
            {title}
          </h3>
        </div>
        <div className="mt-4 flex-grow rounded-lg border border-secondary-foreground/30 bg-card-foreground/25 p-4 shadow-lg shadow-black/20">
          <p className="text-secondary-foreground/90">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

FeatureCardComponent.displayName = 'FeatureCard';
export const FeatureCard = memo(FeatureCardComponent);
