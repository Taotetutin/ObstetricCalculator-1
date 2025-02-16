import { patients, calculations, users, type Calculation, type InsertCalculation, type Patient, type InsertPatient, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Session store
  sessionStore: session.Store;

  // Existing methods
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculationById(id: number): Promise<Calculation | undefined>;
  getCalculationsByType(type: string): Promise<Calculation[]>;
  savePatient(patient: InsertPatient): Promise<Patient>;
  getPatientById(id: number): Promise<Patient | undefined>;
  getAllPatients(): Promise<Patient[]>;
  getCalculationHistory(patientId?: number, type?: string, limit?: number): Promise<Calculation[]>;
  getCalculationsForComparison(comparisonGroup: string): Promise<Calculation[]>;
  updateCalculationNotes(id: number, notes: string): Promise<Calculation>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'user_sessions'
    });
  }

  // User methods implementation
  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Existing methods remain unchanged
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

  async getCalculationHistory(
    patientId?: number,
    type?: string,
    limit: number = 50
  ): Promise<Calculation[]> {
    const conditions = [];

    if (patientId) {
      conditions.push(eq(calculations.patientId, patientId));
    }

    if (type) {
      conditions.push(eq(calculations.calculatorType, type));
    }

    const query = db
      .select()
      .from(calculations)
      .orderBy(desc(calculations.createdAt))
      .limit(limit);

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }

    return await query;
  }

  async getCalculationsForComparison(
    comparisonGroup: string
  ): Promise<Calculation[]> {
    return await db
      .select()
      .from(calculations)
      .where(eq(calculations.comparisonGroup, comparisonGroup))
      .orderBy(desc(calculations.createdAt));
  }

  async updateCalculationNotes(
    id: number,
    notes: string
  ): Promise<Calculation> {
    const [updated] = await db
      .update(calculations)
      .set({ notes })
      .where(eq(calculations.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();