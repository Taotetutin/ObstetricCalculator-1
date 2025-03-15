import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { calculateFirstTrimesterRisk } from '../utils/riskCalculators';
import RiskDisplay from './RiskDisplay';

export default function FirstTrimesterCalculator() {
  const [markers, setMarkers] = useState({
    maternalAge: '',
    gestationalAge: '',
    crl: '',
    nt: '',
    previousT21: false,
    bhcg: '',
    pappa: ''
  });

  const [risk, setRisk] = useState<number | null>(null);
  const [crlError, setCrlError] = useState<string>('');

  const validateCRL = (value: string) => {
    const crl = parseFloat(value);
    if (crl < 45 || crl > 84) {
      setCrlError('CRL debe estar entre 45 y 84 mm');
      return false;
    }
    setCrlError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCRL(markers.crl)) return;

    const calculatedRisk = calculateFirstTrimesterRisk({
      maternalAge: parseInt(markers.maternalAge),
      gestationalAge: parseFloat(markers.gestationalAge),
      crl: parseFloat(markers.crl),
      nt: parseFloat(markers.nt),
      previousT21: markers.previousT21,
      bhcg: parseFloat(markers.bhcg),
      pappa: parseFloat(markers.pappa)
    });

    setRisk(calculatedRisk);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-blue-900">Cálculo Primer Trimestre</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-800">
                Edad Materna (años)
              </label>
              <input
                type="number"
                value={markers.maternalAge}
                onChange={(e) => setMarkers({ ...markers, maternalAge: e.target.value })}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="15"
                max="50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800">
                Edad Gestacional (semanas)
              </label>
              <input
                type="number"
                value={markers.gestationalAge}
                onChange={(e) => setMarkers({ ...markers, gestationalAge: e.target.value })}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="11"
                max="13.6"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800">
                CRL (mm)
              </label>
              <input
                type="number"
                value={markers.crl}
                onChange={(e) => {
                  setMarkers({ ...markers, crl: e.target.value });
                  validateCRL(e.target.value);
                }}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                  crlError ? 'border-red-300 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'
                }`}
                min="45"
                max="84"
                required
              />
              {crlError && (
                <p className="mt-1 text-sm text-red-600">{crlError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800">
                NT (mm)
              </label>
              <input
                type="number"
                value={markers.nt}
                onChange={(e) => setMarkers({ ...markers, nt: e.target.value })}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0.5"
                max="10"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800">
                β-hCG (MoM)
              </label>
              <input
                type="number"
                value={markers.bhcg}
                onChange={(e) => setMarkers({ ...markers, bhcg: e.target.value })}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0.1"
                max="5"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800">
                PAPP-A (MoM)
              </label>
              <input
                type="number"
                value={markers.pappa}
                onChange={(e) => setMarkers({ ...markers, pappa: e.target.value })}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0.1"
                max="5"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-blue-800">
              <input
                type="checkbox"
                checked={markers.previousT21}
                onChange={(e) => setMarkers({ ...markers, previousT21: e.target.checked })}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              Antecedente de hijo con Trisomía 21
            </label>
          </div>

          <button
            type="submit"
            disabled={!!crlError}
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] shadow-lg ${
              crlError ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Calcular Riesgo
          </button>
        </form>
      </div>

      {risk !== null && (
        <RiskDisplay
          title="Riesgo Primer Trimestre"
          risk={risk}
          description="Este cálculo considera los marcadores ecográficos y bioquímicos del primer trimestre para ajustar el riesgo de trisomía 21."
        />
      )}
    </div>
  );
}