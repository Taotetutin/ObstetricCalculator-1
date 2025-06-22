import React, { useState } from 'react';
import { Search, Pill, AlertTriangle, Info, Building2, Route } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';

interface FDAMedication {
  id: string;
  generic_name: string;
  brand_name: string;
  manufacturer: string;
  dosage_form: string;
  route: string;
  pregnancy_category: string;
  warnings: string;
  contraindications: string;
  adverse_reactions: string;
  pregnancy_info: string;
}

interface FDASearchResponse {
  medications: FDAMedication[];
  total: number;
  search_term: string;
  source: string;
}

export function FDADatabaseSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const { data: searchResults, isLoading, error } = useQuery<FDASearchResponse>({
    queryKey: ['/api/medications/fda-search', activeSearch],
    enabled: !!activeSearch,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setActiveSearch(searchTerm.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('A')) return 'bg-green-100 text-green-800 border-green-200';
    if (category.includes('B')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (category.includes('C')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (category.includes('D')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (category.includes('X')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('D') || category.includes('X')) {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Info className="h-4 w-4" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-blue-600" />
            Base de Datos Oficial FDA
          </CardTitle>
          <CardDescription>
            Acceso completo a todos los medicamentos aprobados por la FDA con información oficial sobre embarazo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar medicamento (ej: ibuprofen, lisinopril, metformin...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!searchTerm.trim() || isLoading}>
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Error al consultar la base de datos FDA. Intenta nuevamente.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>
              Resultados: {searchResults.total} medicamentos encontrados
            </CardTitle>
            <CardDescription>
              Búsqueda: "{searchResults.search_term}" | Fuente: {searchResults.source}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchResults.medications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron medicamentos con ese término.</p>
                <p className="text-sm">Intenta con el nombre genérico o comercial.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.medications.map((medication, index) => (
                  <Card key={medication.id || index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {medication.generic_name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Building2 className="h-4 w-4" />
                            {medication.brand_name} | {medication.manufacturer}
                          </CardDescription>
                        </div>
                        <Badge className={`${getCategoryColor(medication.pregnancy_category)} flex items-center gap-1`}>
                          {getCategoryIcon(medication.pregnancy_category)}
                          {medication.pregnancy_category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="general">General</TabsTrigger>
                          <TabsTrigger value="pregnancy">Embarazo</TabsTrigger>
                          <TabsTrigger value="warnings">Advertencias</TabsTrigger>
                          <TabsTrigger value="reactions">Reacciones</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="general" className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Forma farmacéutica:</label>
                              <p className="text-sm">{medication.dosage_form}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                <Route className="h-3 w-3" />
                                Vía de administración:
                              </label>
                              <p className="text-sm">{medication.route}</p>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="pregnancy" className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Información sobre embarazo:</label>
                            <div className="text-sm bg-gray-50 p-3 rounded-md mt-1">
                              {medication.pregnancy_info === 'No disponible' ? (
                                <p className="text-gray-500">Información específica no disponible en la etiqueta FDA</p>
                              ) : (
                                <p>{medication.pregnancy_info}</p>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="warnings" className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Advertencias:
                            </label>
                            <div className="text-sm bg-yellow-50 p-3 rounded-md mt-1 border border-yellow-200">
                              {medication.warnings === 'No disponible' ? (
                                <p className="text-gray-500">No se especifican advertencias en la etiqueta</p>
                              ) : (
                                <p>{medication.warnings.substring(0, 500)}...</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-600">Contraindicaciones:</label>
                            <div className="text-sm bg-red-50 p-3 rounded-md mt-1 border border-red-200">
                              {medication.contraindications === 'No disponible' ? (
                                <p className="text-gray-500">No se especifican contraindicaciones</p>
                              ) : (
                                <p>{medication.contraindications.substring(0, 500)}...</p>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="reactions" className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Reacciones adversas:</label>
                            <div className="text-sm bg-gray-50 p-3 rounded-md mt-1">
                              {medication.adverse_reactions === 'No disponible' ? (
                                <p className="text-gray-500">Información no disponible en la etiqueta</p>
                              ) : (
                                <p>{medication.adverse_reactions.substring(0, 500)}...</p>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}