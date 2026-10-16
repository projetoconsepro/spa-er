import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "./logoconseproof2.png";
import formatNumero from "./formatNumero";
import { FormatDateIsoBr } from "./formatDate";

const MARGEM = 15;

const formatarMoeda = (valor) => `R$ ${formatNumero(valor)}`;

const formatarQuantidade = (quantidade) => quantidade.toLocaleString("pt-BR");

const descreverPeriodo = ({ dataInicio, dataFim }) =>
  dataInicio === dataFim
    ? FormatDateIsoBr(dataInicio)
    : `${FormatDateIsoBr(dataInicio)} a ${FormatDateIsoBr(dataFim)}`;

const RelatorioSetorPDF = (relatorio, secao) => {
  const usuario = JSON.parse(localStorage.getItem("user"));
  const doc = new jsPDF();
  const alturaPagina = doc.internal.pageSize.height;
  const agora = new Date();
  const dia = agora.getDate().toString().padStart(2, "0");
  const mes = (agora.getMonth() + 1).toString().padStart(2, "0");
  const ano = agora.getFullYear().toString();
  const hora = agora.getHours().toString().padStart(2, "0");
  const minuto = agora.getMinutes().toString().padStart(2, "0");
  const { setor, periodo, resumo, dias, vagas } = relatorio;

  const estiloTabela = {
    theme: "grid",
    styles: { fontSize: 9 },
    margin: { left: MARGEM, right: MARGEM, top: MARGEM },
    rowPageBreak: "avoid",
    showHead: "everyPage",
    showFoot: "lastPage",
    footStyles: { fontStyle: "bold" },
  };

  const posicionarTitulo = (texto) => {
    let y = doc.lastAutoTable.finalY + 12;
    if (y > alturaPagina - 40) {
      doc.addPage();
      y = MARGEM + 5;
    }
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(texto, MARGEM, y);
    return y + 3;
  };

  doc.addImage(Logo, "PNG", doc.internal.pageSize.width - MARGEM - 30, 6, 30, 12);
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text("Relatório por Setor", MARGEM, 12);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado por: ${usuario.nome}`, MARGEM, 19);
  doc.text(`Data: ${dia}/${mes}/${ano} ${hora}:${minuto}`, MARGEM, 24);
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text(`Setor: ${setor.nome}`, MARGEM, 33);
  doc.text(`Período: ${descreverPeriodo(periodo)}`, MARGEM, 39);

  autoTable(doc, {
    ...estiloTabela,
    startY: 44,
    head: [["Valor total", "Vagas", "Créditos", "Regularizações", "Notificações"]],
    body: [[
      formatarMoeda(resumo.valorTotal),
      formatarQuantidade(resumo.quantidadeVagas),
      formatarQuantidade(resumo.quantidadeCreditos),
      formatarQuantidade(resumo.quantidadeRegularizacoes),
      formatarQuantidade(resumo.quantidadeNotificacoes),
    ]],
    styles: { fontSize: 10, halign: "center" },
  });

  const totalAlinhado = { content: formatarMoeda(resumo.valorTotal), styles: { halign: "right" } };

  if (secao === "dias") {
    autoTable(doc, {
      ...estiloTabela,
      startY: posicionarTitulo("Arrecadação por dia"),
      head: [["Data", "Valor"]],
      body: dias.map((item) => [FormatDateIsoBr(item.data), formatarMoeda(item.valor)]),
      foot: [["Total", totalAlinhado]],
      columnStyles: { 1: { halign: "right" } },
    });
  } else {
    autoTable(doc, {
      ...estiloTabela,
      startY: posicionarTitulo("Arrecadação por vaga"),
      head: [["Vaga", "Localização", "Valor"]],
      body: vagas.map((vaga) => [
        vaga.ativa ? vaga.numero : `${vaga.numero} (inativa)`,
        vaga.local?.trim() || "Não informado",
        formatarMoeda(vaga.valor),
      ]),
      foot: [["Total", "", totalAlinhado]],
      columnStyles: {
        0: { cellWidth: 28 },
        2: { cellWidth: 32, halign: "right" },
      },
    });
  }

  const totalPaginas = doc.internal.getNumberOfPages();
  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    doc.setPage(pagina);
    doc.setFontSize(10);
    doc.setTextColor(100);
    const texto = `Página ${pagina} / ${totalPaginas}`;
    doc.text(texto, (doc.internal.pageSize.width - doc.getTextWidth(texto)) / 2, alturaPagina - 3);
  }

  const nomeSecao = secao === "dias" ? "por dia" : "por vaga";
  doc.save(`${dia}-${mes}-${ano.slice(-2)} - Relatório Setor ${setor.nome} ${nomeSecao}.pdf`);
};

export { descreverPeriodo, formatarMoeda, formatarQuantidade };
export default RelatorioSetorPDF;
