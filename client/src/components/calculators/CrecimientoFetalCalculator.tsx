import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { calcularPercentil } from "./percentil-oms-app/utils/calculations";
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, Label } from 'recharts';

export default function CrecimientoFetalCalculator() {
  const [gestationalWeeks, setGestationalWeeks] = useState("");
  const [gestationalDays, setGestationalDays] = useState("");
  const [fetalWeight, setFetalWeight] = useState("");
  const [percentilResult, setPercentilResult] = useState("");
  const [chartData, setChartData] = useState<any[]>([]);
  const [pointData, setPointData] = useState<any[]>([]);

  // Datos base de las curvas de crecimiento
  const baseData = [
    { week: 14, p3: 70, p50: 100, p97: 130 },
    { week: 16, p3: 105, p50: 150, p97: 195 },
    { week: 18, p3: 170, p50: 250, p97: 325 },
    { week: 20, p3: 250, p50: 350, p97: 450 },
    { week: 22, p3: 350, p50: 500, p97: 650 },
    { week: 24, p3: 470, p50: 650, p97: 850 },
    { week: 26, p3: 600, p50: 850, p97: 1100 },
    { week: 28, p3: 750, p50: 1050, p97: 1350 },
    { week: 30, p3: 900, p50: 1250, p97: 1600 },
    { week: 32, p3: 1100, p50: 1500, p97: 1900 },
    { week: 34, p3: 1350, p50: 1900, p97: 2450 },
    { week: 36, p3: 1650, p50: 2350, p97: 3050 },
    { week: 38, p3: 1950, p50: 2700, p97: 3450 },
    { week: 40, p3: 2200, p50: 3100, p97: 4000 },
  ];

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

    // Extraer percentil numérico
    let percentilNum = 50;
    if (typeof percentilOMS === 'string') {
      const match = percentilOMS.match(/percentil (\d+(\.\d+)?)/i);
      if (match && match[1]) {
        percentilNum = parseFloat(match[1]);
        console.log("Percentil detectado:", percentilNum);
      }
    }

    // Configurar los datos para el gráfico
    setChartData(baseData);

    // Calcular la semana exacta
    const exactWeek = Math.round(weeks + days/7);
    
    // Crear un punto para representar el peso actual
    const point = { week: exactWeek, weight: weight };
    setPointData([point]);
    
    console.log(`Peso representado en gráfico: Semana ${exactWeek}, Peso ${weight}g, Percentil ${percentilNum}`);
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

          {chartData.length > 0 && (
            <Card className="border-2 border-blue-100 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-700">Curva de Crecimiento</h3>
                <p className="text-sm text-gray-500 mb-4">
                  La gráfica muestra las curvas de percentiles 3, 50 y 97, con el peso fetal actual marcado como un punto azul.
                </p>
                <div className="w-full h-[400px] bg-white p-2 rounded-lg border border-blue-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="week" 
                        type="number"
                        domain={[12, 42]}
                        allowDecimals={false}
                      >
                        <Label value="Semanas de Gestación" offset={-10} position="insideBottom" />
                      </XAxis>
                      <YAxis 
                        yAxisId="left"
                        orientation="left"
                        type="number"
                        domain={[0, 4500]}
                      >
                        <Label value="Peso Fetal (g)" angle={-90} position="insideLeft" />
                      </YAxis>
                      <Tooltip 
                        formatter={(value: any, name: string) => {
                          if (name === "Peso Fetal") return [`${value}g`, name];
                          return [`${value}g`, name];
                        }}
                        labelFormatter={(label) => `Semana ${label}`}
                      />
                      <Legend />
                      
                      {/* Líneas percentiles */}
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="p3"
                        data={chartData}
                        name="Percentil 3"
                        stroke="#ffa726"
                        dot={false}
                        strokeWidth={2}
                        isAnimationActive={false}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="p50"
                        data={chartData}
                        name="Percentil 50"
                        stroke="#66bb6a"
                        dot={false}
                        strokeWidth={2}
                        isAnimationActive={false}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="p97"
                        data={chartData}
                        name="Percentil 97"
                        stroke="#ef5350"
                        dot={false}
                        strokeWidth={2}
                        isAnimationActive={false}
                      />
                      
                      {/* Punto para el peso actual */}
                      {pointData.length > 0 && (
                        <Scatter
                          yAxisId="left"
                          name="Peso Fetal"
                          data={pointData}
                          fill="#2196f3"
                          line={false}
                          shape={(props: any) => {
                            const { cx, cy } = props;
                            return (
                              <circle 
                                cx={cx} 
                                cy={cy} 
                                r={10} 
                                stroke="#1565C0" 
                                strokeWidth={2} 
                                fill="#2196f3" 
                              />
                            );
                          }}
                          dataKey={(entry) => entry.weight}
                          isAnimationActive={false}
                        />
                      )}
                    </ComposedChart>
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