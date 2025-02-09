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

export default function AgeCalculator() {
  const [result, setResult] = useState<AgeRiskResult | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.t21Age),
    defaultValues: {
      age: 35,
    },
  });

  const onSubmit = async (data: any) => {
    // TODO: Implement age risk calculation logic
    const calculatedRisk = 1 / (1000 * Math.exp(-0.1 * (data.age - 35)));
    const resultado = {
      risk: calculatedRisk,
      interpretation: calculatedRisk > 0.01 ? "Riesgo Aumentado" : "Riesgo Bajo",
      details: `El riesgo por edad materna de ${data.age} años es de 1:${Math.round(1/calculatedRisk)}`
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
          Esta calculadora estima el riesgo de trisomía 21 basado en la edad materna.
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
