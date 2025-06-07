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
    
    // Buscar en la API oficial de OpenFDA
    const searchQuery = encodeURIComponent(`openfda.brand_name:"${term}" OR openfda.generic_name:"${term}" OR openfda.substance_name:"${term}"`);
    const fdaResponse = await axios.get(
      `https://api.fda.gov/drug/label.json?api_key=${OPENFDA_API_KEY}&search=${searchQuery}&limit=1`
    );

    if (fdaResponse.data.results && fdaResponse.data.results.length > 0) {
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
    console.error('Error consultando a Gemini:', error.message);
    res.status(500).json({ 
      error: 'Error consultando la información del medicamento',
      details: error.message
    });
  }
});

// Endpoint para buscar medicamentos en la API de la FDA (método original)
router.get('/api/medications/search', async (req, res) => {
  const { term } = req.query;
  
  if (!term || typeof term !== 'string') {
    return res.status(400).json({ error: 'Se requiere un término de búsqueda válido' });
  }

  // Los headers que emulan un navegador normal
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
    'Referer': 'https://open.fda.gov/',
    'Origin': 'https://open.fda.gov'
  };
  
  try {
    // Usar una búsqueda más flexible y con un límite mayor
    const searchQuery = encodeURIComponent(`openfda.brand_name:"${term}" OR openfda.generic_name:"${term}" OR openfda.substance_name:"${term}" OR openfda.brand_name:${term} OR openfda.generic_name:${term} OR openfda.substance_name:${term}`);
    
    // Buscar en la API de la FDA (OpenFDA) emulando un navegador web
    console.log(`Buscando: ${searchQuery}`);
    const response = await axios.get(`https://api.fda.gov/drug/label.json?search=${searchQuery}&limit=10`, { 
      headers,
      timeout: 10000, // 10 segundos de timeout
    });
    
    // Procesar resultados
    const results = response.data.results || [];
    console.log(`Resultados encontrados: ${results.length}`);
    
    // Extraer información relevante de cada resultado
    const medications = results.map((result: any) => {
      const openfda = result.openfda || {};
      
      // Extraer categoría de embarazo
      let pregnancyCategory = 'No disponible';
      if (openfda.pregnancy_category && openfda.pregnancy_category.length > 0) {
        pregnancyCategory = openfda.pregnancy_category[0];
      }
      
      // Extraer nombre del medicamento
      let medicationName = 'Medicamento desconocido';
      if (openfda.brand_name && openfda.brand_name.length > 0) {
        medicationName = openfda.brand_name[0];
      } else if (openfda.generic_name && openfda.generic_name.length > 0) {
        medicationName = openfda.generic_name[0];
      } else if (openfda.substance_name && openfda.substance_name.length > 0) {
        medicationName = openfda.substance_name[0];
      }
      
      // Extraer información de embarazo y advertencias
      const pregnancyInfo = result.pregnancy && result.pregnancy.length > 0 
        ? result.pregnancy[0] 
        : (result.pregnancy_or_breast_feeding && result.pregnancy_or_breast_feeding.length > 0 
            ? result.pregnancy_or_breast_feeding[0] 
            : 'No hay información específica sobre el embarazo disponible.');
        
      const warnings = result.warnings && result.warnings.length > 0 
        ? result.warnings[0] 
        : (result.warnings_and_precautions && result.warnings_and_precautions.length > 0
            ? result.warnings_and_precautions[0]
            : '');
        
      return {
        name: medicationName,
        category: pregnancyCategory,
        information: pregnancyInfo,
        warnings: warnings,
        route: openfda.route && openfda.route.length > 0 ? openfda.route[0] : 'No especificada',
      };
    });
    
    res.json({ medications });
  } catch (error: any) {
    console.error('Error buscando medicamentos en la FDA API:', error.message);
    
    // Si hay un error de timeout o de conexión, intentar con una URL alternativa
    try {
      console.log("Intentando URL alternativa...");
      
      // URL alternativa a la API oficial
      const alternativeResponse = await axios.get(`https://api.fda.gov/drug/label.json?api_key=DEMO_KEY&search=openfda.brand_name:"${term}" OR openfda.generic_name:"${term}"&limit=5`);
      
      const results = alternativeResponse.data.results || [];
      
      const medications = results.map((result: any) => {
        const openfda = result.openfda || {};
        
        // Extraer categoría de embarazo
        let pregnancyCategory = 'No disponible';
        if (openfda.pregnancy_category && openfda.pregnancy_category.length > 0) {
          pregnancyCategory = openfda.pregnancy_category[0];
        }
        
        // Extraer nombre del medicamento
        let medicationName = 'Medicamento desconocido';
        if (openfda.brand_name && openfda.brand_name.length > 0) {
          medicationName = openfda.brand_name[0];
        } else if (openfda.generic_name && openfda.generic_name.length > 0) {
          medicationName = openfda.generic_name[0];
        } else if (openfda.substance_name && openfda.substance_name.length > 0) {
          medicationName = openfda.substance_name[0];
        }
        
        // Extraer información de embarazo y advertencias
        const pregnancyInfo = result.pregnancy && result.pregnancy.length > 0 
          ? result.pregnancy[0] 
          : 'No hay información específica sobre el embarazo disponible.';
          
        const warnings = result.warnings && result.warnings.length > 0 
          ? result.warnings[0] 
          : '';
          
        return {
          name: medicationName,
          category: pregnancyCategory,
          information: pregnancyInfo,
          warnings: warnings,
          route: openfda.route && openfda.route.length > 0 ? openfda.route[0] : 'No especificada',
          isAlternative: true
        };
      });
      
      if (medications.length > 0) {
        return res.json({ medications });
      }
    } catch (alternativeError: any) {
      console.error('Error en la URL alternativa:', alternativeError.message);
    }
    
    // Base de datos de respaldo con medicamentos comunes para cuando ambas APIs fallan
    const backupMedications = {
      "paracetamol": {
        name: "Paracetamol (Acetaminofén)",
        category: "B",
        information: "Los estudios no han demostrado riesgo para el feto. Se considera seguro durante el embarazo a dosis terapéuticas.",
        warnings: "Posibles efectos secundarios maternos como náuseas o dolor de cabeza en dosis altas."
      },
      "ibuprofeno": {
        name: "Ibuprofeno",
        category: "C/D",
        information: "Categoría C en 1er y 2do trimestre, D en 3er trimestre. Puede causar cierre prematuro del conducto arterioso y otras complicaciones en el tercer trimestre.",
        warnings: "Debe evitarse en el tercer trimestre de embarazo."
      },
      "aspirina": {
        name: "Aspirina (Ácido acetilsalicílico)",
        category: "C/D",
        information: "Puede aumentar el riesgo de sangrado durante el parto. En dosis altas puede asociarse con bajo peso al nacer.",
        warnings: "Evitar en el tercer trimestre. En dosis bajas puede usarse bajo supervisión médica para prevenir preeclampsia en casos específicos."
      },
      "amoxicilina": {
        name: "Amoxicilina",
        category: "B",
        information: "No se han documentado efectos adversos significativos en el feto.",
        warnings: "Es uno de los antibióticos de elección durante el embarazo cuando está indicado."
      }
    };
    
    // Verificar si el término de búsqueda coincide con algún medicamento de respaldo
    const termLower = term.toLowerCase();
    const matches = Object.entries(backupMedications)
      .filter(([key, med]) => key.includes(termLower) || med.name.toLowerCase().includes(termLower))
      .map(([_, med]) => ({
        ...med,
        isLocal: true
      }));
    
    if (matches.length > 0) {
      return res.json({ medications: matches });
    }
    
    // Si no hay coincidencias en datos de respaldo, devolver array vacío
    res.json({ medications: [] });
  }
});

export default router;