import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calcularPercentilOMS } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function CurvaCrecimientoCalculator() {
  const [result, setResult] = useState<{ percentil: string; clasificacion: string } | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.curvaCrecimiento),
    defaultValues: {
      semanasGestacion: 20,
      pesoFetal: 500,
    },
  });

  const onSubmit = async (data: { semanasGestacion: number; pesoFetal: number }) => {
    try {
      const resultado = calcularPercentilOMS(data.semanasGestacion, data.pesoFetal);
      setResult(resultado);

      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "curvaCrecimiento",
          input: JSON.stringify(data),
          result: JSON.stringify(resultado),
        }),
      });
    } catch (error) {
      console.error("Error en el cálculo:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Esta calculadora utiliza los estándares de crecimiento fetal de la OMS
          para evaluar el peso según la edad gestacional.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="semanasGestacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semanas de Gestación (20-42)</FormLabel>
                <Input
                  type="number"
                  min="20"
                  max="42"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pesoFetal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso Fetal (gramos)</FormLabel>
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

          <Button type="submit" className="w-full">
            Evaluar Crecimiento
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Resultado:</h3>
            <p className="mb-2">
              Percentil: <span className="font-medium">{result.percentil}</span>
            </p>
            <p>
              Clasificación:{" "}
              <span className="font-medium">{result.clasificacion}</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}