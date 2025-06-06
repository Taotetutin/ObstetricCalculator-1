import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestCalculator() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-blue-800">
            Calculadora de Prueba
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta es una calculadora de prueba para verificar que el sistema funciona.</p>
          <Button className="mt-4">Botón de Prueba</Button>
        </CardContent>
      </Card>
    </div>
  );
}