import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import SpeechButton from '@/components/ui/SpeechButton';
import GeneratePDFButton from '@/components/ui/GeneratePDFButton';

interface AnimatedResultProps {
  id: string;
  fileName: string;
  speechText: string;
  riskLevel?: 'Alto' | 'Moderado' | 'Bajo' | string;
  children: ReactNode;
}

export function AnimatedResult({
  id,
  fileName,
  speechText,
  riskLevel,
  children
}: AnimatedResultProps) {
  const getRiskColor = (risk: string | undefined) => {
    if (!risk) return 'bg-gray-100';
    
    switch(risk.toLowerCase()) {
      case 'alto':
        return 'bg-red-50 border-red-200';
      case 'moderado':
        return 'bg-yellow-50 border-yellow-200';
      case 'bajo':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getRiskTextColor = (risk: string | undefined) => {
    if (!risk) return 'text-gray-700';
    
    switch(risk.toLowerCase()) {
      case 'alto':
        return 'text-red-600';
      case 'moderado':
        return 'text-yellow-600';
      case 'bajo':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  const getRiskIcon = (risk: string | undefined) => {
    if (!risk) return '❓';
    
    switch(risk.toLowerCase()) {
      case 'alto':
        return '⚠️';
      case 'moderado':
        return '⚠️';
      case 'bajo':
        return '✅';
      default:
        return '📊';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-3 sm:space-y-4"
    >
      <div className="flex justify-end gap-1 sm:gap-2 mb-2">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <SpeechButton text={speechText} />
        </motion.div>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <GeneratePDFButton contentId={id} fileName={fileName} />
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <Card className={`shadow-md overflow-hidden ${getRiskColor(riskLevel)}`}>
          <CardContent className="p-0">
            {riskLevel && (
              <div className={`p-2 sm:p-3 ${getRiskTextColor(riskLevel)} font-medium text-base sm:text-lg flex items-center gap-2 border-b border-gray-100`}>
                <span className="text-lg sm:text-xl">{getRiskIcon(riskLevel)}</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm sm:text-base"
                >
                  Nivel de riesgo: <span className="font-bold">{riskLevel}</span>
                </motion.span>
              </div>
            )}
            
            <div id={id} className="p-3 sm:p-5">
              {children}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}