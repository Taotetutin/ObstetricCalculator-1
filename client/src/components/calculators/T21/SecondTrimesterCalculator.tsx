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
      nasalBone: 'no_evaluado',
      cardiacFocus: 'no_evaluado',
      ventriculomegaly: 'no_evaluado',
      nuchalFold: 'no_evaluado',
      shortFemur: 'no_evaluado',
      aberrantSubclavian: 'no_evaluado',
      hyperechogenicBowel: 'no_evaluado',
      pyelectasis: 'no_evaluado',
      previousT21: false,
    },
  });

  const onSubmit = async (data: any) => {
    let risk = 1/parseFloat(data.baselineRisk);

    const markerMultipliers: Record<string, number> = {
      nasalBone_no_evaluado: 1.0,
      nasalBone_normal: 0.46,
      nasalBone_hipoplasico: 23.27,
      nasalBone_ausente: 23.27,

      cardiacFocus_no_evaluado: 1.0,
      cardiacFocus_normal: 0.80,
      cardiacFocus_presente: 5.83,

      ventriculomegaly_no_evaluado: 1.0,
      ventriculomegaly_normal: 0.94,
      ventriculomegaly_presente: 27.52,

      nuchalFold_no_evaluado: 1.0,
      nuchalFold_normal: 0.80,
      nuchalFold_anormal: 23.3,

      shortFemur_no_evaluado: 1.0,
      shortFemur_normal: 0.80,
      shortFemur_anormal: 3.72,

      aberrantSubclavian_no_evaluado: 1.0,
      aberrantSubclavian_normal: 0.71,
      aberrantSubclavian_presente: 27.52,

      hyperechogenicBowel_no_evaluado: 1.0,
      hyperechogenicBowel_normal: 0.84,
      hyperechogenicBowel_presente: 11.44,

      pyelectasis_no_evaluado: 1.0,
      pyelectasis_normal: 0.92,
      pyelectasis_presente: 7.63,
    };

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'baselineRisk' && key !== 'previousT21') {
        const multiplier = markerMultipliers[`${key}_${value}`];
        if (multiplier) risk *= multiplier;
      }
    });

    if (data.previousT21) {
      risk *= 4.0;
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
                  Antecedente de hijo con Trisomía 21 (LR: 4.0)
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
                      <SelectItem value="no_evaluado" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>No evaluado</span>
                          <span className="text-xs text-gray-500">LR: 1.0</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="normal" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Normal</span>
                          <span className="text-xs text-gray-500">LR: 0.46</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="hipoplasico" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Hipoplásico</span>
                          <span className="text-xs text-gray-500">LR: 23.27</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ausente" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Ausente</span>
                          <span className="text-xs text-gray-500">LR: 23.27</span>
                        </div>
                      </SelectItem>
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
                      <SelectItem value="no_evaluado" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>No evaluado</span>
                          <span className="text-xs text-gray-500">LR: 1.0</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="normal" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Normal</span>
                          <span className="text-xs text-gray-500">LR: 0.80</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="presente" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Presente</span>
                          <span className="text-xs text-gray-500">LR: 5.83</span>
                        </div>
                      </SelectItem>
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
                      <SelectItem value="no_evaluado" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>No evaluado</span>
                          <span className="text-xs text-gray-500">LR: 1.0</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="normal" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Normal</span>
                          <span className="text-xs text-gray-500">LR: 0.94</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="presente" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Presente</span>
                          <span className="text-xs text-gray-500">LR: 27.52</span>
                        </div>
                      </SelectItem>
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
                      <SelectItem value="no_evaluado" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>No evaluado</span>
                          <span className="text-xs text-gray-500">LR: 1.0</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="normal" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Normal</span>
                          <span className="text-xs text-gray-500">LR: 0.80</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="anormal" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Anormal</span>
                          <span className="text-xs text-gray-500">LR: 23.3</span>
                        </div>
                      </SelectItem>
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
                      <SelectItem value="no_evaluado" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>No evaluado</span>
                          <span className="text-xs text-gray-500">LR: 1.0</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="normal" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Normal</span>
                          <span className="text-xs text-gray-500">LR: 0.80</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="anormal" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Anormal</span>
                          <span className="text-xs text-gray-500">LR: 3.72</span>
                        </div>
                      </SelectItem>
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
                      <SelectItem value="no_evaluado" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>No evaluado</span>
                          <span className="text-xs text-gray-500">LR: 1.0</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="normal" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Normal</span>
                          <span className="text-xs text-gray-500">LR: 0.71</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="presente" className="text-gray-900">
                        <div className="flex justify-between w-full">
                          <span>Presente</span>
                          <span className="text-xs text-gray-500">LR: 27.52</span>
                        </div>
                      </SelectItem>
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
                      <SelectItem value="no_evaluado" className="text-gray-900">No evaluado (LR: 1.0)</SelectItem>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 0.84)</SelectItem>
                      <SelectItem value="presente" className="text-gray-900">Presente (LR: 11.44)</SelectItem>
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
                      <SelectItem value="no_evaluado" className="text-gray-900">No evaluado (LR: 1.0)</SelectItem>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 0.92)</SelectItem>
                      <SelectItem value="presente" className="text-gray-900">Presente (LR: 7.63)</SelectItem>
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