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
  }),
  pesoFetal: z.object({
    dbp: z.number().min(10).max(120),    // Rango típico en mm
    cc: z.number().min(50).max(500),     // Rango típico en mm
    ca: z.number().min(50).max(500),     // Rango típico en mm
    lf: z.number().min(10).max(120),     // Rango típico en mm
  }),
  curvaCrecimiento: z.object({
    semanasGestacion: z.number().min(20).max(42),
    pesoFetal: z.number().min(100).max(5000),
  }),
  preeclampsia: z.object({
    // Maternal characteristics
    age: z.number().min(12).max(60),
    weight: z.number().min(35).max(200),
    height: z.number().min(120).max(220), // Changed to cm
    ethnicity: z.enum(['caucasica', 'afro', 'sudasiatica', 'asiaticooriental', 'mixta']),
    familyHistory: z.boolean(),
    conceptionMethod: z.enum(['spontaneous', 'ovulation', 'ivf']),
    multiplePregnancy: z.boolean(),

    // Medical history
    chronicHypertension: z.boolean(),
    diabetesType1: z.boolean(),
    diabetesType2: z.boolean(),
    lupusAPS: z.boolean(),

    // Obstetric history
    nulliparous: z.boolean(),
    previousPreeclampsia: z.boolean(),

    // Biophysical measurements
    meanArterialPressure: z.number().min(45).max(140),
    uterinePI: z.number().min(0).max(5).optional(),
    measurementDate: z.date(),
    crownRumpLength: z.number().min(45).max(84), // CRL en mm según FMF

    // Biochemical markers (optional)
    pappA: z.number().min(0).max(10).optional(),
    plgf: z.number().min(0).max(2000).optional(),
  }),
  bishop: z.object({
    dilatacion: z.number().min(0).max(5),
    borramiento: z.number().min(0).max(5),
    consistencia: z.number().min(0).max(2),
    posicion: z.number().min(0).max(2),
    estacion: z.number().min(0).max(3),
  }),
  doppler: z.object({
    // Arteria umbilical
    auIr: z.number().min(0).max(2),     // Índice de resistencia
    auPi: z.number().min(0).max(3),     // Índice de pulsatilidad
    auSd: z.number().min(0).max(10),    // Relación sístole/diástole
    // Arteria cerebral media
    acmIr: z.number().min(0).max(2),    // Índice de resistencia
    acmPi: z.number().min(0).max(3),    // Índice de pulsatilidad
    acmPsv: z.number().min(0).max(100), // Velocidad sistólica pico
    // Ductus venoso
    dvPi: z.number().min(0).max(3),     // Índice de pulsatilidad
    dvWave: z.enum(['normal', 'ausente', 'reversa']), // Onda a
    // Edad gestacional (necesaria para percentiles)
    semanasGestacion: z.number().min(20).max(40),
  }),
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