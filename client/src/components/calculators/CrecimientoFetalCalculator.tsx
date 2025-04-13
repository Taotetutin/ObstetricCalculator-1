import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { calcularPercentil } from "./percentil-oms-app/utils/calculations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CrecimientoFetalCalculator() {
  const [gestationalWeeks, setGestationalWeeks] = useState("");
  const [gestationalDays, setGestationalDays] = useState("");
  const [fetalWeight, setFetalWeight] = useState("");
  const [percentilResult, setPercentilResult] = useState("");
  const [curveData, setCurveData] = useState<Array<{
    semana: number;
    p3: number;
    p50: number;
    p97: number;
    actual: number | null;
    p19: number | null;
    miPeso: number | null;
  }>>([]);

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

    // Crear datos de gráfica pre-calculados
    const data = [
      { semana: 14, p3: 70, p50: 100, p97: 130, actual: null, p19: null, miPeso: null },
      { semana: 16, p3: 105, p50: 150, p97: 195, actual: null, p19: null, miPeso: null },
      { semana: 18, p3: 170, p50: 250, p97: 325, actual: null, p19: null, miPeso: null },
      { semana: 20, p3: 250, p50: 350, p97: 450, actual: null, p19: null, miPeso: null },
      { semana: 22, p3: 350, p50: 500, p97: 650, actual: null, p19: null, miPeso: null },
      { semana: 24, p3: 470, p50: 650, p97: 850, actual: null, p19: null, miPeso: null },
      { semana: 26, p3: 600, p50: 850, p97: 1100, actual: null, p19: null, miPeso: null },
      { semana: 28, p3: 750, p50: 1050, p97: 1350, actual: null, p19: null, miPeso: null },
      { semana: 30, p3: 900, p50: 1250, p97: 1600, actual: null, p19: null, miPeso: null },
      { semana: 32, p3: 1100, p50: 1500, p97: 1900, actual: null, p19: null, miPeso: null },
      { semana: 34, p3: 1350, p50: 1900, p97: 2450, actual: null, p19: null, miPeso: null },
      { semana: 36, p3: 1650, p50: 2350, p97: 3050, actual: null, p19: null, miPeso: null },
      { semana: 38, p3: 1950, p50: 2700, p97: 3450, actual: null, p19: null, miPeso: null },
      { semana: 40, p3: 2200, p50: 3100, p97: 4000, actual: null, p19: null, miPeso: null },
    ];

    // Extraer valor numérico del percentil (si es posible)
    let percentilNum = 50;
    if (typeof percentilOMS === 'string') {
      const match = percentilOMS.match(/percentil (\d+(\.\d+)?)/i);
      if (match && match[1]) {
        percentilNum = parseFloat(match[1]);
      }
    }

    console.log("Percentil detectado:", percentilNum); // Para depuración

    // Encontrar la semana más cercana
    const weekIndex = data.findIndex(d => d.semana === Math.round(weeks + days/7));
    if (weekIndex !== -1) {
      // Crear una línea para el percentil específico del paciente
      const newData = data.map(item => {
        // Calcular el valor del percentil específico para cada semana
        let percentilValue;
        if (percentilNum <= 3) {
          percentilValue = item.p3;
        } else if (percentilNum < 50) {
          const ratio = (percentilNum - 3) / (50 - 3);
          percentilValue = item.p3 + ratio * (item.p50 - item.p3);
        } else if (percentilNum === 50) {
          percentilValue = item.p50;
        } else if (percentilNum < 97) {
          const ratio = (percentilNum - 50) / (97 - 50);
          percentilValue = item.p50 + ratio * (item.p97 - item.p50);
        } else {
          percentilValue = item.p97;
        }

        // Para la semana actual, agregar el peso real
        if (item.semana === data[weekIndex].semana) {
          return {
            ...item,
            p19: Math.round(percentilValue), // Línea de percentil específico
            miPeso: weight                   // Peso real del paciente
          };
        }
        return {
          ...item,
          p19: Math.round(percentilValue)    // Solo línea de percentil para otras semanas
        };
      });

      setCurveData(newData);
    } else {
      setCurveData(data);
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
                <div className="w-full h-[400px] bg-white p-2 rounded-lg border border-blue-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={curveData}
                      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    >
                      <XAxis dataKey="semana" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="p3" stroke="#ffa726" name="P3" strokeWidth={2} />
                      <Line type="monotone" dataKey="p50" stroke="#66bb6a" name="P50" strokeWidth={2} />
                      <Line type="monotone" dataKey="p97" stroke="#ef5350" name="P97" strokeWidth={2} />
                      <Line type="monotone" dataKey="p19" stroke="#9c27b0" name="Percentil Específico" strokeDasharray="5 5" strokeWidth={2} />
                      <Line type="monotone" dataKey="miPeso" stroke="#2196f3" name="Peso Real" dot={{ r: 6 }} strokeWidth={2} />
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