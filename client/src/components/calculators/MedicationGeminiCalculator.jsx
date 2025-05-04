import React, { useState } from "react";
import axios from "axios";

function MedicationGeminiCalculator() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Descripción de las categorías FDA
  const fdaCategories = {
    A: "Estudios controlados no han demostrado riesgo. Estudios adecuados y bien controlados en mujeres embarazadas no han demostrado riesgo para el feto.",
    B: "No hay evidencia de riesgo en humanos. Estudios en animales no han mostrado riesgo fetal, pero no hay estudios adecuados en mujeres embarazadas; o los estudios en animales han mostrado un efecto adverso, pero estudios adecuados en mujeres embarazadas no han demostrado riesgo para el feto.",
    C: "Riesgo no puede ser descartado. Estudios en animales han mostrado efectos adversos en el feto y no hay estudios adecuados en humanos, pero los beneficios potenciales pueden justificar su uso en mujeres embarazadas a pesar de los riesgos potenciales.",
    D: "Evidencia positiva de riesgo. Hay evidencia de riesgo para el feto humano basado en datos de reacciones adversas, pero los beneficios potenciales pueden superar los riesgos en situaciones graves.",
    X: "Contraindicado en el embarazo. Estudios en animales o humanos han demostrado anormalidades fetales o hay evidencia de riesgo fetal basada en la experiencia humana, y los riesgos superan claramente cualquier posible beneficio."
  };

  // Función para buscar en OpenFDA API a través de nuestro backend
  const searchMedications = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      // Consultar a nuestro propio backend, que a su vez consulta a la API de OpenFDA
      console.log("Buscando medicamento:", searchTerm);
      const response = await axios.get(`/api/medications/search?term=${encodeURIComponent(searchTerm)}`);
      
      if (response.data.medications && response.data.medications.length > 0) {
        console.log("Medicamentos encontrados:", response.data.medications.length);
        
        // Procesar los resultados
        const processedResults = response.data.medications.map(med => {
          // Formatear información para su visualización
          return {
            name: med.name,
            category: med.category,
            description: med.route ? `Vía de administración: ${med.route}` : undefined,
            information: med.information,
            warnings: med.warnings,
            recommendation: med.recommendation,
            isLocal: med.isLocal,
            isAlternative: med.isAlternative
          };
        });
        
        setResults(processedResults);
      } else {
        console.log("No se encontraron medicamentos");
        setResults([]);
      }
    } catch (error) {
      console.error("Error buscando medicamentos:", error);
      setError("Error al comunicarse con la API. Por favor, intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Manejador para seleccionar un medicamento
  const handleSelectMedication = (med) => {
    setSelectedMedication(med);
  };

  // Función para obtener color según categoría FDA
  const getCategoryColor = (category) => {
    if (!category || category === "No disponible") return "gray-500";
    
    // Si es una categoría compuesta (ej: C/D), usar la más severa
    if (category.includes("/")) {
      const parts = category.split("/");
      return getCategoryColorByLetter(parts[parts.length - 1]);
    }
    
    return getCategoryColorByLetter(category);
  };

  const getCategoryColorByLetter = (letter) => {
    const colors = {
      "A": "green-500",
      "B": "blue-500", 
      "C": "yellow-500",
      "D": "orange-500",
      "X": "red-600"
    };
    
    return colors[letter] || "gray-500";
  };

  // Función para obtener nivel de riesgo según categoría
  const getRiskLevel = (category) => {
    if (!category || category === "No disponible") return "No clasificado";
    
    // Si es una categoría compuesta, usar la más severa
    if (category.includes("/")) {
      const parts = category.split("/");
      return getRiskLevelByLetter(parts[parts.length - 1]);
    }
    
    return getRiskLevelByLetter(category);
  };

  const getRiskLevelByLetter = (letter) => {
    const levels = {
      "A": "Bajo riesgo",
      "B": "Bajo a moderado riesgo",
      "C": "Riesgo moderado",
      "D": "Alto riesgo",
      "X": "Contraindicado"
    };
    
    return levels[letter] || "No clasificado";
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchMedications();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h2 className="text-xl font-bold mb-1">Clasificación FDA de Medicamentos en el Embarazo</h2>
        <p className="text-sm text-blue-100">
          Base de datos completa sobre la seguridad de medicamentos durante el embarazo
        </p>
      </div>
      
      <div className="p-5">
        <div className="mb-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar medicamento (ej: paracetamol, ibuprofeno)"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg 
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || loading}
              className={`px-5 py-2.5 rounded-lg text-white font-medium ${
                !searchTerm.trim() || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 transition"
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Buscando...
                </span>
              ) : (
                "Buscar"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Resultados ({results.length})</h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {results.map((med, index) => (
                  <li 
                    key={index}
                    className="py-2 cursor-pointer hover:bg-blue-50 transition px-3 rounded flex justify-between items-center"
                    onClick={() => handleSelectMedication(med)}
                  >
                    <span>{med.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${getCategoryColor(med.category)}/20 text-${getCategoryColor(med.category)}`}>
                      {med.category}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {results.length === 0 && loading === false && searchTerm !== "" && (
          <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron resultados</h3>
            <p className="mt-1 text-sm text-gray-500">Intente con otro término de búsqueda.</p>
          </div>
        )}

        {selectedMedication && (
          <div className="mt-6 border rounded-lg overflow-hidden shadow-md animate-fadeIn">
            <div className="p-4 bg-blue-50 border-b">
              <h3 className="text-lg font-semibold text-gray-800">{selectedMedication.name}</h3>
              {selectedMedication.description && (
                <p className="text-sm text-gray-600">{selectedMedication.description}</p>
              )}
            </div>
            
            <div className="p-5">
              <div className="flex items-center mb-5">
                <div className={`h-12 w-12 rounded-full bg-${getCategoryColor(selectedMedication.category)} flex items-center justify-center text-white font-bold`}>
                  {selectedMedication.category}
                </div>
                <div className="ml-4">
                  <h4 className="text-sm text-gray-500 uppercase">Categoría FDA para embarazo</h4>
                  <p className="text-lg font-semibold">{getRiskLevel(selectedMedication.category)}</p>
                </div>
              </div>
              
              {selectedMedication.category && fdaCategories[selectedMedication.category.split('/')[0]] && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Descripción de la categoría</h4>
                  <p className="text-gray-600">{fdaCategories[selectedMedication.category.split('/')[0]]}</p>
                </div>
              )}
              
              {selectedMedication.information && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Información sobre el embarazo</h4>
                  <p className="text-gray-600">{selectedMedication.information}</p>
                </div>
              )}
              
              {selectedMedication.warnings && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Advertencias</h4>
                  <p className="text-gray-600">{selectedMedication.warnings}</p>
                </div>
              )}
              
              {selectedMedication.recommendation && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Recomendaciones</h4>
                  <p className="text-gray-600">{selectedMedication.recommendation}</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                  La información proporcionada es orientativa y no sustituye el consejo médico profesional.
                  Consulte siempre con su médico antes de tomar cualquier medicamento durante el embarazo.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!searchTerm && !selectedMedication && (
          <div className="mt-2">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Categorías FDA para Embarazo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(fdaCategories).map(([category, description]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 font-bold text-white bg-${getCategoryColorByLetter(category)}`}>
                      {category}
                    </span>
                    <span className="font-medium text-gray-800">
                      {getRiskLevelByLetter(category)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Base de datos de medicamentos</h4>
              <p className="text-sm text-blue-700">
                Esta herramienta contiene datos sobre más de 30 medicamentos comunes y su clasificación durante
                el embarazo. Ingrese el nombre de un medicamento en el campo de búsqueda para consultar su 
                categoría FDA y recomendaciones específicas.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default MedicationGeminiCalculator;