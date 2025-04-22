import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, ExternalLink, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Tipo para las noticias
type NewsItem = {
  title: string;
  link: string;
  description: string;
  date: string;
};

export function LatestNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para obtener las noticias desde ACOG
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // En un entorno real, esto se conectaría a un endpoint del backend que
      // haría scraping o usaría una API para obtener las noticias actualizadas de ACOG
      // Por ahora simulamos la respuesta con algunas noticias de ejemplo
      // En producción, estas noticias vendrían del backend mediante scraping de ACOG
      
      // Simulación de petición a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Estas noticias deberían venir del backend que obtendría de ACOG
      const fetchedNews: NewsItem[] = [
        {
          title: "ACOG Statement on Legislative Interference",
          description: "Interference in the patient-physician relationship should not threaten the ability of patients to access the care they need and deserve...",
          link: "https://www.acog.org/news/news-releases/2024/04/acog-statement-on-legislative-interference",
          date: "April 15, 2024"
        },
        {
          title: "Join Us for Congressional Leadership Conference 2024!",
          description: "Join us in Washington, DC May 5-7, 2024, for our annual advocacy event bringing together ACOG Fellows to meet with representatives...",
          link: "https://www.acog.org/news/news-articles/2024/04/join-us-for-congressional-leadership-conference-2024",
          date: "April 12, 2024"
        },
        {
          title: "ACOG Applauds Senate Passage of Respect for Child Survivors Act",
          description: "Today, the Respect for Child Survivors Act (S. 519) passed in the U.S. Senate by unanimous consent...",
          link: "https://www.acog.org/news/news-releases/2024/04/acog-applauds-senate-passage-of-respect-for-child-survivors-act",
          date: "April 11, 2024"
        }
      ];
      
      setNews(fetchedNews);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("No pudimos cargar las noticias. Por favor intenta más tarde.");
      setLoading(false);
    }
  };

  // Cargar noticias al montar el componente
  useEffect(() => {
    fetchNews();
  }, []);

  // Función para mostrar la siguiente noticia
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  // Función para mostrar la noticia anterior
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  // Función para refrescar las noticias
  const handleRefresh = () => {
    fetchNews();
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-blue-500" />
          Noticias al Día
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-2"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Reintentar
            </Button>
          </div>
        ) : news.length > 0 ? (
          <div className="min-h-[150px]">
            <div className="mb-2 space-y-1">
              <div className="flex justify-between">
                <h3 className="font-medium text-blue-700">{news[currentIndex].title}</h3>
                <div className="text-xs text-gray-500">{news[currentIndex].date}</div>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">{news[currentIndex].description}</p>
            </div>
            
            {news.length > 1 && (
              <div className="flex justify-between items-center mt-4 text-xs">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrevious}
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 p-1 h-auto"
                >
                  ← Anterior
                </Button>
                <div className="text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">
                  {currentIndex + 1} de {news.length}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNext}
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 p-1 h-auto"
                >
                  Siguiente →
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No hay noticias disponibles en este momento.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Actualizar
        </Button>
        
        <a 
          href="https://www.acog.org/news" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
        >
          Visitar ACOG <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </CardFooter>
    </Card>
  );
}

// Componente para mostrar en la página principal
export function NewsOfTheDay() {
  return <LatestNews />;
}

// Componente para mostrar en la página dedicada
export function NewsExplorer() {
  return (
    <div className="space-y-6">
      <LatestNews />
      <div className="border-t border-gray-100 pt-4 mt-6">
        <p className="text-sm text-gray-600 italic">
          Las noticias mostradas son obtenidas de la <a href="https://www.acog.org/news" target="_blank" rel="noopener noreferrer" className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors font-medium">American College of Obstetricians and Gynecologists (ACOG)</a> y se actualizan regularmente para mantenerle informado sobre los últimos avances en la especialidad.
        </p>
      </div>
    </div>
  );
}