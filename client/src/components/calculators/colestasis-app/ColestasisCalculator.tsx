import React, { useState, useEffect } from 'react';
import { Calculator, Heart, AlertTriangle, Stethoscope } from 'lucide-react';
import { calculateRiskLevel, type RiskFactors, type RiskAssessment } from './utils/riskCalculator';
import { RiskResult } from './components/RiskResult';
import { format, differenceInWeeks, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Generamos arrays para los selectores de fecha
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export default function ColestasisCalculator() {
  const [formData, setFormData] = useState({
    age: '',
    gestationalDate: new Date(),
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

  const handleGestationDateChange = (type: 'day' | 'month' | 'year', value: string) => {
    const newDate = new Date(formData.gestationalDate);
    if (type === 'day') newDate.setDate(parseInt(value));
    if (type === 'month') newDate.setMonth(parseInt(value) - 1);
    if (type === 'year') newDate.setFullYear(parseInt(value));
    
    // Calculamos semanas y días de gestación basados en la fecha actual
    const today = new Date();
    const weeks = differenceInWeeks(today, newDate);
    const totalDays = differenceInDays(today, newDate);
    const remainingDays = totalDays % 7;
    
    setFormData(prev => ({
      ...prev,
      gestationalDate: newDate,
      gestationalWeeks: weeks,
      gestationalDays: remainingDays
    }));
  };
  
  // Efecto para actualizar las semanas y días gestacionales cuando se carga el componente
  useEffect(() => {
    const today = new Date();
    const weeks = differenceInWeeks(today, formData.gestationalDate);
    const totalDays = differenceInDays(today, formData.gestationalDate);
    const remainingDays = totalDays % 7;
    
    setFormData(prev => ({
      ...prev,
      gestationalWeeks: weeks,
      gestationalDays: remainingDays
    }));
  }, []);

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
                  Fecha de Gestación
                </label>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <select
                        className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.gestationalDate.getDate().toString()}
                        onChange={(e) => handleGestationDateChange('day', e.target.value)}
                      >
                        {days.map((day) => (
                          <option key={day} value={day.toString()}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <div className="mt-1 text-xs text-center text-gray-500">Día</div>
                    </div>

                    <div className="flex-[1.2]">
                      <select
                        className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={(formData.gestationalDate.getMonth() + 1).toString()}
                        onChange={(e) => handleGestationDateChange('month', e.target.value)}
                      >
                        {months.map((month) => (
                          <option key={month} value={month.toString()}>
                            {format(new Date(2024, month - 1), 'MMMM', { locale: es })}
                          </option>
                        ))}
                      </select>
                      <div className="mt-1 text-xs text-center text-gray-500">Mes</div>
                    </div>

                    <div className="flex-1">
                      <select
                        className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.gestationalDate.getFullYear().toString()}
                        onChange={(e) => handleGestationDateChange('year', e.target.value)}
                      >
                        {years.map((year) => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <div className="mt-1 text-xs text-center text-gray-500">Año</div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-blue-100 text-center">
                    <p className="text-blue-800 font-medium">
                      Edad gestacional calculada: <span className="font-bold">{formData.gestationalWeeks} semanas y {formData.gestationalDays} días</span>
                    </p>
                  </div>
                </div>
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