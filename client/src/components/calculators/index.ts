import { Calculator, Baby, Scale, Droplet, Stethoscope, Calendar, Heart, Activity, Weight, BarChart, Brain } from "lucide-react";
import FPPCalculator from "./FPPCalculator";
import GestationalAgeCalculator from "./GestationalAgeCalculator";
import IMCCalculator from "./IMCCalculator";
import LiquidoAmnioticoCalculator from "./LiquidoAmnioticoCalculator";
import PulmonaryPredictorCalculator from "./PulmonaryPredictorCalculator";
import BishopCalculator from "./BishopCalculator";
import CVRCalculator from "./CVRCalculator";
import CurvaCrecimientoCalculator from "./CurvaCrecimientoCalculator";
import DopplerCalculator from "./DopplerCalculator";
import LHRCalculator from "./LHRCalculator";
import PesoFetalCalculator from "./PesoFetalCalculator";
import PreeclampsiaCalculator from "./PreeclampsiaCalculator";
import T21Calculator from "./T21Calculator";
import TallaFetalCalculator from "./TallaFetalCalculator";
import WeightGainCalculator from "./WeightGainCalculator";

export const calculators = [
  {
    id: "fpp",
    name: "Fecha Probable de Parto",
    description: "Calcula la fecha probable de parto basada en la última menstruación",
    icon: Calendar,
    component: FPPCalculator
  },
  {
    id: "edad-gestacional",
    name: "Edad Gestacional",
    description: "Determina la edad gestacional actual",
    icon: Baby,
    component: GestationalAgeCalculator
  },
  {
    id: "imc",
    name: "Índice de Masa Corporal",
    description: "Calcula el IMC materno",
    icon: Scale,
    component: IMCCalculator
  },
  {
    id: "liquido-amniotico",
    name: "Líquido Amniótico",
    description: "Evalúa el índice de líquido amniótico",
    icon: Droplet,
    component: LiquidoAmnioticoCalculator
  },
  {
    id: "pulmonary-predictor",
    name: "Predictor Pulmonar",
    description: "Evaluación de patologías pulmonares fetales (LHR y CVR)",
    icon: Stethoscope,
    component: PulmonaryPredictorCalculator
  },
  {
    id: "bishop",
    name: "Bishop Score",
    description: "Evaluación del índice de Bishop",
    icon: BarChart,
    component: BishopCalculator
  },
  {
    id: "cvr",
    name: "CVR",
    description: "Cálculo del ratio cerebro-volumen",
    icon: Brain,
    component: CVRCalculator
  },
  {
    id: "curva-crecimiento",
    name: "Curva de Crecimiento",
    description: "Seguimiento del crecimiento fetal",
    icon: Activity,
    component: CurvaCrecimientoCalculator
  },
  {
    id: "doppler",
    name: "Doppler Fetal",
    description: "Evaluación de flujos Doppler fetales",
    icon: Heart,
    component: DopplerCalculator
  },
  {
    id: "lhr",
    name: "LHR",
    description: "Cálculo del ratio pulmón-cabeza",
    icon: Stethoscope,
    component: LHRCalculator
  },
  {
    id: "peso-fetal",
    name: "Peso Fetal",
    description: "Estimación del peso fetal",
    icon: Weight,
    component: PesoFetalCalculator
  },
  {
    id: "preeclampsia",
    name: "Riesgo de Preeclampsia",
    description: "Evaluación del riesgo de preeclampsia",
    icon: Activity,
    component: PreeclampsiaCalculator
  },
  {
    id: "t21",
    name: "Riesgo de T21",
    description: "Cálculo del riesgo de trisomía 21",
    icon: Calculator,
    component: T21Calculator
  },
  {
    id: "talla-fetal",
    name: "Talla Fetal",
    description: "Estimación de la talla fetal",
    icon: Scale,
    component: TallaFetalCalculator
  },
  {
    id: "weight-gain",
    name: "Ganancia de Peso",
    description: "Control de ganancia de peso durante el embarazo",
    icon: Weight,
    component: WeightGainCalculator
  }
];