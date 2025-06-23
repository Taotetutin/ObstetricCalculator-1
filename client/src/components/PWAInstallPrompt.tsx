import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Check if prompt was previously dismissed
    const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissedTime) {
      const daysSince = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return; // Don't show for 7 days after dismissal
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show manual install hint for iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !isInWebAppiOS) {
      setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (!showPrompt || isInstalled) return null;

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-50 border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-lg md:hidden">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Smartphone className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Instalar ObsteriX Legend
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {isIOS 
                ? "Agrega a la pantalla de inicio para acceso rápido como una app nativa"
                : "Instala la app para una experiencia más rápida y funcionalidad offline"
              }
            </p>
            
            {isIOS ? (
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Toca el botón de compartir (□↗)</p>
                <p>• Selecciona "Agregar a pantalla de inicio"</p>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  onClick={handleInstall}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Instalar
                </Button>
                <Button 
                  onClick={handleDismiss}
                  variant="outline"
                  size="sm"
                >
                  Ahora no
                </Button>
              </div>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}