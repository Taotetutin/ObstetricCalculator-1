import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInWeeks, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BabyAnimation } from './BabyAnimation';
import { PregnancyMilestone } from './PregnancyMilestone';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface PregnancyTrackerProps {
  dueDate?: Date;
  lastPeriodDate?: Date;
  onSetDate?: () => void;
}

export function PregnancyTracker({ 
  dueDate, 
  lastPeriodDate, 
  onSetDate 
}: PregnancyTrackerProps) {
  const { toast } = useToast();
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [babySize, setBabySize] = useState('');
  const [currentTrimester, setCurrentTrimester] = useState(0);
  const [babyWeight, setBabyWeight] = useState('');
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [milestoneText, setMilestoneText] = useState('');

  useEffect(() => {
    if (!dueDate && !lastPeriodDate) return;
    
    const today = new Date();
    let startDate: Date;
    let endDate: Date;
    
    if (lastPeriodDate) {
      // Si tenemos fecha de última menstruación, la usamos como punto de inicio
      startDate = new Date(lastPeriodDate);
      // La fecha probable de parto es aproximadamente 40 semanas después
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 280); // 40 semanas = 280 días
    } else if (dueDate) {
      // Si tenemos fecha probable de parto, calculamos hacia atrás
      endDate = new Date(dueDate);
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 280); // 40 semanas = 280 días
    } else {
      return;
    }
    
    // Calcular semanas de embarazo
    const totalWeeks = 40; // Duración total del embarazo en semanas
    const currentWeekCount = differenceInWeeks(today, startDate);
    const adjustedWeeks = Math.max(0, Math.min(currentWeekCount, totalWeeks));
    
    // Calcular progreso en porcentaje
    const progressPercentage = (adjustedWeeks / totalWeeks) * 100;
    
    // Calcular días restantes
    const remainingDays = differenceInDays(endDate, today);
    
    // Determinar el trimestre
    let trimester = 1;
    if (adjustedWeeks > 13) trimester = 2;
    if (adjustedWeeks > 26) trimester = 3;
    
    // Actualizar estados
    setCurrentProgress(progressPercentage);
    setCurrentWeek(adjustedWeeks);
    setCurrentTrimester(trimester);
    setDaysRemaining(Math.max(0, remainingDays));
    
    // Determinar tamaño del bebé y peso según la semana
    updateBabyDetails(adjustedWeeks);
    
  }, [dueDate, lastPeriodDate]);

  const updateBabyDetails = (weeks: number) => {
    // Información aproximada por semana
    if (weeks < 8) {
      setBabySize('una frambuesa');
      setBabyWeight('menos de 1 gramo');
      setMilestoneText('¡Se están formando los órganos principales!');
    } else if (weeks < 12) {
      setBabySize('una lima');
      setBabyWeight('14 gramos');
      setMilestoneText('¡Ya se puede detectar el latido del corazón!');
    } else if (weeks < 16) {
      setBabySize('un limón');
      setBabyWeight('100 gramos');
      setMilestoneText('¡Se están desarrollando las huellas digitales!');
    } else if (weeks < 20) {
      setBabySize('un mango');
      setBabyWeight('300 gramos');
      setMilestoneText('¡Pronto podrás sentir sus movimientos!');
    } else if (weeks < 24) {
      setBabySize('un melón cantaloup');
      setBabyWeight('600 gramos');
      setMilestoneText('¡Sus oídos están desarrollándose rápidamente!');
    } else if (weeks < 28) {
      setBabySize('una berenjena');
      setBabyWeight('900 gramos');
      setMilestoneText('¡Sus párpados se abrirán pronto!');
    } else if (weeks < 32) {
      setBabySize('un coco');
      setBabyWeight('1.5 kg');
      setMilestoneText('¡Está desarrollando ciclos de sueño!');
    } else if (weeks < 36) {
      setBabySize('una piña');
      setBabyWeight('2.5 kg');
      setMilestoneText('¡Se está preparando para la posición de nacimiento!');
    } else if (weeks < 40) {
      setBabySize('una sandía pequeña');
      setBabyWeight('3.3 kg');
      setMilestoneText('¡Casi listo para conocer el mundo!');
    } else {
      setBabySize('una sandía');
      setBabyWeight('3.5 kg o más');
      setMilestoneText('¡Tu bebé llegará en cualquier momento!');
    }
  };

  const shareProgress = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '¡Mi embarazo con ObsteriX Legend!',
          text: `Estoy en la semana ${currentWeek} de mi embarazo. ¡Mi bebé tiene el tamaño de ${babySize} y pesa aproximadamente ${babyWeight}!`,
          url: window.location.href,
        })
        .then(() => {
          toast({
            title: '¡Compartido con éxito!',
            description: 'Tu progreso ha sido compartido.',
          });
        })
        .catch((error) => {
          console.error('Error compartiendo:', error);
        });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      toast({
        title: 'Compartir no disponible',
        description: 'Tu navegador no soporta esta función.',
        variant: 'destructive',
      });
    }
  };

  if (!dueDate && !lastPeriodDate) {
    return (
      <Card className="w-full bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-medium text-pink-800">Seguimiento de Embarazo</h3>
            <p className="text-pink-600">
              Para visualizar el adorable seguimiento de tu embarazo, necesitamos la fecha de tu última menstruación o tu fecha probable de parto.
            </p>
            <Button 
              onClick={onSetDate} 
              className="mt-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Configurar Fecha
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <CardContent className="pt-6">
        <div className="mb-4 text-center">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
            Semana {currentWeek} de 40
          </h3>
          <p className="text-pink-700 font-medium">
            {currentTrimester === 1 ? 'Primer trimestre' : 
             currentTrimester === 2 ? 'Segundo trimestre' : 'Tercer trimestre'}
          </p>
        </div>

        <div className="mb-6">
          <Progress 
            value={currentProgress} 
            className="h-3 bg-pink-100" 
          />
          <div className="flex justify-between mt-1 text-xs text-pink-600">
            <span>Semana 1</span>
            <span>Semana 40</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <BabyAnimation week={currentWeek} />
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWeek}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-pink-100"
              >
                <h4 className="text-lg font-medium text-pink-800 mb-2">
                  Tu bebé ahora
                </h4>
                <p className="text-gray-700 mb-3">
                  Tiene el tamaño aproximado de <span className="font-bold text-pink-600">{babySize}</span> y 
                  pesa alrededor de <span className="font-bold text-pink-600">{babyWeight}</span>.
                </p>
                <p className="text-pink-700 italic">{milestoneText}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <PregnancyMilestone week={currentWeek} />

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-3 rounded-lg border border-pink-100">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Fecha probable de parto:
            </p>
            <p className="font-medium text-pink-800">
              {dueDate ? format(dueDate, 'dd MMMM yyyy', { locale: es }) : 'No establecida'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{daysRemaining}</div>
            <div className="text-xs text-purple-500">días restantes</div>
          </div>

          <Button
            onClick={shareProgress}
            variant="outline"
            className="border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800"
          >
            Compartir Progreso
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}