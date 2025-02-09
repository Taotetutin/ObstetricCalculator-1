import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // API routes for calculator operations
  app.post("/api/calculations", async (req, res) => {
    try {
      const calculation = insertCalculationSchema.parse(req.body);
      const saved = await storage.saveCalculation(calculation);
      res.json(saved);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  app.get("/api/calculations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const calculation = await storage.getCalculationById(id);
    if (!calculation) {
      res.status(404).json({ error: "Calculation not found" });
      return;
    }
    res.json(calculation);
  });

  app.get("/api/calculations/type/:type", async (req, res) => {
    const calculations = await storage.getCalculationsByType(req.params.type);
    res.json(calculations);
  });

  const httpServer = createServer(app);
  return httpServer;
}