import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { calculators } from "./calculators";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-500">
          <img 
            src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
            alt="MiMaternoFetal Logo"
            className="h-8 w-auto"
          />
          <span className="font-semibold text-lg text-white">ObsteriX Legend</span>
        </div>
      </Link>

      <ScrollArea className="flex-1 py-4">
        <div className="px-2">
          {Object.entries(calculatorGroups).map(([groupName, groupCalculators]) => (
            <div key={groupName} className="mb-6">
              <div className="px-3 py-2 bg-blue-50 rounded-lg mb-2">
                <h3 className="text-sm font-semibold text-blue-900">
                  {groupName}
                </h3>
              </div>
              <div className="space-y-1">
                {groupCalculators.map((calc) => (
                  <Link key={calc.id} href={`/calculadora/${calc.id}`}>
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                        "text-left text-blue-800 hover:bg-blue-50",
                        "active:bg-blue-100",
                        location === `/calculadora/${calc.id}` && 
                        "bg-blue-100 font-medium"
                      )}
                    >
                      {calc.icon && (
                        <calc.icon className="w-5 h-5 shrink-0 text-blue-600" />
                      )}
                      <div>
                        <div className="font-medium">{calc.name}</div>
                        {calc.description && (
                          <div className="text-xs text-blue-600/70 mt-0.5">
                            {calc.description}
                          </div>
                        )}
                      </div>
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
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