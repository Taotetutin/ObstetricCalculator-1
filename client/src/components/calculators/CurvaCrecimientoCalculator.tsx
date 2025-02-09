import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const curvaCrecimientoSchema = z.object({
  semanasGestacion: z.number().min(20).max(42),
  pesoFetal: z.number().min(100).max(5000),
});

type CurvaCrecimientoData = z.infer<typeof curvaCrecimientoSchema>;

export default function CurvaCrecimientoCalculator() {
  const [percentil, setPercentil] = useState<string | null>(null);

  const form = useForm<CurvaCrecimientoData>({
    resolver: zodResolver(curvaCrecimientoSchema),
    defaultValues: {
      semanasGestacion: 20,
      pesoFetal: 500,
    },
  });

  const calcularPercentil = (semanas: number, peso: number) => {
    // Valores aproximados basados en tablas de percentiles fetales
    const p10 = -1200 + (semanas * 150);
    const p50 = -1500 + (semanas * 180);
    const p90 = -1800 + (semanas * 210);

    if (peso < p10) return "< Percentil 10 (Pequeño para edad gestacional)";
    if (peso > p90) return "> Percentil 90 (Grande para edad gestacional)";
    return "Entre Percentil 10-90 (Adecuado para edad gestacional)";
  };

  const onSubmit = async (data: CurvaCrecimientoData) => {
    const resultado = calcularPercentil(data.semanasGestacion, data.pesoFetal);
    setPercentil(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "curvaCrecimiento",
          input: JSON.stringify(data),
          result: JSON.stringify({ percentil: resultado }),
        }),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="semanasGestacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semanas de Gestación</FormLabel>
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

      {percentil && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Resultado:</h3>
            <p>{percentil}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
