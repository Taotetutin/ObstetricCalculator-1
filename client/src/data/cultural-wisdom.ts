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
  // Latinoamérica
  {
    region: "Latinoamérica",
    culture: "Maya (Guatemala)",
    trimester: 1,
    belief: "La conexión con la Madre Tierra es vital durante el embarazo",
    practice: "Las mujeres embarazadas realizan ceremonias especiales con una comadrona tradicional (iyom) para conectar con la energía de la tierra y recibir su protección.",
    context: "En la cosmología maya, existe una fuerte relación entre la fertilidad de la mujer y la fertilidad de la tierra. Esta práctica honra esa conexión sagrada y busca armonía espiritual para la madre y el bebé.",
    source: "Prácticas tradicionales de partería maya"
  },
  {
    region: "Latinoamérica",
    culture: "Quechua (Perú)",
    trimester: 2,
    belief: "La posición del bebé puede influenciarse a través de prácticas tradicionales",
    practice: "Las parteras tradicionales realizan el 'manteo', una técnica donde se usa un chal o manta para mecer suavemente a la madre y ayudar al bebé a encontrar la posición correcta.",
    context: "Esta práctica ancestral andina se basa en el conocimiento empírico de las parteras sobre anatomía y posicionamiento fetal, y se considera un tratamiento no invasivo para corregir presentaciones fetales problemáticas.",
    source: "Medicina tradicional andina"
  },
  {
    region: "Latinoamérica",
    culture: "Mapuche (Chile)",
    trimester: 3,
    belief: "El parto es un ritual sagrado conectado con las fuerzas de la naturaleza",
    practice: "La mujer da a luz en posición vertical o de cuclillas, guiada por una machi (curandera), quien utiliza hierbas medicinales y cánticos tradicionales para facilitar el nacimiento.",
    context: "Para los Mapuche, el parto es un evento espiritual donde la mujer demuestra su conexión con la Ñuke Mapu (Madre Tierra). La posición vertical aprovecha la gravedad y permite que la mujer participe activamente en el proceso.",
    source: "Sabiduría ancestral mapuche"
  },
  
  // Asia
  {
    region: "Asia",
    culture: "China",
    trimester: 1,
    belief: "El equilibrio energético es esencial para un embarazo saludable",
    practice: "Seguir principios de alimentación basados en el balance yin-yang, evitando alimentos considerados 'fríos' y favoreciendo alimentos 'calientes' según la medicina tradicional china.",
    context: "La medicina tradicional china clasifica los alimentos según sus propiedades energéticas. Durante el embarazo, se cree que los alimentos 'fríos' pueden causar desequilibrios y afectar negativamente al feto, mientras que los alimentos 'calientes' nutren la energía vital (qi).",
    source: "Principios de medicina tradicional china"
  },
  {
    region: "Asia",
    culture: "Japón",
    trimester: 'all',
    belief: "La protección espiritual del bebé comienza desde la concepción",
    practice: "Usar un 'hara-obi', una faja tradicional que se coloca alrededor del abdomen durante el quinto mes de embarazo en una ceremonia llamada 'obi-iwai'.",
    context: "Esta tradición, que data del período Heian (794-1185), se cree que protege al bebé, apoya la espalda de la madre y previene el crecimiento excesivo del vientre. Aunque su uso diario ha disminuido, la ceremonia sigue siendo importante como ritual cultural.",
    source: "Tradiciones japonesas de embarazo"
  },
  {
    region: "Asia",
    culture: "India (Ayurveda)",
    trimester: 2,
    belief: "El desarrollo del bebé está conectado con el estado mental de la madre",
    practice: "Garbha Sanskar: practicar yoga prenatal, meditación, escuchar música clásica y leer textos sagrados para influir positivamente en el desarrollo físico y mental del bebé.",
    context: "Esta antigua tradición ayurvédica considera que las experiencias y estados mentales de la madre impactan directamente en la personalidad y salud del bebé. Se cree que estas prácticas nutren el desarrollo intelectual y espiritual del feto.",
    source: "Textos ayurvédicos sobre cuidado prenatal"
  },
  
  // África
  {
    region: "África",
    culture: "Yoruba (Nigeria)",
    trimester: 'all',
    belief: "El embarazo es un estado de vulnerabilidad espiritual que requiere protección",
    practice: "Llevar amuletos específicos y participar en rituales comunitarios de protección dirigidos por curanderos tradicionales (babalawos).",
    context: "En la tradición Yoruba, se cree que la mujer embarazada y su bebé son particularmente vulnerables a energías negativas. Estos amuletos y rituales crean un escudo espiritual que protege tanto a la madre como al bebé en desarrollo.",
    source: "Prácticas tradicionales yoruba"
  },
  {
    region: "África",
    culture: "Maasai (Kenia/Tanzania)",
    trimester: 3,
    belief: "La nutrición específica determina la fortaleza del recién nacido",
    practice: "Durante el último trimestre, las mujeres siguen una dieta específica alta en proteínas y baja en sal, y beben una mezcla de leche, sangre de vaca y hierbas medicinales.",
    context: "Esta práctica nutricional tradicional busca fortalecer a la madre para el parto y asegurar que el bebé nazca fuerte y saludable. Refleja la adaptación cultural a su entorno semiárido y estilo de vida pastoral.",
    source: "Etnografía de prácticas maasai"
  },
  
  // Europa
  {
    region: "Europa",
    culture: "Grecia Tradicional",
    trimester: 'all',
    belief: "Los antojos de la madre deben ser satisfechos para evitar marcas de nacimiento",
    practice: "Satisfacer todos los antojos alimenticios de la mujer embarazada, ya que se cree que ignorarlos puede resultar en que el bebé nazca con una marca de nacimiento con la forma del alimento deseado.",
    context: "Esta creencia, común también en otras culturas mediterráneas, refleja el reconocimiento intuitivo de las necesidades nutricionales cambiantes durante el embarazo, aunque la explicación cultural se expresa a través de esta asociación simbólica.",
    source: "Folklore griego sobre embarazo"
  },
  {
    region: "Europa",
    culture: "Sami (Norte de Escandinavia)",
    trimester: 1,
    belief: "La conexión con la naturaleza fortalece el embarazo",
    practice: "Las mujeres embarazadas pasan tiempo en lugares naturales sagrados conocidos como 'sieidi', y usan hierbas específicas recolectadas bajo la luz de ciertas fases lunares.",
    context: "La cultura Sami mantiene una profunda conexión con la naturaleza. Esta práctica refleja la creencia de que las fuerzas naturales influyen en el desarrollo del bebé y que la conexión con lugares sagrados provee protección y fuerza vital.",
    source: "Tradiciones Sami de cuidado prenatal"
  },
  
  // Oceanía
  {
    region: "Oceanía",
    culture: "Maorí (Nueva Zelanda)",
    trimester: 'all',
    belief: "El embarazo y el parto están protegidos por ancestros y divinidades",
    practice: "Recitar karakia (oraciones) y waiata (canciones) específicas, usar colgantes de pounamu (jade) y mantener prácticas de tapu (restricciones sagradas) durante el embarazo.",
    context: "Para los Maorí, el embarazo es un tiempo de gran mana (poder espiritual). Estas prácticas buscan conectar a la madre y al bebé con su whakapapa (linaje) y asegurar la protección de los ancestros y divinidades como Hine-te-iwaiwa, guardiana del parto.",
    source: "Prácticas tradicionales maorí de embarazo"
  },
  {
    region: "Oceanía",
    culture: "Aborígenes Australianos",
    trimester: 2,
    belief: "El bebé está conectado con el 'Tiempo del Sueño' y la tierra ancestral",
    practice: "Realizar ceremonias en lugares sagrados relacionados con el Tiempo del Sueño, donde las mujeres mayores cantan canciones ancestrales al bebé en desarrollo.",
    context: "En la cosmología aborigen, cada bebé está conectado con el Tiempo del Sueño (Tjukurrpa), la época de creación. Estas ceremonias fortalecen esta conexión espiritual y aseguran que el bebé nazca con un fuerte sentido de identidad cultural y pertenencia a la tierra.",
    source: "Tradiciones aborígenes de nacimiento"
  },
  
  // América del Norte
  {
    region: "América del Norte",
    culture: "Navajo (Diné)",
    trimester: 'all',
    belief: "El equilibrio, armonía y belleza (hózhǫ́) son esenciales para un embarazo saludable",
    practice: "Las mujeres embarazadas participan en ceremonias de Blessingway (Hózhǫ́ǫ́jí) conducidas por curanderas tradicionales, utilizando polen de maíz, cantos y oraciones específicas.",
    context: "En la tradición Navajo, mantener hózhǫ́ (balance, belleza y armonía) es fundamental durante el embarazo. Estas ceremonias buscan crear un camino armonioso para el bebé y fortalecer a la madre para el parto, honrando la conexión con Changing Woman, la deidad asociada con el nacimiento.",
    source: "Ceremonias tradicionales navajo"
  },
  {
    region: "América del Norte",
    culture: "Inuit (Ártico Canadiense)",
    trimester: 3,
    belief: "Ciertos comportamientos de la madre afectan directamente el carácter del bebé",
    practice: "Durante el último trimestre, las mujeres practican el silencio interior, la paciencia y evitan disgustarse, creyendo que estos estados de ánimo se transferirán al bebé.",
    context: "La tradición Inuit enfatiza la importancia del comportamiento prenatal en la formación del carácter del bebé. Esta práctica refleja una comprensión intuitiva de cómo el estado emocional de la madre puede afectar el desarrollo fetal, expresada a través de un marco cultural específico.",
    source: "Sabiduría tradicional inuit"
  },
  
  // Medio Oriente
  {
    region: "Medio Oriente",
    culture: "Beduinos (Península Arábica)",
    trimester: 'all',
    belief: "La protección contra el mal de ojo es crucial durante el embarazo",
    practice: "Usar amuletos específicos de protección como la mano de Fátima (hamsa), evitar los elogios directos sobre el embarazo, y no compartir públicamente la fecha esperada de parto.",
    context: "En la cultura beduina, existe la creencia de que la envidia, incluso involuntaria, puede causar daño a través del 'mal de ojo'. Estas prácticas protectoras buscan evitar llamar la atención sobre el embarazo y así proteger a la madre y al bebé de energías negativas.",
    source: "Tradiciones beduinas de protección maternal"
  },
  {
    region: "Medio Oriente",
    culture: "Persa (Irán)",
    trimester: 1,
    belief: "Los primeros 40 días de embarazo son especialmente delicados y requieren cuidados especiales",
    practice: "Durante este período, las mujeres consumen alimentos calientes y dulces según la medicina tradicional persa, y evitan situaciones emocionalmente perturbadoras.",
    context: "La medicina tradicional persa (Tibb) clasifica los alimentos y estados emocionales en calientes/fríos y secos/húmedos. Esta práctica busca crear el equilibrio óptimo para el desarrollo inicial del embrión, período considerado crítico para establecer un embarazo saludable.",
    source: "Medicina tradicional persa (Tibb)"
  }
];

export function getWisdomByTrimester(trimester: 1 | 2 | 3): CulturalWisdom[] {
  return culturalWisdomData.filter(wisdom => 
    wisdom.trimester === trimester || wisdom.trimester === 'all'
  );
}

export function getWisdomByRegion(region: string): CulturalWisdom[] {
  return culturalWisdomData.filter(wisdom => wisdom.region === region);
}

export function getAllRegions(): string[] {
  // Usar un enfoque alternativo para evitar problemas con Set y la compatibilidad
  const regionsObject: {[key: string]: boolean} = {};
  culturalWisdomData.forEach(wisdom => {
    regionsObject[wisdom.region] = true;
  });
  return Object.keys(regionsObject);
}

export function getRandomWisdom(): CulturalWisdom {
  const randomIndex = Math.floor(Math.random() * culturalWisdomData.length);
  return culturalWisdomData[randomIndex];
}