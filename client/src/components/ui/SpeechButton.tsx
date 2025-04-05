import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface SpeechButtonProps {
  text: string;
  label?: string;
}

export default function SpeechButton({ text, label = "Leer resultados" }: SpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      // Detener cualquier locución en curso
      window.speechSynthesis.cancel();
      
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Establecer el idioma a español
      utterance.lang = 'es-ES';
      
      // Evento cuando la locución termina
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      // Evento en caso de error
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Lo sentimos, su navegador no soporta la función de texto a voz.');
    }
  };

  return (
    <Button 
      onClick={speak} 
      variant="outline" 
      size="sm"
      className="flex items-center gap-2"
    >
      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {isSpeaking ? "Detener" : label}
    </Button>
  );
}