import React, { useState } from 'react';
import { Calculator, Heart, AlertTriangle, Stethoscope } from 'lucide-react';
import { calculateRiskLevel, type RiskFactors, type RiskAssessment } from './utils/riskCalculator';
import { RiskResult } from './components/RiskResult';
import { GestationWheelRoller } from "@/components/ui/gestation-wheel-roller";

export default function ColestasisCalculator() {
  const [formData, setFormData] = useState({
    age: '',
    gestationalWeeks: 20,
    gestationalDays: 0,
    bileAcids: '',
    totalBilirubin: '',
    got: '',
    gpt: '',
    prInterval: 'no_evaluado',
    prValue: '',
    meconium: 'no',
    earlyOnset: 'no',
    noTreatmentResponse: 'no'
  });

  const [result, setResult] = useState<RiskAssessment | null>(null);

  const calculateRisk = (e: React.FormEvent) => {
    e.preventDefault();

    const riskFactors: RiskFactors = {
      bileAcids: parseFloat(formData.bileAcids),
      got: parseFloat(formData.got),
      gpt: parseFloat(formData.gpt),
      totalBilirubin: parseFloat(formData.totalBilirubin),
      prInterval: formData.prInterval,
      prValue: parseFloat(formData.prValue || '0'),
      meconium: formData.meconium,
      earlyOnset: formData.earlyOnset,
      noTreatmentResponse: formData.noTreatmentResponse,
      gestationalWeeks: formData.gestationalWeeks
    };

    const assessment = calculateRiskLevel(riskFactors);
    setResult(assessment);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGestationChange = (value: { weeks: number; days: number }) => {
    setFormData(prev => ({
      ...prev,
      gestationalWeeks: value.weeks,
      gestationalDays: value.days
    }));
  };

  // Generar array de edades de 14 a 50
  const ages = Array.from({ length: 37 }, (_, i) => i + 14);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-blue-700 mb-1">
          Cálculo de Riesgo Fetal en Colestasis
        </h2>
      </div>

      <form onSubmit={calculateRisk} className="bg-white rounded-2xl shadow-xl p-8">
        <div className="space-y-8">
          {/* Patient Data Section */}
          <section className="bg-blue-50 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Edad
                </label>
                <select
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar</option>
                  {ages.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Edad Gestacional
                </label>
                <GestationWheelRoller
                  value={{ weeks: formData.gestationalWeeks, days: formData.gestationalDays }}
                  onChange={handleGestationChange}
                />
              </div>
            </div>
          </section>

          {/* Laboratory Results Section */}
          <section className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Calculator className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-blue-900">Resultados de Laboratorio</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Ácidos Biliares (μmol/L)
                </label>
                <input
                  type="number"
                  name="bileAcids"
                  value={formData.bileAcids}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Bilirrubina Total (mg/dL)
                </label>
                <input
                  type="number"
                  name="totalBilirubin"
                  value={formData.totalBilirubin}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  GOT (U/L)
                </label>
                <input
                  type="number"
                  name="got"
                  value={formData.got}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  GPT (U/L)
                </label>
                <input
                  type="number"
                  name="gpt"
                  value={formData.gpt}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </section>

          {/* Clinical Features Section */}
          <section className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Stethoscope className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-blue-900">Características Clínicas</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Intervalo PR
                </label>
                <select
                  name="prInterval"
                  value={formData.prInterval}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no_evaluado">No evaluado</option>
                  <option value="evaluado">Evaluado</option>
                </select>
              </div>

              {formData.prInterval === 'evaluado' && (
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Valor PR (ms)
                  </label>
                  <input
                    type="number"
                    name="prValue"
                    value={formData.prValue}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Presencia de Meconio
                </label>
                <select
                  name="meconium"
                  value={formData.meconium}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Inicio Precoz (&lt;30 semanas)
                </label>
                <select
                  name="earlyOnset"
                  value={formData.earlyOnset}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Sin Respuesta al Tratamiento
                </label>
                <select
                  name="noTreatmentResponse"
                  value={formData.noTreatmentResponse}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calcular Riesgo
        </button>
      </form>

      {result && <RiskResult assessment={result} />}
    </div>
  );
}