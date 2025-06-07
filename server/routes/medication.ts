import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Endpoint para buscar medicamentos usando Gemini (Método que usa Create.xyz)
router.post('/api/medications/gemini', async (req, res) => {
  const { term } = req.body;
  
  if (!term || typeof term !== 'string') {
    return res.status(400).json({ error: 'Se requiere un término de búsqueda válido' });
  }
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key de Gemini no configurada' });
  }
  
  try {
    // Base de datos local con clasificaciones FDA correctas
    const medicationDatabase = {
      "propranolol": {
        categoria: "C",
        descripcion: "El propranolol es categoría C de la FDA. Los estudios en animales han mostrado efectos adversos en el feto, pero no hay estudios adecuados y bien controlados en mujeres embarazadas. Debe usarse solo si el beneficio potencial justifica el riesgo potencial para el feto.",
        riesgos: "Puede causar bradicardia fetal, hipoglucemia neonatal, y retraso del crecimiento intrauterino. En altas dosis puede asociarse con bajo peso al nacer.",
        recomendaciones: "Usar solo cuando sea absolutamente necesario y bajo estricta supervisión médica. Monitorear frecuencia cardíaca fetal y crecimiento. Considerar alternativas más seguras cuando sea posible."
      },
      "atenolol": {
        categoria: "D",
        descripcion: "El atenolol es categoría D de la FDA. Hay evidencia positiva de riesgo fetal humano, pero los beneficios pueden superar los riesgos en situaciones que pongan en peligro la vida.",
        riesgos: "Asociado con retraso del crecimiento intrauterino, bajo peso al nacer, y bradicardia neonatal. Mayor riesgo de complicaciones perinatales.",
        recomendaciones: "Evitar en el embarazo cuando sea posible. Si es esencial, usar la dosis mínima efectiva y monitorear estrechamente el bienestar fetal."
      },
      "metoprolol": {
        categoria: "C",
        descripcion: "El metoprolol es categoría C de la FDA. Los estudios en animales no han demostrado efectos teratogénicos, pero no hay estudios controlados en mujeres embarazadas.",
        riesgos: "Posible bradicardia fetal, hipoglucemia neonatal. Generalmente considerado más seguro que otros betabloqueadores.",
        recomendaciones: "Puede usarse cuando los beneficios superen los riesgos. Preferido sobre atenolol. Monitorear función cardiovascular fetal."
      },
      "labetalol": {
        categoria: "C",
        descripcion: "El labetalol es categoría C de la FDA y es uno de los betabloqueadores preferidos durante el embarazo para el tratamiento de la hipertensión.",
        riesgos: "Riesgo mínimo comparado con otros betabloqueadores. Posible hipoglucemia neonatal leve.",
        recomendaciones: "Considerado de primera línea para hipertensión en el embarazo. Seguro y efectivo bajo supervisión médica adecuada."
      },
      "paracetamol": {
        categoria: "B",
        descripcion: "El paracetamol es categoría B de la FDA. Los estudios en animales no han demostrado riesgo fetal y no hay estudios controlados en mujeres embarazadas que demuestren riesgo.",
        riesgos: "Generalmente considerado seguro. Uso prolongado en altas dosis puede asociarse con problemas del desarrollo neurológico.",
        recomendaciones: "Analgésico de primera elección durante el embarazo. Usar la dosis mínima efectiva por el menor tiempo posible."
      },
      "ibuprofeno": {
        categoria: "C/D",
        descripcion: "El ibuprofeno es categoría C en el primer y segundo trimestre, y categoría D en el tercer trimestre debido al riesgo de cierre prematuro del conducto arterioso.",
        riesgos: "En el tercer trimestre: cierre prematuro del conducto arterioso, oligohidramnios, hipertensión pulmonar persistente del recién nacido.",
        recomendaciones: "Evitar en el tercer trimestre. En primer y segundo trimestre usar solo si es absolutamente necesario y por corto tiempo."
      }
    };

    // Buscar en la base de datos local primero
    const termLower = term.toLowerCase();
    const localData = Object.prototype.hasOwnProperty.call(medicationDatabase, termLower) 
      ? medicationDatabase[termLower as keyof typeof medicationDatabase] 
      : null;
    
    if (localData) {
      return res.json({
        sections: localData,
        medicationName: term,
        source: "local_database"
      });
    }

    const prompt = `Actúa como un experto farmacéutico especializado en farmacología perinatal. Proporciona información PRECISA sobre la clasificación FDA del medicamento "${term}" durante el embarazo. 

IMPORTANTE: Verifica que la categoría FDA sea correcta. Las categorías son:
- A: Seguro (estudios controlados sin riesgo)
- B: Probablemente seguro (sin evidencia de riesgo en humanos)  
- C: Precaución (riesgo no puede descartarse)
- D: Evidencia de riesgo (pero beneficio puede superar riesgo)
- X: Contraindicado (riesgo supera cualquier beneficio)

Responde en español, con el siguiente formato exacto:

Categoría FDA: [categoría]
Descripción: [descripción detallada de la categoría y el medicamento]
Riesgos: [lista de riesgos potenciales específicos]
Recomendaciones: [recomendaciones específicas para el uso en embarazo]`;

    console.log(`Consultando a Gemini sobre: ${term}`);
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }
    );
    
    // Extraer el texto de la respuesta
    const responseText = response.data.candidates[0].content.parts[0].text;
    console.log("Respuesta recibida de Gemini");
    
    // Procesar la respuesta para extraer las secciones
    const sections = responseText.split("\n").reduce((acc: any, line: string) => {
      if (line.toLowerCase().includes("categoría fda:")) {
        acc.categoria = line.split(":")[1].trim();
      } else if (line.toLowerCase().includes("descripción:")) {
        acc.descripcion = line.split(":")[1].trim();
      } else if (line.toLowerCase().includes("riesgos:")) {
        acc.riesgos = line.split(":")[1].trim();
      } else if (line.toLowerCase().includes("recomendaciones:")) {
        acc.recomendaciones = line.split(":")[1].trim();
      }
      return acc;
    }, {});
    
    res.json({ 
      sections,
      medicationName: term,
      rawText: responseText
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