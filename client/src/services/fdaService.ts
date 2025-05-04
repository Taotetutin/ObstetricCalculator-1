import axios from 'axios';
import { FDACategory, MedicationInfo } from '../data/fda-pregnancy-categories';

// Definimos la interfaz para la respuesta de la API de la FDA
interface FDAApiResponse {
  results?: Array<{
    openfda?: {
      brand_name?: string[];
      generic_name?: string[];
      substance_name?: string[];
      pharm_class_epc?: string[];
      pregnancy_category?: string[];
      route?: string[];
    };
    indications_and_usage?: string[];
    warnings?: string[];
    precautions?: string[];
    pregnancy?: string[];
    boxed_warnings?: string[];
  }>;
  error?: {
    message: string;
    code: string;
  };
}

/**
 * Busca un medicamento por nombre en la API de la FDA
 * @param medicationName Nombre del medicamento a buscar
 * @returns Promise con la información del medicamento
 */
export async function searchMedicationInFDA(medicationName: string): Promise<MedicationInfo | null> {
  try {
    // Construimos la URL para la API de la FDA
    const searchTerm = encodeURIComponent(medicationName);
    // Simplificamos la consulta para obtener mejores resultados
    // Usamos una consulta simple con el operador de aproximación (~)
    const url = `https://api.fda.gov/drug/label.json?search=${searchTerm}~&limit=5`;
    
    // Realizamos la petición
    const response = await axios.get<FDAApiResponse>(url);
    
    // Si no hay resultados, retornamos null
    if (!response.data.results || response.data.results.length === 0) {
      return null;
    }
    
    // Obtenemos el primer resultado
    const result = response.data.results[0];
    const openfda = result.openfda || {};
    
    // Extraemos la categoría de embarazo
    let category: FDACategory = FDACategory.NA;
    if (openfda.pregnancy_category && openfda.pregnancy_category.length > 0) {
      const fdaCategory = openfda.pregnancy_category[0].toUpperCase();
      switch (fdaCategory) {
        case 'A': category = FDACategory.A; break;
        case 'B': category = FDACategory.B; break;
        case 'C': category = FDACategory.C; break;
        case 'D': category = FDACategory.D; break;
        case 'X': category = FDACategory.X; break;
        default: category = FDACategory.NA;
      }
    }
    
    // Extraemos el nombre del medicamento
    const brandName = openfda.brand_name && openfda.brand_name.length > 0 
      ? openfda.brand_name[0] 
      : (openfda.generic_name && openfda.generic_name.length > 0 
        ? openfda.generic_name[0] 
        : medicationName);
    
    // Extraemos la descripción
    let description = "";
    if (openfda.pharm_class_epc && openfda.pharm_class_epc.length > 0) {
      description = openfda.pharm_class_epc
        .filter(Boolean)
        .join(". ");
    }
    
    if (openfda.route && openfda.route.length > 0) {
      if (description) description += ". ";
      description += `Vía de administración: ${openfda.route.join(", ")}.`;
    }
    
    // Extraemos información sobre riesgos
    let risks = "";
    if (result.pregnancy && result.pregnancy.length > 0) {
      risks = result.pregnancy.join(" ");
    } else if (result.warnings && result.warnings.length > 0) {
      risks = result.warnings.join(" ");
    } else if (result.precautions && result.precautions.length > 0) {
      risks = result.precautions.join(" ");
    }
    
    // Limitamos la longitud del texto para evitar textos demasiado extensos
    if (risks && risks.length > 800) {
      risks = risks.substring(0, 800) + "... (texto truncado)";
    }
    
    // Extraemos recomendaciones
    let recommendations = "";
    if (result.precautions && result.precautions.length > 0) {
      recommendations = result.precautions.join(" ");
    } else if (result.indications_and_usage && result.indications_and_usage.length > 0) {
      recommendations = "Indicaciones de uso: " + result.indications_and_usage.join(" ");
    }
    
    // Limitamos la longitud del texto para evitar textos demasiado extensos
    if (recommendations && recommendations.length > 800) {
      recommendations = recommendations.substring(0, 800) + "... (texto truncado)";
    }
    
    // Alternativas (no disponibles en la API directamente)
    const alternatives: string[] = ["Consultar con su médico para alternativas específicas"];
    
    // Construimos y retornamos el objeto MedicationInfo
    return {
      name: brandName,
      category,
      description: description || "Información no disponible en la base de datos de la FDA.",
      risks: risks || "Información no disponible en la base de datos de la FDA.",
      recommendations: recommendations || "Consulte a su médico antes de tomar este medicamento durante el embarazo.",
      alternatives,
      isFromFDA: true, // Marcamos que viene de la API de la FDA
    };
  } catch (error) {
    console.error("Error al buscar medicamento en la FDA:", error);
    return null;
  }
}

/**
 * Busca medicaciones en la API de la FDA por categoría
 * @param category Categoría de la FDA a buscar
 * @param limit Límite de resultados (por defecto 10)
 * @returns Promise con la lista de medicamentos
 */
export async function searchMedicationsByCategoryInFDA(category: FDACategory, limit: number = 10): Promise<MedicationInfo[]> {
  try {
    // Construimos la URL para la API de la FDA
    const url = `https://api.fda.gov/drug/label.json?search=openfda.pregnancy_category:"${category}"&limit=${limit}`;
    
    // Realizamos la petición
    const response = await axios.get<FDAApiResponse>(url);
    
    // Si no hay resultados, retornamos array vacío
    if (!response.data.results || response.data.results.length === 0) {
      return [];
    }
    
    // Procesamos los resultados
    const medications: MedicationInfo[] = [];
    
    for (const result of response.data.results) {
      const openfda = result.openfda || {};
      
      // Extraemos el nombre del medicamento
      let name = "Medicamento desconocido";
      if (openfda.brand_name && openfda.brand_name.length > 0) {
        name = openfda.brand_name[0];
      } else if (openfda.generic_name && openfda.generic_name.length > 0) {
        name = openfda.generic_name[0];
      } else if (openfda.substance_name && openfda.substance_name.length > 0) {
        name = openfda.substance_name[0];
      }
      
      // Extraemos la descripción
      let description = "";
      if (openfda.pharm_class_epc && openfda.pharm_class_epc.length > 0) {
        description = openfda.pharm_class_epc
          .filter(Boolean)
          .join(". ");
      }
      
      if (openfda.route && openfda.route.length > 0) {
        if (description) description += ". ";
        description += `Vía de administración: ${openfda.route.join(", ")}.`;
      }
      
      // Extraemos información sobre riesgos
      let risks = "";
      if (result.pregnancy && result.pregnancy.length > 0) {
        risks = result.pregnancy.join(" ");
      } else if (result.warnings && result.warnings.length > 0) {
        risks = result.warnings.join(" ");
      } else if (result.precautions && result.precautions.length > 0) {
        risks = result.precautions.join(" ");
      }
      
      // Limitamos la longitud del texto para evitar textos demasiado extensos
      if (risks && risks.length > 800) {
        risks = risks.substring(0, 800) + "... (texto truncado)";
      }
      
      // Extraemos recomendaciones
      let recommendations = "";
      if (result.precautions && result.precautions.length > 0) {
        recommendations = result.precautions.join(" ");
      } else if (result.indications_and_usage && result.indications_and_usage.length > 0) {
        recommendations = "Indicaciones de uso: " + result.indications_and_usage.join(" ");
      }
      
      // Limitamos la longitud del texto para evitar textos demasiado extensos
      if (recommendations && recommendations.length > 800) {
        recommendations = recommendations.substring(0, 800) + "... (texto truncado)";
      }
      
      // Alternativas (no disponibles en la API directamente)
      const alternatives: string[] = ["Consultar con su médico para alternativas específicas"];
      
      // Añadimos el medicamento a la lista
      medications.push({
        name,
        category,
        description: description || "Información no disponible en la base de datos de la FDA.",
        risks: risks || "Información no disponible en la base de datos de la FDA.",
        recommendations: recommendations || "Consulte a su médico antes de tomar este medicamento durante el embarazo.",
        alternatives,
        isFromFDA: true, // Marcamos que viene de la API de la FDA
      });
    }
    
    return medications;
  } catch (error) {
    console.error("Error al buscar medicamentos por categoría en la FDA:", error);
    return [];
  }
}