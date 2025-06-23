import React from 'react';
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Calculator, 
  Heart, 
  Newspaper, 
  Menu,
  X,
  Pill
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { useAuth } from "@/hooks/use-auth";

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileNavigation({ isOpen, onToggle }: MobileNavProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  const mainNavItems = [
    { href: "/", icon: Home, label: "Inicio", active: location === "/" },
    { href: "/sabiduria-cultural", icon: Heart, label: "Sabiduría", active: location === "/sabiduria-cultural" },
    { href: "/obsterix-al-dia", icon: Newspaper, label: "Noticias", active: location === "/obsterix-al-dia" },
  ];

  const quickCalculators = [
    { href: "/calculadora/calculadora-gestacional-compleja", icon: Calculator, label: "FPP" },
    { href: "/calculadora/medicamentos-embarazo", icon: Pill, label: "Medicamentos" },
    { href: "/calculadora/mefi", icon: Calculator, label: "MEFI" },
    { href: "/calculadora/t21", icon: Calculator, label: "T21" },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom md:hidden">
        <div className="grid grid-cols-4 h-16">
          {mainNavItems.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
                item.active 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-blue-600"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
          
          {/* Menu Button */}
          <button
            onClick={onToggle}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors",
              isOpen 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-600 hover:text-blue-600"
            )}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="text-xs font-medium">Menú</span>
          </button>
        </div>
      </div>

      {/* Mobile Side Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onToggle} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl safe-top">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
                    alt="ObsteriX Logo"
                    className="h-8 w-auto"
                  />
                  <h2 className="text-xl font-bold text-blue-600">ObsteriX</h2>
                </div>
                <button onClick={onToggle} className="p-2 text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Quick Access Calculators */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Acceso Rápido</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickCalculators.map((calc) => (
                    <Link
                      key={calc.href}
                      href={calc.href}
                      onClick={onToggle}
                      className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <calc.icon className="h-6 w-6 text-blue-600 mb-1" />
                      <span className="text-xs font-medium text-blue-900">{calc.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* All Calculators Button */}
              <div className="p-4">
                <Link
                  href="/calculadora/calculadora-gestacional-compleja"
                  onClick={onToggle}
                  className="w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Ver Todas las Calculadoras
                </Link>
              </div>

              {/* User Section */}
              <div className="mt-auto p-4 border-t">
                <button
                  onClick={() => logoutMutation.mutateAsync()}
                  className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 safe-top md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/Adobe_Express_2024-04-12_7.56.48-removebg-preview.png"
              alt="ObsteriX Logo"
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-blue-600">ObsteriX Legend</h1>
          </div>
          <button
            onClick={onToggle}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  );
}