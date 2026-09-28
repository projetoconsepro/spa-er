import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../util/logoconseproof2.png";
import VoltarComponente from "../util/VoltarComponente";
import Swal from "sweetalert2";
import { AiFillPrinter } from "react-icons/ai";
import CarroLoading from "../components/Carregamento";
import Filtro from "../util/Filtro";
import createAPI from "../services/createAPI";
import AtualizarPix from "../util/AtualizarPix";
import formatNumero from "../util/formatNumero";

const PrestacaoContas = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [dataFiltrada, setDataFiltrada] = useState("");
  const [estadoLoadingPix, setEstadoLoadingPix] = useState(false);
  const [mensagem, setMensagem] = useState("");

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
      formatNumero(0), // Valor fixo (0)
      formatNumero(
        data[0][categoria][indice].total.creditosInseridos.TotalValor
      ),
      formatNumero(data[0][categoria][indice].total.finalTotal.dinheiro),
      formatNumero(data[0][categoria][indice].total.finalTotal.pix),
      formatNumero(0), // Valor fixo (0)
      formatNumero(data[0][categoria][indice].total.finalTotal.TotalValor),
    ];
  }

  const gerarPdf = () => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const doc = new jsPDF({ orientation: "landscape" });

    const header = () => {
      const logoWidth = 30;
      const logoHeight = 12;
      const logoPositionX = doc.internal.pageSize.width - 15 - logoWidth;
      const logoPositionY = 6;
      doc.addImage(
        Logo,
        "PNG",
        logoPositionX,
        logoPositionY,
        logoWidth,
        logoHeight
      );

      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text("Relatório de Prestação de Contas", 3.5, 10);
      doc.setFontSize(10);
      doc.setTextColor(100);
      const dateNow = new Date();
      const day = dateNow.getDate().toString().padStart(2, "0");
      const month = (dateNow.getMonth() + 1).toString().padStart(2, "0");
      const year = dateNow.getFullYear().toString();
      const hour = dateNow.getHours().toString().padStart(2, "0");
      const minute = dateNow.getMinutes().toString().padStart(2, "0");
      const formattedDate = `${day}/${month}/${year} ${hour}:${minute}`;
      doc.text(`Relatório ${dataFiltrada}`, 3.5, 16);
      doc.text(`Gerado por: ${user2.nome}`, 3.5, 21);
      doc.text(`Data: ${formattedDate}`, 3.5, 26);
    };
    header();

    const regularizacaoData = [
      [
        "",
        { content: "Regularização", colSpan: 4 },
        { content: "Estacionamento", colSpan: 4 },
        { content: "Recarga", colSpan: 5 },
        { content: "Total arrecadado", colSpan: 4 },
      ],
      [
        "",
        "Quant",
        "Din",
        "Pix",
        "Total",
        "Quant",
        "Din",
        "Pix",
        "Total",
        "Quant",
        "Din",
        "Pix",
        "Cartão",
        "Total",
        "Din",
        "Pix",
        "Cartão",
        "Total",
      ],
    ];

    regularizacaoData.push([{ content: "MONITOR", colSpan: 22 }]);

    regularizacaoData.push(
      ...data[0].monitor.map((item) => {
        const isRegularizacaoPresente = item.Regularizacao !== undefined;

        const rowData = [
          isRegularizacaoPresente
            ? item.nome.length > 13
              ? `${item.nome.substring(0, item.nome.indexOf(" "))} ${
                  item.nome.split(" ")[1]
                    ? item.nome.split(" ")[1].charAt(0)
                    : ""
                }.`
              : item.nome.length <= 13
              ? item.nome.substring(0, 8)
              : item.nome.substring(0, 13)
            : "Total",
          isRegularizacaoPresente
            ? item.Regularizacao.quantidade
            : item.total.Regularizacao.quantidade,
          isRegularizacaoPresente
            ? formatNumero(item.Regularizacao.dinheiro)
            : formatNumero(item.total.Regularizacao.dinheiro),
          isRegularizacaoPresente
            ? formatNumero(item.Regularizacao.pix)
            : formatNumero(item.total.Regularizacao.pix),
          isRegularizacaoPresente
            ? formatNumero(item.Regularizacao.TotalValor)
            : formatNumero(item.total.Regularizacao.TotalValor),
          isRegularizacaoPresente
            ? item.estacionamento.quantidade
            : item.total.estacionamento.quantidade,
          isRegularizacaoPresente
            ? formatNumero(item.estacionamento.dinheiro)
            : formatNumero(item.total.estacionamento.dinheiro),
          isRegularizacaoPresente
            ? formatNumero(item.estacionamento.pix)
            : formatNumero(item.total.estacionamento.pix),
          isRegularizacaoPresente
            ? formatNumero(item.estacionamento.TotalValor)
            : formatNumero(item.total.estacionamento.TotalValor),
          isRegularizacaoPresente
            ? item.creditosInseridos.quantidade
            : item.total.creditosInseridos.quantidade,
          isRegularizacaoPresente
            ? formatNumero(item.creditosInseridos.dinheiro)
            : formatNumero(item.total.creditosInseridos.dinheiro),
          isRegularizacaoPresente
            ? formatNumero(item.creditosInseridos.pix)
            : formatNumero(item.total.creditosInseridos.pix),
          formatNumero(0), // Valor fixo (0)
          isRegularizacaoPresente
            ? formatNumero(item.creditosInseridos.TotalValor)
            : formatNumero(item.total.creditosInseridos.TotalValor),
          formatNumero(
            isRegularizacaoPresente
              ? item.finalTotal.dinheiro
              : item.total.finalTotal.dinheiro
          ),
          formatNumero(
            isRegularizacaoPresente
              ? item.finalTotal.pix
              : item.total.finalTotal.pix
          ),
          formatNumero(0), // Valor fixo (0)
          isRegularizacaoPresente
            ? formatNumero(item.finalTotal.TotalValor)
            : formatNumero(item.total.finalTotal.TotalValor),
        ];

        return rowData;
      })
    );

    const BoldCol = regularizacaoData.length - 2;

    regularizacaoData.push([{ content: "PARCEIRO", colSpan: 22 }]);

    regularizacaoData.push(
      ...data[0].parceiro.map((item) => {
        const isRegularizacaoPresente = item.Regularizacao !== undefined;

        const rowData = [
          isRegularizacaoPresente
            ? item.nome.length > 11
              ? `${item.nome.substring(0, item.nome.indexOf(" "))} ${item.nome
                  .split(" ")[1]
                  .charAt(0)}.`
              : item.nome
            : "Total",
          isRegularizacaoPresente
            ? item.Regularizacao.quantidade
            : item.total.Regularizacao.quantidade,
          isRegularizacaoPresente
            ? formatNumero(item.Regularizacao.dinheiro)
            : formatNumero(item.total.Regularizacao.dinheiro),
          isRegularizacaoPresente
            ? formatNumero(item.Regularizacao.pix)
            : formatNumero(item.total.Regularizacao.pix),
          isRegularizacaoPresente
            ? formatNumero(item.Regularizacao.TotalValor)
            : formatNumero(item.total.Regularizacao.TotalValor),
          isRegularizacaoPresente
            ? item.estacionamento.quantidade
            : item.total.estacionamento.quantidade,
          isRegularizacaoPresente
            ? formatNumero(item.estacionamento.dinheiro)
            : formatNumero(item.total.estacionamento.dinheiro),
          isRegularizacaoPresente
            ? formatNumero(item.estacionamento.pix)
            : formatNumero(item.total.estacionamento.pix),
          isRegularizacaoPresente
            ? formatNumero(item.estacionamento.TotalValor)
            : formatNumero(item.total.estacionamento.TotalValor),
          isRegularizacaoPresente
            ? item.creditosInseridos.quantidade
            : item.total.creditosInseridos.quantidade,
          isRegularizacaoPresente
            ? formatNumero(item.creditosInseridos.dinheiro)
            : formatNumero(item.total.creditosInseridos.dinheiro),
          isRegularizacaoPresente
            ? formatNumero(item.creditosInseridos.pix)
            : formatNumero(item.total.creditosInseridos.pix),
          formatNumero(0), // Valor fixo (0)
          isRegularizacaoPresente
            ? formatNumero(item.creditosInseridos.TotalValor)
            : formatNumero(item.total.creditosInseridos.TotalValor),
          formatNumero(
            isRegularizacaoPresente
              ? item.finalTotal.dinheiro
              : item.total.finalTotal.dinheiro
          ),
          formatNumero(
            isRegularizacaoPresente
              ? item.finalTotal.pix
              : item.total.finalTotal.pix
          ),
          formatNumero(0), // Valor fixo (0)
          isRegularizacaoPresente
            ? formatNumero(item.finalTotal.TotalValor)
            : formatNumero(item.total.finalTotal.TotalValor),
        ];

        return rowData;
      })
    );

    const BoldLine = regularizacaoData.length - 2;

    regularizacaoData.push([{ content: "Clientes APP  ", colSpan: 22 }]);
    data[0].aplicativo.forEach((item) => {
      if (item.Regularizacao === undefined) {
        regularizacaoData.push([
          "Total",
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

    regularizacaoData.push([{ content: "AVULSO", colSpan: 22 }]);
    data[0].avulso.map((item) => {
      if (item.Regularizacao !== undefined) {
      } else {
        regularizacaoData.push([
          "Total",
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

    regularizacaoData.push([{ content: "CHATBOT", colSpan: 22 }]);

    data[0].avulso.forEach((item) => {
      if (item.Regularizacao === undefined) {
        regularizacaoData.push([
          "Total",
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

    regularizacaoData.push([{ content: "TOTAL GERAL", colSpan: 22 }]);

    const iParceiro = data[0].parceiro.length - 1;
    const iMonitor = data[0].monitor.length - 1;
    const iAplicativo = data[0].aplicativo.length - 1;
    const iAvulso = data[0].avulso.length - 1;
    const iChatbot = data[0].chatbot.length - 1;

    const totaisParceiro = calcularTotaisPorCategoria("parceiro", iParceiro);
    const totaisMonitor = calcularTotaisPorCategoria("monitor", iMonitor);
    const totaisAplicativo = calcularTotaisPorCategoria(
      "aplicativo",
      iAplicativo
    );
    const totaisAvulso = calcularTotaisPorCategoria("avulso", iAvulso);
    const totaisChatbot = calcularTotaisPorCategoria("chatbot", iChatbot);

    const totalFinal = totaisParceiro.map((_, index) => {
      const totalParceiro = formatNumeroParaFloat(totaisParceiro[index]);
      const totalMonitor = formatNumeroParaFloat(totaisMonitor[index]);
      const totalAplicativo = formatNumeroParaFloat(totaisAplicativo[index]);
      const totalAvulso = formatNumeroParaFloat(totaisAvulso[index]);
      const totalChatbot = formatNumeroParaFloat(totaisChatbot[index]);

      const finalTotal =
        totalParceiro +
        totalMonitor +
        totalAplicativo +
        totalAvulso +
        totalChatbot;
      return typeof totaisParceiro[index] === "string"
        ? formatNumero(finalTotal)
        : finalTotal;
    });

    function formatNumeroParaFloat(numero) {
      if (typeof numero === "string") {
        const numeroFormatado = numero.replace(/\./g, "").replace(",", ".");
        return parseFloat(numeroFormatado);
      } else {
        return numero;
      }
    }

    regularizacaoData.push(["Total", ...totalFinal]);

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
      9: { cellWidth: 12 },
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
      fontStyle: "bold",
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
      halign: "center",
    };

    doc.autoTable({
      head: [regularizacaoData[0]],
      body: regularizacaoData.slice(1),
      startY: 30,
      theme: "grid",
      margin: { left: 3.5, right: 3.5 },
      columnStyles: columnStyles,
      headStyles: headStyles,
      styles: {
        fontSize: 7,
      },
      didParseCell: (data) => {
        const rowIndex = data.row ? data.row.index : null;
        if (
          rowIndex === BoldCol ||
          rowIndex === BoldLine ||
          rowIndex === BoldLine + 3 ||
          rowIndex === BoldLine + 4 ||
          rowIndex === BoldCol + 1 ||
          rowIndex === BoldLine + 1 ||
          rowIndex === BoldLine + 2 ||
          rowIndex === 0 ||
          rowIndex === 1 ||
          rowIndex === BoldLine + 5 ||
          rowIndex === BoldLine + 6 ||
          rowIndex === BoldLine + 7 ||
          rowIndex === BoldLine + 8
        ) {
          const columnCount = data.table.columns.length;

          for (let i = 0; i < columnCount; i++) {
            const cell = data.row.cells[i];
            if (cell && cell.styles) {
              cell.styles.fontStyle = "bold";
            }
          }
        }
      },
    });

    const resumoData = [
      [{ content: "Resumo", colSpan: 5 }],
      ["Receita", "Dinheiro", "Pix", "Cartão", "Total"],
    ];

    resumoData.push([
      "Monitores",
      formatNumero(data[0].monitor[iMonitor].total.finalTotal.dinheiro),
      formatNumero(data[0].monitor[iMonitor].total.finalTotal.pix),
      formatNumero(0),
      formatNumero(data[0].monitor[iMonitor].total.finalTotal.TotalValor),
    ]);

    resumoData.push([
      "Parceiros",
      formatNumero(data[0].parceiro[iParceiro].total.finalTotal.dinheiro),
      formatNumero(data[0].parceiro[iParceiro].total.finalTotal.pix),
      formatNumero(0),
      formatNumero(data[0].parceiro[iParceiro].total.finalTotal.TotalValor),
    ]);

    resumoData.push([
      "CLIENTES APP",
      formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.dinheiro),
      formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.pix),
      formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.cartao),
      formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.TotalValor),
    ]);

    resumoData.push([
      "Avulso",
      formatNumero(data[0].avulso[iAvulso].total.finalTotal.dinheiro),
      formatNumero(data[0].avulso[iAvulso].total.finalTotal.pix),
      formatNumero(0),
      formatNumero(data[0].avulso[iAvulso].total.finalTotal.TotalValor),
    ]);

    resumoData.push([
      "Chatbot",
      formatNumero(data[0].chatbot[iChatbot].total.finalTotal.dinheiro),
      formatNumero(data[0].chatbot[iChatbot].total.finalTotal.pix),
      formatNumero(0),
      formatNumero(data[0].chatbot[iChatbot].total.finalTotal.TotalValor),
    ]);

    resumoData.push([
      "Faturamento total",
      formatNumero(
        data[0].parceiro[iParceiro].total.finalTotal.dinheiro +
          data[0].monitor[iMonitor].total.finalTotal.dinheiro +
          data[0].aplicativo[iAplicativo].total.finalTotal.dinheiro +
          data[0].avulso[iAvulso].total.finalTotal.dinheiro +
          data[0].chatbot[iChatbot].total.finalTotal.dinheiro
      ),
      formatNumero(
        data[0].parceiro[iParceiro].total.finalTotal.pix +
          data[0].monitor[iMonitor].total.finalTotal.pix +
          data[0].aplicativo[iAplicativo].total.finalTotal.pix +
          data[0].avulso[iAvulso].total.finalTotal.pix +
          data[0].chatbot[iChatbot].total.finalTotal.pix
      ),
      formatNumero(data[0].aplicativo[iAplicativo].total.finalTotal.cartao),
      formatNumero(
        data[0].parceiro[iParceiro].total.finalTotal.TotalValor +
          data[0].monitor[iMonitor].total.finalTotal.TotalValor +
          data[0].aplicativo[iAplicativo].total.finalTotal.TotalValor +
          data[0].avulso[iAvulso].total.finalTotal.TotalValor +
          data[0].chatbot[iChatbot].total.finalTotal.TotalValor
      ),
    ]);

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
      theme: "grid",
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

    doc.save(`Relatório de Prestação de Contas ${dataFiltrada}.pdf`);
  };

  /**
   * Consulta a API e prepara os dados para exibição.
   * Garante que todos os perfis (Monitor, Parceiro, Aplicativo, Avulso, Chatbot)
   * sempre tenham pelo menos uma linha do perfil e uma linha "Total" zerada,
   * mesmo se não houver movimentos.
   * Também protege contra erros de acesso a propriedades de arrays nulos/undefined.
   * @param {string} consulta - String JSON com os filtros da consulta
   */
  const handleConsulta = (consulta) => {
    setDataFiltrada("");
    setEstado2(false);
    setEstadoLoading(true);
    const queryObject = JSON.parse(consulta);

    if (queryObject) {
      const periodoCondition = queryObject.where.find(
        (condition) => condition.field === "periodo"
      );
      const dataCondition = queryObject.where.find(
        (condition) => condition.field === "data"
      );
      if (periodoCondition && periodoCondition.value) {
        const periodoValue = periodoCondition.value;
        const formattedPeriodoValue = `Período: De ${new Date(
          periodoValue[0] + "T00:00:00"
        ).toLocaleDateString("pt-BR")} até ${new Date(
          periodoValue[1]
        ).toLocaleDateString("pt-BR")}`;
        setDataFiltrada(formattedPeriodoValue);
      } else if (dataCondition && dataCondition.value) {
        let dataValue = dataCondition.value;
        dataValue = dataValue.replace(/%/g, "");
        const date = new Date(dataValue);
        const localDate = new Date(
          date.getTime() + date.getTimezoneOffset() * 60000
        );
        const formattedDataValue = `Data: ${localDate.toLocaleDateString(
          "pt-BR"
        )}`;
        setDataFiltrada(formattedDataValue);
      }
    }
    const requisicao = createAPI();
    const base64 = btoa(consulta);
    requisicao
      .get(`/financeiro/admin?query=${base64}`)
      .then((res) => {
        if (res.data.msg.resultado) {
          setEstadoLoading(false);
          setEstado(true);
          setData(res.data.data);

          /**
           * Normaliza os dados de um perfil para garantir que sempre haja pelo menos
           * uma linha do perfil e uma linha "Total" (ambas zeradas se não houver movimentos).
           * Também garante que, se vier apenas o total, o perfil aparece zerado antes.
           * @param {Array} array - Array de dados do perfil vindo da API
           * @param {string} perfilNome - Nome do perfil (ex: "Monitor")
           * @returns {Array} Array normalizado para exibição na tabela
           */
          function normalizarCategoria(array, perfilNome) {
            // Se não vier array ou vier vazio, retorna perfil e total zerado
            if (!Array.isArray(array) || array.length === 0) {
              return [
                {
                  perfil: perfilNome,
                  nome: null,
                  totalRegularizacao: 0,
                  totalEstacionamento: 0,
                  totalRecarga: 0,
                  finalTotal: 0,
                },
                {
                  perfil: "Total",
                  nome: null,
                  totalRegularizacao: 0,
                  totalEstacionamento: 0,
                  totalRecarga: 0,
                  finalTotal: 0,
                },
              ];
            }

            // Se vier só o total, retorna perfil zerado e o total
            if (
              array.length === 1 &&
              array[0].total &&
              !array[0].nome &&
              !array[0].Regularizacao
            ) {
              return [
                {
                  perfil: perfilNome,
                  nome: null,
                  totalRegularizacao: 0,
                  totalEstacionamento: 0,
                  totalRecarga: 0,
                  finalTotal: 0,
                },
                {
                  perfil: "Total",
                  nome: null,
                  totalRegularizacao:
                    array[0].total.Regularizacao?.TotalValor ?? 0,
                  totalEstacionamento:
                    array[0].total.estacionamento?.TotalValor ?? 0,
                  totalRecarga:
                    array[0].total.creditosInseridos?.TotalValor ?? 0,
                  finalTotal: array[0].total.finalTotal?.TotalValor ?? 0,
                },
              ];
            }

            // Caso normal: mapeia os itens e o total
            let mapped = array.map((item) => {
              if (item.total) {
                return {
                  perfil: "Total",
                  nome: null,
                  totalRegularizacao: item.total.Regularizacao?.TotalValor ?? 0,
                  totalEstacionamento:
                    item.total.estacionamento?.TotalValor ?? 0,
                  totalRecarga: item.total.creditosInseridos?.TotalValor ?? 0,
                  finalTotal: item.total.finalTotal?.TotalValor ?? 0,
                };
              }
              return {
                perfil: perfilNome,
                nome: item.nome ?? null,
                totalRegularizacao: item.Regularizacao?.TotalValor ?? 0,
                totalEstacionamento: item.estacionamento?.TotalValor ?? 0,
                totalRecarga: item.creditosInseridos?.TotalValor ?? 0,
                finalTotal: item.finalTotal?.TotalValor ?? 0,
              };
            });

            // Se não veio total, adiciona total zerado
            if (!mapped.some((item) => item.perfil === "Total")) {
              mapped.push({
                perfil: "Total",
                nome: null,
                totalRegularizacao: 0,
                totalEstacionamento: 0,
                totalRecarga: 0,
                finalTotal: 0,
              });
            }

            return mapped;
          }

          const data0 = res.data.data[0] || {};
          const monitorArr = Array.isArray(data0.monitor) ? data0.monitor : [];
          const parceiroArr = Array.isArray(data0.parceiro)
            ? data0.parceiro
            : [];
          const aplicativoArr = Array.isArray(data0.aplicativo)
            ? data0.aplicativo
            : [];
          const avulsoArr = Array.isArray(data0.avulso) ? data0.avulso : [];
          const chatbotArr = Array.isArray(data0.chatbot) ? data0.chatbot : [];

          let newData = normalizarCategoria(monitorArr, "Monitor");
          const newData2 = normalizarCategoria(parceiroArr, "Parceiro");
          const newData3 = normalizarCategoria(aplicativoArr, "Aplicativo");
          const newData5 = normalizarCategoria(avulsoArr, "Avulso");
          const newData6 = normalizarCategoria(chatbotArr, "Chatbot");

          // Total geral
          const iParceiro = parceiroArr.length > 0 ? parceiroArr.length - 1 : 0;
          const iMonitor = monitorArr.length > 0 ? monitorArr.length - 1 : 0;
          const iAplicativo =
            aplicativoArr.length > 0 ? aplicativoArr.length - 1 : 0;
          const iAvulso = avulsoArr.length > 0 ? avulsoArr.length - 1 : 0;
          const iChatbot = chatbotArr.length > 0 ? chatbotArr.length - 1 : 0;

          const newData4 = {
            nome: null,
            perfil: "Total geral",
            totalRegularizacao:
              (parceiroArr[iParceiro]?.total?.Regularizacao?.TotalValor ?? 0) +
              (monitorArr[iMonitor]?.total?.Regularizacao?.TotalValor ?? 0) +
              (aplicativoArr[iAplicativo]?.total?.Regularizacao?.TotalValor ??
                0) +
              (avulsoArr[iAvulso]?.total?.Regularizacao?.TotalValor ?? 0) +
              (chatbotArr[iChatbot]?.total?.Regularizacao?.TotalValor ?? 0),
            totalEstacionamento:
              (parceiroArr[iParceiro]?.total?.estacionamento?.TotalValor ?? 0) +
              (monitorArr[iMonitor]?.total?.estacionamento?.TotalValor ?? 0) +
              (aplicativoArr[iAplicativo]?.total?.estacionamento?.TotalValor ??
                0) +
              (avulsoArr[iAvulso]?.total?.estacionamento?.TotalValor ?? 0) +
              (chatbotArr[iChatbot]?.total?.estacionamento?.TotalValor ?? 0),
            totalRecarga:
              (parceiroArr[iParceiro]?.total?.creditosInseridos?.TotalValor ??
                0) +
              (monitorArr[iMonitor]?.total?.creditosInseridos?.TotalValor ??
                0) +
              (aplicativoArr[iAplicativo]?.total?.creditosInseridos
                ?.TotalValor ?? 0) +
              (avulsoArr[iAvulso]?.total?.creditosInseridos?.TotalValor ?? 0) +
              (chatbotArr[iChatbot]?.total?.creditosInseridos?.TotalValor ?? 0),
            finalTotal:
              (parceiroArr[iParceiro]?.total?.finalTotal?.TotalValor ?? 0) +
              (monitorArr[iMonitor]?.total?.finalTotal?.TotalValor ?? 0) +
              (aplicativoArr[iAplicativo]?.total?.finalTotal?.TotalValor ?? 0) +
              (avulsoArr[iAvulso]?.total?.finalTotal?.TotalValor ?? 0) +
              (chatbotArr[iChatbot]?.total?.finalTotal?.TotalValor ?? 0),
          };

          newData = [
            ...newData,
            ...newData2,
            ...newData3,
            ...newData5,
            ...newData6,
            newData4,
          ];
          setData2(newData);
        } else {
          setData([]);
          setEstadoLoading(false);
          setEstado(true);
          setEstado2(true);
          setMensagem(res.data.msg.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAtualiza = (consulta) => {
    setEstado2(false);
    setEstadoLoadingPix(true);
    const requisicao = createAPI();
    const base64 = btoa(consulta);
    requisicao
      .get(`/financeiro/update/pix?query=${base64}`)
      .then((res) => {
        if (res.data.msg.resultado) {
          setEstadoLoadingPix(false);
          Swal.fire({
            icon: "success",
            title: "Sucesso!",
            text: res.data.msg.msg,
          });
        } else {
          setEstadoLoadingPix(false);
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: res.data.msg.msg,
          });
        }
      })
      .catch((err) => {
        setEstadoLoadingPix(false);
        console.log(err);
      });
  };

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
                  <Filtro
                    nome={"PrestacaoContas"}
                    onConsultaSelected={handleConsulta}
                    onLoading={estadoLoading}
                  />
                </div>
                <div className="col-3">
                  <AtualizarPix
                    nome={"PrestacaoContas"}
                    onConsultaSelected={handleAtualiza}
                    onLoading={estadoLoadingPix}
                  />
                </div>
                <div className="col-2">
                  {estado ? (
                    <button
                      className="btn3 botao p-0 m-0 w-100 h-100"
                      type="button"
                      onClick={() => {
                        gerarPdf();
                      }}
                    >
                      <AiFillPrinter size={21} />
                    </button>
                  ) : (
                    <button
                      className="btn2 botao p-0 m-0 w-100 h-100"
                      disabled
                      type="button"
                    >
                      <AiFillPrinter size={21} />
                    </button>
                  )}
                </div>
              </div>
              <div className="text-start ms-4">
                <p>
                  <strong>{dataFiltrada}</strong>
                </p>
              </div>
              <div className="card border-0 shadow">
                {estadoLoading ? (
                  <div className="text-center py-4">
                    <CarroLoading />
                  </div>
                ) : estado ? (
                  <div className="table-responsive">
                    <table className="table align-items-center table-flush">
                      <thead className="thead-light">
                        <tr>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Perfil
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Nome
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Regularização
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Estacionamento
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Recarga
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Total arrecadado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data2.map((item, index) =>
                          item.totalRegularizacao !== null ? (
                            <tr className="card-list" key={index}>
                              <th
                                className={
                                  item.perfil === "Total" ||
                                  item.perfil === "Total geral"
                                    ? "fw-bolder col"
                                    : "col"
                                }
                                id="tabelaUsuarios"
                              >
                                {item.perfil}
                              </th>
                              <td
                                className={
                                  item.perfil === "Total" ||
                                  item.perfil === "Total geral"
                                    ? "fw-bolder col"
                                    : "col"
                                }
                                scope="row"
                                id="tabelaUsuarios"
                              >
                                {["Avulso", "Chatbot", "Aplicativo"].includes(
                                  item.perfil
                                )
                                  ? ""
                                  : typeof item.nome === "string" &&
                                    item.nome.length > 14
                                  ? item.nome.substring(0, 14) + "..."
                                  : item.nome || ""}
                              </td>
                              <td
                                className={
                                  item.perfil === "Total" ||
                                  item.perfil === "Total geral"
                                    ? "fw-bolder col"
                                    : "col"
                                }
                                id="tabelaUsuarios2"
                              >
                                {formatNumero(item.totalRegularizacao)}
                              </td>
                              <td
                                className={
                                  item.perfil === "Total" ||
                                  item.perfil === "Total geral"
                                    ? "fw-bolder col"
                                    : "col"
                                }
                                id="tabelaUsuarios2"
                              >
                                {formatNumero(item.totalEstacionamento)}
                              </td>
                              <td
                                className={
                                  item.perfil === "Total" ||
                                  item.perfil === "Total geral"
                                    ? "fw-bolder col"
                                    : "col"
                                }
                                id="tabelaUsuarios2"
                              >
                                {formatNumero(item.totalRecarga)}
                              </td>
                              <td
                                className={
                                  item.perfil === "Total" ||
                                  item.perfil === "Total geral"
                                    ? "fw-bolder col"
                                    : "col"
                                }
                                id="tabelaUsuarios"
                              >
                                {formatNumero(item.finalTotal)}
                              </td>
                            </tr>
                          ) : null
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-muted mb-2">
                      <i
                        className="bi bi-calendar3"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                    </div>
                    <p className="small text-muted mb-0">
                      Use o filtro para selecionar uma data ou período
                    </p>
                  </div>
                )}
              </div>
              <div
                className="alert alert-danger mt-4 mx-3"
                role="alert"
                style={{ display: estado2 ? "block" : "none" }}
              >
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
