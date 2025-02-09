import { pgTable, text, serial, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base types for calculator inputs/outputs
export const calculatorTypes = {
  fpp: z.object({
    lastPeriodDate: z.date(),
  }),
  imc: z.object({
    weight: z.number().min(30).max(200),
    height: z.number().min(1.0).max(2.5)
  }),
  gestationalAge: z.object({
    lastPeriodDate: z.date(),
    ultrasoundDate: z.date().optional(),
    crownRumpLength: z.number().optional(),
  }),
  // Add more calculator schemas as needed
} as const;

// Type helpers
export type CalculatorInput<T extends keyof typeof calculatorTypes> = z.infer<typeof calculatorTypes[T]>;
