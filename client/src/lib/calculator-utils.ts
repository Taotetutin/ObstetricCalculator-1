import { addDays } from "date-fns";
import type { CalculatorInput } from "@shared/schema";

export function calculateFPP(input: CalculatorInput<"fpp">) {
  // Add 280 days to last period date
  return addDays(input.lastPeriodDate, 280);
}

export function calculateIMC(input: CalculatorInput<"imc">) {
  const imc = input.weight / (input.height * input.height);
  return Number(imc.toFixed(1));
}

export function calculateGestationalAge(input: CalculatorInput<"gestationalAge">) {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - input.lastPeriodDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  return { weeks, days };
}

export function calculateLiquidoAmniotico(input: CalculatorInput<"liquidoAmniotico">) {
  const ila = input.q1 + input.q2 + input.q3 + input.q4;

  let categoria = "";
  if (ila < 5) {
    categoria = "Oligohidramnios severo";
  } else if (ila < 8) {
    categoria = "Oligohidramnios";
  } else if (ila <= 18) {
    categoria = "Normal";
  } else if (ila <= 24) {
    categoria = "Polihidramnios leve";
  } else {
    categoria = "Polihidramnios severo";
  }

  return {
    ila: Number(ila.toFixed(1)),
    categoria
  };
}