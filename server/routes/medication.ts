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
    
    // Mapeo de nombres comunes a nombres oficiales en inglés
    const medicationMapping: Record<string, string[]> = {
      'lovastatina': ['lovastatin', 'Mevacor'],
      'omeprazol': ['omeprazole', 'Prilosec'],
      'paracetamol': ['acetaminophen', 'Tylenol'],
      'ibuprofeno': ['ibuprofen', 'Advil', 'Motrin'],
      'atenolol': ['atenolol', 'Tenormin'],
      'propranolol': ['propranolol', 'Inderal'],
      'metformina': ['metformin', 'Glucophage'],
      'insulina': ['insulin'],
      'warfarina': ['warfarin', 'Coumadin'],
      'enalapril': ['enalapril', 'Vasotec'],
      'losartan': ['losartan', 'Cozaar'],
      'amoxicilina': ['amoxicillin', 'Amoxil'],
      'fluoxetina': ['fluoxetine', 'Prozac'],
      'sertralina': ['sertraline', 'Zoloft']
    };

    // Obtener términos de búsqueda
    const searchTerms = [term.toLowerCase()];
    if (medicationMapping[term.toLowerCase()]) {
      searchTerms.push(...medicationMapping[term.toLowerCase()]);
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
      
      // Extraer información de embarazo oficial
      let pregnancyCategory = 'No especificada';
      if (openfda.pregnancy_category && openfda.pregnancy_category.length > 0) {
        pregnancyCategory = openfda.pregnancy_category[0];
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
      
      // Formatear la respuesta según las categorías FDA
      const sections = {
        categoria: pregnancyCategory,
        descripcion: `${medicationName} es categoría ${pregnancyCategory} de la FDA según los datos oficiales. ${pregnancyInfo}`,
        riesgos: warnings || 'Consulte con su médico sobre los riesgos específicos.',
        recomendaciones: 'Consulte siempre con su profesional de la salud antes de usar cualquier medicamento durante el embarazo.'
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
    
    // Extraer información auténtica de cada resultado de la FDA
    const medications = results.map((result: any) => {
      const openfda = result.openfda || {};
      
      // Extraer categoría de embarazo oficial
      let pregnancyCategory = 'No especificada por FDA';
      if (openfda.pregnancy_category && openfda.pregnancy_category.length > 0) {
        pregnancyCategory = openfda.pregnancy_category[0];
      }
      
      // Extraer nombre oficial del medicamento
      let medicationName = 'Sin nombre oficial disponible';
      if (openfda.brand_name && openfda.brand_name.length > 0) {
        medicationName = openfda.brand_name[0];
      } else if (openfda.generic_name && openfda.generic_name.length > 0) {
        medicationName = openfda.generic_name[0];
      } else if (openfda.substance_name && openfda.substance_name.length > 0) {
        medicationName = openfda.substance_name[0];
      }
      
      // Extraer información oficial de embarazo
      const pregnancyInfo = result.pregnancy && result.pregnancy.length > 0 
        ? result.pregnancy[0] 
        : (result.pregnancy_or_breast_feeding && result.pregnancy_or_breast_feeding.length > 0 
            ? result.pregnancy_or_breast_feeding[0] 
            : 'No hay información específica de embarazo en los datos oficiales de la FDA.');
        
      const warnings = result.warnings && result.warnings.length > 0 
        ? result.warnings[0] 
        : (result.warnings_and_precautions && result.warnings_and_precautions.length > 0
            ? result.warnings_and_precautions[0]
            : 'No hay advertencias específicas disponibles en los datos oficiales.');
        
      return {
        name: medicationName,
        category: pregnancyCategory,
        information: pregnancyInfo,
        warnings: warnings,
        route: openfda.route && openfda.route.length > 0 ? openfda.route[0] : 'Vía no especificada',
        source: 'FDA_Official'
      };
    });
    
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