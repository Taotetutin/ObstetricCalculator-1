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
} from "@/components/ui/sidebar";

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <SidebarProvider defaultOpen>
      <CollapsibleSidebar className="min-h-screen border-r bg-white shadow-sm">
        <SidebarHeader className="border-b bg-white">
          <Link href="/">
            <div className="flex items-center gap-2 px-4 py-3">
              <img 
                src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
                alt="MiMaternoFetal Logo"
                className="h-12 w-auto"
              />
              <span className="font-bold text-xl text-gray-900">ObsteriX Legend</span>
            </div>
          </Link>
          <SidebarTrigger className="absolute right-2 top-4" />
        </SidebarHeader>

        <SidebarContent>
          <nav className="space-y-1 p-2">
            {calculators.map((calc) => (
              <Link key={calc.id} href={`/calculadora/${calc.id}`}>
                <Button
                  variant={location === `/calculadora/${calc.id}` ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    location === `/calculadora/${calc.id}` && "bg-gray-100"
                  )}
                >
                  {calc.icon && <calc.icon className="w-4 h-4 shrink-0 text-gray-600" />}
                  <span className="truncate">{calc.name}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </SidebarContent>
      </CollapsibleSidebar>
    </SidebarProvider>
  );
}