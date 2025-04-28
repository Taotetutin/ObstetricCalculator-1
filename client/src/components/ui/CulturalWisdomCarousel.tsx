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
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-blue-800">{title}</h2>
        {showFilters && (
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="text-blue-600 border-blue-300 hover:bg-blue-50 text-xs sm:text-sm h-8 sm:h-9"
            >
              <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
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
          <ScrollArea className="w-full pb-1">
            <TabsList className="bg-blue-100/50 mb-3 sm:mb-4 flex whitespace-nowrap">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-1.5 px-3">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm">Todos</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="trimester" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-1.5 px-3">
                <div className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Por Trimestre</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="region" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-1.5 px-3">
                <div className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Por Región</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="all" className="pt-0" />

          <TabsContent value="trimester" className="pt-0">
            <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
              {[1, 2, 3].map((trimester) => (
                <Button
                  key={trimester}
                  variant={selectedTrimester === trimester ? "default" : "outline"}
                  onClick={() => setSelectedTrimester(trimester as 1 | 2 | 3)}
                  className={`${selectedTrimester === trimester 
                    ? "bg-blue-600 text-white" 
                    : "text-blue-700 border-blue-300 hover:bg-blue-50"} 
                    text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3`}
                >
                  Trimestre {trimester}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="region" className="pt-0">
            <ScrollArea className="max-h-32 sm:max-h-none mb-3 sm:mb-4">
              <div className="grid grid-cols-2 gap-1 sm:gap-2 pr-2">
                {regions.map((region) => (
                  <Button
                    key={region}
                    variant={selectedRegion === region ? "default" : "outline"}
                    onClick={() => setSelectedRegion(region)}
                    className={`${selectedRegion === region 
                      ? "bg-blue-600 text-white" 
                      : "text-blue-700 border-blue-300 hover:bg-blue-50"}
                      text-xs sm:text-sm h-7 sm:h-8`}
                    size="sm"
                  >
                    {region}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}

      <div className="min-h-[300px] sm:min-h-[400px] flex flex-col justify-between">
        {wisdomItems.length > 0 ? (
          <CulturalWisdomCard wisdom={wisdomItems[currentIndex]} />
        ) : (
          <div className="flex items-center justify-center h-48 sm:h-64 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-gray-500 text-sm text-center px-4">No hay sabiduría cultural disponible con los filtros seleccionados.</p>
          </div>
        )}

        {showNavigation && wisdomItems.length > 1 && (
          <div className="flex justify-between items-center mt-3 sm:mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevious}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="hidden sm:inline">Anterior</span>
              <span className="sm:hidden">Ant</span>
            </Button>
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-200">
              {currentIndex + 1} de {wisdomItems.length}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNext}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <span className="sm:hidden">Sig</span>
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 flex-shrink-0" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}