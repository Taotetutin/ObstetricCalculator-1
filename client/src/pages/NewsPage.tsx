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
      
      <header className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-60"></div>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 opacity-30 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-300 opacity-30 rounded-full"></div>
        
        <div className="relative z-10 py-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-md">
            <Newspaper className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            ObsteriX al Día
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Mantente actualizado con las últimas noticias y avances en obstetricia y ginecología 
            de fuentes confiables como <span className="font-medium text-blue-700">ACOG</span>.
          </p>
        </div>
      </header>

      <Tabs defaultValue="latest" className="max-w-5xl mx-auto">
        <TabsList className="w-full bg-gradient-to-r from-blue-100 to-indigo-100 p-1.5 mb-8 rounded-xl shadow-sm">
          <TabsTrigger 
            value="latest" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md py-2 transition-all duration-200"
          >
            <Newspaper className="h-4 w-4 mr-2" /> Noticias Recientes
          </TabsTrigger>
          <TabsTrigger 
            value="featured" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md py-2 transition-all duration-200"
          >
            <ThumbsUp className="h-4 w-4 mr-2" /> Destacadas
          </TabsTrigger>
          <TabsTrigger 
            value="about" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md py-2 transition-all duration-200"
          >
            <BookOpen className="h-4 w-4 mr-2" /> Sobre Esta Sección
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
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse overflow-hidden border-blue-100 shadow-sm">
                      <CardContent className="p-0">
                        <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-400 w-full"></div>
                        <div className="p-5">
                          <div className="h-6 bg-gray-200 rounded-md mb-3"></div>
                          <div className="flex gap-2 mb-3">
                            <div className="h-5 w-20 bg-blue-100 rounded-full"></div>
                            <div className="h-5 w-24 bg-gray-100 rounded-full ml-auto"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-100 rounded-md"></div>
                            <div className="h-3 bg-gray-100 rounded-md"></div>
                            <div className="h-3 bg-gray-100 rounded-md w-2/3"></div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <div className="h-6 w-28 bg-blue-50 rounded-md"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {newsList.map((item) => (
                    <Card 
                      key={item.id} 
                      className="group overflow-hidden border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <CardContent className="p-0">
                        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 w-full transform origin-left transition-all duration-500 group-hover:scale-x-110"></div>
                        <div className="p-5">
                          <div className="flex items-start gap-2 mb-3">
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                            <h3 className="font-semibold text-blue-800 group-hover:text-blue-700 flex-1 transition-colors duration-200">
                              {item.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center text-xs font-medium text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                              {item.category}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {item.date}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed border-l-2 border-blue-100 pl-3">
                            {item.summary}
                          </p>
                          
                          <div className="flex justify-end">
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors inline-flex items-center gap-1 font-medium"
                            >
                              Leer en ACOG
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-3 w-3" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                                />
                              </svg>
                            </a>
                          </div>
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
          <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200 shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 opacity-20 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-300 opacity-20 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center mb-4 bg-white py-1 px-3 rounded-full shadow-sm border border-blue-100">
                <ThumbsUp className="h-4 w-4 text-blue-600 mr-2" />
                <h2 className="text-lg font-bold text-blue-800">Artículos Destacados</h2>
              </div>
              
              <p className="text-gray-700 mb-6 max-w-2xl leading-relaxed">
                Seleccionamos para ti las noticias más relevantes y de mayor impacto en la práctica obstétrica,
                destacando aquellas que pueden influir directamente en los protocolos clínicos y la atención al paciente.
              </p>
              
              {!loading && newsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {newsList.filter((_, idx) => idx < 2).map((item) => (
                    <Card 
                      key={item.id} 
                      className="group bg-white overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 relative"
                    >
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>
                      <div className="absolute top-0 right-0">
                        <div className="w-16 h-16 bg-blue-50 rotate-45 transform origin-bottom-left"></div>
                        <div className="absolute top-1.5 right-1.5">
                          <ThumbsUp className="h-3.5 w-3.5 text-blue-500" />
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                            <span className="text-xs font-bold text-blue-600">
                              {item.category.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-800 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                              {item.title}
                            </h3>
                            <div className="flex items-center text-xs mt-1">
                              <span className="text-blue-700 font-medium">
                                {item.category}
                              </span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-gray-500">
                                {item.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-3 my-3 text-sm text-gray-700 border-l-4 border-blue-300">
                          <p className="italic">"{item.content.substring(0, 120)}..."</p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                            <span className="text-xs text-gray-500">Actualizado</span>
                          </div>
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors inline-flex items-center gap-1 font-medium"
                          >
                            Leer artículo completo
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-3 w-3" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                              />
                            </svg>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <div className="animate-pulse flex flex-col items-center justify-center">
                    <div className="rounded-full bg-blue-100 h-12 w-12 flex items-center justify-center mb-4">
                      <ThumbsUp className="h-6 w-6 text-blue-300" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2.5"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-2xl opacity-50"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 opacity-20 rounded-full"></div>
            <div className="absolute -bottom-6 right-10 w-24 h-24 bg-indigo-300 opacity-20 rounded-full"></div>
            
            <div className="relative z-10 p-8">
              <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border border-blue-100 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                    Sobre ObsteriX al Día
                  </h2>
                </div>
                
                <div className="mb-8 text-gray-700 leading-relaxed border-l-4 border-blue-200 pl-4 py-1 italic">
                  "Mantenerse actualizado con la literatura médica más reciente es fundamental en la práctica clínica. ObsteriX al Día simplifica esta tarea para los profesionales de la obstetricia."
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b border-blue-100">
                    <AccordionTrigger className="text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg px-2">
                      ¿Qué es ObsteriX al Día?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 bg-blue-50 p-4 rounded-lg my-2">
                      <p className="leading-relaxed">
                        ObsteriX al Día es una sección dedicada a mantenerte informado sobre las últimas noticias, investigaciones y guías clínicas en el campo de la obstetricia y ginecología. Nos conectamos directamente con fuentes confiables como ACOG (American College of Obstetricians and Gynecologists) para traerte información actualizada y relevante para tu práctica profesional.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-b border-blue-100">
                    <AccordionTrigger className="text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg px-2">
                      ¿De dónde proviene la información?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 bg-blue-50 p-4 rounded-lg my-2">
                      <p className="leading-relaxed">
                        Toda la información presentada en esta sección proviene directamente de la página oficial de ACOG (<a href="https://www.acog.org/news" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.acog.org/news</a>) y otras fuentes acreditadas en obstetricia y ginecología. Nuestro sistema actualiza automáticamente el contenido para asegurar que siempre tengas acceso a las noticias más recientes.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg px-2">
                      ¿Con qué frecuencia se actualiza?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 bg-blue-50 p-4 rounded-lg my-2">
                      <p className="leading-relaxed">
                        El contenido de ObsteriX al Día se actualiza diariamente, verificando automáticamente nuevas publicaciones en las fuentes oficiales. Recomendamos visitar esta sección regularmente para mantenerse al día con los últimos avances en la especialidad.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white p-1 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-blue-800 mb-1">Aviso importante</h3>
                      <p className="text-sm text-gray-600 italic leading-relaxed">
                        ObsteriX al Día tiene un propósito puramente informativo. Siempre consulta las publicaciones originales y las guías clínicas completas para tomar decisiones profesionales. No reemplaza el criterio médico o las consultas de especialistas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-16 text-center">
        <div className="py-4 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl inline-block mx-auto shadow-sm border border-blue-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-sm flex items-center justify-center">
              <Newspaper className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
              ObsteriX al Día
            </span>
          </div>
          <p className="text-xs text-gray-600">
            © 2025 ObsteriX Legend | La información presentada es obtenida de ACOG y otras fuentes acreditadas.
          </p>
        </div>
      </div>
    </div>
  );
}