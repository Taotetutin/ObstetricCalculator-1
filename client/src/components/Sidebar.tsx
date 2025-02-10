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
        <div className="flex items-center gap-2 p-4 border-b">
          <img 
            src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
            alt="MiMaternoFetal Logo"
            className="h-8 w-auto"
          />
          <span className="font-semibold text-lg text-primary">ObsteriX Legend</span>
        </div>
      </Link>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={Object.keys(calculatorGroups)} className="space-y-2">
            {Object.entries(calculatorGroups).map(([groupName, groupCalculators]) => (
              <AccordionItem key={groupName} value={groupName}>
                <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-lg">
                  {groupName}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 pl-2">
                    {groupCalculators.map((calc) => (
                      <Link key={calc.id} href={`/calculadora/${calc.id}`}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-2 font-normal",
                            location === `/calculadora/${calc.id}` && 
                            "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                          )}
                        >
                          {calc.icon && <calc.icon className="w-4 h-4 shrink-0 text-primary/80" />}
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
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <div className="hidden md:block w-[280px] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarContent />
      </div>
    </>
  );
}