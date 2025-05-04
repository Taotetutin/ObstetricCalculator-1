import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Pill, ShieldCheck, AlertTriangle, FileWarning, FileX, Info, Database, Loader2 } from 'lucide-react';
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
  getSafeMedications,
  getCategoryColor,
  getSafetySummary
} from '@/data/fda-pregnancy-categories';
import { searchMedicationInFDA } from '@/services/fdaService';

export function MedicationRiskCalculator() {
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

  // Función para realizar la búsqueda y mostrar automáticamente el primer resultado
  const handleSearch = async () => {
    // Resetear errores previos
    setSearchError(null);
    
    // Si hay un término de búsqueda válido, realizar búsqueda por nombre
    if (searchTerm.trim().length > 2) {
      // Primero buscar en la base de datos local
      const localResults = searchMedicationsByName(searchTerm);
      
      // Filtrar por categoría si es necesario
      let filteredResults = localResults;
      if (selectedCategory && selectedCategory !== 'all') {
        filteredResults = localResults.filter(med => med.category === selectedCategory);
      }
      
      // Si encontramos resultados localmente, los mostramos
      if (filteredResults.length > 0) {
        setSearchResults(filteredResults);
        setSelectedMedication(filteredResults[0]);
        return;
      }
      
      // Si no hay resultados locales, buscar en la API de la FDA
      try {
        setIsSearchingFDA(true);
        const fdaMedication = await searchMedicationInFDA(searchTerm);
        
        if (fdaMedication) {
          // Si encontramos el medicamento en la FDA y cumple con el filtro de categoría
          if (selectedCategory === 'all' || fdaMedication.category === selectedCategory) {
            setSearchResults([fdaMedication]);
            setSelectedMedication(fdaMedication);
          } else {
            // Si el medicamento no cumple con el filtro de categoría
            setSearchResults([]);
            setSelectedMedication(null);
            setSearchError(`No se encontraron medicamentos de categoría ${selectedCategory} para "${searchTerm}".`);
          }
        } else {
          // No se encontró el medicamento ni localmente ni en la FDA
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
      
      // Seleccionar el primer resultado si existe
      if (results.length > 0) {
        setSelectedMedication(results[0]);
      } else {
        setSelectedMedication(null);
        setSearchError(`No se encontraron medicamentos de categoría ${selectedCategory}.`);
      }
    } 
    // Si no hay término ni categoría específica
    else {
      setSearchResults([]);
      setSelectedMedication(null);
      setSearchError("Por favor, ingrese al menos 3 caracteres para buscar un medicamento.");
    }
  };
  
  // Añadir event listener para la tecla Enter
  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && searchTerm.trim().length >= 3) {
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
              Ingresa el nombre del medicamento para buscar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Buscador por nombre */}
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
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white w-full" 
                onClick={() => {
                  if (searchTerm.length >= 3) {
                    handleSearch();
                  }
                }}
                disabled={isSearchingFDA}
              >
                {isSearchingFDA ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando en FDA...
                  </>
                ) : (
                  "OK"
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
          </CardContent>
        </Card>

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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
                    <Button 
                      variant="outline" 
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={handleClearSelection}
                    >
                      Volver a la búsqueda
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
}