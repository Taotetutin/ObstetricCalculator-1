import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, Baby, Stethoscope } from "lucide-react";
import AgeCalculator from "./T21/AgeCalculator";
import FirstTrimesterCalculator from "./T21/FirstTrimesterCalculator";
import SecondTrimesterCalculator from "./T21/SecondTrimesterCalculator";

export default function T21Calculator() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="age" className="w-full">
        <TabsList className="flex w-full h-auto flex-wrap md:flex-nowrap bg-blue-100/50">
          <TabsTrigger 
            value="age" 
            className="flex-1 py-2 px-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-2">
              <Calculator className="w-4 h-4" />
              <span className="text-xs sm:text-sm whitespace-normal text-center">Riesgo por Edad</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="first" 
            className="flex-1 py-2 px-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-2">
              <Baby className="w-4 h-4" />
              <span className="text-xs sm:text-sm whitespace-normal text-center">Primer Trimestre</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="second" 
            className="flex-1 py-2 px-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-2">
              <Stethoscope className="w-4 h-4" />
              <span className="text-xs sm:text-sm whitespace-normal text-center">Segundo Trimestre</span>
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