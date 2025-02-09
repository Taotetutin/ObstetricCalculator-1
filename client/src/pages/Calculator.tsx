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
    <div className="container mx-auto py-6">
      {/* Navigation Menu */}
      <div className="mb-6 flex flex-wrap gap-2">
        {calculators.map((calc) => (
          <Link key={calc.id} href={`/calculator/${calc.id}`}>
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