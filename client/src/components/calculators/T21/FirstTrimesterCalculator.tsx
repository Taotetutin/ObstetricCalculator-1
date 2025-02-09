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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type FirstTrimesterResult = {
  risk: number;
  interpretation: string;
  details: string;
};

export default function FirstTrimesterCalculator() {
  const [result, setResult] = useState<FirstTrimesterResult | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.t21FirstTrimester),
    defaultValues: {
      age: 35,
      weight: 60,
      height: 160,
      ethnicity: 'caucasica',
      diabetesType1: false,
      smoker: false,
      previousT21: false,
      gestationalAge: 12,
      crownRumpLength: 60,
      nuchalTranslucency: 2.0,
      nasalBone: true,
      ductusVenosus: 'normal',
      tricuspidFlow: 'normal',
      bhcg: undefined,
      pappA: undefined,
    },
  });

  const onSubmit = async (data: any) => {
    // Cálculo del riesgo combinado
    let risk = Math.exp(-0.1 * (data.age - 35));

    // Ajustes por marcadores bioquímicos
    if (data.bhcg !== undefined) {
      risk *= Math.exp(Math.abs(data.bhcg - 1));
    }
    if (data.pappA !== undefined) {
      risk *= Math.exp(Math.abs(1 - data.pappA));
    }

    // Ajustes por marcadores ecográficos
    risk *= Math.exp(data.nuchalTranslucency - 2);
    if (!data.nasalBone) risk *= 2.5;
    if (data.ductusVenosus !== 'normal') risk *= 2;
    if (data.tricuspidFlow === 'regurgitacion') risk *= 2;

    // Ajustes por factores de riesgo
    if (data.diabetesType1) risk *= 1.5;
    if (data.smoker) risk *= 1.3;
    if (data.previousT21) risk *= 2.5;

    const finalRisk = risk / 1000;

    const resultado = {
      risk: finalRisk,
      interpretation: finalRisk > (1/350) ? "Riesgo Aumentado" : "Riesgo Bajo",
      details: `Riesgo combinado del primer trimestre: 1:${Math.round(1/finalRisk)}`
    };

    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "t21FirstTrimester",
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
          Calculadora de riesgo combinado del primer trimestre para trisomía 21.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Datos Maternos */}
          <div>
            <h3 className="text-lg font-medium mb-4">Datos Maternos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad (años)</FormLabel>
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

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <Input
                      type="number"
                      min="35"
                      max="200"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (cm)</FormLabel>
                    <Input
                      type="number"
                      min="120"
                      max="220"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etnia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione etnia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="caucasica">Caucásica</SelectItem>
                        <SelectItem value="afro">Afroamericana</SelectItem>
                        <SelectItem value="sudasiatica">Sudasiática</SelectItem>
                        <SelectItem value="asiaticooriental">Asiático Oriental</SelectItem>
                        <SelectItem value="mixta">Mixta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Antecedentes */}
          <div>
            <h3 className="text-lg font-medium mb-4">Antecedentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="diabetesType1"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Diabetes Tipo 1</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smoker"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Fumadora</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previousT21"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>T21 Previa</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Marcadores Ecográficos */}
          <div>
            <h3 className="text-lg font-medium mb-4">Marcadores Ecográficos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gestationalAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad Gestacional (semanas)</FormLabel>
                    <Input
                      type="number"
                      step="0.1"
                      min="11"
                      max="13.6"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="crownRumpLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LCC (mm)</FormLabel>
                    <Input
                      type="number"
                      step="0.1"
                      min="45"
                      max="84"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nuchalTranslucency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Translucencia Nucal (mm)</FormLabel>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="6.5"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nasalBone"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Hueso Nasal Presente</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ductusVenosus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ductus Venoso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione patrón" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="ausente">Ausente</SelectItem>
                        <SelectItem value="reverso">Reverso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tricuspidFlow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flujo Tricuspídeo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione patrón" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="regurgitacion">Regurgitación</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Marcadores Bioquímicos */}
          <div>
            <h3 className="text-lg font-medium mb-4">Marcadores Bioquímicos (MoM)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bhcg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>β-hCG libre</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pappA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAPP-A</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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