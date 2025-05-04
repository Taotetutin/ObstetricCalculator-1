import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Eye, Ear, Zap, Baby, Music, Wind } from 'lucide-react';

interface PregnancyMilestoneProps {
  week: number;
}

interface Milestone {
  icon: React.ElementType;
  title: string;
  description: string;
  weekStart: number;
  weekEnd: number;
}

export function PregnancyMilestone({ week }: PregnancyMilestoneProps) {
  const milestones: Milestone[] = [
    {
      icon: Heart,
      title: 'Latido del corazón',
      description: 'El corazón de tu bebé comienza a latir y el cerebro está desarrollándose rápidamente.',
      weekStart: 6,
      weekEnd: 8,
    },
    {
      icon: Eye,
      title: 'Desarrollo visual',
      description: 'Los ojos y los párpados de tu bebé comienzan a formarse.',
      weekStart: 9,
      weekEnd: 12,
    },
    {
      icon: Music,
      title: 'Desarrollo auditivo',
      description: 'Tu bebé ahora puede escuchar sonidos y empezará a familiarizarse con tu voz.',
      weekStart: 16,
      weekEnd: 20,
    },
    {
      icon: Zap,
      title: 'Primeros movimientos',
      description: 'Podrías empezar a sentir los primeros movimientos de tu bebé, conocidos como "quickening".',
      weekStart: 18,
      weekEnd: 22,
    },
    {
      icon: Lungs,
      title: 'Desarrollo pulmonar',
      description: 'Los pulmones de tu bebé se están desarrollando y pronto comenzará a practicar la respiración.',
      weekStart: 24,
      weekEnd: 28,
    },
    {
      icon: Brain,
      title: 'Desarrollo cerebral',
      description: 'El cerebro de tu bebé está creciendo rápidamente y desarrollando pliegues y surcos.',
      weekStart: 28,
      weekEnd: 32,
    },
    {
      icon: Baby,
      title: 'Preparándose para nacer',
      description: 'Tu bebé está ganando peso rápidamente y se está preparando para el nacimiento.',
      weekStart: 35,
      weekEnd: 40,
    },
  ];

  // Filtrar los hitos actuales (basados en la semana actual)
  const currentMilestone = milestones.find(
    m => week >= m.weekStart && week <= m.weekEnd
  );
  
  // Encontrar los próximos hitos
  const upcomingMilestones = milestones.filter(
    m => week < m.weekStart
  ).slice(0, 1); // Solo mostrar el próximo hito
  
  if (!currentMilestone && upcomingMilestones.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {currentMilestone && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`current-${currentMilestone.title}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg border border-pink-200"
          >
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <currentMilestone.icon className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-pink-800">
                  Hito actual: {currentMilestone.title}
                </h4>
                <p className="text-pink-700 mt-1">
                  {currentMilestone.description}
                </p>
                <p className="text-xs text-pink-500 mt-2">
                  Semanas {currentMilestone.weekStart}-{currentMilestone.weekEnd}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {upcomingMilestones.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-purple-100">
          <h4 className="text-sm font-medium text-purple-800 mb-3">
            Próximo hito
          </h4>
          {upcomingMilestones.map((milestone) => (
            <div key={milestone.title} className="flex items-start gap-3">
              <div className="bg-purple-50 p-2 rounded-full">
                <milestone.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h5 className="text-sm font-medium text-purple-700">
                  {milestone.title}
                </h5>
                <p className="text-xs text-purple-600 mt-1">
                  {milestone.description}
                </p>
                <p className="text-xs text-purple-400 mt-1">
                  En {milestone.weekStart - week} {milestone.weekStart - week === 1 ? 'semana' : 'semanas'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}