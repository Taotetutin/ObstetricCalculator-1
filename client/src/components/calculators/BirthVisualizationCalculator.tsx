import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Volume2, VolumeX } from "lucide-react";

interface VisualizationStage {
  id: number;
  title: string;
  description: string;
  narration: string;
  duration: number; // duración en segundos
  visualElements: {
    cervixDilation: number; // 0-100
    babyPosition: number; // 0-100
    contractionIntensity: number; // 0-100
    animation: string;
  };
}

const birthStages: VisualizationStage[] = [
  {
    id: 1,
    title: "Inicio del Trabajo de Parto",
    description: "Primeras contracciones y dilatación cervical inicial",
    narration: "El trabajo de parto comienza con contracciones suaves y regulares. El cuello uterino empieza a dilatarse lentamente.",
    duration: 8,
    visualElements: {
      cervixDilation: 10,
      babyPosition: 20,
      contractionIntensity: 30,
      animation: "initial"
    }
  },
  {
    id: 2,
    title: "Fase Activa",
    description: "Contracciones más intensas y dilatación progresiva",
    narration: "Las contracciones se vuelven más fuertes y frecuentes. El cuello uterino se dilata más rápidamente.",
    duration: 10,
    visualElements: {
      cervixDilation: 50,
      babyPosition: 40,
      contractionIntensity: 70,
      animation: "active"
    }
  },
  {
    id: 3,
    title: "Transición",
    description: "Dilatación completa y preparación para el expulsivo",
    narration: "El cuello uterino alcanza la dilatación completa. El bebé se prepara para descender por el canal de parto.",
    duration: 6,
    visualElements: {
      cervixDilation: 100,
      babyPosition: 60,
      contractionIntensity: 90,
      animation: "transition"
    }
  },
  {
    id: 4,
    title: "Expulsivo",
    description: "Descenso y rotación del bebé",
    narration: "El bebé desciende y rota a través del canal de parto. Las contracciones ayudan en el proceso de expulsión.",
    duration: 12,
    visualElements: {
      cervixDilation: 100,
      babyPosition: 80,
      contractionIntensity: 100,
      animation: "descent"
    }
  },
  {
    id: 5,
    title: "Nacimiento",
    description: "Salida de la cabeza y el cuerpo del bebé",
    narration: "La cabeza del bebé corona y emerge, seguida por el resto del cuerpo. Es un momento de gran alegría.",
    duration: 8,
    visualElements: {
      cervixDilation: 100,
      babyPosition: 100,
      contractionIntensity: 80,
      animation: "birth"
    }
  },
  {
    id: 6,
    title: "Alumbramiento",
    description: "Expulsión de la placenta",
    narration: "La placenta se separa y es expulsada, completando el proceso del parto.",
    duration: 6,
    visualElements: {
      cervixDilation: 100,
      babyPosition: 100,
      contractionIntensity: 30,
      animation: "placenta"
    }
  }
];

// Sonidos de ambiente para cada etapa
const ambientSounds: Record<string, string> = {
  initial: "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAA5TEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kMQpgADwpXnJGMEAAANIAAAARAAAaQAAAAgAAA0gAAABEVFhcm1hdGEAAAAiaAAAAAAAAAAAA==",
  active: "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAA5TEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kMQpgADwpXnJGMEAAANIAAAARAAAaQAAAAgAAA0gAAABEVFhcm1hdGEAAAAiaAAAAAAAAAAAA==",
  transition: "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAA5TEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kMQpgADwpXnJGMEAAANIAAAARAAAaQAAAAgAAA0gAAABEVFhcm1hdGEAAAAiaAAAAAAAAAAAA==",
  descent: "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAA5TEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kMQpgADwpXnJGMEAAANIAAAARAAAaQAAAAgAAA0gAAABEVFhcm1hdGEAAAAiaAAAAAAAAAAAA==",
  birth: "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAA5TEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kMQpgADwpXnJGMEAAANIAAAARAAAaQAAAAgAAA0gAAABEVFhcm1hdGEAAAAiaAAAAAAAAAAAA==",
  placenta: "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAA5TEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kMQpgADwpXnJGMEAAANIAAAARAAAaQAAAAgAAA0gAAABEVFhcm1hdGEAAAAiaAAAAAAAAAAAA=="
};

export default function BirthVisualizationCalculator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [totalProgress, setTotalProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stageStartTime = useRef<number>(0);

  const totalDuration = birthStages.reduce((sum, stage) => sum + stage.duration, 0);

  const playAmbientSound = (animation: string) => {
    if (isMuted) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(ambientSounds[animation] || ambientSounds.initial);
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(console.error);
    audioRef.current = audio;
  };

  const speakNarration = (text: string) => {
    if (isMuted) return;
    
    // Detener narración anterior
    if (speechRef.current) {
      speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const startVisualization = () => {
    setIsPlaying(true);
    setCurrentStage(0);
    setProgress(0);
    setTotalProgress(0);
    stageStartTime.current = Date.now();
    
    // Iniciar primera etapa
    const firstStage = birthStages[0];
    playAmbientSound(firstStage.visualElements.animation);
    speakNarration(firstStage.narration);
    
    // Configurar intervalo de actualización
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - stageStartTime.current) / 1000;
      const currentStageData = birthStages[currentStage];
      
      if (elapsed >= currentStageData.duration) {
        // Avanzar a la siguiente etapa
        const nextStage = currentStage + 1;
        if (nextStage < birthStages.length) {
          setCurrentStage(nextStage);
          setProgress(0);
          stageStartTime.current = Date.now();
          
          const nextStageData = birthStages[nextStage];
          playAmbientSound(nextStageData.visualElements.animation);
          speakNarration(nextStageData.narration);
        } else {
          // Visualización completada
          stopVisualization();
          return;
        }
      } else {
        // Actualizar progreso de la etapa actual
        const stageProgress = (elapsed / currentStageData.duration) * 100;
        setProgress(stageProgress);
        
        // Calcular progreso total
        const completedDuration = birthStages.slice(0, currentStage).reduce((sum, stage) => sum + stage.duration, 0);
        const currentDuration = elapsed;
        const totalProgressValue = ((completedDuration + currentDuration) / totalDuration) * 100;
        setTotalProgress(totalProgressValue);
      }
    }, 100);
  };

  const stopVisualization = () => {
    setIsPlaying(false);
    
    // Limpiar intervalo
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Detener audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Detener narración
    if (speechRef.current) {
      speechSynthesis.cancel();
      speechRef.current = null;
    }
    
    // Resetear estado
    setCurrentStage(0);
    setProgress(0);
    setTotalProgress(0);
  };

  const toggleVisualization = () => {
    if (isPlaying) {
      stopVisualization();
    } else {
      startVisualization();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (!isMuted) {
      // Silenciar todo
      if (audioRef.current) {
        audioRef.current.pause();
      }
      speechSynthesis.cancel();
    } else {
      // Reactivar audio si se está reproduciendo
      if (isPlaying) {
        const currentStageData = birthStages[currentStage];
        playAmbientSound(currentStageData.visualElements.animation);
      }
    }
  };

  // Limpiar al desmontar el componente
  useEffect(() => {
    return () => {
      stopVisualization();
    };
  }, []);

  const currentStageData = birthStages[currentStage];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-blue-800">
            Visualización del Proceso de Parto
          </CardTitle>
          <p className="text-center text-gray-600">
            Experiencia inmersiva con audio y narración cálida del proceso natural del nacimiento
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Controles principales */}
          <div className="flex justify-center items-center gap-4">
            <Button
              onClick={toggleVisualization}
              size="lg"
              className={`px-8 py-3 text-lg font-semibold ${
                isPlaying 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="h-5 w-5 mr-2" />
                  Detener Visualización
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Iniciar Visualización
                </>
              )}
            </Button>
            
            <Button
              onClick={toggleMute}
              variant="outline"
              size="lg"
              className="px-4 py-3"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Progreso total */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso Total</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </div>

          {/* Información de la etapa actual */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-50 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Etapa {currentStage + 1}: {currentStageData.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {currentStageData.description}
              </p>
              
              {/* Progreso de la etapa actual */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progreso de la Etapa</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Visualización anatómica */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <h4 className="text-lg font-semibold text-center text-blue-800 mb-4">
              Visualización Anatómica
            </h4>
            
            <div className="relative w-full h-64 bg-gradient-to-b from-pink-50 to-purple-50 rounded-lg overflow-hidden">
              {/* Útero */}
              <motion.div
                className="absolute inset-4 border-4 border-pink-300 rounded-full"
                animate={{
                  scale: isPlaying ? [1, 1.02, 1] : 1,
                  borderColor: currentStageData.visualElements.contractionIntensity > 70 
                    ? "#ec4899" : "#f9a8d4"
                }}
                transition={{
                  repeat: isPlaying ? Infinity : 0,
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                {/* Cuello uterino */}
                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-pink-400"
                  animate={{
                    width: `${currentStageData.visualElements.cervixDilation}%`,
                    height: "12px"
                  }}
                  transition={{ duration: 1 }}
                />
                
                {/* Bebé */}
                <motion.div
                  className="absolute w-12 h-12 bg-yellow-300 rounded-full border-2 border-yellow-400"
                  animate={{
                    left: "50%",
                    top: `${100 - currentStageData.visualElements.babyPosition}%`,
                    rotate: isPlaying ? [0, 5, -5, 0] : 0
                  }}
                  transition={{
                    top: { duration: 1.5 },
                    rotate: {
                      repeat: isPlaying ? Infinity : 0,
                      duration: 3,
                      ease: "easeInOut"
                    }
                  }}
                  style={{
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  {/* Cara del bebé */}
                  <div className="absolute inset-2 bg-yellow-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">👶</span>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Indicadores de contracciones */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 bg-red-200 opacity-20 rounded-lg"
                  animate={{
                    opacity: [0, currentStageData.visualElements.contractionIntensity / 500, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>
            
            {/* Métricas */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-sm text-gray-600">Dilatación</div>
                <div className="text-lg font-semibold text-blue-800">
                  {currentStageData.visualElements.cervixDilation}%
                </div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-sm text-gray-600">Posición</div>
                <div className="text-lg font-semibold text-green-800">
                  {currentStageData.visualElements.babyPosition}%
                </div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="text-sm text-gray-600">Contracciones</div>
                <div className="text-lg font-semibold text-red-800">
                  {currentStageData.visualElements.contractionIntensity}%
                </div>
              </div>
            </div>
          </div>

          {/* Lista de etapas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Etapas del Proceso
            </h4>
            <div className="space-y-2">
              {birthStages.map((stage, index) => (
                <div
                  key={stage.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    index === currentStage && isPlaying
                      ? 'bg-blue-100 border-l-4 border-blue-600'
                      : index < currentStage && isPlaying
                      ? 'bg-green-100'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === currentStage && isPlaying
                        ? 'bg-blue-600 text-white'
                        : index < currentStage && isPlaying
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{stage.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {stage.duration}s
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">
              Información Importante
            </h4>
            <p className="text-sm text-amber-700">
              Esta visualización es con fines educativos. Cada parto es único y puede variar significativamente 
              en duración y características. Consulte siempre con profesionales de la salud para orientación específica.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}