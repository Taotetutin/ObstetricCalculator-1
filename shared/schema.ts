import { pgTable, text, serial, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

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
    lastPeriodDate: z.date().optional(),
    ultrasoundDate: z.date(),
    crownRumpLength: z.number().min(10).max(100).optional(),
    dbp: z.number().min(10).max(120).optional(),
    femurLength: z.number().min(10).max(120).optional(),
    abdominalCircumference: z.number().min(50).max(500).optional(),
  }),
  liquidoAmniotico: z.object({
    q1: z.number().min(0).max(25),
    q2: z.number().min(0).max(25),
    q3: z.number().min(0).max(25),
    q4: z.number().min(0).max(25),
  }),
  pesoFetal: z.object({
    dbp: z.number().min(10).max(120),    
    cc: z.number().min(50).max(500),     
    ca: z.number().min(50).max(500),     
    lf: z.number().min(10).max(120),     
  }),
  curvaCrecimiento: z.object({
    semanasGestacion: z.number().min(20).max(42),
    pesoFetal: z.number().min(100).max(5000),
  }),
  preeclampsia: z.object({
    age: z.number().min(12).max(60),
    weight: z.number().min(35).max(200),
    height: z.number().min(120).max(220), 
    ethnicity: z.enum(['caucasica', 'afro', 'sudasiatica', 'asiaticooriental', 'mixta']),
    familyHistory: z.boolean(),
    conceptionMethod: z.enum(['spontaneous', 'ovulation', 'ivf']),
    multiplePregnancy: z.boolean(),
    chronicHypertension: z.boolean(),
    diabetesType1: z.boolean(),
    diabetesType2: z.boolean(),
    lupusAPS: z.boolean(),
    nulliparous: z.boolean(),
    previousPreeclampsia: z.boolean(),
    meanArterialPressure: z.number().min(45).max(140),
    uterinePI: z.number().min(0).max(5).optional(),
    measurementDate: z.date(),
    crownRumpLength: z.number().min(45).max(84), 
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
    auPi: z.number().min(0).max(3),     
    acmPi: z.number().min(0).max(3),    
    acmPsv: z.number().min(0).max(100), 
    dvPi: z.number().min(0).max(3),     
    dvWave: z.enum(['normal', 'ausente', 'reversa']), 
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
    headCircumference: z.number().min(10).max(500),  
    lungArea: z.number().min(1).max(1000),          
    gestationalWeeks: z.number().min(20).max(40),   
    side: z.enum(['left', 'right']),               
    method: z.enum(['2D', '3D']),                  
  }),
  cvr: z.object({
    length: z.number().min(1).max(100),    
    height: z.number().min(1).max(100),    
    width: z.number().min(1).max(100),     
    headCircumference: z.number().min(10).max(500), 
  }),
  tallaFetal: z.object({
    femurLength: z.number().min(10).max(120),      
    gestationalAge: z.number().min(12).max(42),    
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
    femurLength: z.number().min(1).max(150),      
    semanasGestacion: z.number().min(12).max(42),   
    diasGestacion: z.number().min(0).max(6),      
    biparietal: z.number().min(1).max(150).optional(),  
    headCircumference: z.number().min(1).max(500).optional(), 
  }),
  huesoNasal: z.object({
    huesoNasalLength: z.number().min(0).max(20),    
    semanasGestacion: z.number().min(11).max(14),   
    diasGestacion: z.number().min(0).max(6),        
    dbp: z.number().min(0).max(100),                
    moms: z.number().min(0).max(10),                
  }),
  pr: z.object({
    prInterval: z.number().min(0).max(500),    
    semanasGestacion: z.number().min(16).max(40),   
    diasGestacion: z.number().min(0).max(6),        
    avInterval: z.number().min(0).max(500),         
    ductusVenosus: z.number().min(0).max(500),      
  }),
};

// Database tables
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  identification: text("identification").notNull(),
  lastPeriodDate: date("last_period_date").notNull(),
  dueDate: date("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gestationalDates = pgTable("gestational_dates", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  dateType: text("date_type").notNull(), // 'screening_1t', 'screening_2t', etc.
  dateValue: date("date_value").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  calculatorType: text("calculator_type").notNull(),
  input: text("input").notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  patientId: integer("patient_id"),  
});

// After defining the tables, add the foreign key reference
export const calculationsRelations = {
  patient: {
    type: "many-to-one",
    schema: "public",
    columns: [calculations.patientId],
    referencedTable: patients,
    referencedColumns: [patients.id],
  },
};

export const gestationalDatesRelations = {
  patient: {
    type: "many-to-one",
    schema: "public",
    columns: [gestationalDates.patientId],
    referencedTable: patients,
    referencedColumns: [patients.id],
  },
};

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true
});

export const insertGestationalDateSchema = createInsertSchema(gestationalDates).omit({
  id: true,
  createdAt: true,
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type GestationalDate = typeof gestationalDates.$inferSelect;
export type InsertGestationalDate = z.infer<typeof insertGestationalDateSchema>;