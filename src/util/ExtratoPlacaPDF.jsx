import TicketPDFBase from "./TicketPDFBase";

const ExtratoPlacaPDF = (json) => {
  const [vagaNumero, valorLinha] = String(json.vaga ?? "").split("\n");
  const valorNumero = parseFloat(
    String(valorLinha ?? "").replace(/[^\d.,-]/g, "").replace(",", ".")
  );
  const valorFormatado = `Valor: R$ ${
    Number.isFinite(valorNumero) ? valorNumero.toFixed(2) : "0.00"
  }`;

  TicketPDFBase(
    "Estacionamento rotativo",
    [
      { texto: `Tipo: ${json.tipo}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Placa: ${json.placa}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Vaga: ${vagaNumero}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Início: ${json.dataHoje} ${json.horaInicio}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Validade: ${json.dataHoje} ${json.horaValidade}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Monitor: ${json.monitor}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Método: ${json.metodo}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: valorFormatado, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Notificações pendentes: ${json.notificacaoPendente ?? 0}`, tamanhoFonte: 12, espacamento: 14 },
    ],
    `Extrato de Placa - ${json.placa}`
  );
};

export default ExtratoPlacaPDF;
