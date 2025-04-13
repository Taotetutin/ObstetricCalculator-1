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
      <Tabs defaultValue="calculator" className="w-full">
        <div className="w-full mb-4">
          <div className="mb-2 text-xs text-gray-500 text-center">Calculadora de Fecha Probable de Parto</div>
          <TabsList className="p-1 bg-blue-100/50 rounded-lg flex justify-center">
            <TabsTrigger 
              value="calculator" 
              className="h-10 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
            >
              <div className="inline-flex items-center">
                <Calculator className="h-4 w-4 mr-1.5" />
                <span>Calcular FPP</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="h-10 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
            >
              <div className="inline-flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>Historial</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="info" 
              className="h-10 px-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
            >
              <div className="inline-flex items-center">
                <Search className="h-4 w-4 mr-1.5" />
                <span>Información</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="calculator" className="mt-4">
          <Card className="p-1">
            <CardContent className="pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="lastPeriodDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de última menstruación</FormLabel>
                        <DateRoller
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
                <div className="mt-6">
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
                  
                  <div className="mt-6 space-y-4 print:hidden">
                    <p className="text-sm text-gray-500 mb-2">Fecha: {format(new Date(), "dd/MM/yyyy")}</p>
                    <SpeechButton
                      text={`Resultados de cálculo de fecha probable de parto: 
                      La fecha probable de parto es ${format(result.fpp, "dd 'de' MMMM 'de' yyyy", { locale: es })}.
                      La fecha probable de concepción es ${format(result.concepcion, "dd 'de' MMMM 'de' yyyy", { locale: es })}.`}
                    />
                    <GeneratePDFButton
                      contentId="fpp-pdf-content"
                      fileName={`fecha-probable-parto-${format(new Date(), "yyyyMMdd")}`}
                      label="📄 GENERAR INFORME PDF"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Historial de Cálculos</h3>
              <p className="text-sm text-gray-500 italic">No hay cálculos guardados en el historial.</p>
              <p className="text-sm text-gray-500 mt-4">El historial mostrará los cálculos recientes de fecha probable de parto cuando estén disponibles.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Información sobre el Cálculo de FPP</h3>
              <div className="space-y-3 text-sm">
                <p>La Fecha Probable de Parto (FPP) se calcula agregando 280 días (40 semanas) a la fecha del primer día del último período menstrual.</p>
                <p>Este método, conocido como la regla de Naegele, es una estimación aproximada y la fecha real del parto puede variar.</p>
                <p>La fecha de concepción se estima en aproximadamente 14 días después del primer día del último período menstrual.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}