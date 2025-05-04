import { motion } from 'framer-motion';

interface BabyAnimationProps {
  week: number;
}

export function BabyAnimation({ week }: BabyAnimationProps) {
  // Tamaño relativo de la animación del bebé basado en la semana
  const babySize = Math.min(100, Math.max(20, week * 2.5));
  
  // Cambiar la animación según el trimestre
  const isFirstTrimester = week <= 13;
  const isSecondTrimester = week > 13 && week <= 26;
  const isThirdTrimester = week > 26;
  
  return (
    <div className="relative w-full h-64 flex items-center justify-center bg-white rounded-lg shadow-sm overflow-hidden border border-pink-100">
      {/* Fondo uterino con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-purple-50 opacity-50" />
      
      {/* Círculos decorativos que simulan el entorno */}
      <motion.div
        className="absolute rounded-full bg-pink-100 opacity-20"
        initial={{ scale: 1, x: -20, y: -30 }}
        animate={{ 
          scale: [1, 1.1, 1],
          x: [-20, -10, -20],
          y: [-30, -20, -30]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut"
        }}
        style={{ width: 150, height: 150 }}
      />
      
      <motion.div
        className="absolute rounded-full bg-purple-100 opacity-20"
        initial={{ scale: 1, x: 30, y: 20 }}
        animate={{ 
          scale: [1, 1.2, 1],
          x: [30, 20, 30],
          y: [20, 30, 20]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut"
        }}
        style={{ width: 120, height: 120 }}
      />
      
      {/* Animación para el primer trimestre: embrión/círculo pulsante */}
      {isFirstTrimester && (
        <motion.div
          className="rounded-full bg-pink-200 flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.8, 1, 0.8],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          }}
          style={{ width: babySize, height: babySize }}
        >
          <motion.div
            className="rounded-full bg-pink-300"
            animate={{ 
              scale: [0.8, 1, 0.8]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
            style={{ width: babySize * 0.6, height: babySize * 0.6 }}
          />
        </motion.div>
      )}
      
      {/* Animación para el segundo trimestre: forma de bebé simple */}
      {isSecondTrimester && (
        <motion.div
          className="relative rounded-full bg-pink-200 flex flex-col items-center justify-center overflow-visible"
          animate={{ 
            rotate: [0, 2, 0, -2, 0],
            y: [0, -5, 0, 5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut"
          }}
          style={{ width: babySize, height: babySize }}
        >
          {/* Cabeza */}
          <motion.div 
            className="absolute bg-pink-200 rounded-full"
            style={{ 
              width: babySize * 0.5, 
              height: babySize * 0.5,
              top: -babySize * 0.15
            }}
          />
          
          {/* Brazos */}
          <motion.div 
            className="absolute bg-pink-200 rounded-full"
            animate={{ rotate: [0, -10, 0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            style={{ 
              width: babySize * 0.3, 
              height: babySize * 0.15,
              left: -babySize * 0.25,
              top: babySize * 0.2
            }}
          />
          
          <motion.div 
            className="absolute bg-pink-200 rounded-full"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            style={{ 
              width: babySize * 0.3, 
              height: babySize * 0.15,
              right: -babySize * 0.25,
              top: babySize * 0.2
            }}
          />
          
          {/* Piernas */}
          <motion.div 
            className="absolute bg-pink-200 rounded-full"
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            style={{ 
              width: babySize * 0.15, 
              height: babySize * 0.4,
              left: babySize * 0.1,
              bottom: -babySize * 0.25
            }}
          />
          
          <motion.div 
            className="absolute bg-pink-200 rounded-full"
            animate={{ rotate: [0, -5, 0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            style={{ 
              width: babySize * 0.15, 
              height: babySize * 0.4,
              right: babySize * 0.1,
              bottom: -babySize * 0.25
            }}
          />
        </motion.div>
      )}
      
      {/* Animación para el tercer trimestre: bebé más detallado en posición fetal */}
      {isThirdTrimester && (
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ 
            rotate: [0, 2, 0, -2, 0],
            scale: [1, 1.02, 1, 0.98, 1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut"
          }}
          style={{ width: babySize * 1.2, height: babySize * 1.2 }}
        >
          {/* SVG para un bebé en posición fetal */}
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            animate={{ 
              scale: [1, 1.01, 1, 0.99, 1]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
          >
            {/* Forma principal del cuerpo */}
            <motion.path
              d="M50,20 C65,20 80,35 80,55 C80,75 60,85 50,85 C35,85 20,75 20,55 C20,40 35,20 50,20Z"
              fill="#fbbdd1"
              animate={{ 
                d: [
                  "M50,20 C65,20 80,35 80,55 C80,75 60,85 50,85 C35,85 20,75 20,55 C20,40 35,20 50,20Z",
                  "M50,18 C67,18 82,35 82,55 C82,75 62,87 50,87 C35,87 18,75 18,55 C18,40 33,18 50,18Z",
                  "M50,20 C65,20 80,35 80,55 C80,75 60,85 50,85 C35,85 20,75 20,55 C20,40 35,20 50,20Z"
                ]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 8,
                ease: "easeInOut"
              }}
            />
            
            {/* Cabeza */}
            <motion.circle
              cx="35"
              cy="35"
              r="15"
              fill="#fbbdd1"
              animate={{ 
                cy: [35, 34, 35, 36, 35],
                cx: [35, 34.5, 35, 35.5, 35]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut"
              }}
            />
            
            {/* Pequeños detalles: corazón pulsante */}
            <motion.circle
              cx="45"
              cy="45"
              r="3"
              fill="#ff6b98"
              animate={{ 
                r: [3, 3.5, 3]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1,
                ease: "easeInOut"
              }}
            />
          </motion.svg>
        </motion.div>
      )}
      
      {/* Pequeñas burbujas animadas flotando */}
      <motion.div
        className="absolute rounded-full bg-white opacity-20"
        initial={{ y: 100, x: -30, scale: 0 }}
        animate={{ y: -100, scale: [0, 1, 0] }}
        transition={{ 
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut",
          delay: 2
        }}
        style={{ width: 10, height: 10 }}
      />
      
      <motion.div
        className="absolute rounded-full bg-white opacity-30"
        initial={{ y: 100, x: 20, scale: 0 }}
        animate={{ y: -100, scale: [0, 1, 0] }}
        transition={{ 
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
          delay: 5
        }}
        style={{ width: 8, height: 8 }}
      />
      
      <motion.div
        className="absolute rounded-full bg-white opacity-40"
        initial={{ y: 100, x: 40, scale: 0 }}
        animate={{ y: -100, scale: [0, 1, 0] }}
        transition={{ 
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut"
        }}
        style={{ width: 5, height: 5 }}
      />
    </div>
  );
}