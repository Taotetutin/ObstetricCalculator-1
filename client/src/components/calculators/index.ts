import {
  Calculator,
  Baby,
  Scale,
  Droplet,
  Stethoscope,
  Calendar,
  Heart,
  Activity,
  Weight,
  BarChart,
  Pill
} from "lucide-react";

import GestationalAgeCalculator from "./GestationalAgeCalculator";
import FPPCalculator from "./FPPCalculator";
import IMCCalculator from "./IMCCalculator";
import LiquidoAmnioticoCalculator from "./LiquidoAmnioticoCalculator";
import BishopCalculator from "./BishopCalculator";
import CurvaCrecimientoCalculator from "./CurvaCrecimientoCalculator";
import DopplerCalculator from "./DopplerCalculator";
import PesoFetalCalculator from "./PesoFetalCalculator";
import PreeclampsiaCalculator from "./PreeclampsiaCalculator";
import T21Calculator from "./T21Calculator";
import TallaFetalCalculator from "./TallaFetalCalculator";
import WeightGainCalculator from "./WeightGainCalculator";
import PartoPrematuroCalculator from "./PartoPrematuroCalculator";
import MEFICalculator from "./MEFICalculator";
import FemurCortoCalculator from "./FemurCortoCalculator";
import HuesoNasalCalculator from "./HuesoNasalCalculator";
import PRCalculator from "./PRCalculator";
import RiesgoNeonatalCalculator from "./RiesgoNeonatalCalculator";
import ColestasisCalculator from "./colestasis-app/ColestasisCalculator";
import PercentilOMSCalculator from "./percentil-oms-app/PercentilOMSCalculator";
import PulmonaryPredictorCalculator from "./PulmonaryPredictorCalculator";

export const calculators = [
  {
    id: "calculadora-gestacional",
    name: "Calculadora Gestacional",
    description: "Calculadora completa de edad gestacional con registro de pacientes",
    icon: Baby,
    component: GestationalAgeCalculator,
  },
  {
    id: "fpp",
    name: "Fecha Probable de Parto",
    description: "Calcula la fecha probable de parto basada en la última menstruación",
    icon: Calendar,
    component: FPPCalculator,
  },
  {
    id: "imc",
    name: "Índice de Masa Corporal",
    description: "Calcula el IMC materno",
    icon: Scale,
    component: IMCCalculator,
  },
  {
    id: "liquido-amniotico",
    name: "Líquido Amniótico",
    description: "Evalúa el índice de líquido amniótico",
    icon: Droplet,
    component: LiquidoAmnioticoCalculator,
  },
  {
    id: "pulmonary-predictor",
    name: "Disfunción Pulmonar",
    description: "Evaluación integral de patologías pulmonares fetales",
    icon: Stethoscope,
    component: PulmonaryPredictorCalculator,
  },
  {
    id: "bishop",
    name: "Bishop Score",
    description: "Evaluación del índice de Bishop",
    icon: BarChart,
    component: BishopCalculator,
  },
  {
    id: "curva-crecimiento",
    name: "Curva de Crecimiento",
    description: "Seguimiento del crecimiento fetal",
    icon: Activity,
    component: CurvaCrecimientoCalculator,
  },
  {
    id: "doppler",
    name: "Doppler Fetal",
    description: "Evaluación de flujos Doppler fetales",
    icon: Heart,
    component: DopplerCalculator,
  },
  {
    id: "peso-fetal",
    name: "Peso Fetal",
    description: "Estimación del peso fetal",
    icon: Weight,
    component: PesoFetalCalculator,
  },
  {
    id: "talla-fetal",
    name: "Talla Fetal",
    description: "Estimación de la talla fetal",
    icon: Scale,
    component: TallaFetalCalculator,
  },
  {
    id: "parto-prematuro",
    name: "Riesgo de Parto Prematuro",
    description: "Evaluación del riesgo de parto prematuro",
    icon: Baby,
    component: PartoPrematuroCalculator,
  },
  {
    id: "preeclampsia",
    name: "Riesgo de Preeclampsia",
    description: "Evaluación del riesgo de preeclampsia",
    icon: Activity,
    component: PreeclampsiaCalculator,
  },
  {
    id: "t21",
    name: "Riesgo de T21",
    description: "Cálculo del riesgo de trisomía 21",
    icon: Calculator,
    component: T21Calculator,
  },
  {
    id: "weight-gain",
    name: "Ganancia de Peso",
    description: "Control de ganancia de peso durante el embarazo",
    icon: Weight,
    component: WeightGainCalculator,
  },
  {
    id: "mefi",
    name: "Monitoreo Fetal Intraparto",
    description: "Evaluación del registro cardiotocográfico intraparto",
    icon: Activity,
    component: MEFICalculator,
  },
  {
    id: "femur-corto",
    name: "Evaluación de Fémur Corto",
    description: "Análisis de la longitud del fémur fetal y sus percentiles",
    icon: Scale,
    component: FemurCortoCalculator,
  },
  {
    id: "hueso-nasal",
    name: "Evaluación del Hueso Nasal",
    description: "Análisis del hueso nasal fetal y sus implicaciones",
    icon: Scale,
    component: HuesoNasalCalculator,
  },
  {
    id: "pr",
    name: "Intervalo PR Fetal",
    description: "Evaluación del intervalo PR y conducción cardíaca fetal",
    icon: Heart,
    component: PRCalculator,
  },
  {
    id: "riesgo-neonatal",
    name: "Riesgo Neonatal",
    description: "Evaluación de riesgos neonatales basados en edad gestacional",
    icon: Baby,
    component: RiesgoNeonatalCalculator,
  },
  {
    id: "colestasis",
    name: "Riesgo Fetal en Colestasis",
    description: "Evaluación del riesgo en colestasis intrahepática del embarazo",
    icon: Pill,
    component: ColestasisCalculator,
  },
  {
    id: "percentil-oms",
    name: "Percentiles OMS",
    description: "Cálculo de percentiles según estándares de la OMS",
    icon: Scale,
    component: PercentilOMSCalculator,
  },
];