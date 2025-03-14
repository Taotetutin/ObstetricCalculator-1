import React from 'react';
import { Calculator, Baby, Activity } from 'lucide-react';
import FirstTrimesterCalculator from './T21/FirstTrimesterCalculator';
import SecondTrimesterCalculator from './T21/SecondTrimesterCalculator';
import AgeCalculator from './T21/AgeCalculator';

export default function T21Calculator() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Calculadora de Riesgo T21</h1>
        <p className="text-gray-600">Evaluación de riesgo de trisomía 21 basada en múltiples marcadores</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900">Riesgo por Edad</h2>
            </div>
            <AgeCalculator />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Baby className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900">Primer Trimestre</h2>
            </div>
            <FirstTrimesterCalculator />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900">Segundo Trimestre</h2>
            </div>
            <SecondTrimesterCalculator />
          </div>
        </div>
      </div>
    </div>
  );
}