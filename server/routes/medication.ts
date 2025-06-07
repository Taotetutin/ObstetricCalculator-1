import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Endpoint para buscar medicamentos usando la API oficial de OpenFDA
router.post('/api/medications/gemini', async (req, res) => {
  const { term } = req.body;
  
  if (!term || typeof term !== 'string') {
    return res.status(400).json({ error: 'Se requiere un término de búsqueda válido' });
  }
  
  const OPENFDA_API_KEY = process.env.OPENFDA_API_KEY;
  if (!OPENFDA_API_KEY) {
    return res.status(500).json({ error: 'API key de OpenFDA no configurada' });
  }
  
  try {
    console.log(`Consultando OpenFDA API para: ${term}`);
    
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
      'lorazepam': { terms: ['lorazepam', 'Ativan'], knownCategory: 'D' }
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
        searchQuery = encodeURIComponent(`openfda.generic_name:${searchTerm}`);
        console.log(`Intentando búsqueda con: ${searchTerm} -> ${searchQuery}`);
        const response = await axios.get(
          `https://api.fda.gov/drug/label.json?api_key=${OPENFDA_API_KEY}&search=${searchQuery}&limit=1`
        );
        
        console.log(`Respuesta para ${searchTerm}: ${response.data.results?.length || 0} resultados`);
        
        if (response.data.results && response.data.results.length > 0) {
          console.log(`✓ Encontrado con término: ${searchTerm}`);
          fdaResponse = response;
          break;
        }
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

    // Si no se encuentra en OpenFDA, informar que no hay datos disponibles
    return res.status(404).json({
      error: 'Medicamento no encontrado en la base de datos oficial de la FDA',
      message: 'No se encontró información oficial para este medicamento. Consulte con su profesional de la salud.',
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
    // Buscar en la API oficial de OpenFDA con autenticación
    const searchQuery = encodeURIComponent(`openfda.brand_name:"${term}" OR openfda.generic_name:"${term}" OR openfda.substance_name:"${term}"`);
    
    console.log(`Buscando en OpenFDA: ${searchQuery}`);
    const response = await axios.get(
      `https://api.fda.gov/drug/label.json?api_key=${OPENFDA_API_KEY}&search=${searchQuery}&limit=10`
    );
    
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
    
    // No usar datos de respaldo sintéticos - solo devolver error para mantener integridad de datos
    res.status(500).json({ 
      error: 'Error accediendo a la base de datos oficial de la FDA',
      message: 'No se pudo consultar la información oficial. Verifique su conexión o intente más tarde.',
      details: error.message
    });
  }
});

export default router;