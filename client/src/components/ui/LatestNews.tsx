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
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-8 -mt-8 z-0"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-500 opacity-10 rounded-full -ml-6 -mb-6 z-0"></div>
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-xl text-blue-800 flex items-center gap-2 font-bold">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
            <Newspaper className="h-5 w-5" />
          </div>
          Noticias al Día
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        {loading ? (
          <div className="space-y-3 p-2">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <div className="flex justify-center mt-4">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-6 px-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-red-600 font-medium">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-3 bg-white border-red-200 hover:bg-red-50 text-red-600"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Reintentar
            </Button>
          </div>
        ) : news.length > 0 ? (
          <div className="min-h-[180px] relative">
            <div className="p-3 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-sm border border-blue-100 mb-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-start justify-between">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                      Actualidad
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                    {news[currentIndex].date}
                  </div>
                </div>
                
                <h3 className="font-semibold text-blue-800">{news[currentIndex].title}</h3>
                <p className="text-sm text-gray-700 line-clamp-3">{news[currentIndex].description}</p>
                
                <a 
                  href={news[currentIndex].link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center mt-1 font-medium"
                >
                  Leer completo <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
            
            {news.length > 1 && (
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrevious}
                  className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50 rounded-full p-1 h-8 w-8 flex items-center justify-center"
                  aria-label="Noticia anterior"
                >
                  ←
                </Button>
                <div className="text-xs text-gray-600 font-medium bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                  {currentIndex + 1} de {news.length}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNext}
                  className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50 rounded-full p-1 h-8 w-8 flex items-center justify-center"
                  aria-label="Siguiente noticia"
                >
                  →
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-500 font-medium">No hay noticias disponibles en este momento.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center relative z-10">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50 rounded-md"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Actualizar
        </Button>
        
        <a 
          href="https://www.acog.org/news" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
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
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm mt-6">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-200 opacity-30 rounded-full"></div>
        <div className="absolute -left-4 -top-4 w-16 h-16 bg-indigo-200 opacity-30 rounded-full"></div>
        
        <div className="relative z-10">
          <h3 className="text-blue-800 font-bold mb-2 flex items-center gap-2">
            <div className="p-1 bg-blue-700 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            Fuente de información
          </h3>
          
          <p className="text-sm text-gray-700 mb-3 leading-relaxed max-w-2xl">
            Las noticias mostradas son obtenidas de la <a href="https://www.acog.org/news" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md hover:bg-blue-200 transition-colors font-medium">American College of Obstetricians and Gynecologists <ExternalLink className="h-3 w-3" /></a> y se actualizan regularmente para mantenerle informado sobre los últimos avances en la especialidad.
          </p>
          
          <div className="flex items-center gap-2 mt-3">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm text-xs">N</div>
              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-sm text-xs">O</div>
              <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-white shadow-sm text-xs">T</div>
            </div>
            <span className="text-xs font-medium text-gray-600 bg-white px-2 py-0.5 rounded-full shadow-sm border border-gray-200">
              Actualizado diariamente
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}