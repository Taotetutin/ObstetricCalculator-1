import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, XCircle, CheckCircle, Info, Heart } from 'lucide-react';

interface MedicationData {
  name: string;
  category: string;
  description: string;
  risks: string;
  recommendations: string;
}

interface SafetyVisualizationProps {
  medication: MedicationData | null;
  trimester?: number;
}

export function MedicationSafetyVisualization({ medication, trimester = 1 }: SafetyVisualizationProps) {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (medication) {
      const timer = setTimeout(() => setAnimationStep(1), 300);
      return () => clearTimeout(timer);
    }
  }, [medication]);

  if (!medication) {
    return (
      <div className="flex items-center justify-center p-12 bg-gray-50 rounded-xl">
        <div className="text-center text-gray-500">
          <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Busca un medicamento para ver su perfil de seguridad</p>
        </div>
      </div>
    );
  }

  const getSafetyLevel = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'A':
        return { level: 'safe', color: 'green', score: 95, icon: CheckCircle };
      case 'B':
        return { level: 'probably-safe', color: 'blue', score: 80, icon: Shield };
      case 'C':
        return { level: 'caution', color: 'yellow', score: 60, icon: AlertTriangle };
      case 'D':
        return { level: 'high-risk', color: 'orange', score: 30, icon: AlertTriangle };
      case 'X':
        return { level: 'contraindicated', color: 'red', score: 5, icon: XCircle };
      default:
        return { level: 'unknown', color: 'gray', score: 50, icon: Info };
    }
  };

  const safety = getSafetyLevel(medication.category);
  const SafetyIcon = safety.icon;

  const getSafetyText = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'A':
        return {
          title: 'Seguro',
          subtitle: 'Estudios controlados sin evidencia de riesgo',
          message: 'Este medicamento se considera seguro durante el embarazo.'
        };
      case 'B':
        return {
          title: 'Probablemente Seguro',
          subtitle: 'Sin evidencia de riesgo en humanos',
          message: 'Los estudios no han demostrado riesgo fetal.'
        };
      case 'C':
        return {
          title: 'Usar con Precaución',
          subtitle: 'El riesgo no puede descartarse',
          message: 'Solo usar si el beneficio supera el riesgo potencial.'
        };
      case 'D':
        return {
          title: 'Alto Riesgo',
          subtitle: 'Evidencia de riesgo fetal',
          message: 'Solo usar en situaciones que pongan en peligro la vida.'
        };
      case 'X':
        return {
          title: 'Contraindicado',
          subtitle: 'Riesgo supera cualquier beneficio',
          message: 'No usar durante el embarazo bajo ninguna circunstancia.'
        };
      default:
        return {
          title: 'Información No Disponible',
          subtitle: 'Consulte con su médico',
          message: 'No hay suficiente información disponible sobre este medicamento.'
        };
    }
  };

  const safetyText = getSafetyText(medication.category);

  const getTrimesterRisk = (category: string, trimester: number) => {
    // Some medications have different risks per trimester
    const specialCases: Record<string, { [key: number]: string }> = {
      'C/D': {
        1: 'C - Precaución',
        2: 'C - Precaución',
        3: 'D - Alto Riesgo'
      }
    };

    if (specialCases[category]) {
      return specialCases[category][trimester] || category;
    }
    return category;
  };

  const currentTrimesterCategory = getTrimesterRisk(medication.category, trimester);

  return (
    <div className="space-y-6">
      {/* Main Safety Indicator */}
      <div className={`bg-gradient-to-br from-${safety.color}-50 to-${safety.color}-100 rounded-2xl p-6 border-2 border-${safety.color}-200 transform transition-all duration-500 ${animationStep >= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-${safety.color}-500 rounded-full flex items-center justify-center text-white shadow-lg`}>
              <SafetyIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{safetyText.title}</h3>
              <p className={`text-${safety.color}-700 font-medium`}>{safetyText.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold text-${safety.color}-600`}>
              {medication.category || '?'}
            </div>
            <div className="text-sm text-gray-600">Categoría FDA</div>
          </div>
        </div>
        
        {/* Safety Score Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Puntuación de Seguridad</span>
            <span>{safety.score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r from-${safety.color}-400 to-${safety.color}-600 h-3 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: animationStep >= 1 ? `${safety.score}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Trimester-Specific Risk */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-500" />
          Riesgo por Trimestre
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((t) => {
            const trimesterCategory = getTrimesterRisk(medication.category, t);
            const trimesterSafety = getSafetyLevel(trimesterCategory.split(' ')[0]);
            const isActive = t === trimester;
            
            return (
              <div 
                key={t}
                className={`p-3 rounded-lg border-2 text-center transition-all duration-300 ${
                  isActive 
                    ? `border-${trimesterSafety.color}-400 bg-${trimesterSafety.color}-50` 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium text-gray-600">
                  {t}° Trimestre
                </div>
                <div className={`text-lg font-bold ${isActive ? `text-${trimesterSafety.color}-600` : 'text-gray-400'}`}>
                  {trimesterCategory.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risks */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-red-600 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Riesgos Potenciales
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {medication.risks || 'No se han especificado riesgos particulares.'}
          </p>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Recomendaciones
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {medication.recommendations || 'Consulte siempre con su profesional de la salud.'}
          </p>
        </div>
      </div>

      {/* Safety Message */}
      <div className={`bg-gradient-to-r from-${safety.color}-500 to-${safety.color}-600 text-white rounded-xl p-5`}>
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">Mensaje de Seguridad</h4>
            <p className="text-sm opacity-90 leading-relaxed">
              {safetyText.message} Siempre consulte con su médico antes de iniciar, cambiar o suspender cualquier medicamento durante el embarazo.
            </p>
          </div>
        </div>
      </div>

      {/* FDA Source Indicator */}
      <div className="text-center py-3">
        <div className="inline-flex items-center text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
          <Shield className="w-3 h-3 mr-1" />
          Información oficial de la base de datos FDA
        </div>
      </div>
    </div>
  );
}