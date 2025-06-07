import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, TrendingDown, AlertCircle, Info, Zap } from 'lucide-react';

interface DosageRiskProps {
  medication: {
    name: string;
    category: string;
    description: string;
    risks: string;
    recommendations: string;
  };
  trimester: number;
}

export function DosageRiskCalculator({ medication, trimester }: DosageRiskProps) {
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [duration, setDuration] = useState('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    calculateRisk();
  }, [dosage, frequency, duration, medication.category, trimester]);

  const calculateRisk = () => {
    if (!dosage || !duration) {
      setRiskScore(0);
      setRiskLevel('low');
      return;
    }

    const dose = parseFloat(dosage);
    const freq = parseInt(frequency);
    const dur = parseInt(duration);

    if (isNaN(dose) || isNaN(freq) || isNaN(dur)) {
      setRiskScore(0);
      setRiskLevel('low');
      return;
    }

    // Base risk calculation based on FDA category
    let baseRisk = 0;
    switch (medication.category?.toUpperCase()) {
      case 'A': baseRisk = 10; break;
      case 'B': baseRisk = 25; break;
      case 'C': baseRisk = 50; break;
      case 'D': baseRisk = 75; break;
      case 'X': baseRisk = 95; break;
      default: baseRisk = 40; break;
    }

    // Dosage factor (example thresholds - in reality this would be drug-specific)
    let dosageFactor = 1;
    if (dose > 1000) dosageFactor = 1.5;
    else if (dose > 500) dosageFactor = 1.3;
    else if (dose > 100) dosageFactor = 1.1;

    // Frequency factor
    let frequencyFactor = 1;
    if (freq >= 4) frequencyFactor = 1.4;
    else if (freq >= 3) frequencyFactor = 1.2;
    else if (freq >= 2) frequencyFactor = 1.1;

    // Duration factor
    let durationFactor = 1;
    if (dur > 90) durationFactor = 1.6;
    else if (dur > 30) durationFactor = 1.3;
    else if (dur > 14) durationFactor = 1.2;
    else if (dur > 7) durationFactor = 1.1;

    // Trimester factor
    let trimesterFactor = 1;
    if (trimester === 1) trimesterFactor = 1.3; // First trimester is most critical
    else if (trimester === 3) trimesterFactor = 1.1; // Third trimester has some increased risks

    const calculatedRisk = Math.min(100, baseRisk * dosageFactor * frequencyFactor * durationFactor * trimesterFactor);
    setRiskScore(Math.round(calculatedRisk));

    // Determine risk level
    if (calculatedRisk >= 80) setRiskLevel('critical');
    else if (calculatedRisk >= 60) setRiskLevel('high');
    else if (calculatedRisk >= 30) setRiskLevel('medium');
    else setRiskLevel('low');
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return TrendingDown;
      case 'medium': return Info;
      case 'high': return TrendingUp;
      case 'critical': return AlertCircle;
      default: return Info;
    }
  };

  const getRiskMessage = (level: string) => {
    switch (level) {
      case 'low': return 'Riesgo bajo con esta dosificación';
      case 'medium': return 'Riesgo moderado - monitoreo recomendado';
      case 'high': return 'Riesgo alto - consulte inmediatamente con su médico';
      case 'critical': return 'Riesgo crítico - considere alternativas más seguras';
      default: return 'Ingrese la dosificación para calcular el riesgo';
    }
  };

  const RiskIcon = getRiskIcon(riskLevel);
  const riskColor = getRiskColor(riskLevel);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Calculadora de Riesgo por Dosificación</h3>
          <p className="text-sm text-gray-600">Evalúa el riesgo basado en dosis, frecuencia y duración</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Dosage Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dosis (mg)
          </label>
          <input
            type="number"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="Ej: 500"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Frequency Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frecuencia (por día)
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="1">1 vez al día</option>
            <option value="2">2 veces al día</option>
            <option value="3">3 veces al día</option>
            <option value="4">4 veces al día</option>
            <option value="6">Cada 4 horas</option>
            <option value="8">Cada 3 horas</option>
          </select>
        </div>

        {/* Duration Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración (días)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ej: 7"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Risk Assessment Display */}
      {(dosage && duration) && (
        <div className={`bg-${riskColor}-50 border border-${riskColor}-200 rounded-xl p-5 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-${riskColor}-500 rounded-full flex items-center justify-center`}>
                <RiskIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold text-${riskColor}-800 text-lg`}>
                  Puntuación de Riesgo: {riskScore}/100
                </h4>
                <p className={`text-${riskColor}-700`}>{getRiskMessage(riskLevel)}</p>
              </div>
            </div>
            <div className={`text-3xl font-bold text-${riskColor}-600`}>
              {riskLevel.toUpperCase()}
            </div>
          </div>

          {/* Risk Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Nivel de Riesgo</span>
              <span>{riskScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`bg-gradient-to-r from-${riskColor}-400 to-${riskColor}-600 h-4 rounded-full transition-all duration-1000 ease-out relative`}
                style={{ width: `${riskScore}%` }}
              >
                <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Bajo</span>
              <span>Moderado</span>
              <span>Alto</span>
              <span>Crítico</span>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Risk Factors */}
      {(dosage && duration) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              Factores de Riesgo
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Categoría FDA:</span>
                <span className="font-medium">{medication.category} - 
                  {medication.category === 'A' && ' Seguro'}
                  {medication.category === 'B' && ' Probablemente seguro'}
                  {medication.category === 'C' && ' Precaución'}
                  {medication.category === 'D' && ' Riesgo documentado'}
                  {medication.category === 'X' && ' Contraindicado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trimestre:</span>
                <span className="font-medium">{trimester}° - 
                  {trimester === 1 && ' Desarrollo crítico'}
                  {trimester === 2 && ' Periodo estable'}
                  {trimester === 3 && ' Preparación parto'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dosis diaria total:</span>
                <span className="font-medium">{parseFloat(dosage || '0') * parseInt(frequency)} mg</span>
              </div>
              <div className="flex justify-between">
                <span>Exposición total:</span>
                <span className="font-medium">{parseFloat(dosage || '0') * parseInt(frequency) * parseInt(duration || '0')} mg</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3 flex items-center">
              <Info className="w-4 h-4 mr-2 text-blue-500" />
              Recomendaciones Específicas
            </h5>
            <div className="space-y-2 text-sm text-gray-700">
              {riskLevel === 'low' && (
                <div>
                  <p>• Dosificación dentro de rangos seguros</p>
                  <p>• Monitoreo rutinario recomendado</p>
                  <p>• Continuar según prescripción médica</p>
                </div>
              )}
              {riskLevel === 'medium' && (
                <div>
                  <p>• Monitoreo más frecuente recomendado</p>
                  <p>• Evaluar reducción de dosis si es posible</p>
                  <p>• Discutir con su médico alternativas</p>
                </div>
              )}
              {riskLevel === 'high' && (
                <div>
                  <p>• Contactar inmediatamente a su médico</p>
                  <p>• Considerar reducción significativa de dosis</p>
                  <p>• Evaluación urgente de alternativas</p>
                </div>
              )}
              {riskLevel === 'critical' && (
                <div>
                  <p>• SUSPENDER y contactar médico URGENTE</p>
                  <p>• Buscar alternativas inmediatamente</p>
                  <p>• Monitoreo fetal intensivo necesario</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Importante:</p>
            <p>Esta calculadora es solo una herramienta de orientación. Los cálculos de riesgo se basan en datos generales y pueden no reflejar su situación específica. Siempre consulte con su profesional de la salud antes de tomar decisiones sobre medicamentos durante el embarazo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}