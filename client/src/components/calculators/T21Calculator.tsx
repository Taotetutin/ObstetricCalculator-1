import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, Baby, Stethoscope } from "lucide-react";
import AgeCalculator from "./T21/AgeCalculator";
import FirstTrimesterCalculator from "./T21/FirstTrimesterCalculator";
import SecondTrimesterCalculator from "./T21/SecondTrimesterCalculator";

export default function T21Calculator() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <Tabs defaultValue="age" className="w-full flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-blue-100/50">
          <TabsTrigger value="age" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>Riesgo por Edad</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="first" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <div className="flex items-center gap-2">
              <Baby className="w-4 h-4" />
              <span>Primer Trimestre</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="second" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span>Segundo Trimestre</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-hidden">
          <TabsContent value="age" className="h-full">
            <AgeCalculator />
          </TabsContent>
          <TabsContent value="first" className="h-full">
            <FirstTrimesterCalculator />
          </TabsContent>
          <TabsContent value="second" className="h-full">
            <SecondTrimesterCalculator />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}