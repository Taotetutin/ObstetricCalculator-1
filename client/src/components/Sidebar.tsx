import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { calculators } from "./calculators";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Agrupar calculadoras por categoría
const calculatorGroups = {
  "Cálculos Básicos": calculators.filter(c => ["fpp", "imc", "bishop"].includes(c.id)),
  "Evaluación Fetal": calculators.filter(c => ["doppler", "liquido_amniotico", "peso_fetal"].includes(c.id)),
  "Screening": calculators.filter(c => ["t21", "preeclampsia"].includes(c.id)),
  "Otros": calculators.filter(c => !["fpp", "imc", "bishop", "doppler", "liquido_amniotico", "peso_fetal", "t21", "preeclampsia"].includes(c.id))
};

export default function Sidebar() {
  const [location] = useLocation();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <Link href="/">
        <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-blue-50 via-blue-100/50 to-blue-50">
          <img 
            src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
            alt="MiMaternoFetal Logo"
            className="h-8 w-auto"
          />
          <span className="font-semibold text-lg text-primary">ObsteriX Legend</span>
        </div>
      </Link>

      <ScrollArea className="flex-1">
        <div className="p-3">
          <Accordion 
            type="multiple" 
            defaultValue={Object.keys(calculatorGroups)}
            className="space-y-2"
          >
            {Object.entries(calculatorGroups).map(([groupName, groupCalculators]) => (
              <AccordionItem 
                key={groupName} 
                value={groupName}
                className="border border-blue-100 rounded-lg bg-white shadow-sm"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-blue-50/50 rounded-t-lg font-medium text-blue-900">
                  {groupName}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 p-2">
                    {groupCalculators.map((calc) => (
                      <Link key={calc.id} href={`/calculadora/${calc.id}`}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-2 font-normal hover:bg-blue-50/50",
                            location === `/calculadora/${calc.id}` && 
                            "bg-blue-100/50 text-blue-900 hover:bg-blue-100/75 font-medium"
                          )}
                        >
                          {calc.icon && <calc.icon className="w-4 h-4 shrink-0 text-blue-600/80" />}
                          <span className="truncate">{calc.name}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Móvil */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" className="bg-white shadow-md">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <div className="hidden md:block w-[280px] border-r bg-gradient-to-b from-white to-blue-50/30 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <SidebarContent />
      </div>
    </>
  );
}