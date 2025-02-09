import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import Sidebar from "@/components/Sidebar";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/calculadora/:id" component={Calculator} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <footer className="fixed bottom-0 w-full py-4 text-center text-sm text-blue-600 bg-white/50">
        Todos los derechos reservados a MiMaternoFetal.cl
      </footer>
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