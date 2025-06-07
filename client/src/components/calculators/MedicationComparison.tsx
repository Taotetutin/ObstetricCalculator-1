import React, { useState } from 'react';
import { ChevronRight, Scale, AlertTriangle, CheckCircle, Info, Plus, X } from 'lucide-react';

interface MedicationData {
  name: string;
  category: string;
  description: string;
  risks: string;
  recommendations: string;
}

interface ComparisonProps {
  medications: MedicationData[];
  onRemoveMedication: (index: number) => void;
  onAddMedication: () => void;
}

export function MedicationComparison({ medications, onRemoveMedication, onAddMedication }: ComparisonProps) {
  const [selectedTrimester, setSelectedTrimester] = useState(1);

  const getSafetyScore = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'A': return 95;
      case 'B': return 80;
      case 'C': return 60;
      case 'D': return 30;
      case 'X': return 5;
      default: return 50;
    }
  };

  const getSafetyColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'A': return 'green';
      case 'B': return 'blue';
      case 'C': return 'yellow';
      case 'D': return 'orange';
      case 'X': return 'red';
      default: return 'gray';
    }
  };

  const getSafetyIcon = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'A': return CheckCircle;
      case 'B': return CheckCircle;
      case 'C': return AlertTriangle;
      case 'D': return AlertTriangle;
      case 'X': return X;
      default: return Info;
    }
  };

  const getRecommendationLevel = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'A': return 'Recomendado';
      case 'B': return 'Seguro';
      case 'C': return 'Con precaución';
      case 'D': return 'Evitar si es posible';
      case 'X': return 'Contraindicado';
      default: return 'Consultar médico';
    }
  };

  if (medications.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
        <Scale className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Comparador de Medicamentos</h3>
        <p className="text-gray-500 mb-4">Agrega medicamentos para comparar su seguridad durante el embarazo</p>
        <button
          onClick={onAddMedication}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Agregar Medicamento
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Comparación de Seguridad</h2>
              <p className="text-blue-100">Análisis comparativo de medicamentos durante el embarazo</p>
            </div>
          </div>
          <button
            onClick={onAddMedication}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Trimester Selector */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Trimestre de Evaluación</h3>
        <div className="flex space-x-2">
          {[1, 2, 3].map((trimester) => (
            <button
              key={trimester}
              onClick={() => setSelectedTrimester(trimester)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                selectedTrimester === trimester
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {trimester}° Trimestre
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medications.map((medication, index) => {
          const SafetyIcon = getSafetyIcon(medication.category);
          const safetyColor = getSafetyColor(medication.category);
          const safetyScore = getSafetyScore(medication.category);
          const recommendationLevel = getRecommendationLevel(medication.category);

          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Header */}
              <div className={`bg-${safetyColor}-50 p-4 border-b border-${safetyColor}-100`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{medication.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 bg-${safetyColor}-500 rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                        {medication.category}
                      </div>
                      <span className={`text-sm font-medium text-${safetyColor}-700`}>
                        {recommendationLevel}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveMedication(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Safety Score */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Puntuación de Seguridad</span>
                    <span>{safetyScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${safetyColor}-500 h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${safetyScore}%` }}
                    />
                  </div>
                </div>

                {/* Key Info */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Riesgos</h4>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {medication.risks || 'No se especifican riesgos particulares'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Recomendaciones</h4>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {medication.recommendations || 'Consulte con su médico'}
                    </p>
                  </div>
                </div>

                {/* Safety Indicator */}
                <div className={`flex items-center space-x-2 p-2 bg-${safetyColor}-50 rounded-lg`}>
                  <SafetyIcon className={`w-4 h-4 text-${safetyColor}-600`} />
                  <span className={`text-xs font-medium text-${safetyColor}-700`}>
                    {medication.category === 'A' && 'Seguro para usar'}
                    {medication.category === 'B' && 'Probablemente seguro'}
                    {medication.category === 'C' && 'Usar con precaución'}
                    {medication.category === 'D' && 'Riesgo documentado'}
                    {medication.category === 'X' && 'No usar en embarazo'}
                    {!['A', 'B', 'C', 'D', 'X'].includes(medication.category) && 'Consultar especialista'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Ranking */}
      {medications.length > 1 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <ChevronRight className="w-5 h-5 mr-2 text-blue-500" />
            Ranking de Seguridad
          </h3>
          <div className="space-y-3">
            {medications
              .map((med, idx) => ({ ...med, originalIndex: idx }))
              .sort((a, b) => getSafetyScore(b.category) - getSafetyScore(a.category))
              .map((medication, rank) => {
                const safetyColor = getSafetyColor(medication.category);
                const SafetyIcon = getSafetyIcon(medication.category);
                
                return (
                  <div key={medication.originalIndex} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-bold text-gray-600">
                      {rank + 1}
                    </div>
                    <SafetyIcon className={`w-5 h-5 text-${safetyColor}-600`} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{medication.name}</div>
                      <div className="text-sm text-gray-600">
                        Categoría {medication.category} - {getSafetyScore(medication.category)}/100 puntos
                      </div>
                    </div>
                    <div className={`px-3 py-1 bg-${safetyColor}-100 text-${safetyColor}-700 rounded-full text-xs font-medium`}>
                      {getRecommendationLevel(medication.category)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Add More Button */}
      <div className="text-center">
        <button
          onClick={onAddMedication}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar otro medicamento</span>
        </button>
      </div>
    </div>
  );
}