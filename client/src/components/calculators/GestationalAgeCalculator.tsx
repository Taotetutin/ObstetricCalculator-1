import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { calculatorTypes } from "@shared/schema";
import { calculateGestationalAge } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

export default function GestationalAgeCalculator() {
  const [result, setResult] = useState<{ weeks: number; days: number } | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.gestationalAge),
    defaultValues: {
      lastPeriodDate: new Date(),
      ultrasoundDate: undefined,
      crownRumpLength: undefined,
    },
  });

  const onSubmit = async (data: { lastPeriodDate: Date }) => {
    const gestationalAge = calculateGestationalAge(data);
    setResult(gestationalAge);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "gestationalAge",
          input: JSON.stringify(data),
          result: JSON.stringify(gestationalAge),
        }),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-blue-700 mb-1">Edad Gestacional</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="lastPeriodDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de última menstruación</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Resultado:</h3>
            <p>
              Edad Gestacional:{" "}
              <span className="font-medium">
                {result.weeks} semanas y {result.days} días
              </span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}