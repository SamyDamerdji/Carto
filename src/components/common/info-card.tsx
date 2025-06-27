'use client';

import type { ElementType, ReactNode } from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { textToSpeech } from "@/ai/flows/tts-flow";

interface InfoCardProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
  textContentToSpeak?: string;
}

export function InfoCard({ icon: Icon, title, children, textContentToSpeak }: InfoCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSpeak = useCallback(async () => {
    if (!textContentToSpeak || isLoading) return;

    // If audio is currently playing, pause it.
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // If audio is loaded but paused, play it.
    if (!isPlaying && audioRef.current && audioRef.current.src && audioRef.current.readyState > 0 && !audioRef.current.ended) {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
      setIsPlaying(true);
      return;
    }

    // If audio is not loaded, generate it.
    setIsLoading(true);
    try {
      const result = await textToSpeech(textContentToSpeak);
      if (result && result.media && audioRef.current) {
        audioRef.current.src = result.media;
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("TTS generation error", error);
    } finally {
      setIsLoading(false);
    }
  }, [textContentToSpeak, isLoading, isPlaying]);

  useEffect(() => {
    const audioElement = audioRef.current;
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    if (audioElement) {
      audioElement.addEventListener('ended', onEnded);
      audioElement.addEventListener('play', onPlay);
      audioElement.addEventListener('pause', onPause);
      return () => {
        audioElement.removeEventListener('ended', onEnded);
        audioElement.removeEventListener('play', onPlay);
        audioElement.removeEventListener('pause', onPause);
      };
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    }
  }, []);

  const ButtonIcon = isLoading ? Loader2 : (isPlaying ? VolumeX : Volume2);
  const buttonLabel = isLoading ? "Génération..." : (isPlaying ? "Arrêter la lecture" : "Lancer la synthèse vocale");

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-primary/30 bg-secondary/20 p-6 shadow-lg shadow-primary/20 backdrop-blur-lg">
      <audio ref={audioRef} preload="none" />
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
              disabled={isLoading}
              className="text-primary hover:bg-primary/20"
              aria-label={buttonLabel}
            >
              <ButtonIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
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