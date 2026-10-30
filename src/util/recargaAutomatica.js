import Swal from "sweetalert2";
import createAPI from "../services/createAPI";
import FuncTrocaComp from "./FuncTrocaComp";

export const EVENTO_DEBITO_AUTOMATICO_ALTERADO = "debitoAutomaticoAlterado";

const VALIDADE_ACESSO_MS = 5000;
const SEM_ACESSO = { elegivel: false, possuiHistorico: false, acesso: false, historico: false };
let acessoEmCache = null;

const buscarAcessoRecarga = async (entrada) => {
  try {
    const resposta = await createAPI().get("/cartao/recarga-automatica");
    if (resposta.data.msg.resultado) {
      const { elegivel, disponivel, possuiHistorico } = resposta.data.data;
      const acesso = elegivel === true && disponivel === true;
      return {
        elegivel: elegivel === true,
        possuiHistorico: possuiHistorico === true,
        acesso,
        historico: acesso || possuiHistorico === true,
      };
    }
  } catch (error) {
    console.log(error);
  }
  if (acessoEmCache === entrada) {
    acessoEmCache = null;
  }
  return { ...SEM_ACESSO, falhou: true };
};

export const consultarAcessoRecarga = () => {
  const agora = Date.now();
  const sessao = localStorage.getItem("token");
  if (
    acessoEmCache &&
    acessoEmCache.promessa &&
    acessoEmCache.sessao === sessao &&
    agora - acessoEmCache.instante < VALIDADE_ACESSO_MS
  ) {
    return acessoEmCache.promessa;
  }
  const entrada = { promessa: null, instante: agora, sessao };
  acessoEmCache = entrada;
  entrada.promessa = buscarAcessoRecarga(entrada);
  return entrada.promessa;
};

if (typeof window !== "undefined") {
  window.addEventListener(EVENTO_DEBITO_AUTOMATICO_ALTERADO, () => {
    acessoEmCache = null;
  });
}

export const podeVerRecargaAutomatica = async () => (await consultarAcessoRecarga()).acesso;

const CHAVE_ORIGEM_RECARGA = "origemRecargaAutomatica";

export const abrirCadastroCartaoDaRecarga = () => {
  localStorage.setItem(CHAVE_ORIGEM_RECARGA, localStorage.getItem("componenteAnterior") || "");
  FuncTrocaComp("CartaoCredito");
};

export const restaurarOrigemDaRecarga = () => {
  const origem = localStorage.getItem(CHAVE_ORIGEM_RECARGA);
  if (localStorage.getItem("componenteAnterior") === "CartaoCredito" && origem && origem !== "CartaoCredito") {
    localStorage.setItem("componenteAnterior", origem);
  }
  localStorage.removeItem(CHAVE_ORIGEM_RECARGA);
  return true;
};

export const codificarFiltro = (consulta) => btoa(unescape(encodeURIComponent(consulta)));

export const formatarValor = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const nomeBandeira = {
  visa: "Visa",
  mastercard: "Mastercard",
  elocard: "Elo",
};

export const descreverCartao = (cartao) =>
  cartao ? `${nomeBandeira[cartao.bandeira] || "Cartão"} •••• ${cartao.cartao}` : "";

export const formatarDataHora = (data) => {
  const date = new Date(data);
  if (Number.isNaN(date.getTime())) return "";
  const dia = date.toLocaleDateString("pt-BR");
  const hora = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${dia} às ${hora}`;
};

export const tratarErroRequisicao = (error) => {
  if (
    error?.response?.data?.msg === "Cabeçalho inválido!" ||
    error?.response?.data?.msg === "Token inválido!" ||
    error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"
  ) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("perfil");
  } else {
    console.log(error);
  }
};

export const avisarFalhaComunicacao = () =>
  Swal.fire(
    "Não foi possível confirmar",
    "Houve uma falha de comunicação. Consulte o histórico da recarga automática antes de tentar de novo.",
    "warning"
  );

export const ROTULO_STATUS = {
  APROVADO: "Aprovado",
  RECUSADO: "Recusado",
  PROCESSANDO: "Em processamento",
};

export const textoLimiteDiario = (maximoPorDia) =>
  `Você já teve ${maximoPorDia || "o máximo de"} recargas automáticas hoje. Se o saldo ficar baixo de novo, a próxima acontece amanhã.`;

export const mostrarResultadoRecarga = (
  status,
  valor,
  mensagemPadrao,
  maximoPorDia,
  limiteAtingido = false,
  saldoMinimo = 0
) => {
  if (status === "SEM_CARTAO") {
    return Swal.fire(
      "Recarga automática ativada",
      `Seu saldo já está em ${formatarValor(saldoMinimo)} ou menos. Adicione um cartão de crédito agora; sem cartão, a recarga será desligada na próxima verificação.`,
      "warning"
    );
  }
  if (status === "SUSPENSA") {
    return Swal.fire(
      "Alterações salvas",
      "A recarga automática continua suspensa. Para voltar a cobrar, toque em Tentar novamente.",
      "warning"
    );
  }
  if (status === "LIMITE_DIARIO") {
    return Swal.fire("Limite diário atingido", textoLimiteDiario(maximoPorDia), "info");
  }
  if (status === "APROVADO") {
    const avisoLimite = limiteAtingido ? ` ${textoLimiteDiario(maximoPorDia)}` : "";
    return Swal.fire("Recarga realizada!", `Adicionamos ${formatarValor(valor)} ao seu saldo.${avisoLimite}`, "success");
  }
  if (status === "RECUSADO") {
    return Swal.fire(
      "Recarga recusada",
      "A recarga automática ficou suspensa. Confira o cartão e toque em Tentar novamente.",
      "error"
    );
  }
  if (status === "PROCESSANDO") {
    return Swal.fire(
      "Em processamento",
      "Estamos confirmando a cobrança com a operadora do cartão. Você receberá um e-mail e uma notificação no aplicativo com o resultado.",
      "info"
    );
  }
  return Swal.fire("Confirmado!", mensagemPadrao, "success");
};
