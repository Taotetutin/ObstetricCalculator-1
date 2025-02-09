import { useParams } from "wouter";
import { calculators } from "@/components/calculators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function Calculator() {
  const { id } = useParams();
  const calculator = calculators.find(c => c.id === id);

  console.log("ID de calculadora:", id); // Debug log
  console.log("Calculadora encontrada:", calculator); // Debug log

  if (!calculator) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Calculadora no encontrada: {id}
            <div className="mt-4">
              <Link href="/">
                <Button variant="outline">Volver al inicio</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const CalculatorComponent = calculator.component;

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-sky-500/10">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              {calculator.icon && <calculator.icon className="w-6 h-6" />}
              {calculator.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalculatorComponent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}