import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Calendar, BarChart2, Weight, AlertCircle, Info } from "lucide-react";
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
  ZAxis
} from 'recharts';

// Componentes personalizados con animaciones
import { CalculatorContainer } from "@/components/ui/calculator-container";
import { AnimatedFormField } from "@/components/ui/animated-form-field";
import { AnimatedResult } from "@/components/ui/animated-result";
import { calcularPercentil } from "./percentil-oms-app/utils/calculations";

// Interfaces para trabajar con el gráfico
interface DotProps {
  cx?: number;
  cy?: number;
  [key: string]: any;
}

export default function CrecimientoFetalCalculator() {
  const [gestationalWeeks, setGestationalWeeks] = useState<string>("28");
  const [gestationalDays, setGestationalDays] = useState<string>("0");
  const [fetalWeight, setFetalWeight] = useState<string>("1500");
  const [percentilResult, setPercentilResult] = useState("");
  const [curveData, setCurveData] = useState<any[]>([]);
  const [pointData, setPointData] = useState<any[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleCalculate = () => {
    const weeks = parseInt(gestationalWeeks);
    const days = parseInt(gestationalDays);
    const weight = parseInt(fetalWeight);

    if (isNaN(weeks) || isNaN(days) || isNaN(weight) || 
        weeks < 14 || weeks > 40 || days < 0 || days > 6) {
      setPercentilResult("Por favor, ingrese valores válidos.");
      return;
    }

    // Calcular percentil OMS
    const percentilOMS = calcularPercentil(weeks, days, weight);
    setPercentilResult(percentilOMS);

    // Datos para las curvas
    const data = [
      { semana: 14, p3: 70, p50: 100, p97: 130 },
      { semana: 16, p3: 105, p50: 150, p97: 195 },
      { semana: 18, p3: 170, p50: 250, p97: 325 },
      { semana: 20, p3: 250, p50: 350, p97: 450 },
      { semana: 22, p3: 350, p50: 500, p97: 650 },
      { semana: 24, p3: 470, p50: 650, p97: 850 },
      { semana: 26, p3: 600, p50: 850, p97: 1100 },
      { semana: 28, p3: 750, p50: 1050, p97: 1350 },
      { semana: 30, p3: 900, p50: 1250, p97: 1600 },
      { semana: 32, p3: 1100, p50: 1500, p97: 1900 },
      { semana: 34, p3: 1350, p50: 1900, p97: 2450 },
      { semana: 36, p3: 1650, p50: 2350, p97: 3050 },
      { semana: 38, p3: 1950, p50: 2700, p97: 3450 },
      { semana: 40, p3: 2200, p50: 3100, p97: 4000 },
    ];

    setCurveData(data);

    // Datos para el punto
    const exactWeek = Math.floor(weeks) + days/7;
    const roundedWeek = Math.round(exactWeek);
    
    // Crear datos para el punto de peso
    // Usamos un arreglo simple con un solo objeto
    setPointData([{ x: roundedWeek, y: weight }]);
    
    setIsCalculated(true);
  };

  // Interpretación del resultado para el asistente de voz
  const getSpeechText = () => {
    if (!percentilResult) return "";
    
    // Extraer información relevante del texto de resultado
    const match = percentilResult.match(/percentil (\d+)/i);
    const percentile = match ? match[1] : "desconocido";
    
    let interpretation = "";
    const percentileNum = parseInt(percentile);
    
    if (percentileNum < 3) {
      interpretation = "Se encuentra por debajo del percentil 3, lo que indica un crecimiento fetal muy por debajo de lo esperado para su edad gestacional. Se recomienda una evaluación especializada.";
    } else if (percentileNum < 10) {
      interpretation = "Se encuentra entre el percentil 3 y 10, lo que indica un crecimiento fetal bajo para su edad gestacional. Se recomienda seguimiento.";
    } else if (percentileNum > 90) {
      interpretation = "Se encuentra por encima del percentil 90, lo que indica un crecimiento fetal superior a lo esperado para su edad gestacional. Se recomienda descartar diabetes gestacional.";
    } else {
      interpretation = "Se encuentra dentro de los rangos normales para su edad gestacional.";
    }
    
    return `${percentilResult} ${interpretation}`;
  };

  // Contenido del formulario
  const formContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatedFormField
          form={{ control: () => null }} // Mock para reutilizar el componente
          name="gestationalWeeks"
          label="Semanas de gestación"
          description="Entre 14 y 40 semanas"
          icon={Calendar}
          index={0}
          control={
            <Input 
              type="number"
              value={gestationalWeeks}
              onChange={(e) => setGestationalWeeks(e.target.value)}
              min="14"
              max="40"
              placeholder="Semanas (14-40)"
              className="border-blue-200 focus:border-blue-500"
            />
          }
        />
        
        <AnimatedFormField
          form={{ control: () => null }}
          name="gestationalDays"
          label="Días adicionales"
          description="Entre 0 y 6 días"
          icon={Calendar}
          index={1}
          control={
            <Input
              type="number"
              value={gestationalDays}
              onChange={(e) => setGestationalDays(e.target.value)}
              min="0"
              max="6"
              placeholder="Días (0-6)"
              className="border-blue-200 focus:border-blue-500"
            />
          }
        />
      </div>
      
      <AnimatedFormField
        form={{ control: () => null }}
        name="fetalWeight"
        label="Peso fetal estimado (gramos)"
        description="Peso en gramos según ecografía"
        icon={Weight}
        index={2}
        control={
          <Input
            type="number"
            value={fetalWeight}
            onChange={(e) => setFetalWeight(e.target.value)}
            min="100"
            placeholder="Peso en gramos"
            className="border-blue-200 focus:border-blue-500"
          />
        }
      />
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6"
      >
        <Button 
          onClick={handleCalculate} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 font-bold text-lg shadow-md"
        >
          Calcular Percentil
        </Button>
      </motion.div>
    </div>
  );

  // Contenido del resultado
  const resultContent = isCalculated ? (
    <AnimatedResult
      id="growth-chart-container"
      fileName={`crecimiento-fetal-${format(new Date(), "yyyyMMdd")}`}
      speechText={getSpeechText()}
      riskLevel=""
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 p-4 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Resultado del cálculo:</h3>
          <p className="text-lg">{percentilResult}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-2 text-center text-blue-700">Curva de Crecimiento Fetal</h3>
          
          <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow-sm border border-blue-100">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={curveData}
                margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="semana" 
                  type="number"
                  domain={[14, 40]}
                  label={{ value: 'Semanas', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="number"
                  domain={[0, 4200]}
                  label={{ value: 'Peso (g)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value) => `${value}g`} />
                <Legend verticalAlign="top" height={36} />
                
                <Line
                  type="monotone"
                  dataKey="p3"
                  name="Percentil 3"
                  stroke="#ffa726"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="0"
                  activeDot={false}
                />
                <Line
                  type="monotone"
                  dataKey="p50"
                  name="Percentil 50"
                  stroke="#66bb6a"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="0"
                  activeDot={false}
                />
                <Line
                  type="monotone"
                  dataKey="p97"
                  name="Percentil 97"
                  stroke="#ef5350"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="0"
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Gráfico de Puntos - Este se superpondrá visualmente sobre el primero */}
          {pointData.length > 0 && (
            <div className="w-full h-[400px] -mt-[400px] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
                >
                  <CartesianGrid opacity={0} /> {/* Grid transparente para que no interfiera */}
                  <XAxis 
                    type="number"
                    dataKey="x"
                    domain={[14, 40]}
                    hide={true} // Ocultar eje para que no se duplique
                  />
                  <YAxis 
                    type="number"
                    dataKey="y"
                    domain={[0, 4200]}
                    hide={true} // Ocultar eje para que no se duplique
                  />
                  <ZAxis range={[100]} />
                  <Tooltip 
                    cursor={{strokeDasharray: '3 3'}}
                    formatter={(value, name) => [`${value}g`, 'Peso Fetal']}
                    labelFormatter={(label) => `Semana ${label}`}
                  />
                  <Scatter 
                    name="Peso Fetal" 
                    data={pointData} 
                    fill="#2196f3"
                    shape={(props: DotProps) => {
                      const { cx, cy } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={8}
                          stroke="#1565c0"
                          strokeWidth={2}
                          fill="#2196f3"
                        />
                      );
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-500 mt-3 flex items-start space-x-2"
          >
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p>Este gráfico muestra la posición del peso fetal actual dentro de la curva de percentiles. Los rangos normales se encuentran generalmente entre el percentil 10 y 90.</p>
          </motion.div>
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
        Esta herramienta calcula el percentil de crecimiento fetal según las curvas de la Organización Mundial de la Salud (OMS).
        Es útil para evaluar si el crecimiento del feto está dentro de los rangos esperados para su edad gestacional.
      </p>
      
      <h4 className="font-medium text-blue-700 mt-4">Interpretación de los percentiles:</h4>
      
      <div className="grid grid-cols-1 gap-3 mt-2">
        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
          <h5 className="font-medium text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Percentil &lt; 3
          </h5>
          <p className="text-sm text-gray-700">Crecimiento muy por debajo de lo esperado, requiere evaluación especializada para descartar restricción severa del crecimiento intrauterino.</p>
        </div>
        
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
          <h5 className="font-medium text-orange-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Percentil 3-10
          </h5>
          <p className="text-sm text-gray-700">Crecimiento por debajo de lo esperado, requiere seguimiento cercano para evaluar la progresión del crecimiento.</p>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
          <h5 className="font-medium text-green-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Percentil 10-90
          </h5>
          <p className="text-sm text-gray-700">Crecimiento normal. Dentro del rango esperado para la edad gestacional.</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <h5 className="font-medium text-blue-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Percentil &gt; 90
          </h5>
          <p className="text-sm text-gray-700">Crecimiento por encima de lo esperado, considerar evaluación para descartar diabetes gestacional o macrosomía fetal.</p>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100">
        <p>
          <strong>Referencias:</strong> Tablas de crecimiento fetal de la OMS (Organización Mundial de la Salud) y FIGO (Federación Internacional de Ginecología y Obstetricia).
        </p>
      </div>
    </div>
  );

  return (
    <CalculatorContainer
      title="Calculadora de Percentil de Crecimiento Fetal"
      description="Evalúa si el crecimiento del feto está dentro de los rangos esperados"
      icon={BarChart2}
      formContent={formContent}
      resultContent={resultContent}
      showResults={isCalculated}
      infoContent={infoContent}
    />
  );
}