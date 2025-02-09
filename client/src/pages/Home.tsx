import { Card, CardContent } from "@/components/ui/card";
import { calculators } from "@/components/calculators";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">ObsteriX Pro</h1>
        <p className="text-lg text-muted-foreground">
          Herramientas profesionales para el cálculo y seguimiento obstétrico
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <Link key={calc.id} href={`/calculadora/${calc.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {calc.icon && <calc.icon className="w-8 h-8 text-primary" />}
                  <h2 className="text-xl font-semibold">{calc.name}</h2>
                </div>
                <p className="text-muted-foreground">{calc.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {calculators.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No hay calculadoras disponibles en este momento.
        </div>
      )}
    </div>
  );
}