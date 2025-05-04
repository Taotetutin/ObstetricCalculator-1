import React, { useState } from "react";

function MedicationGeminiCalculator() {
  const [busqueda, setBusqueda] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const buscarMedicamento = async () => {
    if (!busqueda.trim()) return;

    setCargando(true);
    setError(null);
    setResultado(null);

    // Simulamos una búsqueda y mostramos resultados predefinidos después de un breve retraso
    setTimeout(() => {
      // Información predefinida para demostración
      const medicamentos = {
        'paracetamol': {
          categoria: 'B',
          descripcion: 'La categoría B indica que los estudios en animales no han demostrado riesgo para el feto, pero no hay estudios adecuados en mujeres embarazadas.',
          riesgos: 'Posibles efectos secundarios maternos como náuseas o dolor de cabeza en dosis altas.',
          recomendaciones: 'Puede utilizarse en todas las etapas del embarazo en dosis terapéuticas. Consulte siempre con su médico.'
        },
        'ibuprofeno': {
          categoria: 'C/D',
          descripcion: 'Categoría C en 1er y 2do trimestre, D en el 3er trimestre. Estudios han demostrado riesgos potenciales.',
          riesgos: 'Puede reducir el líquido amniótico y causar problemas cardiovasculares en el feto si se usa en el tercer trimestre.',
          recomendaciones: 'Evitar en el tercer trimestre. En los primeros dos trimestres usar la dosis efectiva más baja por el menor tiempo posible.'
        },
        'aspirina': {
          categoria: 'C/D',
          descripcion: 'Categoría C en 1er y 2do trimestre en dosis bajas, D en dosis altas o 3er trimestre.',
          riesgos: 'Puede provocar complicaciones durante el parto, hemorragias y cierre prematuro del conducto arterioso del feto.',
          recomendaciones: 'Evitar en el tercer trimestre. En bajas dosis puede ser recetada para prevenir preeclampsia en casos específicos.'
        },
        'amoxicilina': {
          categoria: 'B',
          descripcion: 'La categoría B indica que los estudios en animales no han demostrado riesgo para el feto, pero no hay estudios adecuados en mujeres embarazadas.',
          riesgos: 'Se consideran mínimos. Puede causar alergias o alteraciones digestivas en la madre.',
          recomendaciones: 'Puede utilizarse durante el embarazo cuando sea claramente necesario para tratar infecciones bacterianas.'
        }
      };

      // Buscar coincidencia (ignorando mayúsculas/minúsculas)
      const busquedaLower = busqueda.toLowerCase();
      
      // Encontrar medicamento por coincidencia parcial
      const medicamentoEncontrado = Object.entries(medicamentos).find(
        ([nombre]) => nombre.toLowerCase().includes(busquedaLower) || busquedaLower.includes(nombre)
      );

      if (medicamentoEncontrado) {
        setResultado(medicamentoEncontrado[1]);
      } else {
        setResultado({
          categoria: 'No encontrado',
          descripcion: 'No tenemos información específica sobre este medicamento en nuestra base de datos.',
          riesgos: 'Desconocidos según nuestra base de datos actual.',
          recomendaciones: 'Consulte siempre con su médico antes de tomar cualquier medicamento durante el embarazo.'
        });
      }

      setCargando(false);
    }, 1000);
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
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2 text-center">
          Clasificación FDA de Medicamentos en el Embarazo
        </h1>

        <p className="text-gray-600 mb-8 text-center">
          Consulta la seguridad de los medicamentos durante el embarazo según la
          FDA
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {cargando && (
          <div className="flex justify-center items-center p-8">
            <div className="text-4xl animate-bounce">⌛</div>
          </div>
        )}

        {resultado && !cargando && (
          <div className="space-y-4">
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
          </div>
        )}
        
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Nota importante:</strong> Esta información es solo orientativa y no sustituye el consejo médico profesional.
            Consulte siempre con su médico sobre el uso de cualquier medicamento durante el embarazo.
          </p>
        </div>
      </div>

      <style>{`
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

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default MedicationGeminiCalculator;