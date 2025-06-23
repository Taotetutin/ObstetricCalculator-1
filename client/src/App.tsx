import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import AuthPage from "@/pages/AuthPage";
import CulturalWisdomPage from "@/pages/CulturalWisdomPage";
import NewsPage from "@/pages/NewsPage";

import Sidebar from "@/components/Sidebar";
import LoadingScreen from "@/components/LoadingScreen";
import { MobileNavigation } from "@/components/MobileNavigation";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon } from "lucide-react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  const [location, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Register service worker for PWA functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered'))
        .catch(error => console.log('SW registration failed'));
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen">
      {user && isMobile && (
        <MobileNavigation 
          isOpen={mobileMenuOpen} 
          onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
        />
      )}
      
      <div className="flex min-h-screen">
        {user && !isMobile && <Sidebar />}
        <div className={`flex-1 flex flex-col ${user && isMobile ? 'pt-20 pb-20' : ''}`}>
          <main className={`flex-1 bg-gradient-to-br from-blue-50 to-white overflow-auto ${
            isMobile ? 'p-3' : 'p-3 sm:p-4 md:p-6'
          }`}>
            {user && location !== "/" && location !== "/auth" && !isMobile && (
              <Button
                variant="ghost"
                className="mb-3 sm:mb-4"
                onClick={() => setLocation("/")}
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            )}
            <Switch>
              <Route path="/auth" component={AuthPage} />
              <ProtectedRoute path="/" component={Home} />
              <ProtectedRoute path="/calculadora/:id" component={Calculator} />
              <ProtectedRoute path="/sabiduria-cultural" component={CulturalWisdomPage} />
              <ProtectedRoute path="/obsterix-al-dia" component={NewsPage} />

              <Route component={NotFound} />
            </Switch>
          </main>
          {!isMobile && (
            <footer className="py-4 text-center text-sm text-primary/80 bg-white border-t">
              Todos los derechos reservados a MiMaternoFetal.cl
            </footer>
          )}
        </div>
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {isLoading ? <LoadingScreen /> : <Router />}
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;