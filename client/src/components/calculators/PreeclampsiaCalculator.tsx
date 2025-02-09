import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calculatePreeclampsiaRisk } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PreeclampsiaCalculator() {
  const [result, setResult] = useState<{
    score: number;
    category: string;
    recommendation: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.preeclampsia),
    defaultValues: {
      age: 25,
      gestationalAge: 20,
      bmi: 25,
      nulliparous: false,
      previousPreeclampsia: false,
      chronicHypertension: false,
      diabetes: false,
      multiplePregnancy: false,
    },
  });

  const onSubmit = async (data: Parameters<typeof calculatePreeclampsiaRisk>[0]) => {
    const resultado = calculatePreeclampsiaRisk(data);
    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "preeclampsia",
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
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Esta calculadora evalúa el riesgo de preeclampsia basado en factores
          maternos y características del embarazo actual.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad Materna</FormLabel>
                <Input
                  type="number"
                  min="12"
                  max="60"
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
            name="bmi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IMC</FormLabel>
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
            name="nulliparous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="space-y-1 leading-none">
                  <FormLabel>Primer embarazo</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="previousPreeclampsia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="space-y-1 leading-none">
                  <FormLabel>Preeclampsia en embarazo anterior</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chronicHypertension"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="space-y-1 leading-none">
                  <FormLabel>Hipertensión crónica</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diabetes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="space-y-1 leading-none">
                  <FormLabel>Diabetes pregestacional</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="multiplePregnancy"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="space-y-1 leading-none">
                  <FormLabel>Embarazo múltiple</FormLabel>
                </div>
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
            <h3 className="text-lg font-semibold mb-2">Resultado:</h3>
            <p className="mb-2">
              Puntaje de Riesgo: <span className="font-medium">{result.score}</span>
            </p>
            <p className="mb-2">
              Categoría de Riesgo:{" "}
              <span className="font-medium">{result.category}</span>
            </p>
            <p>
              Recomendación:{" "}
              <span className="font-medium">{result.recommendation}</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
