import { Card, CardContent } from "@/components/ui/card";
import { Lock, FileText, Mail, Heart, Newspaper } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { WisdomOfTheDay } from "@/components/ui/WisdomOfTheDay";
import { NewsOfTheDay } from "@/components/ui/LatestNews";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  // Get first name from the full name
  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <div className="flex flex-col h-full gap-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold mb-4 text-primary bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          ObsteriX Legend
        </h1>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="pt-6 space-y-4 text-lg text-blue-900/80">
            <p className="text-2xl font-semibold mb-6">
              ¡Bienvenido {firstName} a Obsterix Legend! 🌟
            </p>
            <p>
              La aplicación más completa y personalizada, creada pensando en ti y tus necesidades. 
              Estamos emocionados de que formes parte de esta experiencia única.
            </p>
            <p>
              Para comenzar, solo tienes que abrir el menú lateral haciendo clic en el ícono 
              de las tres líneas en la esquina superior. Desde allí, podrás navegar fácilmente 
              por todas las opciones y herramientas que hemos preparado para ti.
            </p>
            <p>
              Ya sea que busques información, funciones específicas o simplemente explorar, 
              estamos aquí para ayudarte en cada paso. ¡Descubre todo lo que Obsterix Legend 
              tiene para ofrecer y haz que tu experiencia sea legendaria! 🚀
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sabiduría Cultural del Día */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Explora Nuestra Sabiduría Cultural
          </h2>
          <Link 
            href="/sabiduria-cultural"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline flex items-center gap-1"
          >
            Ver más <span className="text-xs">→</span>
          </Link>
        </div>
        <WisdomOfTheDay />
      </div>

      {/* Noticias al Día */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-blue-600" />
            Explora las Noticias de la Especialidad
          </h2>
          <Link 
            href="/obsterix-al-dia"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline flex items-center gap-1"
          >
            Ver más <span className="text-xs">→</span>
          </Link>
        </div>
        <NewsOfTheDay />
      </div>

      {/* Imagen de la familia Obsterix */}
      <div className="flex justify-center mt-4">
        <img 
          src="/untitled6.png"
          alt="ObsteriX Legend"
          className="max-w-full h-auto"
        />
      </div>

      {/* Enlaces en el pie de página */}
      <div className="mt-auto pt-8 pb-4 flex justify-center gap-8 text-sm text-blue-600">
        <a 
          href="http://obsterixpro.mimaternofetal.cl/politicaprivacidad.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-blue-800 transition-colors"
        >
          <Lock className="w-4 h-4" />
          Políticas de Privacidad
        </a>
        <a 
          href="https://obsterixpro.mimaternofetal.cl/page6.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-blue-800 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Términos y Condiciones
        </a>
        <a 
          href="mailto:manuel.guerra@mimaternofetal.cl"
          className="flex items-center gap-2 hover:text-blue-800 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Contacto
        </a>
      </div>
    </div>
  );
}