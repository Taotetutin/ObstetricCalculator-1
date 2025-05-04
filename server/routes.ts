import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationSchema, insertPatientSchema, calculatorTypes } from "@shared/schema";
import { desc } from "drizzle-orm";

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

  // API routes for patient operations
  app.post("/api/patients", async (req, res) => {
    try {
      const patient = insertPatientSchema.parse(req.body);
      const saved = await storage.savePatient(patient);
      res.json(saved);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const patient = await storage.getPatientById(id);
    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    res.json(patient);
  });

  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Nueva ruta para el análisis MEFI con CTG
  app.post("/api/mefi/analyze", async (req, res) => {
    try {
      const mefiInput = calculatorTypes.mefi.parse(req.body);
      const analysis = await storage.analyzeMefiWithCtgData(mefiInput);
      res.json(analysis);
    } catch (error) {
      console.error("Error in MEFI CTG analysis:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  // Endpoint para la búsqueda de medicamentos con Gemini
  app.post("/integrations/google-gemini-1-5/", async (req, res) => {
    try {
      const { messages, stream } = req.body;
      const query = messages[0].content;
      
      // Configuramos respuesta para streaming
      res.setHeader('Content-Type', 'text/plain');
      
      // Información para la respuesta simulada
      const response = `Categoría FDA: B
Descripción: La categoría B indica que los estudios en animales no han demostrado riesgo para el feto, pero no hay estudios adecuados en mujeres embarazadas.
Riesgos: Posibles efectos secundarios maternos como náuseas, vómitos o somnolencia.
Recomendaciones: Considerar el uso solo si el beneficio potencial justifica el riesgo potencial para el feto. Consultar siempre con el médico antes de utilizar.`;

      // Si se solicita stream, enviamos progresivamente
      if (stream) {
        const lines = response.split('\n');
        for (let i = 0; i < lines.length; i++) {
          res.write(lines[i] + '\n');
          if (i < lines.length - 1) {
            // Pequeña pausa entre líneas
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
        res.end();
      } else {
        // Sin streaming, enviamos respuesta completa
        res.send(response);
      }
    } catch (error) {
      console.error("Error en la búsqueda de medicamentos:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}