import { Card, CardContent } from "@/components/ui/card";
import { calculators } from "@/components/calculators";
import { Link } from "wouter";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Scale, FileText, ShieldCheck, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">ObsteriX Legend</h1>
        <p className="text-lg text-muted-foreground">
          Herramientas profesionales para el cálculo y seguimiento obstétrico
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t py-4 px-6">
        <div className="flex justify-end gap-4 items-center max-w-7xl mx-auto">
          <Link href="/terminos">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-primary/10 rounded-full">
                    <FileText className="w-5 h-5 text-primary" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Términos y Condiciones
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <Link href="/privacidad">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-primary/10 rounded-full">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Política de Privacidad
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <Link href="/contacto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-primary/10 rounded-full">
                    <Mail className="w-5 h-5 text-primary" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Contacto
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </div>
      </footer>
    </div>
  );
}