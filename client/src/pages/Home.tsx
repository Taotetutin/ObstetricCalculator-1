import { Card, CardContent } from "@/components/ui/card";
import { Lock, FileText, Mail, Heart, Newspaper } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { WisdomOfTheDay } from "@/components/ui/WisdomOfTheDay";
import { NewsOfTheDay } from "@/components/ui/LatestNews";
import { Link } from "wouter";

export default function Home() {
  // Using demo user for now since auth is bypassed
  const firstName = 'Doctor';

  return (
    <div className="flex flex-col h-full gap-6 sm:gap-8 max-w-4xl mx-auto px-0 sm:px-4">
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-primary bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          ObsteriX Legend
        </h1>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4 sm:pt-6 space-y-3 sm:space-y-4 text-base sm:text-lg text-blue-900/80">
            <p className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-6">
              ¡Bienvenido {firstName} a Obsterix Legend! 🌟
            </p>
            <p className="text-sm sm:text-base">
              La aplicación más completa y personalizada, creada pensando en ti y tus necesidades. 
              Estamos emocionados de que formes parte de esta experiencia única.
            </p>
            <p className="text-sm sm:text-base">
              Para comenzar, solo tienes que abrir el menú lateral haciendo clic en el ícono 
              de las tres líneas en la esquina superior. Desde allí, podrás navegar fácilmente 
              por todas las opciones y herramientas que hemos preparado para ti.
            </p>
            <p className="text-sm sm:text-base">
              Ya sea que busques información, funciones específicas o simplemente explorar, 
              estamos aquí para ayudarte en cada paso. ¡Descubre todo lo que Obsterix Legend 
              tiene para ofrecer y haz que tu experiencia sea legendaria! 🚀
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sabiduría Cultural del Día */}
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-800 flex items-center gap-1 sm:gap-2">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500" />
            <span className="text-base sm:text-xl">Explora Nuestra Sabiduría Cultural</span>
          </h2>
          <Link 
            href="/sabiduria-cultural"
            className="bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-1 shadow-sm"
          >
            Ver más <span className="text-xs">→</span>
          </Link>
        </div>
        <WisdomOfTheDay />
      </div>

      {/* Noticias al Día */}
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-800 flex items-center gap-1 sm:gap-2">
            <Newspaper className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="text-base sm:text-xl">Explora las Noticias de la Especialidad</span>
          </h2>
          <Link 
            href="/obsterix-al-dia"
            className="bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-1 shadow-sm"
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
      <div className="mt-auto pt-8 pb-4 flex flex-wrap justify-center gap-4 text-sm">
        <a 
          href="http://obsterixpro.mimaternofetal.cl/politicaprivacidad.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-md transition-colors shadow-sm"
        >
          <Lock className="w-4 h-4" />
          Políticas de Privacidad
        </a>
        <a 
          href="https://obsterixpro.mimaternofetal.cl/page6.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-md transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Términos y Condiciones
        </a>
        <a 
          href="mailto:manuel.guerra@mimaternofetal.cl"
          className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-md transition-colors shadow-sm"
        >
          <Mail className="w-4 h-4" />
          Contacto
        </a>
      </div>
    </div>
  );
}