'use client';

import type { ReactNode } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Card } from '@/lib/data/cards';
import { getCardDetails } from '@/lib/data/cards';
import { chatWithOracle } from '@/ai/flows/oracle-flow';
import { textToSpeech } from '@/ai/flows/tts-flow';
import Image from 'next/image';
import {
  Mic,
  MicOff,
  Send,
  Loader2,
  Volume2,
  VolumeX,
  BrainCircuit,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { audioPlayerManager } from '@/lib/audio-manager';
import { notFound, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CardNavigation } from '@/components/cards/card-navigation';

export default function LeconInteractivePage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const card = getCardDetails(cardId);
  const lessonStarted = useRef(false);

  const [messages, setMessages] = useState<{ role: 'user' | 'oracle'; content: string }[]>([]);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const clearSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  const playTts = useCallback(async (text: string) => {
    if (!isTtsEnabled || !text) return;

    setIsTtsLoading(true);
    try {
        const { media } = await textToSpeech(text);
        if (media && ttsAudioRef.current) {
            ttsAudioRef.current.src = media;
            await audioPlayerManager.play(ttsAudioRef.current);
        }
    } catch (ttsError) {
        console.error("TTS generation error", ttsError);
        toast({
            variant: 'destructive',
            title: 'Erreur de Synthèse Vocale',
            description: "Impossible de générer l'audio pour ce message.",
        });
    } finally {
        setIsTtsLoading(false);
    }
  }, [isTtsEnabled, toast]);

  const handleMicTimeout = useCallback(async () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
    toast({
        title: "Reprise de la leçon",
        description: "L'oracle continue car aucune réponse n'a été détectée.",
        duration: 3000,
    });
    
    const silenceMessageForAI = "(L'utilisateur est resté silencieux. Continue la leçon.)";
    const newHistory = [...messagesRef.current, { role: 'user' as const, content: silenceMessageForAI }];

    setIsLoading(true);
    try {
      if (!card) return;
      const oracleResponseText = await chatWithOracle({ card: card, history: newHistory });
      const oracleMessage = { role: 'oracle' as const, content: oracleResponseText };
      setMessages(prev => [...prev, oracleMessage]);
      await playTts(oracleResponseText);
    } catch (error) {
      console.error("Error calling oracle flow on timeout:", error);
      const errorMessage = { role: 'oracle' as const, content: "Désolé, une erreur s'est produite. Je ne peux pas répondre pour le moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [card, playTts, toast]);

  const handleMicClick = useCallback(() => {
    if (isLoading) return;
  
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      clearSilenceTimeout();
      return;
    }
  
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Non supporté',
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur.",
      });
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
  
    recognitionRef.current = recognition;
  
    recognition.onstart = () => {
      setIsRecording(true);
      clearSilenceTimeout();
      silenceTimeoutRef.current = setTimeout(handleMicTimeout, 4000);
    };
  
    recognition.onresult = (event) => {
      clearSilenceTimeout();
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };
  
    recognition.onerror = (event) => {
      clearSilenceTimeout();
      console.error('Speech recognition error:', event.error);
      let errorMessage = "Une erreur est survenue avec la reconnaissance vocale.";
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = "L'accès au microphone est refusé. Veuillez l'autoriser dans les paramètres de votre navigateur.";
      } else if (event.error === 'no-speech') {
        errorMessage = "Aucun son n'a été détecté. Veuillez réessayer.";
      }
      toast({
        variant: 'destructive',
        title: 'Erreur de saisie vocale',
        description: errorMessage,
      });
    };
  
    recognition.onend = () => {
      clearSilenceTimeout();
      setIsRecording(false);
      recognitionRef.current = null;
    };
  
    setInputValue('');
    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast({
        variant: 'destructive',
        title: 'Erreur de saisie vocale',
        description: "Impossible de démarrer l'enregistrement.",
      });
      setIsRecording(false);
      recognitionRef.current = null;
    }
  }, [isLoading, isRecording, toast, handleMicTimeout]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    audioPlayerManager.pause();
    if (ttsAudioRef.current) ttsAudioRef.current.src = "";
    
    const userMessage = { role: 'user' as const, content: inputValue };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!card) return;
      const oracleResponseText = await chatWithOracle({
        card: card,
        history: newHistory,
      });
      
      const oracleMessage = { role: 'oracle' as const, content: oracleResponseText };
      setMessages(prev => [...prev, oracleMessage]);
      await playTts(oracleResponseText);
    } catch (error) {
      console.error("Error calling oracle flow:", error);
      const errorMessage = { role: 'oracle' as const, content: "Désolé, une erreur s'est produite. Je ne peux pas répondre pour le moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, inputValue, messages, card, playTts]);
  
  useEffect(() => {
    if (!card || lessonStarted.current) return;
    lessonStarted.current = true;
    
    const startLesson = async () => {
      audioPlayerManager.pause();
      setIsLoading(true);
      setMessages([]);
      try {
        const initialMessage = await chatWithOracle({ card, history: [] });
        const assistantMessage = { role: 'oracle' as const, content: initialMessage };
        setMessages([assistantMessage]);
        await playTts(initialMessage);
      } catch (error) {
        console.error("Error starting lesson:", error);
        toast({
            variant: 'destructive',
            title: 'Erreur de l\'Oracle',
            description: "Désolé, je ne parviens pas à préparer la leçon pour le moment.",
        });
        setMessages([{ role: 'oracle', content: "Désolé, je ne parviens pas à préparer la leçon pour le moment." }]);
      } finally {
        setIsLoading(false);
      }
    };

    startLesson();
  }, [card, playTts, toast]);

  useEffect(() => {
    const audioElement = ttsAudioRef.current;
    if (!audioElement) return;

    const onPlay = () => setIsTtsPlaying(true);
    const onPause = () => setIsTtsPlaying(false);
    const onEnded = () => {
      setIsTtsPlaying(false);
      if (isTtsEnabled && messagesRef.current[messagesRef.current.length - 1]?.role === 'oracle') {
        handleMicClick();
      }
    };

    audioElement.addEventListener('play', onPlay);
    audioElement.addEventListener('pause', onPause);
    audioElement.addEventListener('ended', onEnded);

    return () => {
      audioElement.removeEventListener('play', onPlay);
      audioElement.removeEventListener('pause', onPause);
      audioElement.removeEventListener('ended', onEnded);
      if (audioPlayerManager.current === audioElement) {
        audioPlayerManager.pause();
      }
    };
  }, [isTtsEnabled, handleMicClick]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (ttsAudioRef.current) {
        audioPlayerManager.pause();
        ttsAudioRef.current.src = "";
      }
      clearSilenceTimeout();
    };
  }, []);

  if (!card) {
    notFound();
  }
  
  const handleTtsButtonClick = () => {
    if (isTtsLoading) return;

    if (isTtsPlaying) {
      audioPlayerManager.pause();
      return;
    }
    
    const newState = !isTtsEnabled;
    setIsTtsEnabled(newState);
    if (!newState && recognitionRef.current) {
        recognitionRef.current.stop();
    }
  };

  const TtsIcon = isTtsLoading ? Loader2 : isTtsPlaying ? VolumeX : isTtsEnabled ? Volume2 : VolumeX;
  const ttsButtonLabel = isTtsLoading ? "Génération audio..." 
    : isTtsPlaying ? "Arrêter la lecture" 
    : isTtsEnabled ? "Désactiver la synthèse vocale" 
    : "Activer la synthèse vocale";


  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <CardNavigation currentCardId={cardId} />
      <main className="flex-grow container mx-auto px-4 pb-8">
        <audio ref={ttsAudioRef} className="hidden" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6"
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">
                Leçon : {card.nom_carte}
              </h2>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleTtsButtonClick}
                className="text-primary hover:bg-primary/20"
                aria-label={ttsButtonLabel}
            >
              <TtsIcon className={`h-5 w-5 ${isTtsLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
           <div className="space-y-4">
              <div className="bg-card rounded-xl shadow-lg p-1 mx-auto w-fit">
                <div className="relative w-[150px] aspect-[2.5/3.5] p-2">
                  <Image
                    src={card.image_url}
                    alt={`Image de la carte ${card.nom_carte}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              </div>

               <ScrollArea className="h-80 w-full pr-4" ref={chatContainerRef}>
                   <div className="space-y-4">
                       {messages.map((message, index) => (
                           <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                               <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background/20 text-white/90 border border-primary/20'}`}>
                                   <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                               </div>
                           </div>
                       ))}
                        {isLoading && messages.length > 0 && (
                           <div className="flex justify-start">
                               <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-background/20 text-white/90 border border-primary/20 flex items-center gap-2">
                                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                  <p className="text-sm italic">L'assistant réfléchit...</p>
                               </div>
                           </div>
                       )}
                       {isLoading && messages.length === 0 && (
                          <div className="flex justify-center items-center h-full p-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                       )}
                   </div>
               </ScrollArea>
               <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                   <Input
                       type="text"
                       placeholder="Écrivez votre réponse..."
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       disabled={isLoading}
                       className="bg-secondary/20 backdrop-blur-lg border-primary/30 text-white placeholder:text-white/60"
                   />
                   <Button
                       variant="ghost"
                       size="icon"
                       type="button"
                       onClick={handleMicClick}
                       disabled={isLoading}
                       className={cn(
                           "text-primary hover:bg-primary/20",
                           isRecording && "bg-destructive/20 text-destructive animate-pulse"
                       )}
                       aria-label={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement vocal"}
                   >
                       {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                   </Button>
                   <Button type="submit" variant="default" size="icon" className="bg-primary hover:bg-primary/90" disabled={isLoading || !inputValue.trim()}>
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                   </Button>
               </form>
           </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
