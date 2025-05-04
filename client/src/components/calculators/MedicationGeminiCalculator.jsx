import React, { useState, useEffect } from "react";
import axios from "axios";

function MedicationGeminiCalculator() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedMed, setSelectedMed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Datos de la categoría FDA para embarazo
  const categories = {
    A: {
      description: "Estudios controlados no han demostrado riesgo para el feto en el primer trimestre de embarazo y no hay evidencia de riesgo en los trimestres posteriores.",
      recommendation: "Generalmente se considera seguro durante el embarazo."
    },
    B: {
      description: "Estudios en animales no han indicado riesgo para el feto, pero no hay estudios controlados en mujeres embarazadas; o estudios en animales han mostrado un efecto adverso, pero los estudios controlados en mujeres embarazadas no han demostrado riesgo para el feto.",
      recommendation: "Generalmente aceptable para uso durante el embarazo, pero siempre consulte con su médico."
    },
    C: {
      description: "Estudios en animales han mostrado un efecto adverso en el feto, pero no hay estudios controlados en mujeres embarazadas; o no hay estudios en animales ni en mujeres embarazadas.",
      recommendation: "Debe ser usado sólo si el beneficio potencial justifica el riesgo potencial para el feto. Consulte con su médico."
    },
    D: {
      description: "Hay evidencia de riesgo para el feto humano, pero los beneficios potenciales del uso durante el embarazo pueden ser aceptables a pesar del riesgo.",
      recommendation: "Usar solamente en situaciones graves o que amenazan la vida cuando no hay alternativas más seguras."
    },
    X: {
      description: "Estudios en animales o humanos han demostrado anormalidades fetales, o hay evidencia de riesgo fetal basado en la experiencia humana, o ambos, y el riesgo supera claramente cualquier posible beneficio.",
      recommendation: "Contraindicado en mujeres que están o pueden quedar embarazadas."
    },
    "N": {
      description: "La FDA ha implementado un nuevo sistema de etiquetado que reemplaza las categorías de embarazo (A, B, C, D, X) con información más descriptiva sobre los riesgos.",
      recommendation: "Consulte la información específica del medicamento y hable con su médico."
    }
  };

  // Función para buscar medicamentos en la API de la FDA
  const searchMedications = async (term) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setError("");
    setSearchPerformed(true);
    
    try {
      // Consultar la API del backend que se conecta con la FDA
      const response = await axios.get(`/api/medications/search?term=${encodeURIComponent(term)}`);
      
      if (response.data.medications && response.data.medications.length > 0) {
        setResults(response.data.medications.map(med => ({
          name: med.name,
          category: med.category,
          information: med.information,
          warnings: med.warnings,
          route: med.route,
          // Guardamos el objeto completo como data para usarlo cuando se seleccione
          data: med
        })));
      } else {
        // Si no hay resultados de la API de la FDA, buscamos en la base de datos local
        const localResults = searchLocalDatabase(term);
        
        if (localResults.length > 0) {
          setResults(localResults);
        } else {
          setResults([{
            name: `${term} (sin resultados detallados)`,
            key: "not_found"
          }]);
        }
      }
    } catch (err) {
      console.error("Error searching medications:", err);
      
      // Si hay un error con la API, intentamos con la base de datos local
      const localResults = searchLocalDatabase(term);
      
      if (localResults.length > 0) {
        setResults(localResults);
      } else {
        setError("Error al buscar medicamentos. Por favor, intente de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Base de datos local como respaldo
  const commonMeds = {
    "paracetamol": { name: "Paracetamol (Acetaminofén)", category: "B", risks: "Uso prolongado o en dosis altas puede estar asociado con algunos riesgos." },
    "ibuprofeno": { name: "Ibuprofeno", category: "C/D", risks: "Categoría C en el primer y segundo trimestre. Categoría D en el tercer trimestre. Puede causar cierre prematuro del conducto arterioso fetal." },
    "aspirina": { name: "Aspirina (Ácido acetilsalicílico)", category: "C/D", risks: "Categoría D en el tercer trimestre. Puede aumentar el riesgo de sangrado durante el parto." },
    "omeprazol": { name: "Omeprazol", category: "C", risks: "Datos limitados en humanos, pero no se han observado efectos adversos significativos." },
    "ranitidina": { name: "Ranitidina", category: "B", risks: "Se considera seguro para uso durante el embarazo basado en datos existentes." },
    "loratadina": { name: "Loratadina", category: "B", risks: "No se ha asociado con un aumento en los defectos de nacimiento." },
    "cetirizina": { name: "Cetirizina", category: "B", risks: "No se ha asociado con un aumento en malformaciones congénitas." },
    "amoxicilina": { name: "Amoxicilina", category: "B", risks: "Ampliamente usado durante el embarazo sin evidencia de efectos adversos." },
    "azitromicina": { name: "Azitromicina", category: "B", risks: "Datos limitados, pero generalmente considerado seguro para uso breve." },
    "levotiroxina": { name: "Levotiroxina", category: "A", risks: "Medicamento de reemplazo hormonal que es seguro durante el embarazo." },
    "metronidazol": { name: "Metronidazol", category: "B", risks: "Uso oral generalmente evitado en el primer trimestre si es posible." },
    "fluconazol": { name: "Fluconazol", category: "C/D", risks: "Dosis altas de fluconazol (≥400 mg/día) pueden estar asociadas con defectos congénitos." },
    "diazepam": { name: "Diazepam", category: "D", risks: "Puede causar labio leporino, paladar hendido o retraso en el desarrollo." },
    "lorazepam": { name: "Lorazepam", category: "D", risks: "Uso al final del embarazo puede resultar en síndrome de abstinencia en el recién nacido." },
    "sildenafil": { name: "Sildenafil (Viagra)", category: "B", risks: "Datos limitados, no usar a menos que sea claramente necesario." },
    "prednisona": { name: "Prednisona", category: "C", risks: "Puede aumentar el riesgo de labio leporino o paladar hendido en el primer trimestre." },
    "albuterol": { name: "Albuterol (Salbutamol)", category: "C", risks: "Beneficios generalmente superan los riesgos para el tratamiento del asma." },
    "difenhidramina": { name: "Difenhidramina (Benadryl)", category: "B", risks: "Generalmente seguro, pero puede causar somnolencia." },
    "insulina": { name: "Insulina", category: "B", risks: "Medicamento de elección para diabetes durante el embarazo." },
    "metformina": { name: "Metformina", category: "B", risks: "Puede ser usado para diabetes gestacional con supervisión." },
    "ciprofloxacino": { name: "Ciprofloxacino", category: "C", risks: "Evitar si es posible debido a los efectos sobre el cartílago en desarrollo." },
    "misoprostol": { name: "Misoprostol", category: "X", risks: "Contraindicado en el embarazo. Puede causar aborto, anomalías congénitas y ruptura uterina." },
    "warfarina": { name: "Warfarina", category: "X", risks: "Puede causar anomalías congénitas graves, especialmente en el primer trimestre." },
    "metilprednisolona": { name: "Metilprednisolona", category: "C", risks: "Similar a la prednisona. Use la menor dosis efectiva cuando sea necesario." }
  };

  // Función para buscar en la base de datos local
  const searchLocalDatabase = (term) => {
    const normalizedTerm = term.toLowerCase().trim();
    if (!normalizedTerm) return [];
    
    return Object.entries(commonMeds)
      .filter(([key, med]) => 
        key.includes(normalizedTerm) || 
        med.name.toLowerCase().includes(normalizedTerm)
      )
      .map(([key, med]) => ({
        name: med.name,
        key: key,
        isLocal: true
      }));
  };

  // Manejador para cuando se selecciona un medicamento
  const handleSelectMedication = (med) => {
    if (med.key === "not_found") {
      setSelectedMed({
        name: "Medicamento no encontrado",
        category: "N",
        risks: "No hay información disponible sobre este medicamento en nuestra base de datos."
      });
      return;
    }
    
    if (med.isLocal) {
      // Si es un medicamento de la base de datos local
      setSelectedMed(commonMeds[med.key]);
    } else {
      // Si es un medicamento de la API
      setSelectedMed({
        name: med.name,
        category: med.category || "N",
        risks: med.warnings || "No hay información específica sobre riesgos disponible.",
        information: med.information
      });
    }
  };

  // Función para obtener el color basado en la categoría
  const getCategoryColor = (category) => {
    const colorMap = {
      "A": "green",
      "B": "blue",
      "C": "yellow",
      "D": "orange",
      "X": "red",
      "N": "gray"
    };
    
    // Si la categoría es compuesta (como C/D), usamos el color más severo
    if (category && category.includes("/")) {
      const cats = category.split("/");
      const lastCat = cats[cats.length - 1];
      return colorMap[lastCat] || "gray";
    }
    
    return colorMap[category] || "gray";
  };

  // Función para ejecutar la búsqueda
  const handleSearch = () => {
    searchMedications(query);
  };

  // Manejo de la tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Clasificación FDA de Medicamentos en el Embarazo
        </h2>
        <p className="text-sm text-blue-100">
          Consulta la clasificación de seguridad de medicamentos según la FDA para su uso durante el embarazo
        </p>
      </div>
      
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar medicamento (ej: paracetamol, ibuprofeno)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className={`px-5 py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleSearch}
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <span className="inline-flex items-center">
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

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-5">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Resultados ({results.length})</h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {results.map((med, index) => (
                  <li 
                    key={index}
                    className="py-2 cursor-pointer hover:bg-blue-50 transition px-3 rounded"
                    onClick={() => handleSelectMedication(med)}
                  >
                    {med.name} {med.isLocal && <span className="text-xs text-blue-500 ml-1">(Base de datos local)</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {searchPerformed && results.length === 0 && !loading && (
          <div className="text-center p-6 bg-gray-50 rounded-lg mb-6">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No se encontraron resultados</h3>
            <p className="text-gray-600">Intente con otro término de búsqueda</p>
          </div>
        )}

        {selectedMed && (
          <div className="bg-white border rounded-xl overflow-hidden shadow transition-all duration-300 animate-fade-in">
            <div className="p-5 bg-blue-50 border-b">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                {selectedMed.name}
              </h3>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <h4 className="text-sm text-gray-500 uppercase mb-1">Categoría FDA para embarazo</h4>
                <div className="flex items-center">
                  <span 
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-full mr-3 font-bold text-white bg-${getCategoryColor(selectedMed.category)}-${selectedMed.category === 'X' ? '600' : '500'}`}
                  >
                    {selectedMed.category}
                  </span>
                  <span className="text-lg font-medium">
                    {selectedMed.category === 'A' ? 'Riesgo bajo' : 
                     selectedMed.category === 'B' ? 'Riesgo bajo a moderado' :
                     selectedMed.category === 'C' ? 'Riesgo moderado' :
                     selectedMed.category === 'D' ? 'Riesgo alto' :
                     selectedMed.category === 'X' ? 'Contraindicado' :
                     'Sin clasificación específica'}
                  </span>
                </div>
              </div>
              
              {categories[selectedMed.category?.split('/')[0]] && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Descripción de la categoría</h4>
                  <p className="text-gray-700 mb-3">{categories[selectedMed.category.split('/')[0]].description}</p>
                  <h4 className="font-medium text-gray-800 mb-2">Recomendación general</h4>
                  <p className="text-gray-700">{categories[selectedMed.category.split('/')[0]].recommendation}</p>
                </div>
              )}
              
              {selectedMed.information && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Información sobre embarazo</h4>
                  <p className="text-gray-700">{selectedMed.information}</p>
                </div>
              )}
              
              {selectedMed.risks && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Advertencias y riesgos potenciales</h4>
                  <p className="text-gray-700">{selectedMed.risks}</p>
                </div>
              )}
              
              <div className="mt-6 p-4 border-t pt-4">
                <p className="text-sm text-gray-500 italic">
                  Esta información es meramente orientativa y no sustituye el consejo médico profesional. Consulte siempre con su médico antes de tomar cualquier medicamento durante el embarazo.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Acerca de las categorías FDA para embarazo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.entries(categories).slice(0, 5).map(([cat, info]) => (
              <div key={cat} className={`p-4 rounded-lg bg-${getCategoryColor(cat)}-100 border border-${getCategoryColor(cat)}-200`}>
                <div className="flex items-center mb-2">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-2 text-sm font-bold text-white bg-${getCategoryColor(cat)}-500`}>
                    {cat}
                  </span>
                  <span className="font-medium text-gray-800">
                    {cat === 'A' ? 'Riesgo bajo' : 
                     cat === 'B' ? 'Riesgo bajo a moderado' :
                     cat === 'C' ? 'Riesgo moderado' :
                     cat === 'D' ? 'Riesgo alto' :
                     cat === 'X' ? 'Contraindicado' : 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-gray-700">{info.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default MedicationGeminiCalculator;