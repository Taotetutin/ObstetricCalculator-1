import { Card, CardContent } from "@/components/ui/card";
import { calculators } from "@/components/calculators";
import { Link } from "wouter";

export default function Home() {
  console.log("Calculadoras disponibles:", calculators);

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-primary">ObsteriX Pro</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators && calculators.map((calc) => (
          <Link key={calc.id} href={`/calculadora/${calc.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                {calc.icon && <calc.icon className="w-8 h-8 mb-4 text-primary" />}
                <h2 className="text-xl font-semibold mb-2">{calc.name}</h2>
                <p className="text-muted-foreground">{calc.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {(!calculators || calculators.length === 0) && (
        <div className="text-center text-gray-500">
          No hay calculadoras disponibles en este momento.
        </div>
      )}
    </div>
  );
}