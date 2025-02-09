import { useParams } from "wouter";
import { calculators } from "@/components/calculators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function Calculator() {
  const { id } = useParams();
  console.log('Current calculator ID:', id); // Debug log
  const calculator = calculators.find(c => c.id === id);

  console.log('Available calculator IDs:', calculators.map(c => c.id)); // Debug log

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
      {/* Navigation Menu */}
      <div className="mb-6 flex flex-wrap gap-2">
        {calculators.map((calc) => (
          <Link key={calc.id} href={`/calculadora/${calc.id}`}>
            <Button
              variant={calc.id === id ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <calc.icon className="h-4 w-4" />
              {calc.name}
            </Button>
          </Link>
        ))}
      </div>

      {/* Calculator Content */}
      <div className="max-w-2xl mx-auto">
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
    </div>
  );
}