import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Pill, AlertTriangle, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface GeminiResult {
  name: string;
  category?: string;
  risks?: string;
  recommendations?: string;
  alternatives?: string;
  description?: string;
}

export default function MedicationGeminiCalculator() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geminiResult, setGeminiResult] = useState<GeminiResult | null>(null);

  const searchWithGemini = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setGeminiResult(null);

    try {
      const response = await apiRequest("POST", "/api/medications/gemini", {
        term: searchTerm
      });
      
      const data = await response.json();
      
      if (data.sections) {
        setGeminiResult({
          name: data.medicationName || searchTerm,
          category: data.sections.categoria,
          description: data.sections.descripcion,
          risks: data.sections.riesgos,
          recommendations: data.sections.recomendaciones,
          alternatives: data.sections.alternativas
        });
      } else {
        setError("No se pudo procesar la información recibida.");
      }
    } catch (error) {
      console.error("Error consultando medicamento:", error);
      setError("Error al obtener información. Por favor, intente de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchWithGemini();
    }
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-800";
    
    const categoryLetter = category.charAt(0).toUpperCase();
    switch (categoryLetter) {
      case 'A':
        return "bg-green-100 text-green-800";
      case 'B':
        return "bg-blue-100 text-blue-800";
      case 'C':
        return "bg-yellow-100 text-yellow-800";
      case 'D':
        return "bg-orange-100 text-orange-800";
      case 'X':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category?: string) => {
    if (!category) return <Pill className="h-4 w-4" />;
    
    const categoryLetter = category.charAt(0).toUpperCase();
    if (categoryLetter === 'A' || categoryLetter === 'B') {
      return <CheckCircle className="h-4 w-4" />;
    } else if (categoryLetter === 'D' || categoryLetter === 'X') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Pill className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-blue-800 flex items-center justify-center gap-2">
            <Pill className="h-6 w-6" />
            Consulta de Medicamentos en Embarazo
          </CardTitle>
          <p className="text-center text-gray-600">
            Consulta información sobre la seguridad de medicamentos durante el embarazo
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Ingrese el nombre del medicamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={searchWithGemini}
              disabled={loading || !searchTerm.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? "Consultando..." : "Buscar"}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {geminiResult && (
            <div className="space-y-4">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-blue-800">
                      {geminiResult.name}
                    </CardTitle>
                    {geminiResult.category && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getCategoryColor(geminiResult.category)}`}>
                        {getCategoryIcon(geminiResult.category)}
                        Categoría FDA: {geminiResult.category}
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {geminiResult.description && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Descripción</h4>
                      <p className="text-gray-700">{geminiResult.description}</p>
                    </div>
                  )}

                  {geminiResult.risks && (
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Riesgos y Precauciones
                      </h4>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700">{geminiResult.risks}</p>
                      </div>
                    </div>
                  )}

                  {geminiResult.recommendations && (
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Recomendaciones
                      </h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-blue-700">{geminiResult.recommendations}</p>
                      </div>
                    </div>
                  )}

                  {geminiResult.alternatives && (
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Alternativas Sugeridas</h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-700">{geminiResult.alternatives}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">
              Información Importante
            </h4>
            <p className="text-sm text-amber-700">
              Esta información es solo para referencia educativa. Siempre consulte con un profesional 
              de la salud antes de tomar cualquier medicamento durante el embarazo. Cada caso es único 
              y requiere evaluación médica individual.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}