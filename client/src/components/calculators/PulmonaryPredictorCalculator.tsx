import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LHRCalculator from "./LHRCalculator";
import CVRCalculator from "./CVRCalculator";

export default function PulmonaryPredictorCalculator() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-blue-700 mb-1">
          Predictor de Complicación Pulmonar
        </h2>
        <p className="text-sm text-gray-600">
          Evaluación de patologías pulmonares fetales
        </p>
      </div>

      <Tabs defaultValue="lhr" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lhr">Hernia Diafragmática (LHR)</TabsTrigger>
          <TabsTrigger value="cvr">CPAM (CVR)</TabsTrigger>
        </TabsList>
        <TabsContent value="lhr">
          <LHRCalculator />
        </TabsContent>
        <TabsContent value="cvr">
          <CVRCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
