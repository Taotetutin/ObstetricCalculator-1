import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  Shield, 
  Plus, 
  X, 
  Activity,
  Eye,
  Brain,
  Heart,
  Zap,
  Search,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  mechanism: string;
  clinical_effect: string;
  pregnancy_specific_risk: string;
  management: string;
  alternatives: string[];
  monitoring_parameters: string[];
  onset: 'rapid' | 'delayed' | 'variable';
  documentation: 'excellent' | 'good' | 'fair' | 'poor';
}

interface InteractionAnalysis {
  total_interactions: number;
  severity_breakdown: {
    contraindicated: number;
    major: number;
    moderate: number;
    minor: number;
  };
  high_risk_combinations: DrugInteraction[];
  pregnancy_specific_warnings: string[];
  overall_risk_score: number;
  recommendations: string[];
}

interface InteractionVisualizerProps {
  initialMedications?: string[];
}

export function MedicationInteractionVisualizer({ initialMedications = [] }: InteractionVisualizerProps) {
  const [medications, setMedications] = useState<string[]>(initialMedications);
  const [newMedication, setNewMedication] = useState('');
  const [analysis, setAnalysis] = useState<InteractionAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<DrugInteraction | null>(null);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'network'>('summary');

  useEffect(() => {
    if (medications.length >= 2) {
      analyzeInteractions();
    } else {
      setAnalysis(null);
    }
  }, [medications]);

  const analyzeInteractions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interactions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications })
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMedication = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'contraindicated': return 'red';
      case 'major': return 'orange';
      case 'moderate': return 'yellow';
      case 'minor': return 'blue';
      default: return 'gray';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'contraindicated': return XCircle;
      case 'major': return AlertTriangle;
      case 'moderate': return AlertCircle;
      case 'minor': return Shield;
      default: return Shield;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 20) return 'red';
    if (score >= 10) return 'orange';
    if (score >= 5) return 'yellow';
    return 'green';
  };

  const getOnsetIcon = (onset: string) => {
    switch (onset) {
      case 'rapid': return Zap;
      case 'delayed': return TrendingUp;
      case 'variable': return Activity;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Analizador de Interacciones Medicamentosas</h2>
            <p className="text-purple-100">Evaluación integral de riesgos durante el embarazo</p>
          </div>
        </div>
      </div>

      {/* Medication Input */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Medicamentos Actuales</h3>
        
        <div className="flex space-x-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMedication()}
              placeholder="Agregar medicamento..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={addMedication}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {medications.map((med, index) => (
            <div key={index} className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg flex items-center space-x-2">
              <span>{med}</span>
              <button
                onClick={() => removeMedication(index)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {medications.length < 2 && (
          <p className="text-gray-500 text-sm mt-3">
            Agregue al menos 2 medicamentos para analizar interacciones
          </p>
        )}
      </div>

      {/* View Mode Selector */}
      {analysis && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === 'summary'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📊 Resumen
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === 'detailed'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔍 Detallado
            </button>
            <button
              onClick={() => setViewMode('network')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === 'network'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🕸️ Red de Interacciones
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-600">Analizando interacciones medicamentosas...</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <>
          {/* Summary View */}
          {viewMode === 'summary' && (
            <div className="space-y-6">
              {/* Risk Score Dashboard */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Evaluación General de Riesgo</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-${getRiskScoreColor(analysis.overall_risk_score)}-100 flex items-center justify-center`}>
                      <span className={`text-2xl font-bold text-${getRiskScoreColor(analysis.overall_risk_score)}-600`}>
                        {analysis.overall_risk_score}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Puntuación Total</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">{analysis.severity_breakdown.contraindicated}</p>
                    <p className="text-sm text-gray-600">Contraindicadas</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{analysis.severity_breakdown.major}</p>
                    <p className="text-sm text-gray-600">Mayores</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-yellow-100 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{analysis.severity_breakdown.moderate}</p>
                    <p className="text-sm text-gray-600">Moderadas</p>
                  </div>
                </div>

                {/* Risk Meter */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Nivel de Riesgo</span>
                    <span>{analysis.overall_risk_score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`bg-gradient-to-r from-${getRiskScoreColor(analysis.overall_risk_score)}-400 to-${getRiskScoreColor(analysis.overall_risk_score)}-600 h-4 rounded-full transition-all duration-1000 ease-out relative`}
                      style={{ width: `${Math.min(100, analysis.overall_risk_score)}%` }}
                    >
                      <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Recomendaciones Clínicas</h3>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      {rec.includes('URGENTE') && <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />}
                      {rec.includes('ALTO RIESGO') && <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />}
                      {rec.includes('MONITOREO') && <Eye className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />}
                      {!rec.includes('URGENTE') && !rec.includes('ALTO RIESGO') && !rec.includes('MONITOREO') && 
                        <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />}
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* High Risk Interactions Preview */}
              {analysis.high_risk_combinations.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4">Interacciones de Alto Riesgo</h3>
                  <div className="space-y-3">
                    {analysis.high_risk_combinations.slice(0, 3).map((interaction, index) => {
                      const SeverityIcon = getSeverityIcon(interaction.severity);
                      return (
                        <div key={index} className="p-4 border border-red-200 rounded-lg bg-red-50">
                          <div className="flex items-center space-x-3 mb-2">
                            <SeverityIcon className={`w-5 h-5 text-${getSeverityColor(interaction.severity)}-600`} />
                            <span className="font-medium text-gray-800">
                              {interaction.drug1} + {interaction.drug2}
                            </span>
                            <span className={`px-2 py-1 bg-${getSeverityColor(interaction.severity)}-100 text-${getSeverityColor(interaction.severity)}-700 rounded-full text-xs font-medium uppercase`}>
                              {interaction.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{interaction.clinical_effect}</p>
                          <p className="text-sm text-red-700 font-medium">{interaction.pregnancy_specific_risk}</p>
                        </div>
                      );
                    })}
                  </div>
                  {analysis.high_risk_combinations.length > 3 && (
                    <button
                      onClick={() => setViewMode('detailed')}
                      className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Ver todas las interacciones ({analysis.high_risk_combinations.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Detailed View */}
          {viewMode === 'detailed' && (
            <div className="space-y-6">
              {analysis.high_risk_combinations.map((interaction, index) => {
                const SeverityIcon = getSeverityIcon(interaction.severity);
                const OnsetIcon = getOnsetIcon(interaction.onset);
                
                return (
                  <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <SeverityIcon className={`w-6 h-6 text-${getSeverityColor(interaction.severity)}-600`} />
                        <h3 className="text-lg font-semibold text-gray-800">
                          {interaction.drug1} + {interaction.drug2}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 bg-${getSeverityColor(interaction.severity)}-100 text-${getSeverityColor(interaction.severity)}-700 rounded-full text-sm font-medium uppercase`}>
                          {interaction.severity}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <OnsetIcon className="w-4 h-4" />
                          <span className="text-sm">{interaction.onset}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Mecanismo</h4>
                          <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                            {interaction.mechanism}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Efecto Clínico</h4>
                          <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                            {interaction.clinical_effect}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Riesgo en Embarazo</h4>
                          <p className="text-sm text-red-700 p-3 bg-red-50 rounded-lg">
                            {interaction.pregnancy_specific_risk}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Manejo Clínico</h4>
                          <p className="text-sm text-gray-600 p-3 bg-green-50 rounded-lg">
                            {interaction.management}
                          </p>
                        </div>

                        {interaction.alternatives.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">Alternativas Seguras</h4>
                            <div className="flex flex-wrap gap-2">
                              {interaction.alternatives.map((alt, idx) => (
                                <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                                  {alt}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {interaction.monitoring_parameters.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">Parámetros de Monitoreo</h4>
                            <div className="space-y-1">
                              {interaction.monitoring_parameters.map((param, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <Heart className="w-4 h-4 text-red-500" />
                                  <span className="text-sm text-gray-600">{param}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Network View */}
          {viewMode === 'network' && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-6">Red de Interacciones</h3>
              
              <div className="relative">
                <svg width="100%" height="400" className="border border-gray-200 rounded-lg">
                  {/* Network visualization will be implemented here */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                    </marker>
                  </defs>
                  
                  {/* Medication nodes */}
                  {medications.map((med, index) => {
                    const angle = (index / medications.length) * 2 * Math.PI;
                    const radius = 120;
                    const x = 200 + radius * Math.cos(angle);
                    const y = 200 + radius * Math.sin(angle);
                    
                    return (
                      <g key={index}>
                        <circle
                          cx={x}
                          cy={y}
                          r="30"
                          fill="#e0e7ff"
                          stroke="#6366f1"
                          strokeWidth="2"
                        />
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium fill-gray-800"
                        >
                          {med.length > 8 ? med.substring(0, 8) + '...' : med}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Interaction connections */}
                  {analysis.high_risk_combinations.map((interaction, index) => {
                    const med1Index = medications.findIndex(med => 
                      med.toLowerCase().includes(interaction.drug1.toLowerCase())
                    );
                    const med2Index = medications.findIndex(med => 
                      med.toLowerCase().includes(interaction.drug2.toLowerCase())
                    );
                    
                    if (med1Index >= 0 && med2Index >= 0) {
                      const angle1 = (med1Index / medications.length) * 2 * Math.PI;
                      const angle2 = (med2Index / medications.length) * 2 * Math.PI;
                      const radius = 120;
                      const x1 = 200 + radius * Math.cos(angle1);
                      const y1 = 200 + radius * Math.sin(angle1);
                      const x2 = 200 + radius * Math.cos(angle2);
                      const y2 = 200 + radius * Math.sin(angle2);
                      
                      const strokeColor = getSeverityColor(interaction.severity);
                      const strokeWidth = interaction.severity === 'contraindicated' ? 4 : 
                                        interaction.severity === 'major' ? 3 : 2;
                      
                      return (
                        <line
                          key={index}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={strokeColor === 'red' ? '#dc2626' : 
                                 strokeColor === 'orange' ? '#ea580c' : 
                                 strokeColor === 'yellow' ? '#ca8a04' : '#2563eb'}
                          strokeWidth={strokeWidth}
                          markerEnd="url(#arrowhead)"
                          className="cursor-pointer hover:opacity-75"
                          onClick={() => setSelectedInteraction(interaction)}
                        />
                      );
                    }
                    return null;
                  })}
                </svg>
                
                {/* Legend */}
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
                  <h4 className="font-medium text-gray-800 mb-2">Leyenda</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-red-600"></div>
                      <span>Contraindicado</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-orange-600"></div>
                      <span>Mayor</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-1 bg-yellow-600"></div>
                      <span>Moderado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Interaction Detail Modal */}
      {selectedInteraction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Detalle de Interacción
              </h3>
              <button
                onClick={() => setSelectedInteraction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{selectedInteraction.drug1}</span>
                <span className="text-gray-500">+</span>
                <span className="font-medium">{selectedInteraction.drug2}</span>
              </div>
              
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700 font-medium">
                  {selectedInteraction.pregnancy_specific_risk}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Manejo:</h4>
                <p className="text-sm text-gray-600">{selectedInteraction.management}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}