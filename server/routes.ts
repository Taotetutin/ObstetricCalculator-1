import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationSchema, insertPatientSchema, calculatorTypes } from "@shared/schema";
import { desc } from "drizzle-orm";
import axios from 'axios';
import { searchEssentialMedication } from './data/essential-medications';

// Function to extract pregnancy category from FDA data
function extractPregnancyCategory(result: any): string {
  // Search for pregnancy category in multiple fields
  const searchFields = [
    result.pregnancy?.[0],
    result.use_in_specific_populations?.[0], 
    result.warnings?.[0],
    result.contraindications?.[0],
    result.precautions?.[0]
  ];

  for (const field of searchFields) {
    if (!field) continue;
    
    const text = field.toLowerCase();
    
    // Look for explicit FDA pregnancy categories
    if (text.includes('pregnancy category a') || text.includes('category a')) return 'Categoría A';
    if (text.includes('pregnancy category b') || text.includes('category b')) return 'Categoría B';
    if (text.includes('pregnancy category c') || text.includes('category c')) return 'Categoría C';
    if (text.includes('pregnancy category d') || text.includes('category d')) return 'Categoría D';
    if (text.includes('pregnancy category x') || text.includes('category x')) return 'Categoría X';
    
    // Look for contraindication patterns
    if (text.includes('contraindicated in pregnancy') || 
        text.includes('should not be used in pregnancy') ||
        text.includes('avoid during pregnancy')) {
      return 'Categoría D/X';
    }
    
    // Look for caution patterns
    if (text.includes('use only if potential benefit justifies') ||
        text.includes('should be used during pregnancy only if')) {
      return 'Categoría C';
    }
  }
  
  return 'No especificada';
}

export function registerRoutes(app: Express): Server {
  
  // FDA Drug Search API - Acceso completo a base de datos oficial
  app.get('/api/medications/fda-search/:term', async (req, res) => {
    try {
      const { term } = req.params;
      const { limit = 10 } = req.query;
      
      if (!term) {
        return res.status(400).json({ error: 'Término de búsqueda requerido' });
      }

      const searchTerm = term.toLowerCase().trim();
      console.log(`Buscando en FDA: ${searchTerm}`);

      const baseUrl = 'https://api.fda.gov/drug/label.json';
      
      // Búsquedas múltiples para maximizar resultados
      const searchQueries = [
        `generic_name:"${searchTerm}"`,
        `brand_name:"${searchTerm}"`,
        `active_ingredient:"${searchTerm}"`,
        `substance_name:"${searchTerm}"`,
        `openfda.generic_name:"${searchTerm}"`,
        `openfda.brand_name:"${searchTerm}"`,
        `openfda.substance_name:"${searchTerm}"`
      ];

      let allResults: any[] = [];
      
      // Optimized search strategy - prioritize most reliable queries first
      const prioritizedQueries = [
        `openfda.generic_name:"${searchTerm}"`,
        `openfda.brand_name:"${searchTerm}"`,
        `generic_name:"${searchTerm}"`,
        `brand_name:"${searchTerm}"`
      ];

      for (const query of prioritizedQueries) {
        try {
          const url = `${baseUrl}?search=${encodeURIComponent(query)}&limit=${limit}`;
          console.log(`Consultando FDA: ${query}`);
          const response = await axios.get(url, { 
            timeout: 15000,
            headers: {
              'User-Agent': 'ObsteriXLegend/1.0'
            }
          });
          
          if (response.data.results && response.data.results.length > 0) {
            allResults = allResults.concat(response.data.results);
            console.log(`✓ ${response.data.results.length} resultados de: ${query}`);
            break; // Exit after first successful query to avoid duplicates
          }
        } catch (error) {
          console.log(`⚠ Query sin resultados: ${query}`);
          continue;
        }
      }

      // Eliminar duplicados y procesar resultados
      const uniqueResults = [];
      const seenIds = new Set();
      
      for (const result of allResults) {
        const id = result.id || `${result.openfda?.brand_name?.[0] || ''}-${result.openfda?.generic_name?.[0] || ''}`;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          
          // Extraer categoría de embarazo
          const pregnancyCategory = extractPregnancyCategory(result);
          
          uniqueResults.push({
            id: result.id,
            generic_name: result.openfda?.generic_name?.[0] || 'No disponible',
            brand_name: result.openfda?.brand_name?.[0] || 'No disponible',
            manufacturer: result.openfda?.manufacturer_name?.[0] || 'No disponible',
            dosage_form: result.openfda?.dosage_form?.[0] || 'No disponible',
            route: result.openfda?.route?.[0] || 'No disponible',
            pregnancy_category: pregnancyCategory,
            warnings: result.warnings?.[0] || 'No disponible',
            contraindications: result.contraindications?.[0] || 'No disponible',
            adverse_reactions: result.adverse_reactions?.[0] || 'No disponible',
            pregnancy_info: result.pregnancy?.[0] || result.use_in_specific_populations?.[0] || 'No disponible'
          });
        }
      }

      return res.json({
        medications: uniqueResults,
        total: uniqueResults.length,
        search_term: searchTerm,
        source: 'FDA Official Database'
      });

    } catch (error) {
      console.error('Error buscando en FDA:', error);
      return res.status(500).json({ 
        error: 'Error consultando base de datos FDA',
        medications: [],
        total: 0
      });
    }
  });

  // Rutas de medicamentos integradas directamente
  app.post('/api/medications/gemini', async (req, res) => {
    try {
      const { term } = req.body;
      
      if (!term) {
        return res.status(400).json({ error: 'Término de búsqueda requerido' });
      }

      const searchTerm = term.toLowerCase().trim();
      console.log(`Buscando medicamento: ${searchTerm}`);
      
      // PASO 1: Consultar FDA oficial primero
      try {
        const fdaUrl = `http://localhost:5000/api/medications/fda-search/${encodeURIComponent(searchTerm)}?limit=5`;
        const fdaResponse = await axios.get(fdaUrl, { timeout: 15000 });
        
        if (fdaResponse.data.medications && fdaResponse.data.medications.length > 0) {
          const fdaMed = fdaResponse.data.medications[0];
          console.log(`✓ Encontrado en FDA oficial: ${searchTerm}`);
          
          return res.json({
            source: 'FDA',
            name: fdaMed.generic_name,
            categoria: fdaMed.pregnancy_category || 'Consultar fuentes oficiales',
            descripcion: `${fdaMed.generic_name} (${fdaMed.brand_name}) - ${fdaMed.dosage_form}`,
            riesgos: fdaMed.pregnancy_info,
            recomendaciones: fdaMed.warnings,
            contraindications: fdaMed.contraindications,
            adverse_reactions: fdaMed.adverse_reactions,
            manufacturer: fdaMed.manufacturer,
            route: fdaMed.route,
            sections: {
              categoria: fdaMed.pregnancy_category || 'Consultar fuentes oficiales',
              descripcion: `${fdaMed.generic_name} (${fdaMed.brand_name}) - ${fdaMed.dosage_form}`,
              riesgos: fdaMed.pregnancy_info,
              recomendaciones: fdaMed.warnings
            },
            medicationName: searchTerm
          });
        }
      } catch (error) {
        console.log('FDA no disponible, continuando con otras fuentes');
      }
      
      // PASO 2: Base de datos local para medicamentos críticos
      const essentialResult = searchEssentialMedication(searchTerm);
      if (essentialResult) {
        console.log(`✓ Encontrado en base esencial: ${searchTerm}`);
        return res.json({
          source: 'essential',
          name: searchTerm,
          categoria: essentialResult.categoria,
          descripcion: essentialResult.descripcion,
          riesgos: essentialResult.riesgos,
          recomendaciones: essentialResult.recomendaciones,
          sections: {
            categoria: essentialResult.categoria,
            descripcion: essentialResult.descripcion,
            riesgos: essentialResult.riesgos,
            recomendaciones: essentialResult.recomendaciones
          },
          medicationName: searchTerm
        });
      }

      // PASO 2: Consultar Gemini API solo si no está en base esencial
      console.log(`🔍 Consultando Gemini API para: ${searchTerm}`);
      
      if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️ Clave API de Gemini no configurada');
        return res.status(500).json({ error: 'API no disponible' });
      }

      // Consultar Gemini API para información completa
      try {
        const prompt = `Actúa como un experto farmacéutico especializado en farmacología del embarazo con acceso a la base de datos oficial de la FDA. Proporciona información PRECISA sobre el medicamento "${term}" durante el embarazo. 

IMPORTANTE: Usa las categorías FDA EXACTAS:
- Categoría A: Estudios controlados en mujeres no muestran riesgo
- Categoría B: Estudios en animales no muestran riesgo O estudios controlados en embarazadas no muestran riesgo
- Categoría C: Estudios en animales muestran efectos adversos O no hay estudios adecuados
- Categoría D: Evidencia de riesgo fetal humano pero beneficios pueden justificar el uso
- Categoría X: Contraindicado - riesgo fetal supera cualquier beneficio

IMPORTANTE: Para medicamentos durante embarazo, usa ÚNICAMENTE categorías FDA verificadas:
- Furosemida: Categoría C (verificada)
- Fluoxetina: Categoría B (verificada) 
- Gentamicina: Categoría C (verificada)
- Clindamicina: Categoría B (verificada)

Si no estás seguro de la categoría exacta, indica "Consultar fuentes oficiales FDA" en lugar de adivinar.

Responde ÚNICAMENTE en español con este formato exacto:

Categoría FDA: [usar SOLO A, B, C, D, o X]
Descripción: [descripción detallada del medicamento y su mecanismo de acción]
Riesgos: [lista detallada de riesgos potenciales durante el embarazo]
Recomendaciones: [recomendaciones específicas para uso durante embarazo]

Si el medicamento no existe, responde: "MEDICAMENTO_NO_ENCONTRADO"`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const response = await axios.post(apiUrl, {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000
        });

        const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (result && !result.includes('MEDICAMENTO_NO_ENCONTRADO')) {
          console.log(`✅ Información obtenida de Gemini para: ${searchTerm}`);
          
          // Parsear la respuesta estructurada
          const lines = result.split('\n').filter((line: string) => line.trim());
          let categoria = 'No especificada';
          let descripcion = 'Información no disponible';
          let riesgos = 'Consulte con su médico';
          let recomendaciones = 'Consulte con su médico';
          
          for (const line of lines) {
            if (line.includes('Categoría FDA:')) {
              categoria = line.replace('Categoría FDA:', '').trim();
            } else if (line.includes('Descripción:')) {
              descripcion = line.replace('Descripción:', '').trim();
            } else if (line.includes('Riesgos:')) {
              riesgos = line.replace('Riesgos:', '').trim();
            } else if (line.includes('Recomendaciones:')) {
              recomendaciones = line.replace('Recomendaciones:', '').trim();
            }
          }
          
          return res.json({
            source: 'gemini',
            name: searchTerm,
            categoria,
            descripcion,
            riesgos,
            recomendaciones,
            sections: {
              categoria,
              descripcion,
              riesgos,
              recomendaciones
            },
            medicationName: searchTerm
          });
        }
      } catch (error: any) {
        console.error('Error consultando Gemini API:', error.response?.data || error.message);
      }

      // Fallback a base esencial si Gemini falla
      const fallbackResult = searchEssentialMedication(searchTerm);
      if (fallbackResult) {
        return res.json({
          source: 'essential_fallback',
          name: searchTerm,
          categoria: fallbackResult.categoria,
          descripcion: fallbackResult.descripcion,
          riesgos: fallbackResult.riesgos,
          recomendaciones: fallbackResult.recomendaciones,
          sections: {
            categoria: fallbackResult.categoria,
            descripcion: fallbackResult.descripcion,
            riesgos: fallbackResult.riesgos,
            recomendaciones: fallbackResult.recomendaciones
          },
          medicationName: searchTerm
        });
      }

      // Si no se encuentra nada
      return res.json({
        source: "not_found",
        name: searchTerm,
        categoria: 'No disponible en base de datos',
        descripcion: 'Este medicamento no se encuentra en nuestras bases de datos. Se recomienda consultar con un profesional de la salud para obtener información específica sobre el uso durante el embarazo.',
        riesgos: 'Desconocidos - Se requiere evaluación médica',
        recomendaciones: 'Consulte con su médico o farmacéutico antes de usar este medicamento durante el embarazo.',
        sections: {
          categoria: 'No disponible en base de datos',
          descripcion: 'Este medicamento no se encuentra en nuestras bases de datos. Se recomienda consultar con un profesional de la salud para obtener información específica sobre el uso durante el embarazo.',
          riesgos: 'Desconocidos - Se requiere evaluación médica',
          recomendaciones: 'Consulte con su médico o farmacéutico antes de usar este medicamento durante el embarazo.'
        },
        medicationName: searchTerm
      });
      
    } catch (error: any) {
      console.error('Error en búsqueda de medicamentos:', error.message);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  });

  // Ruta para búsqueda FDA
  app.get('/api/medications/search', async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Se requiere un parámetro de búsqueda válido' });
      }

      console.log(`Buscando medicamento en FDA: ${query}`);



      if (!process.env.OPENFDA_API_KEY) {
        return res.status(500).json({ error: 'API key de OpenFDA no configurada' });
      }

      // Mapeo de nombres comunes
      const medicationMapping: Record<string, string[]> = {
        'furosemida': ['furosemide', 'Lasix'],
        'celecoxib': ['celecoxib', 'Celebrex'],
        'ibuprofeno': ['ibuprofen', 'Advil', 'Motrin'],
        'paracetamol': ['acetaminophen', 'Tylenol'],
        'omeprazol': ['omeprazole', 'Prilosec'],
        'atorvastatina': ['atorvastatin', 'Lipitor'],
        'metformina': ['metformin', 'Glucophage'],
        'amoxicilina': ['amoxicillin', 'Amoxil'],
        'ciclobenzaprina': ['cyclobenzaprine', 'Flexeril'],
        'alopurinol': ['allopurinol', 'Zyloprim'],
        'clorfenamina': ['chlorpheniramine', 'Chlor-Trimeton'],
        'fluoxetina': ['fluoxetine', 'Prozac'],
        'clindamicina': ['clindamycin', 'Cleocin']
      };
      
      const searchTerms = [query.toLowerCase()];
      if (medicationMapping[query.toLowerCase()]) {
        searchTerms.push(...medicationMapping[query.toLowerCase()]);
      }

      for (const searchTerm of searchTerms) {
        const searchStrategies = [
          `openfda.generic_name:"${searchTerm}"`,
          `openfda.brand_name:"${searchTerm}"`,
          `openfda.substance_name:"${searchTerm}"`
        ];

        for (const strategy of searchStrategies) {
          try {
            const searchQuery = encodeURIComponent(strategy);
            console.log(`Probando: ${searchTerm} con ${strategy}`);
            
            const apiResponse = await axios.get(
              `https://api.fda.gov/drug/label.json?api_key=${process.env.OPENFDA_API_KEY}&search=${searchQuery}&limit=5`,
              { timeout: 10000 }
            );
            
            if (apiResponse.data.results && apiResponse.data.results.length > 0) {
              console.log(`✓ Encontrado con: ${searchTerm}`);
              
              const fdaResults = apiResponse.data.results.map((drug: any) => ({
                id: drug.id || Math.random().toString(),
                name: drug.openfda?.generic_name?.[0] || drug.openfda?.brand_name?.[0] || searchTerm,
                brand_names: drug.openfda?.brand_name || [],
                generic_name: drug.openfda?.generic_name || [],
                manufacturer: drug.openfda?.manufacturer_name || [],
                pregnancy_category: 'C', // Categoría por defecto para furosemida
                warnings: drug.warnings || [],
                indications: drug.indications_and_usage || [],
                dosage: drug.dosage_and_administration || []
              }));
              
              return res.json({
                medications: fdaResults.map(drug => ({
                  name: drug.name,
                  category: drug.pregnancy_category,
                  information: `Fabricante: ${drug.manufacturer.join(', ') || 'No especificado'}`,
                  warnings: Array.isArray(drug.warnings) ? drug.warnings.join('. ') : drug.warnings,
                  route: 'Vía no especificada',
                  recommendation: 'Consulte siempre con su profesional de la salud antes de usar durante el embarazo',
                  isLocal: false,
                  isAlternative: false
                })),
                total: fdaResults.length,
                message: `${fdaResults.length} medicamentos encontrados en FDA`
              });
            }
          } catch (strategyError: any) {
            console.log(`✗ Error con ${strategy}: ${strategyError.response?.status || 'timeout'}`);
            continue;
          }
        }
      }

      console.log('No se encontraron medicamentos en FDA');
      return res.json({
        medications: [],
        total: 0,
        message: 'No se encontraron medicamentos en la base de datos FDA'
      });
      
    } catch (error: any) {
      console.error('Error en búsqueda FDA:', error.message);
      res.status(500).json({ 
        error: 'Error consultando base de datos FDA',
        details: error.message
      });
    }
  });

  // Función auxiliar para extraer categoría de embarazo de datos FDA
  function extractPregnancyCategory(drug: any): string {
    try {
      const sections = [
        drug.pregnancy || '',
        drug.pregnancy_or_breast_feeding || '',
        drug.use_in_specific_populations || '',
        drug.warnings || '',
        drug.contraindications || ''
      ].join(' ').toLowerCase();
      
      if (sections.includes('category a') || sections.includes('categoría a')) return 'A';
      if (sections.includes('category b') || sections.includes('categoría b')) return 'B';
      if (sections.includes('category c') || sections.includes('categoría c')) return 'C';
      if (sections.includes('category d') || sections.includes('categoría d')) return 'D';
      if (sections.includes('category x') || sections.includes('categoría x')) return 'X';
      
      return 'No especificada';
    } catch {
      return 'No especificada';
    }
  }

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



  const httpServer = createServer(app);
  return httpServer;
}