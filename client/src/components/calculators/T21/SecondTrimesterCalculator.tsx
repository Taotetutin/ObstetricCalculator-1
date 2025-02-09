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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type SecondTrimesterResult = {
  risk: number;
  interpretation: string;
  details: string;
};

export default function SecondTrimesterCalculator() {
  const [result, setResult] = useState<SecondTrimesterResult | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.t21SecondTrimester),
    defaultValues: {
      age: 35,
      gestationalAge: 16,
      nasalBone: 6.5,
      nuchalFold: 4,
      nasofrontalAngle: 130,
      prefrontalSpace: 5,
      iliacAngle: 90,
      ehoCordiac: false,
      intestinalEcho: false,
      shortFemur: false,
      shortHumerus: false,
      pyelectasis: false,
      afp: undefined,
      hcg: undefined,
      ue3: undefined,
    },
  });

  const onSubmit = async (data: any) => {
    // TODO: Implement risk calculation logic for second trimester
    const calculatedRisk = 1 / (1000 * Math.exp(-0.1 * (data.age - 35) + (data.nuchalFold - 4)));
    const resultado = {
      risk: calculatedRisk,
      interpretation: calculatedRisk > 0.01 ? "Riesgo Aumentado" : "Riesgo Bajo",
      details: `El riesgo en el segundo trimestre es de 1:${Math.round(1/calculatedRisk)}`
    };
    
    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "t21SecondTrimester",
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
          Esta calculadora estima el riesgo de trisomía 21 basado en marcadores del segundo trimestre.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Datos Básicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="gestationalAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad Gestacional (semanas)</FormLabel>
                    <Input
                      type="number"
                      min="14"
                      max="22"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Marcadores Ecográficos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nasalBone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hueso Nasal (mm)</FormLabel>
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
                name="nuchalFold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pliegue Nucal (mm)</FormLabel>
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
                name="nasofrontalAngle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ángulo Nasofrontal (grados)</FormLabel>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prefrontalSpace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Espacio Prefrontal (mm)</FormLabel>
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
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Marcadores Menores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ehoCordiac"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Foco Ecogénico Cardíaco</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="intestinalEcho"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Intestino Hiperecogénico</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortFemur"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Fémur Corto</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortHumerus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <FormLabel>Húmero Corto</FormLabel>
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

          <div>
            <h3 className="text-lg font-medium mb-4">Marcadores Bioquímicos (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="afp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AFP (MoM)</FormLabel>
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
                name="hcg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>hCG (MoM)</FormLabel>
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
                name="ue3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>uE3 (MoM)</FormLabel>
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
