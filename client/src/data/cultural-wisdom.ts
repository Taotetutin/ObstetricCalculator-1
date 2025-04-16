// Datos de sabiduría cultural sobre el embarazo de diferentes comunidades globales
export type CulturalWisdom = {
  region: string;
  culture: string;
  trimester: 1 | 2 | 3 | 'all';
  belief: string;
  practice: string;
  context: string;
  source?: string;
};

export const culturalWisdomData: CulturalWisdom[] = [
  {
    region: "Latinoamérica",
    culture: "Maya",
    trimester: 'all',
    belief: "La embarazada debe evitar eclipses",
    practice: "Durante los eclipses, las mujeres embarazadas usan una llave atada con un cordón rojo en el vientre para prevenir que el feto desarrolle labio leporino.",
    context: "Basado en la creencia tradicional Maya que considera los eclipses como eventos que pueden afectar el desarrollo fetal."
  },
  {
    region: "Latinoamérica",
    culture: "Mexicana",
    trimester: 2,
    belief: "Sobada prenatal",
    practice: "Las parteras tradicionales realizan masajes abdominales suaves para acomodar al bebé y aliviar molestias durante el embarazo.",
    context: "Práctica ancestral que busca mantener la posición óptima del feto y mejorar la comodidad de la madre."
  },
  {
    region: "Asia",
    culture: "China",
    trimester: 'all',
    belief: "Balance Yin-Yang",
    practice: "Seguir una dieta equilibrada según principios de medicina tradicional china, evitando alimentos 'fríos' que podrían desequilibrar la energía.",
    context: "Parte de la medicina tradicional china que busca mantener el equilibrio energético durante el embarazo."
  },
  {
    region: "Asia",
    culture: "Japonesa",
    trimester: 1,
    belief: "Ceremonia Anzan",
    practice: "Las mujeres embarazadas usan un Hara-Obi (banda especial para embarazadas) alrededor del abdomen desde el quinto mes de embarazo.",
    context: "Esta tradición busca dar soporte físico y espiritual a la madre y al bebé, promoviendo un parto seguro."
  },
  {
    region: "África",
    culture: "Nigeria (Yoruba)",
    trimester: 'all',
    belief: "Protección comunitaria",
    practice: "La comunidad participa activamente para proteger a la madre embarazada de noticias tristes o estresantes.",
    context: "Refleja una comprensión tradicional del impacto del estrés materno en el desarrollo fetal."
  },
  {
    region: "Europa",
    culture: "Suecia",
    trimester: 3,
    belief: "Nästan",
    practice: "Preparar un nido para el bebé en casa con anticipación (aunque sin exceso) antes del nacimiento.",
    context: "Refleja la importancia del balance entre la preparación práctica y la superstición sobre no prepararse demasiado pronto."
  },
  {
    region: "Oceanía",
    culture: "Maorí (Nueva Zelanda)",
    trimester: 'all',
    belief: "Tapu y respeto",
    practice: "Enterrar la placenta (whenua) en la tierra ancestral, conectando al bebé con su herencia cultural y territorial.",
    context: "Práctica que honra la conexión entre el recién nacido, la familia y la tierra ancestral."
  },
  {
    region: "América del Norte",
    culture: "Navajo",
    trimester: 'all',
    belief: "Armonía con la naturaleza",
    practice: "Cantos y ceremonias específicas durante el embarazo para mantener el balance y la armonía en el cuerpo de la madre.",
    context: "Parte de un enfoque holístico de la salud que considera la conexión espiritual con la naturaleza."
  },
  {
    region: "Medio Oriente",
    culture: "Persa/Iraní",
    trimester: 2,
    belief: "Influencias del entorno",
    practice: "Exposición consciente a belleza y arte durante el embarazo para influir positivamente en el desarrollo del bebé.",
    context: "Basado en la creencia de que las experiencias estéticas de la madre afectan al desarrollo estético y espiritual del bebé."
  },
  {
    region: "Latinoamérica",
    culture: "Andina",
    trimester: 3,
    belief: "Preparación para el parto",
    practice: "Infusiones específicas de hierbas como la manzanilla y la salvia para preparar el cuerpo para el parto.",
    context: "Conocimiento herbolario tradicional transmitido por generaciones de parteras en la región andina."
  },
  {
    region: "Europa",
    culture: "Griega",
    trimester: 1,
    belief: "Antojos con propósito",
    practice: "Atender los antojos específicos de alimentos, considerados como señales del cuerpo sobre nutrientes necesarios.",
    context: "Sabiduría tradicional que asocia los antojos con necesidades nutricionales específicas durante el embarazo."
  },
  {
    region: "Asia",
    culture: "Indígena Filipina",
    trimester: 'all',
    belief: "Armonía con la naturaleza",
    practice: "Baños con hierbas medicinales específicas en diferentes etapas del embarazo para fortalecer a la madre y al bebé.",
    context: "Prácticas transmitidas por hilots (parteras tradicionales) que utilizan recursos naturales locales."
  },
  {
    region: "África",
    culture: "Etíope",
    trimester: 3,
    belief: "Protección y fuerza",
    practice: "Crear amuletos protectores específicos para la madre durante el último trimestre del embarazo.",
    context: "Busca proteger espiritualmente a la madre durante la fase más vulnerable del embarazo."
  },
  {
    region: "América del Norte",
    culture: "Inuit",
    trimester: 'all',
    belief: "Conexión con los ancestros",
    practice: "Nombrar al bebé en honor a ancestros recientemente fallecidos, transmitiendo sus cualidades a la nueva vida.",
    context: "Refleja una visión cíclica de la vida y la importancia de la continuidad familiar."
  },
  {
    region: "Oceanía",
    culture: "Aborigen Australiana",
    trimester: 2,
    belief: "Tiempo del Sueño",
    practice: "Contar historias del Tiempo del Sueño específicas para embarazadas, conectando al bebé con su herencia cultural antes del nacimiento.",
    context: "Parte de la transmisión de conocimiento cultural y espiritual a través de narraciones orales."
  }
];

// Función para obtener sabiduría filtrada por trimestre o región
export function getWisdomByTrimester(trimester: 1 | 2 | 3): CulturalWisdom[] {
  return culturalWisdomData.filter(item => 
    item.trimester === trimester || item.trimester === 'all'
  );
}

export function getWisdomByRegion(region: string): CulturalWisdom[] {
  return culturalWisdomData.filter(item => 
    item.region === region
  );
}

// Obtener todas las regiones disponibles
export function getAllRegions(): string[] {
  return [...new Set(culturalWisdomData.map(item => item.region))];
}

// Obtener sabiduría aleatoria (para mostrar en la página principal)
export function getRandomWisdom(): CulturalWisdom {
  const randomIndex = Math.floor(Math.random() * culturalWisdomData.length);
  return culturalWisdomData[randomIndex];
}