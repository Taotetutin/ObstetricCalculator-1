import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Globe, RefreshCcw, ExternalLink } from 'lucide-react';
import { CulturalWisdom, getRandomWisdom } from '@/data/cultural-wisdom';
import { CulturalWisdomDialog } from './CulturalWisdomDialog';

export function WisdomOfTheDay() {
  const [wisdom, setWisdom] = useState<CulturalWisdom | null>(null);
  
  useEffect(() => {
    refreshWisdom();
  }, []);
  
  const refreshWisdom = () => {
    setWisdom(getRandomWisdom());
  };

  if (!wisdom) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-base sm:text-lg text-blue-800 flex items-center gap-1.5 sm:gap-2">
          <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
          Sabiduría Cultural del Día
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="mb-2 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
            <h3 className="font-medium text-blue-700 text-sm sm:text-base">{wisdom.belief}</h3>
            <div className="flex items-center text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-md font-medium self-start">
              <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
              {wisdom.culture}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-700">{wisdom.practice}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex flex-col sm:flex-row justify-between gap-2 px-3 sm:px-6 pb-3 sm:pb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshWisdom}
          className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 w-full sm:w-auto"
        >
          <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
          Nueva sabiduría
        </Button>
        <CulturalWisdomDialog 
          triggerText="Ver más sabidurías" 
          showIcon={false} 
          buttonStyle={'highlight'} 
        />
      </CardFooter>
    </Card>
  );
}