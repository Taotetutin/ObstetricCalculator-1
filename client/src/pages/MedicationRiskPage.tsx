import React from 'react';
import { Helmet } from 'react-helmet';
import { MedicationRiskCalculator } from '@/components/calculators/MedicationRiskCalculator';
import { Pill, ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function MedicationRiskPage() {
  return (
    <div className="container mx-auto py-6 sm:py-8 px-4">
      <Helmet>
        <title>Evaluación de Riesgos de Medicamentos en el Embarazo | ObsteriX Legend</title>
      </Helmet>

      <header className="mb-6 sm:mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-60 -z-10"></div>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 opacity-20 rounded-full -z-10"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-300 opacity-20 rounded-full -z-10"></div>
        
        <div className="py-6 sm:py-8 px-4 sm:px-6 text-center relative z-0">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
          
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-md">
            <Pill className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-3">
            Seguridad de Medicamentos en el Embarazo
          </h1>
          
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
            Evalúa los riesgos de medicamentos durante el embarazo según la clasificación de la FDA. 
            Obtén información sobre seguridad, recomendaciones clínicas y alternativas más seguras.
          </p>
        </div>
      </header>

      <main>
        <MedicationRiskCalculator />
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <div className="max-w-3xl mx-auto">
          <p className="mb-2">
            La herramienta de evaluación de riesgos de medicamentos en el embarazo utiliza la clasificación 
            de la FDA como referencia. La información es proporcionada con fines educativos y debe ser utilizada 
            en consulta con profesionales de la salud.
          </p>
          <p>
            © {new Date().getFullYear()} ObsteriX Legend | La información presentada no sustituye el consejo médico profesional.
          </p>
        </div>
      </footer>
    </div>
  );
}