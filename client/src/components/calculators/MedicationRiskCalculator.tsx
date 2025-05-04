import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Pill, ShieldCheck, AlertTriangle, FileWarning, FileX, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Enumeración de categorías FDA
export enum FDACategory {
  A = "A",
  B = "B",
  C = "C",
  D = "D", 
  X = "X",
  NA = "No asignada"
}

// Interfaz para la información de medicamentos
export interface MedicationInfo {
  name: string;
  category: FDACategory;
  description: string;
  risks: string;
  recommendations: string;
  alternatives: string[];
}

// Descripciones de las categorías FDA
export const fdaCategoryDescriptions: Record<FDACategory, string> = {
  [FDACategory.A]: "Estudios adecuados y bien controlados no han demostrado un riesgo para el feto en el primer trimestre del embarazo (y no hay evidencia de riesgo en trimestres posteriores).",
  [FDACategory.B]: "Estudios en animales no han demostrado un riesgo para el feto, pero no hay estudios adecuados y bien controlados en mujeres embarazadas; o estudios en animales han mostrado un efecto adverso, pero estudios adecuados y bien controlados en mujeres embarazadas no han demostrado riesgo para el feto.",
  [FDACategory.C]: "Estudios en animales han mostrado un efecto adverso en el feto, pero no hay estudios adecuados y bien controlados en humanos; o no hay estudios en animales ni en humanos. El beneficio potencial puede justificar el riesgo potencial.",
  [FDACategory.D]: "Hay evidencia positiva de riesgo fetal humano basada en datos de reacciones adversas, pero los beneficios potenciales pueden justificar el uso del medicamento en mujeres embarazadas a pesar de los riesgos.",
  [FDACategory.X]: "Estudios en animales o humanos han demostrado anormalidades fetales o hay evidencia positiva de riesgo fetal basada en reacciones adversas. Los riesgos superan claramente cualquier posible beneficio. Contraindicado en mujeres que están o pueden quedar embarazadas.",
  [FDACategory.NA]: "La FDA no ha asignado una categoría de embarazo específica para este medicamento. Se recomienda consultar con un profesional de la salud."
};

// Base de datos de medicamentos comunes
const commonMedications: MedicationInfo[] = [
  {
    name: "Paracetamol (Acetaminofén)",
    category: FDACategory.B,
    description: "Analgésico y antipirético de uso común para dolor leve a moderado y fiebre.",
    risks: "Generalmente considerado seguro durante el embarazo cuando se usa según lo prescrito. Estudios no han demostrado un aumento en el riesgo de malformaciones congénitas.",
    recommendations: "Puede usarse durante todos los trimestres del embarazo en las dosis recomendadas y por períodos limitados. Es considerado el analgésico de primera línea durante el embarazo.",
    alternatives: ["Reposo", "Terapia física", "Compresas frías o calientes"]
  },
  {
    name: "Ibuprofeno",
    category: FDACategory.C,
    description: "Antiinflamatorio no esteroideo (AINE) utilizado para dolor, inflamación y fiebre.",
    risks: "Uso durante el tercer trimestre se asocia con cierre prematuro del conducto arterioso fetal, oligohidramnios y posible prolongación del trabajo de parto. Puede aumentar el riesgo de sangrado durante el parto.",
    recommendations: "Evitar su uso durante el tercer trimestre. Durante el primer y segundo trimestre, usar sólo si es claramente necesario, a la dosis efectiva más baja y por el menor tiempo posible.",
    alternatives: ["Paracetamol", "Tratamientos no farmacológicos", "Consultar al médico para alternativas más seguras"]
  },
  {
    name: "Amoxicilina",
    category: FDACategory.B,
    description: "Antibiótico beta-lactámico de amplio espectro utilizado para tratar diversas infecciones bacterianas.",
    risks: "No se han documentado efectos adversos significativos sobre el feto. Ampliamente utilizado durante el embarazo.",
    recommendations: "Puede ser prescrito durante el embarazo cuando los beneficios superan los riesgos. Es uno de los antibióticos de primera elección en mujeres embarazadas.",
    alternatives: ["Otros antibióticos beta-lactámicos", "Consultar al médico para alternativas según el tipo de infección"]
  },
  {
    name: "Metildopa",
    category: FDACategory.B,
    description: "Antihipertensivo de acción central. Usado para el tratamiento de la hipertensión gestacional y preeclampsia.",
    risks: "La metildopa es considerada segura durante el embarazo y es uno de los fármacos de primera línea para el tratamiento de la hipertensión en embarazadas. Experiencia clínica extensa sin evidencia de efectos teratogénicos o adversos fetales significativos.",
    recommendations: "La metildopa sigue siendo un tratamiento de primera línea para la hipertensión durante el embarazo por su perfil de seguridad establecido.",
    alternatives: ["Labetalol", "Nifedipino", "Hidralazina"]
  },
  {
    name: "Levotiroxina",
    category: FDACategory.A,
    description: "Hormona tiroidea sintética utilizada para tratar el hipotiroidismo.",
    risks: "No se han observado efectos adversos sobre el desarrollo fetal. El tratamiento adecuado del hipotiroidismo durante el embarazo es crucial para el desarrollo neurológico normal del feto.",
    recommendations: "Se debe continuar durante el embarazo, generalmente con ajustes de dosis según resultados de pruebas de función tiroidea. Esencial para mujeres con hipotiroidismo.",
    alternatives: ["No hay alternativas cuando está médicamente indicada", "El control regular de los niveles de TSH es fundamental"]
  },
  {
    name: "Misoprostol",
    category: FDACategory.X,
    description: "Análogo sintético de la prostaglandina E1. Utilizado para la inducción del parto, manejo del aborto incompleto, y prevención/tratamiento de la hemorragia posparto.",
    risks: "El misoprostol puede provocar contracciones uterinas intensas con posible ruptura uterina, especialmente en pacientes con cicatrices uterinas previas. Está contraindicado para uso rutinario durante el embarazo.",
    recommendations: "El uso de misoprostol para indicaciones obstétricas debe realizarse exclusivamente bajo supervisión médica especializada, en entornos hospitalarios, siguiendo protocolos establecidos.",
    alternatives: ["Para inducción del parto: oxitocina (bajo supervisión médica)", "Para prevención de hemorragia posparto: oxitocina, metilergonovina"]
  }
];

// Función de búsqueda de medicamentos
const searchMedicationsByName = (searchTerm: string): MedicationInfo[] => {
  const normalizedSearch = searchTerm.toLowerCase();
  return commonMedications.filter(med => 
    med.name.toLowerCase().includes(normalizedSearch)
  );
};

// Función para obtener medicamentos por categoría
const getMedicationsByCategory = (category: FDACategory): MedicationInfo[] => {
  return commonMedications.filter(med => med.category === category);
};

// Función para obtener todos los medicamentos
const getAllMedications = (): MedicationInfo[] => {
  return commonMedications;
};

// Función para obtener el color de la categoría
const getCategoryColor = (category: FDACategory): string => {
  switch (category) {
    case FDACategory.A: return "bg-green-100 text-green-800 border-green-200";
    case FDACategory.B: return "bg-blue-100 text-blue-800 border-blue-200";
    case FDACategory.C: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case FDACategory.D: return "bg-orange-100 text-orange-800 border-orange-200";
    case FDACategory.X: return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function MedicationRiskCalculator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FDACategory | 'all' | ''>('all');
  const [searchResults, setSearchResults] = useState<MedicationInfo[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<MedicationInfo | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Función para realizar la búsqueda
  const handleSearch = () => {
    // Resetear errores previos
    setSearchError(null);
    
    // Si hay un término de búsqueda válido, realizar búsqueda por nombre
    if (searchTerm.trim().length >= 2) {
      // Buscar en la base de datos local
      const localResults = searchMedicationsByName(searchTerm);
      
      // Filtrar por categoría si es necesario
      let filteredResults = localResults;
      if (selectedCategory && selectedCategory !== 'all') {
        filteredResults = localResults.filter(med => med.category === selectedCategory);
      }
      
      if (filteredResults.length > 0) {
        setSearchResults(filteredResults);
        setSelectedMedication(filteredResults.length === 1 ? filteredResults[0] : null);
      } else {
        setSearchResults([]);
        setSelectedMedication(null);
        setSearchError(`No se encontró información para "${searchTerm}" en nuestra base de datos.`);
      }
    } 
    // Si no hay término de búsqueda pero hay categoría seleccionada
    else if (selectedCategory && selectedCategory !== 'all') {
      const results = getMedicationsByCategory(selectedCategory as FDACategory);
      setSearchResults(results);
      
      if (results.length > 0) {
        setSelectedMedication(null); // Mostrar la lista
      } else {
        setSelectedMedication(null);
        setSearchError(`No se encontraron medicamentos de categoría ${selectedCategory}.`);
      }
    } 
    // Si la categoría es "all" (todos los medicamentos)
    else if (selectedCategory === 'all') {
      const allMedications = getAllMedications();
      setSearchResults(allMedications);
      setSelectedMedication(null);
    }
    // Si no hay término ni categoría específica
    else {
      setSearchResults([]);
      setSelectedMedication(null);
      setSearchError("Por favor, ingrese al menos 2 caracteres para buscar un medicamento o seleccione una categoría.");
    }
  };

  // Función para seleccionar un medicamento
  const handleSelectMedication = (medication: MedicationInfo) => {
    setSelectedMedication(medication);
  };

  // Función para obtener el ícono de la categoría
  const getCategoryIcon = (category: FDACategory) => {
    switch (category) {
      case FDACategory.A:
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case FDACategory.B:
        return <Pill className="h-5 w-5 text-blue-500" />;
      case FDACategory.C:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case FDACategory.D:
        return <FileWarning className="h-5 w-5 text-orange-500" />;
      case FDACategory.X:
        return <FileX className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="space-y-4">
        {/* Panel de búsqueda */}
        <Card className="bg-blue-50/30 border-blue-100 shadow-sm w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-blue-900">Calculadora de Medicamentos en Embarazo</CardTitle>
            <CardDescription>
              Busque información sobre la seguridad de los medicamentos durante el embarazo según las categorías de la FDA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block text-blue-700">
                  Nombre del medicamento
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ej: Paracetamol, Amoxicilina..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <label className="text-sm font-medium mb-1 block text-blue-700">
                  Categoría FDA
                </label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value) => {
                    setSelectedCategory(value as FDACategory | 'all');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value={FDACategory.A}>Categoría A</SelectItem>
                    <SelectItem value={FDACategory.B}>Categoría B</SelectItem>
                    <SelectItem value={FDACategory.C}>Categoría C</SelectItem>
                    <SelectItem value={FDACategory.D}>Categoría D</SelectItem>
                    <SelectItem value={FDACategory.X}>Categoría X</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-auto self-end">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Área de resultados */}
        {searchError ? (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                <p>{searchError}</p>
              </div>
            </CardContent>
          </Card>
        ) : searchResults.length > 0 && !selectedMedication ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resultados ({searchResults.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {searchResults.map((medication, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left ${getCategoryColor(medication.category)} hover:opacity-90 h-auto py-3`}
                        onClick={() => handleSelectMedication(medication)}
                      >
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(medication.category)}
                          <div>
                            <p className="font-medium">{medication.name}</p>
                            <p className="text-xs truncate max-w-[250px] md:max-w-full">
                              {medication.description.substring(0, 80)}...
                            </p>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : selectedMedication ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{selectedMedication.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {selectedMedication.description}
                    </CardDescription>
                  </div>
                  <Badge className={`${getCategoryColor(selectedMedication.category)} px-3 py-1 text-sm font-medium`}>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(selectedMedication.category)}
                      <span>Categoría {selectedMedication.category}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="category-info">
                    <AccordionTrigger className="text-blue-700 hover:text-blue-800">
                      ¿Qué significa Categoría {selectedMedication.category}?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      {fdaCategoryDescriptions[selectedMedication.category]}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="risks">
                    <AccordionTrigger className="text-red-600 hover:text-red-700">
                      Riesgos durante el embarazo
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      {selectedMedication.risks}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="recommendations">
                    <AccordionTrigger className="text-blue-700 hover:text-blue-800">
                      Recomendaciones de uso
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      {selectedMedication.recommendations}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="alternatives">
                    <AccordionTrigger className="text-green-600 hover:text-green-700">
                      Alternativas a considerar
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {selectedMedication.alternatives.map((alt, index) => (
                          <li key={index}>{alt}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4 text-sm text-gray-600">
                <div>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedMedication(null)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Volver a resultados
                  </Button>
                </div>
                <p className="italic">
                  Consulte siempre con su médico antes de tomar decisiones sobre medicamentos.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        ) : null}
        
        {/* Información de categorías FDA */}
        <Card className="mt-6 border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">Categorías FDA en Embarazo</CardTitle>
            <CardDescription>
              Clasificación de riesgo de los medicamentos durante el embarazo según la FDA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1 font-semibold text-green-800">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Categoría A</span>
                </div>
                <p className="text-green-700 text-xs">
                  Estudios controlados no han demostrado riesgo para el feto en ningún trimestre.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1 font-semibold text-blue-800">
                  <Pill className="h-4 w-4" />
                  <span>Categoría B</span>
                </div>
                <p className="text-blue-700 text-xs">
                  No hay evidencia de riesgo en humanos. Estudios en animales no han mostrado riesgo o los hallazgos no se han confirmado en humanos.
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1 font-semibold text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Categoría C</span>
                </div>
                <p className="text-yellow-700 text-xs">
                  Riesgo no puede descartarse. El beneficio potencial puede justificar el riesgo.
                </p>
              </div>
              
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1 font-semibold text-orange-800">
                  <FileWarning className="h-4 w-4" />
                  <span>Categoría D</span>
                </div>
                <p className="text-orange-700 text-xs">
                  Evidencia positiva de riesgo fetal. Los beneficios potenciales pueden superar los riesgos en situaciones graves.
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1 font-semibold text-red-800">
                  <FileX className="h-4 w-4" />
                  <span>Categoría X</span>
                </div>
                <p className="text-red-700 text-xs">
                  Contraindicado en embarazo. Riesgos superan claramente cualquier beneficio potencial.
                </p>
              </div>
              
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1 font-semibold text-gray-800">
                  <Info className="h-4 w-4" />
                  <span>No asignada</span>
                </div>
                <p className="text-gray-700 text-xs">
                  La FDA no ha asignado una categoría específica a este medicamento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="border-t border-gray-200 pt-4 text-gray-500 text-xs italic">
          <p>
            Esta información es solo educativa y no reemplaza la consulta médica profesional. 
            Siempre consulte con su médico antes de tomar o modificar cualquier medicamento durante el embarazo.
          </p>
        </div>
      </div>
    </div>
  );
}