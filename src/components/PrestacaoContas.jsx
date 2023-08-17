import axios from 'axios';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Logo from '../util/logoconseproof2.png';
import VoltarComponente from '../util/VoltarComponente';
import { FaPowerOff } from 'react-icons/fa';
import { AiFillPrinter } from 'react-icons/ai';
import CarroLoading from '../components/Carregamento';
import Filtro from '../util/Filtro';
import createAPI from '../services/createAPI';

const PrestacaoContas = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [dataHoje, setDataHoje] = useState('');


  function formatNumero(number) {
    return new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(number);
  }
  

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

    header()

    const regularizacaoData = [
      ['', { content: 'Regularização', colSpan: 4 },{ content: 'Estacionamento', colSpan: 4 }, { content: 'Recarga', colSpan: 4 }, { content: 'Total arrecadado', colSpan: 3 },],
      ['', 'Quant' ,'Din', 'Pix', 'Total', 'Quant' , 'Din', 'Pix', 'Total' , 'Quant' , 'Din', 'Pix', 'Total' , 'Din', 'Pix', 'Total'],
      
    ];

    const formatNumero = (numero) => {
      if (Number.isInteger(numero)) {
        return numero + ',00';
      } else {
        return numero.toString();
      }
    };

    regularizacaoData.push([{ content: 'MONITOR', colSpan: 21 }]);

    console.log(data[0].monitor)
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
        formatNumero(item.finalTotal.dinheiro),
        formatNumero(item.finalTotal.pix),
        formatNumero(item.finalTotal.TotalValor),
        ]);
      }
      else {
        console.log('creito', item.total.creditosInseridos)
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
          formatNumero(item.total.finalTotal.dinheiro),
          formatNumero(item.total.finalTotal.pix),
          formatNumero(item.total.finalTotal.TotalValor),
          ]);

      }
    });
    const BoldCol = regularizacaoData.length -2;

    regularizacaoData.push([{ content: 'PARCEIRO', colSpan: 21 }]);
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
        formatNumero(item.finalTotal.dinheiro),
        formatNumero(item.finalTotal.pix),
        formatNumero(item.finalTotal.TotalValor),
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
          formatNumero(item.total.finalTotal.dinheiro),
          formatNumero(item.total.finalTotal.pix),
          formatNumero(item.total.finalTotal.TotalValor),
          ])
      }
    });

    const BoldLine = regularizacaoData.length - 2 ;

    console.log(data[0].aplicativo)
    regularizacaoData.push([{ content: 'Clientes APP  ', colSpan: 21 }]);
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
          formatNumero(item.total.finalTotal.dinheiro),
          formatNumero(item.total.finalTotal.pix),
          formatNumero(item.total.finalTotal.TotalValor),
          ])
      }
    });

    console.log(data[0].avulso)
    regularizacaoData.push([{ content: 'AVULSO', colSpan: 21 }]);
    data[0].avulso.map((item) => {
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
          formatNumero(item.total.finalTotal.dinheiro),
          formatNumero(item.total.finalTotal.pix),
          formatNumero(item.total.finalTotal.TotalValor),
          ])
      }
    });

    console.log(data[0].chatbot)
    regularizacaoData.push([{ content: 'CHATBOT', colSpan: 21 }]);
    data[0].chatbot.map((item) => {
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
          formatNumero(item.total.finalTotal.dinheiro),
          formatNumero(item.total.finalTotal.pix),
          formatNumero(item.total.finalTotal.TotalValor),
          ])
      }
    });

    regularizacaoData.push([{ content: 'TOTAL GERAL', colSpan: 21 }]);

    const iParceiro = data[0].parceiro.length - 1;
    const iMonitor = data[0].monitor.length - 1;
    const iAplicativo = data[0].aplicativo.length - 1;
    const iAvulso = data[0].avulso.length - 1;
    const iChatbot = data[0].chatbot.length - 1;

    regularizacaoData.push(
      ['Total',
      data[0].parceiro[iParceiro].total.Regularizacao.quantidade 
      + data[0].monitor[iMonitor].total.Regularizacao.quantidade 
      + data[0].aplicativo[iAplicativo].total.Regularizacao.quantidade
      + data[0].avulso[iAvulso].total.Regularizacao.quantidade
      + data[0].chatbot[iChatbot].total.Regularizacao.quantidade,
      formatNumero(data[0].parceiro[iParceiro].total.Regularizacao.dinheiro
      + data[0].monitor[iMonitor].total.Regularizacao.dinheiro
      + data[0].aplicativo[iAplicativo].total.Regularizacao.dinheiro
      + data[0].avulso[iAvulso].total.Regularizacao.dinheiro
      + data[0].chatbot[iChatbot].total.Regularizacao.dinheiro),
      formatNumero(data[0].parceiro[iParceiro].total.Regularizacao.pix
      + data[0].monitor[iMonitor].total.Regularizacao.pix
      + data[0].aplicativo[iAplicativo].total.Regularizacao.pix
      + data[0].avulso[iAvulso].total.Regularizacao.pix
      + data[0].chatbot[iChatbot].total.Regularizacao.pix),
      formatNumero(data[0].parceiro[iParceiro].total.Regularizacao.TotalValor
      + data[0].monitor[iMonitor].total.Regularizacao.TotalValor
      + data[0].aplicativo[iAplicativo].total.Regularizacao.TotalValor
      + data[0].avulso[iAvulso].total.Regularizacao.TotalValor
      + data[0].chatbot[iChatbot].total.Regularizacao.TotalValor),
      data[0].parceiro[iParceiro].total.estacionamento.quantidade 
      + data[0].monitor[iMonitor].total.estacionamento.quantidade 
      + data[0].aplicativo[iAplicativo].total.estacionamento.quantidade
      + data[0].avulso[iAvulso].total.estacionamento.quantidade
      + data[0].chatbot[iChatbot].total.estacionamento.quantidade,
      formatNumero(data[0].parceiro[iParceiro].total.estacionamento.dinheiro
      + data[0].monitor[iMonitor].total.estacionamento.dinheiro
      + data[0].aplicativo[iAplicativo].total.estacionamento.dinheiro
      + data[0].avulso[iAvulso].total.estacionamento.dinheiro
      + data[0].chatbot[iChatbot].total.estacionamento.dinheiro),
      formatNumero(data[0].parceiro[iParceiro].total.estacionamento.pix
      + data[0].monitor[iMonitor].total.estacionamento.pix
      + data[0].aplicativo[iAplicativo].total.estacionamento.pix
      + data[0].avulso[iAvulso].total.estacionamento.pix
      + data[0].chatbot[iChatbot].total.estacionamento.pix),
      formatNumero(data[0].parceiro[iParceiro].total.estacionamento.TotalValor
      + data[0].monitor[iMonitor].total.estacionamento.TotalValor
      + data[0].aplicativo[iAplicativo].total.estacionamento.TotalValor
      + data[0].avulso[iAvulso].total.estacionamento.TotalValor
      + data[0].chatbot[iChatbot].total.estacionamento.TotalValor),
      data[0].parceiro[iParceiro].total.creditosInseridos.quantidade 
      + data[0].monitor[iMonitor].total.creditosInseridos.quantidade 
      + data[0].aplicativo[iAplicativo].total.creditosInseridos.quantidade
      + data[0].avulso[iAvulso].total.creditosInseridos.quantidade
      + data[0].chatbot[iChatbot].total.creditosInseridos.quantidade,
      formatNumero(data[0].parceiro[iParceiro].total.creditosInseridos.dinheiro
      + data[0].monitor[iMonitor].total.creditosInseridos.dinheiro
      + data[0].aplicativo[iAplicativo].total.creditosInseridos.dinheiro
      + data[0].avulso[iAvulso].total.creditosInseridos.dinheiro
      + data[0].chatbot[iChatbot].total.creditosInseridos.dinheiro),
      formatNumero(data[0].parceiro[iParceiro].total.creditosInseridos.pix
      + data[0].monitor[iMonitor].total.creditosInseridos.pix
      + data[0].aplicativo[iAplicativo].total.creditosInseridos.pix
      + data[0].avulso[iAvulso].total.creditosInseridos.pix
      + data[0].chatbot[iChatbot].total.creditosInseridos.pix),
      formatNumero(data[0].parceiro[iParceiro].total.creditosInseridos.TotalValor
      + data[0].monitor[iMonitor].total.creditosInseridos.TotalValor
      + data[0].aplicativo[iAplicativo].total.creditosInseridos.TotalValor
      + data[0].avulso[iAvulso].total.creditosInseridos.TotalValor
      + data[0].chatbot[iChatbot].total.creditosInseridos.TotalValor),
      formatNumero(data[0].parceiro[iParceiro].total.finalTotal.dinheiro
      + data[0].monitor[iMonitor].total.finalTotal.dinheiro
      + data[0].aplicativo[iAplicativo].total.finalTotal.dinheiro
      + data[0].avulso[iAvulso].total.finalTotal.dinheiro
      + data[0].chatbot[iChatbot].total.finalTotal.dinheiro),
      formatNumero(data[0].parceiro[iParceiro].total.finalTotal.pix
      + data[0].monitor[iMonitor].total.finalTotal.pix
      + data[0].aplicativo[iAplicativo].total.finalTotal.pix
      + data[0].avulso[iAvulso].total.finalTotal.pix
      + data[0].chatbot[iChatbot].total.finalTotal.pix),
      formatNumero(data[0].parceiro[iParceiro].total.finalTotal.TotalValor
      + data[0].monitor[iMonitor].total.finalTotal.TotalValor
      + data[0].aplicativo[iAplicativo].total.finalTotal.TotalValor
      + data[0].avulso[iAvulso].total.finalTotal.TotalValor
      + data[0].chatbot[iChatbot].total.finalTotal.TotalValor),
      ]);

    const columnStyles = {
      0: { cellWidth: 18 },
      1: { cellWidth: 14 },
      2: { cellWidth: 18 },
      3: { cellWidth: 18 },
      4: { cellWidth: 18 },
      5: { cellWidth: 14 },
      6: { cellWidth: 18 },
      7: { cellWidth: 18 },
      8: { cellWidth: 18 },
      9: { cellWidth: 14  },
      10: { cellWidth: 18 },
      11: { cellWidth: 18 },
      12: { cellWidth: 18 },
      13: { cellWidth: 14 },
      14: { cellWidth: 18 },
      15: { cellWidth: 18 },
      16: { cellWidth: 18 },
      17: { cellWidth: 14  },
      18: { cellWidth: 18 },
      19: { cellWidth: 18 },
      20: { cellWidth: 18 },
    };

    let headStyles = {
      fillColor: [255, 255, 255], 
      textColor: [0, 0, 0], 
      fontStyle: 'bold', 
      lineWidth: 0.1, 
      lineColor: [0, 0, 0],
      halign: 'center'
    }

    
    
    doc.autoTable({
      head: [regularizacaoData[0]],
      body: regularizacaoData.slice(1),
      startY: 30,
      theme: 'grid',
      margin: { left: 3.5, right: 3.5},
      columnStyles: columnStyles,
      headStyles: headStyles,
      styles: {
        fontSize: 7, 
      },
      didParseCell: (data) => {
        const rowIndex = data.row ? data.row.index : null;
        if (rowIndex === BoldCol || rowIndex === BoldLine || rowIndex === BoldLine + 3 || rowIndex === BoldLine + 4||rowIndex === BoldCol + 1 || rowIndex === BoldLine + 1 ||  rowIndex === BoldLine + 2 || rowIndex === 0 || rowIndex === 1
          ||  rowIndex === BoldLine + 5 || rowIndex === BoldLine + 6 || rowIndex === BoldLine + 7 || rowIndex === BoldLine + 8
          ) { 
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

/////////////////////////////////////////////////////////////////////////////////


    const resumoData = [
    [{ content: 'Resumo', colSpan: 4 }],
    ['Receita','Dinheiro', 'Pix', 'Total'],
    ];


    resumoData.push(
    ['Monitores', formatNumero(data[0].monitor[iMonitor].total.finalTotal.dinheiro) , formatNumero(data[0].monitor[iMonitor].total.finalTotal.pix) , formatNumero(data[0].monitor[iMonitor].total.finalTotal.TotalValor)],
    );

    resumoData.push(
    ['Parceiros', formatNumero(data[0].parceiro[iParceiro].total.finalTotal.dinheiro) , formatNumero(data[0].parceiro[iParceiro].total.finalTotal.pix) , formatNumero(data[0].parceiro[iParceiro].total.finalTotal.TotalValor)],
    );

    resumoData.push(
    ['CLIENTES APP', formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.dinheiro) , formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.pix) , formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.TotalValor)],
    );

    resumoData.push(
    ['Avulso', formatNumero(data[0].avulso[iAvulso].total.finalTotal.dinheiro) , formatNumero(data[0].avulso[iAvulso].total.finalTotal.pix) , formatNumero(data[0].avulso[iAvulso].total.finalTotal.TotalValor)],
    );

    resumoData.push(
    ['Chatbot', formatNumero(data[0].chatbot[iChatbot].total.finalTotal.dinheiro) , formatNumero(data[0].chatbot[iChatbot].total.finalTotal.pix) , formatNumero(data[0].chatbot[iChatbot].total.finalTotal.TotalValor)],
    );

    resumoData.push(
    ['Faturamento total', 
    formatNumero(data[0].parceiro[iParceiro].total.finalTotal.dinheiro 
    + data[0].monitor[iMonitor].total.finalTotal.dinheiro 
    + data[0].aplicativo[iAplicativo].total.finalTotal.dinheiro 
    + data[0].avulso[iAvulso].total.finalTotal.dinheiro 
    + data[0].chatbot[iChatbot].total.finalTotal.dinheiro), 
    formatNumero(data[0].parceiro[iParceiro].total.finalTotal.pix 
    + data[0].monitor[iMonitor].total.finalTotal.pix 
    + data[0].aplicativo[iAplicativo].total.finalTotal.pix 
    + data[0].avulso[iAvulso].total.finalTotal.pix 
    + data[0].chatbot[iChatbot].total.finalTotal.pix), 
    formatNumero(data[0].parceiro[iParceiro].total.finalTotal.TotalValor 
    + data[0].monitor[iMonitor].total.finalTotal.TotalValor 
    + data[0].aplicativo[iAplicativo].total.finalTotal.TotalValor 
    + data[0].avulso[iAvulso].total.finalTotal.TotalValor 
    + data[0].chatbot[iChatbot].total.finalTotal.TotalValor)],
    );

let startY = doc.lastAutoTable.finalY + 5;
let tableWidth = 40; 
const margin = { left: 3.5, right: 3.5 };

doc.autoTable({ 
  head: [resumoData[0]],
  body: resumoData.slice(1),
  useCss: true, 
  startY: startY + 10,
  margin: margin,
  columnStyles: {
    0: { cellWidth: tableWidth },
    1: { cellWidth: tableWidth },
    2: { cellWidth: tableWidth }, 
    3: { cellWidth: tableWidth }, 
    4: { cellWidth: tableWidth }, 
  },
  headStyles: headStyles,
  theme: 'grid' 
});

////////////////////////////////////////////////////

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
    const data = new Date();
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const dataHoje = ano + "-" + mes + "-" + dia;
    setDataHoje(dataHoje);

    const requisicao = createAPI();
    const idrequisicao= `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${dataHoje}%" }]}`
    const passar = btoa(idrequisicao)
    requisicao.get(`/financeiro/admin/?query=${passar}`).then((res) => {
    console.log(res)
    setEstado(true);
    setData(res.data.data);
    let newData = res.data.data[0].monitor.map((item) => {
      if (item) {
        if (item.total) {
        const perfil = 'Total';
        const nome = '';
        const totalRegularizacao = item.total.Regularizacao.TotalValor;
        const totalEstacionamento = item.total.estacionamento.TotalValor;
        const totalRecarga = item.total.creditosInseridos.TotalValor;
        const finalTotal = item.total.finalTotal.TotalValor;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
        }
        const perfil = 'Monitor';
        const nome = item.nome || '';
        const totalRegularizacao = item.Regularizacao ? item.Regularizacao.TotalValor : null;
        const totalEstacionamento = item.estacionamento ? item.estacionamento.TotalValor : null;
        const totalRecarga = item.creditosInseridos ? item.creditosInseridos.TotalValor : null;
        const finalTotal = item.finalTotal ? item.finalTotal.TotalValor : null;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
      }
    });
    const newData2 = res.data.data[0].parceiro.map((item) => {
      if (item) {
         if (item.total) {
          const perfil = 'Total';
        const nome = '';
        const totalRegularizacao = item.total.Regularizacao.TotalValor;
        const totalEstacionamento = item.total.estacionamento.TotalValor;
        const totalRecarga = item.total.creditosInseridos.TotalValor;
        const finalTotal = item.total.finalTotal.TotalValor;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
        }
        const perfil = 'Parceiro';
        const nome = item.nome || '';
        const totalRegularizacao = item.Regularizacao ? item.Regularizacao.TotalValor : null;
        const totalEstacionamento = item.estacionamento ? item.estacionamento.TotalValor : null;
        const totalRecarga = item.creditosInseridos ? item.creditosInseridos.TotalValor : null;
        const finalTotal = item.finalTotal ? item.finalTotal.TotalValor : null;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
      }
    });

    const newData3 = res.data.data[0].aplicativo.map((item) => {
      if (item) {
         if (item.total) {
        const perfil = 'Total';
        const nome = '';
        const totalRegularizacao = item.total.Regularizacao.TotalValor;
        const totalEstacionamento = item.total.estacionamento.TotalValor;
        const totalRecarga = item.total.creditosInseridos.TotalValor;
        const finalTotal = item.total.finalTotal.TotalValor;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
        }
        const perfil = 'Aplicativo';
        const nome = '';
        const totalRegularizacao = item.Regularizacao ? item.Regularizacao.TotalValor : null;
        const totalEstacionamento = item.estacionamento ? item.estacionamento.TotalValor : null;
        const totalRecarga = item.creditosInseridos ? item.creditosInseridos.TotalValor : null;
        const finalTotal = item.finalTotal ? item.finalTotal.TotalValor : null;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
      }
    });

    const newData5 = res.data.data[0].avulso.map((item) => {
      if (item) {
          if (item.total) {
        const perfil = 'Avulso';
        const nome = '';
        const totalRegularizacao = item.total.Regularizacao.TotalValor;
        const totalEstacionamento = item.total.estacionamento.TotalValor;
        const totalRecarga = item.total.creditosInseridos.TotalValor;
        const finalTotal = item.total.finalTotal.TotalValor;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
        }
        const perfil = 'Avulso';
        const nome = '';
        const totalRegularizacao = item.Regularizacao ? item.Regularizacao.TotalValor : null;
        const totalEstacionamento = item.estacionamento ? item.estacionamento.TotalValor : null;
        const totalRecarga = item.creditosInseridos ? item.creditosInseridos.TotalValor : null;
        const finalTotal = item.finalTotal ? item.finalTotal.TotalValor : null;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
      }
    });

    const newData6 = res.data.data[0].chatbot.map((item) => {
      if (item) {
          if (item.total) {
        const perfil = 'Chatbot';
        const nome = '';
        const totalRegularizacao = item.total.Regularizacao.TotalValor;
        const totalEstacionamento = item.total.estacionamento.TotalValor;
        const totalRecarga = item.total.creditosInseridos.TotalValor;
        const finalTotal = item.total.finalTotal.TotalValor;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
        }
        const perfil = 'Chatbot';
        const nome = '';
        const totalRegularizacao = item.Regularizacao ? item.Regularizacao.TotalValor : null;
        const totalEstacionamento = item.estacionamento ? item.estacionamento.TotalValor : null;
        const totalRecarga = item.creditosInseridos ? item.creditosInseridos.TotalValor : null;
        const finalTotal = item.finalTotal ? item.finalTotal.TotalValor : null;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
      }
    });


    const iParceiro = res.data.data[0].parceiro.length - 1;
    const iMonitor = res.data.data[0].monitor.length - 1;
    const iAplicativo = res.data.data[0].aplicativo.length - 1;
    const iAvulso = res.data.data[0].avulso.length - 1;
    const iChatbot = res.data.data[0].chatbot.length - 1;

    const newData4 = {
        nome : '',
        perfil : 'Total geral',
        totalRegularizacao : res.data.data[0].parceiro[iParceiro].total.Regularizacao.TotalValor + res.data.data[0].monitor[iMonitor].total.Regularizacao.TotalValor + res.data.data[0].aplicativo[iAplicativo].total.Regularizacao.TotalValor + res.data.data[0].avulso[iAvulso].total.Regularizacao.TotalValor + res.data.data[0].chatbot[iChatbot].total.Regularizacao.TotalValor,
        totalEstacionamento : res.data.data[0].parceiro[iParceiro].total.estacionamento.TotalValor + res.data.data[0].monitor[iMonitor].total.estacionamento.TotalValor + res.data.data[0].aplicativo[iAplicativo].total.estacionamento.TotalValor + res.data.data[0].avulso[iAvulso].total.estacionamento.TotalValor + res.data.data[0].chatbot[iChatbot].total.estacionamento.TotalValor,
        totalRecarga : res.data.data[0].parceiro[iParceiro].total.creditosInseridos.TotalValor + res.data.data[0].monitor[iMonitor].total.creditosInseridos.TotalValor + res.data.data[0].aplicativo[iAplicativo].total.creditosInseridos.TotalValor + res.data.data[0].avulso[iAvulso].total.creditosInseridos.TotalValor + res.data.data[0].chatbot[iChatbot].total.creditosInseridos.TotalValor,
        finalTotal : res.data.data[0].parceiro[iParceiro].total.finalTotal.TotalValor + res.data.data[0].monitor[iMonitor].total.finalTotal.TotalValor + res.data.data[0].aplicativo[iAplicativo].total.finalTotal.TotalValor + res.data.data[0].avulso[iAvulso].total.finalTotal.TotalValor + res.data.data[0].chatbot[iChatbot].total.finalTotal.TotalValor,
    };

    newData = newData.concat(newData2, newData3, newData5, newData6, newData4);
    console.log('sdf', newData5)
    setData2(newData);
  }).catch((err) => {
    console.log(err);
  });
  }, []);

  const handleConsulta = (consulta) => {
    setEstado2(false);
    setEstadoLoading(true);
    const requisicao = createAPI();
  const base64 = btoa(consulta)
  requisicao.get(`/financeiro/admin?query=${base64}`).then((res) => {
    console.log(res)
    if(res.data.msg.resultado){
    setEstadoLoading(false);
    setEstado(true);
    setData(res.data.data);
    let newData = res.data.data[0].monitor.map((item) => {
      if (item) {
        if (item.total) {
        const perfil = 'Total';
        const nome = '';
        const totalRegularizacao = item.total.Regularizacao.TotalValor;
        const totalEstacionamento = item.total.estacionamento.TotalValor;
        const totalRecarga = item.total.creditosInseridos.TotalValor;
        const finalTotal = item.total.finalTotal.TotalValor;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
        }
        const perfil = 'Monitor';
        const nome = item.nome || '';
        const totalRegularizacao = item.Regularizacao ? item.Regularizacao.TotalValor : null;
        const totalEstacionamento = item.estacionamento ? item.estacionamento.TotalValor : null;
        const totalRecarga = item.creditosInseridos ? item.creditosInseridos.TotalValor : null;
        const finalTotal = item.finalTotal ? item.finalTotal.TotalValor : null;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
      }
    });
    const newData2 = res.data.data[0].parceiro.map((item) => {
      if (item) {
         if (item.total) {
          const perfil = 'Total';
        const nome = '';
        const totalRegularizacao = item.total.Regularizacao.TotalValor;
        const totalEstacionamento = item.total.estacionamento.TotalValor;
        const totalRecarga = item.total.creditosInseridos.TotalValor;
        const finalTotal = item.total.finalTotal.TotalValor;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
        }
        const perfil = 'Parceiro';
        const nome = item.nome || '';
        const totalRegularizacao = item.Regularizacao ? item.Regularizacao.TotalValor : null;
        const totalEstacionamento = item.estacionamento ? item.estacionamento.TotalValor : null;
        const totalRecarga = item.creditosInseridos ? item.creditosInseridos.TotalValor : null;
        const finalTotal = item.finalTotal ? item.finalTotal.TotalValor : null;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
      }
    });

    const newData3 = res.data.data[0].aplicativo.map((item) => {
      if (item) {
         if (item.total) {
        const perfil = 'Total';
        const nome = '';
        const totalRegularizacao = item.total.Regularizacao.TotalValor;
        const totalEstacionamento = item.total.estacionamento.TotalValor;
        const totalRecarga = item.total.creditosInseridos.TotalValor;
        const finalTotal = item.total.finalTotal.TotalValor;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
        }
        const perfil = 'Aplicativo';
        const nome = '';
        const totalRegularizacao = item.Regularizacao ? item.Regularizacao.TotalValor : null;
        const totalEstacionamento = item.estacionamento ? item.estacionamento.TotalValor : null;
        const totalRecarga = item.creditosInseridos ? item.creditosInseridos.TotalValor : null;
        const finalTotal = item.finalTotal ? item.finalTotal.TotalValor : null;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
      }
    });

    const newData5 = res.data.data[0].avulso.map((item) => {
      if (item) {
          if (item.total) {
        const perfil = 'Avulso';
        const nome = '';
        const totalRegularizacao = item.total.Regularizacao.TotalValor;
        const totalEstacionamento = item.total.estacionamento.TotalValor;
        const totalRecarga = item.total.creditosInseridos.TotalValor;
        const finalTotal = item.total.finalTotal.TotalValor;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
        }
        const perfil = 'Avulso';
        const nome = '';
        const totalRegularizacao = item.Regularizacao ? item.Regularizacao.TotalValor : null;
        const totalEstacionamento = item.estacionamento ? item.estacionamento.TotalValor : null;
        const totalRecarga = item.creditosInseridos ? item.creditosInseridos.TotalValor : null;
        const finalTotal = item.finalTotal ? item.finalTotal.TotalValor : null;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
      }
    });

    const newData6 = res.data.data[0].chatbot.map((item) => {
      if (item) {
          if (item.total) {
        const perfil = 'Chatbot';
        const nome = '';
        const totalRegularizacao = item.total.Regularizacao.TotalValor;
        const totalEstacionamento = item.total.estacionamento.TotalValor;
        const totalRecarga = item.total.creditosInseridos.TotalValor;
        const finalTotal = item.total.finalTotal.TotalValor;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
        }
        const perfil = 'Chatbot';
        const nome = '';
        const totalRegularizacao = item.Regularizacao ? item.Regularizacao.TotalValor : null;
        const totalEstacionamento = item.estacionamento ? item.estacionamento.TotalValor : null;
        const totalRecarga = item.creditosInseridos ? item.creditosInseridos.TotalValor : null;
        const finalTotal = item.finalTotal ? item.finalTotal.TotalValor : null;
        return {
          perfil,
          nome,
          totalRegularizacao,
          totalEstacionamento,
          totalRecarga,
          finalTotal,
        };
      }
    });


    const iParceiro = res.data.data[0].parceiro.length - 1;
    const iMonitor = res.data.data[0].monitor.length - 1;
    const iAplicativo = res.data.data[0].aplicativo.length - 1;
    const iAvulso = res.data.data[0].avulso.length - 1;
    const iChatbot = res.data.data[0].chatbot.length - 1;

    const newData4 = {
        nome : '',
        perfil : 'Total geral',
        totalRegularizacao : res.data.data[0].parceiro[iParceiro].total.Regularizacao.TotalValor + res.data.data[0].monitor[iMonitor].total.Regularizacao.TotalValor + res.data.data[0].aplicativo[iAplicativo].total.Regularizacao.TotalValor + res.data.data[0].avulso[iAvulso].total.Regularizacao.TotalValor + res.data.data[0].chatbot[iChatbot].total.Regularizacao.TotalValor,
        totalEstacionamento : res.data.data[0].parceiro[iParceiro].total.estacionamento.TotalValor + res.data.data[0].monitor[iMonitor].total.estacionamento.TotalValor + res.data.data[0].aplicativo[iAplicativo].total.estacionamento.TotalValor + res.data.data[0].avulso[iAvulso].total.estacionamento.TotalValor + res.data.data[0].chatbot[iChatbot].total.estacionamento.TotalValor,
        totalRecarga : res.data.data[0].parceiro[iParceiro].total.creditosInseridos.TotalValor + res.data.data[0].monitor[iMonitor].total.creditosInseridos.TotalValor + res.data.data[0].aplicativo[iAplicativo].total.creditosInseridos.TotalValor + res.data.data[0].avulso[iAvulso].total.creditosInseridos.TotalValor + res.data.data[0].chatbot[iChatbot].total.creditosInseridos.TotalValor,
        finalTotal : res.data.data[0].parceiro[iParceiro].total.finalTotal.TotalValor + res.data.data[0].monitor[iMonitor].total.finalTotal.TotalValor + res.data.data[0].aplicativo[iAplicativo].total.finalTotal.TotalValor + res.data.data[0].avulso[iAvulso].total.finalTotal.TotalValor + res.data.data[0].chatbot[iChatbot].total.finalTotal.TotalValor,
    };

    newData = newData.concat(newData2, newData3, newData5, newData6, newData4);
    console.log('sdf', newData5)
    setData2(newData);
  }
  else{
    setData([]);
    setEstadoLoading(false)
    setEstado(true);
    setEstado2(true);
    setMensagem(res.data.msg.msg);
  }
  }).catch((err) => {
    console.log(err);
  });
  }

  return (
  <div className="dashboard-container mb-5">
  <div className="row">
  <div className="col-7">
  <h6 className="text-start mx-4 mb-3">Prestação de contas</h6>
  </div>
      <div className="col-12 col-xl-8">
          <div className="row">
              <div className="col-12 mb-4">
                  <div className="row mx-2 mb-3">
                    <div className="col-7">
                      <Filtro nome={"PrestacaoContas"} onConsultaSelected={handleConsulta} onLoading={estadoLoading} />
                    </div>
                      <div className="col-5">
                        {estado ?
                          <button className="btn3 botao p-0 m-0 w-100 h-100" type="button" onClick={()=>{gerarPdf()}}><AiFillPrinter  size={21}/></button>
                          : 
                          <button className="btn2 botao p-0 m-0 w-100 h-100" disabled type="button"><AiFillPrinter  size={21}/></button>
                          }
                       
                      </div>
              </div>
                  <div className="card border-0 shadow">
                      <div className="table-responsive">
                          <table className="table align-items-center table-flush">
                              <thead className="thead-light">
                                  <tr>
                                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Perfil</th>
                                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Nome</th>
                                      <th className="border-bottom" id="tabelaUsuarios2" scope="col">Regularização</th>
                                      <th className="border-bottom" id="tabelaUsuarios2" scope="col">Estacionamento</th>
                                      <th className="border-bottom" id="tabelaUsuarios2" scope="col">Recarga</th>
                                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Total arrecadado</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {data2.map((item, index) => (
                                  item.totalRegularizacao !== null ?
                                      <tr className="card-list" key={index}>
                                          <th className={item.perfil === 'Total' ||  item.perfil === 'Total geral'? 'fw-bolder col' : 'col'} id="tabelaUsuarios"> {item.perfil} </th>
                                          {item.nome !== undefined ?
                                          <td className={item.perfil === 'Total' ||  item.perfil === 'Total geral'? 'fw-bolder col' : 'col'} scope="row" id="tabelaUsuarios"> 
                                          {item.nome.length > 14 ? item.nome.substring(0, 14) + "..." : item.nome}
                                           </td>
                                            : null 
                                          }
                                          <td className={item.perfil === 'Total' ||  item.perfil ==='Total geral'? 'fw-bolder col' : 'col'} id="tabelaUsuarios2"> {formatNumero(item.totalRegularizacao)} </td>
                                          <td className={item.perfil === 'Total' ||  item.perfil === 'Total geral'? 'fw-bolder col' : 'col'} id="tabelaUsuarios2"> {formatNumero(item.totalEstacionamento)} </td>
                                          <td className={item.perfil === 'Total' ||  item.perfil === 'Total geral'? 'fw-bolder col' : 'col'} id="tabelaUsuarios2"> {formatNumero(item.totalRecarga)} </td>
                                          <td className={item.perfil === 'Total' ||  item.perfil === 'Total geral'? 'fw-bolder col' : 'col'} id="tabelaUsuarios"> {formatNumero(item.finalTotal)} </td>
                                      </tr>
                                      : null
                                  ))}

                              </tbody>
                          </table>
                      </div>
                      {!estado ? (
                  <div>
                    <CarroLoading />
                  </div>
                  ) : null}
                  </div>
                  <div className="alert alert-danger mt-4 mx-3" role="alert" style={{ display: estado2 ? 'block' : 'none' }}>
                    {mensagem}
                  </div>
              </div>
          </div>
              <VoltarComponente />
      </div>
  </div>
</div>
  );
};

export default PrestacaoContas;
