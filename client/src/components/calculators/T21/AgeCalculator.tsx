import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { calculatorTypes } from "@shared/schema";

type AgeRiskResult = {
  risk: number;
  interpretation: string;
  details: string;
};

// Tabla de riesgos por edad (basada en datos epidemiológicos)
const ageRiskTable: Record<number, number> = {
  20: 1525,
  25: 1340,
  30: 940,
  31: 885,
  32: 725,
  33: 535,
  34: 390,
  35: 290,
  36: 225,
  37: 170,
  38: 125,
  39: 100,
  40: 75,
  41: 60,
  42: 45,
  43: 35,
  44: 25,
  45: 20,
};

export default function AgeCalculator() {
  const [result, setResult] = useState<AgeRiskResult | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.t21Age),
    defaultValues: {
      age: 35,
    },
  });

  const onSubmit = async (data: any) => {
    // Calcula el riesgo basado en la tabla
    let risk: number;
    const age = Math.round(data.age);

    if (age <= 20) {
      risk = 1 / 1525;
    } else if (age >= 45) {
      risk = 1 / 20;
    } else {
      // Interpolación lineal entre edades si no está en la tabla
      const ages = Object.keys(ageRiskTable).map(Number);
      const lowerAge = ages.filter(a => a <= age).pop() || 20;
      const upperAge = ages.find(a => a > age) || 45;

      const lowerRisk = 1 / ageRiskTable[lowerAge];
      const upperRisk = 1 / ageRiskTable[upperAge];

      const t = (age - lowerAge) / (upperAge - lowerAge);
      risk = lowerRisk + t * (upperRisk - lowerRisk);
    }

    const resultado = {
      risk,
      interpretation: risk > (1/350) ? "Riesgo Aumentado" : "Riesgo Bajo",
      details: `El riesgo por edad materna de ${age} años es de 1:${Math.round(1/risk)}`
    };

    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "t21Age",
          input: JSON.stringify(data),
          result: JSON.stringify(resultado),
        }),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Esta calculadora estima el riesgo de trisomía 21 basado en la edad materna utilizando datos epidemiológicos.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad Materna (años)</FormLabel>
                <Input
                  type="number"
                  min="15"
                  max="60"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Calcular Riesgo
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Resultados:</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Riesgo Estimado:</p>
                <p className="ml-4">1:{Math.round(1/result.risk)}</p>
              </div>

              <div>
                <p className="font-medium">Interpretación:</p>
                <p className={`ml-4 font-medium ${
                  result.interpretation === "Riesgo Bajo" 
                    ? "text-green-600" 
                    : "text-amber-600"
                }`}>
                  {result.interpretation}
                </p>
              </div>

              <div>
                <p className="font-medium">Detalles:</p>
                <p className="ml-4 text-sm">{result.details}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}