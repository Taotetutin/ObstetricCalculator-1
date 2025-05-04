import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

// Definir las categorías de la FDA
enum FDACategory {
  A = "A",
  B = "B",
  C = "C",
  D = "D", 
  X = "X",
  NA = "No asignada"
}

// Definir la interfaz para los medicamentos
interface MedicationInfo {
  name: string;
  category: FDACategory;
  description: string;
  risks: string;
  recommendations: string;
  alternatives: string[];
}

// Base de datos de medicamentos comunes
const commonMedications: MedicationInfo[] = [
  {
    name: "Metamizol (Dipirona)",
    category: FDACategory.C,
    description: "Analgésico, antipirético y espasmolítico no opioide. Vía de administración: oral, intramuscular, intravenosa.",
    risks: "Posible asociación con agranulocitosis, especialmente en tratamientos prolongados. Algunos estudios sugieren que su uso en el primer trimestre podría aumentar ligeramente el riesgo de defectos congénitos, aunque la evidencia no es concluyente. En el tercer trimestre, como otros AINEs, podría estar asociado con el cierre prematuro del conducto arterioso.",
    recommendations: "Debe evitarse en el tercer trimestre de embarazo. En el primer y segundo trimestre, usar solo si es claramente necesario y por el período más corto posible. Considerar alternativas con mejor perfil de seguridad durante el embarazo como paracetamol.",
    alternatives: [
      "Paracetamol (más seguro durante todo el embarazo)",
      "Medidas no farmacológicas para control del dolor y fiebre",
      "Consultar con su médico para alternativas específicas según su condición"
    ]
  },
  {
    name: "Paracetamol (Acetaminofén)",
    category: FDACategory.B,
    description: "Analgésico y antipirético de uso común. Vía de administración: oral.",
    risks: "Considerado seguro en todas las etapas del embarazo cuando se usa en dosis recomendadas por períodos cortos. Estudios extensos no han demostrado asociación con malformaciones congénitas o efectos adversos fetales.",
    recommendations: "Puede usarse durante todo el embarazo a las dosis recomendadas (no exceder 4g/día). Preferible sobre otros analgésicos como los AINEs, especialmente en el tercer trimestre.",
    alternatives: [
      "Medidas no farmacológicas para el manejo del dolor y la fiebre",
      "Consultar con su médico para alternativas específicas según su condición"
    ]
  },
  {
    name: "Ibuprofeno",
    category: FDACategory.C,
    description: "Antiinflamatorio no esteroideo (AINE). Vía de administración: oral.",
    risks: "Relativamente seguro durante el primer y segundo trimestre. En el tercer trimestre puede causar cierre prematuro del conducto arterioso, oligohidramnios, y prolongación del parto. Estudios en animales han mostrado efectos reproductivos adversos.",
    recommendations: "Puede usarse con precaución durante el primer y segundo trimestre cuando los beneficios superan los riesgos, pero debe evitarse en el tercer trimestre (después de 28-30 semanas). Usar la dosis efectiva más baja por el menor tiempo posible.",
    alternatives: [
      "Paracetamol (más seguro durante todo el embarazo)",
      "Medidas no farmacológicas para manejo del dolor",
      "Consultar con su médico para alternativas específicas"
    ]
  },
  {
    name: "Amoxicilina",
    category: FDACategory.B,
    description: "Antibiótico betalactámico del grupo de las penicilinas. Vía de administración: oral.",
    risks: "Considerada segura durante el embarazo. Los estudios no han demostrado un aumento en el riesgo de malformaciones congénitas o efectos adversos fetales.",
    recommendations: "Puede usarse en todas las etapas del embarazo cuando está clínicamente indicada para infecciones sensibles. La dosis debe ser ajustada por un médico según la infección y la etapa del embarazo.",
    alternatives: [
      "Otros antibióticos betalactámicos (según sensibilidad)",
      "Consultar con su médico para alternativas específicas según tipo de infección y sensibilidad al antibiótico"
    ]
  },
  {
    name: "Propranolol",
    category: FDACategory.C,
    description: "Betabloqueante no selectivo. Vía de administración: oral.",
    risks: "Puede asociarse con restricción del crecimiento intrauterino, bradicardia fetal, hipoglucemia neonatal, y depresión respiratoria al nacer. Los riesgos son mayores con el uso crónico y en dosis altas, especialmente durante el segundo y tercer trimestre.",
    recommendations: "Usar solo si el beneficio potencial justifica el riesgo para el feto. Preferir betabloqueantes con mayor selectividad cardíaca cuando sea posible. Requerirá monitorización del crecimiento fetal y vigilancia posnatal para detectar efectos adversos en el recién nacido.",
    alternatives: [
      "Labetalol (mejor perfil de seguridad en embarazo)",
      "Metildopa (alternativa de primera línea en embarazo)",
      "Consultar con su especialista para evaluar alternativas específicas"
    ]
  }
];

// Descripciones de las categorías de FDA
const fdaCategoryDescriptions: Record<FDACategory, string> = {
  [FDACategory.A]: "Estudios controlados no han demostrado riesgo para el feto en el primer trimestre (y no hay evidencia de riesgo en trimestres posteriores).",
  [FDACategory.B]: "Los estudios en animales no han revelado evidencia de daño al feto, sin embargo, no hay estudios adecuados y bien controlados en mujeres embarazadas, o los estudios en animales han mostrado un efecto adverso, pero estudios adecuados y bien controlados en mujeres embarazadas no han demostrado un riesgo para el feto.",
  [FDACategory.C]: "Los estudios en animales han mostrado un efecto adverso en el feto y no hay estudios adecuados y bien controlados en humanos, pero los beneficios potenciales pueden justificar su uso en mujeres embarazadas a pesar de los riesgos potenciales.",
  [FDACategory.D]: "Hay evidencia positiva de riesgo fetal humano basado en datos de reacciones adversas de experiencia investigacional o comercialización, pero los beneficios potenciales pueden justificar su uso en mujeres embarazadas a pesar de los riesgos potenciales.",
  [FDACategory.X]: "Los estudios en animales o humanos han demostrado anormalidades fetales o hay evidencia positiva de riesgo fetal basado en reportes de reacciones adversas, y los riesgos involucrados en el uso del medicamento en mujeres embarazadas claramente superan los beneficios potenciales.",
  [FDACategory.NA]: "La FDA no ha asignado una categoría a este medicamento o fue aprobado después de 2015 cuando la FDA cambió su sistema de categorización."
};

export function SimpleMedicationRiskCalculator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedication, setSelectedMedication] = useState<MedicationInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para buscar medicamentos
  const handleSearch = () => {
    if (!searchTerm || searchTerm.length < 2) {
      setError('Por favor ingrese al menos 2 caracteres para buscar');
      return;
    }

    setError(null);
    setIsSearching(true);

    // Simular una búsqueda
    setTimeout(() => {
      const lowerSearch = searchTerm.toLowerCase();
      const result = commonMedications.find(med => 
        med.name.toLowerCase().includes(lowerSearch)
      );

      if (result) {
        setSelectedMedication(result);
      } else {
        setError(`No se encontró información para "${searchTerm}" en nuestra base de datos.`);
      }
      
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
          Clasificación FDA de Medicamentos en el Embarazo
        </h1>
        <p className="text-lg text-gray-600">
          Consulta la seguridad de los medicamentos durante el embarazo según la FDA
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <Input
            type="text"
            placeholder="Escribe el nombre del medicamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border-blue-200"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button 
            onClick={handleSearch} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              "Buscar"
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
            {error}
          </div>
        )}

        {selectedMedication && (
          <div className="mt-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-blue-800">{selectedMedication.name}</h3>
                <div className={`px-4 py-1 font-bold rounded-full border-2 ${getCategoryColor(selectedMedication.category)}`}>
                  Categoría {selectedMedication.category}
                </div>
              </div>

              <div className="p-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-bold text-gray-700 mb-1">Descripción</h4>
                    <p className="text-gray-600">{selectedMedication.description}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 mb-1">Categoría FDA</h4>
                    <p className="text-gray-600">{fdaCategoryDescriptions[selectedMedication.category]}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 mb-1">Riesgos en el embarazo</h4>
                    <p className="text-gray-600">{selectedMedication.risks}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 mb-1">Recomendaciones</h4>
                    <p className="text-gray-600">{selectedMedication.recommendations}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 mb-1">Alternativas terapéuticas</h4>
                    <ul className="list-disc pl-5 text-gray-600">
                      {selectedMedication.alternatives.map((alt, index) => (
                        <li key={index}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedMedication && !error && (
          <div className="text-center text-gray-500 my-10">
            <p>Ingresa el nombre de un medicamento para ver su clasificación FDA y recomendaciones durante el embarazo.</p>
            <p className="mt-2 text-sm">
              Ejemplos: paracetamol, ibuprofeno, metamizol, propranolol...
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        <p>
          Todos los derechos reservados a <a href="https://mimaternofetal.cl" className="text-blue-600 hover:underline">MiMaternoFetal.cl</a> • © 2025
        </p>
      </div>
    </div>
  );
}

// Función para obtener el color según la categoría
function getCategoryColor(category: FDACategory): string {
  switch (category) {
    case FDACategory.A:
      return 'bg-green-100 border-green-500 text-green-900';
    case FDACategory.B:
      return 'bg-blue-100 border-blue-500 text-blue-900';
    case FDACategory.C:
      return 'bg-yellow-100 border-yellow-500 text-yellow-900';
    case FDACategory.D:
      return 'bg-orange-100 border-orange-500 text-orange-900';
    case FDACategory.X:
      return 'bg-red-100 border-red-500 text-red-900';
    default:
      return 'bg-gray-100 border-gray-500 text-gray-900';
  }
}