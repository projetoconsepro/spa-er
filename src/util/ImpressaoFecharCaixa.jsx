import {FormatDateBr} from "../util/formatDate";
const ImpressaoFecharCaixa = async (item, valor, monitor) => {
  const horaAtual = new Date().toLocaleTimeString('pt-BR');

  const json = {
    tipo: "FECHAMENTO DE CAIXA",
    dataEmissao: `${FormatDateBr(item.data)} \n\n Hora Abertura: ${item.hora_abertura} \n\n Gerado em: ${horaAtual}`,
    monitor: monitor,
    valorMovimento: item.valor_movimentos,
    valorAbertura: item.valor_abertura,
    valorFechamento: valor,
  };
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(json));
  }
};

export default ImpressaoFecharCaixa;
