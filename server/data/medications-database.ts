// Base de datos médica completa de medicamentos con clasificaciones FDA auténticas
export interface MedicationData {
  name: string;
  englishNames: string[];
  category: string;
  description: string;
  risks: string;
  recommendations: string;
  commonUses: string[];
  trimesterSpecific?: {
    first?: string;
    second?: string;
    third?: string;
  };
}

export const medicationsDatabase: Record<string, MedicationData> = {
  // Antibióticos
  'azitromicina': {
    name: 'Azitromicina',
    englishNames: ['azithromycin', 'Zithromax', 'Z-Pak'],
    category: 'B',
    description: 'Antibiótico macrólido seguro durante el embarazo',
    risks: 'Riesgo bajo. Puede causar náuseas o malestar estomacal.',
    recommendations: 'Seguro para uso durante el embarazo bajo supervisión médica.',
    commonUses: ['Infecciones respiratorias', 'Infecciones de piel', 'Clamidia'],
    trimesterSpecific: {
      first: 'Seguro si es necesario',
      second: 'Uso preferido',
      third: 'Seguro, monitorear efectos gastrointestinales'
    }
  },
  'amoxicilina': {
    name: 'Amoxicilina',
    englishNames: ['amoxicillin', 'Amoxil', 'Trimox'],
    category: 'B',
    description: 'Antibiótico penicilina ampliamente usado y seguro',
    risks: 'Riesgo muy bajo. Posibles reacciones alérgicas en personas sensibles.',
    recommendations: 'Antibiótico de primera línea durante el embarazo.',
    commonUses: ['Infecciones del tracto urinario', 'Infecciones respiratorias', 'Infecciones dentales']
  },
  'cefalexina': {
    name: 'Cefalexina',
    englishNames: ['cephalexin', 'Keflex'],
    category: 'B',
    description: 'Antibiótico cefalosporina seguro para uso en embarazo',
    risks: 'Riesgo bajo. Puede causar diarrea o candidiasis vaginal.',
    recommendations: 'Alternativa segura a penicilinas.',
    commonUses: ['Infecciones de piel', 'Infecciones del tracto urinario']
  },
  'ciprofloxacina': {
    name: 'Ciprofloxacina',
    englishNames: ['ciprofloxacin', 'Cipro'],
    category: 'C',
    description: 'Antibiótico fluoroquinolona con uso limitado en embarazo',
    risks: 'Riesgo moderado. Posibles efectos en el desarrollo del cartílago fetal.',
    recommendations: 'Usar solo si otros antibióticos no son efectivos.',
    commonUses: ['Infecciones del tracto urinario', 'Infecciones gastrointestinales']
  },

  // Analgésicos
  'paracetamol': {
    name: 'Paracetamol (Acetaminofén)',
    englishNames: ['acetaminophen', 'Tylenol'],
    category: 'B',
    description: 'Analgésico y antipirético seguro durante todo el embarazo',
    risks: 'Riesgo muy bajo cuando se usa según indicaciones.',
    recommendations: 'Analgésico de primera elección durante el embarazo.',
    commonUses: ['Dolor', 'Fiebre', 'Dolor de cabeza'],
    trimesterSpecific: {
      first: 'Seguro en dosis normales',
      second: 'Seguro en dosis normales',
      third: 'Seguro, evitar uso prolongado en dosis altas'
    }
  },
  'ibuprofeno': {
    name: 'Ibuprofeno',
    englishNames: ['ibuprofen', 'Advil', 'Motrin'],
    category: 'C',
    description: 'AINE con restricciones en el tercer trimestre',
    risks: 'Riesgo de cierre prematuro del ductus arteriosus en tercer trimestre.',
    recommendations: 'Evitar después de la semana 30. Usar paracetamol como alternativa.',
    commonUses: ['Dolor', 'Inflamación', 'Fiebre'],
    trimesterSpecific: {
      first: 'Usar con precaución',
      second: 'Usar con precaución',
      third: 'Evitar - riesgo cardiovascular fetal'
    }
  },
  'aspirina': {
    name: 'Aspirina (Ácido acetilsalicílico)',
    englishNames: ['aspirin', 'acetylsalicylic acid'],
    category: 'D',
    description: 'AINE con riesgos significativos en embarazo',
    risks: 'Riesgo de sangrado y complicaciones cardiovasculares fetales.',
    recommendations: 'Solo usar en dosis bajas para prevención de preeclampsia bajo supervisión.',
    commonUses: ['Prevención cardiovascular', 'Dolor', 'Fiebre']
  },

  // Benzodiacepinas
  'clonazepam': {
    name: 'Clonazepam',
    englishNames: ['clonazepam', 'Klonopin', 'Rivotril'],
    category: 'D',
    description: 'Benzodiacepina con riesgo de malformaciones y síndrome de abstinencia',
    risks: 'Riesgo de labio leporino, síndrome de abstinencia neonatal.',
    recommendations: 'Reducir gradualmente o cambiar a alternativas más seguras.',
    commonUses: ['Ansiedad', 'Convulsiones', 'Trastorno de pánico'],
    trimesterSpecific: {
      first: 'Alto riesgo de malformaciones',
      second: 'Riesgo moderado',
      third: 'Riesgo de síndrome de abstinencia neonatal'
    }
  },
  'diazepam': {
    name: 'Diazepam',
    englishNames: ['diazepam', 'Valium'],
    category: 'D',
    description: 'Benzodiacepina con riesgos conocidos durante el embarazo',
    risks: 'Malformaciones congénitas, síndrome de abstinencia neonatal.',
    recommendations: 'Evitar o reducir gradualmente bajo supervisión médica.',
    commonUses: ['Ansiedad', 'Espasmos musculares', 'Convulsiones']
  },

  // Antidepresivos
  'fluoxetina': {
    name: 'Fluoxetina',
    englishNames: ['fluoxetine', 'Prozac'],
    category: 'C',
    description: 'ISRS con uso cauteloso durante el embarazo',
    risks: 'Posible hipertensión pulmonar persistente en recién nacidos.',
    recommendations: 'Evaluar beneficio-riesgo. Monitoreo estrecho.',
    commonUses: ['Depresión', 'Ansiedad', 'Trastorno obsesivo-compulsivo']
  },
  'sertralina': {
    name: 'Sertralina',
    englishNames: ['sertraline', 'Zoloft'],
    category: 'C',
    description: 'ISRS preferido durante el embarazo cuando es necesario',
    risks: 'Riesgo bajo de complicaciones neonatales.',
    recommendations: 'ISRS de elección durante el embarazo si es necesario.',
    commonUses: ['Depresión', 'Ansiedad', 'Trastorno de pánico']
  },

  // Antihipertensivos
  'atenolol': {
    name: 'Atenolol',
    englishNames: ['atenolol', 'Tenormin'],
    category: 'D',
    description: 'Beta-bloqueador con riesgos fetales',
    risks: 'Retardo del crecimiento intrauterino, bradicardia fetal.',
    recommendations: 'Cambiar a alternativas más seguras como metildopa.',
    commonUses: ['Hipertensión', 'Arritmias', 'Migraña']
  },
  'enalapril': {
    name: 'Enalapril',
    englishNames: ['enalapril', 'Vasotec'],
    category: 'D',
    description: 'IECA contraindicado durante el embarazo',
    risks: 'Oligohidramnios, insuficiencia renal fetal, muerte fetal.',
    recommendations: 'Discontinuar inmediatamente. Cambiar a metildopa.',
    commonUses: ['Hipertensión', 'Insuficiencia cardíaca']
  },
  'metildopa': {
    name: 'Metildopa',
    englishNames: ['methyldopa', 'Aldomet'],
    category: 'B',
    description: 'Antihipertensivo de primera línea en embarazo',
    risks: 'Riesgo bajo. Posible somnolencia o depresión.',
    recommendations: 'Antihipertensivo preferido durante el embarazo.',
    commonUses: ['Hipertensión en embarazo']
  },

  // Anticoagulantes
  'warfarina': {
    name: 'Warfarina',
    englishNames: ['warfarin', 'Coumadin'],
    category: 'X',
    description: 'Anticoagulante contraindicado en embarazo',
    risks: 'Embriopatía por warfarina, hemorragias fetales.',
    recommendations: 'Cambiar a heparina inmediatamente.',
    commonUses: ['Anticoagulación', 'Fibrilación auricular']
  },
  'heparina': {
    name: 'Heparina',
    englishNames: ['heparin'],
    category: 'B',
    description: 'Anticoagulante seguro durante el embarazo',
    risks: 'Riesgo bajo. No cruza la placenta.',
    recommendations: 'Anticoagulante de elección durante el embarazo.',
    commonUses: ['Anticoagulación', 'Tromboembolismo']
  },

  // Estatinas
  'atorvastatina': {
    name: 'Atorvastatina',
    englishNames: ['atorvastatin', 'Lipitor'],
    category: 'X',
    description: 'Estatina contraindicada durante el embarazo',
    risks: 'Defectos congénitos, malformaciones del SNC.',
    recommendations: 'Discontinuar inmediatamente al confirmar embarazo.',
    commonUses: ['Hipercolesterolemia', 'Prevención cardiovascular']
  },
  'simvastatina': {
    name: 'Simvastatina',
    englishNames: ['simvastatin', 'Zocor'],
    category: 'X',
    description: 'Estatina contraindicada durante el embarazo',
    risks: 'Malformaciones congénitas, defectos del tubo neural.',
    recommendations: 'Suspender antes de la concepción.',
    commonUses: ['Hipercolesterolemia']
  },

  // Corticosteroides
  'prednisona': {
    name: 'Prednisona',
    englishNames: ['prednisone'],
    category: 'C',
    description: 'Corticosteroide con uso cauteloso en embarazo',
    risks: 'Posible paladar hendido en primer trimestre, diabetes gestacional.',
    recommendations: 'Usar la dosis mínima efectiva por el menor tiempo posible.',
    commonUses: ['Asma', 'Artritis', 'Enfermedades autoinmunes']
  },

  // Hormonas tiroideas
  'levotiroxina': {
    name: 'Levotiroxina',
    englishNames: ['levothyroxine', 'Synthroid', 'Eutirox'],
    category: 'A',
    description: 'Hormona tiroidea esencial durante el embarazo',
    risks: 'Sin riesgos conocidos. Esencial para desarrollo fetal.',
    recommendations: 'Continuar y ajustar dosis según necesidad.',
    commonUses: ['Hipotiroidismo'],
    trimesterSpecific: {
      first: 'Esencial - aumentar dosis si es necesario',
      second: 'Monitorear TSH regularmente',
      third: 'Mantener niveles óptimos'
    }
  },

  // Antidiabéticos
  'metformina': {
    name: 'Metformina',
    englishNames: ['metformin', 'Glucophage'],
    category: 'B',
    description: 'Antidiabético seguro durante el embarazo',
    risks: 'Riesgo bajo. Puede reducir absorción de vitamina B12.',
    recommendations: 'Puede continuarse durante el embarazo.',
    commonUses: ['Diabetes tipo 2', 'Síndrome de ovario poliquístico']
  },
  'insulina': {
    name: 'Insulina',
    englishNames: ['insulin'],
    category: 'B',
    description: 'Tratamiento de primera línea para diabetes en embarazo',
    risks: 'Sin riesgos fetales. No cruza la placenta.',
    recommendations: 'Tratamiento preferido para diabetes gestacional.',
    commonUses: ['Diabetes tipo 1', 'Diabetes gestacional']
  },

  // Inhibidores de bomba de protones
  'esomeprazol': {
    name: 'Esomeprazol',
    englishNames: ['esomeprazole', 'Nexium'],
    category: 'B',
    description: 'Inhibidor de bomba de protones seguro durante el embarazo',
    risks: 'Riesgo bajo. Puede causar dolor de cabeza o náuseas.',
    recommendations: 'Seguro para uso durante el embarazo bajo supervisión médica.',
    commonUses: ['Reflujo gastroesofágico', 'Úlceras pépticas', 'Síndrome de Zollinger-Ellison']
  },
  'lansoprazol': {
    name: 'Lansoprazol',
    englishNames: ['lansoprazole', 'Prevacid'],
    category: 'B',
    description: 'Inhibidor de bomba de protones con perfil de seguridad favorable',
    risks: 'Riesgo bajo durante el embarazo.',
    recommendations: 'Alternativa segura para el tratamiento de acidez.',
    commonUses: ['Reflujo gastroesofágico', 'Úlceras duodenales']
  },
  'pantoprazol': {
    name: 'Pantoprazol',
    englishNames: ['pantoprazole', 'Protonix'],
    category: 'B',
    description: 'Inhibidor de bomba de protones con uso seguro en embarazo',
    risks: 'Perfil de seguridad favorable durante el embarazo.',
    recommendations: 'Puede usarse cuando sea necesario.',
    commonUses: ['Esofagitis erosiva', 'Úlceras gástricas']
  },

  // Antihistamínicos
  'loratadina': {
    name: 'Loratadina',
    englishNames: ['loratadine', 'Claritin'],
    category: 'B',
    description: 'Antihistamínico no sedante seguro durante el embarazo',
    risks: 'Riesgo bajo. Antihistamínico preferido.',
    recommendations: 'Antihistamínico de primera elección durante el embarazo.',
    commonUses: ['Alergias', 'Rinitis alérgica', 'Urticaria']
  },
  'cetirizina': {
    name: 'Cetirizina',
    englishNames: ['cetirizine', 'Zyrtec'],
    category: 'B',
    description: 'Antihistamínico con perfil de seguridad establecido',
    risks: 'Riesgo bajo durante el embarazo.',
    recommendations: 'Seguro para uso en embarazo.',
    commonUses: ['Alergias estacionales', 'Dermatitis atópica']
  },
  'difenhidramina': {
    name: 'Difenhidramina',
    englishNames: ['diphenhydramine', 'Benadryl'],
    category: 'B',
    description: 'Antihistamínico clásico con uso seguro en embarazo',
    risks: 'Puede causar somnolencia. Seguro en dosis apropiadas.',
    recommendations: 'Seguro para uso ocasional.',
    commonUses: ['Alergias', 'Insomnio ocasional', 'Náuseas']
  },

  // Antieméticos
  'ondansetron': {
    name: 'Ondansetrón',
    englishNames: ['ondansetron', 'Zofran'],
    category: 'B',
    description: 'Antiemético usado para náuseas severas del embarazo',
    risks: 'Riesgo bajo. Posible pequeño aumento de riesgo de fisura palatina.',
    recommendations: 'Usar para náuseas severas cuando otros tratamientos fallan.',
    commonUses: ['Náuseas del embarazo', 'Vómitos por quimioterapia']
  },
  'metoclopramida': {
    name: 'Metoclopramida',
    englishNames: ['metoclopramide', 'Reglan'],
    category: 'B',
    description: 'Antiemético y procinético seguro en embarazo',
    risks: 'Riesgo bajo. Evitar uso prolongado.',
    recommendations: 'Seguro para uso a corto plazo.',
    commonUses: ['Náuseas', 'Gastroparesia', 'Reflujo']
  },

  // Broncodilatadores
  'salbutamol': {
    name: 'Salbutamol',
    englishNames: ['salbutamol', 'albuterol', 'Ventolin'],
    category: 'C',
    description: 'Broncodilatador de acción rápida para asma',
    risks: 'Riesgo bajo cuando se usa según indicaciones.',
    recommendations: 'Continuar uso para control del asma durante el embarazo.',
    commonUses: ['Asma', 'Broncoespasmo', 'EPOC'],
    trimesterSpecific: {
      first: 'Continuar si es necesario para control del asma',
      second: 'Uso seguro para exacerbaciones',
      third: 'Seguro, monitorear frecuencia cardíaca fetal'
    }
  },

  // Antifúngicos
  'fluconazol': {
    name: 'Fluconazol',
    englishNames: ['fluconazole', 'Diflucan'],
    category: 'C',
    description: 'Antifúngico con uso cauteloso en embarazo',
    risks: 'Riesgo de malformaciones con dosis altas o uso prolongado.',
    recommendations: 'Evitar en primer trimestre. Usar solo si es esencial.',
    commonUses: ['Candidiasis vaginal', 'Infecciones fúngicas sistémicas']
  },
  'nistatina': {
    name: 'Nistatina',
    englishNames: ['nystatin', 'Mycostatin'],
    category: 'B',
    description: 'Antifúngico tópico seguro durante el embarazo',
    risks: 'Riesgo muy bajo. Absorción sistémica mínima.',
    recommendations: 'Antifúngico de primera elección para candidiasis.',
    commonUses: ['Candidiasis oral', 'Candidiasis vaginal']
  }
};

export function searchMedication(term: string): MedicationData | null {
  const searchTerm = term.toLowerCase().trim();
  
  // Buscar por nombre en español
  if (medicationsDatabase[searchTerm]) {
    return medicationsDatabase[searchTerm];
  }
  
  // Buscar por nombres en inglés
  for (const [key, medication] of Object.entries(medicationsDatabase)) {
    if (medication.englishNames.some(name => 
      name.toLowerCase().includes(searchTerm) || searchTerm.includes(name.toLowerCase())
    )) {
      return medication;
    }
  }
  
  return null;
}

export function getAllMedications(): MedicationData[] {
  return Object.values(medicationsDatabase);
}

export function getMedicationsByCategory(category: string): MedicationData[] {
  return Object.values(medicationsDatabase).filter(med => med.category === category);
}