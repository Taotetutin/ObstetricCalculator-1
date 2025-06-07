// Sistema de interacciones medicamentosas durante el embarazo
export interface DrugInteraction {
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

export const drugInteractions: DrugInteraction[] = [
  // INTERACCIONES MAJOR Y CONTRAINDICADAS
  {
    drug1: 'warfarina',
    drug2: 'aspirina',
    severity: 'major',
    mechanism: 'Sinergismo anticoagulante y antiagregante',
    clinical_effect: 'Riesgo significativamente aumentado de hemorragia',
    pregnancy_specific_risk: 'Hemorragia materna y fetal. Ambos medicamentos tienen riesgos en embarazo.',
    management: 'Evitar combinación. Cambiar warfarina por heparina.',
    alternatives: ['heparina', 'enoxaparina'],
    monitoring_parameters: ['INR', 'TP', 'signos de sangrado'],
    onset: 'rapid',
    documentation: 'excellent'
  },
  {
    drug1: 'enalapril',
    drug2: 'losartan',
    severity: 'contraindicated',
    mechanism: 'Doble bloqueo del sistema renina-angiotensina',
    clinical_effect: 'Hipotensión severa, insuficiencia renal',
    pregnancy_specific_risk: 'Oligohidramnios severo, muerte fetal',
    management: 'Contraindicado absoluto. Usar metildopa.',
    alternatives: ['metildopa', 'nifedipino'],
    monitoring_parameters: ['presión arterial', 'función renal', 'líquido amniótico'],
    onset: 'rapid',
    documentation: 'excellent'
  },
  {
    drug1: 'fluoxetina',
    drug2: 'sertralina',
    severity: 'major',
    mechanism: 'Duplicación efecto serotoninérgico',
    clinical_effect: 'Síndrome serotoninérgico',
    pregnancy_specific_risk: 'Toxicidad materna y posibles efectos neonatales',
    management: 'Evitar combinación. Usar un solo ISRS.',
    alternatives: ['monoterapia con sertralina'],
    monitoring_parameters: ['síntomas serotoninérgicos', 'temperatura'],
    onset: 'rapid',
    documentation: 'excellent'
  },
  {
    drug1: 'clonazepam',
    drug2: 'diazepam',
    severity: 'major',
    mechanism: 'Efecto aditivo sobre depresión SNC',
    clinical_effect: 'Sedación excesiva, depresión respiratoria',
    pregnancy_specific_risk: 'Mayor riesgo de malformaciones y síndrome de abstinencia neonatal',
    management: 'Evitar combinación. Reducir gradualmente ambos.',
    alternatives: ['psicoterapia', 'técnicas de relajación'],
    monitoring_parameters: ['nivel de conciencia', 'función respiratoria'],
    onset: 'rapid',
    documentation: 'excellent'
  },

  // INTERACCIONES MODERADAS
  {
    drug1: 'metformina',
    drug2: 'prednisona',
    severity: 'moderate',
    mechanism: 'Antagonismo en control glucémico',
    clinical_effect: 'Hiperglucemia, pérdida de control diabético',
    pregnancy_specific_risk: 'Diabetes gestacional descontrolada',
    management: 'Monitoreo frecuente de glucosa. Ajustar dosis.',
    alternatives: ['insulina si es necesario'],
    monitoring_parameters: ['glucosa capilar', 'HbA1c'],
    onset: 'delayed',
    documentation: 'good'
  },
  {
    drug1: 'levotiroxina',
    drug2: 'omeprazol',
    severity: 'moderate',
    mechanism: 'Reducción absorción de levotiroxina',
    clinical_effect: 'Hipotiroidismo, pérdida de control tiroideo',
    pregnancy_specific_risk: 'Hipotiroidismo maternal afecta desarrollo fetal',
    management: 'Separar administración por 4 horas.',
    alternatives: ['esomeprazol con separación temporal'],
    monitoring_parameters: ['TSH', 'T4 libre'],
    onset: 'delayed',
    documentation: 'good'
  },
  {
    drug1: 'azitromicina',
    drug2: 'ondansetron',
    severity: 'moderate',
    mechanism: 'Prolongación intervalo QT',
    clinical_effect: 'Arritmias cardíacas',
    pregnancy_specific_risk: 'Arritmias maternas, compromiso fetal',
    management: 'Monitoreo EKG. Considerar alternativas.',
    alternatives: ['amoxicilina', 'metoclopramida'],
    monitoring_parameters: ['EKG', 'intervalo QT'],
    onset: 'rapid',
    documentation: 'good'
  },
  {
    drug1: 'atenolol',
    drug2: 'insulina',
    severity: 'moderate',
    mechanism: 'Enmascaramiento síntomas hipoglucemia',
    clinical_effect: 'Hipoglucemia no reconocida',
    pregnancy_specific_risk: 'Hipoglucemia materna severa',
    management: 'Monitoreo frecuente de glucosa.',
    alternatives: ['metildopa', 'monitoreo continuo glucosa'],
    monitoring_parameters: ['glucosa capilar frecuente'],
    onset: 'variable',
    documentation: 'good'
  },

  // INTERACCIONES MENORES PERO RELEVANTES EN EMBARAZO
  {
    drug1: 'paracetamol',
    drug2: 'warfarina',
    severity: 'moderate',
    mechanism: 'Potenciación efecto anticoagulante',
    clinical_effect: 'Aumento leve del riesgo de sangrado',
    pregnancy_specific_risk: 'Warfarina ya contraindicada en embarazo',
    management: 'Cambiar warfarina por heparina.',
    alternatives: ['heparina', 'acetaminofén seguro con heparina'],
    monitoring_parameters: ['INR', 'signos de sangrado'],
    onset: 'delayed',
    documentation: 'good'
  },
  {
    drug1: 'amoxicilina',
    drug2: 'metformina',
    severity: 'minor',
    mechanism: 'Alteración flora intestinal afecta absorción',
    clinical_effect: 'Posible alteración leve en control glucémico',
    pregnancy_specific_risk: 'Mínimo, ambos medicamentos seguros',
    management: 'Monitoreo rutinario de glucosa.',
    alternatives: ['continuar ambos con monitoreo'],
    monitoring_parameters: ['glucosa capilar'],
    onset: 'delayed',
    documentation: 'fair'
  },
  {
    drug1: 'cefalexina',
    drug2: 'heparina',
    severity: 'minor',
    mechanism: 'Posible potenciación anticoagulante leve',
    clinical_effect: 'Riesgo mínimamente aumentado de sangrado',
    pregnancy_specific_risk: 'Ambos seguros en embarazo',
    management: 'Monitoreo estándar.',
    alternatives: ['continuar con precaución'],
    monitoring_parameters: ['PTT', 'signos de sangrado'],
    onset: 'delayed',
    documentation: 'fair'
  },
  {
    drug1: 'ibuprofeno',
    drug2: 'enalapril',
    severity: 'major',
    mechanism: 'Reducción efecto antihipertensivo y nefrotoxicidad',
    clinical_effect: 'Hipertensión, insuficiencia renal',
    pregnancy_specific_risk: 'Ambos medicamentos problemáticos en embarazo',
    management: 'Evitar ambos. Usar paracetamol y metildopa.',
    alternatives: ['paracetamol', 'metildopa'],
    monitoring_parameters: ['presión arterial', 'función renal'],
    onset: 'rapid',
    documentation: 'excellent'
  },
  {
    drug1: 'fluconazol',
    drug2: 'warfarina',
    severity: 'major',
    mechanism: 'Inhibición CYP2C9, aumento concentración warfarina',
    clinical_effect: 'Hemorragia severa',
    pregnancy_specific_risk: 'Ambos contraindicados o problemáticos',
    management: 'Evitar combinación. Usar nistatina y heparina.',
    alternatives: ['nistatina', 'heparina'],
    monitoring_parameters: ['INR', 'signos de sangrado'],
    onset: 'rapid',
    documentation: 'excellent'
  }
];

export interface InteractionAnalysis {
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

export function analyzeInteractions(medications: string[]): InteractionAnalysis {
  if (medications.length < 2) {
    return {
      total_interactions: 0,
      severity_breakdown: {
        contraindicated: 0,
        major: 0,
        moderate: 0,
        minor: 0
      },
      high_risk_combinations: [],
      pregnancy_specific_warnings: [],
      overall_risk_score: 0,
      recommendations: ['Agregue más medicamentos para analizar interacciones']
    };
  }

  const foundInteractions: DrugInteraction[] = [];
  const medicationLower = medications.map(med => med.toLowerCase());

  // Buscar todas las combinaciones posibles
  for (let i = 0; i < medicationLower.length; i++) {
    for (let j = i + 1; j < medicationLower.length; j++) {
      const med1 = medicationLower[i];
      const med2 = medicationLower[j];

      // Buscar interacciones bidireccionales
      const interaction = drugInteractions.find(int => 
        (int.drug1.toLowerCase().includes(med1) && int.drug2.toLowerCase().includes(med2)) ||
        (int.drug1.toLowerCase().includes(med2) && int.drug2.toLowerCase().includes(med1)) ||
        (med1.includes(int.drug1.toLowerCase()) && med2.includes(int.drug2.toLowerCase())) ||
        (med2.includes(int.drug1.toLowerCase()) && med1.includes(int.drug2.toLowerCase()))
      );

      if (interaction) {
        foundInteractions.push(interaction);
      }
    }
  }

  // Calcular estadísticas
  const severityBreakdown = {
    contraindicated: foundInteractions.filter(int => int.severity === 'contraindicated').length,
    major: foundInteractions.filter(int => int.severity === 'major').length,
    moderate: foundInteractions.filter(int => int.severity === 'moderate').length,
    minor: foundInteractions.filter(int => int.severity === 'minor').length
  };

  // Calcular puntuación de riesgo
  const riskScore = 
    severityBreakdown.contraindicated * 10 +
    severityBreakdown.major * 7 +
    severityBreakdown.moderate * 4 +
    severityBreakdown.minor * 1;

  // Interacciones de alto riesgo
  const highRiskInteractions = foundInteractions.filter(int => 
    int.severity === 'contraindicated' || int.severity === 'major'
  );

  // Advertencias específicas del embarazo
  const pregnancyWarnings = foundInteractions.map(int => int.pregnancy_specific_risk);

  // Recomendaciones
  const recommendations = [];
  if (severityBreakdown.contraindicated > 0) {
    recommendations.push('🚨 URGENTE: Tiene combinaciones contraindicadas. Contacte inmediatamente a su médico.');
  }
  if (severityBreakdown.major > 0) {
    recommendations.push('⚠️ ALTO RIESGO: Requiere supervisión médica estrecha.');
  }
  if (severityBreakdown.moderate > 0) {
    recommendations.push('📋 MONITOREO: Necesario seguimiento de parámetros específicos.');
  }
  if (foundInteractions.length === 0) {
    recommendations.push('✅ No se detectaron interacciones conocidas entre estos medicamentos.');
  }

  return {
    total_interactions: foundInteractions.length,
    severity_breakdown: severityBreakdown,
    high_risk_combinations: highRiskInteractions,
    pregnancy_specific_warnings: pregnancyWarnings,
    overall_risk_score: riskScore,
    recommendations
  };
}

export function getMedicationInteractions(medication: string): DrugInteraction[] {
  const medLower = medication.toLowerCase();
  return drugInteractions.filter(int => 
    int.drug1.toLowerCase().includes(medLower) || 
    int.drug2.toLowerCase().includes(medLower) ||
    medLower.includes(int.drug1.toLowerCase()) ||
    medLower.includes(int.drug2.toLowerCase())
  );
}

export function getInteractionsByMechanism(mechanism: string): DrugInteraction[] {
  return drugInteractions.filter(int => 
    int.mechanism.toLowerCase().includes(mechanism.toLowerCase())
  );
}