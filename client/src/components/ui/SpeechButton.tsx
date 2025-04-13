import React, { useState } from 'react';
import { ActionButton } from '@/components/ui/action-button';
import { Volume2, VolumeX } from 'lucide-react';

interface SpeechButtonProps {
  text: string;
  label?: string;
}

export default function SpeechButton({ text, label = "🔊 LEER RESULTADOS" }: SpeechButtonProps) {
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
      utterance.volume = 1;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
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
    <ActionButton 
      onClick={speak} 
      color="blue"
      className={isSpeaking ? 'animate-pulse' : ''}
    >
      <div className="flex items-center justify-center">
        {isSpeaking ? (
          <>
            <span className="mr-2">🔇</span>
            <span>DETENER REPRODUCCIÓN</span>
          </>
        ) : (
          <>
            <span className="mr-2">🔊</span>
            <span>LEER RESULTADOS</span>
          </>
        )}
      </div>
    </ActionButton>
  );
}