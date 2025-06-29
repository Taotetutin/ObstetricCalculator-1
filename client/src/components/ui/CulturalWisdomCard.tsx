import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Globe, CircleUser } from 'lucide-react';
import { CulturalWisdom } from '@/data/cultural-wisdom';

interface CulturalWisdomCardProps {
  wisdom: CulturalWisdom;
  showActions?: boolean;
}

export function CulturalWisdomCard({ wisdom, showActions = true }: CulturalWisdomCardProps) {
  const getBadgeColor = (region: string): string => {
    const regionColors: Record<string, string> = {
      "Latinoamérica": "bg-amber-100 text-amber-800 hover:bg-amber-200",
      "Asia": "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      "África": "bg-red-100 text-red-800 hover:bg-red-200",
      "Europa": "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "Oceanía": "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      "América del Norte": "bg-purple-100 text-purple-800 hover:bg-purple-200",
      "Medio Oriente": "bg-orange-100 text-orange-800 hover:bg-orange-200"
    };
    
    return regionColors[region] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  const getTrimesterBadge = (trimester: 1 | 2 | 3 | 'all') => {
    if (trimester === 'all') {
      return <Badge variant="outline" className="bg-violet-100 border-violet-300 text-violet-800">Todo el embarazo</Badge>;
    }
    
    const trimesterLabels = {
      1: "Primer trimestre",
      2: "Segundo trimestre",
      3: "Tercer trimestre"
    };
    
    return <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800">{trimesterLabels[trimester]}</Badge>;
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 border-2 border-blue-100 hover:shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
          <div>
            <CardTitle className="text-base sm:text-lg text-blue-800 flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
              <span>{wisdom.belief}</span>
            </CardTitle>
            <CardDescription className="mt-1 font-medium flex items-center gap-1 text-sm">
              <CircleUser className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" /> 
              <span>{wisdom.culture}</span>
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-0 sm:flex-col sm:gap-2 sm:items-end w-full sm:w-auto">
            <Badge className={`text-xs ${getBadgeColor(wisdom.region)}`}>
              <Globe className="h-3 w-3 mr-1 flex-shrink-0" /> 
              {wisdom.region}
            </Badge>
            {getTrimesterBadge(wisdom.trimester)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-xs sm:text-sm text-blue-700 mb-1">Práctica Tradicional</h4>
            <p className="text-gray-700 text-sm sm:text-base">{wisdom.practice}</p>
          </div>
          <div>
            <h4 className="font-medium text-xs sm:text-sm text-blue-700 mb-1">Contexto Cultural</h4>
            <p className="text-gray-600 text-xs sm:text-sm">{wisdom.context}</p>
          </div>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="bg-blue-50/70 border-t border-blue-100 flex justify-end p-2 sm:p-4">
          <div className="text-xs text-blue-600 italic">
            Sabiduría cultural - Perspectivas diversas sobre el embarazo
          </div>
        </CardFooter>
      )}
    </Card>
  );
}