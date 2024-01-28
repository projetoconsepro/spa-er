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

  function calcularTotaisPorCategoria(categoria, indice) {
    return [
        data[0][categoria][indice].total.Regularizacao.quantidade,
        formatNumero(data[0][categoria][indice].total.Regularizacao.dinheiro),
        formatNumero(data[0][categoria][indice].total.Regularizacao.pix),
        formatNumero(data[0][categoria][indice].total.Regularizacao.TotalValor),
        data[0][categoria][indice].total.estacionamento.quantidade,
        formatNumero(data[0][categoria][indice].total.estacionamento.dinheiro),
        formatNumero(data[0][categoria][indice].total.estacionamento.pix),
        formatNumero(data[0][categoria][indice].total.estacionamento.TotalValor),
        data[0][categoria][indice].total.creditosInseridos.quantidade,
        formatNumero(data[0][categoria][indice].total.creditosInseridos.dinheiro),
        formatNumero(data[0][categoria][indice].total.creditosInseridos.pix),
        formatNumero(0),  // Valor fixo (0)
        formatNumero(data[0][categoria][indice].total.creditosInseridos.TotalValor),
        formatNumero(data[0][categoria][indice].total.finalTotal.dinheiro),
        formatNumero(data[0][categoria][indice].total.finalTotal.pix),
        formatNumero(0),  // Valor fixo (0)
        formatNumero(data[0][categoria][indice].total.finalTotal.TotalValor)
    ];
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
      ['', { content: 'Regularização', colSpan: 4 },{ content: 'Estacionamento', colSpan: 4 }, { content: 'Recarga', colSpan: 5 }, { content: 'Total arrecadado', colSpan: 4 },],
      ['', 'Quant' ,'Din', 'Pix', 'Total', 'Quant' , 'Din', 'Pix', 'Total' , 'Quant' , 'Din', 'Pix','Cartão', 'Total' , 'Din', 'Pix', 'Cartão', 'Total'],
    ];

    regularizacaoData.push([{ content: 'MONITOR', colSpan: 22 }]);

    regularizacaoData.push(...data[0].monitor.map(item => {
      const isRegularizacaoPresente = item.Regularizacao !== undefined;
      
      const rowData = [
          isRegularizacaoPresente ? 
              (item.nome.length > 13 ? `${item.nome.substring(0, item.nome.indexOf(' '))} ${item.nome.split(' ')[1].charAt(0)}.` : (item.nome.length <= 13 ? item.nome.substring(0, 8) : item.nome.substring(0, 13))) 
              : 'Total',
          isRegularizacaoPresente ? item.Regularizacao.quantidade : item.total.Regularizacao.quantidade,
          isRegularizacaoPresente ? formatNumero(item.Regularizacao.dinheiro) : formatNumero(item.total.Regularizacao.dinheiro),
          isRegularizacaoPresente ? formatNumero(item.Regularizacao.pix) : formatNumero(item.total.Regularizacao.pix),
          isRegularizacaoPresente ? formatNumero(item.Regularizacao.TotalValor) : formatNumero(item.total.Regularizacao.TotalValor),
          isRegularizacaoPresente ? item.estacionamento.quantidade : item.total.estacionamento.quantidade,
          isRegularizacaoPresente ? formatNumero(item.estacionamento.dinheiro) : formatNumero(item.total.estacionamento.dinheiro),
          isRegularizacaoPresente ? formatNumero(item.estacionamento.pix) : formatNumero(item.total.estacionamento.pix),
          isRegularizacaoPresente ? formatNumero(item.estacionamento.TotalValor) : formatNumero(item.total.estacionamento.TotalValor),
          isRegularizacaoPresente ? item.creditosInseridos.quantidade : item.total.creditosInseridos.quantidade,
          isRegularizacaoPresente ? formatNumero(item.creditosInseridos.dinheiro) : formatNumero(item.total.creditosInseridos.dinheiro),
          isRegularizacaoPresente ? formatNumero(item.creditosInseridos.pix) : formatNumero(item.total.creditosInseridos.pix),
          formatNumero(0), // Valor fixo (0)
          isRegularizacaoPresente ? formatNumero(item.creditosInseridos.TotalValor) : formatNumero(item.total.creditosInseridos.TotalValor),
          formatNumero(isRegularizacaoPresente ? item.finalTotal.dinheiro : item.total.finalTotal.dinheiro),
          formatNumero(isRegularizacaoPresente ? item.finalTotal.pix : item.total.finalTotal.pix),
          formatNumero(0), // Valor fixo (0)
          isRegularizacaoPresente ? formatNumero(item.finalTotal.TotalValor) : formatNumero(item.total.finalTotal.TotalValor),
      ];
  
      return rowData;
  }));

    const BoldCol = regularizacaoData.length -2;

    regularizacaoData.push([{ content: 'PARCEIRO', colSpan: 22 }]);

    regularizacaoData.push(...data[0].parceiro.map(item => {
        const isRegularizacaoPresente = item.Regularizacao !== undefined;
        
        const rowData = [
            isRegularizacaoPresente ? 
                (item.nome.length > 11 ? `${item.nome.substring(0, item.nome.indexOf(' '))} ${item.nome.split(' ')[1].charAt(0)}.` : item.nome) 
                : 'Total',
            isRegularizacaoPresente ? item.Regularizacao.quantidade : item.total.Regularizacao.quantidade,
            isRegularizacaoPresente ? formatNumero(item.Regularizacao.dinheiro) : formatNumero(item.total.Regularizacao.dinheiro),
            isRegularizacaoPresente ? formatNumero(item.Regularizacao.pix) : formatNumero(item.total.Regularizacao.pix),
            isRegularizacaoPresente ? formatNumero(item.Regularizacao.TotalValor) : formatNumero(item.total.Regularizacao.TotalValor),
            isRegularizacaoPresente ? item.estacionamento.quantidade : item.total.estacionamento.quantidade,
            isRegularizacaoPresente ? formatNumero(item.estacionamento.dinheiro) : formatNumero(item.total.estacionamento.dinheiro),
            isRegularizacaoPresente ? formatNumero(item.estacionamento.pix) : formatNumero(item.total.estacionamento.pix),
            isRegularizacaoPresente ? formatNumero(item.estacionamento.TotalValor) : formatNumero(item.total.estacionamento.TotalValor),
            isRegularizacaoPresente ? item.creditosInseridos.quantidade : item.total.creditosInseridos.quantidade,
            isRegularizacaoPresente ? formatNumero(item.creditosInseridos.dinheiro) : formatNumero(item.total.creditosInseridos.dinheiro),
            isRegularizacaoPresente ? formatNumero(item.creditosInseridos.pix) : formatNumero(item.total.creditosInseridos.pix),
            formatNumero(0), // Valor fixo (0)
            isRegularizacaoPresente ? formatNumero(item.creditosInseridos.TotalValor) : formatNumero(item.total.creditosInseridos.TotalValor),
            formatNumero(isRegularizacaoPresente ? item.finalTotal.dinheiro : item.total.finalTotal.dinheiro),
            formatNumero(isRegularizacaoPresente ? item.finalTotal.pix : item.total.finalTotal.pix),
            formatNumero(0), // Valor fixo (0)
            isRegularizacaoPresente ? formatNumero(item.finalTotal.TotalValor) : formatNumero(item.total.finalTotal.TotalValor),
        ];
    
        return rowData;
    }));
    


    const BoldLine = regularizacaoData.length - 2 ;

    regularizacaoData.push([{ content: 'Clientes APP  ', colSpan: 22 }]);
    data[0].aplicativo.forEach((item) => {
      if (item.Regularizacao === undefined) {
          regularizacaoData.push([
              'Total',
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
              formatNumero(item.total.creditosInseridos.cartao),
              formatNumero(item.total.creditosInseridos.TotalValor),
              formatNumero(item.total.finalTotal.dinheiro),
              formatNumero(item.total.finalTotal.pix),
              formatNumero(item.total.finalTotal.cartao),
              formatNumero(item.total.finalTotal.TotalValor),
          ]);
      }
  });
  
    regularizacaoData.push([{ content: 'AVULSO', colSpan: 22 }]);
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
          formatNumero(0),
          formatNumero(item.total.creditosInseridos.TotalValor),
          formatNumero(item.total.finalTotal.dinheiro),
          formatNumero(item.total.finalTotal.pix),
          formatNumero(0),
          formatNumero(item.total.finalTotal.TotalValor),
          ])
      }
    });

    regularizacaoData.push([{ content: 'CHATBOT', colSpan: 22 }]);

    data[0].avulso.forEach((item) => {
      if (item.Regularizacao === undefined) {
          regularizacaoData.push([
              'Total',
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
              formatNumero(0),
              formatNumero(item.total.creditosInseridos.TotalValor),
              formatNumero(item.total.finalTotal.dinheiro),
              formatNumero(item.total.finalTotal.pix),
              formatNumero(0),
              formatNumero(item.total.finalTotal.TotalValor),
          ]);
      }
  });
  

    regularizacaoData.push([{ content: 'TOTAL GERAL', colSpan: 22 }]);

    const iParceiro = data[0].parceiro.length - 1;
    const iMonitor = data[0].monitor.length - 1;
    const iAplicativo = data[0].aplicativo.length - 1;
    const iAvulso = data[0].avulso.length - 1;
    const iChatbot = data[0].chatbot.length - 1;

    const totaisParceiro = calcularTotaisPorCategoria('parceiro', iParceiro);
    const totaisMonitor = calcularTotaisPorCategoria('monitor', iMonitor);
    const totaisAplicativo = calcularTotaisPorCategoria('aplicativo', iAplicativo);
    const totaisAvulso = calcularTotaisPorCategoria('avulso', iAvulso);
    const totaisChatbot = calcularTotaisPorCategoria('chatbot', iChatbot);
    
    // Somar totais para criar a linha 'Total'
    const totalFinal = totaisParceiro.map((_, index) =>
        totaisParceiro[index] + totaisMonitor[index] + totaisAplicativo[index] + totaisAvulso[index] + totaisChatbot[index]
    );
    
    // Adicionar a linha 'Total' ao regularizacaoData
    regularizacaoData.push(['Total', ...totalFinal]);

    const columnStyles = {
      0: { cellWidth: 17 },
      1: { cellWidth: 12 },
      2: { cellWidth: 17 },
      3: { cellWidth: 17 },
      4: { cellWidth: 17 },
      5: { cellWidth: 12 },
      6: { cellWidth: 17 },
      7: { cellWidth: 17 },
      8: { cellWidth: 17 },
      9: { cellWidth: 12  },
      10: { cellWidth: 17 },
      11: { cellWidth: 17 },
      12: { cellWidth: 17 },
      13: { cellWidth: 17 },
      14: { cellWidth: 17 },
      15: { cellWidth: 17 },
      16: { cellWidth: 17 },
      17: { cellWidth: 17 },
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
    [{ content: 'Resumo', colSpan: 5 }],
    ['Receita','Dinheiro', 'Pix', 'Cartão','Total'],
    ];


    resumoData.push(
    ['Monitores', formatNumero(data[0].monitor[iMonitor].total.finalTotal.dinheiro) , formatNumero(data[0].monitor[iMonitor].total.finalTotal.pix) , formatNumero(0) , formatNumero(data[0].monitor[iMonitor].total.finalTotal.TotalValor)],
    );

    resumoData.push(
    ['Parceiros', formatNumero(data[0].parceiro[iParceiro].total.finalTotal.dinheiro) , formatNumero(data[0].parceiro[iParceiro].total.finalTotal.pix) , formatNumero(0) , formatNumero(data[0].parceiro[iParceiro].total.finalTotal.TotalValor)],
    );

    resumoData.push(
    ['CLIENTES APP', formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.dinheiro) , formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.pix) ,formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.cartao), formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.TotalValor)],
    );

    resumoData.push(
    ['Avulso', formatNumero(data[0].avulso[iAvulso].total.finalTotal.dinheiro) , formatNumero(data[0].avulso[iAvulso].total.finalTotal.pix) ,formatNumero(0), formatNumero(data[0].avulso[iAvulso].total.finalTotal.TotalValor)],
    );

    resumoData.push(
    ['Chatbot', formatNumero(data[0].chatbot[iChatbot].total.finalTotal.dinheiro) , formatNumero(data[0].chatbot[iChatbot].total.finalTotal.pix) ,formatNumero(0), formatNumero(data[0].chatbot[iChatbot].total.finalTotal.TotalValor)],
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
    formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.cartao),
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
    const data = new Date();
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const dataHoje = ano + "-" + mes + "-" + dia;
    setDataHoje(dataHoje);

    const idrequisicao= `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${dataHoje}%" }]}`
    handleConsulta(idrequisicao);
  }, []);

  const handleConsulta = (consulta) => {
    setEstado2(false);
    setEstadoLoading(true);
    const requisicao = createAPI();
    const base64 = btoa(consulta)
    requisicao.get(`/financeiro/admin?query=${base64}`).then((res) => {
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
