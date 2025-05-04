export enum FDACategory {
  A = "A",
  B = "B",
  C = "C",
  D = "D", 
  X = "X",
  NA = "No asignada"
}

export interface MedicationInfo {
  name: string;
  category: FDACategory;
  description: string;
  risks: string;
  recommendations: string;
  alternatives: string[];
  isFromFDA?: boolean; // Indica si los datos provienen de la API de la FDA
}

// Base de conocimiento sobre categorías de la FDA
export const fdaCategoryDescriptions: Record<FDACategory, string> = {
  [FDACategory.A]: "Estudios adecuados y bien controlados no han demostrado un riesgo para el feto en el primer trimestre del embarazo (y no hay evidencia de riesgo en trimestres posteriores).",
  [FDACategory.B]: "Estudios en animales no han demostrado un riesgo para el feto, pero no hay estudios adecuados y bien controlados en mujeres embarazadas; o estudios en animales han mostrado un efecto adverso, pero estudios adecuados y bien controlados en mujeres embarazadas no han demostrado riesgo para el feto.",
  [FDACategory.C]: "Estudios en animales han mostrado un efecto adverso en el feto, pero no hay estudios adecuados y bien controlados en humanos; o no hay estudios en animales ni en humanos. El beneficio potencial puede justificar el riesgo potencial.",
  [FDACategory.D]: "Hay evidencia positiva de riesgo fetal humano basada en datos de reacciones adversas, pero los beneficios potenciales pueden justificar el uso del medicamento en mujeres embarazadas a pesar de los riesgos.",
  [FDACategory.X]: "Estudios en animales o humanos han demostrado anormalidades fetales o hay evidencia positiva de riesgo fetal basada en reacciones adversas. Los riesgos superan claramente cualquier posible beneficio. Contraindicado en mujeres que están o pueden quedar embarazadas.",
  [FDACategory.NA]: "La FDA no ha asignado una categoría de embarazo específica para este medicamento. Se recomienda consultar con un profesional de la salud."
};

// Database of common medications with FDA pregnancy categories
export const commonMedications: MedicationInfo[] = [
  {
    name: "Paracetamol (Acetaminofén)",
    category: FDACategory.B,
    description: "Analgésico y antipirético de uso común para dolor leve a moderado y fiebre.",
    risks: "Generalmente considerado seguro durante el embarazo cuando se usa según lo prescrito. Estudios no han demostrado un aumento en el riesgo de malformaciones congénitas.",
    recommendations: "Puede usarse durante todos los trimestres del embarazo en las dosis recomendadas y por períodos limitados. Es considerado el analgésico de primera línea durante el embarazo.",
    alternatives: ["Reposo", "Terapia física", "Compresas frías o calientes"]
  },
  {
    name: "Ibuprofeno",
    category: FDACategory.C,
    description: "Antiinflamatorio no esteroideo (AINE) utilizado para dolor, inflamación y fiebre.",
    risks: "Uso durante el tercer trimestre se asocia con cierre prematuro del conducto arterioso fetal, oligohidramnios y posible prolongación del trabajo de parto. Puede aumentar el riesgo de sangrado durante el parto.",
    recommendations: "Evitar su uso durante el tercer trimestre. Durante el primer y segundo trimestre, usar sólo si es claramente necesario, a la dosis efectiva más baja y por el menor tiempo posible.",
    alternatives: ["Paracetamol", "Tratamientos no farmacológicos", "Consultar al médico para alternativas más seguras"]
  },
  {
    name: "Amoxicilina",
    category: FDACategory.B,
    description: "Antibiótico beta-lactámico de amplio espectro utilizado para tratar diversas infecciones bacterianas.",
    risks: "No se han documentado efectos adversos significativos sobre el feto. Ampliamente utilizado durante el embarazo.",
    recommendations: "Puede ser prescrito durante el embarazo cuando los beneficios superan los riesgos. Es uno de los antibióticos de primera elección en mujeres embarazadas.",
    alternatives: ["Otros antibióticos beta-lactámicos", "Consultar al médico para alternativas según el tipo de infección"]
  },
  {
    name: "Warfarina",
    category: FDACategory.X,
    description: "Anticoagulante utilizado para prevenir la formación de coágulos sanguíneos en trastornos como la fibrilación auricular.",
    risks: "Atraviesa la placenta y puede causar anomalías congénitas, especialmente durante el primer trimestre. Puede provocar hemorragia fetal y embriopatía por warfarina (hipoplasia nasal, calcificaciones epifisarias).",
    recommendations: "Contraindicada durante el embarazo, especialmente en el primer trimestre. Las mujeres en edad fértil que toman warfarina deben utilizar métodos anticonceptivos eficaces.",
    alternatives: ["Heparina de bajo peso molecular", "Heparina no fraccionada", "Monitoreo clínico estricto"]
  },
  {
    name: "Levotiroxina",
    category: FDACategory.A,
    description: "Hormona tiroidea sintética utilizada para tratar el hipotiroidismo.",
    risks: "No se han observado efectos adversos sobre el desarrollo fetal. El tratamiento adecuado del hipotiroidismo durante el embarazo es crucial para el desarrollo neurológico normal del feto.",
    recommendations: "Se debe continuar durante el embarazo, generalmente con ajustes de dosis según resultados de pruebas de función tiroidea. Esencial para mujeres con hipotiroidismo.",
    alternatives: ["No hay alternativas cuando está médicamente indicada", "El control regular de los niveles de TSH es fundamental"]
  },
  {
    name: "Fluoxetina",
    category: FDACategory.C,
    description: "Inhibidor selectivo de la recaptación de serotonina (ISRS) utilizado para tratar la depresión, trastornos de ansiedad y otros trastornos psiquiátricos.",
    risks: "Algunos estudios sugieren un pequeño aumento en el riesgo de defectos cardíacos congénitos. El uso cerca del término puede estar asociado con el síndrome de adaptación neonatal (problemas respiratorios, irritabilidad, problemas de alimentación).",
    recommendations: "La decisión de usar debe basarse en un análisis riesgo-beneficio cuidadoso. Si se necesita tratamiento para la depresión, puede considerarse después de consultar con un especialista.",
    alternatives: ["Psicoterapia", "Otros antidepresivos con mejor perfil de seguridad como sertralina", "Apoyo social", "Terapias complementarias bajo supervisión médica"]
  },
  {
    name: "Enalapril",
    category: FDACategory.D,
    description: "Inhibidor de la enzima convertidora de angiotensina (IECA) utilizado para tratar la hipertensión y la insuficiencia cardíaca.",
    risks: "El uso durante el segundo y tercer trimestre puede causar oligohidramnios, hipoplasia pulmonar, deformidades en las extremidades, hipoplasia craneal y muerte fetal/neonatal. El uso en el primer trimestre puede aumentar el riesgo de malformaciones congénitas.",
    recommendations: "Debe discontinuarse tan pronto como se confirme el embarazo. Se debe cambiar a un antihipertensivo alternativo que sea seguro durante el embarazo.",
    alternatives: ["Labetalol", "Metildopa", "Nifedipino", "Hidralazina"]
  },
  {
    name: "Metformina",
    category: FDACategory.B,
    description: "Medicamento antidiabético oral utilizado para controlar los niveles de glucosa en sangre en la diabetes tipo 2 y el síndrome de ovario poliquístico.",
    risks: "Los estudios no han demostrado un aumento en el riesgo de anomalías congénitas. Cruza la placenta, pero no se han observado efectos teratogénicos significativos.",
    recommendations: "Puede continuarse durante el embarazo para el tratamiento de la diabetes gestacional o preexistente. Puede ayudar a reducir el riesgo de diabetes gestacional en mujeres con síndrome de ovario poliquístico.",
    alternatives: ["Insulina", "Modificaciones en la dieta y ejercicio", "Monitorización estrecha de la glucosa"]
  },
  {
    name: "Aspirina (dosis bajas)",
    category: FDACategory.C,
    description: "Antiagregante plaquetario y antiinflamatorio. Las dosis bajas (75-150 mg/día) se utilizan para prevenir complicaciones en embarazos de alto riesgo.",
    risks: "A dosis bajas, el riesgo parece ser mínimo. Las dosis altas durante el tercer trimestre pueden asociarse con cierre prematuro del conducto arterioso y complicaciones hemorrágicas.",
    recommendations: "A dosis bajas, puede ser beneficiosa en mujeres con alto riesgo de preeclampsia o retraso del crecimiento intrauterino. Debe iniciarse antes de las 16 semanas y generalmente se continúa hasta las 36 semanas.",
    alternatives: ["Heparina de bajo peso molecular (para algunas indicaciones)", "Monitoreo clínico estricto"]
  },
  {
    name: "Albuterol (Salbutamol)",
    category: FDACategory.C,
    description: "Broncodilatador beta-agonista utilizado para tratar el asma y otras condiciones de las vías respiratorias.",
    risks: "No se han observado malformaciones congénitas significativas. El control del asma durante el embarazo es crucial, ya que el asma mal controlada puede representar un mayor riesgo para el feto que el medicamento.",
    recommendations: "Puede usarse durante el embarazo cuando está indicado clínicamente. Es uno de los broncodilatadores de rescate preferidos durante el embarazo.",
    alternatives: ["Otros beta-agonistas de acción corta", "Tratamiento preventivo adecuado del asma"]
  },
  {
    name: "Prednisona",
    category: FDACategory.C,
    description: "Corticosteroide utilizado para reducir la inflamación y suprimir la respuesta inmune en diversas condiciones.",
    risks: "Riesgo ligeramente aumentado de paladar hendido cuando se usa en el primer trimestre a dosis altas. Uso prolongado o dosis altas pueden asociarse con restricción del crecimiento intrauterino, bajo peso al nacer e insuficiencia suprarrenal neonatal.",
    recommendations: "Puede usarse durante el embarazo cuando los beneficios superan los riesgos. La dosis más baja efectiva durante el menor tiempo posible es el enfoque recomendado.",
    alternatives: ["Corticosteroides inhalados (para condiciones respiratorias)", "Otros inmunosupresores según la condición", "Terapias dirigidas específicas a la enfermedad"]
  },
  {
    name: "Ranitidina",
    category: FDACategory.B,
    description: "Antagonista de los receptores H2 utilizado para reducir la producción de ácido estomacal en condiciones como la enfermedad por reflujo gastroesofágico y úlceras pépticas.",
    risks: "No se han observado riesgos significativos para el feto en estudios en humanos. Ha sido ampliamente utilizado durante el embarazo.",
    recommendations: "Puede considerarse para el tratamiento de la acidez y el reflujo durante el embarazo cuando las medidas no farmacológicas son insuficientes.",
    alternatives: ["Antiácidos (calcio, magnesio)", "Medidas no farmacológicas como cambios en la dieta y estilo de vida"]
  },
  {
    name: "Ondansetrón",
    category: FDACategory.B,
    description: "Antagonista del receptor de serotonina (5-HT3) utilizado para prevenir náuseas y vómitos.",
    risks: "Algunos estudios han sugerido un pequeño aumento en el riesgo de defectos cardíacos y paladar hendido con el uso durante el primer trimestre, pero los resultados son mixtos.",
    recommendations: "Generalmente se reserva para mujeres con hiperemesis gravídica o náuseas y vómitos severos que no responden a los tratamientos de primera línea.",
    alternatives: ["Vitamina B6 (piridoxina)", "Doxilamina", "Metoclopramida", "Cambios en la dieta", "Jengibre"]
  },
  {
    name: "Isotretinoína",
    category: FDACategory.X,
    description: "Retinoide utilizado para tratar el acné severo refractario a otras terapias.",
    risks: "Alto riesgo de malformaciones congénitas graves, incluyendo anomalías craneofaciales, cardíacas, tímicas y del sistema nervioso central. También aumenta el riesgo de aborto espontáneo.",
    recommendations: "Absolutamente contraindicada durante el embarazo. Las mujeres en edad fértil deben utilizar dos métodos anticonceptivos eficaces simultáneamente durante el tratamiento y durante al menos un mes después de la interrupción.",
    alternatives: ["Antibióticos tópicos u orales", "Peróxido de benzoilo", "Retinoides tópicos (con precaución)", "Procedimientos dermatológicos"]
  },
  {
    name: "Misoprostol",
    category: FDACategory.X,
    description: "Análogo sintético de prostaglandina E1 utilizado para prevenir y tratar úlceras gástricas, y en ginecología para la maduración cervical e inducción del aborto.",
    risks: "Puede causar contracciones uterinas, sangrado, aborto espontáneo y defectos congénitos (síndrome de Möbius, defectos en extremidades) cuando se usa durante el embarazo.",
    recommendations: "Contraindicado durante el embarazo a menos que se use específicamente para la terminación del embarazo o en entornos obstétricos específicos bajo supervisión médica estricta.",
    alternatives: ["Inhibidores de la bomba de protones o antagonistas H2 (para protección gástrica)", "Otros métodos para la maduración cervical en entornos obstétricos"]
  },
  {
    name: "Clonazepam",
    category: FDACategory.D,
    description: "Benzodiazepina utilizada para tratar trastornos convulsivos, trastornos de pánico y como relajante muscular.",
    risks: "El uso durante el embarazo puede asociarse con labio/paladar hendido, especialmente si se usa en el primer trimestre. El uso cerca del parto puede causar hipotonía, depresión respiratoria y síndrome de abstinencia neonatal.",
    recommendations: "Evitar durante el embarazo si es posible, especialmente durante el primer trimestre. Si es necesario, usar la dosis más baja efectiva y evitar el uso prolongado.",
    alternatives: ["Terapia cognitivo-conductual", "Inhibidores selectivos de la recaptación de serotonina (para trastornos de ansiedad)", "Anticonvulsivos con mejor perfil de seguridad (para epilepsia)"]
  },
  // Nuevos medicamentos añadidos
  {
    name: "Omeprazol",
    category: FDACategory.C,
    description: "Inhibidor de la bomba de protones utilizado para reducir la producción de ácido gástrico en condiciones como la enfermedad por reflujo gastroesofágico y úlceras pépticas.",
    risks: "Los estudios no han demostrado un aumento claro en el riesgo de malformaciones congénitas, pero algunos estudios sugieren un posible aumento en el riesgo de asma infantil con exposición durante el embarazo.",
    recommendations: "Usar solo cuando sea médicamente necesario y los beneficios superen los riesgos. Considerar opciones con mayor historial de seguridad durante el embarazo como alternativa de primera línea.",
    alternatives: ["Antiácidos (calcio, magnesio)", "Antagonistas de los receptores H2 como ranitidina", "Cambios en la dieta y estilo de vida"]
  },
  {
    name: "Diazepam",
    category: FDACategory.D,
    description: "Benzodiazepina utilizada para tratar la ansiedad, espasmos musculares, convulsiones y síntomas de abstinencia alcohólica.",
    risks: "El uso en el primer trimestre puede asociarse con un mayor riesgo de malformaciones congénitas como labio/paladar hendido. Uso cercano al parto puede causar hipotonía, depresión respiratoria y síndrome de abstinencia neonatal.",
    recommendations: "Evitar durante el embarazo, especialmente en el primer trimestre. Si es absolutamente necesario, usar la dosis más baja efectiva por el menor tiempo posible y evitar cerca del término.",
    alternatives: ["Terapia cognitivo-conductual", "Técnicas de relajación", "Antidepresivos con mejor perfil de seguridad (para ansiedad)", "Consultar al especialista para alternativas específicas"]
  },
  {
    name: "Doxiciclina",
    category: FDACategory.D,
    description: "Antibiótico de amplio espectro del grupo de las tetraciclinas utilizado para tratar diversas infecciones bacterianas.",
    risks: "Puede causar decoloración permanente de los dientes y alteración del desarrollo óseo en el feto cuando se usa después de la semana 20 de gestación. También puede causar hepatotoxicidad materna.",
    recommendations: "Evitar durante el embarazo, especialmente después del segundo trimestre. Utilizar antibióticos alternativos con mejor perfil de seguridad durante el embarazo.",
    alternatives: ["Penicilinas", "Cefalosporinas", "Eritromicina", "Azitromicina"]
  },
  {
    name: "Loratadina",
    category: FDACategory.B,
    description: "Antihistamínico de segunda generación utilizado para tratar síntomas de alergias como rinitis alérgica y urticaria.",
    risks: "Los estudios no han demostrado un aumento en el riesgo de malformaciones congénitas. Menos sedante que los antihistamínicos de primera generación.",
    recommendations: "Puede considerarse cuando el tratamiento de los síntomas alérgicos es necesario durante el embarazo. Preferible a los antihistamínicos de primera generación.",
    alternatives: ["Cetirizina", "Medidas no farmacológicas como evitar alérgenos", "Soluciones salinas nasales para rinitis"]
  },
  {
    name: "Sertralina",
    category: FDACategory.C,
    description: "Inhibidor selectivo de la recaptación de serotonina (ISRS) utilizado para tratar la depresión, trastornos de ansiedad, trastorno obsesivo-compulsivo y trastorno de estrés postraumático.",
    risks: "Estudios no han mostrado un aumento significativo en el riesgo de malformaciones congénitas. El uso cerca del término puede estar asociado con el síndrome de adaptación neonatal (problemas respiratorios, irritabilidad, problemas de alimentación).",
    recommendations: "Cuando el tratamiento antidepresivo es necesario durante el embarazo, la sertralina es considerada una de las opciones más seguras entre los ISRS. La decisión debe basarse en un análisis riesgo-beneficio individualizado.",
    alternatives: ["Psicoterapia", "Terapia cognitivo-conductual", "Apoyo social", "Otros ISRS con perfil de seguridad similar"]
  },
  {
    name: "Metoclopramida",
    category: FDACategory.B,
    description: "Procinético y antiemético utilizado para tratar náuseas, vómitos y trastornos de la motilidad gastrointestinal.",
    risks: "No se ha demostrado un aumento en el riesgo de malformaciones congénitas. Ampliamente utilizado durante el embarazo para el tratamiento de náuseas y vómitos.",
    recommendations: "Puede usarse durante el embarazo cuando las medidas no farmacológicas son insuficientes para controlar las náuseas y vómitos. Usar la dosis efectiva más baja por el menor tiempo posible.",
    alternatives: ["Vitamina B6 (piridoxina)", "Jengibre", "Cambios en la dieta", "Doxilamina"]
  },
  {
    name: "Ciprofloxacino",
    category: FDACategory.C,
    description: "Antibiótico fluoroquinolona de amplio espectro utilizado para tratar diversas infecciones bacterianas.",
    risks: "Estudios en animales han mostrado daño al cartílago en desarrollo. Aunque los estudios en humanos no han demostrado un claro aumento en el riesgo de malformaciones, existe preocupación por los posibles efectos sobre el cartílago y las articulaciones fetales.",
    recommendations: "Evitar durante el embarazo si existen alternativas más seguras. Usar solo si el beneficio potencial justifica el riesgo potencial para el feto.",
    alternatives: ["Penicilinas", "Cefalosporinas", "Azitromicina", "Consultar al médico para alternativas específicas según el tipo de infección"]
  },
  {
    name: "Metronidazol",
    category: FDACategory.B,
    description: "Antibiótico y antiparasitario utilizado para tratar infecciones por bacterias anaerobias y ciertos parásitos.",
    risks: "Los estudios no han demostrado un aumento en el riesgo de malformaciones congénitas con el uso oral. Existe cierta preocupación sobre el uso durante el primer trimestre, pero la evidencia de riesgo no es concluyente.",
    recommendations: "El uso oral para infecciones sistémicas debe evitarse durante el primer trimestre si es posible. El tratamiento de la vaginosis bacteriana y otras infecciones puede ser necesario y los beneficios pueden superar los riesgos.",
    alternatives: ["Clindamicina (para vaginosis bacteriana)", "Amoxicilina-clavulánico (para algunas infecciones)", "Consultar al médico para alternativas específicas"]
  },
  {
    name: "Atorvastatina",
    category: FDACategory.X,
    description: "Estatina utilizada para reducir los niveles de colesterol y prevenir enfermedades cardiovasculares.",
    risks: "Las estatinas pueden interferir con la síntesis de colesterol, que es esencial para el desarrollo fetal. Existe preocupación sobre posibles anomalías congénitas y efectos adversos sobre el desarrollo fetal.",
    recommendations: "Contraindicada durante el embarazo. Debe suspenderse antes de la concepción o tan pronto como se confirme el embarazo. Las mujeres en edad fértil que toman estatinas deben utilizar métodos anticonceptivos eficaces.",
    alternatives: ["Cambios en la dieta y estilo de vida", "Resinas secuestradoras de ácidos biliares (en casos seleccionados)", "Monitoreo clínico de lípidos durante el embarazo sin tratamiento farmacológico"]
  },
  {
    name: "Hidroclorotiazida",
    category: FDACategory.C,
    description: "Diurético tiazídico utilizado para tratar la hipertensión y el edema.",
    risks: "Puede causar desequilibrios electrolíticos, disminución del volumen plasmático y reducción de la perfusión placentaria. También existe preocupación por posibles efectos sobre el metabolismo de la glucosa y los electrolitos fetales.",
    recommendations: "Generalmente no es el antihipertensivo de primera elección durante el embarazo. Usar solo cuando los beneficios superen claramente los riesgos y no haya alternativas más seguras disponibles.",
    alternatives: ["Labetalol", "Metildopa", "Nifedipino", "Hidralazina"]
  },
  {
    name: "Propranolol",
    category: FDACategory.C,
    description: "Betabloqueante no selectivo utilizado para tratar la hipertensión, arritmias, migraña, temblor esencial y ansiedad situacional.",
    risks: "Uso durante el segundo y tercer trimestre puede asociarse con restricción del crecimiento intrauterino, bradicardia fetal e hipoglucemia neonatal. El uso durante el trabajo de parto puede causar depresión respiratoria neonatal.",
    recommendations: "Puede usarse durante el embarazo cuando está médicamente indicado y los beneficios superan los riesgos. Monitoreo fetal y neonatal estricto es recomendado.",
    alternatives: ["Labetalol", "Metildopa", "Betabloqueantes más selectivos como metoprolol"]
  },
  {
    name: "Valproato de sodio",
    category: FDACategory.X,
    description: "Anticonvulsivo y estabilizador del estado de ánimo utilizado para tratar la epilepsia, trastorno bipolar y migraña.",
    risks: "Alto riesgo de malformaciones congénitas (10-20%), incluyendo defectos del tubo neural, cardíacos, craneofaciales y de las extremidades. También se asocia con deterioro cognitivo y trastornos del espectro autista en niños expuestos prenatalmente.",
    recommendations: "Debe evitarse durante el embarazo, especialmente durante el primer trimestre. Las mujeres en edad fértil con epilepsia deben considerar alternativas terapéuticas antes de quedar embarazadas y utilizar métodos anticonceptivos eficaces.",
    alternatives: ["Lamotrigina", "Levetiracetam", "Oxcarbazepina", "Consulta con neurólogo para ajuste de tratamiento antiepiléptico"]
  },
  {
    name: "Insulina",
    category: FDACategory.A,
    description: "Hormona utilizada para el tratamiento de la diabetes mellitus para controlar los niveles de glucosa en sangre.",
    risks: "No atraviesa la placenta en cantidades significativas y no se han observado efectos teratogénicos. El control adecuado de la glucemia durante el embarazo es crucial para prevenir complicaciones maternas y fetales.",
    recommendations: "Medicamento de elección para el tratamiento de la diabetes durante el embarazo. Las necesidades de insulina generalmente aumentan durante el embarazo y requieren ajustes frecuentes.",
    alternatives: ["En algunos casos, metformina puede ser una opción para la diabetes gestacional", "Control estricto de la dieta y ejercicio como complemento al tratamiento"]
  },
  {
    name: "Azitromicina",
    category: FDACategory.B,
    description: "Antibiótico macrólido de amplio espectro utilizado para tratar diversas infecciones bacterianas como infecciones respiratorias, de la piel y transmitidas sexualmente.",
    risks: "Los estudios no han demostrado un aumento en el riesgo de malformaciones congénitas. Ha sido ampliamente utilizado durante el embarazo.",
    recommendations: "Puede ser prescrito durante el embarazo cuando está indicado clínicamente. Es una alternativa para pacientes alérgicas a penicilinas para muchas infecciones.",
    alternatives: ["Amoxicilina", "Cefalosporinas", "Consultar al médico para alternativas específicas según el tipo de infección"]
  },
  // Más antiinflamatorios
  {
    name: "Naproxeno",
    category: FDACategory.C,
    description: "Antiinflamatorio no esteroideo (AINE) utilizado para reducir el dolor, la inflamación y la fiebre.",
    risks: "Similar a otros AINE, su uso durante el tercer trimestre se asocia con cierre prematuro del conducto arterioso fetal, oligohidramnios y complicaciones en el parto. Puede aumentar el riesgo de sangrado.",
    recommendations: "Evitar durante el tercer trimestre. En el primer y segundo trimestre, usar solo si es claramente necesario, a la dosis más baja efectiva y por el menor tiempo posible.",
    alternatives: ["Paracetamol", "Tratamientos no farmacológicos para el dolor", "Consultar con el médico para alternativas más seguras"]
  },
  {
    name: "Diclofenaco",
    category: FDACategory.C,
    description: "Antiinflamatorio no esteroideo (AINE) potente utilizado para tratar el dolor articular, muscular y la inflamación.",
    risks: "Uso en el tercer trimestre puede causar cierre prematuro del conducto arterioso fetal y disfunción renal fetal. Puede prolongar el trabajo de parto y aumentar el sangrado durante el parto.",
    recommendations: "Contraindicado durante el tercer trimestre. Usar con precaución durante el primer y segundo trimestre solo si es claramente necesario y por períodos breves.",
    alternatives: ["Paracetamol", "Terapia física", "Compresas de calor/frío", "Modificaciones en la actividad"]
  },
  {
    name: "Celecoxib",
    category: FDACategory.C,
    description: "Inhibidor selectivo de la COX-2 utilizado para el dolor e inflamación en artritis y otras condiciones inflamatorias crónicas.",
    risks: "Como otros AINE, puede causar cierre prematuro del conducto arterioso fetal cuando se usa en el tercer trimestre. Menos datos disponibles que con AINE tradicionales, pero se presumen riesgos similares.",
    recommendations: "Evitar durante el tercer trimestre. Durante el primer y segundo trimestre, considerar solo cuando los beneficios superan los riesgos y no hay alternativas más seguras disponibles.",
    alternatives: ["Paracetamol", "AINE de menor riesgo como ibuprofeno en dosis bajas (antes del tercer trimestre)", "Terapias no farmacológicas"]
  },
  // Más antibióticos
  {
    name: "Eritromicina",
    category: FDACategory.B,
    description: "Antibiótico macrólido utilizado para tratar diversas infecciones bacterianas, especialmente infecciones respiratorias y de la piel.",
    risks: "No se ha demostrado un aumento en el riesgo de malformaciones congénitas, aunque algunos estudios han sugerido un pequeño aumento en el riesgo de estenosis pilórica infantil con el uso durante el embarazo temprano.",
    recommendations: "Puede ser prescrito durante el embarazo cuando está indicado clínicamente. Es una alternativa para pacientes alérgicas a penicilinas.",
    alternatives: ["Amoxicilina", "Cefalosporinas", "Azitromicina", "Clindamicina (para algunas indicaciones)"]
  },
  {
    name: "Ceftriaxona",
    category: FDACategory.B,
    description: "Antibiótico cefalosporina de tercera generación de amplio espectro utilizado para infecciones graves como neumonía, meningitis e infecciones del tracto urinario complicadas.",
    risks: "Los estudios no han demostrado un aumento en el riesgo de malformaciones congénitas. Las cefalosporinas son generalmente consideradas seguras durante el embarazo.",
    recommendations: "Puede ser utilizada durante el embarazo cuando está médicamente indicada, especialmente para infecciones graves que requieren tratamiento parenteral.",
    alternatives: ["Otras cefalosporinas", "Ampicilina (para algunas indicaciones)", "Consultar al médico para alternativas específicas según el tipo de infección"]
  },
  {
    name: "Clindamicina",
    category: FDACategory.B,
    description: "Antibiótico utilizado para tratar infecciones causadas por bacterias anaerobias y algunas bacterias Gram-positivas, incluyendo infecciones de la piel, tejidos blandos y vaginosis bacteriana.",
    risks: "No se ha demostrado un aumento en el riesgo de malformaciones congénitas con su uso durante el embarazo.",
    recommendations: "Puede ser prescrita durante el embarazo cuando está indicada clínicamente. Es una opción para el tratamiento de la vaginosis bacteriana durante el embarazo.",
    alternatives: ["Metronidazol", "Cefalosporinas", "Eritromicina", "Consultar al médico para alternativas según el tipo de infección"]
  },
  // Antivirales
  {
    name: "Aciclovir",
    category: FDACategory.B,
    description: "Antiviral utilizado para tratar infecciones por virus del herpes simple, herpes zóster y varicela zóster.",
    risks: "Ampliamente utilizado durante el embarazo sin evidencia de aumento en malformaciones congénitas. El registro de embarazos con aciclovir no ha mostrado un aumento en los defectos congénitos.",
    recommendations: "Puede ser utilizado durante el embarazo cuando está clínicamente indicado, especialmente para el tratamiento del herpes genital primario o recurrente severo.",
    alternatives: ["Valaciclovir", "Tratamiento tópico para lesiones externas leves", "Manejo expectante para casos leves"]
  },
  {
    name: "Oseltamivir",
    category: FDACategory.C,
    description: "Antiviral utilizado para el tratamiento y la prevención de la influenza A y B.",
    risks: "Datos limitados en embarazadas, pero los estudios observacionales no han demostrado un aumento en el riesgo de malformaciones congénitas. La gripe durante el embarazo puede causar complicaciones graves para la madre y el feto.",
    recommendations: "Puede usarse durante el embarazo cuando está clínicamente indicado, especialmente para el tratamiento de la influenza confirmada o sospechada, ya que los beneficios suelen superar los riesgos potenciales.",
    alternatives: ["Zanamivir (inhalado)", "Vacunación contra la influenza como prevención", "Medidas de soporte"]
  },
  {
    name: "Valaciclovir",
    category: FDACategory.B,
    description: "Profármaco del aciclovir, utilizado para el tratamiento de infecciones por herpes simple, herpes zóster y prevención del herpes genital recurrente.",
    risks: "Similar al aciclovir, no se ha demostrado un aumento en el riesgo de malformaciones congénitas. Se convierte en aciclovir en el cuerpo, que tiene un largo historial de uso seguro durante el embarazo.",
    recommendations: "Puede ser utilizado durante el embarazo cuando está indicado clínicamente. Mejor biodisponibilidad que el aciclovir, lo que permite una dosificación menos frecuente.",
    alternatives: ["Aciclovir", "Tratamiento tópico para lesiones externas leves", "Manejo expectante para casos leves"]
  },
  // Antiinflamatorios esteroideos (corticosteroides)
  {
    name: "Dexametasona",
    category: FDACategory.C,
    description: "Corticosteroide potente utilizado para reducir la inflamación y suprimir el sistema inmunitario. En obstetricia, se usa para acelerar la maduración pulmonar fetal en casos de parto prematuro inminente.",
    risks: "Uso prolongado o a dosis altas puede asociarse con bajo peso al nacer, insuficiencia suprarrenal neonatal y posiblemente un pequeño aumento en el riesgo de paladar hendido cuando se usa en el primer trimestre.",
    recommendations: "Los beneficios de su uso para maduración pulmonar fetal entre las semanas 24-34 superan ampliamente los riesgos. Para otras indicaciones, usar solo cuando sea claramente necesario.",
    alternatives: ["Betametasona (para maduración pulmonar fetal)", "Otros corticosteroides menos potentes", "Tratamientos no esteroideos según la condición"]
  },
  {
    name: "Betametasona",
    category: FDACategory.C,
    description: "Corticosteroide potente utilizado principalmente en obstetricia para acelerar la maduración pulmonar fetal en casos de riesgo de parto prematuro.",
    risks: "Similar a otros corticosteroides, pero los beneficios para la maduración pulmonar fetal superan ampliamente los riesgos. El uso prolongado puede asociarse con restricción del crecimiento intrauterino.",
    recommendations: "Recomendada para maduración pulmonar fetal entre las semanas 24-34 de gestación cuando hay riesgo de parto prematuro. El régimen estándar consiste en dos dosis con 24 horas de diferencia.",
    alternatives: ["Dexametasona", "Para otras indicaciones no obstétricas, considerar corticosteroides menos potentes o tratamientos no esteroideos"]
  },
  {
    name: "Ketoprofeno",
    category: FDACategory.C,
    description: "Antiinflamatorio no esteroideo (AINE) utilizado para aliviar el dolor y la inflamación en diversas condiciones. Vía de administración: oral, tópica.",
    risks: "Como otros AINEs, su uso en el tercer trimestre se asocia con cierre prematuro del conducto arterioso fetal y posible prolongación del trabajo de parto. También puede aumentar el riesgo de sangrado durante el parto y afectar la función renal fetal y neonatal.",
    recommendations: "Evitar completamente durante el tercer trimestre. Durante el primer y segundo trimestre, usar sólo si es estrictamente necesario, a la dosis efectiva más baja y por el menor tiempo posible. Preferible usar alternativas más seguras cuando sea posible.",
    alternatives: [
      "Paracetamol (más seguro durante todo el embarazo)",
      "Medidas no farmacológicas: terapia física, compresas frías/calientes",
      "Consultar al médico para alternativas específicas según la condición"
    ]
  },
];

// Función para buscar medicamentos por nombre (inclusivo)
// Mapa de sinónimos para facilitar búsquedas comunes
const medicationSynonyms: Record<string, string[]> = {
  "ketoprofeno": ["keto", "ketonal", "profenid"],
  "paracetamol": ["acetaminofen", "tylenol", "acetaminofeno", "tempra", "panadol"],
  "ibuprofeno": ["ibu", "advil", "motrin", "nurofen", "buprex"],
  "amoxicilina": ["amox", "amoxil", "amoxidal"],
  "aspirina": ["asa", "ácido acetilsalicílico", "bayaspirina", "adiro"],
  "ondansetrón": ["ondasetron", "zofran"],
  "warfarina": ["coumadin"],
  "metformina": ["glucophage"],
  "omeprazol": ["omepral", "losec", "prilosec"],
  "diazepam": ["valium"],
  "fluoxetina": ["prozac"],
  "atorvastatina": ["lipitor"],
  "misoprostol": ["cytotec"],
  "metildopa": ["aldomet"]
};

// Función auxiliar para buscar medicamentos por nombre, incluyendo sinónimos
function findMedicationsByTerms(searchTerm: string): MedicationInfo[] {
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  if (!normalizedSearchTerm || normalizedSearchTerm.length < 2) {
    return [];
  }
  
  // Buscar medicamentos cuyo nombre incluya el término de búsqueda
  const directMatches = commonMedications.filter(med => 
    med.name.toLowerCase().includes(normalizedSearchTerm)
  );
  
  // Si ya tenemos resultados directos, los devolvemos
  if (directMatches.length > 0) {
    return directMatches;
  }
  
  // Si no hay resultados directos, buscar por sinónimos
  const matchedMedications = new Set<MedicationInfo>();
  
  // Buscar en el mapa de sinónimos - permitir coincidencias de solo 2 caracteres
  for (const [genericName, synonyms] of Object.entries(medicationSynonyms)) {
    if (synonyms.some(synonym => synonym.includes(normalizedSearchTerm)) || 
        genericName.includes(normalizedSearchTerm)) {
      // Buscar el medicamento genérico correspondiente
      const medication = commonMedications.find(med => 
        med.name.toLowerCase().includes(genericName)
      );
      if (medication) {
        matchedMedications.add(medication);
      }
    }
  }
  
  return Array.from(matchedMedications);
}

export function searchMedicationsByName(searchTerm: string): MedicationInfo[] {
  return findMedicationsByTerms(searchTerm);
}

// Función para obtener medicamentos por categoría
export function getMedicationsByCategory(category: FDACategory): MedicationInfo[] {
  return commonMedications.filter(med => med.category === category);
}

// Función para obtener todos los medicamentos
export function getAllMedications(): MedicationInfo[] {
  return [...commonMedications];
}

// Función para obtener medicamentos seguros (categoría A o B)
export function getSafeMedications(): MedicationInfo[] {
  return commonMedications.filter(med => 
    med.category === FDACategory.A || med.category === FDACategory.B
  );
}

// Función para obtener un medicamento específico por nombre exacto
export function getMedicationByName(name: string): MedicationInfo | undefined {
  return commonMedications.find(med => 
    med.name.toLowerCase() === name.toLowerCase()
  );
}

// Función para obtener alternativas seguras para un medicamento dado
export function getSafeAlternatives(medication: MedicationInfo): MedicationInfo[] {
  // Si el medicamento ya es seguro (categoría A o B), no necesita alternativas
  if (medication.category === FDACategory.A || medication.category === FDACategory.B) {
    return [];
  }
  
  // Buscar medicamentos similares (basados en palabras clave de la descripción) 
  // pero que sean más seguros
  const keywords = medication.description.toLowerCase().split(' ')
    .filter(word => word.length > 4) // Palabras más largas suelen ser más significativas
    .map(word => word.replace(/[,.;()]/g, '')); // Quitar signos de puntuación
  
  return commonMedications.filter(med => 
    (med.category === FDACategory.A || med.category === FDACategory.B) &&
    med.name !== medication.name &&
    keywords.some(keyword => 
      med.description.toLowerCase().includes(keyword)
    )
  );
}

// Obtener el color asociado a una categoría de la FDA
export function getCategoryColor(category: FDACategory): string {
  switch (category) {
    case FDACategory.A:
      return "bg-green-100 text-green-800 border-green-200";
    case FDACategory.B:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case FDACategory.C:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case FDACategory.D:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case FDACategory.X:
      return "bg-red-100 text-red-800 border-red-200";
    case FDACategory.NA:
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Obtener un resumen de seguridad basado en la categoría
export function getSafetySummary(category: FDACategory): string {
  switch (category) {
    case FDACategory.A:
      return "Seguro durante el embarazo según estudios controlados en humanos.";
    case FDACategory.B:
      return "Probablemente seguro, sin evidencia de riesgo en humanos, pero estudios limitados.";
    case FDACategory.C:
      return "Use con precaución. El riesgo no puede descartarse. Use solo si el beneficio potencial justifica el riesgo.";
    case FDACategory.D:
      return "Evidencia de riesgo fetal. Use solo en situaciones graves si no hay alternativas más seguras.";
    case FDACategory.X:
      return "Contraindicado en el embarazo. Riesgos que superan claramente cualquier beneficio potencial.";
    case FDACategory.NA:
    default:
      return "Categoría no asignada por la FDA. Consulte con su médico para evaluar riesgos.";
  }
}