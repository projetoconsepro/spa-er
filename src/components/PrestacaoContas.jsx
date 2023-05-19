import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '../util/logoconseproof2.png';

const PrestacaoContas = () => {
  const gerarPdf = () => {
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const doc = new jsPDF({ orientation: 'landscape' });

    const header = () => {
      const logoWidth = 30;
      const logoHeight = 12;
      const logoPositionX = doc.internal.pageSize.width - 15 - logoWidth;
      const logoPositionY = 6;
      doc.addImage(Logo, 'PNG', logoPositionX, logoPositionY, logoWidth, logoHeight);

      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text('Relatório de Prestação de Contas', 3.5, 10);
      doc.setFontSize(10);
      doc.setTextColor(100);
      const dateNow = new Date();
      const day = dateNow.getDate().toString().padStart(2, '0');
      const month = (dateNow.getMonth() + 1).toString().padStart(2, '0');
      const year = dateNow.getFullYear().toString();
      const hour = dateNow.getHours().toString().padStart(2, '0');
      const minute = dateNow.getMinutes().toString().padStart(2, '0');
      const formattedDate = `${day}/${month}/${year} ${hour}:${minute}`;
      doc.text(`Gerado por: ${user2.nome}`, 3.5, 18);
      doc.text(`Data: ${formattedDate}`, 3.5, 23);
    };

    header();

    const regularizacaoData = [
      ['', { content: 'Regularização', colSpan: 4 },{ content: 'Tickets', colSpan: 4 }, { content: 'Recarga', colSpan: 4 }, { content: 'Regularização', colSpan: 4}, { content: 'Total arrecadado', colSpan: 4 },],
      ['', 'Quant' ,'Din', 'Pix', 'Total', 'Quant' , 'Din', 'Pix', 'Total' , 'Quant' , 'Din', 'Pix', 'Total' , 'Quant' , 'Din', 'Pix', 'Total' , 'Quant' , 'Din', 'Pix', 'Total'],
      [{ content: 'Monitor - PDT', colSpan: 21 }],
      ['Pedroca', '1295', '6.100,00 ', '20,00', '120,00',  '1295', '6.100,00 ', '20,00', '120,00', '1295', '6.100,00 ', '20,00', '120,00', '1295', '6.100,00 ', '20,00', '120,00',' 5000','24.400,00', '20,00', '120,00'],
      ['Murilo', '1295', '6.100,00 ', '20,00', '120,00',  '1295', '6.100,00 ', '20,00', '120,00', '1295', '6.100,00 ', '20,00', '120,00', '1295', '6.100,00 ', '20,00', '120,00', ' 5000','24.400,00', '20,00', '120,00'],
      ['Total', '2509', '120.200,00', '40,00', '240,00', '2509', '120.200,00', '40,00', '240,00' , '2509', '120.200,00', '40,00', '240,00' , '2509', '120.200,00', '40,00', '240,00' , '2509', '120.200,00', '40,00', '240,00' ],
      [{ content: 'Aplicativo', colSpan: 21}],
      ['Pedroca', '1295', '6.100,00 ', '20,00', '120,00',  '1295', '6.100,00 ', '20,00', '120,00', '1295', '6.100,00 ', '20,00', '120,00', '1295', '6.100,00 ', '20,00', '120,00', ' 5000','24.400,00', '20,00', '120,00'],
      ['Murilo', '1295', '6.100,00 ', '20,00', '120,00',  '1295', '6.100,00 ', '20,00', '120,00', '1295', '6.100,00 ', '20,00', '120,00', '1295', '6.100,00 ', '20,00', '120,00', ' 5000','24.400,00', '20,00', '120,00'],
      ['Total', '2509', '120.200,00', '40,00', '240,00', '2509', '120.200,00', '40,00', '240,00' , '2509', '120.200,00', '40,00', '240,00' , '2509', '120.200,00', '40,00', '240,00' , '2509', '120.200,00', '40,00', '240,00' ],    
    ];

    const columnStyles = {
      0: { cellWidth: 15 },
      1: { cellWidth: 10 },
      2: { cellWidth: 15 },
      3: { cellWidth: 15 },
      4: { cellWidth: 15 },
      5: { cellWidth: 10 },
      6: { cellWidth: 15 },
      7: { cellWidth: 15 },
      8: { cellWidth: 15 },
      9: { cellWidth: 10  },
      10: { cellWidth: 15 },
      11: { cellWidth: 15 },
      12: { cellWidth: 15 },
      13: { cellWidth: 10 },
      14: { cellWidth: 15 },
      15: { cellWidth: 15 },
      16: { cellWidth: 15 },
      17: { cellWidth: 10  },
      18: { cellWidth: 15 },
      19: { cellWidth: 15 },
      20: { cellWidth: 15 },
    };

    const headStyles = {
      fillColor: [204, 204, 204], 
      textColor: [255, 255, 255], 
      fontStyle: 'bold', 
      lineWidth: 0.5, 
      lineColor: [0, 0, 0],
    };

    
    
    doc.autoTable({
      head: [regularizacaoData[0]],
      body: regularizacaoData.slice(1),
      startY: 30,
      theme: 'grid',
      margin: { left: 3.5, right: 3.5},
      columnStyles: columnStyles,
      headStyles: headStyles,
      styles: {
        fontSize: 6.7, 
      },
      didParseCell: (data) => {
        const rowIndex = data.row.index;
        if (rowIndex === 4 || rowIndex === 8) { // VARIAVEL QUE DEFINE A LINHA
          const columnCount = data.table.columns.length;

          for (let i = 0; i < columnCount; i++) {
            const cell = data.row.cells[i];
            cell.styles.fontStyle = 'bold';
          }
        }
      },
    });

    const totalPages = doc.internal.getNumberOfPages(); // Obtém o total de páginas

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      const text = `Página ${i} / ${totalPages}`;
      const textWidth = doc.getTextWidth(text);
      const textX = (doc.internal.pageSize.width - textWidth) / 2;
      const textY = doc.internal.pageSize.height - 3;
      
      doc.text(text, textX, textY);
    }

    doc.save('Relatório de Prestação de Contas.pdf');
  };

  useEffect(() => {}, []);

  return (
    <button onClick={() => gerarPdf()}>
      Gerar PDF
    </button>
  );
};

export default PrestacaoContas;
