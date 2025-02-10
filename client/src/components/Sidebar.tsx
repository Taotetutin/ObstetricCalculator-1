import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { calculators } from "./calculators";
import { Button } from "@/components/ui/button";
import {
  Sidebar as CollapsibleSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <SidebarProvider>
      <CollapsibleSidebar variant="floating" className="border-r">
        <SidebarHeader className="border-b py-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer px-2">
              <img 
                src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
                alt="MiMaternoFetal Logo"
                className="h-16 w-auto"
              />
              <span className="font-bold text-xl text-primary">ObsteriX Legend</span>
            </div>
          </Link>
          <SidebarTrigger className="absolute right-2 top-4 md:right-4" />
        </SidebarHeader>

        <SidebarContent>
          <nav className="space-y-2 p-2">
            {calculators.map((calc) => (
              <Link key={calc.id} href={`/calculadora/${calc.id}`}>
                <Button
                  variant={location === `/calculadora/${calc.id}` ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    location === `/calculadora/${calc.id}` && "bg-accent"
                  )}
                >
                  {calc.icon && <calc.icon className="w-4 h-4" />}
                  <span className="truncate">{calc.name}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </SidebarContent>
        <SidebarRail />
      </CollapsibleSidebar>
    </SidebarProvider>
  );
}