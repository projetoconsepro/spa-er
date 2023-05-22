import axios from 'axios';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '../util/logoconseproof2.png';

const PrestacaoContas = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);


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
      ['', { content: 'Regularização', colSpan: 4 },{ content: 'Estacionamento', colSpan: 4 }, { content: 'Recarga', colSpan: 4 }, { content: 'Regularização', colSpan: 4}, { content: 'Total arrecadado', colSpan: 4 },],
      ['', 'Quant' ,'Din', 'Pix', 'Total', 'Quant' , 'Din', 'Pix', 'Total' , 'Quant' , 'Din', 'Pix', 'Total' , 'Quant' , 'Din', 'Pix', 'Total' , 'Quant' , 'Din', 'Pix', 'Total'],
      
    ];

    const formatNumero = (numero) => {
      if (Number.isInteger(numero)) {
        return numero + ',00';
      } else {
        return numero.toString();
      }
    };

    regularizacaoData.push([{ content: 'Monitor', colSpan: 21 }]);
    data[0].monitor.map((item) => {
      if(item.Regularizacao !== undefined){
      regularizacaoData.push(
        [item.nome.length > 11 ? item.nome.substring(0, item.nome.indexOf(' ')) + ' ' + item.nome.split(' ')[1].charAt(0) + '.' : item.nome <= 11 ? item.nome.substring(0, 8) : item.nome.substring(0, 11),
        item.Regularizacao.quantidade,
        formatNumero(item.Regularizacao.dinheiro),
        formatNumero(item.Regularizacao.pix),
        formatNumero(item.Regularizacao.TotalValor),
        item.estacionamento.quantidade,
        formatNumero(item.estacionamento.dinheiro),
        formatNumero(item.estacionamento.pix),
        formatNumero(item.estacionamento.TotalValor),
        item.creditosInseridos.quantidade,
        formatNumero(item.creditosInseridos.dinheiro),
        formatNumero(item.creditosInseridos.pix),
        formatNumero(item.creditosInseridos.TotalValor),
        ]);
      }
      else {
        regularizacaoData.push(
          ['Total',
          item.total.Regularizacao.quantidade,
          formatNumero(item.total.Regularizacao.dinheiro),
          formatNumero(item.total.Regularizacao.pix),
          formatNumero(item.total.Regularizacao.TotalValor),
          item.total.estacionamento.quantidade,
          formatNumero(item.total.estacionamento.dinheiro),
          formatNumero(item.total.estacionamento.pix),
          formatNumero(item.total.estacionamento.TotalValor),
          item.total.creditosInseridos.quantidade,
          formatNumero(item.total.creditosInseridos.dinheiro),
          formatNumero(item.total.creditosInseridos.pix),
          formatNumero(item.total.creditosInseridos.TotalValor),
          ]);

      }
    });
    const BoldCol = regularizacaoData.length -2;

    regularizacaoData.push([{ content: 'Parceiro', colSpan: 21 }]);
    data[0].parceiro.map((item) => {
      if(item.Regularizacao !== undefined){
      regularizacaoData.push(
        [item.nome.length > 11 ? item.nome.substring(0, item.nome.indexOf(' ')) + ' ' + item.nome.split(' ')[1].charAt(0) + '.' : item.nome,
        item.Regularizacao.quantidade,
        formatNumero(item.Regularizacao.dinheiro),
        formatNumero(item.Regularizacao.pix),
        formatNumero(item.Regularizacao.TotalValor),
        item.estacionamento.quantidade,
        formatNumero(item.estacionamento.dinheiro),
        formatNumero(item.estacionamento.pix),
        formatNumero(item.estacionamento.TotalValor),
        item.creditosInseridos.quantidade,
        formatNumero(item.creditosInseridos.dinheiro),
        formatNumero(item.creditosInseridos.pix),
        formatNumero(item.creditosInseridos.TotalValor),
        ]);
      }
      else {
        regularizacaoData.push(
          ['Total',
          item.total.Regularizacao.quantidade,
          formatNumero(item.total.Regularizacao.dinheiro),
          formatNumero(item.total.Regularizacao.pix),
          formatNumero(item.total.Regularizacao.TotalValor),
          item.total.estacionamento.quantidade,
          formatNumero(item.total.estacionamento.dinheiro),
          formatNumero(item.total.estacionamento.pix),
          formatNumero(item.total.estacionamento.TotalValor),
          item.total.creditosInseridos.quantidade,
          formatNumero(item.total.creditosInseridos.dinheiro),
          formatNumero(item.total.creditosInseridos.pix),
          formatNumero(item.total.creditosInseridos.TotalValor),
          ])
      }
    });
    const BoldLine = regularizacaoData.length - 2 ;

    console.log(data[0].aplicativo)
    regularizacaoData.push([{ content: 'Aplicativo', colSpan: 21 }]);
    data[0].aplicativo.map((item) => {
      if(item.Regularizacao !== undefined){
      }
      else {
        regularizacaoData.push(
          ['Total',
          item.total.Regularizacao.quantidade,
          formatNumero(item.total.Regularizacao.dinheiro),
          formatNumero(item.total.Regularizacao.pix),
          formatNumero(item.total.Regularizacao.TotalValor),
          item.total.estacionamento.quantidade,
          formatNumero(item.total.estacionamento.dinheiro),
          formatNumero(item.total.estacionamento.pix),
          formatNumero(item.total.estacionamento.TotalValor),
          item.total.creditosInseridos.quantidade,
          formatNumero(item.total.creditosInseridos.dinheiro),
          formatNumero(item.total.creditosInseridos.pix),
          formatNumero(item.total.creditosInseridos.TotalValor),
          ])
      }
    });


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
      fillColor: [255, 255, 255], 
      textColor: [0, 0, 0], 
      fontStyle: 'bold', 
      lineWidth: 0.1, 
      lineColor: [0, 0, 0],
      halign: 'center'
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
        const rowIndex = data.row ? data.row.index : null;
        if (rowIndex === BoldCol || rowIndex === BoldLine || rowIndex === BoldCol + 1 || rowIndex === 0 || rowIndex === 1) { 
        const columnCount = data.table.columns.length;

        for (let i = 0; i < columnCount; i++) {
          const cell = data.row.cells[i];
          if (cell && cell.styles) {
            cell.styles.fontStyle = 'bold';
        }
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
          'token': token,
          'id_usuario': user2.id_usuario,
          'perfil_usuario': "admin"
      }
  });

  requisicao.get('/financeiro/admin').then((res) => {
    console.log(res.data.data);
    setData(res.data.data);
  }).catch((err) => {
    console.log(err);
  });


  }, []);

  return (
    <button onClick={() => gerarPdf()}>
      Gerar PDF
    </button>
  );
};

export default PrestacaoContas;
