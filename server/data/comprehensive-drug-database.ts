// Sistema farmacológico completo con todas las clasificaciones FDA
export interface DrugClassification {
  name: string;
  aliases: string[];
  category: string;
  class: string;
  mechanism: string;
  pregnancy_risks: string;
  recommendations: string;
  monitoring: string;
  alternatives?: string[];
}

// Base de datos farmacológica exhaustiva por categorías terapéuticas
export const comprehensiveDrugDatabase: Record<string, DrugClassification> = {
  // Analgésicos y antiinflamatorios
  "metamizol": {
    name: "Metamizol (Dipirona)",
    aliases: ["dipirona", "novalgina", "metamizole", "dipyrone"],
    category: "Analgésico antipirético",
    class: "Pirazolona",
    mechanism: "Inhibición de la ciclooxigenasa y bloqueo de canales de sodio",
    pregnancy_risks: "Categoría C - Evitar en tercer trimestre por riesgo de cierre prematuro del ductus arterioso",
    recommendations: "Usar con precaución. Evitar en tercer trimestre. Considerar alternativas como paracetamol.",
    monitoring: "Función renal, presión arterial, signos de sangrado",
    alternatives: ["paracetamol", "acetaminofén"]
  },

  // Antifúngicos tópicos y sistémicos
  "clotrimazol": {
    name: "Clotrimazol",
    aliases: ["canesten", "lotrimin", "mycelex"],
    category: "Antifúngico tópico",
    class: "Derivado imidazólico",
    mechanism: "Inhibición de la síntesis de ergosterol en la membrana fúngica",
    pregnancy_risks: "Categoría B - Seguro para uso tópico durante el embarazo",
    recommendations: "Antifúngico de primera línea para candidiasis vaginal durante el embarazo. Preferir aplicación tópica.",
    monitoring: "Irritación local, respuesta clínica",
    alternatives: ["nistatina tópica", "miconazol tópico"]
  },

  "miconazol": {
    name: "Miconazol",
    aliases: ["monistat", "daktarin", "micatin"],
    category: "Antifúngico tópico",
    class: "Derivado imidazólico",
    mechanism: "Inhibición de la síntesis de ergosterol",
    pregnancy_risks: "Categoría C - Usar solo si es necesario. Seguro en aplicación tópica.",
    recommendations: "Seguro para uso tópico. Evitar uso sistémico durante embarazo.",
    monitoring: "Irritación local, absorción sistémica mínima",
    alternatives: ["clotrimazol", "nistatina"]
  },

  "nistatina": {
    name: "Nistatina",
    aliases: ["nystatin", "mycostatin"],
    category: "Antifúngico tópico",
    class: "Antibiótico poliénico",
    mechanism: "Unión al ergosterol y formación de poros en membrana fúngica",
    pregnancy_risks: "Categoría B - Seguro durante todo el embarazo",
    recommendations: "Antifúngico más seguro durante embarazo. Mínima absorción sistémica.",
    monitoring: "Irritación local mínima",
    alternatives: ["clotrimazol"]
  },

  "terbinafina": {
    name: "Terbinafina",
    aliases: ["lamisil", "terbisil"],
    category: "Antifúngico sistémico",
    class: "Alilamina",
    mechanism: "Inhibición de la escualeno epoxidasa",
    pregnancy_risks: "Categoría B - Datos limitados, usar solo si es esencial",
    recommendations: "Evitar durante embarazo salvo infecciones graves. Preferir tratamiento tópico.",
    monitoring: "Función hepática, efectos sistémicos",
    alternatives: ["antifúngicos tópicos", "diferir tratamiento"]
  },

  "ketoconazol": {
    name: "Ketoconazol",
    aliases: ["nizoral", "extina"],
    category: "Antifúngico sistémico",
    class: "Derivado imidazólico",
    mechanism: "Inhibición de la síntesis de ergosterol",
    pregnancy_risks: "Categoría C - Evitar uso sistémico. Tópico con precaución.",
    recommendations: "Contraindicado vía oral. Uso tópico solo si es necesario.",
    monitoring: "Función hepática, interacciones medicamentosas",
    alternatives: ["fluconazol en dosis bajas", "antifúngicos tópicos"]
  },

  // Antibióticos básicos
  "ampicilina": {
    name: "Ampicilina",
    aliases: ["ampicillin", "principen"],
    category: "Antibiótico betalactámico",
    class: "Penicilina de amplio espectro",
    mechanism: "Inhibición de la síntesis de pared celular bacteriana",
    pregnancy_risks: "Categoría B - Seguro durante el embarazo",
    recommendations: "Antibiótico de primera línea durante embarazo. Seguro en todos los trimestres.",
    monitoring: "Reacciones alérgicas, función renal",
    alternatives: ["amoxicilina", "cefalexina"]
  },

  "eritromicina": {
    name: "Eritromicina",
    aliases: ["erythromycin", "e-mycin"],
    category: "Antibiótico macrólido",
    class: "Macrólido",
    mechanism: "Inhibición de la síntesis proteica bacteriana",
    pregnancy_risks: "Categoría B - Seguro durante el embarazo",
    recommendations: "Alternativa segura para pacientes alérgicas a penicilinas.",
    monitoring: "Síntomas gastrointestinales, función hepática",
    alternatives: ["azitromicina", "amoxicilina"]
  },

  "sulfametoxazol": {
    name: "Sulfametoxazol + Trimetoprima",
    aliases: ["bactrim", "septra", "cotrimoxazol"],
    category: "Antibiótico",
    class: "Sulfonamida + Inhibidor de folato",
    mechanism: "Inhibición secuencial de la síntesis de folato",
    pregnancy_risks: "Categoría C - Evitar en primer y tercer trimestre",
    recommendations: "Evitar en primer trimestre (defectos del tubo neural) y tercer trimestre (kernicterus).",
    monitoring: "Función renal, niveles de folato",
    alternatives: ["amoxicilina", "cefalexina", "eritromicina"]
  },

  // Antiácidos y protectores gástricos
  "ranitidina": {
    name: "Ranitidina",
    aliases: ["zantac", "ranitidine"],
    category: "Antagonista H2",
    class: "Bloqueador H2",
    mechanism: "Inhibición de receptores H2 en células parietales",
    pregnancy_risks: "Categoría B - Generalmente seguro",
    recommendations: "Seguro para acidez durante embarazo. Retirado del mercado por impurezas NDMA.",
    monitoring: "Función renal, síntomas gastrointestinales",
    alternatives: ["omeprazol", "famotidina"]
  },

  "famotidina": {
    name: "Famotidina",
    aliases: ["pepcid", "famotidine"],
    category: "Antagonista H2",
    class: "Bloqueador H2",
    mechanism: "Inhibición selectiva de receptores H2",
    pregnancy_risks: "Categoría B - Seguro durante el embarazo",
    recommendations: "Alternativa segura a ranitidina para acidez durante embarazo.",
    monitoring: "Función renal, respuesta clínica",
    alternatives: ["omeprazol", "antiácidos"]
  },

  "hidróxido de aluminio": {
    name: "Hidróxido de Aluminio",
    aliases: ["maalox", "mylanta", "antiácido"],
    category: "Antiácido",
    class: "Antiácido no sistémico",
    mechanism: "Neutralización directa del ácido gástrico",
    pregnancy_risks: "Categoría A - Seguro en dosis normales",
    recommendations: "Antiácido seguro durante embarazo. Evitar uso excesivo prolongado.",
    monitoring: "Estreñimiento, absorción de otros medicamentos",
    alternatives: ["carbonato de calcio", "famotidina"]
  },

  // Vitaminas y suplementos
  "ácido fólico": {
    name: "Ácido Fólico",
    aliases: ["folate", "folacin", "vitamina b9"],
    category: "Vitamina hidrosoluble",
    class: "Vitamina B",
    mechanism: "Cofactor en síntesis de ADN y metabolismo",
    pregnancy_risks: "Categoría A - Esencial durante el embarazo",
    recommendations: "Suplemento obligatorio antes y durante embarazo. Previene defectos del tubo neural.",
    monitoring: "Niveles séricos, desarrollo fetal",
    alternatives: ["multivitamínicos prenatales"]
  },

  "sulfato ferroso": {
    name: "Sulfato Ferroso",
    aliases: ["hierro", "iron sulfate", "fer-in-sol"],
    category: "Suplemento mineral",
    class: "Sales de hierro",
    mechanism: "Suplementación de hierro para síntesis de hemoglobina",
    pregnancy_risks: "Categoría A - Seguro y necesario",
    recommendations: "Suplemento esencial para prevenir anemia durante embarazo.",
    monitoring: "Hemoglobina, hematocrito, síntomas gastrointestinales",
    alternatives: ["fumarato ferroso", "hierro polimaltosado"]
  },

  "calcio": {
    name: "Carbonato de Calcio",
    aliases: ["calcium carbonate", "tums", "caltrate"],
    category: "Suplemento mineral",
    class: "Sales de calcio",
    mechanism: "Suplementación de calcio para desarrollo óseo",
    pregnancy_risks: "Categoría A - Seguro y beneficioso",
    recommendations: "Importante para desarrollo óseo fetal y prevención de preeclampsia.",
    monitoring: "Niveles séricos de calcio, función renal",
    alternatives: ["citrato de calcio", "lácteos fortificados"]
  },

  // Analgésicos tópicos
  "diclofenaco tópico": {
    name: "Diclofenaco Tópico",
    aliases: ["voltaren gel", "diclofenac gel"],
    category: "AINE tópico",
    class: "Derivado del ácido acético",
    mechanism: "Inhibición local de ciclooxigenasa",
    pregnancy_risks: "Categoría C - Uso tópico con precaución",
    recommendations: "Minimizar absorción sistémica. Evitar en tercer trimestre.",
    monitoring: "Irritación local, absorción sistémica",
    alternatives: ["paracetamol", "compresas frías"]
  },

  // CATEGORÍA A - SEGUROS
  'levotiroxina': {
    name: 'Levotiroxina',
    aliases: ['levothyroxine', 'synthroid', 'eutirox', 'euthyrox'],
    category: 'A',
    class: 'Hormona tiroidea',
    mechanism: 'Reemplazo hormonal tiroideo',
    pregnancy_risks: 'Sin riesgos conocidos. Esencial para desarrollo fetal.',
    recommendations: 'Continuar tratamiento. Ajustar dosis según TSH.',
    monitoring: 'TSH cada 4-6 semanas'
  },

  // CATEGORÍA B - PROBABLEMENTE SEGUROS
  'acetaminofén': {
    name: 'Acetaminofén (Paracetamol)',
    aliases: ['acetaminophen', 'paracetamol', 'tylenol', 'tempra'],
    category: 'B',
    class: 'Analgésico antipirético',
    mechanism: 'Inhibición de síntesis de prostaglandinas en SNC',
    pregnancy_risks: 'Riesgo muy bajo. Analgésico preferido.',
    recommendations: 'Primera línea para dolor y fiebre.',
    monitoring: 'Dosis máxima 3g/día'
  },
  'amoxicilina': {
    name: 'Amoxicilina',
    aliases: ['amoxicillin', 'amoxil', 'trimox'],
    category: 'B',
    class: 'Antibiótico betalactámico',
    mechanism: 'Inhibición síntesis pared celular bacteriana',
    pregnancy_risks: 'Riesgo bajo. Antibiótico de primera línea.',
    recommendations: 'Seguro durante todo el embarazo.',
    monitoring: 'Función renal si uso prolongado'
  },
  'azitromicina': {
    name: 'Azitromicina',
    aliases: ['azithromycin', 'zithromax', 'z-pak'],
    category: 'B',
    class: 'Antibiótico macrólido',
    mechanism: 'Inhibición síntesis proteica bacteriana',
    pregnancy_risks: 'Riesgo bajo. Alternativa a eritromicina.',
    recommendations: 'Seguro para infecciones respiratorias.',
    monitoring: 'Función hepática si uso prolongado'
  },
  'cefalexina': {
    name: 'Cefalexina',
    aliases: ['cephalexin', 'keflex'],
    category: 'B',
    class: 'Antibiótico cefalosporina',
    mechanism: 'Inhibición síntesis pared celular',
    pregnancy_risks: 'Riesgo bajo. Alternativa a penicilinas.',
    recommendations: 'Seguro para ITU y infecciones de piel.',
    monitoring: 'Función renal'
  },
  'metformina': {
    name: 'Metformina',
    aliases: ['metformin', 'glucophage'],
    category: 'B',
    class: 'Antidiabético biguanida',
    mechanism: 'Reducción gluconeogénesis hepática',
    pregnancy_risks: 'Riesgo bajo. Reduce resistencia insulina.',
    recommendations: 'Continuar en diabetes gestacional.',
    monitoring: 'Glucosa, función renal'
  },
  'insulina': {
    name: 'Insulina',
    aliases: ['insulin', 'humalog', 'novolog', 'lantus'],
    category: 'B',
    class: 'Hormona hipoglucemiante',
    mechanism: 'Facilita captación celular de glucosa',
    pregnancy_risks: 'Sin riesgos. No cruza placenta.',
    recommendations: 'Tratamiento preferido diabetes gestacional.',
    monitoring: 'Glucosa capilar frecuente'
  },
  'heparina': {
    name: 'Heparina',
    aliases: ['heparin', 'lovenox', 'enoxaparin'],
    category: 'B',
    class: 'Anticoagulante',
    mechanism: 'Activación antitrombina III',
    pregnancy_risks: 'Sin riesgos. No cruza placenta.',
    recommendations: 'Anticoagulante de elección.',
    monitoring: 'PTT, plaquetas'
  },
  'metildopa': {
    name: 'Metildopa',
    aliases: ['methyldopa', 'aldomet'],
    category: 'B',
    class: 'Antihipertensivo central',
    mechanism: 'Agonista alfa-2 central',
    pregnancy_risks: 'Riesgo bajo. Antihipertensivo preferido.',
    recommendations: 'Primera línea para hipertensión gestacional.',
    monitoring: 'Presión arterial, función hepática'
  },
  'esomeprazol': {
    name: 'Esomeprazol',
    aliases: ['esomeprazole', 'nexium'],
    category: 'B',
    class: 'Inhibidor bomba protones',
    mechanism: 'Inhibición H+/K+-ATPase gástrica',
    pregnancy_risks: 'Riesgo bajo para reflujo severo.',
    recommendations: 'Seguro para ERGE sintomática.',
    monitoring: 'Síntomas, magnesio sérico'
  },

  // CATEGORÍA C - USAR CON PRECAUCIÓN
  'omeprazol': {
    name: 'Omeprazol',
    aliases: ['omeprazole', 'prilosec'],
    category: 'C',
    class: 'Inhibidor bomba protones',
    mechanism: 'Inhibición H+/K+-ATPase',
    pregnancy_risks: 'Riesgo moderado. Usar si beneficio supera riesgo.',
    recommendations: 'Esomeprazol preferido.',
    monitoring: 'Función renal, magnesio'
  },
  'ibuprofeno': {
    name: 'Ibuprofeno',
    aliases: ['ibuprofen', 'advil', 'motrin'],
    category: 'C',
    class: 'AINE',
    mechanism: 'Inhibición COX no selectiva',
    pregnancy_risks: 'Riesgo cierre ductus arteriosus >30 sem.',
    recommendations: 'Evitar tercer trimestre.',
    monitoring: 'Función renal fetal',
    alternatives: ['acetaminofén']
  },
  'prednisona': {
    name: 'Prednisona',
    aliases: ['prednisone', 'deltasone'],
    category: 'C',
    class: 'Corticosteroide',
    mechanism: 'Agonista receptor glucocorticoide',
    pregnancy_risks: 'Riesgo paladar hendido primer trimestre.',
    recommendations: 'Dosis mínima efectiva.',
    monitoring: 'Glucosa, presión arterial'
  },
  'fluoxetina': {
    name: 'Fluoxetina',
    aliases: ['fluoxetine', 'prozac'],
    category: 'C',
    class: 'ISRS',
    mechanism: 'Inhibición recaptación serotonina',
    pregnancy_risks: 'Riesgo hipertensión pulmonar persistente.',
    recommendations: 'Evaluar beneficio-riesgo.',
    monitoring: 'Estado mental, síntomas neonatales'
  },
  'sertralina': {
    name: 'Sertralina',
    aliases: ['sertraline', 'zoloft'],
    category: 'C',
    class: 'ISRS',
    mechanism: 'Inhibición selectiva recaptación serotonina',
    pregnancy_risks: 'ISRS con menor riesgo.',
    recommendations: 'ISRS preferido si es necesario.',
    monitoring: 'Síntomas depresivos, ansiedad'
  },
  'ciprofloxacina': {
    name: 'Ciprofloxacina',
    aliases: ['ciprofloxacin', 'cipro'],
    category: 'C',
    class: 'Fluoroquinolona',
    mechanism: 'Inhibición DNA girasa bacteriana',
    pregnancy_risks: 'Posibles efectos en cartílago fetal.',
    recommendations: 'Solo si otros antibióticos inefectivos.',
    monitoring: 'Función renal'
  },
  'salbutamol': {
    name: 'Salbutamol',
    aliases: ['albuterol', 'ventolin', 'proair'],
    category: 'C',
    class: 'Beta-2 agonista',
    mechanism: 'Agonismo receptor beta-2 adrenérgico',
    pregnancy_risks: 'Riesgo bajo para control asma.',
    recommendations: 'Continuar para control asma.',
    monitoring: 'Función pulmonar, frecuencia cardíaca'
  },

  // CATEGORÍA D - RIESGO DOCUMENTADO
  'clonazepam': {
    name: 'Clonazepam',
    aliases: ['clonazepam', 'klonopin', 'rivotril'],
    category: 'D',
    class: 'Benzodiacepina',
    mechanism: 'Modulación positiva GABA-A',
    pregnancy_risks: 'Riesgo labio leporino, síndrome abstinencia.',
    recommendations: 'Reducir gradualmente o sustituir.',
    monitoring: 'Síntomas abstinencia neonatal',
    alternatives: ['psicoterapia', 'antidepresivos seguros']
  },
  'diazepam': {
    name: 'Diazepam',
    aliases: ['diazepam', 'valium'],
    category: 'D',
    class: 'Benzodiacepina',
    mechanism: 'Modulación GABA-A',
    pregnancy_risks: 'Malformaciones, síndrome abstinencia neonatal.',
    recommendations: 'Evitar o reducir gradualmente.',
    monitoring: 'Síntomas abstinencia',
    alternatives: ['técnicas relajación']
  },
  'atenolol': {
    name: 'Atenolol',
    aliases: ['atenolol', 'tenormin'],
    category: 'D',
    class: 'Beta-bloqueador cardioselectivo',
    mechanism: 'Antagonismo receptor beta-1',
    pregnancy_risks: 'RCIU, bradicardia fetal.',
    recommendations: 'Cambiar a metildopa.',
    monitoring: 'Crecimiento fetal, FCF',
    alternatives: ['metildopa', 'nifedipino']
  },
  'enalapril': {
    name: 'Enalapril',
    aliases: ['enalapril', 'vasotec'],
    category: 'D',
    class: 'IECA',
    mechanism: 'Inhibición enzima convertidora angiotensina',
    pregnancy_risks: 'Oligohidramnios, IR fetal, muerte fetal.',
    recommendations: 'Discontinuar inmediatamente.',
    monitoring: 'Líquido amniótico, función renal fetal',
    alternatives: ['metildopa', 'nifedipino']
  },
  'losartan': {
    name: 'Losartán',
    aliases: ['losartan', 'cozaar'],
    category: 'D',
    class: 'ARA II',
    mechanism: 'Antagonismo receptor angiotensina II',
    pregnancy_risks: 'Oligohidramnios, IR fetal.',
    recommendations: 'Discontinuar inmediatamente.',
    monitoring: 'Función renal fetal',
    alternatives: ['metildopa']
  },

  // CATEGORÍA X - CONTRAINDICADOS
  'warfarina': {
    name: 'Warfarina',
    aliases: ['warfarin', 'coumadin'],
    category: 'X',
    class: 'Anticoagulante cumarínico',
    mechanism: 'Inhibición síntesis factores coagulación',
    pregnancy_risks: 'Embriopatía, hemorragias fetales.',
    recommendations: 'Cambiar a heparina inmediatamente.',
    monitoring: 'INR hasta cambio',
    alternatives: ['heparina', 'enoxaparina']
  },
  'atorvastatina': {
    name: 'Atorvastatina',
    aliases: ['atorvastatin', 'lipitor'],
    category: 'X',
    class: 'Estatina',
    mechanism: 'Inhibición HMG-CoA reductasa',
    pregnancy_risks: 'Defectos congénitos, malformaciones SNC.',
    recommendations: 'Discontinuar antes concepción.',
    monitoring: 'Suspender hasta postparto',
    alternatives: ['dieta', 'ejercicio']
  },
  'simvastatina': {
    name: 'Simvastatina',
    aliases: ['simvastatin', 'zocor'],
    category: 'X',
    class: 'Estatina',
    mechanism: 'Inhibición HMG-CoA reductasa',
    pregnancy_risks: 'Malformaciones congénitas.',
    recommendations: 'Suspender inmediatamente.',
    monitoring: 'Perfil lipídico postparto',
    alternatives: ['modificación estilo vida']
  },
  'isotretinoína': {
    name: 'Isotretinoína',
    aliases: ['isotretinoin', 'accutane', 'roaccutan'],
    category: 'X',
    class: 'Retinoide sistémico',
    mechanism: 'Modulación diferenciación celular',
    pregnancy_risks: 'Teratógeno mayor. Malformaciones múltiples.',
    recommendations: 'Contraindicado absoluto.',
    monitoring: 'Test embarazo antes/durante tratamiento',
    alternatives: ['tratamientos tópicos']
  },
  'metotrexato': {
    name: 'Metotrexato',
    aliases: ['methotrexate', 'rheumatrex'],
    category: 'X',
    class: 'Antimetabolito',
    mechanism: 'Inhibición dihidrofolato reductasa',
    pregnancy_risks: 'Aborto, malformaciones múltiples.',
    recommendations: 'Discontinuar 3 meses antes concepción.',
    monitoring: 'Test embarazo',
    alternatives: ['sulfasalazina', 'biologicos seguros']
  }
};

// Función de búsqueda inteligente que maneja variaciones y sinónimos
export function findDrug(searchTerm: string): DrugClassification | null {
  const term = searchTerm.toLowerCase().trim();
  
  // Búsqueda directa por nombre
  if (comprehensiveDrugDatabase[term]) {
    return comprehensiveDrugDatabase[term];
  }
  
  // Búsqueda por aliases
  for (const [key, drug] of Object.entries(comprehensiveDrugDatabase)) {
    if (drug.aliases.some(alias => 
      alias.toLowerCase() === term || 
      alias.toLowerCase().includes(term) ||
      term.includes(alias.toLowerCase())
    )) {
      return drug;
    }
  }
  
  // Búsqueda parcial por nombre
  for (const [key, drug] of Object.entries(comprehensiveDrugDatabase)) {
    if (key.includes(term) || term.includes(key)) {
      return drug;
    }
  }
  
  return null;
}

export function getDrugsByCategory(category: string): DrugClassification[] {
  return Object.values(comprehensiveDrugDatabase).filter(drug => 
    drug.category.toLowerCase() === category.toLowerCase()
  );
}

export function getAllDrugs(): DrugClassification[] {
  return Object.values(comprehensiveDrugDatabase);
}

export function getDrugsByClass(drugClass: string): DrugClassification[] {
  return Object.values(comprehensiveDrugDatabase).filter(drug => 
    drug.class.toLowerCase().includes(drugClass.toLowerCase())
  );
}