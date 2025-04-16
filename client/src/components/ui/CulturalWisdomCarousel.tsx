import { useState, useEffect } from 'react';
import { getWisdomByTrimester, getWisdomByRegion, getRandomWisdom, getAllRegions, CulturalWisdom } from '@/data/cultural-wisdom';
import { CulturalWisdomCard } from './CulturalWisdomCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Filter, RefreshCcw } from 'lucide-react';

interface CulturalWisdomCarouselProps {
  initialTrimester?: 1 | 2 | 3;
  showFilters?: boolean;
  title?: string;
  showNavigation?: boolean;
}

export function CulturalWisdomCarousel({ 
  initialTrimester, 
  showFilters = true, 
  title = "Sabiduría Cultural del Embarazo",
  showNavigation = true
}: CulturalWisdomCarouselProps) {
  const [wisdomItems, setWisdomItems] = useState<CulturalWisdom[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'trimester' | 'region'>('all');
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(initialTrimester || 1);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const regions = getAllRegions();

  useEffect(() => {
    if (initialTrimester) {
      setFilter('trimester');
      setSelectedTrimester(initialTrimester);
    }
    
    updateWisdomItems();
  }, [initialTrimester, filter, selectedTrimester, selectedRegion]);

  const updateWisdomItems = () => {
    let items: CulturalWisdom[] = [];

    if (filter === 'trimester') {
      items = getWisdomByTrimester(selectedTrimester);
    } else if (filter === 'region' && selectedRegion) {
      items = getWisdomByRegion(selectedRegion);
    } else {
      // Para 'all' o casos no manejados, mostrar algunos items aleatorios
      const randomItems: CulturalWisdom[] = [];
      const usedIndexes = new Set<number>();
      
      // Obtener 5 elementos aleatorios sin repetir
      while (randomItems.length < 5) {
        const randomWisdom = getRandomWisdom();
        const index = randomWisdom ? randomWisdom.belief.length : 0; // Usar algo único como identificador
        
        if (!usedIndexes.has(index)) {
          randomItems.push(randomWisdom);
          usedIndexes.add(index);
        }
      }
      
      items = randomItems;
    }

    setWisdomItems(items);
    setCurrentIndex(0); // Resetear al primer elemento cuando cambian los filtros
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % wisdomItems.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + wisdomItems.length) % wisdomItems.length);
  };

  const handleRefresh = () => {
    updateWisdomItems();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-800">{title}</h2>
        {showFilters && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Refrescar
            </Button>
          </div>
        )}
      </div>

      {showFilters && (
        <Tabs 
          defaultValue={filter} 
          onValueChange={(value) => setFilter(value as 'all' | 'trimester' | 'region')}
          className="w-full"
        >
          <TabsList className="bg-blue-100/50 mb-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <div className="flex items-center gap-1">
                Todos
              </div>
            </TabsTrigger>
            <TabsTrigger value="trimester" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <div className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Por Trimestre
              </div>
            </TabsTrigger>
            <TabsTrigger value="region" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <div className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Por Región
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" />

          <TabsContent value="trimester">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3].map((trimester) => (
                <Button
                  key={trimester}
                  variant={selectedTrimester === trimester ? "default" : "outline"}
                  onClick={() => setSelectedTrimester(trimester as 1 | 2 | 3)}
                  className={selectedTrimester === trimester 
                    ? "bg-blue-600 text-white" 
                    : "text-blue-700 border-blue-300 hover:bg-blue-50"}
                >
                  Trimestre {trimester}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="region">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {regions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"}
                  onClick={() => setSelectedRegion(region)}
                  className={selectedRegion === region 
                    ? "bg-blue-600 text-white" 
                    : "text-blue-700 border-blue-300 hover:bg-blue-50"}
                  size="sm"
                >
                  {region}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <div className="min-h-[400px] flex flex-col justify-between">
        {wisdomItems.length > 0 ? (
          <CulturalWisdomCard wisdom={wisdomItems[currentIndex]} />
        ) : (
          <div className="flex items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-500">No hay sabiduría cultural disponible con los filtros seleccionados.</p>
          </div>
        )}

        {showNavigation && wisdomItems.length > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevious}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <div className="text-sm text-gray-500">
              {currentIndex + 1} de {wisdomItems.length}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNext}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}