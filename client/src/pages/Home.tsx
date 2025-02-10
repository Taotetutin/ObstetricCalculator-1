import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col h-full gap-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold mb-4 text-primary bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          ObsteriX Legend
        </h1>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="pt-6 space-y-4 text-lg text-blue-900/80">
            <p className="text-2xl font-semibold mb-6">
              ¡Bienvenido a Obsterix Legend! 🌟
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
    </div>
  );
}