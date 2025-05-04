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
  isFromFDA?: boolean; // Indica si los datos provienen de la API de la FDA
}

// Base de conocimiento sobre categorías de la FDA
export const fdaCategoryDescriptions: Record<FDACategory, string> = {
  [FDACategory.A]: "Estudios adecuados y bien controlados no han demostrado un riesgo para el feto en el primer trimestre del embarazo (y no hay evidencia de riesgo en trimestres posteriores).",
  [FDACategory.B]: "Estudios en animales no han demostrado un riesgo para el feto, pero no hay estudios adecuados y bien controlados en mujeres embarazadas; o estudios en animales han mostrado un efecto adverso, pero estudios adecuados y bien controlados en mujeres embarazadas no han demostrado riesgo para el feto.",
  [FDACategory.C]: "Estudios en animales han mostrado un efecto adverso en el feto, pero no hay estudios adecuados y bien controlados en humanos; o no hay estudios en animales ni en humanos. El beneficio potencial puede justificar el riesgo potencial.",
  [FDACategory.D]: "Hay evidencia positiva de riesgo fetal humano basada en datos de reacciones adversas, pero los beneficios potenciales pueden justificar el uso del medicamento en mujeres embarazadas a pesar de los riesgos.",
  [FDACategory.X]: "Estudios en animales o humanos han demostrado anormalidades fetales o hay evidencia positiva de riesgo fetal basada en reacciones adversas. Los riesgos superan claramente cualquier posible beneficio. Contraindicado en mujeres que están o pueden quedar embarazadas.",
  [FDACategory.NA]: "La FDA no ha asignado una categoría de embarazo específica para este medicamento. Se recomienda consultar con un profesional de la salud."
};

// Database of common medications with FDA pregnancy categories
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
    name: "Warfarina",
    category: FDACategory.X,
    description: "Anticoagulante utilizado para prevenir la formación de coágulos sanguíneos en trastornos como la fibrilación auricular.",
    risks: "Atraviesa la placenta y puede causar anomalías congénitas, especialmente durante el primer trimestre. Puede provocar hemorragia fetal y embriopatía por warfarina (hipoplasia nasal, calcificaciones epifisarias).",
    recommendations: "Contraindicada durante el embarazo, especialmente en el primer trimestre. Las mujeres en edad fértil que toman warfarina deben utilizar métodos anticonceptivos eficaces.",
    alternatives: ["Heparina de bajo peso molecular", "Heparina no fraccionada", "Monitoreo clínico estricto"]
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
    name: "Fluoxetina",
    category: FDACategory.C,
    description: "Inhibidor selectivo de la recaptación de serotonina (ISRS) utilizado para tratar la depresión, trastornos de ansiedad y otros trastornos psiquiátricos.",
    risks: "Algunos estudios sugieren un pequeño aumento en el riesgo de defectos cardíacos congénitos. El uso cerca del término puede estar asociado con el síndrome de adaptación neonatal (problemas respiratorios, irritabilidad, problemas de alimentación).",
    recommendations: "La decisión de usar debe basarse en un análisis riesgo-beneficio cuidadoso. Si se necesita tratamiento para la depresión, puede considerarse después de consultar con un especialista.",
    alternatives: ["Psicoterapia", "Otros antidepresivos con mejor perfil de seguridad como sertralina", "Apoyo social", "Terapias complementarias bajo supervisión médica"]
  },
  {
    name: "Enalapril",
    category: FDACategory.D,
    description: "Inhibidor de la enzima convertidora de angiotensina (IECA) utilizado para tratar la hipertensión y la insuficiencia cardíaca.",
    risks: "El uso durante el segundo y tercer trimestre puede causar oligohidramnios, hipoplasia pulmonar, deformidades en las extremidades, hipoplasia craneal y muerte fetal/neonatal. El uso en el primer trimestre puede aumentar el riesgo de malformaciones congénitas.",
    recommendations: "Debe discontinuarse tan pronto como se confirme el embarazo. Se debe cambiar a un antihipertensivo alternativo que sea seguro durante el embarazo.",
    alternatives: ["Labetalol", "Metildopa", "Nifedipino", "Hidralazina"]
  },
  {
    name: "Metformina",
    category: FDACategory.B,
    description: "Medicamento antidiabético oral utilizado para controlar los niveles de glucosa en sangre en la diabetes tipo 2 y el síndrome de ovario poliquístico.",
    risks: "Los estudios no han demostrado un aumento en el riesgo de anomalías congénitas. Cruza la placenta, pero no se han observado efectos teratogénicos significativos.",
    recommendations: "Puede continuarse durante el embarazo para el tratamiento de la diabetes gestacional o preexistente. Puede ayudar a reducir el riesgo de diabetes gestacional en mujeres con síndrome de ovario poliquístico.",
    alternatives: ["Insulina", "Modificaciones en la dieta y ejercicio", "Monitorización estrecha de la glucosa"]
  },
  {
    name: "Aspirina (dosis bajas)",
    category: FDACategory.C,
    description: "Antiagregante plaquetario y antiinflamatorio. Las dosis bajas (75-150 mg/día) se utilizan para prevenir complicaciones en embarazos de alto riesgo.",
    risks: "A dosis bajas, el riesgo parece ser mínimo. Las dosis altas durante el tercer trimestre pueden asociarse con cierre prematuro del conducto arterioso y complicaciones hemorrágicas.",
    recommendations: "A dosis bajas, puede ser beneficiosa en mujeres con alto riesgo de preeclampsia o retraso del crecimiento intrauterino. Debe iniciarse antes de las 16 semanas y generalmente se continúa hasta las 36 semanas.",
    alternatives: ["Heparina de bajo peso molecular (para algunas indicaciones)", "Monitoreo clínico estricto"]
  },
  {
    name: "Albuterol (Salbutamol)",
    category: FDACategory.C,
    description: "Broncodilatador beta-agonista utilizado para tratar el asma y otras condiciones de las vías respiratorias.",
    risks: "No se han observado malformaciones congénitas significativas. El control del asma durante el embarazo es crucial, ya que el asma mal controlada puede representar un mayor riesgo para el feto que el medicamento.",
    recommendations: "Puede usarse durante el embarazo cuando está indicado clínicamente. Es uno de los broncodilatadores de rescate preferidos durante el embarazo.",
    alternatives: ["Otros beta-agonistas de acción corta", "Tratamiento preventivo adecuado del asma"]
  },
  {
    name: "Prednisona",
    category: FDACategory.C,
    description: "Corticosteroide utilizado para reducir la inflamación y suprimir la respuesta inmune en diversas condiciones.",
    risks: "Riesgo ligeramente aumentado de paladar hendido cuando se usa en el primer trimestre a dosis altas. Uso prolongado o dosis altas pueden asociarse con restricción del crecimiento intrauterino, bajo peso al nacer e insuficiencia suprarrenal neonatal.",
    recommendations: "Puede usarse durante el embarazo cuando los beneficios superan los riesgos. La dosis más baja efectiva durante el menor tiempo posible es el enfoque recomendado.",
    alternatives: ["Corticosteroides inhalados (para condiciones respiratorias)", "Otros inmunosupresores según la condición", "Terapias dirigidas específicas a la enfermedad"]
  },
  {
    name: "Ranitidina",
    category: FDACategory.B,
    description: "Antagonista de los receptores H2 utilizado para reducir la producción de ácido estomacal en condiciones como la enfermedad por reflujo gastroesofágico y úlceras pépticas.",
    risks: "No se han observado riesgos significativos para el feto en estudios en humanos. Ha sido ampliamente utilizado durante el embarazo.",
    recommendations: "Puede considerarse para el tratamiento de la acidez y el reflujo durante el embarazo cuando las medidas no farmacológicas son insuficientes.",
    alternatives: ["Antiácidos (calcio, magnesio)", "Medidas no farmacológicas como cambios en la dieta y estilo de vida"]
  },
  {
    name: "Ondansetrón",
    category: FDACategory.B,
    description: "Antagonista del receptor de serotonina (5-HT3) utilizado para prevenir náuseas y vómitos.",
    risks: "Algunos estudios han sugerido un pequeño aumento en el riesgo de defectos cardíacos y paladar hendido con el uso durante el primer trimestre, pero los resultados son mixtos.",
    recommendations: "Generalmente se reserva para mujeres con hiperemesis gravídica o náuseas y vómitos severos que no responden a los tratamientos de primera línea.",
    alternatives: ["Vitamina B6 (piridoxina)", "Doxilamina", "Metoclopramida", "Cambios en la dieta", "Jengibre"]
  },
  {
    name: "Isotretinoína",
    category: FDACategory.X,
    description: "Retinoide utilizado para tratar el acné severo refractario a otras terapias.",
    risks: "Alto riesgo de malformaciones congénitas graves, incluyendo anomalías craneofaciales, cardíacas, tímicas y del sistema nervioso central. También aumenta el riesgo de aborto espontáneo.",
    recommendations: "Absolutamente contraindicada durante el embarazo. Las mujeres en edad fértil deben utilizar dos métodos anticonceptivos eficaces simultáneamente durante el tratamiento y durante al menos un mes después de la interrupción.",
    alternatives: ["Antibióticos tópicos u orales", "Peróxido de benzoilo", "Retinoides tópicos (con precaución)", "Procedimientos dermatológicos"]
  },
  {
    name: "Misoprostol",
    category: FDACategory.X,
    description: "Análogo sintético de prostaglandina E1 utilizado para prevenir y tratar úlceras gástricas, y en ginecología para la maduración cervical e inducción del aborto.",
    risks: "Puede causar contracciones uterinas, sangrado, aborto espontáneo y defectos congénitos (síndrome de Möbius, defectos en extremidades) cuando se usa durante el embarazo.",
    recommendations: "Contraindicado durante el embarazo a menos que se use específicamente para la terminación del embarazo o en entornos obstétricos específicos bajo supervisión médica estricta.",
    alternatives: ["Inhibidores de la bomba de protones o antagonistas H2 (para protección gástrica)", "Otros métodos para la maduración cervical en entornos obstétricos"]
  },
  {
    name: "Clonazepam",
    category: FDACategory.D,
    description: "Benzodiazepina utilizada para tratar trastornos convulsivos, trastornos de pánico y como relajante muscular.",
    risks: "El uso durante el embarazo puede asociarse con labio/paladar hendido, especialmente si se usa en el primer trimestre. El uso cerca del parto puede causar hipotonía, depresión respiratoria y síndrome de abstinencia neonatal.",
    recommendations: "Evitar durante el embarazo si es posible, especialmente durante el primer trimestre. Si es necesario, usar la dosis más baja efectiva y evitar el uso prolongado.",
    alternatives: ["Terapia cognitivo-conductual", "Inhibidores selectivos de la recaptación de serotonina (para trastornos de ansiedad)", "Anticonvulsivos con mejor perfil de seguridad (para epilepsia)"]
  },
  // Nuevos medicamentos añadidos
  {
    name: "Omeprazol",
    category: FDACategory.C,
    description: "Inhibidor de la bomba de protones utilizado para reducir la producción de ácido gástrico en condiciones como la enfermedad por reflujo gastroesofágico y úlceras pépticas.",
    risks: "Los estudios no han demostrado un aumento claro en el riesgo de malformaciones congénitas, pero algunos estudios sugieren un posible aumento en el riesgo de asma infantil con exposición durante el embarazo.",
    recommendations: "Usar solo cuando sea médicamente necesario y los beneficios superen los riesgos. Considerar opciones con mayor historial de seguridad durante el embarazo como alternativa de primera línea.",
    alternatives: ["Antiácidos (calcio, magnesio)", "Antagonistas de los receptores H2 como ranitidina", "Cambios en la dieta y estilo de vida"]
  },
  {
    name: "Diazepam",
    category: FDACategory.D,
    description: "Benzodiazepina utilizada para tratar la ansiedad, espasmos musculares, convulsiones y síntomas de abstinencia alcohólica.",
    risks: "El uso en el primer trimestre puede asociarse con un mayor riesgo de malformaciones congénitas como labio/paladar hendido. Uso cercano al parto puede causar hipotonía, depresión respiratoria y síndrome de abstinencia neonatal.",
    recommendations: "Evitar durante el embarazo, especialmente en el primer trimestre. Si es absolutamente necesario, usar la dosis más baja efectiva por el menor tiempo posible y evitar cerca del término.",
    alternatives: ["Terapia cognitivo-conductual", "Técnicas de relajación", "Antidepresivos con mejor perfil de seguridad (para ansiedad)", "Consultar al especialista para alternativas específicas"]
  },
  {
    name: "Doxiciclina",
    category: FDACategory.D,
    description: "Antibiótico de amplio espectro del grupo de las tetraciclinas utilizado para tratar diversas infecciones bacterianas.",
    risks: "Puede causar decoloración permanente de los dientes y alteración del desarrollo óseo en el feto cuando se usa después de la semana 20 de gestación. También puede causar hepatotoxicidad materna.",
    recommendations: "Evitar durante el embarazo, especialmente después del segundo trimestre. Utilizar antibióticos alternativos con mejor perfil de seguridad durante el embarazo.",
    alternatives: ["Penicilinas", "Cefalosporinas", "Eritromicina", "Azitromicina"]
  },
  {
    name: "Loratadina",
    category: FDACategory.B,
    description: "Antihistamínico de segunda generación utilizado para tratar síntomas de alergias como rinitis alérgica y urticaria.",
    risks: "Los estudios no han demostrado un aumento en el riesgo de malformaciones congénitas. Menos sedante que los antihistamínicos de primera generación.",
    recommendations: "Puede considerarse cuando el tratamiento de los síntomas alérgicos es necesario durante el embarazo. Preferible a los antihistamínicos de primera generación.",
    alternatives: ["Cetirizina", "Medidas no farmacológicas como evitar alérgenos", "Soluciones salinas nasales para rinitis"]
  },
  {
    name: "Sertralina",
    category: FDACategory.C,
    description: "Inhibidor selectivo de la recaptación de serotonina (ISRS) utilizado para tratar la depresión, trastornos de ansiedad, trastorno obsesivo-compulsivo y trastorno de estrés postraumático.",
    risks: "Estudios no han mostrado un aumento significativo en el riesgo de malformaciones congénitas. El uso cerca del término puede estar asociado con el síndrome de adaptación neonatal (problemas respiratorios, irritabilidad, problemas de alimentación).",
    recommendations: "Cuando el tratamiento antidepresivo es necesario durante el embarazo, la sertralina es considerada una de las opciones más seguras entre los ISRS. La decisión debe basarse en un análisis riesgo-beneficio individualizado.",
    alternatives: ["Psicoterapia", "Terapia cognitivo-conductual", "Apoyo social", "Otros ISRS con perfil de seguridad similar"]
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
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-green-100 border-2 border-green-300 shadow-sm hover:shadow-md rounded-lg p-4 cursor-pointer"
                onClick={() => {setSelectedCategory(FDACategory.A); setTimeout(handleSearch, 100);}}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-green-800">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-base">Categoría A</span>
                </div>
                <p className="text-green-800 text-sm">
                  Estudios controlados no han demostrado riesgo para el feto en ningún trimestre.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-blue-100 border-2 border-blue-300 shadow-sm hover:shadow-md rounded-lg p-4 cursor-pointer"
                onClick={() => {setSelectedCategory(FDACategory.B); setTimeout(handleSearch, 100);}}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-blue-800">
                  <Pill className="h-5 w-5" />
                  <span className="text-base">Categoría B</span>
                </div>
                <p className="text-blue-800 text-sm">
                  No hay evidencia de riesgo en humanos. Estudios en animales no han mostrado riesgo o los hallazgos no se han confirmado en humanos.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-yellow-200 border-2 border-yellow-300 shadow-sm hover:shadow-md rounded-lg p-4 cursor-pointer"
                onClick={() => {setSelectedCategory(FDACategory.C); setTimeout(handleSearch, 100);}}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-base">Categoría C</span>
                </div>
                <p className="text-yellow-800 text-sm">
                  Riesgo no puede descartarse. El beneficio potencial puede justificar el riesgo.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-orange-200 border-2 border-orange-300 shadow-sm hover:shadow-md rounded-lg p-4 cursor-pointer"
                onClick={() => {setSelectedCategory(FDACategory.D); setTimeout(handleSearch, 100);}}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-orange-800">
                  <FileWarning className="h-5 w-5" />
                  <span className="text-base">Categoría D</span>
                </div>
                <p className="text-orange-800 text-sm">
                  Evidencia positiva de riesgo fetal. Los beneficios potenciales pueden superar los riesgos en situaciones graves.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-red-200 border-2 border-red-400 shadow-sm hover:shadow-md rounded-lg p-4 cursor-pointer"
                onClick={() => {setSelectedCategory(FDACategory.X); setTimeout(handleSearch, 100);}}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-red-800">
                  <FileX className="h-5 w-5" />
                  <span className="text-base">Categoría X</span>
                </div>
                <p className="text-red-800 text-sm">
                  Contraindicado en embarazo. Riesgos superan claramente cualquier beneficio potencial.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gray-200 border-2 border-gray-300 shadow-sm hover:shadow-md rounded-lg p-4 cursor-pointer"
                onClick={() => {setSelectedCategory(FDACategory.NA); setTimeout(handleSearch, 100);}}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                  <Info className="h-5 w-5" />
                  <span className="text-base">No asignada</span>
                </div>
                <p className="text-gray-700 text-sm">
                  La FDA no ha asignado una categoría específica a este medicamento.
                </p>
              </motion.div>
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