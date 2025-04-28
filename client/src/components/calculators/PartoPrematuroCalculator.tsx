import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, Ruler, Baby, Activity, History, Scissors } from "lucide-react";

// Componentes personalizados con animaciones
import { CalculatorContainer } from "@/components/ui/calculator-container";
import { AnimatedFormField, AnimatedCheckboxField } from "@/components/ui/animated-form-field";
import { AnimatedResult } from "@/components/ui/animated-result";

const schema = z.object({
  gestationalWeeks: z.number().min(22).max(34),
  gestationalDays: z.number().min(0).max(6),
  cervicalLength: z.number().min(0).max(50),
  fetusCount: z.number().min(1).max(3),
  hasContractions: z.boolean(),
  hasPreviousPretermBirth: z.boolean(),
  hasMembraneRupture: z.boolean(),
  hasCervicalSurgery: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function PartoPrematuroCalculator() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gestationalWeeks: 28,
      gestationalDays: 0,
      cervicalLength: 25,
      fetusCount: 1,
      hasContractions: false,
      hasPreviousPretermBirth: false,
      hasMembraneRupture: false,
      hasCervicalSurgery: false,
    },
  });

  function calculateRisk(data: FormData) {
    let riskScore = 0;

    // Base risk from cervical length
    if (data.cervicalLength < 15) riskScore += 3;
    else if (data.cervicalLength < 25) riskScore += 2;

    // Multiple gestation
    if (data.fetusCount > 1) riskScore += data.fetusCount;

    // Other risk factors
    if (data.hasContractions) riskScore += 2;
    if (data.hasPreviousPretermBirth) riskScore += 3;
    if (data.hasMembraneRupture) riskScore += 3;
    if (data.hasCervicalSurgery) riskScore += 1;

    // Risk categorization
    if (riskScore >= 8) return "Alto";
    if (riskScore >= 4) return "Moderado";
    return "Bajo";
  }

  function onSubmit(data: FormData) {
    const riskLevel = calculateRisk(data);
    setResult(riskLevel);
  }

  const [result, setResult] = useState<string | null>(null);

  // Contenido del formulario
  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatedFormField
            form={form}
            name="gestationalWeeks"
            label="Semanas de gestación"
            icon={CalendarDays}
            index={0}
            control={
              <Input 
                type="number" 
                onChange={e => form.setValue('gestationalWeeks', Number(e.target.value))} 
                className="border-blue-200 focus:border-blue-500"
              />
            }
          />
          
          <AnimatedFormField
            form={form}
            name="gestationalDays"
            label="Días adicionales"
            icon={CalendarDays}
            index={1}
            control={
              <Input 
                type="number" 
                onChange={e => form.setValue('gestationalDays', Number(e.target.value))} 
                className="border-blue-200 focus:border-blue-500"
              />
            }
          />
        </div>

        <AnimatedFormField
          form={form}
          name="cervicalLength"
          label="Longitud cervical (mm)"
          description="Medida ecográfica del cuello uterino"
          icon={Ruler}
          index={2}
          control={
            <Input 
              type="number" 
              onChange={e => form.setValue('cervicalLength', Number(e.target.value))} 
              className="border-blue-200 focus:border-blue-500"
            />
          }
        />

        <AnimatedFormField
          form={form}
          name="fetusCount"
          label="Número de fetos"
          icon={Baby}
          index={3}
          control={
            <Input 
              type="number" 
              onChange={e => form.setValue('fetusCount', Number(e.target.value))} 
              className="border-blue-200 focus:border-blue-500"
            />
          }
        />

        <div className="mt-6 border-t border-blue-100 pt-4">
          <h3 className="font-medium text-blue-800 mb-3">Factores de riesgo adicionales:</h3>
          <div className="space-y-2">
            <AnimatedCheckboxField
              form={form}
              name="hasContractions"
              label="Presencia de contracciones"
              index={0}
            />

            <AnimatedCheckboxField
              form={form}
              name="hasPreviousPretermBirth"
              label="Antecedente de parto prematuro previo"
              index={1}
            />

            <AnimatedCheckboxField
              form={form}
              name="hasMembraneRupture"
              label="Antecedente de rotura de membranas"
              index={2}
            />

            <AnimatedCheckboxField
              form={form}
              name="hasCervicalSurgery"
              label="Antecedente de cirugía cervical"
              index={3}
            />
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6"
        >
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 font-bold text-lg shadow-md"
          >
            Calcular Riesgo
          </Button>
        </motion.div>
      </form>
    </Form>
  );

  // Contenido del resultado
  const resultContent = result ? (
    <AnimatedResult
      id="calculation-result"
      fileName={`riesgo-prematuro-${format(new Date(), "yyyyMMdd")}`}
      speechText={`El nivel de riesgo de parto prematuro es ${result}. ${
        result === "Alto" 
          ? "Se recomienda considerar hospitalización para monitoreo continuo, evaluación de administración de corticoides y consulta con especialista en medicina materno-fetal." 
          : result === "Moderado" 
          ? "Se recomienda seguimiento frecuente cada 1 a 2 semanas, reposo relativo según criterio médico y considerar monitorización de actividad uterina." 
          : "Se recomienda seguimiento obstétrico habitual, control prenatal normal y educación sobre signos de alarma."
      }`}
      riskLevel={result}
    >
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="font-medium text-gray-700 mb-2">Recomendaciones clínicas:</h4>
          <ul className="list-disc pl-5 space-y-2">
            {result === "Alto" && (
              <>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-red-700"
                >
                  Considerar hospitalización para monitoreo continuo
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-red-700"
                >
                  Evaluación de administración de corticoides
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-red-700"
                >
                  Consulta con especialista en medicina materno-fetal
                </motion.li>
              </>
            )}
            {result === "Moderado" && (
              <>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-yellow-700"
                >
                  Seguimiento frecuente (cada 1-2 semanas)
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-yellow-700"
                >
                  Reposo relativo según criterio médico
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-yellow-700"
                >
                  Considerar monitorización de actividad uterina
                </motion.li>
              </>
            )}
            {result === "Bajo" && (
              <>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-green-700"
                >
                  Seguimiento obstétrico habitual
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-green-700"
                >
                  Control prenatal normal
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-green-700"
                >
                  Educación sobre signos de alarma
                </motion.li>
              </>
            )}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-gray-500 mt-4 pt-2 border-t border-gray-100"
        >
          <p>Fecha del cálculo: {format(new Date(), "dd/MM/yyyy")}</p>
        </motion.div>
      </div>
    </AnimatedResult>
  ) : null;

  // Contenido de información
  const infoContent = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-800">Acerca de esta calculadora</h3>
      
      <p>
        Esta herramienta evalúa el riesgo de parto prematuro basándose en factores clínicos relevantes. 
        No sustituye el juicio clínico profesional y debe utilizarse como complemento a la evaluación médica.
      </p>
      
      <h4 className="font-medium text-blue-700 mt-4">Factores de riesgo principales:</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-2">
          <Ruler className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h5 className="font-medium">Longitud cervical corta</h5>
            <p className="text-sm text-gray-600">Un cuello uterino menor a 25mm es predictivo de parto prematuro</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-2">
          <Baby className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h5 className="font-medium">Gestación múltiple</h5>
            <p className="text-sm text-gray-600">Los embarazos múltiples tienen mayor riesgo de prematuridad</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-2">
          <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h5 className="font-medium">Contracciones</h5>
            <p className="text-sm text-gray-600">Actividad uterina significativa antes de término</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-2">
          <History className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h5 className="font-medium">Antecedentes obstétricos</h5>
            <p className="text-sm text-gray-600">Historia previa de parto prematuro o ruptura de membranas</p>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100">
        <p>
          <strong>Referencias:</strong> Basado en guías clínicas de la Sociedad Española de Ginecología y Obstetricia (SEGO) 
          y del American College of Obstetricians and Gynecologists (ACOG).
        </p>
      </div>
    </div>
  );

  return (
    <CalculatorContainer
      title="Calculadora de Riesgo de Parto Prematuro"
      description="Evalúa el riesgo de prematuridad en base a factores clínicos"
      icon={CalendarDays}
      formContent={formContent}
      resultContent={resultContent}
      showResults={!!result}
      infoContent={infoContent}
    />
  );
}