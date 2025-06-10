import { Router } from 'express';
import axios from 'axios';
import { searchMedication, getAllMedications, getMedicationsByCategory } from '../data/medications-database';
import { findDrug, getAllDrugs, getDrugsByCategory } from '../data/comprehensive-drug-database';
import { analyzeInteractions, getMedicationInteractions } from '../data/drug-interactions';

const router = Router();

// Función auxiliar para extraer categoría FDA
function extractFDACategory(category: string): string {
  if (!category) return 'No especificada';
  
  const categoryMap: Record<string, string> = {
    'A': 'Categoría A - Sin riesgo en estudios controlados',
    'B': 'Categoría B - Sin evidencia de riesgo en humanos',
    'C': 'Categoría C - Riesgo no puede descartarse',
    'D': 'Categoría D - Evidencia de riesgo, pero beneficios pueden justificar uso',
    'X': 'Categoría X - Contraindicado en embarazo'
  };
  
  return categoryMap[category.toUpperCase()] || category;
}

// Función para generar variaciones de nombres de medicamentos
function generateMedicationVariations(term: string): string[] {
  const variations = [];
  const lowerTerm = term.toLowerCase();
  
  // Variaciones comunes
  variations.push(lowerTerm);
  variations.push(term.charAt(0).toUpperCase() + term.slice(1).toLowerCase());
  
  // Mapeo de nombres españoles a nombres internacionales
  const nameMapping: Record<string, string[]> = {
    'metamizol': ['dipyrone', 'metamizole', 'novalgina'],
    'paracetamol': ['acetaminophen', 'tylenol', 'panadol'],
    'ibuprofeno': ['ibuprofen', 'advil', 'motrin'],
    'diclofenaco': ['diclofenac', 'voltaren'],
    'aspirina': ['aspirin', 'acetylsalicylic acid'],
    'omeprazol': ['omeprazole', 'prilosec'],
    'metformina': ['metformin', 'glucophage'],
    'atenolol': ['atenolol', 'tenormin'],
    'enalapril': ['enalapril', 'vasotec'],
    'amoxicilina': ['amoxicillin', 'amoxil'],
    'azitromicina': ['azithromycin', 'zithromax'],
    'claritromicina': ['clarithromycin', 'biaxin'],
    'ciprofloxacina': ['ciprofloxacin', 'cipro'],
    'clonazepam': ['clonazepam', 'klonopin'],
    'diazepam': ['diazepam', 'valium'],
    'fluoxetina': ['fluoxetine', 'prozac'],
    'sertralina': ['sertraline', 'zoloft'],
    'lorazepam': ['lorazepam', 'ativan'],
    'alprazolam': ['alprazolam', 'xanax'],
    'warfarina': ['warfarin', 'coumadin'],
    'heparina': ['heparin'],
    'prednisona': ['prednisone'],
    'levotiroxina': ['levothyroxine', 'synthroid'],
    'insulina': ['insulin'],
    'simvastatina': ['simvastatin', 'zocor'],
    'atorvastatina': ['atorvastatin', 'lipitor'],
    'losartan': ['losartan', 'cozaar'],
    'amlodipino': ['amlodipine', 'norvasc']
  };
  
  if (nameMapping[lowerTerm]) {
    variations.push(...nameMapping[lowerTerm]);
  }
  
  // Buscar en mappings inversos
  for (const [spanish, international] of Object.entries(nameMapping)) {
    if (international.includes(lowerTerm)) {
      variations.push(spanish);
      variations.push(...international);
    }
  }
  
  return [...new Set(variations)];
}

// Endpoint compatible con la implementación exitosa de "create"
router.post('/integrations/google-gemini-1-5/', async (req, res) => {
  try {
    const { messages, stream } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Mensajes requeridos' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Clave API de Gemini no configurada',
        suggestion: 'El administrador debe configurar GEMINI_API_KEY'
      });
    }

    const userMessage = messages[messages.length - 1];
    const prompt = userMessage.content;

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!result) {
      return res.status(404).json({ 
        error: 'No se pudo generar respuesta',
      });
    }

    if (stream) {
      // Para streaming, enviar la respuesta de forma similar al proyecto create
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');
      
      // Simular streaming enviando la respuesta en chunks
      const chunks = result.split(' ');
      for (let i = 0; i < chunks.length; i++) {
        res.write(chunks[i] + ' ');
        await new Promise(resolve => setTimeout(resolve, 50)); // Pequeño delay para simular streaming
      }
      res.end();
    } else {
      res.json({ 
        choices: [{
          message: {
            content: result
          }
        }]
      });
    }
    
  } catch (error: any) {
    console.error('Error en Gemini API:', error.message);
    res.status(500).json({ 
      error: 'Error consultando Gemini API',
      details: error.message
    });
  }
});

// Endpoint mejorado para búsqueda de medicamentos con base de datos integral
router.post('/api/medications/gemini', async (req, res) => {
  const { term } = req.body;
  
  if (!term || typeof term !== 'string') {
    return res.status(400).json({ error: 'Se requiere un término de búsqueda válido' });
  }
  
  try {
    console.log(`Buscando medicamento: ${term}`);
    
    // PASO 1: Buscar en base de datos de medicamentos locales
    const localResult = searchMedication(term);
    if (localResult) {
      console.log(`✓ Encontrado en base local: ${term}`);
      return res.json({
        source: 'local',
        name: term,
        categoria: extractFDACategory(localResult.category),
        descripcion: localResult.description,
        riesgos: localResult.risks,
        recomendaciones: localResult.recommendations,
        sections: {
          categoria: extractFDACategory(localResult.category),
          descripcion: localResult.description,
          riesgos: localResult.risks,
          recomendaciones: localResult.recommendations
        },
        medicationName: term
      });
    }

    // PASO 2: Buscar en base de datos integral de drogas
    const drugResult = findDrug(term);
    if (drugResult) {
      console.log(`✓ Encontrado en base integral: ${term}`);
      return res.json({
        source: 'comprehensive',
        name: term,
        categoria: drugResult.pregnancy_risks,
        descripcion: `${drugResult.mechanism}. Clasificación: ${drugResult.class}`,
        riesgos: drugResult.pregnancy_risks,
        recomendaciones: drugResult.recommendations,
        sections: {
          categoria: drugResult.pregnancy_risks,
          descripcion: `${drugResult.mechanism}. Clasificación: ${drugResult.class}`,
          riesgos: drugResult.pregnancy_risks,
          recomendaciones: drugResult.recommendations
        },
        medicationName: term
      });
    }

    // PASO 3: Buscar variaciones del nombre
    const variations = generateMedicationVariations(term);
    for (const variation of variations) {
      const drugResult = findDrug(variation);
      const medResult = searchMedication(variation);
      
      if (drugResult) {
        console.log(`✓ Encontrado variación ${variation} para: ${term}`);
        return res.json({
          source: 'comprehensive_variation',
          name: term,
          categoria: drugResult.pregnancy_risks,
          descripcion: `${drugResult.mechanism}. Clasificación: ${drugResult.class}`,
          riesgos: drugResult.pregnancy_risks,
          recomendaciones: drugResult.recommendations,
          sections: {
            categoria: drugResult.pregnancy_risks,
            descripcion: `${drugResult.mechanism}. Clasificación: ${drugResult.class}`,
            riesgos: drugResult.pregnancy_risks,
            recomendaciones: drugResult.recommendations
          },
          medicationName: term
        });
      }
      
      if (medResult) {
        console.log(`✓ Encontrado variación ${variation} para: ${term}`);
        return res.json({
          source: 'local_variation',
          name: term,
          categoria: extractFDACategory(medResult.category),
          descripcion: medResult.description,
          riesgos: medResult.risks,
          recomendaciones: medResult.recommendations,
          sections: {
            categoria: extractFDACategory(medResult.category),
            descripcion: medResult.description,
            riesgos: medResult.risks,
            recomendaciones: medResult.recommendations
          },
          medicationName: term
        });
      }
    }

    console.log(`⚠️ Medicamento no encontrado en bases locales: ${term}`);
    
    // Mapeo de nombres comunes a nombres oficiales en inglés con categorías conocidas
    const medicationMapping: Record<string, { terms: string[], knownCategory?: string }> = {
      'lovastatina': { terms: ['lovastatin', 'Mevacor'], knownCategory: 'X' },
      'omeprazol': { terms: ['omeprazole', 'Prilosec'], knownCategory: 'C' },
      'paracetamol': { terms: ['acetaminophen', 'Tylenol'], knownCategory: 'B' },
      'ibuprofeno': { terms: ['ibuprofen', 'Advil', 'Motrin'], knownCategory: 'C' },
      'atenolol': { terms: ['atenolol', 'Tenormin'], knownCategory: 'D' },
      'propranolol': { terms: ['propranolol', 'Inderal'], knownCategory: 'C' },
      'metformina': { terms: ['metformin', 'Glucophage'], knownCategory: 'B' },
      'insulina': { terms: ['insulin'], knownCategory: 'B' },
      'warfarina': { terms: ['warfarin', 'Coumadin'], knownCategory: 'X' },
      'enalapril': { terms: ['enalapril', 'Vasotec'], knownCategory: 'D' },
      'losartan': { terms: ['losartan', 'Cozaar'], knownCategory: 'D' },
      'amoxicilina': { terms: ['amoxicillin', 'Amoxil'], knownCategory: 'B' },
      'fluoxetina': { terms: ['fluoxetine', 'Prozac'], knownCategory: 'C' },
      'sertralina': { terms: ['sertraline', 'Zoloft'], knownCategory: 'C' },
      'clonazepam': { terms: ['clonazepam', 'Klonopin'], knownCategory: 'D' },
      'diazepam': { terms: ['diazepam', 'Valium'], knownCategory: 'D' },
      'alprazolam': { terms: ['alprazolam', 'Xanax'], knownCategory: 'D' },
      'lorazepam': { terms: ['lorazepam', 'Ativan'], knownCategory: 'D' },
      'azitromicina': { terms: ['azithromycin', 'Zithromax'], knownCategory: 'B' },
      'ciprofloxacina': { terms: ['ciprofloxacin', 'Cipro'], knownCategory: 'C' },
      'cefalexina': { terms: ['cephalexin', 'Keflex'], knownCategory: 'B' },
      'prednisona': { terms: ['prednisone'], knownCategory: 'C' },
      'dexametasona': { terms: ['dexamethasone'], knownCategory: 'C' },
      'levotiroxina': { terms: ['levothyroxine', 'Synthroid'], knownCategory: 'A' },
      'lisinopril': { terms: ['lisinopril', 'Prinivil'], knownCategory: 'D' },
      'amlodipino': { terms: ['amlodipine', 'Norvasc'], knownCategory: 'C' },
      'simvastatina': { terms: ['simvastatin', 'Zocor'], knownCategory: 'X' },
      'atorvastatina': { terms: ['atorvastatin', 'Lipitor'], knownCategory: 'X' }
    };

    // Obtener términos de búsqueda y categoría conocida
    const searchTerms = [term.toLowerCase()];
    let knownCategory = null;
    
    if (medicationMapping[term.toLowerCase()]) {
      const mapping = medicationMapping[term.toLowerCase()];
      searchTerms.push(...mapping.terms);
      knownCategory = mapping.knownCategory;
    }

    let fdaResponse = null;
    let searchQuery;
    
    // Intentar con cada término hasta encontrar resultados
    console.log(`Términos de búsqueda a probar: ${searchTerms.join(', ')}`);
    
    for (const searchTerm of searchTerms) {
      try {
        // Múltiples estrategias de búsqueda como en la aplicación que funciona
        const searchStrategies = [
          `openfda.generic_name:"${searchTerm}"`,
          `openfda.brand_name:"${searchTerm}"`,
          `openfda.substance_name:"${searchTerm}"`,
          `openfda.generic_name:${searchTerm}`,
          `openfda.brand_name:${searchTerm}`
        ];

        for (const strategy of searchStrategies) {
          try {
            searchQuery = encodeURIComponent(strategy);
            console.log(`Intentando búsqueda con: ${searchTerm} -> ${strategy}`);
            
            const response = await axios.get(
              `https://api.fda.gov/drug/label.json?api_key=${OPENFDA_API_KEY}&search=${searchQuery}&limit=1`
            );
            
            if (response.data.results && response.data.results.length > 0) {
              console.log(`✓ Encontrado con término: ${searchTerm} usando estrategia: ${strategy}`);
              fdaResponse = response;
              break;
            }
          } catch (strategyError: any) {
            console.log(`✗ Estrategia ${strategy} falló: ${strategyError.response?.status || 'Sin estado'}`);
            continue;
          }
        }

        if (fdaResponse) break;
        
      } catch (searchError: any) {
        console.log(`✗ Error buscando ${searchTerm}: ${searchError.response?.status || 'Sin código de estado'}`);
        if (searchError.response?.status !== 404) {
          throw searchError;
        }
      }
    }

    if (fdaResponse?.data?.results && fdaResponse.data.results.length > 0) {
      const drugData = fdaResponse.data.results[0];
      const openfda = drugData.openfda || {};
      
      // Extraer información de embarazo oficial - priorizar categoría conocida
      let pregnancyCategory = knownCategory || 'No especificada';
      if (openfda.pregnancy_category && openfda.pregnancy_category.length > 0) {
        pregnancyCategory = openfda.pregnancy_category[0];
      } else if (knownCategory) {
        pregnancyCategory = knownCategory;
      }
      
      // Extraer información detallada de embarazo
      let pregnancyInfo = 'No hay información específica disponible.';
      if (drugData.pregnancy && drugData.pregnancy.length > 0) {
        pregnancyInfo = drugData.pregnancy[0];
      } else if (drugData.pregnancy_or_breast_feeding && drugData.pregnancy_or_breast_feeding.length > 0) {
        pregnancyInfo = drugData.pregnancy_or_breast_feeding[0];
      }
      
      // Extraer advertencias
      let warnings = '';
      if (drugData.warnings && drugData.warnings.length > 0) {
        warnings = drugData.warnings[0];
      } else if (drugData.warnings_and_precautions && drugData.warnings_and_precautions.length > 0) {
        warnings = drugData.warnings_and_precautions[0];
      }
      
      // Extraer nombre del medicamento
      let medicationName = term;
      if (openfda.brand_name && openfda.brand_name.length > 0) {
        medicationName = openfda.brand_name[0];
      } else if (openfda.generic_name && openfda.generic_name.length > 0) {
        medicationName = openfda.generic_name[0];
      }
      
      // Función para crear resúmenes concisos en español
      const createSpanishSummary = (text: string, maxLength: number = 200): string => {
        if (!text || text.length <= maxLength) return text;
        
        const sentences = text.split(/[.!?]+/);
        let summary = '';
        
        for (const sentence of sentences) {
          if (summary.length + sentence.length <= maxLength) {
            summary += sentence.trim() + '. ';
          } else {
            break;
          }
        }
        
        return summary.trim() || text.substring(0, maxLength) + '...';
      };

      const getCategoryDescription = (category: string): string => {
        switch (category.toUpperCase()) {
          case 'A': return 'Seguro: No hay riesgo demostrado para el feto.';
          case 'B': return 'Probablemente seguro: Sin evidencia de riesgo en humanos.';
          case 'C': return 'Usar con precaución: Riesgo no puede descartarse.';
          case 'D': return 'Riesgo documentado: Evidencia de riesgo fetal pero puede ser aceptable.';
          case 'X': return 'Contraindicado: Riesgo fetal supera cualquier beneficio.';
          default: return 'Categoría no establecida: Consulte con su médico.';
        }
      };

      // Formatear la respuesta según las categorías FDA
      const sections = {
        categoria: pregnancyCategory,
        descripcion: `${medicationName} - Categoría ${pregnancyCategory}: ${getCategoryDescription(pregnancyCategory)}`,
        riesgos: createSpanishSummary(warnings || 'Consulte las advertencias oficiales del medicamento con su médico.'),
        recomendaciones: 'Siempre consulte con su profesional de la salud antes de usar cualquier medicamento durante el embarazo.'
      };
      
      return res.json({
        sections,
        medicationName,
        source: "official_fda_api"
      });
    }

    // Buscar en sistema farmacológico completo
    const drugData = findDrug(term);
    if (drugData) {
      const sections = {
        categoria: drugData.category,
        descripcion: `${drugData.name} - ${drugData.class}: ${drugData.mechanism}`,
        riesgos: drugData.pregnancy_risks,
        recomendaciones: drugData.recommendations
      };
      
      return res.json({
        sections,
        medicationName: drugData.name,
        source: "comprehensive_pharmaceutical_database",
        monitoring: drugData.monitoring,
        alternatives: drugData.alternatives
      });
    }

    // Fallback a base de datos médica específica
    const medicationData = searchMedication(term);
    if (medicationData) {
      const sections = {
        categoria: medicationData.category,
        descripcion: medicationData.description,
        riesgos: medicationData.risks,
        recomendaciones: medicationData.recommendations
      };
      
      return res.json({
        sections,
        medicationName: medicationData.name,
        source: "medical_database",
        trimesterInfo: medicationData.trimesterSpecific
      });
    }

    // Fallback para medicamentos con categoría conocida pero sin datos completos
    if (knownCategory) {
      const medicationName = term.charAt(0).toUpperCase() + term.slice(1);
      
      const getMedicationInfo = (category: string, name: string) => {
        const infoMap: Record<string, { description: string, risks: string }> = {
          'A': {
            description: `${name} - Categoría A: Seguro durante el embarazo. Estudios controlados no han demostrado riesgo para el feto.`,
            risks: 'No se han identificado riesgos significativos durante el embarazo según estudios controlados.'
          },
          'B': {
            description: `${name} - Categoría B: Probablemente seguro. No hay evidencia de riesgo en humanos, aunque los estudios en animales pueden mostrar algún riesgo.`,
            risks: 'Riesgo bajo durante el embarazo. Uso generalmente considerado seguro bajo supervisión médica.'
          },
          'C': {
            description: `${name} - Categoría C: Usar con precaución. Los beneficios pueden justificar el riesgo potencial para el feto.`,
            risks: 'Riesgo moderado. Usar solo si los beneficios potenciales justifican el riesgo para el feto.'
          },
          'D': {
            description: `${name} - Categoría D: Riesgo documentado. Existe evidencia de riesgo fetal pero puede ser aceptable en situaciones críticas.`,
            risks: 'Riesgo significativo documentado para el feto. Considerar alternativas más seguras cuando sea posible.'
          },
          'X': {
            description: `${name} - Categoría X: Contraindicado en embarazo. Los riesgos superan claramente cualquier beneficio posible.`,
            risks: 'Contraindicado durante el embarazo. Alto riesgo de daño fetal documentado.'
          }
        };
        
        return infoMap[category] || {
          description: `${name} - Consulte con su médico sobre el uso durante el embarazo.`,
          risks: 'Consulte las advertencias oficiales con su profesional de la salud.'
        };
      };

      const info = getMedicationInfo(knownCategory, medicationName);
      
      const sections = {
        categoria: knownCategory,
        descripcion: info.description,
        riesgos: info.risks,
        recomendaciones: 'Siempre consulte con su profesional de la salud antes de usar cualquier medicamento durante el embarazo.'
      };
      
      return res.json({
        sections,
        medicationName,
        source: "known_medication_database"
      });
    }

    // Si no está en el mapeo conocido, informar que no hay datos disponibles
    return res.status(404).json({
      error: 'Medicamento no encontrado en la base de datos',
      message: 'No se encontró información para este medicamento. Consulte con su profesional de la salud.',
      searchedTerm: term
    });
    
  } catch (error: any) {
    console.error('Error consultando OpenFDA API:', error.message);
    res.status(500).json({ 
      error: 'Error consultando la base de datos oficial de la FDA',
      details: error.message
    });
  }
});

// Endpoint para buscar medicamentos en la API oficial de OpenFDA
router.get('/api/medications/search', async (req, res) => {
  const { term } = req.query;
  
  if (!term || typeof term !== 'string') {
    return res.status(400).json({ error: 'Se requiere un término de búsqueda válido' });
  }

  const OPENFDA_API_KEY = process.env.OPENFDA_API_KEY;
  if (!OPENFDA_API_KEY) {
    return res.status(500).json({ error: 'API key de OpenFDA no configurada' });
  }
  
  try {
    // Usar múltiples estrategias de búsqueda para mayor cobertura
    const searchStrategies = [
      `openfda.generic_name:"${term}"`,
      `openfda.brand_name:"${term}"`,
      `openfda.substance_name:"${term}"`,
      `openfda.generic_name:${term}`,
      `openfda.brand_name:${term}`,
      `openfda.substance_name:${term}`
    ];

    let response = null;
    
    for (const strategy of searchStrategies) {
      try {
        const searchQuery = encodeURIComponent(strategy);
        console.log(`Probando estrategia FDA: ${strategy}`);
        
        const apiResponse = await axios.get(
          `https://api.fda.gov/drug/label.json?api_key=${OPENFDA_API_KEY}&search=${searchQuery}&limit=10`
        );
        
        if (apiResponse.data.results && apiResponse.data.results.length > 0) {
          console.log(`✓ Éxito con estrategia: ${strategy}`);
          response = apiResponse;
          break;
        }
      } catch (strategyError: any) {
        console.log(`✗ Estrategia ${strategy} falló: ${strategyError.response?.status}`);
        continue;
      }
    }

    if (!response || !response.data.results) {
      throw new Error('No se encontraron resultados en OpenFDA');
    }
    
    // Procesar resultados de la API oficial
    const results = response.data.results || [];
    console.log(`Resultados encontrados: ${results.length}`);
    
    // Función auxiliar para crear resúmenes concisos en español
    const createSpanishSummary = (text: string, maxLength: number = 150): string => {
      if (!text || text.length <= maxLength) return text;
      
      const sentences = text.split(/[.!?]+/);
      let summary = '';
      
      for (const sentence of sentences) {
        if (summary.length + sentence.length <= maxLength) {
          summary += sentence.trim() + '. ';
        } else {
          break;
        }
      }
      
      return summary.trim() || text.substring(0, maxLength) + '...';
    };

    const getCategoryDescription = (category: string): string => {
      switch (category.toUpperCase()) {
        case 'A': return 'Seguro durante el embarazo';
        case 'B': return 'Probablemente seguro';
        case 'C': return 'Usar con precaución';
        case 'D': return 'Riesgo documentado';
        case 'X': return 'Contraindicado en embarazo';
        default: return 'Consulte con su médico';
      }
    };

    // Extraer y procesar información única de cada resultado de la FDA
    const uniqueMedications = new Map<string, any>();
    
    results.forEach((result: any) => {
      const openfda = result.openfda || {};
      
      // Extraer nombre oficial del medicamento
      let medicationName = '';
      if (openfda.generic_name && openfda.generic_name.length > 0) {
        medicationName = openfda.generic_name[0];
      } else if (openfda.brand_name && openfda.brand_name.length > 0) {
        medicationName = openfda.brand_name[0];
      } else if (openfda.substance_name && openfda.substance_name.length > 0) {
        medicationName = openfda.substance_name[0];
      }
      
      if (!medicationName || uniqueMedications.has(medicationName.toLowerCase())) {
        return; // Evitar duplicados
      }

      // Extraer categoría de embarazo oficial o usar categoría conocida
      let pregnancyCategory = 'No especificada';
      if (openfda.pregnancy_category && openfda.pregnancy_category.length > 0) {
        pregnancyCategory = openfda.pregnancy_category[0];
      } else {
        // Verificar si tenemos categoría conocida para este medicamento
        const lowerName = medicationName.toLowerCase();
        const medicationMapping: Record<string, string> = {
          'clonazepam': 'D', 'klonopin': 'D',
          'diazepam': 'D', 'valium': 'D',
          'alprazolam': 'D', 'xanax': 'D',
          'lorazepam': 'D', 'ativan': 'D',
          'atenolol': 'D', 'tenormin': 'D',
          'enalapril': 'D', 'vasotec': 'D',
          'losartan': 'D', 'cozaar': 'D',
          'warfarin': 'X', 'coumadin': 'X',
          'lovastatin': 'X', 'mevacor': 'X',
          'omeprazole': 'C', 'prilosec': 'C',
          'ibuprofen': 'C', 'advil': 'C', 'motrin': 'C',
          'propranolol': 'C', 'inderal': 'C',
          'fluoxetine': 'C', 'prozac': 'C',
          'sertraline': 'C', 'zoloft': 'C',
          'acetaminophen': 'B', 'tylenol': 'B',
          'metformin': 'B', 'glucophage': 'B',
          'insulin': 'B',
          'amoxicillin': 'B', 'amoxil': 'B'
        };
        
        if (medicationMapping[lowerName]) {
          pregnancyCategory = medicationMapping[lowerName];
        }
      }
      
      // Extraer información oficial de embarazo y crear resumen en español
      const pregnancyInfo = result.pregnancy && result.pregnancy.length > 0 
        ? createSpanishSummary(result.pregnancy[0])
        : (result.pregnancy_or_breast_feeding && result.pregnancy_or_breast_feeding.length > 0 
            ? createSpanishSummary(result.pregnancy_or_breast_feeding[0])
            : `Categoría ${pregnancyCategory}: ${getCategoryDescription(pregnancyCategory)}`);
        
      const warnings = result.warnings && result.warnings.length > 0 
        ? createSpanishSummary(result.warnings[0])
        : (result.warnings_and_precautions && result.warnings_and_precautions.length > 0
            ? createSpanishSummary(result.warnings_and_precautions[0])
            : 'Consulte las advertencias oficiales con su médico.');
        
      uniqueMedications.set(medicationName.toLowerCase(), {
        name: medicationName,
        category: pregnancyCategory,
        information: pregnancyInfo,
        warnings: warnings,
        route: openfda.route && openfda.route.length > 0 ? openfda.route[0] : 'Vía no especificada',
        source: 'FDA_Official'
      });
    });
    
    const medications = Array.from(uniqueMedications.values());
    
    res.json({ medications });
  } catch (error: any) {
    console.error('Error consultando OpenFDA API:', error.message);
    
    // Buscar en sistema farmacológico completo como respaldo
    const searchTerm = typeof term === 'string' ? term.toLowerCase() : '';
    const foundDrug = findDrug(searchTerm);
    
    if (foundDrug) {
      const medication = {
        name: foundDrug.name,
        category: foundDrug.category,
        information: `${foundDrug.class}: ${foundDrug.mechanism}`,
        warnings: foundDrug.pregnancy_risks,
        route: 'Según prescripción médica',
        source: 'Pharmaceutical_Database',
        monitoring: foundDrug.monitoring,
        alternatives: foundDrug.alternatives
      };
      
      return res.json({ medications: [medication] });
    }

    // Fallback a base de datos médica específica
    const foundMedication = searchMedication(searchTerm);
    if (foundMedication) {
      const medication = {
        name: foundMedication.name,
        category: foundMedication.category,
        information: foundMedication.description,
        warnings: foundMedication.risks,
        route: 'Según prescripción médica',
        source: 'Medical_Database'
      };
      
      return res.json({ medications: [medication] });
    }
    
    res.status(500).json({ 
      error: 'Error accediendo a la base de datos de medicamentos',
      message: 'No se pudo encontrar información para este medicamento.',
      details: error.message
    });
  }
});

// Endpoint para acceso universal a medicamentos
router.get('/api/medications/universal-search', async (req, res) => {
  try {
    const { term, category } = req.query;
    
    if (term && typeof term === 'string') {
      // Búsqueda específica
      const searchTerm = term.toLowerCase();
      
      // Prioridad 1: Sistema farmacológico completo
      const drugData = findDrug(searchTerm);
      if (drugData) {
        const medication = {
          name: drugData.name,
          category: drugData.category,
          information: `${drugData.class}: ${drugData.mechanism}`,
          warnings: drugData.pregnancy_risks,
          recommendations: drugData.recommendations,
          monitoring: drugData.monitoring,
          alternatives: drugData.alternatives,
          source: 'Pharmaceutical_Database'
        };
        return res.json({ medications: [medication] });
      }
      
      // Prioridad 2: Base de datos médica específica
      const medicationData = searchMedication(searchTerm);
      if (medicationData) {
        const medication = {
          name: medicationData.name,
          category: medicationData.category,
          information: medicationData.description,
          warnings: medicationData.risks,
          recommendations: medicationData.recommendations,
          source: 'Medical_Database'
        };
        return res.json({ medications: [medication] });
      }
      
      return res.status(404).json({ 
        error: 'Medicamento no encontrado',
        message: 'Este medicamento no está en nuestra base de datos.'
      });
    }
    
    // Listar por categoría o todos
    let allMedications = [];
    
    if (category && typeof category === 'string') {
      const categoryUpper = category.toUpperCase();
      allMedications = [
        ...getDrugsByCategory(categoryUpper),
        ...getMedicationsByCategory(categoryUpper)
      ];
    } else {
      allMedications = [
        ...getAllDrugs(),
        ...getAllMedications()
      ];
    }
    
    const formattedMedications = allMedications.map(med => ({
      name: med.name,
      category: med.category,
      information: 'description' in med ? med.description : `${med.class}: ${med.mechanism}`,
      warnings: 'risks' in med ? med.risks : med.pregnancy_risks,
      source: 'pregnancy_risks' in med ? 'Pharmaceutical_Database' : 'Medical_Database'
    }));
    
    res.json({ medications: formattedMedications, total: formattedMedications.length });
  } catch (error: any) {
    console.error('Error en búsqueda universal:', error.message);
    res.status(500).json({ 
      error: 'Error en búsqueda universal de medicamentos',
      details: error.message
    });
  }
});

// Endpoint para listar todos los medicamentos disponibles
router.get('/api/medications/list', async (req, res) => {
  try {
    const { category } = req.query;
    
    let medications;
    if (category && typeof category === 'string') {
      medications = getMedicationsByCategory(category.toUpperCase());
    } else {
      medications = getAllMedications();
    }
    
    const formattedMedications = medications.map(med => ({
      name: med.name,
      category: med.category,
      information: med.description,
      warnings: med.risks,
      route: 'Según prescripción médica',
      source: 'Medical_Database',
      commonUses: med.commonUses
    }));
    
    res.json({ medications: formattedMedications });
  } catch (error: any) {
    console.error('Error obteniendo lista de medicamentos:', error.message);
    res.status(500).json({ 
      error: 'Error obteniendo lista de medicamentos',
      details: error.message
    });
  }
});

// Endpoint para analizar interacciones medicamentosas
router.post('/api/interactions/analyze', async (req, res) => {
  try {
    const { medications } = req.body;
    
    if (!Array.isArray(medications) || medications.length < 2) {
      return res.status(400).json({ 
        error: 'Se requieren al menos 2 medicamentos para analizar interacciones' 
      });
    }

    const analysis = analyzeInteractions(medications);
    res.json(analysis);
    
  } catch (error: any) {
    console.error('Error analizando interacciones:', error.message);
    res.status(500).json({ 
      error: 'Error analizando interacciones medicamentosas',
      details: error.message
    });
  }
});

// Endpoint para obtener interacciones de un medicamento específico
router.get('/api/interactions/:medication', async (req, res) => {
  try {
    const { medication } = req.params;
    const interactions = getMedicationInteractions(medication);
    
    res.json({ 
      medication,
      interactions,
      total: interactions.length
    });
    
  } catch (error: any) {
    console.error('Error obteniendo interacciones:', error.message);
    res.status(500).json({ 
      error: 'Error obteniendo interacciones del medicamento',
      details: error.message
    });
  }
});

export default router;