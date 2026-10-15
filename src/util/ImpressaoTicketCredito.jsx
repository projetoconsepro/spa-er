const ImpressaoTicketCredito = async (cpf, valor, pagamento, monitor) => {
  const obterHoraAtual = () => {
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, "0");
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
    const ano = dataAtual.getFullYear().toString();
    const hora = dataAtual.getHours().toString().padStart(2, "0");
    const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
    const segundos = dataAtual.getSeconds().toString().padStart(2, "0");
    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
  };

  const json = {
    tipo: "CREDITOS INSERIDOS",
    dataEmissao: obterHoraAtual(),
    monitor: monitor,
    valor: valor,
    cpf: cpf[0],
    pagamento: pagamento,
  };

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(json));
  }

  localStorage.setItem("ultimoComprovanteCredito", JSON.stringify(json));
};

export const existeUltimoComprovanteCredito = () =>
  localStorage.getItem("ultimoComprovanteCredito") !== null;

export const reimprimirUltimoComprovanteCredito = () => {
  const json = localStorage.getItem("ultimoComprovanteCredito");

  if (!json) {
    return false;
  }

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(json);
  }

  return true;
};

export default ImpressaoTicketCredito;
