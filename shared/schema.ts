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
    auPi: z.number().min(0).max(3),     // Índice de pulsatilidad
    // Arteria cerebral media
    acmPi: z.number().min(0).max(3),    // Índice de pulsatilidad
    acmPsv: z.number().min(0).max(100), // Velocidad sistólica pico
    // Ductus venoso
    dvPi: z.number().min(0).max(3),     // Índice de pulsatilidad
    dvWave: z.enum(['normal', 'ausente', 'reversa']), // Onda a
    // Edad gestacional
    semanasGestacion: z.number().min(20).max(40),
    diasGestacion: z.number().min(0).max(6),
  }),
  weightGain: z.object({
    prePregnancyWeight: z.number().min(30).max(200),
    height: z.number().min(120).max(220),
    currentWeight: z.number().min(30).max(200),
    semanasGestacion: z.number().min(0).max(42),
    diasGestacion: z.number().min(0).max(6),
  }),
  t21Age: z.object({
    age: z.number().min(15).max(60),
  }),
  t21FirstTrimester: z.object({
    age: z.number().min(15).max(60),
    weight: z.number().min(35).max(200),
    height: z.number().min(120).max(220),
    ethnicity: z.enum(['caucasica', 'afro', 'sudasiatica', 'asiaticooriental', 'mixta']),
    diabetesType1: z.boolean(),
    smoker: z.boolean(),
    previousT21: z.boolean(),
    gestationalAge: z.number().min(11).max(13.6),
    crownRumpLength: z.number().min(45).max(84),
    nuchalTranslucency: z.number().min(0.5).max(6.5),
    nasalBone: z.boolean(),
    ductusVenosus: z.enum(['normal', 'ausente', 'reverso']),
    tricuspidFlow: z.enum(['normal', 'regurgitacion']),
    bhcg: z.number().optional(),
    pappA: z.number().optional(),
  }),
  t21SecondTrimester: z.object({
    age: z.number().min(15).max(60),
    gestationalAge: z.number().min(14).max(22),
    nasalBone: z.number().min(0).max(15),
    nuchalFold: z.number().min(0).max(10),
    nasofrontalAngle: z.number().min(0).max(180),
    prefrontalSpace: z.number().min(0).max(10),
    iliacAngle: z.number().min(0).max(180),
    ehoCordiac: z.boolean(),
    intestinalEcho: z.boolean(),
    shortFemur: z.boolean(),
    shortHumerus: z.boolean(),
    pyelectasis: z.boolean(),
    afp: z.number().optional(),
    hcg: z.number().optional(),
    ue3: z.number().optional(),
  }),
  lhr: z.object({
    // Medidas fetales
    headCircumference: z.number().min(10).max(500),  // Circunferencia cefálica en mm
    lungArea: z.number().min(1).max(1000),          // Área pulmonar en mm²
    gestationalWeeks: z.number().min(20).max(40),   // Semanas de gestación
    side: z.enum(['left', 'right']),               // Lado afectado
    method: z.enum(['2D', '3D']),                  // Método de medición
  }),
  cvr: z.object({
    // Medidas de la lesión CPAM
    length: z.number().min(1).max(100),    // Longitud en mm
    height: z.number().min(1).max(100),    // Altura en mm
    width: z.number().min(1).max(100),     // Ancho en mm
    headCircumference: z.number().min(10).max(500), // Circunferencia cefálica en mm
  }),
  tallaFetal: z.object({
    femurLength: z.number().min(10).max(120),      // Longitud del fémur en mm
    gestationalAge: z.number().min(12).max(42),    // Edad gestacional en semanas
  }),
  mefi: z.object({
    fcb: z.string(),
    variabilidad: z.string(),
    aceleraciones: z.string(),
    desaceleraciones: z.string(),
    movimientos: z.string().optional(),
    duracionRegistro: z.string().optional(),
  }),
  femurCorto: z.object({
    femurLength: z.number().min(1).max(150),      // Longitud del fémur en mm
    gestationalAge: z.number().min(12).max(42),   // Edad gestacional en semanas
    biparietal: z.number().min(1).max(150).optional(),  // Diámetro biparietal en mm (opcional)
    headCircumference: z.number().min(1).max(500).optional(), // Circunferencia cefálica en mm (opcional)
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