import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LHRCalculator from "./LHRCalculator";
import CVRCalculator from "./CVRCalculator";

export default function PulmonaryPredictorCalculator() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marcadores de Disfunción Pulmonar</CardTitle>
          <CardDescription>
            Esta herramienta permite evaluar dos condiciones pulmonares fetales principales:
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Hernia Diafragmática Congénita (HDC) - usando el índice LHR (Lung-to-Head Ratio)</li>
              <li>Malformación Adenomatoidea Quística Congénita (CPAM) - usando el índice CVR (CPAM Volume Ratio)</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="lhr" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lhr">Hernia Diafragmática (LHR)</TabsTrigger>
              <TabsTrigger value="cvr">CPAM (CVR)</TabsTrigger>
            </TabsList>
            <TabsContent value="lhr" className="mt-6">
              <LHRCalculator />
            </TabsContent>
            <TabsContent value="cvr" className="mt-6">
              <CVRCalculator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}