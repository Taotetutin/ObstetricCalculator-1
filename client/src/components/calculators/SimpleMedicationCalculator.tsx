import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Categorías FDA de medicamentos en el embarazo
enum FDACategory {
  A = "A",
  B = "B",
  C = "C",
  D = "D", 
  X = "X",
  NA = "No asignada"
}

// Interfaz para la información de medicamentos
interface MedicationInfo {
  name: string;
  category: FDACategory;
  description: string;
  risks: string;
  recommendations: string;
  alternatives: string[];
}

// Base de datos local de medicamentos comunes
const commonMedications: MedicationInfo[] = [
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
    name: "Metildopa (Aldomet)",
    category: FDACategory.B,
    description: "Antihipertensivo de acción central. Usado para el tratamiento de la hipertensión gestacional y preeclampsia. Vía de administración: oral.",
    risks: "La metildopa es considerada segura durante el embarazo y es uno de los fármacos de primera línea para el tratamiento de la hipertensión en embarazadas. Experiencia clínica extensa sin evidencia de efectos teratogénicos o adversos fetales significativos. Puede producir somnolencia, sequedad de boca y otros efectos secundarios en la madre.",
    recommendations: "La metildopa sigue siendo un tratamiento de primera línea para la hipertensión durante el embarazo por su perfil de seguridad establecido. El tratamiento debe iniciarse y supervisarse por un especialista, con monitorización regular de la presión arterial y función hepática. La dosis debe ajustarse para mantener un control adecuado de la presión arterial minimizando los efectos secundarios.",
    alternatives: [
      "Labetalol (también categoría B, común en hipertensión gestacional)",
      "Nifedipino (bloqueador de canales de calcio, usado como segunda línea)",
      "Medidas no farmacológicas para casos leves (restricción de sal, descanso)"
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
  },
  {
    name: "Misoprostol",
    category: FDACategory.X,
    description: "Análogo sintético de la prostaglandina E1. Vía de administración: oral, vaginal, sublingual o bucal.",
    risks: "Puede causar contracciones uterinas, sangrado vaginal, y aborto espontáneo. Asociado con síndrome de Möbius (parálisis facial congénita) y defectos de reducción de extremidades cuando se usa sin éxito en intentos de aborto durante el primer trimestre.",
    recommendations: "Contraindicado durante el embarazo cuando se desea continuarlo. Sólo debe usarse bajo supervisión médica estricta para interrupciones legales del embarazo, maduración cervical o inducción del parto a término, o manejo de hemorragia posparto, siguiendo protocolos establecidos.",
    alternatives: [
      "Para hemorragia posparto: oxitocina, carbetocina, ergometrina (según protocolo)",
      "Para maduración cervical: métodos mecánicos en algunos casos",
      "Consultar siempre con un especialista para cada indicación específica"
    ]
  },
  {
    name: "Loratadina",
    category: FDACategory.B,
    description: "Antihistamínico de segunda generación. Vía de administración: oral.",
    risks: "Estudios en animales no han demostrado efectos adversos sobre el feto. Los datos en humanos son limitados pero no han revelado un aumento significativo de riesgos de malformaciones congénitas. Preferido sobre antihistamínicos de primera generación por causar menos sedación y tener menos efectos anticolinérgicos.",
    recommendations: "Puede considerarse para el tratamiento de alergias durante el embarazo cuando sea necesario, especialmente después del primer trimestre. Se prefiere sobre otros antihistamínicos debido a su perfil de seguridad y menores efectos sedantes.",
    alternatives: [
      "Cetirizina (también categoría B, alternativa razonable)",
      "Medidas no farmacológicas para control de alergias",
      "Corticosteroides nasales tópicos para síntomas nasales"
    ]
  },
  {
    name: "Metronidazol",
    category: FDACategory.B,
    description: "Antibiótico y antiparasitario. Vía de administración: oral, intravenosa, tópica o vaginal.",
    risks: "No ha mostrado evidencia consistente de teratogenicidad en humanos. Algunos estudios iniciales sugirieron posibles riesgos, pero metaanálisis más recientes no han confirmado asociación con malformaciones congénitas. La aplicación vaginal conlleva menor exposición sistémica.",
    recommendations: "Puede usarse durante el embarazo para indicaciones apropiadas, preferiblemente después del primer trimestre si es posible, aunque su uso en el primer trimestre no está contraindicado si es necesario. Evitar el uso concomitante con alcohol debido al efecto disulfiram.",
    alternatives: [
      "Clindamicina (para vaginosis bacteriana)",
      "Otros antibióticos según el patógeno específico y su sensibilidad",
      "Consultar con su médico para alternativas específicas según su infección"
    ]
  },
  {
    name: "Atorvastatina (Lipitor)",
    category: FDACategory.X,
    description: "Estatina, inhibidor de la HMG-CoA reductasa. Vía de administración: oral.",
    risks: "Las estatinas pueden interferir con la síntesis de colesterol, necesaria para el desarrollo fetal. Existen informes de anomalías congénitas tras la exposición a estatinas durante el embarazo, aunque los datos son limitados. El riesgo teórico incluye efectos en el desarrollo del sistema nervioso central y otros órganos.",
    recommendations: "Contraindicada durante el embarazo. Debe suspenderse al menos 1-3 meses antes de intentar concebir. Las mujeres en edad fértil que toman estatinas deben usar métodos anticonceptivos eficaces. El manejo de la hiperlipidemia durante el embarazo generalmente puede posponerse hasta después del parto, excepto en casos extremos.",
    alternatives: [
      "Dieta y modificación del estilo de vida",
      "En casos severos (como hipercolesterolemia familiar): resinas de intercambio iónico",
      "Consultar con especialista para evaluar riesgo-beneficio y manejo individualizado"
    ]
  },
  {
    name: "Fluoxetina (Prozac)",
    category: FDACategory.C,
    description: "Inhibidor selectivo de la recaptación de serotonina (ISRS). Vía de administración: oral.",
    risks: "No se ha establecido un aumento significativo en el riesgo de malformaciones congénitas mayores. Posible asociación con complicaciones neonatales si se usa al final del embarazo (síndrome de adaptación neonatal, hipertensión pulmonar persistente). Algunos estudios sugieren pequeño aumento en el riesgo de defectos cardíacos, pero los datos son inconsistentes.",
    recommendations: "El balance beneficio-riesgo debe evaluarse cuidadosamente. Si está indicada para depresión moderada a severa, puede continuarse durante el embarazo con monitorización. Considerar reducción gradual de la dosis hacia el final del embarazo para minimizar efectos en el recién nacido, siempre bajo supervisión psiquiátrica.",
    alternatives: [
      "Sertralina o citalopram (posiblemente con mejor perfil en embarazo dentro de los ISRS)",
      "Terapia cognitivo-conductual",
      "Apoyo psicosocial y otras intervenciones no farmacológicas"
    ]
  },
  {
    name: "Ketorolaco",
    category: FDACategory.C,
    description: "Antiinflamatorio no esteroideo (AINE) potente para dolor agudo moderado a severo. Vía de administración: oral, intramuscular, intravenosa, oftálmica.",
    risks: "Como otros AINEs, puede causar cierre prematuro del conducto arterioso fetal y retraso del parto si se usa en el tercer trimestre. Su uso prolongado puede asociarse con oligohidramnios. Datos limitados en el primer trimestre, pero preocupación similar a otros AINEs.",
    recommendations: "Evitar durante el tercer trimestre. En el primer y segundo trimestre, usar solo si es claramente necesario, por el período más corto posible (idealmente no más de 5 días) y a la dosis efectiva más baja. Particularmente útil para dolor agudo severo donde los beneficios superan los riesgos.",
    alternatives: [
      "Paracetamol (más seguro durante todo el embarazo)",
      "Opioides en casos seleccionados para dolor severo agudo",
      "Técnicas no farmacológicas para manejo del dolor"
    ]
  }
];

// Descripciones de las categorías FDA
const fdaCategoryDescriptions: Record<FDACategory, string> = {
  [FDACategory.A]: "Estudios controlados no han demostrado riesgo para el feto en el primer trimestre (y no hay evidencia de riesgo en trimestres posteriores).",
  [FDACategory.B]: "Los estudios en animales no han revelado evidencia de daño al feto, sin embargo, no hay estudios adecuados y bien controlados en mujeres embarazadas, o los estudios en animales han mostrado un efecto adverso, pero estudios adecuados y bien controlados en mujeres embarazadas no han demostrado un riesgo para el feto.",
  [FDACategory.C]: "Los estudios en animales han mostrado un efecto adverso en el feto y no hay estudios adecuados y bien controlados en humanos, pero los beneficios potenciales pueden justificar su uso en mujeres embarazadas a pesar de los riesgos potenciales.",
  [FDACategory.D]: "Hay evidencia positiva de riesgo fetal humano basado en datos de reacciones adversas de experiencia investigacional o comercialización, pero los beneficios potenciales pueden justificar su uso en mujeres embarazadas a pesar de los riesgos potenciales.",
  [FDACategory.X]: "Los estudios en animales o humanos han demostrado anormalidades fetales o hay evidencia positiva de riesgo fetal basado en reportes de reacciones adversas, y los riesgos involucrados en el uso del medicamento en mujeres embarazadas claramente superan los beneficios potenciales.",
  [FDACategory.NA]: "La FDA no ha asignado una categoría a este medicamento o fue aprobado después de 2015 cuando la FDA cambió su sistema de categorización."
};

// Colores para las categorías
const getCategoryColor = (category: FDACategory): string => {
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
};

const SimpleMedicationCalculator: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMedication, setSelectedMedication] = useState<MedicationInfo | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Función para buscar medicamentos
  const searchMedication = async () => {
    if (!searchTerm || searchTerm.length < 2) {
      setError('Por favor ingrese al menos 2 caracteres para buscar');
      return;
    }
    
    setError(null);
    setIsSearching(true);
    
    try {
      // 1. Buscar primero en la base de datos local
      const lowerSearch = searchTerm.toLowerCase();
      const localResult = commonMedications.find(med => 
        med.name.toLowerCase().includes(lowerSearch)
      );
      
      if (localResult) {
        setSelectedMedication(localResult);
        setIsSearching(false);
        return;
      }
      
      // 2. Si no está en la base local, intentar buscar en la FDA (simulado)
      console.log("Buscando en la FDA:", searchTerm);
      
      // Simulamos una búsqueda externa con un timeout
      setTimeout(() => {
        setIsSearching(false);
        setError(`No se encontró información para "${searchTerm}" en nuestra base de datos.`);
      }, 1500);
      
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setError("Error al buscar. Por favor, intente nuevamente más tarde.");
      setIsSearching(false);
    }
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
      
      <Card className="shadow-lg border-blue-100 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              type="text"
              placeholder="Escribe el nombre del medicamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow border-blue-200 focus:border-blue-400 font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchMedication();
                }
              }}
            />
            <Button 
              onClick={searchMedication} 
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
              <div className="grid grid-cols-1 gap-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-blue-800">{selectedMedication.name}</h3>
                    <div className={`px-4 py-1 font-bold rounded-full border-2 ${getCategoryColor(selectedMedication.category)}`}>
                      Categoría {selectedMedication.category}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-4">
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
            </div>
          )}
          
          {!selectedMedication && !error && (
            <div className="mt-6 text-center text-gray-500">
              <p>Ingresa el nombre de un medicamento para ver su clasificación FDA y recomendaciones durante el embarazo.</p>
              <p className="mt-2 text-sm">
                Ejemplos: paracetamol, ibuprofeno, amoxicilina, metamizol, misoprostol...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-10 text-center text-sm text-gray-500">
        <p>
          Todos los derechos reservados a <a href="https://mimaternofetal.cl" className="text-blue-600 hover:underline">MiMaternoFetal.cl</a> • © 2025
        </p>
        <p className="mt-1 text-xs">
          Esta información tiene fines educativos y no sustituye el consejo médico profesional.
        </p>
      </div>
    </div>
  );
};

export default SimpleMedicationCalculator;