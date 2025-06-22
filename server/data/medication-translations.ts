// Mapeo de nombres de medicamentos español → inglés para FDA API
export const medicationTranslations: Record<string, string[]> = {
  // AINEs
  "naproxeno": ["naproxen", "naprosyn", "aleve"],
  "ibuprofeno": ["ibuprofen", "advil", "motrin"],
  "diclofenaco": ["diclofenac", "voltaren"],
  "celecoxib": ["celecoxib", "celebrex"],
  "indometacina": ["indomethacin", "indocin"],
  
  // Cardiovasculares
  "losartan": ["losartan", "cozaar"],
  "enalapril": ["enalapril", "vasotec"],
  "lisinopril": ["lisinopril", "prinivil", "zestril"],
  "amlodipino": ["amlodipine", "norvasc"],
  "metoprolol": ["metoprolol", "lopressor", "toprol"],
  "atenolol": ["atenolol", "tenormin"],
  "propranolol": ["propranolol", "inderal"],
  "nifedipino": ["nifedipine", "adalat", "procardia"],
  "hidroclorotiazida": ["hydrochlorothiazide", "microzide"],
  "furosemida": ["furosemide", "lasix"],
  
  // Antidepresivos
  "fluoxetina": ["fluoxetine", "prozac"],
  "sertralina": ["sertraline", "zoloft"],
  "paroxetina": ["paroxetine", "paxil"],
  "escitalopram": ["escitalopram", "lexapro"],
  "venlafaxina": ["venlafaxine", "effexor"],
  "bupropion": ["bupropion", "wellbutrin"],
  "amitriptilina": ["amitriptyline", "elavil"],
  
  // Antibióticos
  "amoxicilina": ["amoxicillin", "amoxil"],
  "azitromicina": ["azithromycin", "zithromax"],
  "claritromicina": ["clarithromycin", "biaxin"],
  "cefalexina": ["cephalexin", "keflex"],
  "clindamicina": ["clindamycin", "cleocin"],
  "eritromicina": ["erythromycin", "ery-tab"],
  "gentamicina": ["gentamicin", "garamycin"],
  "penicilina": ["penicillin", "pen-vk"],
  "ciprofloxacino": ["ciprofloxacin", "cipro"],
  "levofloxacino": ["levofloxacin", "levaquin"],
  
  // Diabetes
  "metformina": ["metformin", "glucophage"],
  "glibenclamida": ["glyburide", "diabeta"],
  "glimepirida": ["glimepiride", "amaryl"],
  "insulina": ["insulin", "humulin", "novolin"],
  "sitagliptina": ["sitagliptin", "januvia"],
  
  // Antihistamínicos
  "loratadina": ["loratadine", "claritin"],
  "cetirizina": ["cetirizine", "zyrtec"],
  "difenhidramina": ["diphenhydramine", "benadryl"],
  "clorfenamina": ["chlorpheniramine", "chlor-trimeton"],
  
  // Analgésicos
  "paracetamol": ["acetaminophen", "tylenol"],
  "acetaminofen": ["acetaminophen", "tylenol"],
  "tramadol": ["tramadol", "ultram"],
  "codeina": ["codeine"],
  "morfina": ["morphine"],
  
  // Corticosteroides
  "prednisona": ["prednisone", "deltasone"],
  "prednisolona": ["prednisolone", "prelone"],
  "betametasona": ["betamethasone", "celestone"],
  "dexametasona": ["dexamethasone", "decadron"],
  "hidrocortisona": ["hydrocortisone", "cortef"],
  
  // Gastrointestinales
  "omeprazol": ["omeprazole", "prilosec"],
  "lansoprazol": ["lansoprazole", "prevacid"],
  "ranitidina": ["ranitidine", "zantac"],
  "metoclopramida": ["metoclopramide", "reglan"],
  "loperamida": ["loperamide", "imodium"],
  "simeticona": ["simethicone", "gas-x"],
  
  // Antiepiléticos
  "fenitoina": ["phenytoin", "dilantin"],
  "carbamazepina": ["carbamazepine", "tegretol"],
  "valproato": ["valproic acid", "depakote"],
  "lamotrigina": ["lamotrigine", "lamictal"],
  
  // Vitaminas
  "acido folico": ["folic acid", "folate"],
  "vitamina d": ["vitamin d", "cholecalciferol"],
  "vitamina b12": ["vitamin b12", "cyanocobalamin"],
  "hierro": ["iron", "ferrous sulfate"],
  "calcio": ["calcium", "calcium carbonate"],
  
  // Hormonales
  "levotiroxina": ["levothyroxine", "synthroid"],
  "metimazol": ["methimazole", "tapazole"],
  "estradiol": ["estradiol"],
  "progesterona": ["progesterone"],
  
  // Anticoagulantes
  "warfarina": ["warfarin", "coumadin"],
  "heparina": ["heparin"],
  "enoxaparina": ["enoxaparin", "lovenox"],
  
  // Otros comunes
  "albuterol": ["albuterol", "proventil"],
  "salbutamol": ["albuterol", "proventil"],
  "digoxina": ["digoxin", "lanoxin"],
  "clonazepam": ["clonazepam", "klonopin"],
  "lorazepam": ["lorazepam", "ativan"],
  "alprazolam": ["alprazolam", "xanax"]
};

export function getEnglishNames(spanishTerm: string): string[] {
  const normalized = spanishTerm.toLowerCase().trim();
  return medicationTranslations[normalized] || [normalized];
}

export function createFDASearchQueries(spanishTerm: string): string[] {
  const englishNames = getEnglishNames(spanishTerm);
  const allNames = [spanishTerm.toLowerCase(), ...englishNames];
  
  const queries: string[] = [];
  
  // Para cada nombre, crear múltiples tipos de consulta
  allNames.forEach(name => {
    queries.push(`openfda.generic_name:"${name}"`);
    queries.push(`openfda.brand_name:"${name}"`);
    queries.push(`generic_name:"${name}"`);
    queries.push(`brand_name:"${name}"`);
  });
  
  return queries;
}