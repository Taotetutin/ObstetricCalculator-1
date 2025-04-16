import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { calculateLiquidoAmniotico } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import SpeechButton from "@/components/ui/SpeechButton";
import GeneratePDFButton from "@/components/ui/GeneratePDFButton";

export default function LiquidoAmnioticoCalculator() {
  const [result, setResult] = useState<{ ila: number; categoria: string } | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.liquidoAmniotico),
    defaultValues: {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
    },
  });

  const onSubmit = async (data: { q1: number; q2: number; q3: number; q4: number }) => {
    const resultado = calculateLiquidoAmniotico(data);
    setResult(resultado);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "liquidoAmniotico",
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {[1, 2, 3, 4].map((quadrant) => (
            <FormField
              key={quadrant}
              control={form.control}
              name={`q${quadrant}` as "q1" | "q2" | "q3" | "q4"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuadrante {quadrant} (cm)</FormLabel>
                  <Input
                    type="number"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Calcular
          </Button>
        </form>
      </Form>

      {result && (
        <div>
          <Card>
            <CardContent className="pt-6">
              <div id="liquido-amniotico-result">
                <h3 className="text-lg font-semibold mb-2 text-blue-700">Resultado:</h3>
                <p>
                  Índice de Líquido Amniótico:{" "}
                  <span className="font-medium">{result.ila} cm</span>
                </p>
                <p>
                  Clasificación:{" "}
                  <span className="font-medium">{result.categoria}</span>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 space-y-4 print:hidden">
            <SpeechButton 
              text={`Resultado del índice de líquido amniótico: ${result.ila} centímetros. 
              Clasificación: ${result.categoria}.`}
            />
            
            <GeneratePDFButton 
              contentId="liquido-amniotico-result" 
              fileName={`liquido-amniotico-${format(new Date(), "yyyyMMdd")}`}
              label="📄 GENERAR INFORME PDF"
            />
          </div>
        </div>
      )}
    </div>
  );
}