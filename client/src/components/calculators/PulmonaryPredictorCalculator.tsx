import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LHRCalculator from "./LHRCalculator";
import CVRCalculator from "./CVRCalculator";

export default function PulmonaryPredictorCalculator() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marcadores de Disfunción Pulmonar</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Esta herramienta permite evaluar dos condiciones pulmonares fetales principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Seleccione la patología a evaluar:</h3>
            <Tabs defaultValue="lhr" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger 
                  value="lhr" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                >
                  <div className="text-left">
                    <div className="font-semibold">Hernia Diafragmática</div>
                    <div className="text-xs opacity-90">LHR (Lung-to-Head Ratio)</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="cvr"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
                >
                  <div className="text-left">
                    <div className="font-semibold">CPAM</div>
                    <div className="text-xs opacity-90">CVR (CPAM Volume Ratio)</div>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lhr">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Calculadora para evaluar la severidad de la hernia diafragmática congénita mediante el índice LHR
                  </div>
                  <LHRCalculator />
                </div>
              </TabsContent>
              <TabsContent value="cvr">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Calculadora para evaluar la severidad de la malformación adenomatoidea quística congénita mediante el índice CVR
                  </div>
                  <CVRCalculator />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}