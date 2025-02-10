import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { calculators } from "./calculators";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// Reorganizar calculadoras por categoría de forma más intuitiva
const calculatorGroups = {
  "Calculadoras Esenciales": calculators.filter(c => 
    ["fpp", "imc", "bishop", "peso_fetal"].includes(c.id)
  ),
  "Evaluación y Diagnóstico": calculators.filter(c => 
    ["doppler", "liquido_amniotico", "t21", "preeclampsia"].includes(c.id)
  ),
  "Herramientas Especializadas": calculators.filter(c => 
    !["fpp", "imc", "bishop", "doppler", "liquido_amniotico", "peso_fetal", "t21", "preeclampsia"].includes(c.id)
  )
};

export default function Sidebar() {
  const [location] = useLocation();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <Link href="/">
        <div className="flex items-center gap-3 p-4 border-b">
          <img 
            src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
            alt="MiMaternoFetal Logo"
            className="h-8 w-auto"
          />
          <span className="font-semibold text-lg text-blue-700">ObsteriX Legend</span>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto">
        {Object.entries(calculatorGroups).map(([groupName, groupCalculators]) => (
          <div key={groupName} className="py-2">
            <div className="mx-3 mb-2 px-3 py-2 bg-blue-50 rounded-md">
              <h3 className="text-sm font-semibold text-blue-900">{groupName}</h3>
            </div>
            <ul className="space-y-1 px-3">
              {groupCalculators.map((calc) => (
                <li key={calc.id}>
                  <Link href={`/calculadora/${calc.id}`}>
                    <a className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md",
                      "text-blue-800 hover:bg-blue-50 hover:text-blue-900",
                      "transition-colors duration-200",
                      location === `/calculadora/${calc.id}` && 
                      "bg-blue-100 text-blue-900 font-medium"
                    )}>
                      {calc.icon && (
                        <calc.icon className="w-5 h-5 shrink-0 text-blue-600" />
                      )}
                      <span>{calc.name}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Móvil */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-50">
          <Button 
            size="icon" 
            className="bg-white shadow-lg border-blue-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-white">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <div className="hidden md:block w-80 border-r bg-white shadow-lg">
        <SidebarContent />
      </div>
    </>
  );
}