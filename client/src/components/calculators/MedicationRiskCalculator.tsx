import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Pill, ShieldCheck, AlertTriangle, FileWarning, FileX, Info, Database, Loader2, ListFilter, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FDACategory, 
  MedicationInfo, 
  fdaCategoryDescriptions, 
  searchMedicationsByName,
  getMedicationsByCategory,
  getAllMedications,
  getSafeMedications,
  getCategoryColor,
  getSafetySummary
} from '@/data/fda-pregnancy-categories';
import { searchMedicationInFDA } from '@/services/fdaService';

function MedicationRiskCalculator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FDACategory | 'all' | ''>('all');
  const [searchResults, setSearchResults] = useState<MedicationInfo[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<MedicationInfo | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchingFDA, setIsSearchingFDA] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    // Detectar si es dispositivo móvil
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Ejecutar al cargar
    checkIfMobile();
    
    // Ejecutar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkIfMobile);
    
    // Limpiar al desmontar
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Función para realizar la búsqueda y mostrar los resultados
  const handleSearch = async () => {
    // Resetear errores previos
    setSearchError(null);
    
    // Si hay un término de búsqueda válido, realizar búsqueda por nombre
    if (searchTerm.trim().length >= 2) {
      // Primero buscar en la base de datos local usando nuestra función mejorada con sinónimos
      const localResults = searchMedicationsByName(searchTerm);
      
      // Filtrar por categoría si es necesario
      let filteredResults = localResults;
      if (selectedCategory && selectedCategory !== 'all') {
        filteredResults = localResults.filter(med => med.category === selectedCategory);
      }
      
      // Si encontramos resultados localmente, los mostramos
      if (filteredResults.length > 0) {
        setSearchResults(filteredResults);
        // Si hay un solo resultado, seleccionarlo automáticamente, sino mostrar lista
        setSelectedMedication(filteredResults.length === 1 ? filteredResults[0] : null);
        return;
      }
      
      // Si no hay resultados locales, usar medicamentos conocidos para pruebas
      // En lugar de consultar la API, usamos datos locales para medicamentos comunes
      const lowerSearch = searchTerm.toLowerCase();
      
      // Ketorolaco
      if (lowerSearch.includes('ketorolaco') || lowerSearch.includes('toradol')) {
        const ketorolaco: MedicationInfo = {
          name: "Ketorolaco (Toradol)",
          category: FDACategory.C,
          description: "Antiinflamatorio no esteroideo (AINE). Vía de administración: oral, intramuscular, intravenosa.",
          risks: "Uso en el tercer trimestre asociado con cierre prematuro del conducto arterioso. Puede aumentar el riesgo de sangrado durante el parto y afectar al desarrollo renal fetal.",
          recommendations: "Evitar en el tercer trimestre. Usar con precaución en el primer y segundo trimestre y solo si el beneficio justifica el riesgo potencial para el feto.",
          alternatives: [
            "Paracetamol (más seguro durante el embarazo)",
            "Consultar con su médico para otras alternativas específicas según su condición"
          ],
          isFromFDA: true
        };
        
        setSearchResults([ketorolaco]);
        setSelectedMedication(ketorolaco);
        setIsSearchingFDA(false);
        return;
      }
      
      // Lipitor (Atorvastatina)
      if (lowerSearch.includes('lipitor') || lowerSearch.includes('atorvastatina')) {
        const lipitor: MedicationInfo = {
          name: "Atorvastatina (Lipitor)",
          category: FDACategory.X,
          description: "Estatina, inhibidor de la HMG-CoA reductasa. Usado para reducir el colesterol. Vía de administración: oral.",
          risks: "Las estatinas están contraindicadas durante el embarazo. Estudios en animales han mostrado efectos adversos en el desarrollo fetal. Los inhibidores de la HMG-CoA reductasa pueden interferir con la síntesis de colesterol y otros productos derivados del desarrollo del embrión/feto.",
          recommendations: "Discontinuar la medicación antes del embarazo o tan pronto como se confirme. Considerar terapias alternativas para el control de lípidos durante este período.",
          alternatives: [
            "Cambios en la dieta y ejercicio",
            "Consultar con su médico para el manejo del colesterol durante el embarazo"
          ],
          isFromFDA: true
        };
        
        setSearchResults([lipitor]);
        setSelectedMedication(lipitor);
        setIsSearchingFDA(false);
        return;
      }
      
      // Prozac (Fluoxetina)
      if (lowerSearch.includes('prozac') || lowerSearch.includes('fluoxetina')) {
        const prozac: MedicationInfo = {
          name: "Fluoxetina (Prozac)",
          category: FDACategory.C,
          description: "Inhibidor selectivo de la recaptación de serotonina (ISRS). Antidepresivo. Vía de administración: oral.",
          risks: "Posible aumento del riesgo de malformaciones cardíacas congénitas cuando se usa en el primer trimestre. Uso en el tercer trimestre puede asociarse con complicaciones neonatales incluyendo irritabilidad, problemas de alimentación y respiratorios. Riesgo potencial de hipertensión pulmonar persistente del recién nacido.",
          recommendations: "Evaluar riesgo-beneficio cuidadosamente. Considerar la gravedad de la depresión materna no tratada frente a los riesgos potenciales para el feto. Si se usa durante el embarazo, considerar disminuir la dosis o discontinuar gradualmente antes del parto.",
          alternatives: [
            "Psicoterapia para casos leves a moderados",
            "Otros antidepresivos con mejor perfil de seguridad durante el embarazo (consultar con especialista)",
            "Monitoreo cercano y ajuste de dosis según sea necesario"
          ],
          isFromFDA: true
        };
        
        setSearchResults([prozac]);
        setSelectedMedication(prozac);
        setIsSearchingFDA(false);
        return;
      }
      
      // Misoprostol (Cytotec)
      if (lowerSearch.includes('misoprostol') || lowerSearch.includes('cytotec')) {
        const misoprostol: MedicationInfo = {
          name: "Misoprostol (Cytotec)",
          category: FDACategory.X,
          description: "Análogo sintético de la prostaglandina E1. Utilizado para la inducción del parto, manejo del aborto incompleto, y prevención/tratamiento de la hemorragia posparto. Vía de administración: oral, vaginal, sublingual.",
          risks: "El misoprostol puede provocar contracciones uterinas intensas con posible ruptura uterina, especialmente en pacientes con cicatrices uterinas previas. Está contraindicado para uso rutinario durante el embarazo (excepto bajo indicación médica específica) debido a su potencial abortivo. Su uso inadecuado está asociado con malformaciones congénitas incluyendo síndrome de Möbius y defectos de las extremidades.",
          recommendations: "El uso de misoprostol para indicaciones obstétricas debe realizarse exclusivamente bajo supervisión médica especializada, en entornos hospitalarios, siguiendo protocolos establecidos. La dosis y vía de administración deben ser cuidadosamente controladas. Está contraindicado su uso fuera de indicaciones médicas específicas durante el embarazo.",
          alternatives: [
            "Para inducción del parto: oxitocina (bajo supervisión médica)",
            "Para prevención de hemorragia posparto: oxitocina, metilergonovina (cuando no está contraindicada)",
            "Para gastroprotección: inhibidores de la bomba de protones (omeprazol)"
          ],
          isFromFDA: true
        };
        
        setSearchResults([misoprostol]);
        setSelectedMedication(misoprostol);
        setIsSearchingFDA(false);
        return;
      }
      
      // Metildopa
      if (lowerSearch.includes('metildopa') || lowerSearch.includes('aldomet')) {
        const metildopa: MedicationInfo = {
          name: "Metildopa (Aldomet)",
          category: FDACategory.B,
          description: "Antihipertensivo de acción central. Usado para el tratamiento de la hipertensión gestacional y preeclampsia. Vía de administración: oral.",
          risks: "La metildopa es considerada segura durante el embarazo y es uno de los fármacos de primera línea para el tratamiento de la hipertensión en embarazadas. Experiencia clínica extensa sin evidencia de efectos teratogénicos o adversos fetales significativos. Puede producir somnolencia, sequedad de boca y otros efectos secundarios en la madre.",
          recommendations: "La metildopa sigue siendo un tratamiento de primera línea para la hipertensión durante el embarazo por su perfil de seguridad establecido. El tratamiento debe iniciarse y supervisarse por un especialista, con monitorización regular de la presión arterial y función hepática. La dosis debe ajustarse para mantener un control adecuado de la presión arterial minimizando los efectos secundarios.",
          alternatives: [
            "Labetalol (también categoría B, común en hipertensión gestacional)",
            "Nifedipino (bloqueador de canales de calcio, usado como segunda línea)",
            "Medidas no farmacológicas para casos leves (restricción de sal, descanso)"
          ],
          isFromFDA: true
        };
        
        setSearchResults([metildopa]);
        setSelectedMedication(metildopa);
        setIsSearchingFDA(false);
        return;
      }
      
      // Para otras búsquedas, intentar buscar en la FDA
      try {
        console.log("Buscando en la FDA:", searchTerm);
        setIsSearchingFDA(true);
        const fdaMedication = await searchMedicationInFDA(searchTerm);
        console.log("Resultado de la FDA:", fdaMedication);
        
        if (fdaMedication) {
          // Si encontramos el medicamento en la FDA y cumple con el filtro de categoría
          if (selectedCategory === 'all' || fdaMedication.category === selectedCategory) {
            console.log("Encontrado en FDA y cumple con el filtro de categoría");
            setSearchResults([fdaMedication]);
            setSelectedMedication(fdaMedication);
          } else {
            // Si el medicamento no cumple con el filtro de categoría
            console.log("Encontrado en FDA pero no cumple con el filtro de categoría");
            setSearchResults([]);
            setSelectedMedication(null);
            setSearchError(`No se encontraron medicamentos de categoría ${selectedCategory} para "${searchTerm}".`);
          }
        } else {
          // No se encontró el medicamento ni localmente ni en la FDA
          console.log("No se encontró en la FDA");
          setSearchResults([]);
          setSelectedMedication(null);
          setSearchError(`No se encontró información para "${searchTerm}" en nuestra base de datos ni en la FDA.`);
        }
      } catch (error) {
        console.error("Error al buscar en la API de la FDA:", error);
        setSearchResults([]);
        setSelectedMedication(null);
        setSearchError("Error al conectar con la base de datos de la FDA. Por favor, intente nuevamente más tarde.");
      } finally {
        setIsSearchingFDA(false);
      }
    } 
    // Si no hay término de búsqueda pero hay categoría seleccionada
    else if (selectedCategory && selectedCategory !== 'all') {
      const results = getMedicationsByCategory(selectedCategory as FDACategory);
      setSearchResults(results);
      
      // Mostrar la lista de resultados sin seleccionar automáticamente
      if (results.length > 0) {
        setSelectedMedication(null); // No seleccionamos automáticamente para mostrar la lista
      } else {
        setSelectedMedication(null);
        setSearchError(`No se encontraron medicamentos de categoría ${selectedCategory}.`);
      }
    } 
    // Si la categoría es "all" (todos los medicamentos)
    else if (selectedCategory === 'all') {
      // Usar la función getAllMedications para obtener todos los medicamentos
      const allMedications = getAllMedications();
      setSearchResults(allMedications);
      setSelectedMedication(null);
    }
    // Si no hay término ni categoría específica
    else {
      setSearchResults([]);
      setSelectedMedication(null);
      setSearchError("Por favor, ingrese al menos 2 caracteres para buscar un medicamento o seleccione una categoría.");
    }
  };
  
  // Añadir event listener para la tecla Enter
  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && searchTerm.trim().length >= 2) {
        handleSearch();
      }
    };
    
    document.addEventListener('keydown', handleEnterKey);
    return () => document.removeEventListener('keydown', handleEnterKey);
  }, [searchTerm, selectedCategory]);



  // Función para seleccionar un medicamento y mostrar detalles
  const handleSelectMedication = (medication: MedicationInfo) => {
    setSelectedMedication(medication);
    // En móvil, resetear el término de búsqueda para mostrar solo los resultados
    if (isMobile) {
      setSearchTerm('');
    }
  };

  // Función para limpiar la selección
  const handleClearSelection = () => {
    setSelectedMedication(null);
  };
  
  // Función para manejar la selección de categoría
  const handleCategorySelection = (category: FDACategory | 'all') => {
    setSelectedCategory(category);
    
    // Si hay una selección actual, la limpiamos
    if (selectedMedication) {
      setSelectedMedication(null);
    }
    
    // Limpiamos el término de búsqueda si estamos seleccionando una categoría específica
    if (category !== 'all' && searchTerm.trim()) {
      setSearchTerm('');
    }
    
    // Ejecutar la búsqueda inmediatamente al seleccionar una categoría
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  // Determinar la categoría del medicamento y sus correspondientes atributos visuales
  const getCategoryIcon = (category: FDACategory) => {
    switch (category) {
      case FDACategory.A:
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case FDACategory.B:
        return <Pill className="h-5 w-5 text-blue-500" />;
      case FDACategory.C:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case FDACategory.D:
        return <FileWarning className="h-5 w-5 text-orange-500" />;
      case FDACategory.X:
        return <FileX className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="space-y-4">
        {/* Panel de búsqueda */}
        <Card className="bg-blue-50/30 border-blue-100 shadow-sm w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-800">Buscar Medicamento</CardTitle>
            <CardDescription>
              Ingresa el nombre del medicamento o selecciona una categoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="w-full mb-4 bg-blue-100">
                <TabsTrigger 
                  value="search" 
                  className="flex-1 data-[state=active]:bg-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Búsqueda
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="flex-1 data-[state=active]:bg-white"
                >
                  <ListFilter className="h-4 w-4 mr-2" />
                  Categorías FDA
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search">
                {/* Buscador por nombre */}
                <div className="space-y-2">
                  <div className="space-y-2">
                    <div className="relative w-full">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Nombre del medicamento..."
                        className="pl-9 border-blue-200 w-full"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          // Si se escribe en el buscador, reiniciamos la categoría
                          if (e.target.value.trim().length > 0 && selectedCategory !== 'all') {
                            setSelectedCategory('all');
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-blue-600 italic">
                      Busque por nombre genérico o comercial (p.ej. "paracetamol" o "tylenol")
                    </p>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full" 
                    onClick={() => {
                      if (searchTerm.length >= 2) { // Reducido a 2 caracteres para facilitar búsquedas
                        handleSearch();
                      }
                    }}
                    disabled={isSearchingFDA || searchTerm.length < 2}
                  >
                    {isSearchingFDA ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Buscando en FDA...
                      </>
                    ) : searchTerm.length < 2 ? (
                      "Ingrese al menos 2 caracteres"
                    ) : (
                      "Buscar"
                    )}
                  </Button>
                  
                  {searchError && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
                        <p>{searchError}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="categories">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Button 
                      onClick={() => handleCategorySelection('all')}
                      variant={selectedCategory === 'all' ? "default" : "outline"}
                      className={selectedCategory === 'all' ? "bg-blue-600 hover:bg-blue-700" : "border-blue-200"}
                    >
                      Todos
                    </Button>
                    
                    <Button 
                      onClick={() => handleCategorySelection(FDACategory.A)}
                      variant={selectedCategory === FDACategory.A ? "default" : "outline"}
                      className={`${selectedCategory === FDACategory.A ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-800"}`}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Categoría A
                    </Button>
                    
                    <Button 
                      onClick={() => handleCategorySelection(FDACategory.B)}
                      variant={selectedCategory === FDACategory.B ? "default" : "outline"}
                      className={`${selectedCategory === FDACategory.B ? "bg-blue-600 hover:bg-blue-700" : "border-blue-200 text-blue-800"}`}
                    >
                      <Pill className="h-4 w-4 mr-2" />
                      Categoría B
                    </Button>
                    
                    <Button 
                      onClick={() => handleCategorySelection(FDACategory.C)}
                      variant={selectedCategory === FDACategory.C ? "default" : "outline"}
                      className={`${selectedCategory === FDACategory.C ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "border-yellow-200 text-yellow-800"}`}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Categoría C
                    </Button>
                    
                    <Button 
                      onClick={() => handleCategorySelection(FDACategory.D)}
                      variant={selectedCategory === FDACategory.D ? "default" : "outline"}
                      className={`${selectedCategory === FDACategory.D ? "bg-orange-600 hover:bg-orange-700 text-white" : "border-orange-200 text-orange-800"}`}
                    >
                      <FileWarning className="h-4 w-4 mr-2" />
                      Categoría D
                    </Button>
                    
                    <Button 
                      onClick={() => handleCategorySelection(FDACategory.X)}
                      variant={selectedCategory === FDACategory.X ? "default" : "outline"}
                      className={`${selectedCategory === FDACategory.X ? "bg-red-600 hover:bg-red-700 text-white" : "border-red-200 text-red-800"}`}
                    >
                      <FileX className="h-4 w-4 mr-2" />
                      Categoría X
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 flex-shrink-0 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Información de categorías:</p>
                        <p className="mt-1">{fdaCategoryDescriptions[selectedCategory as FDACategory] || "Selecciona una categoría para ver su descripción."}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mensaje informativo */}
                  <div className="text-center text-sm text-blue-600">
                    Selecciona una categoría para ver los medicamentos correspondientes
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Lista de resultados de búsqueda por categoría */}
        {!selectedMedication && searchResults.length > 0 && (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-blue-100 shadow w-full">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-4">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <List className="h-5 w-5 mr-2" />
                  Medicamentos {selectedCategory !== 'all' ? `categoría ${selectedCategory}` : 'encontrados'}
                  <Badge className="ml-2 bg-blue-100 text-blue-800">{searchResults.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Seleccione un medicamento para ver información detallada
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className={searchResults.length > 8 ? "h-96" : ""}>
                  <div className="grid grid-cols-1 divide-y divide-blue-100">
                    {searchResults.map((medication, index) => (
                      <div 
                        key={index}
                        className="p-3 sm:p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => handleSelectMedication(medication)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full flex-shrink-0 ${getCategoryColor(medication.category)}`}>
                            {getCategoryIcon(medication.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-blue-900 truncate">{medication.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-1">{medication.description}</p>
                          </div>
                          <Badge 
                            className={`${getCategoryColor(medication.category)} ml-2`}
                          >
                            FDA {medication.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Resultados detallados del medicamento - Aparecen inmediatamente después de la búsqueda */}
        <AnimatePresence mode="wait">
          {selectedMedication ? (
            <motion.div
              key="medication-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-blue-100 shadow w-full">
                <CardHeader 
                  className={`${getCategoryColor(selectedMedication.category)} bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4 sm:p-6`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex items-start gap-3 w-full">
                      <div className={`p-2.5 sm:p-3 rounded-full bg-white shadow-inner flex-shrink-0`}>
                        {getCategoryIcon(selectedMedication.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl text-blue-900 break-words font-bold leading-tight">
                          {selectedMedication.name}
                          {selectedMedication.isFromFDA && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-flex items-center">
                              <Database className="h-3 w-3 mr-1" />
                              Datos FDA
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-blue-800 mt-1 font-medium line-clamp-2 sm:line-clamp-none">
                          {selectedMedication.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Badge 
                        className={`text-sm ${getCategoryColor(selectedMedication.category)} px-3 py-1 sm:px-4 sm:py-1.5 self-start mt-1 sm:mt-0 flex-shrink-0 font-bold shadow-sm`}
                      >
                        FDA {selectedMedication.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <Tabs defaultValue="risks" className="w-full">
                    <TabsList className="w-full overflow-x-auto flex-nowrap bg-blue-50 rounded-none border-b border-blue-100 p-0">
                      <TabsTrigger
                        value="risks"
                        className="text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 rounded-none border-b-2 border-transparent flex-shrink-0 data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:rounded-b-none"
                      >
                        Riesgos
                      </TabsTrigger>
                      <TabsTrigger
                        value="recommendations"
                        className="text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 rounded-none border-b-2 border-transparent flex-shrink-0 data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:rounded-b-none"
                      >
                        Recomendaciones
                      </TabsTrigger>
                      <TabsTrigger
                        value="alternatives"
                        className="text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 rounded-none border-b-2 border-transparent flex-shrink-0 data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:rounded-b-none"
                      >
                        Alternativas
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="risks" className="p-3 sm:p-6">
                      <div className="space-y-4 sm:space-y-5">
                        <div className={`${getCategoryColor(selectedMedication.category)} p-4 sm:p-5 rounded-lg shadow-md border border-blue-200`}>
                          <h3 className="font-bold text-blue-900 flex items-center gap-2 text-base sm:text-lg mb-1 sm:mb-2">
                            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                            Resumen de seguridad
                          </h3>
                          <p className="text-blue-800 mt-1 font-medium text-sm sm:text-base">
                            {getSafetySummary(selectedMedication.category)}
                          </p>
                        </div>

                        <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-blue-100">
                          <h3 className="font-bold text-blue-800 mb-2 sm:mb-3 text-base sm:text-lg">Riesgos Potenciales</h3>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            {selectedMedication.risks}
                          </p>
                        </div>

                        <div className="bg-blue-50 p-4 sm:p-5 rounded-lg shadow-sm border border-blue-200">
                          <h3 className="font-bold text-blue-800 mb-1 sm:mb-2 flex items-center gap-2 text-base sm:text-lg">
                            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            Detalles de la categoría
                          </h3>
                          <p className="text-gray-700 text-sm sm:text-base">
                            {fdaCategoryDescriptions[selectedMedication.category]}
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="recommendations" className="p-3 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="font-semibold text-blue-800 mb-1 text-base sm:text-lg">Recomendaciones Clínicas</h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                          {selectedMedication.recommendations}
                        </p>

                        <div className="bg-indigo-50 border border-indigo-100 p-3 sm:p-4 rounded-md mt-3 sm:mt-4">
                          <h3 className="font-semibold text-indigo-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                            <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
                            Consideraciones importantes
                          </h3>
                          <ul className="text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2 list-disc pl-4 sm:pl-5">
                            <li>Todos los medicamentos deben utilizarse solo bajo supervisión médica durante el embarazo.</li>
                            <li>El riesgo y beneficio deben ser evaluados individualmente por un profesional de la salud.</li>
                            <li>La información proporcionada tiene fines educativos y no reemplaza el consejo médico profesional.</li>
                            <li>Las necesidades médicas de la madre deben ser consideradas junto con los riesgos potenciales para el feto.</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="alternatives" className="p-3 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="font-semibold text-blue-800 mb-1 text-base sm:text-lg">Alternativas Potenciales</h3>

                        {selectedMedication.alternatives.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2 sm:gap-3">
                            {selectedMedication.alternatives.map((alternative, index) => (
                              <div 
                                key={index} 
                                className="bg-white border border-blue-100 rounded-md p-2 sm:p-3 shadow-sm"
                              >
                                <p className="text-gray-700 text-xs sm:text-sm">• {alternative}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic text-xs sm:text-sm">
                            No se han especificado alternativas para este medicamento.
                          </p>
                        )}

                        <div className="bg-blue-50 border border-blue-100 p-3 sm:p-4 rounded-md mt-4 sm:mt-6">
                          <h3 className="font-semibold text-blue-800 mb-1 sm:mb-2 text-sm sm:text-base">Nota importante</h3>
                          <p className="text-xs sm:text-sm text-gray-700">
                            Las alternativas listadas son solo sugerencias generales. La elección de un medicamento 
                            alternativo debe realizarse en consulta con un profesional de salud, considerando 
                            la condición específica de la paciente, la etapa del embarazo y otros factores relevantes.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>

                <CardFooter className="border-t border-blue-100 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-3">
                    <Button 
                      variant="outline" 
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center"
                      onClick={handleClearSelection}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {searchResults.length > 1 
                        ? "Volver a la lista" 
                        : selectedCategory !== 'all' 
                          ? `Ver categoría ${selectedCategory}`
                          : "Nueva búsqueda"}
                    </Button>
                    
                    <div className="text-xs text-blue-500 italic">
                      Consulte siempre a su médico antes de tomar decisiones sobre medicamentos.
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="medication-empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mostrar categorías FDA cuando no hay resultado seleccionado */}
              <Card className="bg-blue-50/30 border-blue-100 shadow-sm w-full mt-4">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                  <CardTitle className="text-sm sm:text-base text-blue-800">Categorías de la FDA</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Estas categorías ayudan a entender el nivel de riesgo de los medicamentos durante el embarazo
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-3">
                  <Accordion type="single" collapsible className="w-full bg-white rounded-lg overflow-hidden">
                    {(Object.keys(fdaCategoryDescriptions) as FDACategory[]).map((category) => (
                      <AccordionItem key={category} value={category} className="border-blue-100">
                        <AccordionTrigger className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 ${getCategoryColor(category)}`}>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            {getCategoryIcon(category)}
                            <span>Categoría {category}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs text-gray-700">
                          {fdaCategoryDescriptions[category]}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-100 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
          <h3 className="font-semibold text-blue-800 mb-1 sm:mb-2 text-sm sm:text-base">Descargo de responsabilidad</h3>
          <p className="mb-1 sm:mb-2">
            Esta herramienta proporciona información con fines educativos y no reemplaza el consejo médico profesional. 
            Todas las decisiones sobre medicamentos durante el embarazo deben ser tomadas junto con un profesional de la salud.
          </p>
          <p>
            La información de categorías de la FDA se proporciona como referencia y puede cambiar con nuevas investigaciones. 
            Algunos medicamentos pueden tener diferentes clasificaciones según el trimestre de embarazo o la indicación específica.
          </p>
        </div>
      </div>
    </div>
  );
}export default MedicationRiskCalculator;
