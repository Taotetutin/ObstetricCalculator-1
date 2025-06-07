import React, { useState, useEffect } from "react";
import axios from "axios";

function MedicationGeminiCalculator() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geminiResult, setGeminiResult] = useState(null);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [activeTab, setActiveTab] = useState("gemini"); // "gemini" o "fda"

  // Descripción de las categorías FDA
  const fdaCategories = {
    A: "Estudios controlados no han demostrado riesgo. Estudios adecuados y bien controlados en mujeres embarazadas no han demostrado riesgo para el feto.",
    B: "No hay evidencia de riesgo en humanos. Estudios en animales no han mostrado riesgo fetal, pero no hay estudios adecuados en mujeres embarazadas; o los estudios en animales han mostrado un efecto adverso, pero estudios adecuados en mujeres embarazadas no han demostrado riesgo para el feto.",
    C: "Riesgo no puede ser descartado. Estudios en animales han mostrado efectos adversos en el feto y no hay estudios adecuados en humanos, pero los beneficios potenciales pueden justificar su uso en mujeres embarazadas a pesar de los riesgos potenciales.",
    D: "Evidencia positiva de riesgo. Hay evidencia de riesgo para el feto humano basado en datos de reacciones adversas, pero los beneficios potenciales pueden superar los riesgos en situaciones graves.",
    X: "Contraindicado en el embarazo. Estudios en animales o humanos han demostrado anormalidades fetales o hay evidencia de riesgo fetal basada en la experiencia humana, y los riesgos superan claramente cualquier posible beneficio."
  };

  // Función para buscar medicamentos usando Google Gemini (como lo hace Create)
  const searchWithGemini = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setGeminiResult(null);
    setStreamingResponse("");

    try {
      console.log("Consultando información sobre:", searchTerm);
      const response = await axios.post('/api/medications/gemini', {
        term: searchTerm
      });
      
      console.log("Respuesta recibida de Gemini:", response.data);
      
      if (response.data.sections) {
        setGeminiResult({
          name: response.data.medicationName,
          ...response.data.sections
        });
      } else {
        setError("No se pudo procesar la información recibida.");
      }
    } catch (error) {
      console.error("Error consultando a Gemini:", error);
      setError("Error al obtener información. Por favor, intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar en OpenFDA API a través de nuestro backend
  const searchWithFDA = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      // Consultar a nuestro propio backend, que a su vez consulta a la API de OpenFDA
      console.log("Buscando medicamento en FDA:", searchTerm);
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
  
  // Función principal de búsqueda que decide qué método usar
  const searchMedications = () => {
    if (activeTab === "gemini") {
      searchWithGemini();
    } else {
      searchWithFDA();
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
      <div className="py-4 px-4 sm:p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h2 className="text-lg sm:text-xl font-bold mb-1">Clasificación FDA de Medicamentos en el Embarazo</h2>
        <p className="text-xs sm:text-sm text-blue-100">
          Base de datos completa sobre la seguridad de medicamentos durante el embarazo
        </p>
      </div>
      
      <div className="p-4 sm:p-5">
        {/* Selector de métodos de búsqueda - Optimizado para móvil */}
        <div className="mb-6">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab("gemini")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === "gemini"
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">🧠</span>
                <span className="font-bold">Búsqueda IA</span>
                <span className="text-xs opacity-80">Análisis completo</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("fda")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === "fda"
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">🏥</span>
                <span className="font-bold">Base FDA</span>
                <span className="text-xs opacity-80">Datos oficiales</span>
              </div>
            </button>
          </div>
          
          {/* Descripción de la pestaña activa */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            {activeTab === "gemini" ? (
              <p className="text-sm text-blue-800">
                <strong>Búsqueda con IA:</strong> Análisis completo usando inteligencia artificial para obtener información detallada sobre medicamentos y embarazo.
              </p>
            ) : (
              <p className="text-sm text-blue-800">
                <strong>Base de datos FDA:</strong> Información oficial de la FDA (Administración de Alimentos y Medicamentos) sobre categorías de riesgo en el embarazo.
              </p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar medicamento (ej: paracetamol, ibuprofeno, aspirina...)"
                className="w-full p-4 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 text-base font-medium placeholder-gray-400 shadow-sm"
              />
              <svg 
                className="absolute left-4 top-4 h-6 w-6 text-gray-400" 
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
              className={`w-full py-4 rounded-xl text-white font-bold text-base transition-all duration-300 shadow-lg ${
                !searchTerm.trim() || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando medicamento...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">🔍</span>
                  Buscar información
                </span>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-100 border-2 border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3 mt-1">❌</span>
              <div>
                <h4 className="font-bold text-red-800 mb-1">Error en la búsqueda</h4>
                <p className="text-red-700 text-base">{error}</p>
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Resultados encontrados ({results.length})
            </h3>
            <div className="space-y-3">
              {results.map((med, index) => (
                <div 
                  key={index}
                  className="bg-white border-2 border-gray-100 rounded-xl p-4 cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-102"
                  onClick={() => handleSelectMedication(med)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-base mb-1 break-words">
                        {med.name}
                      </h4>
                      {med.description && (
                        <p className="text-sm text-gray-600 mb-2">{med.description}</p>
                      )}
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-${getCategoryColor(med.category)}`} 
                            style={{
                              backgroundColor: med.category === 'A' ? '#10B981' : 
                                             med.category === 'B' ? '#3B82F6' : 
                                             med.category === 'C' ? '#F59E0B' : 
                                             med.category === 'D' ? '#EF4444' : 
                                             med.category === 'X' ? '#DC2626' : '#6B7280',
                              color: 'white'
                            }}>
                        Categoría {med.category}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span className="mr-2">👆</span>
                    <span>Toca para ver información detallada</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resultados de búsqueda con Gemini */}
        {activeTab === "gemini" && geminiResult && !loading && (
          <div className="mt-6 bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-blue-100">
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">💊</span>
                <div>
                  <h3 className="text-xl font-bold">
                    {geminiResult.name || searchTerm}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Análisis completo con inteligencia artificial
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              {geminiResult.categoria && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3 mt-1">🏷️</span>
                    <div className="flex-1">
                      <h4 className="text-blue-900 font-bold text-lg mb-2">Categoría FDA</h4>
                      <p className="text-blue-800 text-base leading-relaxed">{geminiResult.categoria}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {geminiResult.descripcion && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-4 border-l-4 border-green-500">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3 mt-1">📝</span>
                    <div className="flex-1">
                      <h4 className="text-green-900 font-bold text-lg mb-2">Descripción del Medicamento</h4>
                      <p className="text-green-800 text-base leading-relaxed">{geminiResult.descripcion}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {geminiResult.riesgos && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-xl p-4 border-l-4 border-amber-500">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3 mt-1">⚠️</span>
                    <div className="flex-1">
                      <h4 className="text-amber-900 font-bold text-lg mb-2">Riesgos Potenciales</h4>
                      <p className="text-amber-800 text-base leading-relaxed">{geminiResult.riesgos}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {geminiResult.recomendaciones && (
                <div className="bg-gradient-to-r from-purple-50 to-violet-100 rounded-xl p-4 border-l-4 border-purple-500">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3 mt-1">💡</span>
                    <div className="flex-1">
                      <h4 className="text-purple-900 font-bold text-lg mb-2">Recomendaciones Médicas</h4>
                      <p className="text-purple-800 text-base leading-relaxed">{geminiResult.recomendaciones}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start">
                  <span className="text-xl mr-3 mt-1">⚕️</span>
                  <div>
                    <h5 className="font-bold text-gray-800 mb-2">Aviso Médico Importante</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Esta información es únicamente orientativa y no sustituye el consejo médico profesional.
                      Siempre consulte con su médico antes de tomar cualquier medicamento durante el embarazo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Mensajes de no resultados - Gemini */}
        {activeTab === "gemini" && !geminiResult && !loading && searchTerm !== "" && (
          <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl mb-6 border-2 border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontró información</h3>
            <p className="text-base text-gray-600 mb-4 px-4">
              No pudimos encontrar información específica sobre este medicamento.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
              <button 
                onClick={() => setActiveTab("fda")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Probar Base FDA
              </button>
              <button 
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Nueva búsqueda
              </button>
            </div>
          </div>
        )}
        
        {/* Resultados de búsqueda con FDA API */}
        {activeTab === "fda" && results.length === 0 && !loading && searchTerm !== "" && (
          <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl mb-6 border-2 border-gray-100">
            <div className="text-6xl mb-4">🏥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron resultados</h3>
            <p className="text-base text-gray-600 mb-4 px-4">
              La base de datos FDA no tiene información sobre este medicamento.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
              <button 
                onClick={() => setActiveTab("gemini")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Probar Búsqueda IA
              </button>
              <button 
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Nueva búsqueda
              </button>
            </div>
          </div>
        )}

        {activeTab === "fda" && results.length > 0 && (
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

        {activeTab === "fda" && selectedMedication && (
          <div className="mt-6 border rounded-lg overflow-hidden shadow-md animate-fadeIn">
            <div className="p-3 sm:p-4 bg-blue-50 border-b">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">{selectedMedication.name}</h3>
              {selectedMedication.description && (
                <p className="text-xs sm:text-sm text-gray-600">{selectedMedication.description}</p>
              )}
            </div>
            
            <div className="p-3 sm:p-5">
              <div className="flex items-center mb-4 sm:mb-5">
                <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-${getCategoryColor(selectedMedication.category)} flex items-center justify-center text-white font-bold text-sm sm:text-base`}>
                  {selectedMedication.category}
                </div>
                <div className="ml-3 sm:ml-4">
                  <h4 className="text-xs sm:text-sm text-gray-500 uppercase">Categoría FDA para embarazo</h4>
                  <p className="text-base sm:text-lg font-semibold">{getRiskLevel(selectedMedication.category)}</p>
                </div>
              </div>
              
              {selectedMedication.category && fdaCategories[selectedMedication.category.split('/')[0]] && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Descripción de la categoría</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">{fdaCategories[selectedMedication.category.split('/')[0]]}</p>
                </div>
              )}
              
              {selectedMedication.information && (
                <div className="mt-3 sm:mt-4">
                  <h4 className="font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Información sobre el embarazo</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">{selectedMedication.information}</p>
                </div>
              )}
              
              {selectedMedication.warnings && (
                <div className="mt-3 sm:mt-4">
                  <h4 className="font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Advertencias</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">{selectedMedication.warnings}</p>
                </div>
              )}
              
              {selectedMedication.recommendation && (
                <div className="mt-3 sm:mt-4">
                  <h4 className="font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Recomendaciones</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">{selectedMedication.recommendation}</p>
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
        
        {!searchTerm && !selectedMedication && !geminiResult && (
          <div className="mt-2">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Categorías FDA para Embarazo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(fdaCategories).map(([category, description]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2 font-bold text-white text-sm sm:text-base bg-${getCategoryColorByLetter(category)}`}>
                      {category}
                    </span>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {getRiskLevelByLetter(category)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
            
            <div className="mt-5 bg-blue-50 rounded-lg p-3 sm:p-4">
              <h4 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Base de datos de medicamentos</h4>
              <p className="text-xs sm:text-sm text-blue-700">
                Esta herramienta contiene información detallada sobre medicamentos y su clasificación durante
                el embarazo. Use la búsqueda inteligente para información completa o consulte la base de datos
                FDA para datos específicos de categorías.
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