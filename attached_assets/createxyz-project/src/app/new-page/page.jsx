"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [busqueda, setBusqueda] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState("");

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: (message) => {
      try {
        const sections = message.split("\n").reduce((acc, line) => {
          if (line.toLowerCase().includes("categoría fda:")) {
            acc.categoria = line.split(":")[1].trim();
          } else if (line.toLowerCase().includes("descripción:")) {
            acc.descripcion = line.split(":")[1].trim();
          } else if (line.toLowerCase().includes("riesgos:")) {
            acc.riesgos = line.split(":")[1].trim();
          } else if (line.toLowerCase().includes("recomendaciones:")) {
            acc.recomendaciones = line.split(":")[1].trim();
          }
          return acc;
        }, {});
        setResultado(sections);
      } catch (err) {
        setResultado({ texto: message });
      }
      setStreamingMessage("");
      setCargando(false);
    },
  });

  const buscarMedicamento = async () => {
    if (!busqueda.trim()) return;

    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch("/integrations/google-gemini-1-5/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Actúa como un experto farmacéutico y proporciona información sobre la clasificación FDA del medicamento "${busqueda}" durante el embarazo. Responde en español, con el siguiente formato exacto:

Categoría FDA: [categoría]
Descripción: [descripción detallada de la categoría]
Riesgos: [lista de riesgos potenciales]
Recomendaciones: [recomendaciones específicas]`,
            },
          ],
          stream: true,
        }),
      });

      handleStreamResponse(response);
    } catch (err) {
      console.error(err);
      setError(
        "Hubo un error al buscar el medicamento. Por favor, intenta de nuevo."
      );
      setCargando(false);
    }
  };

  const ResultadoSection = ({ title, content, icon, color }) => (
    <div className={`bg-${color}-50 rounded-lg p-4 mb-4 animate-fade-in`}>
      <div className="flex items-center mb-2">
        <span className={`text-${color}-600 mr-2`}>{icon}</span>
        <h3 className={`text-${color}-800 font-semibold`}>{title}</h3>
      </div>
      <p className={`text-${color}-700 ml-6`}>{content}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2 text-center animate-fade-in">
          Clasificación FDA de Medicamentos en el Embarazo
        </h1>

        <p className="text-gray-600 mb-8 text-center animate-fade-in">
          Consulta la seguridad de los medicamentos durante el embarazo según la
          FDA
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Escribe el nombre del medicamento..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && buscarMedicamento()}
            />
            <button
              onClick={buscarMedicamento}
              disabled={cargando || !busqueda.trim()}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
                cargando || !busqueda.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
              }`}
            >
              {cargando ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded animate-fade-in">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {cargando && (
          <div className="flex justify-center items-center p-8">
            <div className="text-4xl animate-bounce">⌛</div>
          </div>
        )}

        {resultado && !cargando && (
          <div className="space-y-4 animate-fade-in">
            {resultado.categoria && (
              <ResultadoSection
                title="Categoría FDA"
                content={resultado.categoria}
                icon="🏷️"
                color="blue"
              />
            )}
            {resultado.descripcion && (
              <ResultadoSection
                title="Descripción"
                content={resultado.descripcion}
                icon="📝"
                color="green"
              />
            )}
            {resultado.riesgos && (
              <ResultadoSection
                title="Riesgos Potenciales"
                content={resultado.riesgos}
                icon="⚠️"
                color="yellow"
              />
            )}
            {resultado.recomendaciones && (
              <ResultadoSection
                title="Recomendaciones"
                content={resultado.recomendaciones}
                icon="💡"
                color="purple"
              />
            )}
            {resultado.texto && (
              <ResultadoSection
                title="Información"
                content={resultado.texto}
                icon="ℹ️"
                color="gray"
              />
            )}
          </div>
        )}
      </div>

      <footer className="mt-12 py-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-gray-600 text-sm">
            <div className="flex items-center flex-wrap justify-center gap-1">
              <span>Todos los derechos reservados a</span>
              <a
                href="https://mimaternofetal.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                MiMaternoFetal.cl
              </a>
            </div>
            <span className="hidden md:inline">•</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;