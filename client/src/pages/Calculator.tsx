import { useParams } from "wouter";
import { calculators } from "@/components/calculators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Calculator() {
  const { id } = useParams();
  const calculator = calculators.find(c => c.id === id);

  if (!calculator) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Calculadora no encontrada</AlertDescription>
      </Alert>
    );
  }

  const CalculatorComponent = calculator.component;

  return (
    <div className="container mx-auto max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <calculator.icon className="w-6 h-6" />
            {calculator.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CalculatorComponent />
        </CardContent>
      </Card>
    </div>
  );
}
