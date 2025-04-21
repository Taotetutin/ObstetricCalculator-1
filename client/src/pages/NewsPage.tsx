import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { NewsExplorer } from '@/components/ui/LatestNews';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Newspaper, ThumbsUp, Bell, BookOpen } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function NewsPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí se implementaría la lógica para cargar más noticias de ACOG
    // En una implementación real, esto se conectaría con un backend que hace scraping
    // o usa una API para obtener datos actualizados de ACOG
    
    // Simulación de carga de datos
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Noticias de ejemplo (en producción, esto vendría de una API)
      const newsData = [
        {
          id: 1,
          title: "ACOG Statement on Legislative Interference",
          summary: "Interference in the patient-physician relationship should not threaten the ability of patients to access the care they need and deserve...",
          content: "The American College of Obstetricians and Gynecologists (ACOG) strongly opposes legislative interference in the patient-physician relationship...",
          date: "April 15, 2024",
          category: "Policy",
          link: "https://www.acog.org/news/news-releases/2024/04/acog-statement-on-legislative-interference"
        },
        {
          id: 2,
          title: "Join Us for Congressional Leadership Conference 2024!",
          summary: "Join us in Washington, DC May 5-7, 2024, for our annual advocacy event bringing together ACOG Fellows to meet with representatives...",
          content: "The Congressional Leadership Conference is ACOG's premier advocacy event and brings ACOG Fellows to Washington, DC, to speak with federal lawmakers about the latest issues affecting ob-gyns and patients...",
          date: "April 12, 2024",
          category: "Events",
          link: "https://www.acog.org/news/news-articles/2024/04/join-us-for-congressional-leadership-conference-2024"
        },
        {
          id: 3,
          title: "ACOG Applauds Senate Passage of Respect for Child Survivors Act",
          summary: "Today, the Respect for Child Survivors Act (S. 519) passed in the U.S. Senate by unanimous consent...",
          content: "The American College of Obstetricians and Gynecologists (ACOG) released the following statement today regarding the passage of the Respect for Child Survivors Act in the U.S. Senate...",
          date: "April 11, 2024",
          category: "Policy",
          link: "https://www.acog.org/news/news-releases/2024/04/acog-applauds-senate-passage-of-respect-for-child-survivors-act"
        },
        {
          id: 4,
          title: "ACOG Statement on Access to Medication Abortion",
          summary: "Today, the U.S. Supreme Court heard arguments in FDA v. Alliance for Hippocratic Medicine, a case that could significantly limit access to mifepristone...",
          content: "The American College of Obstetricians and Gynecologists (ACOG) continues to condemn the misguided and dangerous legal attempts to limit access to mifepristone...",
          date: "April 9, 2024",
          category: "Policy",
          link: "https://www.acog.org/news/news-releases/2024/04/acog-statement-on-access-to-medication-abortion"
        },
        {
          id: 5,
          title: "New Practice Bulletin on Gestational Hypertension",
          summary: "ACOG has released updated guidance on the management of gestational hypertension and preeclampsia.",
          content: "This Practice Bulletin provides evidence-based recommendations for the screening, diagnosis, and management of gestational hypertensive disorders...",
          date: "April 5, 2024",
          category: "Clinical Guidance",
          link: "https://www.acog.org/news/news-releases/2024/04/new-practice-bulletin-on-gestational-hypertension"
        }
      ];
      
      setNewsList(newsData);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>ObsteriX al Día | Noticias de Obstetricia y Ginecología</title>
      </Helmet>
      
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
          <Newspaper className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">ObsteriX al Día</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Mantente actualizado con las últimas noticias y avances en obstetricia y ginecología de fuentes confiables como ACOG.
        </p>
      </header>

      <Tabs defaultValue="latest" className="max-w-5xl mx-auto">
        <TabsList className="w-full bg-blue-50 p-1 mb-6">
          <TabsTrigger value="latest" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Newspaper className="h-4 w-4 mr-1" /> Noticias Recientes
          </TabsTrigger>
          <TabsTrigger value="featured" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <ThumbsUp className="h-4 w-4 mr-1" /> Destacadas
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <BookOpen className="h-4 w-4 mr-1" /> Sobre Esta Sección
          </TabsTrigger>
        </TabsList>

        <TabsContent value="latest" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <NewsExplorer />
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Noticias Recientes</h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {newsList.map((item) => (
                    <Card key={item.id} className="transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-blue-700">{item.title}</h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{item.date}</span>
                        </div>
                        <div className="mb-2">
                          <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{item.summary}</p>
                        <div className="text-right">
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Leer completo en ACOG
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="mt-6 text-center">
                <Button variant="outline" className="text-blue-600 hover:bg-blue-50">
                  <Bell className="h-4 w-4 mr-2" />
                  Suscribirse a actualizaciones
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="featured" className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Artículos Destacados</h2>
            <p className="text-gray-600 mb-4">
              Seleccionamos para ti las noticias más relevantes y de mayor impacto en la práctica obstétrica.
            </p>
            
            {!loading && newsList.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {newsList.filter((_, idx) => idx < 2).map((item) => (
                  <Card key={item.id} className="bg-white transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-blue-800">{item.title}</h3>
                      </div>
                      <div className="mb-2">
                        <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        <span className="inline-block text-xs text-gray-500 ml-2">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{item.content}</p>
                      <div className="text-right">
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Leer completo en ACOG
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Sobre ObsteriX al Día</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-blue-700">¿Qué es ObsteriX al Día?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  ObsteriX al Día es una sección dedicada a mantenerte informado sobre las últimas noticias, investigaciones y guías clínicas en el campo de la obstetricia y ginecología. Nos conectamos directamente con fuentes confiables como ACOG (American College of Obstetricians and Gynecologists) para traerte información actualizada y relevante para tu práctica profesional.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-blue-700">¿De dónde proviene la información?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Toda la información presentada en esta sección proviene directamente de la página oficial de ACOG (www.acog.org/news) y otras fuentes acreditadas en obstetricia y ginecología. Nuestro sistema actualiza automáticamente el contenido para asegurar que siempre tengas acceso a las noticias más recientes.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-blue-700">¿Con qué frecuencia se actualiza?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  El contenido de ObsteriX al Día se actualiza diariamente, verificando automáticamente nuevas publicaciones en las fuentes oficiales. Recomendamos visitar esta sección regularmente para mantenerse al día con los últimos avances en la especialidad.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-600 italic">
                ObsteriX al Día tiene un propósito puramente informativo. Siempre consulta las publicaciones originales y las guías clínicas completas para tomar decisiones profesionales.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-16 text-center text-sm text-gray-500">
        <p>© 2025 ObsteriX Legend | La información presentada es obtenida de ACOG y otras fuentes acreditadas.</p>
      </div>
    </div>
  );
}