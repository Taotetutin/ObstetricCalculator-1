import { useState } from 'react';
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { calculators } from "./calculators";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Lock, FileText, Mail } from "lucide-react";

// Reorganizar calculadoras por categoría según la nueva especificación
const calculatorGroups = {
  "Calculadoras Esenciales": calculators.filter(c => 
    ["gestacional", "mefi", "doppler"].includes(c.id)
  ),
  "Evaluación y Riesgos": calculators.filter(c => 
    ["t21", "preeclampsia", "parto_prematuro", "colestasis", "prematurez"].includes(c.id)
  ),
  "Herramientas Especializadas": calculators.filter(c => 
    !["gestacional", "mefi", "doppler", "t21", "preeclampsia", "parto_prematuro", "colestasis", "prematurez"].includes(c.id)
  )
};

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col mt-16">
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

      {/* Enlaces en el pie del sidebar */}
      <div className="mt-auto p-4 border-t space-y-2">
        <a 
          href="http://obsterixpro.mimaternofetal.cl/politicaprivacidad.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Lock className="w-4 h-4" />
          Políticas de Privacidad
        </a>
        <a 
          href="https://obsterixpro.mimaternofetal.cl/page6.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Términos y Condiciones
        </a>
        <a 
          href="mailto:manuel.guerra@mimaternofetal.cl"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Contacto
        </a>
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