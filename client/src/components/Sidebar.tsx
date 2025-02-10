import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { calculators } from "./calculators";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Sidebar() {
  const [location] = useLocation();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <Link href="/">
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <img 
            src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
            alt="MiMaternoFetal Logo"
            className="h-12 w-auto"
          />
          <span className="font-bold text-xl text-primary">ObsteriX Legend</span>
        </div>
      </Link>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {calculators.map((calc) => (
            <Link key={calc.id} href={`/calculadora/${calc.id}`}>
              <Button
                variant={location === `/calculadora/${calc.id}` ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  location === `/calculadora/${calc.id}` && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {calc.icon && <calc.icon className="w-4 h-4 shrink-0 text-primary/80" />}
                <span className="truncate">{calc.name}</span>
              </Button>
            </Link>
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