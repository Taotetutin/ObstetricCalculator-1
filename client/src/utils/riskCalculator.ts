import type { TrisomyRisk, RiskResult } from "../types/trisomy";

export function calculateBaseRisk(age: number): number {
  const baseRisks: Record<number, number> = {
    20: 1525,
    25: 1340,
    30: 940,
    31: 885,
    32: 725,
    33: 535,
    34: 390,
    35: 290,
    36: 225,
    37: 170,
    38: 125,
    39: 100,
    40: 75,
    41: 60,
    42: 45,
    43: 35,
    44: 25,
    45: 20,
  };

  if (age <= 20) return 1/1525;
  if (age >= 45) return 1/20;

  const ages = Object.keys(baseRisks).map(Number);
  const lowerAge = ages.filter(a => a <= age).pop() || 20;
  const upperAge = ages.find(a => a > age) || 45;

  const lowerRisk = 1/baseRisks[lowerAge];
  const upperRisk = 1/baseRisks[upperAge];

  const t = (age - lowerAge) / (upperAge - lowerAge);
  return lowerRisk + t * (upperRisk - lowerRisk);
}

export function calculateFirstTrimesterRisk(data: TrisomyRisk): RiskResult {
  let risk = calculateBaseRisk(data.age);
  const details: string[] = [`Riesgo base por edad materna (${data.age} años): 1:${Math.round(1/risk)}`];

  // Ajustes por marcadores bioquímicos
  if (data.pappa !== undefined && data.bhcg !== undefined) {
    const biochemicalMultiplier = 0.8 * (data.pappa < 0.5 ? 2 : 1) * (data.bhcg > 2 ? 1.8 : 1);
    risk *= biochemicalMultiplier;
    details.push(`Ajuste por marcadores bioquímicos: ${biochemicalMultiplier.toFixed(2)}x`);
  }

  // Ajustes por marcadores ecográficos
  if (data.nuchalTranslucency) {
    const ntMultiplier = data.nuchalTranslucency > 3 ? 3 : (data.nuchalTranslucency > 2.5 ? 2 : 1);
    risk *= ntMultiplier;
    details.push(`Ajuste por translucencia nucal (${data.nuchalTranslucency}mm): ${ntMultiplier}x`);
  }

  if (data.nasalBone === false) {
    risk *= 2.5;
    details.push('Ajuste por ausencia de hueso nasal: 2.5x');
  }

  if (data.ductusFlow === 'reversed') {
    risk *= 2;
    details.push('Ajuste por flujo reverso en ductus venoso: 2x');
  }

  if (data.tricuspidFlow === 'regurgitation') {
    risk *= 2;
    details.push('Ajuste por regurgitación tricuspídea: 2x');
  }

  // Factores adicionales
  if (data.previousT21) {
    risk *= 2.5;
    details.push('Ajuste por antecedente de T21: 2.5x');
  }

  const finalRisk = Math.round(1/risk);
  const interpretation = risk > (1/100) 
    ? "Alto Riesgo" 
    : risk > (1/1000) 
      ? "Riesgo Intermedio" 
      : "Bajo Riesgo";

  const recommendations = getRiskRecommendations(risk);

  return {
    risk,
    interpretation,
    details,
    recommendations
  };
}

export function calculateSecondTrimesterRisk(data: TrisomyRisk): RiskResult {
  let risk = calculateBaseRisk(data.age);
  const details: string[] = [`Riesgo base por edad materna (${data.age} años): 1:${Math.round(1/risk)}`];

  // Factores de ajuste específicos del segundo trimestre
  const adjustments: [boolean | undefined, number, string][] = [
    [data.nasalBone === false, 2.5, 'Ausencia de hueso nasal'],
    [data.previousT21, 2.5, 'Antecedente de T21'],
  ];

  adjustments.forEach(([condition, multiplier, description]) => {
    if (condition) {
      risk *= multiplier;
      details.push(`Ajuste por ${description}: ${multiplier}x`);
    }
  });

  const interpretation = risk > (1/100) 
    ? "Alto Riesgo" 
    : risk > (1/1000) 
      ? "Riesgo Intermedio" 
      : "Bajo Riesgo";

  const recommendations = getRiskRecommendations(risk);

  return {
    risk,
    interpretation,
    details,
    recommendations
  };
}

function getRiskRecommendations(risk: number): string[] {
  if (risk > (1/100)) {
    return [
      'Se recomienda evaluación por especialista',
      'Considerar estudio genético diagnóstico',
      'Seguimiento ecográfico detallado',
      'Evaluación cardíaca fetal especializada'
    ];
  } else if (risk > (1/1000)) {
    return [
      'Seguimiento ecográfico según protocolo',
      'Control prenatal regular',
      'Considerar evaluación adicional según otros factores de riesgo'
    ];
  }
  return [
    'Control prenatal habitual',
    'Screening ecográfico rutinario'
  ];
}
