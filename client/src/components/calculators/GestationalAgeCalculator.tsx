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
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Generamos arrays para los selectores
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 126 }, (_, i) => currentYear - 125 + i);

type Result = {
  weeks: number;
  days: number;
  method: string;
  estimatedLMP?: Date;
};

const DateSelector = ({ field, label }: { field: any; label: string }) => {
  const date = field.value instanceof Date ? field.value : new Date();

  const handleDateChange = (type: 'day' | 'month' | 'year', value: string) => {
    const newDate = new Date(date);
    if (type === 'day') newDate.setDate(parseInt(value));
    if (type === 'month') newDate.setMonth(parseInt(value) - 1);
    if (type === 'year') newDate.setFullYear(parseInt(value));
    field.onChange(newDate);
  };

  return (
    <FormItem className="space-y-2">
      <FormLabel className="text-base font-medium">{label}</FormLabel>
      <div className="flex gap-2">
        <div className="flex-1">
          <select
            className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={date.getDate().toString()}
            onChange={(e) => handleDateChange('day', e.target.value)}
          >
            {days.map((day) => (
              <option key={day} value={day.toString()}>
                {day}
              </option>
            ))}
          </select>
          <div className="mt-1 text-xs text-center text-gray-500">Día</div>
        </div>

        <div className="flex-[1.2]">
          <select
            className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={(date.getMonth() + 1).toString()}
            onChange={(e) => handleDateChange('month', e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month.toString()}>
                {format(new Date(2024, month - 1), 'MMMM', { locale: es })}
              </option>
            ))}
          </select>
          <div className="mt-1 text-xs text-center text-gray-500">Mes</div>
        </div>

        <div className="flex-1">
          <select
            className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={date.getFullYear().toString()}
            onChange={(e) => handleDateChange('year', e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          <div className="mt-1 text-xs text-center text-gray-500">Año</div>
        </div>
      </div>
      <FormMessage />
    </FormItem>
  );
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
                      <DateSelector field={field} label="Fecha de la ecografía" />
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
                        <Input className="border-blue-200 focus:border-blue-400" {...field} />
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
                        <Input className="border-blue-200 focus:border-blue-400" {...field} />
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
                        <Input className="border-blue-200 focus:border-blue-400" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={patientForm.control}
                    name="lastPeriodDate"
                    render={({ field }) => (
                      <DateSelector field={field} label="Fecha de Última Regla" />
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