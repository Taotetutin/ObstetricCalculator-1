import { patients, calculations, type Calculation, type InsertCalculation, type Patient, type InsertPatient } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculationById(id: number): Promise<Calculation | undefined>;
  getCalculationsByType(type: string): Promise<Calculation[]>;
  savePatient(patient: InsertPatient): Promise<Patient>;
  getPatientById(id: number): Promise<Patient | undefined>;
  getAllPatients(): Promise<Patient[]>;
}

export class DatabaseStorage implements IStorage {
  async saveCalculation(calculation: InsertCalculation): Promise<Calculation> {
    const [saved] = await db.insert(calculations).values(calculation).returning();
    return saved;
  }

  async getCalculationById(id: number): Promise<Calculation | undefined> {
    const [calculation] = await db.select().from(calculations).where(eq(calculations.id, id));
    return calculation;
  }

  async getCalculationsByType(type: string): Promise<Calculation[]> {
    return await db.select().from(calculations).where(eq(calculations.calculatorType, type));
  }

  async savePatient(patient: InsertPatient): Promise<Patient> {
    const [saved] = await db.insert(patients).values(patient).returning();
    return saved;
  }

  async getPatientById(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }
}

export const storage = new DatabaseStorage();