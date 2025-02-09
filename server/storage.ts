import { calculations, type Calculation, type InsertCalculation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculationById(id: number): Promise<Calculation | undefined>;
  getCalculationsByType(type: string): Promise<Calculation[]>;
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
}

export const storage = new DatabaseStorage();