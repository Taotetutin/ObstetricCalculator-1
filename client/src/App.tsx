import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Calculator, Baby, Stethoscope } from 'lucide-react';
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CalculatorPage from "@/pages/Calculator"; // Assuming the name is CalculatorPage
import Sidebar from "@/components/Sidebar";
import Header from './components/Header';
import AgeCalculator from './components/calculators/T21/AgeCalculator';
import FirstTrimesterCalculator from './components/calculators/T21/FirstTrimesterCalculator';
import SecondTrimesterCalculator from './components/calculators/T21/SecondTrimesterCalculator';


function Router() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/calculadora/:id" component={CalculatorPage} /> {/* Assuming the name is CalculatorPage */}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex flex-col">
        <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
          <Header />
          <Tab.Group>
            <Tab.List className="flex space-x-2 rounded-xl bg-blue-100 p-1 mt-8">
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-all
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                }`
              }>
                <div className="flex items-center justify-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span>Riesgo por Edad</span>
                </div>
              </Tab>
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-all
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                }`
              }>
                <div className="flex items-center justify-center gap-2">
                  <Baby className="w-4 h-4" />
                  <span>Primer Trimestre</span>
                </div>
              </Tab>
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-all
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                }`
              }>
                <div className="flex items-center justify-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  <span>Segundo Trimestre</span>
                </div>
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-8">
              <Tab.Panel><AgeCalculator /></Tab.Panel>
              <Tab.Panel><FirstTrimesterCalculator /></Tab.Panel>
              <Tab.Panel><SecondTrimesterCalculator /></Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        <footer className="py-4 text-center text-sm text-blue-600 bg-white/50 mt-8">
          Todos los derechos reservados a MiMaternoFetal.cl
        </footer>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;