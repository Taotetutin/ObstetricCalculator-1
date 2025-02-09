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
  // Implementation of gestational age calculation
  // Returns weeks and days
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - input.lastPeriodDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  
  return { weeks, days };
}
