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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

type Result = {
  weeks: number;
  days: number;
  method: string;
  estimatedLMP?: Date;
};

export default function GestationalAgeCalculator() {
  const [result, setResult] = useState<Result | null>(null);

  const form = useForm({
    resolver: zodResolver(calculatorTypes.gestationalAge),
    defaultValues: {
      lastPeriodDate: undefined,
      ultrasoundDate: new Date(),
      crownRumpLength: undefined,
      dbp: undefined,
      femurLength: undefined,
      abdominalCircumference: undefined,
    },
  });

  const onSubmit = async (data: any) => {
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
      <Tabs defaultValue="fur" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fur">FUR conocida</TabsTrigger>
          <TabsTrigger value="eco">Ecografía</TabsTrigger>
        </TabsList>

        <TabsContent value="fur">
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
        </TabsContent>

        <TabsContent value="eco">
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Ingrese las medidas ecográficas disponibles según la edad gestacional estimada
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="ultrasoundDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de la ecografía</FormLabel>
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

              <FormField
                control={form.control}
                name="crownRumpLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitud Cráneo-Caudal (mm) - hasta 14 semanas</FormLabel>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Medidas después de 14 semanas:</h4>

                <FormField
                  control={form.control}
                  name="dbp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diámetro Biparietal (mm)</FormLabel>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="femurLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitud Femoral (mm)</FormLabel>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="abdominalCircumference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Circunferencia Abdominal (mm) - después de 20 semanas</FormLabel>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Calcular
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      {result && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Resultado:</h3>
            <div className="space-y-2">
              <p>
                Edad Gestacional:{" "}
                <span className="font-medium">
                  {result.weeks} semanas y {result.days} días
                </span>
              </p>
              <p>
                Método: <span className="font-medium">{result.method}</span>
              </p>
              {result.estimatedLMP && (
                <p>
                  FUR estimada:{" "}
                  <span className="font-medium">
                    {format(result.estimatedLMP, "PPP", { locale: es })}
                  </span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}