import { useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Calculator, UserPlus } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Patient } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type GestationalResult = {
  gestationalAge: { weeks: number; days: number };
  conceptionDate: Date;
  dueDate: Date;
  week20: Date;
  week30: Date;
  week34: Date;
  screening: {
    firstTrimester: string;
    secondTrimester: string;
    secondTrimesterExams: string;
    dtpaVaccine: string;
    thirdTrimesterExams: string;
    thirdTrimesterScreening: string;
    gbsTest: string;
  };
};

function getGestationalAge(startDate: Date, endDate: Date) {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return {
    weeks: Math.floor(diffDays / 7),
    days: diffDays % 7,
  };
}

export default function GestationalComplexCalculator() {
  const [result, setResult] = useState<GestationalResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: searchResults } = useQuery({
    queryKey: ['/api/patients', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const response = await fetch(`/api/patients/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Error buscando pacientes');
      return response.json() as Promise<Patient[]>;
    },
    enabled: searchTerm.length > 2
  });

  const { data: allPatients } = useQuery({
    queryKey: ['/api/patients'],
    queryFn: async () => {
      const response = await fetch('/api/patients');
      if (!response.ok) throw new Error('Error obteniendo pacientes');
      return response.json() as Promise<Patient[]>;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (patient: {
      firstName: string;
      lastName: string;
      identification: string;
      lastPeriodDate: Date
    }) => {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
      });
      if (!response.ok) throw new Error('Error guardando paciente');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
    }
  });

  const calculatorForm = useForm({
    defaultValues: {
      lastMenstrualPeriod: new Date(),
    },
  });

  const patientForm = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      identification: '',
      lastMenstrualPeriod: new Date(),
    },
  });

  const calculateDates = (lastMenstrualPeriod: Date) => {
    const today = new Date();
    const gestationalAge = getGestationalAge(lastMenstrualPeriod, today);
    const conceptionDate = addDays(lastMenstrualPeriod, 14);
    const dueDate = addDays(lastMenstrualPeriod, 280);
    const week20 = addDays(lastMenstrualPeriod, 140);
    const week30 = addDays(lastMenstrualPeriod, 210);
    const week34 = addDays(lastMenstrualPeriod, 238);

    return {
      gestationalAge,
      conceptionDate,
      dueDate,
      week20,
      week30,
      week34,
      screening: {
        firstTrimester: `${format(addDays(lastMenstrualPeriod, 77), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 97), 'dd/MM/yyyy', { locale: es })}`,
        secondTrimester: `${format(addDays(lastMenstrualPeriod, 140), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 168), 'dd/MM/yyyy', { locale: es })}`,
        secondTrimesterExams: `${format(addDays(lastMenstrualPeriod, 175), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 189), 'dd/MM/yyyy', { locale: es })}`,
        dtpaVaccine: format(addDays(lastMenstrualPeriod, 196), 'dd/MM/yyyy', { locale: es }),
        thirdTrimesterExams: `${format(addDays(lastMenstrualPeriod, 224), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 238), 'dd/MM/yyyy', { locale: es })}`,
        thirdTrimesterScreening: `${format(addDays(lastMenstrualPeriod, 238), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 259), 'dd/MM/yyyy', { locale: es })}`,
        gbsTest: `${format(addDays(lastMenstrualPeriod, 245), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 259), 'dd/MM/yyyy', { locale: es })}`,
      },
    };
  };

  const onCalculate = (data: any) => {
    const result = calculateDates(data.lastMenstrualPeriod);
    setResult(result);
  };

  const onSavePatient = async (data: any) => {
    try {
      await saveMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        identification: data.identification,
        lastPeriodDate: data.lastMenstrualPeriod
      });
      const result = calculateDates(data.lastMenstrualPeriod);
      setResult(result);
    } catch (error) {
      console.error('Error al guardar paciente:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <Alert className="mb-4">
        <AlertDescription>
          Calculadora gestacional completa para determinar fechas importantes del embarazo
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="calculator" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 mb-4">
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

        <div className="flex-1 flex overflow-hidden">
          <TabsContent value="calculator" className="flex-1 h-full">
            <div className="h-full grid md:grid-cols-2 gap-4">
              <Card className="overflow-auto">
                <CardContent className="p-4">
                  <Form {...calculatorForm}>
                    <form onSubmit={calculatorForm.handleSubmit(onCalculate)} className="space-y-4">
                      <FormField
                        control={calculatorForm.control}
                        name="lastMenstrualPeriod"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-base font-medium">Fecha de Última Regla (FUR)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Seleccione una fecha</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
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

                      <Button type="submit" className="w-full py-4">
                        Calcular Fechas
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {result && (
                <div className="overflow-auto">
                  <div className="space-y-4">
                    <Card className="border-2 border-blue-100">
                      <CardContent className="p-4">
                        <h3 className="text-base font-semibold text-blue-600 mb-2 pb-1 border-b">Resultados Principales</h3>
                        <div className="space-y-2 text-sm">
                          <p className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="font-medium">Edad Gestacional:</span>
                            <span className="text-blue-700">{result.gestationalAge.weeks}s {result.gestationalAge.days}d</span>
                          </p>
                          <p className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="font-medium">FP Concepción:</span>
                            <span className="text-blue-700">{format(result.conceptionDate, "dd/MM/yyyy", { locale: es })}</span>
                          </p>
                          <p className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="font-medium">FP Parto:</span>
                            <span className="text-blue-700">{format(result.dueDate, "dd/MM/yyyy", { locale: es })}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-2 border-blue-100">
                        <CardContent className="p-4">
                          <h3 className="text-base font-semibold text-blue-600 mb-2 pb-1 border-b">Fechas Administrativas</h3>
                          <div className="space-y-2 text-sm">
                            <p className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span className="font-medium">As. Familiar:</span>
                              <span className="text-blue-700">{format(result.week20, "dd/MM/yyyy", { locale: es })}</span>
                            </p>
                            <p className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span className="font-medium">Isapre:</span>
                              <span className="text-blue-700">{format(result.week30, "dd/MM/yyyy", { locale: es })}</span>
                            </p>
                            <p className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span className="font-medium">Prenatal:</span>
                              <span className="text-blue-700">{format(result.week34, "dd/MM/yyyy", { locale: es })}</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-blue-100">
                        <CardContent className="p-4">
                          <h3 className="text-base font-semibold text-blue-600 mb-2 pb-1 border-b">Fechas Clínicas</h3>
                          <div className="space-y-1.5 text-xs">
                            <p className="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                              <span className="font-medium">Screen I:</span>
                              <span className="text-blue-700">{result.screening.firstTrimester}</span>
                            </p>
                            <p className="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                              <span className="font-medium">Screen II:</span>
                              <span className="text-blue-700">{result.screening.secondTrimester}</span>
                            </p>
                            <p className="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                              <span className="font-medium">Ex II:</span>
                              <span className="text-blue-700">{result.screening.secondTrimesterExams}</span>
                            </p>
                            <p className="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                              <span className="font-medium">DTPa:</span>
                              <span className="text-blue-700">{result.screening.dtpaVaccine}</span>
                            </p>
                            <p className="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                              <span className="font-medium">Ex III:</span>
                              <span className="text-blue-700">{result.screening.thirdTrimesterExams}</span>
                            </p>
                            <p className="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                              <span className="font-medium">Screen III:</span>
                              <span className="text-blue-700">{result.screening.thirdTrimesterScreening}</span>
                            </p>
                            <p className="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                              <span className="font-medium">SGB:</span>
                              <span className="text-blue-700">{result.screening.gbsTest}</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="register" className="flex-1 h-full overflow-auto">
            <Card>
              <CardContent className="p-4">
                <Form {...patientForm}>
                  <form onSubmit={patientForm.handleSubmit(onSavePatient)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={patientForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellidos</FormLabel>
                            <Input {...field} className="h-9" placeholder="Ingrese apellidos" />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={patientForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombres</FormLabel>
                            <Input {...field} className="h-9" placeholder="Ingrese nombres" />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={patientForm.control}
                      name="identification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de ID</FormLabel>
                          <Input {...field} className="h-9" placeholder="Ingrese número de identificación" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={patientForm.control}
                      name="lastMenstrualPeriod"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha de Última Regla (FUR)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccione una fecha</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
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

                    <Button type="submit" className="w-full py-4">
                      Registrar
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="flex-1 h-full overflow-hidden">
            <Card className="h-full">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Buscar por apellido o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9"
                  />
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-auto">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-500">Registros</h3>
                    <div className="space-y-2">
                      {(searchTerm ? searchResults : allPatients)?.map((patient) => {
                        const gestationalAge = getGestationalAge(new Date(patient.lastPeriodDate), new Date());
                        return (
                          <div
                            key={patient.id}
                            className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border cursor-pointer"
                            onClick={() => {
                              const result = calculateDates(new Date(patient.lastPeriodDate));
                              setResult(result);
                            }}
                          >
                            <div>
                              <div className="font-medium">
                                {patient.lastName}, {patient.firstName}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {patient.identification}
                              </div>
                            </div>
                            <div className="text-sm text-blue-600 font-medium">
                              {gestationalAge.weeks}s {gestationalAge.days}d
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}