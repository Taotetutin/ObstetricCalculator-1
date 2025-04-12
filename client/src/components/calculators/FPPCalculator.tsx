import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { calculatorTypes } from "@shared/schema";
import { calculateFPP } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRoller } from "@/components/ui/wheel-roller";
import SpeechButton from "@/components/ui/SpeechButton";
import GeneratePDFButton from "@/components/ui/GeneratePDFButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Search, UserPlus, Calendar } from "lucide-react";

export default function FPPCalculator() {
  const [result, setResult] = useState<{
    fpp: Date;
    concepcion: Date;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.fpp),
    defaultValues: {
      lastPeriodDate: new Date(),
    },
  });

  const onSubmit = async (data: { lastPeriodDate: Date }) => {
    const fpp = calculateFPP(data);
    const concepcion = subDays(data.lastPeriodDate, 14); // 14 días después de la FUR

    setResult({
      fpp,
      concepcion
    });

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "fpp",
          input: JSON.stringify(data),
          result: JSON.stringify({ 
            fpp: fpp.toISOString(),
            concepcion: concepcion.toISOString()
          }),
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
            name="lastPeriodDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de última menstruación</FormLabel>
                <DateDropdown
                  value={field.value}
                  onChange={field.onChange}
                  minYear={1950}
                  maxYear={2025}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Calcular
          </Button>
        </form>
      </Form>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div id="fpp-pdf-content">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Resultado:</h3>
              <div className="space-y-2">
                <p>
                  Fecha Probable de Parto:{" "}
                  <span className="font-medium">
                    {format(result.fpp, "PPP", { locale: es })}
                  </span>
                </p>
                <p>
                  Fecha Probable de Concepción:{" "}
                  <span className="font-medium">
                    {format(result.concepcion, "PPP", { locale: es })}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mt-6 print:hidden">
              <p className="text-sm text-gray-500 mb-2">Fecha: {format(new Date(), "dd/MM/yyyy")}</p>
              <div className="flex space-x-2">
                <SpeechButton
                  text={`Resultados de cálculo de fecha probable de parto: 
                  La fecha probable de parto es ${format(result.fpp, "dd 'de' MMMM 'de' yyyy", { locale: es })}.
                  La fecha probable de concepción es ${format(result.concepcion, "dd 'de' MMMM 'de' yyyy", { locale: es })}.`}
                />
                <GeneratePDFButton
                  contentId="fpp-pdf-content"
                  fileName="Fecha_Probable_Parto"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}