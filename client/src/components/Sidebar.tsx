import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { calculators } from "./calculators";
import { Menu } from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

// Agrupar calculadoras por categoría
const calculatorGroups = {
  "Cálculos Básicos": calculators.filter(c => ["fpp", "imc", "bishop"].includes(c.id)),
  "Evaluación Fetal": calculators.filter(c => ["doppler", "liquido_amniotico", "peso_fetal"].includes(c.id)),
  "Screening": calculators.filter(c => ["t21", "preeclampsia"].includes(c.id)),
  "Otros": calculators.filter(c => !["fpp", "imc", "bishop", "doppler", "liquido_amniotico", "peso_fetal", "t21", "preeclampsia"].includes(c.id))
};

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <SidebarProvider defaultOpen>
      <ShadcnSidebar>
        <SidebarHeader className="border-b px-2">
          <Link href="/">
            <div className="flex items-center gap-2 py-2">
              <img 
                src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
                alt="MiMaternoFetal Logo"
                className="h-8 w-auto"
              />
              <span className="font-semibold text-lg text-primary">ObsteriX Legend</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {Object.entries(calculatorGroups).map(([groupName, groupCalculators]) => (
              <SidebarMenuItem key={groupName}>
                <SidebarMenuButton>{groupName}</SidebarMenuButton>
                <SidebarMenuSub>
                  {groupCalculators.map((calc) => (
                    <SidebarMenuSubItem key={calc.id}>
                      <Link href={`/calculadora/${calc.id}`}>
                        <div
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent",
                            location === `/calculadora/${calc.id}` && 
                            "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                          )}
                        >
                          {calc.icon && <calc.icon className="w-4 h-4 shrink-0 text-primary/80" />}
                          <span className="truncate text-sm">{calc.name}</span>
                        </div>
                      </Link>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ShadcnSidebar>
    </SidebarProvider>
  );
}