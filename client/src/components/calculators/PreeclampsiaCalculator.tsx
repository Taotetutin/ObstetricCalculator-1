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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ethnicityOptions = [
  { value: 'caucasica', label: 'Caucásica' },
  { value: 'afro', label: 'Afro-caribeña' },
  { value: 'sudasiatica', label: 'Sud-asiática' },
  { value: 'asiaticooriental', label: 'Asiático-oriental' },
  { value: 'mixta', label: 'Mixta' },
];

type PreeclampsiaInput = {
  age: number;
  weight: number;
  height: number;
  ethnicity: "caucasica" | "afro" | "sudasiatica" | "asiaticooriental" | "mixta";
  gestationalAge: number;
  systolicBP: number;
  diastolicBP: number;
  nulliparous: boolean;
  previousPreeclampsia: boolean;
  chronicHypertension: boolean;
  diabetes: boolean;
  lupusAPS: boolean;
  multiplePregnancy: boolean;
  uterinePI?: number;
  pappA?: number;
  plgf?: number;
};

export default function PreeclampsiaCalculator() {
  const [result, setResult] = useState<{
    riskRatio: number;
    category: string;
    recommendation: string;
    map: number;
  } | null>(null);

  const form = useForm<PreeclampsiaInput>({
    resolver: zodResolver(calculatorTypes.preeclampsia),
    defaultValues: {
      age: 30,
      weight: 60,
      height: 1.65,
      ethnicity: 'caucasica',
      gestationalAge: 12,
      systolicBP: 120,
      diastolicBP: 80,
      nulliparous: false,
      previousPreeclampsia: false,
      chronicHypertension: false,
      diabetes: false,
      lupusAPS: false,
      multiplePregnancy: false,
    },
  });

  const onSubmit = async (data: PreeclampsiaInput) => {
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
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Esta calculadora utiliza el modelo de la Fetal Medicine Foundation para evaluar
          el riesgo de preeclampsia en el primer trimestre.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos Maternos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
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
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
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
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (m)</FormLabel>
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
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etnia</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione etnia" />
                      </SelectTrigger>
                      <SelectContent>
                        {ethnicityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <h3 className="text-lg font-medium">Historia Médica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'nulliparous', label: 'Primer embarazo' },
                { name: 'previousPreeclampsia', label: 'Preeclampsia previa' },
                { name: 'chronicHypertension', label: 'Hipertensión crónica' },
                { name: 'diabetes', label: 'Diabetes' },
                { name: 'lupusAPS', label: 'Lupus/SAF' },
                { name: 'multiplePregnancy', label: 'Embarazo múltiple' },
              ].map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as keyof PreeclampsiaInput}
                  render={({ field: { value, onChange } }) => (
                    <FormItem className="flex items-center space-x-2">
                      <Checkbox
                        checked={value}
                        onCheckedChange={onChange}
                      />
                      <FormLabel className="font-normal">{field.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Separator />

            <h3 className="text-lg font-medium">Datos del Embarazo Actual</h3>
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
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="systolicBP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presión Sistólica (mmHg)</FormLabel>
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
                name="diastolicBP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presión Diastólica (mmHg)</FormLabel>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <h3 className="text-lg font-medium">Marcadores Biofísicos y Bioquímicos (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="uterinePI"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP medio arterias uterinas</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                        field.onChange(value);
                      }}
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
                    <FormLabel>PAPP-A (MoM)</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                        field.onChange(value);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plgf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PlGF (pg/mL)</FormLabel>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                        field.onChange(value);
                      }}
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
            <h3 className="text-lg font-semibold mb-4">Resultado:</h3>
            <div className="space-y-2">
              <p>
                Riesgo de Preeclampsia:{" "}
                <span className="font-medium">1/{Math.round(1 / (result.riskRatio / 100))}</span>
              </p>
              <p>
                Presión Arterial Media:{" "}
                <span className="font-medium">{Math.round(result.map)} mmHg</span>
              </p>
              <p>
                Categoría de Riesgo:{" "}
                <span className="font-medium">{result.category}</span>
              </p>
              <p>
                Recomendación:{" "}
                <span className="font-medium">{result.recommendation}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}