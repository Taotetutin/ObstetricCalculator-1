import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, Baby, Stethoscope } from "lucide-react";

// Placeholder components - will be implemented next
const AgeCalculator = () => <div>Age Calculator</div>;
const FirstTrimesterCalculator = () => <div>First Trimester</div>;
const SecondTrimesterCalculator = () => <div>Second Trimester</div>;

export default function T21Calculator() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="age" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="age">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>Riesgo por Edad</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="first">
            <div className="flex items-center gap-2">
              <Baby className="w-4 h-4" />
              <span>Primer Trimestre</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="second">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span>Segundo Trimestre</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="age" className="mt-6">
          <AgeCalculator />
        </TabsContent>
        <TabsContent value="first" className="mt-6">
          <FirstTrimesterCalculator />
        </TabsContent>
        <TabsContent value="second" className="mt-6">
          <SecondTrimesterCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
