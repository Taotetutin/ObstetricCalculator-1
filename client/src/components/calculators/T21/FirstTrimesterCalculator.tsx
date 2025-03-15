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

type FirstTrimesterInput = {
  baseRisk: string;
  nasalBone: 'normal' | 'ausente';
  tricuspidRegurgitation: 'normal' | 'presente';
  ductusVenosus: 'normal' | 'ausente' | 'reverso';
  previousT21: boolean;
};

export default function FirstTrimesterCalculator() {
  const [result, setResult] = useState<{
    risk: number;
    interpretation: string;
    details: string;
  } | null>(null);

  const form = useForm<FirstTrimesterInput>({
    resolver: zodResolver(calculatorTypes.t21FirstTrimester),
    defaultValues: {
      baseRisk: '',
      nasalBone: 'normal',
      tricuspidRegurgitation: 'normal',
      ductusVenosus: 'normal',
      previousT21: false,
    },
  });

  const onSubmit = async (data: FirstTrimesterInput) => {
    const baseRisk = 1 / parseFloat(data.baseRisk);
    let risk = baseRisk;

    const multipliers = {
      nasalBone: {
        ausente: 6.3,
      },
      tricuspidRegurgitation: {
        presente: 5.4,
      },
      ductusVenosus: {
        ausente: 2.8,
        reverso: 3.8,
      }
    };

    if (data.nasalBone === 'ausente') {
      risk *= multipliers.nasalBone.ausente;
    }
    if (data.tricuspidRegurgitation === 'presente') {
      risk *= multipliers.tricuspidRegurgitation.presente;
    }
    if (data.ductusVenosus !== 'normal') {
      risk *= multipliers.ductusVenosus[data.ductusVenosus];
    }

    if (data.previousT21) {
      risk *= 4.3;
    }

    const resultado = {
      risk,
      interpretation: risk > (1/100) 
        ? "Alto Riesgo" 
        : risk > (1/1000) 
          ? "Riesgo Intermedio" 
          : "Bajo Riesgo",
      details: `Riesgo ajustado del primer trimestre: 1:${Math.round(1/risk)}`
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
          Calculadora para ajustar el riesgo de T21 del primer trimestre basado en marcadores ecográficos adicionales
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="baseRisk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Riesgo por Screening básico (1/X)</FormLabel>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">1/</span>
                  <Input
                    type="number"
                    placeholder="Ingrese el denominador del riesgo"
                    {...field}
                    className="flex-1 border border-gray-300 focus:border-blue-500"
                  />
                </div>
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
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 1.0)</SelectItem>
                      <SelectItem value="ausente" className="text-gray-900">Ausente (LR: 6.3)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tricuspidRegurgitation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regurgitación Tricuspídea</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 1.0)</SelectItem>
                      <SelectItem value="presente" className="text-gray-900">Presente (LR: 5.4)</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-900">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal" className="text-gray-900">Normal (LR: 1.0)</SelectItem>
                      <SelectItem value="ausente" className="text-gray-900">Ausente (LR: 2.8)</SelectItem>
                      <SelectItem value="reverso" className="text-gray-900">Reverso (LR: 3.8)</SelectItem>
                    </SelectContent>
                  </Select>
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
                    Antecedente de hijo con Trisomía 21 (LR: 4.3)
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Calcular Riesgo Ajustado
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