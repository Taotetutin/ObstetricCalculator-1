import React, { useState } from 'react';
import { Search, Pill, AlertTriangle, Info, Building2, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ComprehensiveFDASearchProps {
  onMedicationSelect?: (medication: any) => void;
}

export function ComprehensiveFDASearch({ onMedicationSelect }: ComprehensiveFDASearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setSearchPerformed(true);
    
    try {
      // Search both FDA and our enhanced database
      const [fdaResponse, localResponse] = await Promise.allSettled([
        fetch(`/api/medications/fda-search/${encodeURIComponent(searchTerm.trim())}?limit=10`),
        fetch('/api/medications/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ term: searchTerm.trim() })
        })
      ]);

      const combinedResults = [];

      // Add FDA results if available
      if (fdaResponse.status === 'fulfilled' && fdaResponse.value.ok) {
        const fdaData = await fdaResponse.value.json();
        if (fdaData.medications && fdaData.medications.length > 0) {
          combinedResults.push(...fdaData.medications.map((med: any) => ({
            ...med,
            source: 'FDA Official',
            search_relevance: 'high'
          })));
        }
      }

      // Add local/Gemini result if available and not duplicate
      if (localResponse.status === 'fulfilled' && localResponse.value.ok) {
        const localData = await localResponse.value.json();
        if (localData.name) {
          const isDuplicate = combinedResults.some(med => 
            med.generic_name?.toLowerCase().includes(localData.name.toLowerCase()) ||
            med.brand_name?.toLowerCase().includes(localData.name.toLowerCase())
          );
          
          if (!isDuplicate) {
            combinedResults.push({
              id: `local_${localData.name}`,
              generic_name: localData.name,
              brand_name: localData.name,
              pregnancy_category: localData.categoria,
              pregnancy_info: localData.riesgos,
              warnings: localData.recomendaciones,
              source: localData.source === 'essential' ? 'Base Local Curada' : 'Análisis IA',
              search_relevance: localData.source === 'essential' ? 'very_high' : 'medium'
            });
          }
        }
      }

      setResults(combinedResults);

      if (combinedResults.length === 0) {
        toast({
          title: "Sin resultados",
          description: "No se encontraron medicamentos. Intenta con el nombre genérico o comercial.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Búsqueda completada",
          description: `Se encontraron ${combinedResults.length} medicamentos.`,
        });
      }

    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo completar la búsqueda. Verifica tu conexión.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCategoryColor = (category: string) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    if (category.includes('A')) return 'bg-green-100 text-green-800';
    if (category.includes('B')) return 'bg-blue-100 text-blue-800';
    if (category.includes('C')) return 'bg-yellow-100 text-yellow-800';
    if (category.includes('D')) return 'bg-orange-100 text-orange-800';
    if (category.includes('X')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getSourceIcon = (source: string) => {
    if (source === 'FDA Official') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (source === 'Base Local Curada') return <CheckCircle className="h-4 w-4 text-blue-600" />;
    return <Info className="h-4 w-4 text-gray-600" />;
  };

  const getRelevanceColor = (relevance: string) => {
    if (relevance === 'very_high') return 'border-l-green-500';
    if (relevance === 'high') return 'border-l-blue-500';
    return 'border-l-yellow-500';
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-blue-600" />
            Búsqueda Completa de Medicamentos
          </CardTitle>
          <CardDescription>
            Acceso a base de datos FDA oficial + análisis especializado para embarazo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar medicamento (ej: metformina, losartán, fluoxetina...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!searchTerm.trim() || isLoading}>
              {isLoading ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchPerformed && (
        <Card>
          <CardHeader>
            <CardTitle>
              {results.length > 0 ? `${results.length} medicamentos encontrados` : 'Sin resultados'}
            </CardTitle>
            {results.length > 0 && (
              <CardDescription>
                Resultados de múltiples fuentes oficiales y especializadas
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron medicamentos con ese término.</p>
                <p className="text-sm">Intenta con diferentes variantes del nombre.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((medication, index) => (
                  <Card 
                    key={medication.id || index} 
                    className={`border-l-4 ${getRelevanceColor(medication.search_relevance)} cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => onMedicationSelect?.(medication)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getSourceIcon(medication.source)}
                            <Badge variant="outline" className="text-xs">
                              {medication.source}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">
                            {medication.generic_name || 'No disponible'}
                          </CardTitle>
                          {medication.brand_name && medication.brand_name !== medication.generic_name && (
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Building2 className="h-4 w-4" />
                              {medication.brand_name}
                              {medication.manufacturer && ` | ${medication.manufacturer}`}
                            </CardDescription>
                          )}
                        </div>
                        {medication.pregnancy_category && (
                          <Badge className={`${getCategoryColor(medication.pregnancy_category)} flex items-center gap-1`}>
                            {medication.pregnancy_category.includes('D') || medication.pregnancy_category.includes('X') ? (
                              <AlertTriangle className="h-3 w-3" />
                            ) : (
                              <Info className="h-3 w-3" />
                            )}
                            {medication.pregnancy_category}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {medication.dosage_form && (
                          <div className="text-sm">
                            <span className="font-medium">Forma: </span>
                            {medication.dosage_form}
                          </div>
                        )}
                        {medication.pregnancy_info && medication.pregnancy_info !== 'No disponible' && (
                          <div className="text-sm bg-blue-50 p-2 rounded">
                            <span className="font-medium">Embarazo: </span>
                            {medication.pregnancy_info.substring(0, 200)}...
                          </div>
                        )}
                      </div>
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