import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { calculatorTypes } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import SpeechButton from "@/components/ui/SpeechButton";
import GeneratePDFButton from "@/components/ui/GeneratePDFButton";

interface RiskFactor {
  id: string;
  label: string;
  points: number;
  category: 'preexisting' | 'obstetric' | 'transient';
}

const riskFactors: RiskFactor[] = [
  // Preexisting risk factors
  { id: "previous_vte", label: "TEV previo", points: 4, category: 'preexisting' },
  { id: "known_thrombophilia", label: "Trombofilia conocida", points: 3, category: 'preexisting' },
  { id: "family_history", label: "Historia familiar de TEV", points: 1, category: 'preexisting' },
  { id: "comorbidities", label: "Comorbilidades (enfermedad cardíaca/pulmonar, LES, cáncer, enfermedad inflamatoria)", points: 2, category: 'preexisting' },
  { id: "age_over_35", label: "Edad > 35 años", points: 1, category: 'preexisting' },
  { id: "obesity_bmi_30", label: "Obesidad (IMC > 30)", points: 1, category: 'preexisting' },
  { id: "obesity_bmi_40", label: "Obesidad mórbida (IMC > 40)", points: 2, category: 'preexisting' },
  { id: "parity_3", label: "Paridad ≥ 3", points: 1, category: 'preexisting' },
  { id: "smoker", label: "Tabaquismo", points: 1, category: 'preexisting' },
  { id: "varicose_veins", label: "Venas varicosas grandes", points: 1, category: 'preexisting' },

  // Obstetric risk factors
  { id: "preeclampsia", label: "Preeclampsia actual", points: 1, category: 'obstetric' },
  { id: "ivf_art", label: "FIV/TRA", points: 1, category: 'obstetric' },
  { id: "multiple_pregnancy", label: "Embarazo múltiple", points: 1, category: 'obstetric' },
  { id: "cesarean_labor", label: "Cesárea en trabajo de parto", points: 2, category: 'obstetric' },
  { id: "cesarean_elective", label: "Cesárea electiva", points: 1, category: 'obstetric' },
  { id: "mid_cavity_forceps", label: "Fórceps medio/rotacional", points: 1, category: 'obstetric' },
  { id: "prolonged_labor", label: "Trabajo de parto prolongado (>24 horas)", points: 1, category: 'obstetric' },
  { id: "pph", label: "Hemorragia postparto (>1L o transfusión)", points: 1, category: 'obstetric' },
  { id: "preterm_birth", label: "Parto pretérmino en embarazo actual", points: 1, category: 'obstetric' },
  { id: "stillbirth", label: "Muerte fetal en embarazo actual", points: 1, category: 'obstetric' },

  // Transient risk factors
  { id: "surgical_procedure", label: "Procedimiento quirúrgico durante embarazo o puerperio", points: 2, category: 'transient' },
  { id: "hyperemesis", label: "Hiperemesis", points: 1, category: 'transient' },
  { id: "ohss", label: "Síndrome de hiperestimulación ovárica", points: 1, category: 'transient' },
  { id: "current_infection", label: "Infección sistémica actual", points: 1, category: 'transient' },
  { id: "immobility", label: "Inmovilidad (>3 días)", points: 1, category: 'transient' },
  { id: "dehydration", label: "Deshidratación/hiperémesis", points: 1, category: 'transient' }
];

interface Result {
  totalPoints: number;
  prophylaxisGuideline: string;
}

export default function ThrombosisCalculator() {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const calculateProphylaxis = (factors: string[]): Result => {
    const totalPoints = factors.reduce((sum, factorId) => {
      const factor = riskFactors.find(f => f.id === factorId);
      return sum + (factor?.points || 0);
    }, 0);

    let prophylaxisGuideline: string;

    if (totalPoints >= 4) {
      prophylaxisGuideline = "HBPM desde 1º trimestre y 6 semanas postparto";
    } else if (totalPoints === 3) {
      prophylaxisGuideline = "HBPM desde semana 28 y 6 semanas postparto";
    } else if (totalPoints === 2) {
      prophylaxisGuideline = "HBPM durante 10 días postparto";
    } else {
      prophylaxisGuideline = "No precisa tromboprofilaxis";
    }

    return {
      totalPoints,
      prophylaxisGuideline
    };
  };

  const handleFactorChange = (factorId: string, checked: boolean) => {
    setSelectedFactors(prev => {
      if (checked) {
        return [...prev, factorId];
      } else {
        return prev.filter(id => id !== factorId);
      }
    });
  };

  const handleCalculate = async () => {
    const prophylaxisResult = calculateProphylaxis(selectedFactors);
    setResult(prophylaxisResult);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "thrombosis",
          input: JSON.stringify(selectedFactors),
          result: JSON.stringify(prophylaxisResult),
        }),
      });
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {['preexisting', 'obstetric', 'transient'].map((category) => (
          <Card key={category} className="border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-sky-500/10">
              <CardTitle className="text-lg font-semibold text-blue-700">
                {category === 'preexisting' ? 'Factores de Riesgo Preexistentes' :
                  category === 'obstetric' ? 'Factores de Riesgo Obstétricos' :
                    'Factores de Riesgo Transitorios'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors
                  .filter(factor => factor.category === category)
                  .map(factor => (
                    <div key={factor.id} className="flex items-center gap-2">
                      <Checkbox
                        id={factor.id}
                        checked={selectedFactors.includes(factor.id)}
                        onCheckedChange={(checked) => handleFactorChange(factor.id, checked as boolean)}
                        className="h-4 w-4 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white flex items-center justify-center"
                      >
                        {selectedFactors.includes(factor.id) && (
                          <span className="text-white text-xs font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            ✕
                          </span>
                        )}
                      </Checkbox>
                      <label
                        htmlFor={factor.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                      >
                        {factor.label} ({factor.points} {factor.points === 1 ? 'punto' : 'puntos'})
                      </label>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={handleCalculate}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Calcular Pauta
        </Button>

        {result && (
          <Card className="border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-sky-500/10">
              <CardTitle className="text-lg font-semibold text-blue-700">
                Pauta de Tromboprofilaxis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div id="thrombosis-pdf-content" className={`rounded-lg border p-6 ${
                result.totalPoints >= 4 ? 'border-red-500 bg-red-50' :
                  result.totalPoints === 3 ? 'border-orange-500 bg-orange-50' :
                    result.totalPoints === 2 ? 'border-yellow-500 bg-yellow-50' :
                      'border-green-500 bg-green-50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.totalPoints >= 4 ? 'bg-red-200 text-red-800' :
                      result.totalPoints === 3 ? 'bg-orange-200 text-orange-800' :
                        result.totalPoints === 2 ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                  }`}>
                    {result.totalPoints} puntos
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-lg font-medium">{result.prophylaxisGuideline}</p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-2">Factores de riesgo seleccionados:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {selectedFactors.map(factorId => {
                      const factor = riskFactors.find(f => f.id === factorId);
                      return (
                        <li key={factorId}>
                          {factor?.label} ({factor?.points} {factor?.points === 1 ? 'punto' : 'puntos'})
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 space-y-4 print:hidden">
                <p className="text-sm text-gray-500 mb-2">Fecha: {format(new Date(), "dd/MM/yyyy")}</p>
                
                <SpeechButton
                  text={`Resultado del cálculo de riesgo tromboembólico: 
                  Puntuación total: ${result.totalPoints} puntos. 
                  Recomendación: ${result.prophylaxisGuideline}.`}
                />
                
                <GeneratePDFButton
                  contentId="thrombosis-pdf-content"
                  fileName="Riesgo_Tromboembolico"
                  label="📄 GENERAR INFORME PDF"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}