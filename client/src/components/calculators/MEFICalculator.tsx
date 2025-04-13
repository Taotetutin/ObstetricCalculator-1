import React from 'react';
import { calculatorTypes } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import SpeechButton from "@/components/ui/SpeechButton";
import GeneratePDFButton from "@/components/ui/GeneratePDFButton";

interface Result {
  classification: string;
  pathology: string;
  guidelines: string[];
  categoryClass: string;
  riskLevel: string;
  recommendations: string[];
  ctgAnalysis?: {
    confidence: number;
    similarCases: number;
    historicalOutcome?: string;
  };
}

function calculateMEFI(data: {
  fcb: string;
  variabilidad: string;
  aceleraciones: string;
  desaceleraciones: string;
}): Result {
  // Categoría III - Patológico (Primero evaluamos el caso más grave)
  if (
    data.fcb === "bradicardia_severa" ||
    data.desaceleraciones === "prolongadas" ||
    data.desaceleraciones === "sinusoidal" ||
    (data.variabilidad === "ausente" && data.desaceleraciones === "tardias") ||
    (data.variabilidad === "ausente" && data.desaceleraciones === "variables")
  ) {
    return {
      classification: "Categoría III",
      pathology: "Trazado anormal - Estado fetal no tranquilizador",
      guidelines: [
        "Ausencia de variabilidad con desaceleraciones tardías o variables recurrentes",
        "Bradicardia severa sostenida",
        "Patrón sinusoidal confirmado",
        "Variabilidad ausente con FCB basal normal y ausencia de aceleraciones"
      ],
      categoryClass: "border-red-500 bg-red-50",
      riskLevel: "Alto riesgo - Requiere acción inmediata",
      recommendations: [
        "Evaluación inmediata por especialista",
        "Oxigenoterapia materna con mascarilla (10L/min)",
        "Posición decúbito lateral izquierdo",
        "Hidratación IV rápida (1000cc)",
        "Suspender oxitocina si está en uso",
        "Considerar tocolisis de urgencia si hay taquisistolia",
        "Preparar para posible cesárea de emergencia (10-30 min)",
        "Toma de pH fetal si está disponible y es factible"
      ]
    };
  }

  // Categoría I - Normal
  if (
    data.fcb === "normal" &&
    data.variabilidad === "normal" &&
    data.aceleraciones === "presentes" &&
    data.desaceleraciones === "ausentes"
  ) {
    return {
      classification: "Categoría I",
      pathology: "Trazado normal",
      guidelines: [
        "FCB: 110-160 lpm",
        "Variabilidad moderada (6-25 lpm)",
        "Aceleraciones presentes",
        "Sin desaceleraciones"
      ],
      categoryClass: "border-green-500 bg-green-50",
      riskLevel: "Bajo Riesgo",
      recommendations: [
        "Continuar monitorización habitual",
        "Control cada 30 minutos en fase activa",
        "Documentar evaluación"
      ]
    };
  }

  // Categoría II - Indeterminado (Todo lo demás)
  return {
    classification: "Categoría II",
    pathology: "Indeterminado",
    guidelines: [
      "Taquicardia o bradicardia moderada",
      "Variabilidad mínima o ausente",
      "Desaceleraciones variables o tardías recurrentes"
    ],
    categoryClass: "border-yellow-500 bg-yellow-50",
    riskLevel: "Riesgo Moderado",
    recommendations: [
      "Vigilancia continua",
      "Identificar y corregir causas subyacentes",
      "Considerar medidas de reanimación intrauterina",
      "Reevaluar en 30 minutos tras intervenciones"
    ]
  };
}

export default function MEFICalculator() {
  const [formData, setFormData] = React.useState({
    fcb: "",
    variabilidad: "",
    aceleraciones: "",
    desaceleraciones: "",
  });

  const [result, setResult] = React.useState<Result | null>(null);
  const [ctgAnalysisLoading, setCtgAnalysisLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mefiResult = calculateMEFI(formData);
    setCtgAnalysisLoading(true);

    try {
      // Primero guardamos el cálculo básico
      const calcResponse = await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "mefi",
          input: JSON.stringify(formData),
          result: JSON.stringify(mefiResult),
        }),
      });

      // Luego obtenemos el análisis CTG
      const ctgResponse = await fetch("/api/mefi/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (ctgResponse.ok) {
        const ctgAnalysis = await ctgResponse.json();
        setResult({
          ...mefiResult,
          ctgAnalysis: {
            confidence: ctgAnalysis.recommendationConfidence,
            similarCases: ctgAnalysis.similarCasesCount,
            historicalOutcome: ctgAnalysis.baseRecommendation,
          }
        });
      } else {
        setResult(mefiResult);
      }
    } catch (error) {
      console.error("Error en el análisis:", error);
      setResult(mefiResult);
    } finally {
      setCtgAnalysisLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-blue-700">
            Frecuencia Cardíaca Basal
          </label>
          <select
            name="fcb"
            value={formData.fcb}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="normal">Normal (110-160 lpm)</option>
            <option value="taquicardia">Taquicardia (&gt; 160 lpm por &gt;10 min)</option>
            <option value="bradicardia_leve">Bradicardia Leve (100-110 lpm)</option>
            <option value="bradicardia_moderada">Bradicardia Moderada (80-100 lpm)</option>
            <option value="bradicardia_severa">Bradicardia Severa (&lt; 80 lpm por &gt;3 min)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700">
            Variabilidad
          </label>
          <select
            name="variabilidad"
            value={formData.variabilidad}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="ausente">Ausente (&lt; 2 lpm por &gt;50 min)</option>
            <option value="minima">Mínima (2-5 lpm por &gt;50 min)</option>
            <option value="normal">Normal (6-25 lpm)</option>
            <option value="aumentada">Aumentada (&gt; 25 lpm)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700">
            Aceleraciones
          </label>
          <select
            name="aceleraciones"
            value={formData.aceleraciones}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="presentes">Presentes (≥ 15 lpm × 15 seg)</option>
            <option value="ausentes">Ausentes (en registro de 40-120 min)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-700">
            Desaceleraciones
          </label>
          <select
            name="desaceleraciones"
            value={formData.desaceleraciones}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="ausentes">Ausentes</option>
            <option value="precoces">Precoces</option>
            <option value="variables">Variables recurrentes</option>
            <option value="tardias">Tardías recurrentes</option>
            <option value="prolongadas">Prolongadas (&gt; 3 min)</option>
            <option value="sinusoidal">Patrón Sinusoidal</option>
          </select>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={ctgAnalysisLoading}>
          {ctgAnalysisLoading ? 'Analizando...' : 'Clasificar'}
        </Button>
      </form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div id="pdf-content" className={`rounded-lg border p-6 ${result.categoryClass}`}>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{result.classification}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.categoryClass.includes('green') ? 'bg-green-200 text-green-800' :
                  result.categoryClass.includes('red') ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {result.riskLevel}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{result.pathology}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Criterios diagnósticos:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.guidelines.map((guideline, index) => (
                      <li key={index} className="text-gray-700">{guideline}</li>
                    ))}
                  </ul>
                </div>

                {result.ctgAnalysis && (
                  <div className="bg-white/50 rounded-lg p-4 border border-current/10">
                    <h3 className="font-medium text-gray-900 mb-2">Análisis basado en datos históricos:</h3>
                    <div className="space-y-2 text-sm">
                      <p>Confianza del análisis: {Math.round(result.ctgAnalysis.confidence)}%</p>
                      <p>Basado en {result.ctgAnalysis.similarCases} casos similares</p>
                      {result.ctgAnalysis.historicalOutcome && (
                        <p>Recomendación adicional: {result.ctgAnalysis.historicalOutcome}</p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Recomendaciones:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-gray-700">{recommendation}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 space-y-4 print:hidden">
                  <p className="text-sm text-gray-500 mb-2">Fecha: {format(new Date(), "dd/MM/yyyy")}</p>
                  
                  <SpeechButton
                    text={`Resultado del Monitoreo Fetal Intraparto: ${result.classification}. 
                    ${result.pathology}. 
                    Nivel de riesgo: ${result.riskLevel}. 
                    Criterios diagnósticos: ${result.guidelines.join(', ')}. 
                    Recomendaciones: ${result.recommendations.join(', ')}.
                    ${result.ctgAnalysis ? `Confianza del análisis: ${Math.round(result.ctgAnalysis.confidence)}%. 
                    Basado en ${result.ctgAnalysis.similarCases} casos similares.
                    ${result.ctgAnalysis.historicalOutcome ? `Recomendación adicional: ${result.ctgAnalysis.historicalOutcome}` : ''}` : ''}`}
                  />
                  
                  <GeneratePDFButton
                    contentId="pdf-content"
                    fileName="MEFI_Resultado"
                    label="📄 GENERAR INFORME PDF"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}