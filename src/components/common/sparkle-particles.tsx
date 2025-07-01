'use client';

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

interface SparkleParticlesProps {
  count?: number;
  className?: string;
}

const Sparkle = () => {
  // Use a longer duration for a slower, more magical effect
  const duration = useMemo(() => Math.random() * 5 + 4, []); // 4 to 9 seconds
  // Random delay for staggered start
  const delay = useMemo(() => Math.random() * 5, []); // 0 to 5 seconds
  // Random initial position within the container
  const initialX = useMemo(() => `${Math.random() * 100}%`, []);
  const initialY = useMemo(() => `${Math.random() * 100}%`, []);
  // Random size for variety
  const size = useMemo(() => Math.random() * 2.5 + 1, []); // 1px to 3.5px
  // Random horizontal drift
  const xDrift = useMemo(() => (Math.random() - 0.5) * 40, []); // -20px to 20px

  return (
    <motion.div
      className="absolute rounded-full bg-primary"
      style={{
        width: size,
        height: size,
        top: initialY,
        left: initialX,
        // Add a subtle golden glow
        boxShadow: '0 0 8px 1px hsl(var(--primary) / 0.7)',
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        // Particles will float upwards
        y: -100,
        // And drift slightly horizontally
        x: xDrift,
        // Fade in at the start, then out towards the end
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        ease: 'linear', // Use linear for a steady float
        repeat: Infinity,
        repeatType: 'loop',
      }}
    />
  );
};

export const SparkleParticles = ({ count = 50, className }: SparkleParticlesProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    // pointer-events-none ensures the particles don't block clicks on the image
    <div className={`pointer-events-none ${className || ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Sparkle key={i} />
      ))}
    </div>
  );
};
