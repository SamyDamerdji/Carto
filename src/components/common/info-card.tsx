'use client';

import type { ElementType, ReactNode } from "react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface InfoCardProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
  textContentToSpeak?: string;
}

export function InfoCard({ icon: Icon, title, children, textContentToSpeak }: InfoCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = useCallback(() => {
    if (!textContentToSpeak) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any other speech that might be playing
    const utterance = new SpeechSynthesisUtterance(textContentToSpeak);
    utterance.lang = 'fr-FR';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  }, [textContentToSpeak, isSpeaking]);

  // Cleanup speech on component unmount
  useEffect(() => {
    return () => {
      // Check if an utterance is speaking and cancel it
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-6 shadow-lg shadow-primary/20 backdrop-blur-lg">
       <div className="absolute -right-4 -top-4 h-24 w-24 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.1),transparent)]"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Icon className="h-7 w-7 text-primary" />
                <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">{title}</h2>
            </div>
            {textContentToSpeak && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSpeak}
                    className="text-primary hover:bg-primary/20"
                    aria-label={isSpeaking ? "Arrêter la lecture" : "Lancer la synthèse vocale"}
                >
                    {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
            )}
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
