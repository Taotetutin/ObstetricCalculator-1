import React from 'react';
import { calculatorTypes } from "@shared/schema";

interface FormData {
  fcb: string;
  variabilidad: string;
  aceleraciones: string;
  desaceleraciones: string;
  movimientos?: string;
  duracionRegistro?: string;
}

interface Result {
  classification: string;
  pathology: string;
  guidelines: string[];
  categoryClass: string;
  riskLevel: string;
  recommendations: string[];
}

function MEFIForm({ formData, onChange, onSubmit }: {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-blue-700">
          Frecuencia Cardíaca Basal
        </label>
        <select
          name="fcb"
          value={formData.fcb}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Clasificar
      </button>
    </form>
  );
}

function ResultDisplay({ result }: { result: Result }) {
  return (
    <div className="mt-8 space-y-6">
      <div className={`rounded-lg border p-6 ${result.categoryClass}`}>
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

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Recomendaciones:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-700">{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MEFICalculator() {
  const [formData, setFormData] = React.useState<FormData>({
    fcb: "",
    variabilidad: "",
    aceleraciones: "",
    desaceleraciones: "",
  });

  const [result, setResult] = React.useState<Result | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement MEFI calculation logic
    const result: Result = {
      classification: "Categoría II",
      pathology: "Indeterminado",
      guidelines: ["Criterio 1", "Criterio 2"],
      categoryClass: "border-yellow-500 bg-yellow-50",
      riskLevel: "Riesgo Moderado",
      recommendations: ["Recomendación 1", "Recomendación 2"]
    };
    setResult(result);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "mefi",
          input: JSON.stringify(formData),
          result: JSON.stringify(result),
        }),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-blue-700 mb-1">Monitoreo Electrónico Fetal Intraparto</h2>
      </div>

      <MEFIForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      {result && <ResultDisplay result={result} />}
    </div>
  );
}