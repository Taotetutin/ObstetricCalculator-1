import { Calculator, Baby, Scale, Droplet, LineChart, Activity, Heart, Ruler, TrendingUp, Weight, Calendar } from "lucide-react";
import { calculateFPP, calculateIMC, calculateGestationalAge, calculateLiquidoAmniotico, calculatePesoFetal } from "@/lib/calculator-utils";
import FPPCalculator from "./FPPCalculator";
import GestationalAgeCalculator from "./GestationalAgeCalculator";
import IMCCalculator from "./IMCCalculator";
import LiquidoAmnioticoCalculator from "./LiquidoAmnioticoCalculator";
import PesoFetalCalculator from "./PesoFetalCalculator";
import CurvaCrecimientoCalculator from "./CurvaCrecimientoCalculator";
import PreeclampsiaCalculator from "./PreeclampsiaCalculator";
import BishopCalculator from "./BishopCalculator";
import DopplerCalculator from "./DopplerCalculator"; // Added import statement

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
    id: "bienestar-fetal",
    name: "Bienestar Fetal",
    description: "Evaluación del bienestar fetal",
    icon: Heart,
    component: () => null
  },
  {
    id: "percentiles",
    name: "Percentiles de Crecimiento",
    description: "Calcula percentiles de crecimiento fetal",
    icon: Ruler,
    component: () => null
  },
  {
    id: "ganancia-peso",
    name: "Ganancia de Peso",
    description: "Control de ganancia de peso en embarazo",
    icon: TrendingUp,
    component: () => null
  }
];