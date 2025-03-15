import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AgeCalculator from './AgeCalculator';
import FirstTrimesterCalculator from './FirstTrimesterCalculator';

export default function TrisomyCalculator() {
  const [maternalAge, setMaternalAge] = useState(35);
  const [nt, setNt] = useState(1.0);
  const [bhcg, setBhcg] = useState(1.0);
  const [pappa, setPappa] = useState(1.0);
  const [risk, setRisk] = useState<number | null>(null);

  const calculateRisk = () => {
    // Base risk by age
    let baseRisk = Math.exp(-16.2395 + (0.286 * (maternalAge - 35)));

    // Adjustments for markers
    if (nt > 0) {
      baseRisk *= Math.pow(2.5, (nt - 2.0));
    }
    if (bhcg > 0) {
      baseRisk *= Math.pow(2.0, (bhcg - 1.0));
    }
    if (pappa > 0) {
      baseRisk *= Math.pow(0.5, (pappa - 1.0));
    }

    setRisk(baseRisk);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="age" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="age">Por Edad</TabsTrigger>
          <TabsTrigger value="first">Primer Trimestre</TabsTrigger>
        </TabsList>
        <TabsContent value="age">
          <AgeCalculator 
            maternalAge={maternalAge}
            setMaternalAge={setMaternalAge}
          />
        </TabsContent>
        <TabsContent value="first">
          <FirstTrimesterCalculator
            nt={nt}
            setNt={setNt}
            bhcg={bhcg}
            setBhcg={setBhcg}
            pappa={pappa}
            setPappa={setPappa}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={calculateRisk} className="w-full max-w-xs">
          Calcular Riesgo
        </Button>
      </div>

      {risk !== null && (
        <Alert>
          <AlertDescription>
            Riesgo estimado: 1:{Math.round(1/risk)}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}