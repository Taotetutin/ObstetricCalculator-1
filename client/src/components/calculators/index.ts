import { Calculator, Baby, Scale, Droplet, Stethoscope, Calendar } from "lucide-react";
import FPPCalculator from "./FPPCalculator";
import GestationalAgeCalculator from "./GestationalAgeCalculator";
import IMCCalculator from "./IMCCalculator";
import LiquidoAmnioticoCalculator from "./LiquidoAmnioticoCalculator";
import PulmonaryPredictorCalculator from "./PulmonaryPredictorCalculator";

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
  }
];