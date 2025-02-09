import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { calculators } from "./calculators";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 border-r bg-card p-4 flex flex-col gap-4">
      <div className="h-24 flex items-center px-2 border-b pb-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <img 
              src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
              alt="MiMaternoFetal Logo"
              className="h-16 w-auto"
            />
            <span className="font-bold text-xl">ObsteriX Pro</span>
          </div>
        </Link>
      </div>

      <nav className="space-y-2">
        {calculators.map((calc) => (
          <Link key={calc.id} href={`/calculadora/${calc.id}`}>
            <Button
              variant={location === `/calculadora/${calc.id}` ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                location === `/calculadora/${calc.id}` && "bg-accent"
              )}
            >
              <calc.icon className="w-4 h-4" />
              {calc.name}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}