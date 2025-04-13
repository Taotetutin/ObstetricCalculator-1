import React from 'react';
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
  
  const generatePDF = async () => {
    const input = document.getElementById(contentId);
    
    if (!input) {
      console.error(`El elemento con ID '${contentId}' no fue encontrado`);
      return;
    }
    
    try {
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
      
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Ocurrió un error al generar el PDF. Por favor, intente nuevamente.');
    }
  };

  return (
    <ActionButton onClick={generatePDF} color="green">
      {label}
    </ActionButton>
  );
}