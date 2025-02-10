import { Card, CardContent } from "@/components/ui/card";
import { calculators } from "@/components/calculators";
import { Link } from "wouter";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">ObsteriX Legend</h1>
        <p className="text-lg text-muted-foreground">
          Herramientas profesionales para el cálculo y seguimiento obstétrico
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculators.map((calc) => (
          <Link key={calc.id} href={`/calculadora/${calc.id}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        {calc.icon && <calc.icon className="w-8 h-8 text-primary" />}
                      </div>
                      <h2 className="text-sm font-medium">{calc.name}</h2>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-center">
                  {calc.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        ))}
      </div>
    </div>
  );
}