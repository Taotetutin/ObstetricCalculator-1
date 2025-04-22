import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CulturalWisdomCarousel } from "./CulturalWisdomCarousel";
import { Heart, Globe, Calendar } from 'lucide-react';

interface CulturalWisdomDialogProps {
  triggerText?: string;
  showIcon?: boolean;
  buttonStyle?: 'default' | 'highlight';
}

export function CulturalWisdomDialog({ 
  triggerText = "Sabiduría Cultural del Embarazo", 
  showIcon = true,
  buttonStyle = 'default'
}: CulturalWisdomDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonStyle === 'highlight' ? 'default' : 'outline'}
          className={
            buttonStyle === 'highlight' 
            ? "bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm" 
            : "border-blue-200 text-blue-700 hover:bg-blue-50 transition-all hover:border-blue-400"
          }
        >
          {showIcon && <Globe className="h-4 w-4 mr-2 text-blue-500" />}
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Heart className="h-5 w-5 text-red-500" /> 
            Sabiduría Cultural del Embarazo
          </DialogTitle>
          <DialogDescription>
            Conocimientos tradicionales sobre el embarazo de diversas culturas del mundo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="trimester">
            <TabsList className="w-full justify-start mb-4 bg-blue-50">
              <TabsTrigger value="trimester" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Calendar className="h-4 w-4 mr-1" /> Por Trimestre
              </TabsTrigger>
              <TabsTrigger value="explore" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Globe className="h-4 w-4 mr-1" /> Explorar
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[600px] pr-4">
              <TabsContent value="trimester" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-blue-800">Primer Trimestre</h3>
                  <CulturalWisdomCarousel 
                    initialTrimester={1} 
                    showFilters={false}
                    title=""
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-blue-800">Segundo Trimestre</h3>
                  <CulturalWisdomCarousel 
                    initialTrimester={2} 
                    showFilters={false}
                    title=""
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-blue-800">Tercer Trimestre</h3>
                  <CulturalWisdomCarousel 
                    initialTrimester={3} 
                    showFilters={false}
                    title=""
                  />
                </div>
                
                <div className="text-sm text-gray-500 italic mt-6 border-t border-gray-100 pt-4 px-2">
                  <p>Esta colección representa una muestra de diversas tradiciones culturales relacionadas con el embarazo. Estas prácticas se presentan con propósito informativo y como un reconocimiento a la diversidad cultural global.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="explore" className="mt-0">
                <CulturalWisdomCarousel 
                  showFilters={true}
                  title="Explorar Sabiduría Cultural"
                />
                
                <div className="text-sm text-gray-500 italic mt-6 border-t border-gray-100 pt-4 px-2">
                  <p>Estos conocimientos tradicionales son presentados como una celebración de la diversidad cultural y no como consejos médicos. Siempre consulte a su profesional de salud para cualquier decisión sobre su embarazo.</p>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}