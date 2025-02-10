import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LHRCalculator from "./LHRCalculator";
import CVRCalculator from "./CVRCalculator";

export default function PulmonaryPredictorCalculator() {
  return (
    <div className="space-y-6">
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