import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CulturalWisdomCarousel } from '@/components/ui/CulturalWisdomCarousel';
import { CulturalWisdomCard } from '@/components/ui/CulturalWisdomCard';
import { getWisdomByTrimester, getWisdomByRegion, getAllRegions } from '@/data/cultural-wisdom';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Heart, Globe, Calendar, MapPin, BookOpen } from 'lucide-react';

export default function CulturalWisdomPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const regions = getAllRegions();

  const firstTrimesterWisdom = getWisdomByTrimester(1);
  const secondTrimesterWisdom = getWisdomByTrimester(2);
  const thirdTrimesterWisdom = getWisdomByTrimester(3);
  const regionWisdom = selectedRegion ? getWisdomByRegion(selectedRegion) : [];

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <Helmet>
        <title>Sabiduría Cultural del Embarazo | ObsteriX Legend</title>
      </Helmet>

      <header className="mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-3 sm:mb-4">
          <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-2">Sabiduría Cultural del Embarazo</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          Descubre conocimientos tradicionales y prácticas culturales de diversas comunidades alrededor del mundo relacionadas con el embarazo y el nacimiento.
        </p>
      </header>

      <Tabs defaultValue="explore" className="max-w-full sm:max-w-5xl mx-auto">
        <ScrollArea className="w-full pb-2">
          <TabsList className="w-full bg-blue-50 p-1 mb-6 flex whitespace-nowrap">
            <TabsTrigger value="explore" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-3 py-1.5">
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" /> 
              <span className="text-xs sm:text-sm">Explorar</span>
            </TabsTrigger>
            <TabsTrigger value="trimester" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-3 py-1.5">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" /> 
              <span className="text-xs sm:text-sm">Por Trimestre</span>
            </TabsTrigger>
            <TabsTrigger value="region" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-3 py-1.5">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" /> 
              <span className="text-xs sm:text-sm">Por Región</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-3 py-1.5">
              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" /> 
              <span className="text-xs sm:text-sm">Sobre Esta Sección</span>
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="explore" className="space-y-8">
          <div className="mb-8">
            <CulturalWisdomCarousel title="Sabiduría Cultural" showFilters={true} />
          </div>
        </TabsContent>

        <TabsContent value="trimester" className="space-y-8">
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">1</span>
                Primer Trimestre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {firstTrimesterWisdom.slice(0, 4).map((wisdom, index) => (
                  <CulturalWisdomCard key={`first-${index}`} wisdom={wisdom} showActions={false} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">2</span>
                Segundo Trimestre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondTrimesterWisdom.slice(0, 4).map((wisdom, index) => (
                  <CulturalWisdomCard key={`second-${index}`} wisdom={wisdom} showActions={false} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-2">3</span>
                Tercer Trimestre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {thirdTrimesterWisdom.slice(0, 4).map((wisdom, index) => (
                  <CulturalWisdomCard key={`third-${index}`} wisdom={wisdom} showActions={false} />
                ))}
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="region">
          <div className="mb-6 max-w-md">
            <Select 
              value={selectedRegion} 
              onValueChange={setSelectedRegion}
            >
              <SelectTrigger className="w-full border-blue-200">
                <SelectValue placeholder="Seleccione una región" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRegion ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regionWisdom.map((wisdom, index) => (
                <CulturalWisdomCard key={`region-${index}`} wisdom={wisdom} showActions={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Globe className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p>Seleccione una región para ver su sabiduría cultural sobre el embarazo.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="faq">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Sobre la Sabiduría Cultural</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-blue-700">¿Qué es la sabiduría cultural del embarazo?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  La sabiduría cultural del embarazo se refiere a los conocimientos tradicionales, creencias y prácticas relacionadas con la gestación y el nacimiento que han sido desarrolladas y transmitidas a través de generaciones en diferentes culturas alrededor del mundo.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-blue-700">¿Debo seguir estas prácticas durante mi embarazo?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Esta sección tiene un propósito puramente informativo y educativo, presentando la diversidad de conocimientos tradicionales sobre el embarazo. Siempre consulte con su profesional de salud antes de adoptar cualquier práctica. La medicina moderna basada en evidencia debe ser su principal guía durante el embarazo.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-blue-700">¿Cuál es el valor de conocer estas tradiciones?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Conocer diversas perspectivas culturales sobre el embarazo puede enriquecer nuestra comprensión del proceso de gestación, fomentar el respeto por la diversidad cultural y en algunos casos, complementar (nunca reemplazar) los cuidados médicos modernos con enfoques que atienden aspectos emocionales, espirituales y comunitarios del embarazo.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-blue-700">¿Cómo se recopiló esta información?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Esta información se ha recopilado a partir de diversas fuentes etnográficas, antropológicas y de estudios culturales, con el objetivo de presentar de manera respetuosa las diferentes cosmovisiones relacionadas con el embarazo. Buscamos representar con precisión cada tradición, reconociendo su valor cultural y su contexto específico.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6 pt-6 border-t border-blue-100">
              <p className="text-sm text-gray-500 italic">
                La diversidad de conocimientos tradicionales enriquece nuestra comprensión del embarazo como una experiencia humana universal pero culturalmente diversa. ObsteriX Legend presenta esta información con respeto y reconocimiento hacia todas las culturas.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-16 text-center text-sm text-gray-500">
        <p>© 2025 ObsteriX Legend | Sabiduría cultural presentada con fines educativos</p>
      </div>
    </div>
  );
}