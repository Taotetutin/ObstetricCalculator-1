import { pgTable, text, serial, date, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Calculator input/output types
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
  liquidoAmniotico: z.object({
    q1: z.number().min(0).max(25),
    q2: z.number().min(0).max(25),
    q3: z.number().min(0).max(25),
    q4: z.number().min(0).max(25),
  })
} as const;

// Type helpers
export type CalculatorInput<T extends keyof typeof calculatorTypes> = z.infer<typeof calculatorTypes[T]>;

// Database tables
export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  calculatorType: text("calculator_type").notNull(),
  input: text("input").notNull(), // JSON string of inputs
  result: text("result").notNull(), // JSON string of results
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({ 
  id: true, 
  createdAt: true 
});

export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;