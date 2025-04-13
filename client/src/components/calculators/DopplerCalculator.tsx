import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calculateDoppler } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { format } from "date-fns";
import SpeechButton from "@/components/ui/SpeechButton";
import GeneratePDFButton from "@/components/ui/GeneratePDFButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type DopplerResult = {
  percentiles: {
    auPi: number;
    acmPi: number;
    acmPsv: number;
  };
  cpr: number;
  cprPercentile: number; 
  evaluation: string;
  recommendations: string;
};

export default function DopplerCalculator() {
  const [result, setResult] = useState<DopplerResult | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.doppler),
    defaultValues: {
      auPi: 0,
      acmPi: 0,
      acmPsv: 0,
      dvPi: 0,
      dvWave: 'normal',
      semanasGestacion: 28,
      diasGestacion: 0,
    },
  });

  const onSubmit = async (data: any) => {
    const resultado = calculateDoppler(data);
    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "doppler",
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
          Esta calculadora evalúa los índices Doppler fetales y determina sus percentiles
          según la edad gestacional.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Arteria Umbilical</h3>
            <FormField
              control={form.control}
              name="auPi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Índice de Pulsatilidad</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Arteria Cerebral Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="acmPi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Índice de Pulsatilidad</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acmPsv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Velocidad Pico Sistólica</FormLabel>
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
            <h3 className="text-lg font-medium mb-4">Ductus Venoso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dvPi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Índice de Pulsatilidad</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dvWave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Onda a</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione patrón" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="ausente">Ausente</SelectItem>
                        <SelectItem value="reversa">Reversa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Edad Gestacional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="semanasGestacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semanas</FormLabel>
                    <Input
                      type="number"
                      min="20"
                      max="40"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diasGestacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      max="6"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Calcular
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div id="doppler-pdf-content">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Resultados:</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-blue-700">Índices Doppler:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>AU-IP: <span className="font-medium">{result.percentiles.auPi}%</span></li>
                    <li>ACM-IP: <span className="font-medium">{result.percentiles.acmPi}%</span></li>
                    <li>ACM-PSV: <span className="font-medium">{result.percentiles.acmPsv}%</span></li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-blue-700">Índice Cerebro-Placentario (IPC):</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Valor: <span className="font-medium">{result.cpr.toFixed(2)}</span></li>
                    <li>Percentil: <span className="font-medium">{result.cprPercentile}%</span></li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-blue-700">Estado:</p>
                  <p className={`ml-4 font-medium ${result.evaluation === "Alterado" ? "text-red-600" : "text-green-600"}`}>
                    {result.evaluation}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-blue-700">Interpretación y Recomendaciones:</p>
                  <p className="ml-4 text-sm">{result.recommendations}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4 print:hidden">
              <p className="text-sm text-gray-500 mb-2">Fecha: {format(new Date(), "dd/MM/yyyy")}</p>
              
              <SpeechButton
                text={`Resultados del Doppler Fetal:
                  Índices Doppler: Arteria Umbilical IP: ${result.percentiles.auPi}%, 
                  Arteria Cerebral Media IP: ${result.percentiles.acmPi}%, 
                  Arteria Cerebral Media Velocidad Pico Sistólica: ${result.percentiles.acmPsv}%.
                  Índice Cerebro-Placentario: ${result.cpr.toFixed(2)}, en percentil ${result.cprPercentile}%.
                  Estado: ${result.evaluation}.
                  Recomendaciones: ${result.recommendations}`}
              />
              
              <GeneratePDFButton
                contentId="doppler-pdf-content"
                fileName="Doppler_Fetal_Resultado"
                label="📄 GENERAR INFORME PDF"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}