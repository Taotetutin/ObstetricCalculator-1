import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PRCalculator() {
  const [edad, setEdad] = useState({
    semanas: '',
    dias: ''
  });
  const [intervaloPR, setIntervaloPR] = useState('');
  const [resultado, setResultado] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const semanas = parseInt(edad.semanas, 10);
    const dias = parseInt(edad.dias, 10);
    const pr = parseFloat(intervaloPR);

    // Basic validation.  More robust validation could be added.
    if (isNaN(semanas) || isNaN(dias) || isNaN(pr) || semanas < 16 || semanas > 38 || dias < 0 || dias > 6 || pr <=0){
        setResultado({percentil: "Error", interpretacion: "Por favor, introduce datos válidos."});
        return;
    }

    // Cálculo de percentiles basado en la gráfica (Placeholder - needs actual logic)
    let percentil = "50"; // Replace with actual calculation based on semanas, dias, and pr
    let interpretacion = "Normal"; // Replace with actual interpretation based on percentil

    setResultado({ percentil, interpretacion });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">
        Calculadora PR Fetal
      </h1>

      <div className="mb-8">
        <img 
          src="/pr-graph.jpg" 
          alt="Gráfico de percentiles PR"
          className="mx-auto max-w-full h-auto"
        />
        <div className="text-center text-sm mt-2">
          <span className="text-yellow-600">—— Percentil 50</span>
          <span className="ml-4 text-cyan-600">—— Percentil 95</span>
          <span className="ml-4 text-purple-600">—— Percentil 99</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Edad Gestacional:</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Semanas</label>
              <Input
                type="number"
                value={edad.semanas}
                onChange={(e) => setEdad(prev => ({ ...prev, semanas: e.target.value }))}
                className="mt-1"
                placeholder="Semanas"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Días</label>
              <Input
                type="number"
                value={edad.dias}
                onChange={(e) => setEdad(prev => ({ ...prev, dias: e.target.value }))}
                className="mt-1"
                placeholder="Días"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Intervalo PR Medido (ms):
          </label>
          <Input
            type="number"
            value={intervaloPR}
            onChange={(e) => setIntervaloPR(e.target.value)}
            className="w-full"
            placeholder="Intervalo PR en milisegundos"
          />
        </div>

        <Button 
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Calcular Percentiles
        </Button>
      </form>

      {resultado && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg max-w-md mx-auto">
          <h3 className="font-semibold mb-2">Resultado:</h3>
          <p>Percentil: {resultado.percentil}</p>
          <p>Interpretación: {resultado.interpretacion}</p>
        </div>
      )}
    </div>
  );
}