import { useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const form = useForm({
    defaultValues: {
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

  const onSubmit = (data: any) => {
    const result = calculateDates(data.lastMenstrualPeriod);
    setResult(result);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Calculadora gestacional completa para determinar fechas importantes del embarazo
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="lastMenstrualPeriod"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Última Regla (FUR)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
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

          <Button type="submit" className="w-full">
            Calcular Fechas
          </Button>
        </form>
      </Form>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Resultados Principales</h3>
              <div className="space-y-2">
                <p>
                  <strong>Edad Gestacional Actual:</strong>{" "}
                  {result.gestationalAge.weeks} semanas y {result.gestationalAge.days} días
                </p>
                <p>
                  <strong>Fecha Probable de Concepción:</strong>{" "}
                  {format(result.conceptionDate, "PPP", { locale: es })}
                </p>
                <p>
                  <strong>Fecha Probable de Parto:</strong>{" "}
                  {format(result.dueDate, "PPP", { locale: es })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Fechas Administrativas</h3>
              <div className="space-y-2">
                <p>
                  <strong>Cert. Asignación Familiar:</strong>{" "}
                  {format(result.week20, "PPP", { locale: es })}
                </p>
                <p>
                  <strong>Cert. Inscripción Isapre:</strong>{" "}
                  {format(result.week30, "PPP", { locale: es })}
                </p>
                <p>
                  <strong>Licencia Médica Prenatal:</strong>{" "}
                  {format(result.week34, "PPP", { locale: es })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Fechas de Importancia Clínica</h3>
              <div className="space-y-2">
                <p>
                  <strong>Screening Ier Trim.:</strong> {result.screening.firstTrimester}
                </p>
                <p>
                  <strong>Screening II Trim.:</strong> {result.screening.secondTrimester}
                </p>
                <p>
                  <strong>Exámenes II Trim.:</strong> {result.screening.secondTrimesterExams}
                </p>
                <p>
                  <strong>Vacuna DTPa y/o Rhogam:</strong> {result.screening.dtpaVaccine}
                </p>
                <p>
                  <strong>Exámenes III Trim.:</strong> {result.screening.thirdTrimesterExams}
                </p>
                <p>
                  <strong>Screening III Trim:</strong> {result.screening.thirdTrimesterScreening}
                </p>
                <p>
                  <strong>Cultivo SGB:</strong> {result.screening.gbsTest}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
