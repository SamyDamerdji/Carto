'use client';

import type { ElementType, ReactNode } from "react";
import { useState, useCallback, useEffect, useRef, memo } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { textToSpeech } from "@/ai/flows/tts-flow";
import { audioPlayerManager } from "@/lib/audio-manager";
import { useToast } from "@/hooks/use-toast";

interface InfoCardProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
  textContentToSpeak?: string;
  playOnMount?: boolean;
}

const InfoCardComponent = ({ icon: Icon, title, children, textContentToSpeak, playOnMount = false }: InfoCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAutoPlayed = useRef(false);
  const { toast } = useToast();

  const handleSpeak = useCallback(async () => {
    if (!textContentToSpeak || isLoading) return;

    if (isPlaying && audioRef.current) {
      audioPlayerManager.pause();
      return;
    }

    if (audioRef.current && audioRef.current.src && audioRef.current.readyState > 0 && !audioRef.current.ended) {
      audioPlayerManager.play(audioRef.current)?.catch(e => console.error("Audio play failed", e));
      return;
    }

    setIsLoading(true);
    try {
      const result = await textToSpeech(textContentToSpeak);
      if (result && result.media && audioRef.current) {
        audioRef.current.src = result.media;
        await audioPlayerManager.play(audioRef.current);
      }
    } catch (error) {
      console.error("TTS generation error", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
      toast({
        variant: 'destructive',
        title: "Erreur de synthèse vocale",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [textContentToSpeak, isLoading, isPlaying, toast]);

  useEffect(() => {
    const autoPlay = async () => {
      if (!textContentToSpeak || !audioRef.current) return;
      setIsLoading(true);
      try {
        const { media } = await textToSpeech(textContentToSpeak);
        if (media && audioRef.current) {
          audioRef.current.src = media;
          await audioPlayerManager.play(audioRef.current);
        }
      } catch (error) {
        console.error("TTS auto-play generation error", error);
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
        toast({
          variant: 'destructive',
          title: "Erreur de synthèse vocale",
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (playOnMount && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      autoPlay();
    }
  }, [playOnMount, textContentToSpeak, toast]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const onPlay = () => setIsPlaying(true);
    const onPauseOrEnded = () => setIsPlaying(false);

    audioElement.addEventListener('play', onPlay);
    audioElement.addEventListener('pause', onPauseOrEnded);
    audioElement.addEventListener('ended', onPauseOrEnded);
    
    return () => {
        audioElement.removeEventListener('play', onPlay);
        audioElement.removeEventListener('pause', onPauseOrEnded);
        audioElement.removeEventListener('ended', onPauseOrEnded);
        if (audioPlayerManager.current === audioElement) {
            audioPlayerManager.pause();
        }
    };
  }, []);

  useEffect(() => {
    const currentAudioEl = audioRef.current;
    return () => {
        if (currentAudioEl && audioPlayerManager.current === currentAudioEl) {
            audioPlayerManager.pause();
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

InfoCardComponent.displayName = 'InfoCard';
export const InfoCard = memo(InfoCardComponent);
