import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Endpoint para buscar medicamentos en la API de la FDA
router.get('/api/medications/search', async (req, res) => {
  const { term } = req.query;
  
  if (!term || typeof term !== 'string') {
    return res.status(400).json({ error: 'Se requiere un término de búsqueda válido' });
  }
  
  try {
    // Buscar en la API de la FDA (OpenFDA) - usando términos más flexibles
    const response = await axios.get(`https://api.fda.gov/drug/label.json`, {
      params: {
        search: `openfda.brand_name:"${term}" OR openfda.generic_name:"${term}" OR openfda.substance_name:"${term}"`,
        limit: 5
      }
    });
    
    // Procesar resultados
    const results = response.data.results || [];
    
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
      };
    });
    
    res.json({ medications });
  } catch (error: any) {
    console.error('Error buscando medicamentos en la FDA API:', error.message);
    
    // Database de respaldo con medicamentos comunes para cuando la API falla
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