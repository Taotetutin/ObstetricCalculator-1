import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { calcularPercentil } from "./percentil-oms-app/utils/calculations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter } from 'recharts';

// Definir el tipo para los datos de la curva
type CurveDataPoint = {
  semana: number;
  p3: number;
  p50: number;
  p97: number;
  actual?: number | null;
};

// Definir interfaz para propiedades del shape
interface ShapeProps {
  cx?: number;
  cy?: number;
  [key: string]: any;
}

export default function CrecimientoFetalCalculator() {
  const [gestationalWeeks, setGestationalWeeks] = useState("");
  const [gestationalDays, setGestationalDays] = useState("");
  const [fetalWeight, setFetalWeight] = useState("");
  const [percentilResult, setPercentilResult] = useState("");
  const [curveData, setCurveData] = useState<CurveDataPoint[]>([]);
  const [singlePoint, setSinglePoint] = useState<{x: number, y: number} | null>(null);

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

    // Datos básicos de las curvas de percentiles
    const basicData: CurveDataPoint[] = [
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

    // Extraer el percentil numérico si existe
    let percentilNum = 50;
    if (typeof percentilOMS === 'string') {
      const match = percentilOMS.match(/percentil (\d+(\.\d+)?)/i);
      if (match && match[1]) {
        percentilNum = parseFloat(match[1]);
        console.log("Percentil detectado:", percentilNum);
      }
    }

    // Actualizar los datos de la curva
    setCurveData(basicData);
    
    // Calcular la semana exacta (sin redondear para mayor precisión)
    const exactWeek = weeks + days/7;
    
    // Encontrar los datos de referencia para esa semana
    // Buscar la semana exacta o la más cercana
    let weekIndex = basicData.findIndex(d => d.semana === Math.round(exactWeek));
    if (weekIndex === -1) {
      weekIndex = basicData.findIndex(d => d.semana >= Math.round(exactWeek));
    }
    
    if (weekIndex !== -1) {
      // Solo para mostrar en la gráfica
      setSinglePoint({ x: Math.round(exactWeek), y: weight });
      
      console.log(`Semana: ${Math.round(exactWeek)}, Peso: ${weight}, Percentil: ${percentilNum}`);
    } else {
      setSinglePoint(null);
    }
  };

  return (
    <div className="space-y-8">
      <Alert className="bg-blue-50 border-blue-200 text-blue-700">
        <AlertDescription className="font-medium">
          Evaluación integral del crecimiento fetal usando percentiles OMS y curva de crecimiento
        </AlertDescription>
      </Alert>

      <Card className="border-2 border-blue-100 shadow-sm overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-1 text-blue-700">Calculadora de Crecimiento Fetal</h3>
            <p className="text-sm text-gray-500">Ingrese la edad gestacional y el peso fetal para evaluar su desarrollo</p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Edad Gestacional (Semanas)
              </label>
              <Input
                type="number"
                min="14"
                max="40"
                value={gestationalWeeks}
                onChange={(e) => setGestationalWeeks(e.target.value)}
                placeholder="14-40"
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white"
              />
            </div>
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Edad Gestacional (Días)
              </label>
              <Input
                type="number"
                min="0"
                max="6"
                value={gestationalDays}
                onChange={(e) => setGestationalDays(e.target.value)}
                placeholder="0-6"
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white"
              />
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Peso Fetal (gramos)
            </label>
            <Input
              type="number"
              value={fetalWeight}
              onChange={(e) => setFetalWeight(e.target.value)}
              placeholder="Ingrese el peso fetal en gramos"
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white"
            />
          </div>

          <Button 
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Calcular
          </Button>
        </CardContent>
      </Card>

      {percentilResult && (
        <div className="space-y-6">
          <Card className="border-2 border-blue-100 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">Resultado del Análisis</h3>
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <p className="text-lg font-medium text-blue-700">{percentilResult}</p>
              </div>
            </CardContent>
          </Card>

          {curveData.length > 0 && (
            <Card className="border-2 border-blue-100 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-700">Curva de Crecimiento</h3>
                <p className="text-sm text-gray-500 mb-4">
                  El gráfico muestra las curvas de percentiles 3, 50 y 97, con el peso actual marcado en azul.
                </p>
                <div className="w-full h-[400px] bg-white p-2 rounded-lg border border-blue-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="semana" 
                        type="number"
                        domain={[14, 40]}
                        label={{
                          value: 'Semanas de Gestación',
                          position: 'insideBottom',
                          offset: -5
                        }}
                        allowDataOverflow
                      />
                      <YAxis 
                        type="number"
                        domain={[0, 4500]}
                        label={{
                          value: 'Peso (g)',
                          angle: -90,
                          position: 'insideLeft'
                        }}
                        allowDataOverflow
                      />
                      <Tooltip />
                      <Legend />
                      
                      {/* Líneas de percentiles */}
                      <Line
                        name="Percentil 3"
                        data={curveData}
                        dataKey="p3"
                        stroke="#ffa726"
                        strokeWidth={2}
                        dot={false}
                        type="monotone"
                        isAnimationActive={false}
                      />
                      <Line
                        name="Percentil 50"
                        data={curveData}
                        dataKey="p50"
                        stroke="#66bb6a"
                        strokeWidth={2}
                        dot={false}
                        type="monotone"
                        isAnimationActive={false}
                      />
                      <Line
                        name="Percentil 97"
                        data={curveData}
                        dataKey="p97"
                        stroke="#ef5350"
                        strokeWidth={2}
                        dot={false}
                        type="monotone"
                        isAnimationActive={false}
                      />
                      
                      {/* Punto de peso fetal */}
                      {singlePoint && (
                        <Scatter
                          name="Peso Fetal"
                          data={[singlePoint]}
                          fill="#2196f3"
                          shape={(props: ShapeProps) => {
                            const { cx, cy } = props;
                            return (
                              <circle 
                                cx={cx} 
                                cy={cy} 
                                r={8} 
                                stroke="#2196f3" 
                                strokeWidth={2} 
                                fill="#2196f3" 
                              />
                            );
                          }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}