import { Card, CardContent } from "@/components/ui/card";
import { Lock, FileText, Mail, Calculator, Pill, Baby, Heart, Stethoscope, Activity, Newspaper } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { MobileCalculatorCard } from "@/components/MobileCalculatorCard";
import { useSwipeGestures, useHapticFeedback } from "@/hooks/useMobileGestures";
import { useState, useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const { successTap } = useHapticFeedback();
  const [isMobile, setIsMobile] = useState(false);

  // Get first name from the full name
  const firstName = user?.name?.split(' ')[0] || '';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const essentialCalculators = [
    {
      id: "calculadora-gestacional-compleja",
      title: "FPP y Gestacional",
      description: "Calcula fechas de embarazo y fecha probable de parto",
      icon: <Baby className="h-6 w-6" />,
      category: "Esencial"
    },
    {
      id: "medicamentos-embarazo",
      title: "Medicamentos FDA",
      description: "Consulta seguridad de medicamentos en embarazo",
      icon: <Pill className="h-6 w-6" />,
      category: "Farmacología"
    },
    {
      id: "mefi",
      title: "MEFI",
      description: "Análisis de monitoreo electrónico fetal",
      icon: <Activity className="h-6 w-6" />,
      category: "Monitoreo"
    },
    {
      id: "t21",
      title: "Trisomía 21",
      description: "Evaluación de riesgo de síndrome de Down",
      icon: <Stethoscope className="h-6 w-6" />,
      category: "Screening"
    }
  ];

  return (
    <div className="flex flex-col h-full gap-4 sm:gap-6 max-w-4xl mx-auto px-0 sm:px-4">
      {/* Mobile Header */}
      {isMobile && (
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-blue-600">
            Bienvenido {firstName}
          </h1>
          <p className="text-sm text-gray-600">
            Acceso rápido a calculadoras esenciales
          </p>
        </div>
      )}

      {/* Desktop Welcome Card */}
      {!isMobile && (
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-primary bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            ObsteriX Legend
          </h1>
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardContent className="p-4 sm:pt-6 space-y-3 sm:space-y-4 text-base sm:text-lg text-blue-900/80">
              <p className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-6">
                Bienvenido {firstName} a Obsterix Legend
              </p>
              <p className="text-sm sm:text-base">
                La aplicación más completa para obstetricia, con calculadoras médicas, 
                análisis de medicamentos y herramientas especializadas.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Essential Calculators Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 px-2">
          Calculadoras Esenciales
        </h2>
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-2'}`}>
          {essentialCalculators.map((calc) => (
            <MobileCalculatorCard
              key={calc.id}
              id={calc.id}
              title={calc.title}
              description={calc.description}
              icon={calc.icon}
              category={calc.category}
              isEssential={true}
            />
          ))}
        </div>
      </div>

      {/* Quick Access Section for Mobile */}
      {isMobile && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 px-2">
            Acceso Directo
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200 active:scale-95 transition-transform">
              <Heart className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-sm font-medium text-green-900">Sabiduría Cultural</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-purple-200 active:scale-95 transition-transform">
              <Newspaper className="h-8 w-8 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-purple-900">ObsteriX al Día</p>
            </Card>
          </div>
        </div>
      )}

      {/* App Features for Desktop */}
      {!isMobile && (
        <div className="flex justify-center mt-4">
          <img 
            src="/untitled6.png"
            alt="ObsteriX Legend"
            className="max-w-full h-auto"
          />
        </div>
      )}

      {/* Footer Links - Hidden on Mobile */}
      {!isMobile && (
        <div className="mt-auto pt-8 pb-4 flex flex-wrap justify-center gap-4 text-sm">
          <a 
            href="http://obsterixpro.mimaternofetal.cl/politicaprivacidad.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-md transition-colors shadow-sm"
          >
            <Lock className="w-4 h-4" />
            Políticas de Privacidad
          </a>
          <a 
            href="https://obsterixpro.mimaternofetal.cl/page6.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-md transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Términos y Condiciones
          </a>
          <a 
            href="mailto:manuel.guerra@mimaternofetal.cl"
            className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-md transition-colors shadow-sm"
          >
            <Mail className="w-4 h-4" />
            Contacto
          </a>
        </div>
      )}
    </div>
  );
}