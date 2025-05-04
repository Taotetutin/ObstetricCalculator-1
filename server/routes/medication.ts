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
    // Buscar en la API de la FDA (OpenFDA)
    const response = await axios.get(`https://api.fda.gov/drug/label.json`, {
      params: {
        search: `(openfda.brand_name:"${term}" OR openfda.generic_name:"${term}" OR openfda.substance_name:"${term}")`,
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
    
    // Manejar caso donde no hay resultados
    if (error.response && error.response.status === 404) {
      return res.json({ medications: [] });
    }
    
    res.status(500).json({ error: 'Error al buscar medicamentos. Inténtelo de nuevo más tarde.' });
  }
});

export default router;