// Base de datos esencial de medicamentos durante el embarazo
export const essentialMedications = {
  // Antifúngicos
  "clotrimazol": {
    name: "Clotrimazol",
    categoria: "Categoría B",
    descripcion: "Antifúngico tópico seguro para candidiasis vaginal durante el embarazo",
    riesgos: "Mínimos cuando se usa tópicamente. Sin absorción sistémica significativa.",
    recomendaciones: "Antifúngico de primera línea para candidiasis vaginal. Aplicar según indicaciones médicas."
  },
  "miconazol": {
    name: "Miconazol",
    categoria: "Categoría C",
    descripcion: "Antifúngico imidazólico para uso tópico",
    riesgos: "Seguro en aplicación tópica. Evitar uso sistémico durante embarazo.",
    recomendaciones: "Preferir uso tópico. Alternativa segura para infecciones fúngicas locales."
  },
  "nistatina": {
    name: "Nistatina",
    categoria: "Categoría B",
    descripcion: "Antifúngico poliénico, el más seguro durante embarazo",
    riesgos: "Prácticamente nulos. Mínima absorción sistémica.",
    recomendaciones: "Antifúngico más seguro durante embarazo. Primera opción para candidiasis oral."
  },
  "fluconazol": {
    name: "Fluconazol",
    categoria: "Categoría C",
    descripcion: "Antifúngico sistémico con uso cauteloso en embarazo",
    riesgos: "Riesgo de malformaciones con dosis altas o uso prolongado.",
    recomendaciones: "Evitar en primer trimestre. Usar solo si es esencial."
  },

  // Antibióticos básicos
  "amoxicilina": {
    name: "Amoxicilina",
    categoria: "Categoría B",
    descripcion: "Antibiótico betalactámico seguro durante todo el embarazo",
    riesgos: "Muy bajos. Antibiótico de primera línea en embarazo.",
    recomendaciones: "Antibiótico preferido durante embarazo. Seguro en todos los trimestres."
  },
  "ampicilina": {
    name: "Ampicilina",
    categoria: "Categoría B",
    descripcion: "Penicilina de amplio espectro segura en embarazo",
    riesgos: "Mínimos. Perfil de seguridad excelente.",
    recomendaciones: "Alternativa segura a amoxicilina. Usar según cultivos de sensibilidad."
  },
  "cefalexina": {
    name: "Cefalexina",
    categoria: "Categoría B",
    descripcion: "Cefalosporina de primera generación segura",
    riesgos: "Bajos. Alternativa segura para alérgicas a penicilinas.",
    recomendaciones: "Cefalosporina de elección durante embarazo."
  },
  "azitromicina": {
    name: "Azitromicina",
    categoria: "Categoría B",
    descripcion: "Macrólido seguro para infecciones respiratorias",
    riesgos: "Mínimos. Buena penetración tisular.",
    recomendaciones: "Alternativa segura para pacientes alérgicas a betalactámicos."
  },
  "eritromicina": {
    name: "Eritromicina",
    categoria: "Categoría B",
    descripcion: "Macrólido clásico seguro durante embarazo",
    riesgos: "Bajos. Puede causar molestias gastrointestinales.",
    recomendaciones: "Alternativa histórica segura. Preferir azitromicina por mejor tolerancia."
  },
  "clindamicina": {
    name: "Clindamicina",
    categoria: "Categoría B",
    descripcion: "Antibiótico lincosamida con excelente actividad contra bacterias anaerobias gram-positivas y muchas bacterias aerobias gram-positivas. Inhibe la síntesis proteica bacteriana uniéndose a la subunidad 50S del ribosoma. Tiene excelente penetración tisular, especialmente en hueso, articulaciones y abscesos.",
    riesgos: "Estudios en animales no han mostrado efectos teratogénicos. Riesgo de colitis pseudomembranosa (Clostridium difficile) en la madre. Cruza la placenta pero no se han reportado efectos adversos fetales. Compatible con lactancia materna.",
    recomendaciones: "Antibiótico seguro durante embarazo para infecciones por anaerobios. Útil en vaginosis bacteriana, infecciones dentales, osteomielitis y infecciones de tejidos blandos. Monitorear síntomas gastrointestinales. Preferir vía oral cuando sea posible."
  },

  // Analgésicos y antiinflamatorios
  "paracetamol": {
    name: "Paracetamol",
    categoria: "Categoría B",
    descripcion: "Analgésico y antipirético de primera línea en embarazo",
    riesgos: "Muy bajos cuando se usa según indicaciones.",
    recomendaciones: "Analgésico de elección durante todo el embarazo."
  },
  "acetaminofén": {
    name: "Acetaminofén",
    categoria: "Categoría B",
    descripcion: "Sinónimo de paracetamol, seguro durante embarazo",
    riesgos: "Mínimos en dosis terapéuticas normales.",
    recomendaciones: "Analgésico preferido durante embarazo."
  },
  "ibuprofeno": {
    name: "Ibuprofeno",
    categoria: "Categoría C/D",
    descripcion: "AINE con restricciones durante embarazo",
    riesgos: "Cierre prematuro ductus arterioso en tercer trimestre.",
    recomendaciones: "Evitar en tercer trimestre. Usar paracetamol como alternativa."
  },
  "aspirina": {
    name: "Aspirina",
    categoria: "Categoría C/D",
    descripcion: "Salicilato con dosis-dependiente durante embarazo",
    riesgos: "Sangrado, cierre ductus arterioso en dosis altas.",
    recomendaciones: "Solo dosis bajas (81mg) si está indicado médicamente."
  },
  "naproxeno": {
    name: "Naproxeno",
    categoria: "Categoría C/D",
    descripcion: "AINE de larga duración con restricciones",
    riesgos: "Similares a ibuprofeno, mayor duración de acción.",
    recomendaciones: "Evitar durante embarazo. Usar paracetamol."
  },
  "diclofenaco": {
    name: "Diclofenaco",
    categoria: "Categoría C/D",
    descripcion: "AINE tópico y sistémico con precauciones",
    riesgos: "Efectos similares a otros AINEs.",
    recomendaciones: "Evitar sistémico. Tópico con precaución."
  },

  // Vitaminas y suplementos
  "ácido fólico": {
    name: "Ácido Fólico",
    categoria: "Categoría A",
    descripcion: "Vitamina B9 esencial para prevenir defectos del tubo neural",
    riesgos: "Ninguno. Esencial durante embarazo.",
    recomendaciones: "Suplemento obligatorio 400-800 mcg diarios antes y durante embarazo."
  },
  "hierro": {
    name: "Sulfato Ferroso",
    categoria: "Categoría A",
    descripcion: "Suplemento de hierro para prevenir anemia",
    riesgos: "Molestias gastrointestinales leves.",
    recomendaciones: "Suplemento esencial, especialmente en segundo y tercer trimestre."
  },
  "calcio": {
    name: "Carbonato de Calcio",
    categoria: "Categoría A",
    descripcion: "Suplemento mineral para desarrollo óseo fetal",
    riesgos: "Mínimos. Puede causar estreñimiento.",
    recomendaciones: "1000-1300 mg diarios. Importante para prevenir preeclampsia."
  },
  "vitamina d": {
    name: "Vitamina D",
    categoria: "Categoría A",
    descripcion: "Vitamina liposoluble esencial para absorción de calcio",
    riesgos: "Bajos en dosis fisiológicas.",
    recomendaciones: "600-800 UI diarias. Importante para desarrollo óseo fetal."
  },

  // Antiácidos y digestivos
  "omeprazol": {
    name: "Omeprazol",
    categoria: "Categoría C",
    descripcion: "Inhibidor de bomba de protones para acidez",
    riesgos: "Datos limitados pero generalmente seguro.",
    recomendaciones: "Segunda línea después de antiácidos y modificaciones dietéticas."
  },
  "ranitidina": {
    name: "Ranitidina",
    categoria: "Categoría B",
    descripcion: "Antagonista H2 (retirado del mercado por impurezas)",
    riesgos: "Anteriormente seguro, retirado por contaminación NDMA.",
    recomendaciones: "Usar famotidina como alternativa segura."
  },
  "famotidina": {
    name: "Famotidina",
    categoria: "Categoría B",
    descripcion: "Antagonista H2 seguro para acidez",
    riesgos: "Muy bajos. Alternativa segura a ranitidina.",
    recomendaciones: "Antiácido de segunda línea seguro durante embarazo."
  },
  "antiácido": {
    name: "Hidróxido de Aluminio/Magnesio",
    categoria: "Categoría A",
    descripcion: "Antiácidos de primera línea para acidez",
    riesgos: "Mínimos. Pueden afectar absorción de otros medicamentos.",
    recomendaciones: "Primera línea para acidez. Tomar separado de otros medicamentos."
  },

  // Antialérgicos
  "loratadina": {
    name: "Loratadina",
    categoria: "Categoría B",
    descripcion: "Antihistamínico de segunda generación",
    riesgos: "Bajos. Mínima sedación.",
    recomendaciones: "Antihistamínico preferido durante embarazo."
  },
  "cetirizina": {
    name: "Cetirizina",
    categoria: "Categoría B",
    descripción: "Antihistamínico seguro con mínima sedación",
    riesgos: "Muy bajos. Alternativa segura a loratadina.",
    recomendaciones: "Antihistamínico de elección para alergias durante embarazo."
  },
  "difenhidramina": {
    name: "Difenhidramina",
    categoria: "Categoría B",
    descripcion: "Antihistamínico de primera generación",
    riesgos: "Sedación. Seguro en dosis ocasionales.",
    recomendaciones: "Útil para insomnio ocasional además de alergias."
  },

  // Relajantes musculares
  "ciclobenzaprina": {
    name: "Ciclobenzaprina",
    categoria: "Categoría B",
    descripcion: "Relajante muscular de acción central",
    riesgos: "Datos limitados en embarazo. Sedación posible.",
    recomendaciones: "Usar solo si es esencial. Preferir fisioterapia y medidas no farmacológicas."
  },
  "ciclobenzaprida": {
    name: "Ciclobenzaprina",
    categoria: "Categoría B", 
    descripcion: "Relajante muscular de acción central (nombre alternativo)",
    riesgos: "Datos limitados en embarazo. Sedación posible.",
    recomendaciones: "Usar solo si es esencial. Preferir fisioterapia y medidas no farmacológicas."
  },

  // Medicamentos para gota
  "alopurinol": {
    name: "Alopurinol",
    categoria: "Categoría C",
    descripcion: "Inhibidor de xantina oxidasa para el tratamiento de la gota",
    riesgos: "Datos limitados en embarazo. Posibles efectos teratogénicos.",
    recomendaciones: "Evitar durante embarazo salvo casos graves. Considerar medidas dietéticas."
  },

  // Antivirales
  "aciclovir": {
    name: "Aciclovir",
    categoria: "Categoría B",
    descripcion: "Antiviral para herpes simple y varicela zoster",
    riesgos: "Seguro durante embarazo. Datos extensos disponibles.",
    recomendaciones: "Antiviral de elección para infecciones herpéticas durante embarazo."
  },

  // Antihipertensivos seguros
  "metildopa": {
    name: "Metildopa",
    categoria: "Categoría B",
    descripcion: "Antihipertensivo de primera línea en embarazo",
    riesgos: "Muy seguros. Amplia experiencia en embarazo.",
    recomendaciones: "Antihipertensivo preferido durante embarazo."
  },
  "nifedipino": {
    name: "Nifedipino",
    categoria: "Categoría C",
    descripcion: "Bloqueador de canales de calcio para hipertensión",
    riesgos: "Generalmente seguro. Monitoreo de presión arterial necesario.",
    recomendaciones: "Alternativa a metildopa. Útil también para amenaza de parto prematuro."
  },
  "fluoxetina": {
    name: "Fluoxetina",
    categoria: "Categoría B",
    descripcion: "Inhibidor selectivo de la recaptación de serotonina (ISRS). Antidepresivo considerado relativamente seguro durante el embarazo según estudios epidemiológicos.",
    riesgos: "Riesgo bajo de malformaciones congénitas. Posible síndrome de abstinencia neonatal transitorio si se usa cerca del parto.",
    recomendaciones: "ISRS de elección durante embarazo si se requiere tratamiento antidepresivo. Los beneficios generalmente superan los riesgos cuando la depresión materna es significativa."
  },
  "gentamicina": {
    name: "Gentamicina",
    categoria: "Categoría C",
    descripcion: "Antibiótico aminoglucósido de uso parenteral para infecciones graves. Actúa inhibiendo la síntesis proteica bacteriana uniéndose a la subunidad 30S del ribosoma.",
    riesgos: "Riesgo de ototoxicidad y nefrotoxicidad materna. Cruza la placenta pero riesgo fetal bajo con uso corto. Evitar uso prolongado.",
    recomendaciones: "Reservar para infecciones graves cuando beneficios superen riesgos. Monitoreo de función renal y auditiva. Preferir cursos cortos."
  }
};

export function searchEssentialMedication(term: string) {
  const searchTerm = term.toLowerCase().trim();
  
  // Búsqueda directa
  if (essentialMedications[searchTerm]) {
    return essentialMedications[searchTerm];
  }
  
  // Búsqueda por sinónimos comunes
  const synonyms = {
    "acetaminofen": "paracetamol",
    "tylenol": "paracetamol",
    "advil": "ibuprofeno",
    "motrin": "ibuprofeno",
    "aleve": "naproxeno",
    "voltaren": "diclofenaco",
    "prilosec": "omeprazol",
    "zantac": "ranitidina",
    "pepcid": "famotidina",
    "maalox": "antiácido",
    "mylanta": "antiácido",
    "tums": "calcio",
    "claritin": "loratadina",
    "zyrtec": "cetirizina",
    "benadryl": "difenhidramina",
    "canesten": "clotrimazol",
    "monistat": "miconazol",
    "diflucan": "fluconazol",
    "augmentin": "amoxicilina",
    "keflex": "cefalexina",
    "zithromax": "azitromicina",
    "folato": "ácido fólico",
    "vitamina b9": "ácido fólico",
    "sulfato ferroso": "hierro",
    "carbonato de calcio": "calcio"
  };
  
  if (synonyms[searchTerm]) {
    return essentialMedications[synonyms[searchTerm]];
  }
  
  // Búsqueda parcial
  for (const [key, medication] of Object.entries(essentialMedications)) {
    if (key.includes(searchTerm) || searchTerm.includes(key)) {
      return medication;
    }
  }
  
  return null;
}