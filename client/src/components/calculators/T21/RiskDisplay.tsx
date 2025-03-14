import { Card, CardContent } from "@/components/ui/card";

type RiskDisplayProps = {
  title: string;
  risk: number;
  description: string;
};

export default function RiskDisplay({ title, risk, description }: RiskDisplayProps) {
  const riskRatio = Math.round(1/risk);
  const interpretation = risk > (1/100) 
    ? "Alto Riesgo" 
    : risk > (1/1000) 
      ? "Riesgo Intermedio" 
      : "Bajo Riesgo";

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">{title}</h3>
        <div className="space-y-4">
          <p className="text-2xl font-bold text-center">
            1:{riskRatio}
          </p>
          <p className={`text-center font-semibold ${
            interpretation === "Alto Riesgo"
              ? "text-red-600"
              : interpretation === "Riesgo Intermedio"
                ? "text-amber-600"
                : "text-green-600"
          }`}>
            {interpretation}
          </p>
          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
