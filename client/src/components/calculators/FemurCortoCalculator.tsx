import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

type FemurCortoInput = {
  femurLength: number;
  gestationalAge: number;
  biparietal?: number;
  headCircumference?: number;
};

type FemurCortoResult = {
  percentile: string;
  isShort: boolean;
  recommendation: string;
  zScore?: number;
};

export default function FemurCortoCalculator() {
  const [result, setResult] = useState<FemurCortoResult | null>(null);

  const form = useForm<FemurCortoInput>({
    resolver: zodResolver(calculatorTypes.femurCorto),
    defaultValues: {
      femurLength: 0,
      gestationalAge: 0,
      biparietal: undefined,
      headCircumference: undefined,
    },
  });

  const onSubmit = async (data: FemurCortoInput) => {
    // Placeholder for calculation logic
    // Will be updated once we have the specific formulas and criteria
    const resultado: FemurCortoResult = {
      percentile: "Pendiente de implementar",
      isShort: false,
      recommendation: "Pendiente de implementar recomendaciones específicas",
    };

    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "femurCorto",
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
          Esta calculadora evalúa la longitud del fémur fetal en relación con la edad gestacional,
          proporcionando percentiles y recomendaciones específicas.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="femurLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud del Fémur (mm)</FormLabel>
                <Input
                  type="number"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gestationalAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad Gestacional (semanas)</FormLabel>
                <Input
                  type="number"
                  step="1"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="biparietal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diámetro Biparietal (mm) - Opcional</FormLabel>
                <Input
                  type="number"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="headCircumference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Circunferencia Cefálica (mm) - Opcional</FormLabel>
                <Input
                  type="number"
                  step="0.1"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Evaluar Fémur
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Resultado:</h3>
            <div className="space-y-2">
              <p>
                Percentil: <span className="font-medium">{result.percentile}</span>
              </p>
              <p>
                Estado: <span className="font-medium">{result.isShort ? "Fémur corto" : "Normal"}</span>
              </p>
              <p>
                Recomendación: <span className="font-medium">{result.recommendation}</span>
              </p>
              {result.zScore !== undefined && (
                <p>
                  Z-Score: <span className="font-medium">{result.zScore.toFixed(2)}</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
