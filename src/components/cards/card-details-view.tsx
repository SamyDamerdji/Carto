'use client';

import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Card } from '@/lib/data/cards';
import { getCardDetails } from '@/lib/data/cards';
import { chatWithOracle } from '@/ai/flows/oracle-flow';
import { textToSpeech } from '@/ai/flows/tts-flow';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Briefcase,
  CircleDollarSign,
  Sparkles,
  Mic,
  MicOff,
  Send,
  Sun,
  ShieldAlert,
  Layers,
  LayoutGrid,
  Link2,
  Lightbulb,
  Tags,
  NotebookText,
  Loader2,
  Volume2,
  VolumeX,
  BrainCircuit,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { audioPlayerManager } from '@/lib/audio-manager';

interface SectionWrapperProps {
  title: string;
  icon: React.ElementType;
  children: ReactNode;
  index: number;
  action?: ReactNode;
}

const SectionWrapper = ({ title, icon: Icon, children, index, action }: SectionWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.15 }}
    viewport={{ once: true, amount: 0.2 }}
    className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6"
  >
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-card-foreground/90">
          {title}
        </h2>
      </div>
      {action}
    </div>
    {children}
  </motion.div>
);

export function CardDetailsView({ card }: { card: Card }) {
  const domainIcons: Record<string, ReactNode> = {
    amour: <Heart className="h-5 w-5" />,
    travail: <Briefcase className="h-5 w-5" />,
    finances: <CircleDollarSign className="h-5 w-5" />,
    spirituel: <Sparkles className="h-5 w-5" />,
  };

  const hasCombinaisons = card.combinaisons && card.combinaisons.length > 0;
  
  const [messages, setMessages] = useState<{ role: 'user' | 'oracle'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Start the lesson when the card changes
    const startLesson = async () => {
      setIsLoading(true);
      setMessages([]); // Clear previous lesson
      try {
        const initialMessage = await chatWithOracle({ card, history: [] });
        const assistantMessage = { role: 'oracle' as const, content: initialMessage };
        setMessages([assistantMessage]);

        if (isTtsEnabled && initialMessage) {
          setIsTtsLoading(true);
          try {
            const { media } = await textToSpeech(initialMessage);
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
        }
      } catch (error) {
        console.error("Error starting lesson:", error);
        setMessages([{ role: 'oracle', content: "Désolé, je ne parviens pas à préparer la leçon pour le moment." }]);
      } finally {
        setIsLoading(false);
      }
    };

    startLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id]);


  useEffect(() => {
    const audioElement = ttsAudioRef.current;
    if (!audioElement) return;

    const onPlay = () => setIsTtsPlaying(true);
    const onPause = () => setIsTtsPlaying(false);
    const onEnded = () => setIsTtsPlaying(false);

    audioElement.addEventListener('play', onPlay);
    audioElement.addEventListener('pause', onPause);
    audioElement.addEventListener('ended', onEnded);

    return () => {
      audioElement.removeEventListener('play', onPlay);
      audioElement.removeEventListener('pause', onPause);
      audioElement.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    // Cleanup audio on component unmount
    return () => {
      if (ttsAudioRef.current) {
        audioPlayerManager.pause();
        ttsAudioRef.current.src = "";
      }
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    audioPlayerManager.pause();
    if (ttsAudioRef.current) {
        ttsAudioRef.current.src = "";
    }
    
    const userMessage = { role: 'user' as const, content: inputValue };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const oracleResponseText = await chatWithOracle({
        card: card,
        history: newHistory,
      });
      
      const oracleMessage = { role: 'oracle' as const, content: oracleResponseText };
      setMessages(prev => [...prev, oracleMessage]);

      if (isTtsEnabled && oracleResponseText) {
          setIsTtsLoading(true);
          try {
              const { media } = await textToSpeech(oracleResponseText);
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
      }

    } catch (error) {
      console.error("Error calling oracle flow:", error);
      const errorMessage = { role: 'oracle' as const, content: "Désolé, une erreur s'est produite. Je ne peux pas répondre pour le moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTtsButtonClick = () => {
    if (isTtsLoading) return;

    if (isTtsPlaying) {
      audioPlayerManager.pause();
      return;
    }
    
    const newState = !isTtsEnabled;
    setIsTtsEnabled(newState);
  };
  
  const handleMicClick = () => {
    if (isLoading) return;
  
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
  
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
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
    };
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };
  
    recognition.onerror = (event) => {
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
  };

  const TtsIcon = isTtsLoading ? Loader2 : isTtsPlaying ? VolumeX : isTtsEnabled ? Volume2 : VolumeX;
  const ttsButtonLabel = isTtsLoading ? "Génération audio..." 
    : isTtsPlaying ? "Arrêter la lecture" 
    : isTtsEnabled ? "Désactiver la synthèse vocale" 
    : "Activer la synthèse vocale";

  return (
    <div className="container mx-auto px-4 pb-8">
      <audio ref={ttsAudioRef} className="hidden" />
      {/* A. En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-8 max-w-md rounded-2xl bg-secondary/20 p-4 backdrop-blur-lg border border-primary/30 shadow-lg sm:p-6 text-center"
      >
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl uppercase drop-shadow-lg">
          {card.nom_carte}
        </h1>
        <div className="mt-4 flex flex-col items-center">
          <div className="bg-card rounded-xl shadow-lg p-1 inline-block">
            <div className="relative w-[200px] aspect-[2.5/3.5] p-2">
              <Image
                src={card.image_url}
                alt={`Image de la carte ${card.nom_carte}`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-white/90 text-center">
            {card.interpretations.general}
          </p>
        </div>
      </motion.div>
      
      {/* B. Interprétations Détaillées */}
      <SectionWrapper title="Interprétations" icon={Layers} index={1}>
        <Tabs defaultValue="endroit" className="w-full">
          <TabsList className="h-auto grid grid-cols-2 items-stretch justify-around rounded-2xl bg-secondary/20 p-1.5 backdrop-blur-lg border border-primary/30 shadow-lg">
            <TabsTrigger
              value="endroit"
              className="flex h-auto flex-1 flex-col items-center gap-1 rounded-lg bg-transparent p-2 text-xs font-medium text-card-foreground/90 shadow-none ring-offset-0 transition-all duration-300 hover:bg-accent/20 hover:text-primary focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <Sun className="h-5 w-5" />
              <span>Aspect Lumineux</span>
            </TabsTrigger>
            <TabsTrigger
              value="ombre_et_defis"
              className="flex h-auto flex-1 flex-col items-center gap-1 rounded-lg bg-transparent p-2 text-xs font-medium text-card-foreground/90 shadow-none ring-offset-0 transition-all duration-300 hover:bg-accent/20 hover:text-primary focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              <ShieldAlert className="h-5 w-5" />
              <span>Défis & Obstacles</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="endroit" className="mt-4 p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
            <p>{card.interpretations.endroit}</p>
          </TabsContent>
          <TabsContent value="ombre_et_defis" className="mt-4 p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
            <p>{card.interpretations.ombre_et_defis}</p>
          </TabsContent>
        </Tabs>
      </SectionWrapper>

      {/* C. Application par Domaine */}
      <SectionWrapper title="Application par Domaine" icon={LayoutGrid} index={2}>
        <Tabs defaultValue="amour" className="w-full">
          <TabsList className="h-auto grid grid-cols-4 items-stretch justify-around rounded-2xl bg-secondary/20 p-1.5 backdrop-blur-lg border border-primary/30 shadow-lg">
            {Object.keys(card.domaines).map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex h-auto flex-1 flex-col items-center gap-1 rounded-lg bg-transparent p-2 text-xs font-medium text-card-foreground/90 shadow-none ring-offset-0 transition-all duration-300 hover:bg-accent/20 hover:text-primary focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {domainIcons[key]}
                <span className="capitalize">{key}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(card.domaines).map(([key, value]) => (
            <TabsContent key={key} value={key} className="mt-4 p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
              <p>{value}</p>
            </TabsContent>
          ))}
        </Tabs>
      </SectionWrapper>
      
      {/* D. Associations Clés */}
      {hasCombinaisons && (
        <SectionWrapper title="Associations Clés" icon={Link2} index={3}>
          <ScrollArea className="h-96 w-full pr-4">
            <div className="space-y-4">
              {card.combinaisons.map((combo) => {
                const associatedCard = getCardDetails(combo.carte_associee_id);
                if (!associatedCard) return null;
                return (
                  <div key={combo.carte_associee_id} className="flex items-center gap-4 rounded-xl bg-secondary/20 p-3 backdrop-blur-lg border border-primary/30 shadow-md">
                    <div className="relative h-20 w-14 flex-shrink-0">
                        <div className="bg-card rounded shadow-lg p-1 w-full h-full">
                            <div className="relative h-full w-full p-1">
                                <Image
                                    src={associatedCard.image_url}
                                    alt={associatedCard.nom_carte}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline font-bold text-lg text-primary">{associatedCard.nom_carte}</h4>
                      <p className="text-sm text-white/90">{combo.signification}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </SectionWrapper>
      )}

      {/* E. Le Conseil */}
      <SectionWrapper title="Le Conseil" icon={Lightbulb} index={hasCombinaisons ? 4 : 3}>
        <div className="p-4 bg-background/20 rounded-lg border border-primary/20 text-white/90">
          <p>{card.interpretations.conseil}</p>
        </div>
      </SectionWrapper>

      {/* F. Mots-clés */}
      <SectionWrapper title="Mots-clés" icon={Tags} index={hasCombinaisons ? 5 : 4}>
        <blockquote className="border-l-4 border-primary pl-4 italic text-white/90 my-4">
          {card.phrase_cle}
        </blockquote>
        <div className="flex flex-wrap gap-2">
          {card.mots_cles.map((mot) => (
            <Badge key={mot} variant="secondary" className="bg-primary/20 text-primary-foreground/90 border border-primary/50">
              {mot}
            </Badge>
          ))}
        </div>
      </SectionWrapper>

      {/* G. Mes Notes */}
       <SectionWrapper title="Mes Notes" icon={NotebookText} index={hasCombinaisons ? 6 : 5}>
           <Textarea
               placeholder="Mes réflexions, associations personnelles, ou interprétations..."
               className="bg-secondary/20 backdrop-blur-lg border-primary/30 text-white placeholder:text-white/60"
               rows={5}
           />
       </SectionWrapper>

       {/* H. Leçon Interactive */}
       <SectionWrapper 
        title="Leçon Interactive" 
        icon={BrainCircuit} 
        index={hasCombinaisons ? 7 : 6}
        action={
            <Button
                variant="ghost"
                size="icon"
                onClick={handleTtsButtonClick}
                className="text-primary hover:bg-primary/20"
                aria-label={ttsButtonLabel}
            >
              <TtsIcon className={`h-5 w-5 ${isTtsLoading ? 'animate-spin' : ''}`} />
            </Button>
        }
       >
           <div className="space-y-4">
               <ScrollArea className="h-60 w-full pr-4" ref={chatContainerRef}>
                   <div className="space-y-4">
                       {messages.map((message, index) => (
                           <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                               <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background/20 text-white/90 border border-primary/20'}`}>
                                   <p className="text-sm">{message.content}</p>
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
                          <div className="flex justify-center items-center h-full">
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
       </SectionWrapper>

    </div>
  );
}
