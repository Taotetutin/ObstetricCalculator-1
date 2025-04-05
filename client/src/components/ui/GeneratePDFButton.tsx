import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
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
  label = "Generar PDF" 
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
      
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${fileName}.pdf`);
      
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Ocurrió un error al generar el PDF. Por favor, intente nuevamente.');
    }
  };

  return (
    <Button 
      onClick={generatePDF} 
      variant="outline" 
      size="sm"
      className="flex items-center gap-2"
    >
      <FileDown className="h-4 w-4" />
      {label}
    </Button>
  );
}