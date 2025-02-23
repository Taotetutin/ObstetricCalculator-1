import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserPlus, Calculator, Search } from "lucide-react";
import { calculatorTypes, insertPatientSchema } from "@shared/schema";
import { calculateGestationalAge } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { WheelDatePicker } from "@/components/ui/date-wheel-picker";

type Result = {
  weeks: number;
  days: number;
  method: string;
  estimatedLMP?: Date;
};

export default function GestationalAgeCalculator() {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();
  const today = new Date();

  const calculatorForm = useForm({
    resolver: zodResolver(calculatorTypes.gestationalAge),
    defaultValues: {
      ultrasoundDate: today,
      crownRumpLength: undefined,
      dbp: undefined,
      femurLength: undefined,
      abdominalCircumference: undefined,
    },
  });

  const onCalculatorSubmit = async (data: any) => {
    // Validar que la fecha sea válida
    if (data.ultrasoundDate > new Date() || data.ultrasoundDate < new Date("1900-01-01")) {
      toast({
        title: "Error en la fecha",
        description: "Por favor seleccione una fecha válida",
        variant: "destructive",
      });
      return;
    }

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

  const patientForm = useForm({
    resolver: zodResolver(insertPatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      identification: "",
      lastPeriodDate: today,
      dueDate: today,
    },
  });

  const onPatientSubmit = async (data: any) => {
    try {
      if (data.lastPeriodDate > new Date() || data.lastPeriodDate < new Date("1900-01-01")) {
        toast({
          title: "Error en la fecha",
          description: "Por favor seleccione una fecha válida",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Paciente registrado",
          description: "Los datos del paciente se han guardado correctamente.",
        });
        patientForm.reset();
      } else {
        throw new Error("Error al guardar el paciente");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el paciente. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-blue-100/50">
          <TabsTrigger value="calculator" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>Calcular</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Registrar</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="search" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <Card className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-600">
                Calculadora de Edad Gestacional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...calculatorForm}>
                <form onSubmit={calculatorForm.handleSubmit(onCalculatorSubmit)} className="space-y-4">
                  <FormField
                    control={calculatorForm.control}
                    name="ultrasoundDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de la ecografía</FormLabel>
                        <WheelDatePicker
                          value={field.value}
                          onChange={field.onChange}
                          minYear={1900}
                          maxYear={2025}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={calculatorForm.control}
                    name="crownRumpLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitud Cráneo-Caudal (mm)</FormLabel>
                        <Input
                          type="number"
                          step="0.1"
                          className="border-blue-200 focus:border-blue-400"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                          }
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-600">
                Registro de Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...patientForm}>
                <form onSubmit={patientForm.handleSubmit(onPatientSubmit)} className="space-y-4">
                  <FormField
                    control={patientForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                          className="border-blue-200 focus:border-blue-400"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={patientForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <Input
                          className="border-blue-200 focus:border-blue-400"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={patientForm.control}
                    name="identification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Identificación</FormLabel>
                        <Input
                          className="border-blue-200 focus:border-blue-400"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={patientForm.control}
                    name="lastPeriodDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Última Regla</FormLabel>
                        <WheelDatePicker
                          value={field.value}
                          onChange={field.onChange}
                          minYear={1900}
                          maxYear={2025}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Registrar Paciente
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          {/* Add Search Content Here */}
        </TabsContent>
      </Tabs>

      {result && (
        <Card className="mt-4 border-2 border-blue-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {result.weeks} semanas y {result.days} días
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Método: {result.method}
              </p>
              {result.estimatedLMP && (
                <p className="text-sm text-gray-500">
                  FUM estimada: {format(result.estimatedLMP, "dd/MM/yyyy")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}