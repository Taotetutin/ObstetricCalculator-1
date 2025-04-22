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
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Sabiduría Cultural del Día
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-blue-700">{wisdom.belief}</h3>
            <div className="flex items-center text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-md font-medium">
              <Globe className="h-3 w-3 mr-1" />
              {wisdom.culture}
            </div>
          </div>
          <p className="text-sm text-gray-700">{wisdom.practice}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshWisdom}
          className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Nueva
        </Button>
        <CulturalWisdomDialog triggerText="Ver más sabidurías" showIcon={false} buttonStyle={'highlight'} />
      </CardFooter>
    </Card>
  );
}