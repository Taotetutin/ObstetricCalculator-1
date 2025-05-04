import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Pill, ShieldCheck, AlertTriangle, FileWarning, FileX, Info } from 'lucide-react';
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

export function MedicationRiskCalculator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FDACategory | 'all' | ''>('all');
  const [searchResults, setSearchResults] = useState<MedicationInfo[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<MedicationInfo | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // Realizar búsqueda combinada cuando cambia el término o la categoría
  useEffect(() => {
    // Si hay un término de búsqueda válido, priorizar búsqueda por nombre
    if (searchTerm.trim().length > 2) {
      const results = searchMedicationsByName(searchTerm);
      
      // Si además hay categoría seleccionada, filtrar resultados por categoría
      if (selectedCategory && selectedCategory !== 'all') {
        setSearchResults(results.filter(med => med.category === selectedCategory));
      } else {
        setSearchResults(results);
      }
    } 
    // Si no hay término de búsqueda pero hay categoría seleccionada
    else if (selectedCategory && selectedCategory !== 'all') {
      const results = getMedicationsByCategory(selectedCategory as FDACategory);
      setSearchResults(results);
    } 
    // Si no hay término ni categoría específica
    else {
      setSearchResults([]);
    }
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
      {/* Encabezado eliminado según instrucciones */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de búsqueda y exploración */}
        <div className="lg:col-span-1 order-1">
          <Card className="bg-blue-50/30 border-blue-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800">Buscar Medicamento</CardTitle>
              <CardDescription>
                Ingresa el nombre del medicamento o selecciona una categoría de la FDA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Buscador por nombre */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Nombre del medicamento..."
                  className="pl-9 border-blue-200"
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

              {/* Selector de categoría */}
              <div>
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value) => {
                    if (value === 'all' || value === '') {
                      setSelectedCategory(value);
                    } else {
                      setSelectedCategory(value as FDACategory);
                    }
                  }}
                >
                  <SelectTrigger className="w-full border-blue-200">
                    <SelectValue placeholder="Filtrar por categoría FDA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    <SelectItem value={FDACategory.A}>Categoría A</SelectItem>
                    <SelectItem value={FDACategory.B}>Categoría B</SelectItem>
                    <SelectItem value={FDACategory.C}>Categoría C</SelectItem>
                    <SelectItem value={FDACategory.D}>Categoría D</SelectItem>
                    <SelectItem value={FDACategory.X}>Categoría X</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Categorías de la FDA con explicación */}
              <div className="pt-2">
                <h3 className="font-medium text-blue-700 mb-2 text-sm">Categorías de la FDA</h3>
                <Accordion type="single" collapsible className="w-full bg-white rounded-lg overflow-hidden">
                  {(Object.keys(fdaCategoryDescriptions) as FDACategory[]).map((category) => (
                    <AccordionItem key={category} value={category} className="border-blue-100">
                      <AccordionTrigger className={`text-sm px-3 py-2 ${getCategoryColor(category)}`}>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <span>Categoría {category}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 py-2 text-xs text-gray-700">
                        {fdaCategoryDescriptions[category]}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>

          {/* Resultados de búsqueda - Visible solo en pantallas grandes o cuando hay resultados en móvil */}
          {(searchResults.length > 0 || !isMobile) && (
            <Card className="mt-4 border-blue-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-blue-800 text-base">
                    {searchResults.length === 0 ? "Lista de Medicamentos" : `Resultados (${searchResults.length})`}
                  </CardTitle>
                  {searchResults.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setSearchResults([]);
                      }}
                      className="text-xs h-7 px-2 text-gray-500"
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {searchResults.length > 0 ? (
                  <ScrollArea className="h-[300px] pr-4">
                    <ul className="space-y-2">
                      {searchResults.map((medication) => (
                        <li key={medication.name}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start text-left p-2 rounded-md border ${
                              selectedMedication?.name === medication.name
                                ? 'bg-blue-100 border-blue-300'
                                : 'hover:bg-blue-50 border-transparent'
                            }`}
                            onClick={() => handleSelectMedication(medication)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 flex-shrink-0">
                                {getCategoryIcon(medication.category)}
                              </div>
                              <div>
                                <p className="font-medium text-blue-700 text-sm">{medication.name}</p>
                                <div className="flex items-center mt-1">
                                  <Badge className={`text-xs ${getCategoryColor(medication.category)}`}>
                                    FDA {medication.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <AlertCircle className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm">
                      {searchTerm.length > 0 && searchTerm.length < 3
                        ? "Ingresa al menos 3 caracteres para buscar"
                        : searchTerm.length >= 3
                        ? "No se encontraron medicamentos que coincidan con tu búsqueda"
                        : "Busca un medicamento por nombre o selecciona una categoría FDA"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel de detalles del medicamento */}
        <div className="lg:col-span-2 order-2">
          <AnimatePresence mode="wait">
            {selectedMedication ? (
              <motion.div
                key="medication-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-blue-100 shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getCategoryColor(selectedMedication.category)} flex-shrink-0`}>
                          {getCategoryIcon(selectedMedication.category)}
                        </div>
                        <div>
                          <CardTitle className="text-xl text-blue-800">{selectedMedication.name}</CardTitle>
                          <CardDescription className="text-sm text-blue-700 mt-1">
                            {selectedMedication.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        className={`text-xs ${getCategoryColor(selectedMedication.category)} px-3 py-1 ml-2 flex-shrink-0`}
                      >
                        FDA Categoría {selectedMedication.category}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <Tabs defaultValue="risks" className="w-full">
                      <TabsList className="w-full justify-start bg-blue-50 rounded-none border-b border-blue-100 p-0">
                        <TabsTrigger
                          value="risks"
                          className="px-6 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:rounded-b-none"
                        >
                          Riesgos
                        </TabsTrigger>
                        <TabsTrigger
                          value="recommendations"
                          className="px-6 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:rounded-b-none"
                        >
                          Recomendaciones
                        </TabsTrigger>
                        <TabsTrigger
                          value="alternatives"
                          className="px-6 py-2.5 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:rounded-b-none"
                        >
                          Alternativas
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="risks" className="p-6">
                        <div className="space-y-4">
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
                            <h3 className="font-semibold text-yellow-800 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Resumen de seguridad
                            </h3>
                            <p className="text-sm text-yellow-700 mt-1">
                              {getSafetySummary(selectedMedication.category)}
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-blue-800 mb-2">Riesgos Potenciales</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {selectedMedication.risks}
                            </p>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-md">
                            <h3 className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-600" />
                              Detalles de la categoría
                            </h3>
                            <p className="text-sm text-gray-700">
                              {fdaCategoryDescriptions[selectedMedication.category]}
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="recommendations" className="p-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-blue-800 mb-1">Recomendaciones Clínicas</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {selectedMedication.recommendations}
                          </p>

                          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-md mt-4">
                            <h3 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-indigo-600" />
                              Consideraciones importantes
                            </h3>
                            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                              <li>Todos los medicamentos deben utilizarse solo bajo supervisión médica durante el embarazo.</li>
                              <li>El riesgo y beneficio deben ser evaluados individualmente por un profesional de la salud.</li>
                              <li>La información proporcionada tiene fines educativos y no reemplaza el consejo médico profesional.</li>
                              <li>Las necesidades médicas de la madre deben ser consideradas junto con los riesgos potenciales para el feto.</li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="alternatives" className="p-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-blue-800 mb-1">Alternativas Potenciales</h3>

                          {selectedMedication.alternatives.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                              {selectedMedication.alternatives.map((alternative, index) => (
                                <div 
                                  key={index} 
                                  className="bg-white border border-blue-100 rounded-md p-3 shadow-sm"
                                >
                                  <p className="text-gray-700 text-sm">• {alternative}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic text-sm">
                              No se han especificado alternativas para este medicamento.
                            </p>
                          )}

                          <div className="bg-blue-50 border border-blue-100 p-4 rounded-md mt-6">
                            <h3 className="font-semibold text-blue-800 mb-2">Nota importante</h3>
                            <p className="text-sm text-gray-700">
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
                    <div className="flex justify-between items-center w-full">
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
                <Card className="border-blue-100 shadow-sm h-full bg-gradient-to-br from-blue-50/70 to-indigo-50/70">
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-4">
                      <Pill className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">
                      Evaluador de Riesgos de Medicamentos durante el Embarazo
                    </h3>
                    <p className="text-gray-600 max-w-md mb-6">
                      Busca un medicamento para ver su clasificación de la FDA, análisis de riesgos, 
                      recomendaciones clínicas y posibles alternativas más seguras.
                    </p>
                    <div className="flex flex-col gap-4 items-center">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col items-center bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                          <ShieldCheck className="h-6 w-6 text-green-500 mb-1" />
                          <span className="text-xs font-medium text-green-700">Categoría A</span>
                          <span className="text-xs text-gray-500">Seguro</span>
                        </div>
                        <div className="flex flex-col items-center bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                          <FileX className="h-6 w-6 text-red-500 mb-1" />
                          <span className="text-xs font-medium text-red-700">Categoría X</span>
                          <span className="text-xs text-gray-500">Contraindicado</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 italic max-w-sm">
                        Esta herramienta proporciona información educativa basada en la clasificación de la FDA. 
                        No sustituye el consejo médico profesional.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-600">
        <h3 className="font-semibold text-blue-800 mb-2">Descargo de responsabilidad</h3>
        <p className="mb-2">
          Esta herramienta proporciona información con fines educativos y no reemplaza el consejo médico profesional. 
          Todas las decisiones sobre medicamentos durante el embarazo deben ser tomadas junto con un profesional de la salud.
        </p>
        <p>
          La información de categorías de la FDA se proporciona como referencia y puede cambiar con nuevas investigaciones. 
          Algunos medicamentos pueden tener diferentes clasificaciones según el trimestre de embarazo o la indicación específica.
        </p>
      </div>
    </div>
  );
}