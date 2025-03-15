import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorTypes } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
      baselineRisk: undefined,
      nasalBone: 'normal',
      cardiacFocus: 'normal',
      ventriculomegaly: 'normal',
      nuchalFold: 'normal',
      shortFemur: 'normal',
      aberrantSubclavian: 'normal',
      hyperechogenicBowel: 'normal',
      pyelectasis: 'normal',
      previousT21: false,
    },
  });

  const onSubmit = async (data: any) => {
    let risk = 1/parseFloat(data.baselineRisk);

    const markerMultipliers: Record<string, number> = {
      nasalBone_normal: 0.23,
      nasalBone_hipoplasico: 27.0,
      nasalBone_ausente: 42.0,
      cardiacFocus_normal: 0.41,
      cardiacFocus_presente: 5.8,
      ventriculomegaly_normal: 0.32,
      ventriculomegaly_presente: 27.0,
      nuchalFold_normal: 0.18,
      nuchalFold_anormal: 23.0,
      shortFemur_normal: 0.33,
      shortFemur_anormal: 3.7,
      aberrantSubclavian_normal: 0.39,
      aberrantSubclavian_presente: 3.9,
      hyperechogenicBowel_normal: 0.28,
      hyperechogenicBowel_presente: 11.0,
      pyelectasis_normal: 0.44,
      pyelectasis_presente: 1.7
    };

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'baselineRisk' && key !== 'previousT21') {
        const multiplier = markerMultipliers[`${key}_${value}`];
        if (multiplier) risk *= multiplier;
      }
    });

    if (data.previousT21) {
      risk *= 13.0;
    }

    const resultado = {
      risk,
      interpretation: risk > (1/100) 
        ? "Alto Riesgo" 
        : risk > (1/1000) 
          ? "Riesgo Intermedio" 
          : "Bajo Riesgo",
      details: `Riesgo ajustado del segundo trimestre: 1:${Math.round(1/risk)}`
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
          Calculadora para ajustar el riesgo de T21 basado en marcadores ecográficos del segundo trimestre
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="baselineRisk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Riesgo Basal por Screening (1/X)</FormLabel>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">1/</span>
                  <Input
                    type="text"
                    placeholder="Ingrese el denominador del riesgo"
                    {...field}
                    className="flex-1 border border-gray-300 bg-white text-gray-900"
                  />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="previousT21"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="h-5 w-5 border border-gray-300 rounded data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <FormLabel className="font-normal cursor-pointer">
                  Antecedente de hijo con Trisomía 21 (LR: 13.0)
                </FormLabel>
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="nasalBone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hueso Nasal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 0.23)</SelectItem>
                      <SelectItem value="hipoplasico" className="text-gray-900">Hipoplásico (LR: 27.0)</SelectItem>
                      <SelectItem value="ausente" className="text-gray-900">Ausente (LR: 42.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardiacFocus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foco Cardíaco Hiperecogénico</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 0.41)</SelectItem>
                      <SelectItem value="presente" className="text-gray-900">Presente (LR: 5.8)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ventriculomegaly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ventriculomegalia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 0.32)</SelectItem>
                      <SelectItem value="presente" className="text-gray-900">Presente (LR: 27.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nuchalFold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pliegue Nucal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 0.18)</SelectItem>
                      <SelectItem value="anormal" className="text-gray-900">Anormal (LR: 23.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortFemur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fémur Corto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 0.33)</SelectItem>
                      <SelectItem value="anormal" className="text-gray-900">Anormal (LR: 3.7)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aberrantSubclavian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arteria Subclavia Aberrante</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 0.39)</SelectItem>
                      <SelectItem value="presente" className="text-gray-900">Presente (LR: 3.9)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hyperechogenicBowel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intestino Hiperecogénico</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 0.28)</SelectItem>
                      <SelectItem value="presente" className="text-gray-900">Presente (LR: 11.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pyelectasis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pielectasia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 0.44)</SelectItem>
                      <SelectItem value="presente" className="text-gray-900">Presente (LR: 1.7)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Calcular Riesgo
          </Button>
        </form>
      </Form>

      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Resultado:</h3>
          <p className="mb-2">Riesgo estimado: 1:{Math.round(1/result.risk)}</p>
          <p className={`font-medium ${
            result.interpretation === "Alto Riesgo"
              ? "text-red-600"
              : result.interpretation === "Riesgo Intermedio"
                ? "text-amber-600"
                : "text-green-600"
          }`}>
            {result.interpretation}
          </p>
          <p className="text-sm text-gray-600 mt-2">{result.details}</p>
        </div>
      )}
    </div>
  );
}