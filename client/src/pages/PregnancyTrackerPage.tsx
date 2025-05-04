import { useState } from 'react';
import { Link } from 'wouter';
import { PregnancyTracker } from '@/components/pregnancy-tracker/PregnancyTracker';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Baby, Calendar as CalendarIcon, Heart } from 'lucide-react';

export default function PregnancyTrackerPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('due-date');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(undefined);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSaveDate = () => {
    if (activeTab === 'due-date' && dueDate) {
      // Si estamos en la pestaña de FPP, usamos esa fecha
      setLastPeriodDate(undefined);
    } else if (activeTab === 'last-period' && lastPeriodDate) {
      // Si estamos en la pestaña de última menstruación, calculamos FPP
      setDueDate(undefined);
    }
    
    handleCloseDialog();
  };

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
          Seguimiento del Embarazo
        </h1>
        <p className="text-pink-700 mt-2">
          Visualiza de forma adorable el progreso de tu embarazo y descubre los momentos especiales que están por venir.
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        <PregnancyTracker 
          dueDate={dueDate} 
          lastPeriodDate={lastPeriodDate} 
          onSetDate={handleOpenDialog} 
        />
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-500" />
                <span>Consejos para el Embarazo</span>
              </CardTitle>
              <CardDescription>
                Recomendaciones para un embarazo saludable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="text-sm text-purple-800">Mantén una dieta equilibrada rica en proteínas, hierro y ácido fólico.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="text-sm text-purple-800">Realiza ejercicio moderado aprobado por tu médico.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="text-sm text-purple-800">Mantente hidratada bebiendo suficiente agua.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="text-sm text-purple-800">Asiste a todas tus citas médicas prenatales.</span>
                </li>
              </ul>
              <div className="mt-4">
                <Link href="/sabiduria-cultural">
                  <Button
                    variant="outline"
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                  >
                    Ver Más Consejos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-orange-50 border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5 text-pink-500" />
                <span>Preparándote para la llegada</span>
              </CardTitle>
              <CardDescription>
                Lista de preparativos para la llegada del bebé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-pink-100 p-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                  </div>
                  <span className="text-sm text-pink-800">Prepara la habitación y la cuna del bebé.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-pink-100 p-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                  </div>
                  <span className="text-sm text-pink-800">Compra ropa, pañales y otros elementos esenciales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-pink-100 p-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                  </div>
                  <span className="text-sm text-pink-800">Planifica el trayecto al hospital y el plan de parto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-pink-100 p-1 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                  </div>
                  <span className="text-sm text-pink-800">Considera tomar clases de preparación para el parto.</span>
                </li>
              </ul>
              <div className="mt-4">
                <Link href="/calculadora/riesgo-medicamentos">
                  <Button
                    variant="outline"
                    className="w-full border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800"
                  >
                    Verificar Medicamentos Seguros
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar fecha del embarazo</DialogTitle>
            <DialogDescription>
              Selecciona una fecha para calcular el progreso de tu embarazo.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="due-date">Fecha Probable de Parto</TabsTrigger>
              <TabsTrigger value="last-period">Última Menstruación</TabsTrigger>
            </TabsList>
            <TabsContent value="due-date" className="py-4">
              <div className="flex flex-col items-center gap-2">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  className="rounded-md border"
                  locale={es}
                  disabled={(date) => date < new Date()}
                />
                {dueDate ? (
                  <p className="text-sm text-pink-600">
                    Fecha seleccionada: {format(dueDate, 'PPP', { locale: es })}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Selecciona tu fecha probable de parto</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="last-period" className="py-4">
              <div className="flex flex-col items-center gap-2">
                <Calendar
                  mode="single"
                  selected={lastPeriodDate}
                  onSelect={setLastPeriodDate}
                  className="rounded-md border"
                  locale={es}
                  disabled={(date) => date > new Date()}
                />
                {lastPeriodDate ? (
                  <p className="text-sm text-pink-600">
                    Fecha seleccionada: {format(lastPeriodDate, 'PPP', { locale: es })}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Selecciona la fecha de tu última menstruación</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              onClick={handleCloseDialog}
              variant="outline"
              className="border-pink-200 text-pink-700 hover:bg-pink-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveDate}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              disabled={(activeTab === 'due-date' && !dueDate) || (activeTab === 'last-period' && !lastPeriodDate)}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}