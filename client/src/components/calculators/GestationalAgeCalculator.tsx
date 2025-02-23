import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, setYear, setMonth, setDate } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, UserPlus, Calculator, Search } from "lucide-react";
import { calculatorTypes, insertPatientSchema } from "@shared/schema";
import { calculateGestationalAge } from "@/lib/calculator-utils";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Generar arrays para los selectores
const years = Array.from({ length: 126 }, (_, i) => 1900 + i);
const months = Array.from({ length: 12 }, (_, i) => i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

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
      selectedDay: today.getDate(),
      selectedMonth: today.getMonth(),
      selectedYear: today.getFullYear(),
      crownRumpLength: undefined,
      dbp: undefined,
      femurLength: undefined,
      abdominalCircumference: undefined,
    },
  });

  const onCalculatorSubmit = async (data: any) => {
    const selectedDate = new Date(data.selectedYear, data.selectedMonth, data.selectedDay);

    // Validar que la fecha sea válida
    if (selectedDate > new Date() || selectedDate < new Date("1900-01-01")) {
      toast({
        title: "Error en la fecha",
        description: "Por favor seleccione una fecha válida",
        variant: "destructive",
      });
      return;
    }

    // Actualizar el objeto data con la fecha completa
    const calculationData = {
      ...data,
      ultrasoundDate: selectedDate,
    };

    const gestationalAge = calculateGestationalAge(calculationData);
    setResult(gestationalAge);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "gestationalAge",
          input: JSON.stringify(calculationData),
          result: JSON.stringify(gestationalAge),
        }),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  const onPatientSubmit = async (data: any) => {
    try {
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

  const patientForm = useForm({
    resolver: zodResolver(insertPatientSchema),
    defaultValues: {
      name: "",
      lastPeriodDate: new Date(),
      dueDate: new Date(),
    },
  });

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
                  <div className="space-y-2">
                    <FormLabel>Fecha de la ecografía</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      <FormField
                        control={calculatorForm.control}
                        name="selectedDay"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <SelectTrigger className="h-12 border-blue-200 text-center flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
                                <SelectValue placeholder="Día" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px] overflow-y-auto bg-white shadow-lg">
                                {days.map((day) => (
                                  <SelectItem 
                                    key={day} 
                                    value={day.toString()}
                                    className="h-10 flex items-center justify-center text-center hover:bg-blue-50 data-[state=checked]:bg-blue-100"
                                  >
                                    {day}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={calculatorForm.control}
                        name="selectedMonth"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <SelectTrigger className="h-12 border-blue-200 text-center flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
                                <SelectValue placeholder="Mes" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px] overflow-y-auto bg-white shadow-lg">
                                {months.map((month) => (
                                  <SelectItem 
                                    key={month} 
                                    value={month.toString()}
                                    className="h-10 flex items-center justify-center text-center hover:bg-blue-50 data-[state=checked]:bg-blue-100"
                                  >
                                    {format(new Date(2000, month, 1), 'MMMM', { locale: es })}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={calculatorForm.control}
                        name="selectedYear"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <SelectTrigger className="h-12 border-blue-200 text-center flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
                                <SelectValue placeholder="Año" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px] overflow-y-auto bg-white shadow-lg">
                                {years.map((year) => (
                                  <SelectItem 
                                    key={year} 
                                    value={year.toString()}
                                    className="h-10 flex items-center justify-center text-center hover:bg-blue-50 data-[state=checked]:bg-blue-100"
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

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

        <TabsContent value="segundo">
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertDescription>
              Para cálculo entre 14-20 semanas. Se requieren DBP y FL.
            </AlertDescription>
          </Alert>
          <Form {...calculatorForm}>
            <form onSubmit={calculatorForm.handleSubmit(onCalculatorSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Fecha de la ecografía</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={calculatorForm.control}
                    name="selectedDay"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger className="h-12 border-blue-200 text-center flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
                            <SelectValue placeholder="Día" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] overflow-y-auto bg-white shadow-lg">
                            {days.map((day) => (
                              <SelectItem 
                                key={day} 
                                value={day.toString()}
                                className="h-10 flex items-center justify-center text-center hover:bg-blue-50 data-[state=checked]:bg-blue-100"
                              >
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={calculatorForm.control}
                    name="selectedMonth"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger className="h-12 border-blue-200 text-center flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
                            <SelectValue placeholder="Mes" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] overflow-y-auto bg-white shadow-lg">
                            {months.map((month) => (
                              <SelectItem 
                                key={month} 
                                value={month.toString()}
                                className="h-10 flex items-center justify-center text-center hover:bg-blue-50 data-[state=checked]:bg-blue-100"
                              >
                                {format(new Date(2000, month, 1), 'MMMM', { locale: es })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={calculatorForm.control}
                    name="selectedYear"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger className="h-12 border-blue-200 text-center flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
                            <SelectValue placeholder="Año" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] overflow-y-auto bg-white shadow-lg">
                            {years.map((year) => (
                              <SelectItem 
                                key={year} 
                                value={year.toString()}
                                className="h-10 flex items-center justify-center text-center hover:bg-blue-50 data-[state=checked]:bg-blue-100"
                              >
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={calculatorForm.control}
                  name="dbp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diámetro Biparietal (mm)</FormLabel>
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

                <FormField
                  control={calculatorForm.control}
                  name="femurLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitud Femoral (mm)</FormLabel>
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
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Calcular
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="tercer">
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertDescription>
              Para cálculo después de 20 semanas. Se requieren las tres medidas.
            </AlertDescription>
          </Alert>
          <Form {...calculatorForm}>
            <form onSubmit={calculatorForm.handleSubmit(onCalculatorSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Fecha de la ecografía</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={calculatorForm.control}
                    name="selectedDay"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger className="h-12 border-blue-200 text-center flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
                            <SelectValue placeholder="Día" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] overflow-y-auto bg-white shadow-lg">
                            {days.map((day) => (
                              <SelectItem 
                                key={day} 
                                value={day.toString()}
                                className="h-10 flex items-center justify-center text-center hover:bg-blue-50 data-[state=checked]:bg-blue-100"
                              >
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={calculatorForm.control}
                    name="selectedMonth"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger className="h-12 border-blue-200 text-center flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
                            <SelectValue placeholder="Mes" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] overflow-y-auto bg-white shadow-lg">
                            {months.map((month) => (
                              <SelectItem 
                                key={month} 
                                value={month.toString()}
                                className="h-10 flex items-center justify-center text-center hover:bg-blue-50 data-[state=checked]:bg-blue-100"
                              >
                                {format(new Date(2000, month, 1), 'MMMM', { locale: es })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={calculatorForm.control}
                    name="selectedYear"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger className="h-12 border-blue-200 text-center flex justify-center items-center bg-gradient-to-b from-white to-blue-50">
                            <SelectValue placeholder="Año" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] overflow-y-auto bg-white shadow-lg">
                            {years.map((year) => (
                              <SelectItem 
                                key={year} 
                                value={year.toString()}
                                className="h-10 flex items-center justify-center text-center hover:bg-blue-50 data-[state=checked]:bg-blue-100"
                              >
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={calculatorForm.control}
                  name="dbp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diámetro Biparietal (mm)</FormLabel>
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

                <FormField
                  control={calculatorForm.control}
                  name="femurLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitud Femoral (mm)</FormLabel>
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
              </div>

              <FormField
                control={calculatorForm.control}
                name="abdominalCircumference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Circunferencia Abdominal (mm)</FormLabel>
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Paciente</FormLabel>
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
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border-blue-200 hover:bg-blue-50"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Seleccione una fecha</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
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
    </div>
  );
}