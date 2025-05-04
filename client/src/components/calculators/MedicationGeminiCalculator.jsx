import React from "react";

function MedicationGeminiCalculator() {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-lg p-2 bg-gradient-to-b from-blue-50 to-white">
      <div className="pb-4 w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">
          Clasificación FDA de Medicamentos en el Embarazo
        </h1>
        <p className="text-sm text-gray-600">
          Consulta la seguridad y clasificación de medicamentos durante el embarazo
        </p>
      </div>
      
      {/* El iframe está contenido dentro de un div que facilita el estilo y la integración */}
      <div className="w-full overflow-hidden rounded-lg shadow-inner bg-white">
        <iframe 
          style={{ width: "100%", border: "none" }} 
          height="600" 
          src="https://www.create.xyz/app/49190400-4ef8-43a0-b0b8-79905c73b738" 
          title="Calculadora de Medicamentos FDA" 
          frameBorder="0"
          className="bg-white"
        ></iframe>
      </div>
      
      <div className="mt-4 bg-blue-50 p-3 rounded-lg text-center">
        <p className="text-sm text-blue-700">
          <strong>Nota importante:</strong> Esta información es solo orientativa y no sustituye el consejo médico profesional.
          Consulte siempre con su médico sobre el uso de cualquier medicamento durante el embarazo.
        </p>
      </div>
    </div>
  );
}

export default MedicationGeminiCalculator;