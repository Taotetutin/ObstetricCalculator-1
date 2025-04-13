import React, { useState } from 'react';
import { ActionButton } from '@/components/ui/action-button';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface GeneratePDFButtonProps {
  contentId: string;
  fileName: string;
  label?: string;
}

export default function GeneratePDFButton({ 
  contentId, 
  fileName, 
  label = "📄 GENERAR INFORME PDF" 
}: GeneratePDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePDF = async () => {
    const input = document.getElementById(contentId);
    
    if (!input) {
      console.error(`El elemento con ID '${contentId}' no fue encontrado`);
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Añadir una clase temporal para mejorar el estilo de impresión
      input.classList.add('pdf-export');
      
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      // Remover la clase temporal
      input.classList.remove('pdf-export');
      
      const imgData = canvas.toDataURL('image/png');
      
      // Determinar la orientación en función del ancho/alto
      const orientation = canvas.width > canvas.height ? 'l' : 'p';
      
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
      });
      
      // Añadir título y fecha al PDF
      pdf.setFontSize(18);
      pdf.setTextColor(0, 60, 143);
      pdf.text('Informe Médico Obsterix', pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      
      // Añadir fecha
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const date = new Date().toLocaleDateString('es-ES');
      pdf.text(`Fecha: ${date}`, pdf.internal.pageSize.getWidth() - 20, 25, { align: 'right' });
      
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Ajustar posición Y para dejar espacio para el título
      pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);
      pdf.save(`${fileName}.pdf`);
      
      // Después de un momento, quitar el estado de generación
      setTimeout(() => {
        setIsGenerating(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Ocurrió un error al generar el PDF. Por favor, intente nuevamente.');
      setIsGenerating(false);
    }
  };

  return (
    <ActionButton 
      onClick={generatePDF} 
      color="green"
      className={isGenerating ? 'relative overflow-hidden' : ''}
    >
      <div className="flex items-center justify-center">
        {isGenerating ? (
          <>
            <span className="inline-block relative mr-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span>GENERANDO INFORME...</span>
          </>
        ) : (
          <>
            <span className="mr-2">📄</span>
            <span>GENERAR INFORME PDF</span>
          </>
        )}
      </div>
      
      {/* Animación de progreso */}
      {isGenerating && (
        <div className="absolute bottom-0 left-0 h-1 bg-white" style={{
          width: '100%',
          animation: 'progress-animation 1.5s ease-in-out infinite'
        }}></div>
      )}
    </ActionButton>
  );
}