import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon } from "lucide-react";

function Router() {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-6 pb-24">
            {location !== "/" && (
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => setLocation("/")}
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            )}
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/calculadora/:id" component={Calculator} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <footer className="py-4 text-right text-sm text-blue-600 bg-white/50 px-6">
            Todos los derechos reservados a MiMaternoFetal.cl
          </footer>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;