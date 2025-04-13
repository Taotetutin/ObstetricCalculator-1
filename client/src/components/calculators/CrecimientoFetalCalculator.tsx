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
  const [curveData, setCurveData] = useState<any[]>([]);

  const calculateCurveData = (weeks: number, days: number, weight: number) => {
    const data = [];
    const currentWeek = weeks + days/7;

    // Generar datos para la curva de crecimiento
    for (let w = Math.max(14, Math.floor(currentWeek - 4)); w <= Math.min(40, Math.ceil(currentWeek + 4)); w++) {
      const percentil3 = calcularPercentil(w, 0, Math.round(weight * 0.7));
      const percentil50 = calcularPercentil(w, 0, weight);
      const percentil97 = calcularPercentil(w, 0, Math.round(weight * 1.3));

      data.push({
        semana: w,
        p3: typeof percentil3 === 'string' ? null : percentil3,
        p50: typeof percentil50 === 'string' ? null : percentil50,
        p97: typeof percentil97 === 'string' ? null : percentil97,
        actual: w === weeks && days === 0 ? weight : null
      });
    }
    return data;
  };

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

    // Generar datos para la curva de crecimiento
    const curveData = calculateCurveData(weeks, days, weight);
    setCurveData(curveData);
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
                      margin={{ top: 15, right: 30, left: 20, bottom: 15 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="semana" 
                        label={{ 
                          value: 'Semanas de Gestación', 
                          position: 'insideBottom', 
                          offset: -5,
                          style: { fill: '#4b5563' }
                        }} 
                        tick={{ fill: '#4b5563' }}
                      />
                      <YAxis 
                        label={{ 
                          value: 'Peso (g)', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { fill: '#4b5563' }
                        }} 
                        tick={{ fill: '#4b5563' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #dbeafe',
                          borderRadius: '6px' 
                        }} 
                      />
                      <Legend 
                        wrapperStyle={{ 
                          paddingTop: '10px' 
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="p3" 
                        stroke="#ffa726" 
                        name="Percentil 3" 
                        dot={false}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="p50" 
                        stroke="#66bb6a" 
                        name="Percentil 50" 
                        dot={false}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="p97" 
                        stroke="#ef5350" 
                        name="Percentil 97" 
                        dot={false}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#2196f3" 
                        name="Peso Actual" 
                        dot={{ r: 6, strokeWidth: 2, fill: 'white' }}
                        strokeWidth={2}
                      />
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