import TicketPDFBase from "./TicketPDFBase";

const NotificacaoPDF = (json) => {
  const valorNumero = Number(String(json.valor ?? "0").replace(",", "."));
  const valorFormatado = `Valor: R$ ${
    Number.isFinite(valorNumero) ? valorNumero.toFixed(2) : "0.00"
  }`;

  const ehRegularizacao = json.tipo === "REGULARIZACAO";
  const titulo = ehRegularizacao
    ? "COMPROVANTE DE REGULARIZAÇÃO"
    : "Notificação de Estacionamento Irregular";

  const linhasData = ehRegularizacao
    ? (() => {
        const [dataRegularizacao, horaNotificacao] = String(json.dataEmissao ?? "")
          .split("Hora Notif.:")
          .map((parte) => parte.replace(/\n/g, " ").trim());
        return [
          { texto: `Data regularização: ${dataRegularizacao}`, tamanhoFonte: 12, espacamento: 10 },
          { texto: `Hora notificação: ${horaNotificacao}`, tamanhoFonte: 12, espacamento: 10 },
        ];
      })()
    : [{ texto: `Data: ${json.dataEmissao}`, tamanhoFonte: 12, espacamento: 10 }];

  TicketPDFBase(
    titulo,
    [
      ...linhasData,
      { texto: `Placa: ${json.placa}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Vaga: ${json.vaga}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Modelo: ${json.modelo}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Fabricante: ${json.fabricante}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Endereço: ${json.endereco}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Motivo: ${json.motivo}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: `Monitor: ${json.monitor}`, tamanhoFonte: 12, espacamento: 10 },
      { texto: valorFormatado, tamanhoFonte: 12, espacamento: 14 },
    ],
    `${ehRegularizacao ? "Comprovante" : "Notificacao"} - ${json.placa}`
  );
};

export default NotificacaoPDF;
