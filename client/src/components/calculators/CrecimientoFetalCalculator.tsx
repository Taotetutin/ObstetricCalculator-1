import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { calcularPercentil } from "./percentil-oms-app/utils/calculations";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

// Interfaces para trabajar con el gráfico
interface DotProps {
  cx?: number;
  cy?: number;
  [key: string]: any;
}

export default function CrecimientoFetalCalculator() {
  const [gestationalWeeks, setGestationalWeeks] = useState("");
  const [gestationalDays, setGestationalDays] = useState("");
  const [fetalWeight, setFetalWeight] = useState("");
  const [percentilResult, setPercentilResult] = useState("");
  const [curveData, setCurveData] = useState<any[]>([]);
  const [pointData, setPointData] = useState<any[]>([]);
  
  // Referencia para el contenedor de resultados (para PDF)
  const resultsRef = useRef<HTMLDivElement>(null);

  // Función para generar PDF
  const generatePDF = useCallback(async () => {
    if (!resultsRef.current || !percentilResult) return;
    
    try {
      const canvas = await html2canvas(resultsRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Título del PDF
      pdf.setFontSize(18);
      pdf.setTextColor(0, 60, 143);
      pdf.text('Reporte de Crecimiento Fetal OMS', pdfWidth / 2, 20, { align: 'center' });
      
      // Añadir fecha
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const date = new Date().toLocaleDateString('es-ES');
      pdf.text(`Fecha: ${date}`, pdfWidth - 20, 30, { align: 'right' });
      
      // Ajustar imagen para que ocupe el ancho de la página pero mantenga proporción
      const imgWidth = pdfWidth - 40; // Margen de 20mm en cada lado
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight);
      
      // Añadir texto informativo
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Este reporte muestra la evaluación del crecimiento fetal según estándares OMS.', 20, imgHeight + 50);
      
      pdf.save('reporte-crecimiento-fetal.pdf');
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  }, [percentilResult]);

  // Función para leer resultado en voz alta
  const speakResult = useCallback(() => {
    if (!percentilResult) return;
    
    const speech = new SpeechSynthesisUtterance();
    speech.text = percentilResult;
    speech.lang = 'es-ES';
    speech.volume = 1;
    speech.rate = 0.9;
    speech.pitch = 1;
    
    window.speechSynthesis.speak(speech);
  }, [percentilResult]);

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
        <div className="space-y-6" ref={resultsRef}>
          <Card className="border-2 border-blue-100 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">Resultado del Análisis</h3>
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <p className="text-lg font-medium text-blue-700">{percentilResult}</p>
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button 
                  onClick={speakResult}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                  Leer en voz alta
                </Button>
                
                <Button 
                  onClick={generatePDF}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Generar PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {curveData.length > 0 && (
            <Card className="border-2 border-blue-100 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-700">Curva de Crecimiento OMS</h3>
                <p className="text-sm text-gray-500 mb-4">
                  La gráfica muestra las curvas de percentiles 3, 50 y 97 según estándares OMS. El punto azul indica el peso fetal actual.
                </p>
                
                {/* Gráfico de Líneas */}
                <div className="w-full h-[400px] bg-white p-2 rounded-lg border border-blue-100">
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
                                r={6}
                                stroke="#1565c0"
                                strokeWidth={1.5}
                                fill="#2196f3"
                              />
                            );
                          }}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}