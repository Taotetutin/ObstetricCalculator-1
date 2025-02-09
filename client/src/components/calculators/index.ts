import { Calculator, Baby, Scale, Droplet, LineChart, Activity, Heart, Ruler, TrendingUp, Weight, Calendar, Dna, Stethoscope } from "lucide-react";
import FPPCalculator from "./FPPCalculator";
import GestationalAgeCalculator from "./GestationalAgeCalculator";
import IMCCalculator from "./IMCCalculator";
import LiquidoAmnioticoCalculator from "./LiquidoAmnioticoCalculator";
import PesoFetalCalculator from "./PesoFetalCalculator";
import CurvaCrecimientoCalculator from "./CurvaCrecimientoCalculator";
import PreeclampsiaCalculator from "./PreeclampsiaCalculator";
import BishopCalculator from "./BishopCalculator";
import DopplerCalculator from "./DopplerCalculator";
import WeightGainCalculator from "./WeightGainCalculator";
import T21Calculator from "./T21Calculator";
import TallaFetalCalculator from "./TallaFetalCalculator";
import PulmonaryPredictorCalculator from "./PulmonaryPredictorCalculator";

// Debug logs para verificar importaciones
console.log("Verificando importaciones de calculadoras:");
console.log("FPP Calculator:", !!FPPCalculator);
console.log("Gestational Age Calculator:", !!GestationalAgeCalculator);
console.log("IMC Calculator:", !!IMCCalculator);
console.log("Liquido Amniotico Calculator:", !!LiquidoAmnioticoCalculator);
console.log("Peso Fetal Calculator:", !!PesoFetalCalculator);
console.log("Curva Crecimiento Calculator:", !!CurvaCrecimientoCalculator);
console.log("Preeclampsia Calculator:", !!PreeclampsiaCalculator);
console.log("Bishop Calculator:", !!BishopCalculator);
console.log("Doppler Calculator:", !!DopplerCalculator);
console.log("Weight Gain Calculator:", !!WeightGainCalculator);
console.log("T21 Calculator:", !!T21Calculator);
console.log("Talla Fetal Calculator:", !!TallaFetalCalculator);
console.log("Pulmonary Predictor Calculator:", !!PulmonaryPredictorCalculator);

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
    id: "peso-fetal",
    name: "Peso Fetal Estimado",
    description: "Estima el peso fetal según medidas ecográficas",
    icon: Weight,
    component: PesoFetalCalculator
  },
  {
    id: "talla-fetal",
    name: "Talla Fetal",
    description: "Calcula la talla fetal basada en la longitud del fémur",
    icon: Ruler,
    component: TallaFetalCalculator
  },
  {
    id: "curva-crecimiento",
    name: "Curva de Crecimiento",
    description: "Seguimiento del crecimiento fetal",
    icon: LineChart,
    component: CurvaCrecimientoCalculator
  },
  {
    id: "preeclampsia",
    name: "Riesgo de Preeclampsia",
    description: "Evalúa el riesgo de preeclampsia",
    icon: Activity,
    component: PreeclampsiaCalculator
  },
  {
    id: "bishop",
    name: "Test de Bishop",
    description: "Evalúa las condiciones cervicales",
    icon: Calculator,
    component: BishopCalculator
  },
  {
    id: "doppler",
    name: "Doppler Fetal",
    description: "Análisis de flujos Doppler fetales",
    icon: Heart,
    component: DopplerCalculator
  },
  {
    id: "ganancia-peso",
    name: "Ganancia de Peso",
    description: "Control de ganancia de peso en embarazo",
    icon: TrendingUp,
    component: WeightGainCalculator
  },
  {
    id: "t21",
    name: "Riesgo de T21",
    description: "Calcula el riesgo de trisomía 21",
    icon: Dna,
    component: T21Calculator
  },
  {
    id: "pulmonary-predictor",
    name: "Predictor Pulmonar",
    description: "Evaluación de patologías pulmonares fetales (LHR y CVR)",
    icon: Stethoscope,
    component: PulmonaryPredictorCalculator
  }
];

// Debug log para verificar el array de calculadoras
console.log("Número total de calculadoras:", calculators.length);
console.log("IDs de calculadoras disponibles:", calculators.map(calc => calc.id));