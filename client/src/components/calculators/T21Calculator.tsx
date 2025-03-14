import React from 'react';
import { Calculator, Baby, Activity } from 'lucide-react';
import TrisomyCalculator from './T21/TrisomyCalculator';

export default function T21Calculator() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Calculadora de Riesgo T21</h1>
        <p className="text-gray-600">Evaluación de riesgo de trisomía 21 basada en múltiples marcadores</p>
      </div>
      <TrisomyCalculator />
    </div>
  );
}