import { RiskResult } from '@/types/trisomy';

const baseAgeRisk = (age: number): number => {
  const baseRisk = Math.exp(-0.1 * (age - 35));
  return 1 / (290 * baseRisk);
};

export const calculateAgeBasedRisk = (age: number, previousT21: boolean): number => {
  let risk = baseAgeRisk(age);
  if (previousT21) risk *= 2.5;
  return risk;
};

export const calculateBaselineRisk = (age: number): number => {
  return baseAgeRisk(age);
};

export const calculateFirstTrimesterRisk = (data: {
  maternalAge: number;
  previousT21: boolean;
  crl: number;
  heartRate: number;
  nuchalTranslucency: number;
  nasalBone: 'normal' | 'absent' | 'hypoplastic';
  tricuspidRegurgitation: 'normal' | 'abnormal';
  ductusVenosus: 'normal' | 'abnormal';
  pappA: number;
  freeBetaHCG: number;
  lhrNuchalTranslucency: number;
  lhrDuctusVenosus: number;
  lhrTricuspidFlow: number;
}): number => {
  let risk = baseAgeRisk(data.maternalAge);

  // Ajustar por historia previa
  if (data.previousT21) risk *= 2.5;

  // Ajustar por marcadores bioquímicos
  if (data.pappA < 0.4) risk *= 3;
  if (data.freeBetaHCG > 2.5) risk *= 2;

  // Ajustar por marcadores ecográficos
  if (data.nuchalTranslucency > 3) risk *= 5;
  if (data.nasalBone === 'absent') risk *= 3;
  if (data.tricuspidRegurgitation === 'abnormal') risk *= 2;
  if (data.ductusVenosus === 'abnormal') risk *= 2;

  // Ajustar por LHR
  if (data.lhrNuchalTranslucency > 1.5) risk *= 2;
  if (data.lhrDuctusVenosus > 1.5) risk *= 2;
  if (data.lhrTricuspidFlow > 1.5) risk *= 2;

  return risk;
};

export const calculateSecondTrimesterRisk = (data: {
  baselineRisk: number;
  previousT21: boolean;
  nasalBone: string;
  cardiacFocus: string;
  ventriculomegaly: string;
  nuchalFold: string;
  shortFemur: string;
  aberrantSubclavian: string;
  hyperechogenicBowel: string;
  pyelectasis: string;
}): number => {
  let risk = 1 / data.baselineRisk;

  // Ajustar por historia previa
  if (data.previousT21) risk *= 2.5;

  // Ajustar por hallazgos ecográficos
  if (data.nasalBone === 'absent') risk *= 2.5;
  if (data.cardiacFocus === 'present') risk *= 2;
  if (data.ventriculomegaly === 'present') risk *= 2.5;
  if (data.nuchalFold === 'increased') risk *= 3;
  if (data.shortFemur === 'short') risk *= 2.2;
  if (data.aberrantSubclavian === 'present') risk *= 2;
  if (data.hyperechogenicBowel === 'present') risk *= 2.5;
  if (data.pyelectasis === 'present') risk *= 1.8;

  return risk;
};

export const interpretRisk = (risk: number): RiskResult => {
  const interpretation = risk > (1/100) 
    ? "Alto Riesgo" 
    : risk > (1/1000) 
      ? "Riesgo Intermedio" 
      : "Bajo Riesgo";

  const details = [];
  if (risk > (1/100)) {
    details.push("Se recomienda evaluación genética");
    details.push("Considerar amniocentesis o biopsia de vellosidades coriónicas");
  } else if (risk > (1/1000)) {
    details.push("Se sugiere seguimiento ecográfico detallado");
    details.push("Considerar screening adicional");
  } else {
    details.push("Continuar control prenatal de rutina");
  }

  return {
    risk,
    interpretation,
    details,
    recommendations: []
  };
};