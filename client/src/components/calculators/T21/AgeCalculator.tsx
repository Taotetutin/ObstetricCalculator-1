
import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { calculateAgeBasedRisk } from '../utils/riskCalculators';
import RiskDisplay from './RiskDisplay';

export default function AgeCalculator() {
  const [formData, setFormData] = useState({
    maternalAge: '',
    previousT21: false
  });
  const [risk, setRisk] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedRisk = calculateAgeBasedRisk(
      parseInt(formData.maternalAge),
      formData.previousT21
    );
    setRisk(calculatedRisk);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-blue-900">Riesgo por Edad Materna</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-800">
              Edad Materna (años)
            </label>
            <input
              type="number"
              value={formData.maternalAge}
              onChange={(e) => setFormData({ ...formData, maternalAge: e.target.value })}
              className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="15"
              max="50"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-blue-800">
              <input
                type="checkbox"
                checked={formData.previousT21}
                onChange={(e) => setFormData({ ...formData, previousT21: e.target.checked })}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              Antecedente de hijo con Trisomía 21
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] shadow-lg"
          >
            Calcular Riesgo
          </button>
        </form>
      </div>

      {risk !== null && (
        <RiskDisplay 
          title="Riesgo Base por Edad"
          risk={risk}
          description="Este cálculo considera la edad materna y antecedentes familiares para determinar el riesgo basal de trisomía 21."
        />
      )}
    </div>
  );
}
