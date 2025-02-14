import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { calculatorTypes } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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
  riskLevel: 'bajo' | 'moderado' | 'alto';
  totalPoints: number;
  recommendations: string[];
}

export default function ThrombosisCalculator() {
  const [result, setResult] = useState<Result | null>(null);
  const { toast } = useToast();
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const calculateRisk = (factors: string[]): Result => {
    const totalPoints = factors.reduce((sum, factorId) => {
      const factor = riskFactors.find(f => f.id === factorId);
      return sum + (factor?.points || 0);
    }, 0);

    let riskLevel: 'bajo' | 'moderado' | 'alto';
    let recommendations: string[] = [];

    if (totalPoints >= 4) {
      riskLevel = 'alto';
      recommendations = [
        "Profilaxis con HBPM durante todo el embarazo",
        "Continuar profilaxis por 6 semanas postparto",
        "Considerar medias de compresión graduada",
        "Movilización temprana",
        "Hidratación adecuada",
        "Referir a especialista en trombosis"
      ];
    } else if (totalPoints >= 2) {
      riskLevel = 'moderado';
      recommendations = [
        "Considerar profilaxis con HBPM desde el inicio del embarazo",
        "Continuar profilaxis por al menos 10 días postparto",
        "Medias de compresión graduada",
        "Movilización temprana",
        "Hidratación adecuada",
        "Reevaluar si aparecen factores de riesgo adicionales"
      ];
    } else {
      riskLevel = 'bajo';
      recommendations = [
        "No requiere profilaxis farmacológica rutinaria",
        "Movilización temprana",
        "Evitar deshidratación",
        "Reevaluar si aparecen factores de riesgo adicionales"
      ];
    }

    return {
      riskLevel,
      totalPoints,
      recommendations
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
    const riskResult = calculateRisk(selectedFactors);
    setResult(riskResult);

    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "thrombosis",
          input: JSON.stringify(selectedFactors),
          result: JSON.stringify(riskResult),
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
          <Card key={category}>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">
                {category === 'preexisting' ? 'Factores de Riesgo Preexistentes' :
                 category === 'obstetric' ? 'Factores de Riesgo Obstétricos' :
                 'Factores de Riesgo Transitorios'}
              </h3>
              <div className="space-y-4">
                {riskFactors
                  .filter(factor => factor.category === category)
                  .map(factor => (
                    <div key={factor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={factor.id}
                        checked={selectedFactors.includes(factor.id)}
                        onCheckedChange={(checked) => handleFactorChange(factor.id, checked as boolean)}
                      />
                      <label
                        htmlFor={factor.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
          Calcular Riesgo
        </Button>

        {result && (
          <Card>
            <CardContent className="pt-6">
              <div className={`rounded-lg border p-6 ${
                result.riskLevel === 'alto' ? 'border-red-500 bg-red-50' :
                result.riskLevel === 'moderado' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">
                    Riesgo {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.riskLevel === 'alto' ? 'bg-red-200 text-red-800' :
                    result.riskLevel === 'moderado' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {result.totalPoints} puntos
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Recomendaciones:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-gray-700">{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
