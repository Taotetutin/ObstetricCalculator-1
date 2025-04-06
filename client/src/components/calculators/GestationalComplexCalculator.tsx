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
import SpeechButton from "@/components/ui/SpeechButton";
import GeneratePDFButton from "@/components/ui/GeneratePDFButton";

// Generamos arrays para los selectores
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 126 }, (_, i) => currentYear - 125 + i);

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
        dtpaVaccine: `${format(addDays(lastMenstrualPeriod, 196), 'dd/MM/yyyy', { locale: es })} a ${format(addDays(lastMenstrualPeriod, 210), 'dd/MM/yyyy', { locale: es })}`,
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

  return (
    <div className="h-full flex flex-col">
      <Alert className="mb-4">
        <AlertDescription>
          Calculadora gestacional completa para determinar fechas importantes del embarazo
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="calculator" className="flex-1 flex flex-col">
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

        <div className="flex-1 flex overflow-auto">
          <TabsContent value="calculator" className="flex-1 h-full w-full">
            <div className="h-full grid md:grid-cols-2 gap-4">
              <Card className="overflow-y-auto max-h-[500px]">
                <CardContent className="p-4">
                  <Form {...calculatorForm}>
                    <form onSubmit={calculatorForm.handleSubmit(onCalculate)} className="space-y-4">
                      <FormField
                        control={calculatorForm.control}
                        name="lastMenstrualPeriod"
                        render={({ field }) => (
                          <DateSelector field={field} label="Fecha de Última Regla (FUR)" />
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
                <div className="overflow-y-auto pr-2 max-h-[80vh] pb-4">
                  <div className="flex justify-end gap-2 mb-2">
                    <SpeechButton 
                      text={`Edad gestacional: ${result.gestationalAge.weeks} semanas ${result.gestationalAge.days} días. 
                      Fecha de concepción: ${format(result.conceptionDate, "dd 'de' MMMM, yyyy", { locale: es })}.
                      Fecha probable de parto: ${format(result.dueDate, "dd 'de' MMMM, yyyy", { locale: es })}.
                      Pre Natal en la semana 34: ${format(result.week34, "dd 'de' MMMM, yyyy", { locale: es })}.`}
                    />
                    <GeneratePDFButton 
                      contentId="calculation-result" 
                      fileName={`gestacion-${format(new Date(), "yyyyMMdd")}`}
                    />
                  </div>
                  <div className="space-y-4" id="calculation-result">
                    <Card className="border-2 border-blue-100">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">
                          Edad Gestacional: {result.gestationalAge.weeks}s {result.gestationalAge.days}d
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 font-medium mb-1">Fecha Probable de Concepción</p>
                            <p className="text-lg font-semibold">{format(result.conceptionDate, "dd 'de' MMMM, yyyy", { locale: es })}</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 font-medium mb-1">Fecha Probable de Parto</p>
                            <p className="text-lg font-semibold">{format(result.dueDate, "dd 'de' MMMM, yyyy", { locale: es })}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-blue-100">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-semibold text-blue-700 mb-3 pb-2 border-b border-blue-100">
                          Fechas Administrativas
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2.5">
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">Asignación Familiar</p>
                              <p className="text-sm mt-1">Semana 20: {format(result.week20, "dd/MM/yyyy", { locale: es })}</p>
                            </div>
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">ISAPRE</p>
                              <p className="text-sm mt-1">Semana 30: {format(result.week30, "dd/MM/yyyy", { locale: es })}</p>
                            </div>
                          </div>
                          <div className="space-y-2.5">
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">Pre Natal</p>
                              <p className="text-sm mt-1">Semana 34: {format(result.week34, "dd/MM/yyyy", { locale: es })}</p>
                            </div>
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">Fecha Probable de Parto</p>
                              <p className="text-sm mt-1">{format(result.dueDate, "dd/MM/yyyy", { locale: es })}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card className="border-2 border-blue-100">
                        <CardContent className="p-4">
                          <h4 className="text-lg font-semibold text-blue-700 mb-3 pb-2 border-b border-blue-100">
                            Controles 1° y 2° Trimestre
                          </h4>
                          <div className="space-y-2.5">
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">Screening 1° Trimestre</p>
                              <p className="text-sm mt-1">{result.screening.firstTrimester}</p>
                            </div>
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">Screening 2° Trimestre</p>
                              <p className="text-sm mt-1">{result.screening.secondTrimester}</p>
                            </div>
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">Exámenes 2° Trimestre</p>
                              <p className="text-sm mt-1">{result.screening.secondTrimesterExams}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-blue-100">
                        <CardContent className="p-4">
                          <h4 className="text-lg font-semibold text-blue-700 mb-3 pb-2 border-b border-blue-100">
                            Controles 3° Trimestre
                          </h4>
                          <div className="space-y-2.5">
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">Exámenes</p>
                              <p className="text-sm mt-1">{result.screening.thirdTrimesterExams}</p>
                            </div>
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">Vacuna DTPa y Rhogam</p>
                              <p className="text-sm mt-1">{result.screening.dtpaVaccine}</p>
                            </div>
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">Screening</p>
                              <p className="text-sm mt-1">{result.screening.thirdTrimesterScreening}</p>
                            </div>
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-600">Cultivo SGB</p>
                              <p className="text-sm mt-1">{result.screening.gbsTest}</p>
                            </div>
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
                        <DateSelector field={field} label="Fecha de Última Regla (FUR)" />
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