export enum FDACategory {
  A = "A",
  B = "B",
  C = "C",
  D = "D", 
  X = "X",
  NA = "No asignada"
}

export interface MedicationInfo {
  name: string;
  category: FDACategory;
  description: string;
  risks: string;
  recommendations: string;
  alternatives: string[];
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
export const commonMedications: MedicationInfo[] = [
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
];

// Función para buscar medicamentos por nombre (inclusivo)
export function searchMedicationsByName(searchTerm: string): MedicationInfo[] {
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  if (!normalizedSearchTerm) {
    return [];
  }
  
  return commonMedications.filter(med => 
    med.name.toLowerCase().includes(normalizedSearchTerm)
  );
}

// Función para obtener medicamentos por categoría
export function getMedicationsByCategory(category: FDACategory): MedicationInfo[] {
  return commonMedications.filter(med => med.category === category);
}

// Función para obtener todos los medicamentos
export function getAllMedications(): MedicationInfo[] {
  return [...commonMedications];
}

// Función para obtener medicamentos seguros (categoría A o B)
export function getSafeMedications(): MedicationInfo[] {
  return commonMedications.filter(med => 
    med.category === FDACategory.A || med.category === FDACategory.B
  );
}

// Función para obtener un medicamento específico por nombre exacto
export function getMedicationByName(name: string): MedicationInfo | undefined {
  return commonMedications.find(med => 
    med.name.toLowerCase() === name.toLowerCase()
  );
}

// Función para obtener alternativas seguras para un medicamento dado
export function getSafeAlternatives(medication: MedicationInfo): MedicationInfo[] {
  // Si el medicamento ya es seguro (categoría A o B), no necesita alternativas
  if (medication.category === FDACategory.A || medication.category === FDACategory.B) {
    return [];
  }
  
  // Buscar medicamentos similares (basados en palabras clave de la descripción) 
  // pero que sean más seguros
  const keywords = medication.description.toLowerCase().split(' ')
    .filter(word => word.length > 4) // Palabras más largas suelen ser más significativas
    .map(word => word.replace(/[,.;()]/g, '')); // Quitar signos de puntuación
  
  return commonMedications.filter(med => 
    (med.category === FDACategory.A || med.category === FDACategory.B) &&
    med.name !== medication.name &&
    keywords.some(keyword => 
      med.description.toLowerCase().includes(keyword)
    )
  );
}

// Obtener el color asociado a una categoría de la FDA
export function getCategoryColor(category: FDACategory): string {
  switch (category) {
    case FDACategory.A:
      return "bg-green-100 text-green-800 border-green-200";
    case FDACategory.B:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case FDACategory.C:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case FDACategory.D:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case FDACategory.X:
      return "bg-red-100 text-red-800 border-red-200";
    case FDACategory.NA:
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Obtener un resumen de seguridad basado en la categoría
export function getSafetySummary(category: FDACategory): string {
  switch (category) {
    case FDACategory.A:
      return "Seguro durante el embarazo según estudios controlados en humanos.";
    case FDACategory.B:
      return "Probablemente seguro, sin evidencia de riesgo en humanos, pero estudios limitados.";
    case FDACategory.C:
      return "Use con precaución. El riesgo no puede descartarse. Use solo si el beneficio potencial justifica el riesgo.";
    case FDACategory.D:
      return "Evidencia de riesgo fetal. Use solo en situaciones graves si no hay alternativas más seguras.";
    case FDACategory.X:
      return "Contraindicado en el embarazo. Riesgos que superan claramente cualquier beneficio potencial.";
    case FDACategory.NA:
    default:
      return "Categoría no asignada por la FDA. Consulte con su médico para evaluar riesgos.";
  }
}