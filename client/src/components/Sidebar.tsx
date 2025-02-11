import { useState } from 'react';
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { calculators } from "./calculators";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const calculatorGroups = {
  "Calculadoras Esenciales": calculators.filter(c => 
    ["gestacional", "mefi", "doppler", "gestacional_complex"].includes(c.id)
  ),
  "Evaluación y Riesgos": calculators.filter(c => 
    ["t21", "preeclampsia", "parto_prematuro", "colestasis", "prematurez"].includes(c.id)
  ),
  "Herramientas Especializadas": calculators.filter(c => 
    !["gestacional", "mefi", "doppler", "t21", "preeclampsia", "parto_prematuro", "colestasis", "prematurez", "gestacional_complex"].includes(c.id)
  )
};

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col mt-24">
      <div 
        onClick={() => setIsOpen(false)}
        className="flex items-center gap-3 p-4 border-b cursor-pointer"
      >
        <img 
          src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
          alt="MiMaternoFetal Logo"
          className="h-8 w-auto"
        />
        <span className="font-semibold text-lg text-blue-700">ObsteriX Legend</span>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {Object.entries(calculatorGroups).map(([groupName, groupCalculators]) => (
          <div key={groupName} className="py-2">
            <div className="mx-3 mb-2 px-3 py-2 bg-blue-50 rounded-md">
              <h3 className="text-sm font-semibold text-blue-900">{groupName}</h3>
            </div>
            <ul className="space-y-1 px-3">
              {groupCalculators.map((calc) => (
                <li key={calc.id}>
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = `/calculadora/${calc.id}`;
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer",
                      "text-blue-800 hover:bg-blue-50 hover:text-blue-900",
                      "transition-colors duration-200",
                      location === `/calculadora/${calc.id}` && 
                      "bg-blue-100 text-blue-900 font-medium"
                    )}
                  >
                    {calc.icon && (
                      <calc.icon className="w-5 h-5 shrink-0 text-blue-600" />
                    )}
                    <span>{calc.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t space-y-2">
        <div onClick={() => setIsOpen(false)} className="space-y-2">
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">Link 1</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">Link 2</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">Link 3</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Móvil */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              size="icon" 
              className="fixed top-4 left-4 z-50 bg-white shadow-lg border-blue-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 bg-white border-r">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <div className="hidden md:block w-80 border-r bg-white">
        <SidebarContent />
      </div>
    </>
  );
}