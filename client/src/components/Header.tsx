import { SiGithub } from "react-icons/si";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-blue-700">
          Calculadora de Riesgo T21
        </h1>
        <p className="text-blue-600">
          Herramienta de evaluación de riesgo para trisomía 21
        </p>
      </div>
      <a
        href="https://github.com/Taotetutin/T21-app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
      >
        <SiGithub className="w-5 h-5" />
        <span className="hidden sm:inline">Ver en GitHub</span>
      </a>
    </header>
  );
}
