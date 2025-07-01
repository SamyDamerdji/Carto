'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export function ParallaxBackground() {
  const { scrollY } = useScroll();
  // Lorsque l'utilisateur fait défiler la page de 1000px, l'arrière-plan se déplace de 150px.
  // Cela crée un effet de parallaxe subtil et élégant.
  const y = useTransform(scrollY, [0, 1000], [0, 150]); 

  return (
    <div className="fixed inset-0 z-[-2]">
      <motion.div
        className="absolute inset-[-20%] bg-cover bg-center" // L'inset négatif empêche de voir les bords de l'image lors du mouvement.
        style={{
          backgroundImage: 'url(https://raw.githubusercontent.com/SamyDamerdji/Divinator/main/cards/fond.png)',
          y, // Applique la transformation de parallaxe
        }}
      />
      {/* Cette couche ajoute l'effet de flou et d'assombrissement sur le fond */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
    </div>
  );
}
