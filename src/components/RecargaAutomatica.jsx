import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  createStyles,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Portal,
  Text,
  ThemeIcon,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconCircleCheck,
  IconCreditCard,
  IconHelpCircle,
  IconHistory,
  IconPlus,
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import createAPI from "../services/createAPI";
import FuncTrocaComp from "../util/FuncTrocaComp";
import VoltarComponente from "../util/VoltarComponente";
import TermoRecargaAutomatica from "./TermoRecargaAutomatica";
import AvisoFalhaRecarga, { AvisoLimiteDiario, CardAviso } from "./AvisoFalhaRecarga";
import CabecalhoRecarga, { estadoRecarga, StatusRecarga } from "./CabecalhoRecarga";
import {
  EVENTO_DEBITO_AUTOMATICO_ALTERADO,
  abrirCadastroCartaoDaRecarga,
  avisarFalhaComunicacao,
  descreverCartao,
  formatarValor,
  nomeBandeira,
  mostrarResultadoRecarga,
  restaurarOrigemDaRecarga,
  textoLimiteDiario,
  tratarErroRequisicao,
} from "../util/recargaAutomatica";

const AZUL = "#228BE6";
const GRADIENTE = "linear-gradient(45deg, #15AABF 0%, #228BE6 100%)";
const BORDA = "1px solid #dee2e6";
const LIMITE_CARTOES = 3;

const imagemBandeira = {
  visa: ["visa.png", "visa-unselected.png"],
  mastercard: ["mastercard.png", "mastercard.png"],
  elocard: ["elocard.png", "elocard-unselected.png"],
};

const selecaoInicial = (dados) => {
  const valorSalvo = dados.valores.includes(dados.valor) ? dados.valor : null;
  const cartaoSalvo = dados.cartoes.some((c) => c.id_cartao === dados.idCartao) ? dados.idCartao : null;
  const ativo = dados.ativo === "S";
  return {
    valor: valorSalvo ?? (!ativo && dados.valores.length > 0 ? dados.valores[0] : null),
    idCartao: cartaoSalvo ?? (!ativo && dados.cartoes.length > 0 ? dados.cartoes[0].id_cartao : null),
  };
};

const IconeBandeira = ({ bandeira, selecionado }) => {
  const imagens = imagemBandeira[bandeira];
  if (!imagens) {
    return (
      <div style={{ width: 40, display: "flex", justifyContent: "center" }}>
        <IconCreditCard size={26} color={selecionado ? "white" : "#495057"} />
      </div>
    );
  }
  return (
    <Image
      src={`../../assets/img/cartaoCredito/${selecionado ? imagens[0] : imagens[1]}`}
      alt={nomeBandeira[bandeira]}
      width={40}
      height={40}
      fit="contain"
    />
  );
};

const estiloOpcao = (selecionado) => ({
  width: "100%",
  borderRadius: 8,
  border: selecionado ? "1px solid transparent" : BORDA,
  backgroundColor: selecionado ? AZUL : "white",
  backgroundImage: selecionado ? GRADIENTE : "none",
  color: selecionado ? "white" : "#212529",
  cursor: "pointer",
  transition: "background-color 150ms ease-out, border-color 150ms ease-out",
});

const Resumo = ({ rotulo, valor, detalhe, separado }) => (
  <div style={{ padding: "12px 16px", borderLeft: separado ? BORDA : "none", minWidth: 0 }}>
    <Text size="xs" color="dimmed" style={{ lineHeight: 1.3 }}>
      {rotulo}
    </Text>
    <Text weight={700} size="xl" style={{ lineHeight: 1.25, color: "#212529", fontVariantNumeric: "tabular-nums" }}>
      {valor}
    </Text>
    <Text
      size="xs"
      style={{ color: "#495057", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
    >
      {detalhe}
    </Text>
  </div>
);

const cartoesVisiveis = (cartoes, idSelecionado, expandido) => {
  if (expandido || cartoes.length <= LIMITE_CARTOES) return cartoes;
  const primeiros = cartoes.slice(0, LIMITE_CARTOES);
  const selecionado = cartoes.find((c) => c.id_cartao === idSelecionado);
  if (!selecionado || primeiros.includes(selecionado)) return primeiros;
  return [...primeiros.slice(0, LIMITE_CARTOES - 1), selecionado];
};

const useStyles = createStyles((theme) => ({
  pagina: {
    [theme.fn.largerThan("sm")]: {
      maxWidth: 1600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  opcoes: {
    [theme.fn.largerThan("sm")]: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
      gap: 16,
      alignItems: "start",
    },
  },
  cartaoCredito: {
    marginTop: 16,
    [theme.fn.largerThan("sm")]: {
      marginTop: 0,
    },
  },
  valores: {
    display: "grid",
    gridTemplateColumns: "repeat(var(--colunas-valor), minmax(0, 1fr))",
    gap: 8,
    [theme.fn.largerThan("sm")]: {
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
  listaCartoes: {
    [theme.fn.largerThan("lg")]: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      columnGap: 8,
    },
  },
}));

const RecargaAutomatica = () => {
  useState(restaurarOrigemDaRecarga);
  const { classes } = useStyles();
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [config, setConfig] = useState(null);
  const [valor, setValor] = useState(null);
  const [idCartao, setIdCartao] = useState(null);
  const [termoAberto, setTermoAberto] = useState(false);
  const [termoLeitura, setTermoLeitura] = useState(false);
  const [aviso, setAviso] = useState("");
  const [todosCartoes, setTodosCartoes] = useState(false);
  const [erroValor, setErroValor] = useState(false);
  const [alturaBarra, setAlturaBarra] = useState(0);
  const avisoRef = useRef(null);
  const avisoTimerRef = useRef(null);
  const valorRef = useRef(null);
  const observadorBarraRef = useRef(null);

  const inicial = config ? selecaoInicial(config) : null;
  const alterado = Boolean(
    config && config.ativo === "S" && (valor !== inicial.valor || idCartao !== inicial.idCartao),
  );
  const barraVisivel = Boolean(config && config.disponivel && alterado && valor);

  const definirBarra = useCallback((no) => {
    if (observadorBarraRef.current) {
      observadorBarraRef.current.disconnect();
      observadorBarraRef.current = null;
    }
    if (!no) {
      setAlturaBarra(0);
      return;
    }
    setAlturaBarra(no.offsetHeight);
    if (typeof ResizeObserver !== "undefined") {
      const observador = new ResizeObserver(() => setAlturaBarra(no.offsetHeight));
      observador.observe(no);
      observadorBarraRef.current = observador;
    }
  }, []);

  const carregar = async (atualizarSelecao = true) => {
    const requisicao = createAPI();
    let redirecionou = false;
    try {
      const resposta = await requisicao.get("/cartao/recarga-automatica");
      if (resposta.data.msg.resultado) {
        const dados = resposta.data.data;
        if (dados.elegivel !== true) {
          redirecionou = true;
          localStorage.setItem("componente", "HistoricoRecargaAutomatica");
          return;
        }
        setConfig(dados);
        if (atualizarSelecao) {
          const selecao = selecaoInicial(dados);
          setValor(selecao.valor);
          setIdCartao(selecao.idCartao);
        }
      }
    } catch (error) {
      tratarErroRequisicao(error);
    } finally {
      if (!redirecionou) setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  useEffect(
    () => () => {
      clearTimeout(avisoTimerRef.current);
    },
    []
  );

  useEffect(() => {
    if (aviso && avisoRef.current) {
      avisoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [aviso]);

  useEffect(() => {
    if (erroValor && valorRef.current) {
      valorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [erroValor]);

  const mostrarAviso = (texto) => {
    clearTimeout(avisoTimerRef.current);
    setAviso(texto);
    avisoTimerRef.current = setTimeout(() => setAviso(""), 5000);
  };

  const escolherValor = (opcao) => {
    setValor(opcao);
    setErroValor(false);
  };

  const enviar = async (corpo, mensagemPadrao, statusPadrao) => {
    setEnviando(true);
    setAviso("");
    const requisicao = createAPI();
    let sucesso = false;
    let falhaComunicacao = false;
    let dadosResposta = null;
    try {
      try {
        const resposta = await requisicao.put("/cartao/recarga-automatica", corpo);
        if (resposta.data.msg.resultado) {
          sucesso = true;
          dadosResposta = resposta.data.data;
          window.dispatchEvent(new Event(EVENTO_DEBITO_AUTOMATICO_ALTERADO));
        } else {
          mostrarAviso(resposta.data.msg.msg);
        }
      } catch (error) {
        tratarErroRequisicao(error);
        falhaComunicacao = true;
      }
      await carregar(sucesso);
      if (sucesso) {
        await mostrarResultadoRecarga(
          dadosResposta?.recarga ?? statusPadrao,
          corpo.valor,
          mensagemPadrao,
          config.maximoPorDia,
          dadosResposta?.limiteAtingido,
          config.saldoMinimo
        );
      } else if (falhaComunicacao) {
        await avisarFalhaComunicacao();
      }
    } finally {
      setEnviando(false);
    }
    return sucesso;
  };

  const adicionarCartao = () => {
    abrirCadastroCartaoDaRecarga();
  };

  const ativar = () => {
    if (!valor && config.valores.length > 0) {
      setValor(config.valores[0]);
    }
    if (!idCartao && config.cartoes.length > 0) {
      setIdCartao(config.cartoes[0].id_cartao);
    }
    setTermoLeitura(false);
    setTermoAberto(true);
  };

  const desativar = () => {
    Swal.fire({
      title: "Desativar a recarga automática?",
      text: "Seu saldo não será mais recarregado automaticamente. Você pode ativar de novo quando quiser.",
      showCancelButton: true,
      confirmButtonText: "Sim, desativar",
      cancelButtonText: "Manter ativa",
      icon: "warning",
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        enviar({ ativo: "N" }, "A recarga automática foi desativada.");
      }
    });
  };

  const alternar = (ligar) => {
    if (ligar) {
      ativar();
    } else {
      desativar();
    }
  };

  const confirmarTermo = () => {
    setTermoAberto(false);
    enviar({ ativo: "S", valor, idCartao, aceiteTermo: true }, "A recarga automática foi ativada com sucesso!");
  };

  const descartarAlteracoes = () => {
    setValor(inicial.valor);
    setIdCartao(inicial.idCartao);
    setErroValor(false);
  };

  const salvarAlteracoes = () => {
    enviar({ ativo: "S", valor, idCartao }, "As alterações foram salvas.", config.suspensa ? "SUSPENSA" : undefined);
  };

  const tentarNovamente = () => {
    if (!valor) {
      setErroValor(true);
      return;
    }
    enviar({ ativo: "S", valor, idCartao, reativar: true }, "A recarga automática foi reativada.");
  };

  const abrirTermo = () => {
    setTermoLeitura(true);
    setTermoAberto(true);
  };

  if (carregando) {
    return (
      <div className="col-12 text-center mt-5">
        <Loader />
      </div>
    );
  }

  if (!config) {
    return (
      <div className={`col-12 px-3 mb-3 ${classes.pagina}`}>
        <CardAviso tom="vermelho" titulo="Aviso!" style={{ marginTop: 16 }}>
          Não foi possível carregar a recarga automática. Tente novamente mais tarde.
        </CardAviso>
        <Group position="center" mt="lg">
          <VoltarComponente />
        </Group>
      </div>
    );
  }

  const ativa = config.ativo === "S";
  const suspensa = ativa && config.suspensa;
  const editavel = ativa && config.disponivel;
  const indisponivel = !config.disponivel && !ativa;
  const foraDoAr = !config.disponivel;
  const temCartao = config.cartoes.length > 0;
  const { aparencia, subtitulo, alerta } = estadoRecarga(config);
  const listaCartoes = cartoesVisiveis(config.cartoes, idCartao, todosCartoes);
  const valorSaiuDaLista = ativa && config.valor != null && !config.valores.includes(config.valor);
  const resumoValor = ativa ? (valorSaiuDaLista ? null : config.valor) : valor;
  const resumoCartao = config.cartoes.find((c) => c.id_cartao === (ativa ? config.idCartao : idCartao));
  const resumoDetalhe = valorSaiuDaLista
    ? `${formatarValor(config.valor)} não está mais disponível`
    : resumoCartao
      ? descreverCartao(resumoCartao)
      : "Escolha o cartão";
  const estiloTravado = {
    opacity: editavel ? 1 : 0.6,
    filter: editavel ? "none" : "grayscale(0.7)",
    pointerEvents: editavel ? "auto" : "none",
    userSelect: editavel ? "auto" : "none",
    transition: "opacity 300ms ease-out, filter 300ms ease-out",
  };
  const estiloForaDoAr = foraDoAr ? { opacity: 0.6, filter: "grayscale(1)" } : {};

  const selecionarComTeclado = (evento, acao) => {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      acao();
    }
  };

  return (
    <div className={`col-12 px-0 mb-3 ${classes.pagina}`} style={{ position: "relative", paddingBottom: alturaBarra }}>
      <LoadingOverlay visible={enviando} overlayBlur={1} />

      <CabecalhoRecarga
        aparencia={aparencia}
        titulo={
          <Text weight={700} size="lg" style={{ lineHeight: 1.2, color: "#212529" }}>
            Recarga automática
            <ActionIcon
              size={24}
              radius="xl"
              variant="subtle"
              color="gray"
              aria-label="Ver termos da recarga automática"
              onClick={abrirTermo}
              style={{ display: "inline-flex", verticalAlign: "middle", marginLeft: 4, marginTop: -3 }}
            >
              <IconHelpCircle size={18} />
            </ActionIcon>
          </Text>
        }
        subtitulo={<StatusRecarga cor={aparencia.cor} texto={subtitulo} alerta={alerta} />}
        acao={
          <UnstyledButton
            role="switch"
            aria-checked={ativa}
            aria-label={ativa ? "Desativar recarga automática" : "Ativar recarga automática"}
            disabled={enviando || indisponivel}
            onClick={() => alternar(!ativa)}
            className="flex-shrink-0 ms-2"
            style={{
              padding: 8,
              margin: -8,
              borderRadius: 20,
              cursor: enviando || indisponivel ? "not-allowed" : "pointer",
            }}
          >
            <span
              aria-hidden="true"
              className="d-block"
              style={{
                position: "relative",
                width: 52,
                height: 30,
                borderRadius: 15,
                background: aparencia.trilho,
                transition: "background 300ms ease-out",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: ativa ? 25 : 3,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                  transition: "left 250ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </span>
          </UnstyledButton>
        }
      />

      <div className="px-3">
        <Card shadow="sm" padding={0} radius="md" withBorder className="text-start mt-3" style={estiloForaDoAr}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <Resumo
                rotulo="Recarrega ao atingir"
                valor={formatarValor(config.saldoMinimo)}
                detalhe="de saldo ou menos"
              />
              <Resumo
                rotulo="Valor debitado"
                valor={resumoValor ? formatarValor(resumoValor) : "—"}
                detalhe={resumoDetalhe}
                separado
              />
            </div>
          </Card>

        {aviso ? (
          <div ref={avisoRef}>
            <CardAviso tom="vermelho" titulo="Aviso!" style={{ marginTop: 16, marginBottom: 0 }}>
              {aviso}
            </CardAviso>
          </div>
        ) : null}

        <div className="mt-3">
          {suspensa ? (
            <AvisoFalhaRecarga
              onTentar={tentarNovamente}
              carregando={enviando}
              desabilitado={!config.disponivel}
              data={config.ultimaFalha?.data}
              dica={alterado && valor ? "A nova tentativa usará o valor e o cartão selecionados abaixo." : null}
              style={estiloForaDoAr}
            />
          ) : null}

          {config.processando ? (
            <CardAviso
              tom="azul"
              titulo="Recarga em processamento"
              style={estiloForaDoAr}
            >
              Estamos confirmando a última cobrança com a operadora do cartão. O resultado aparece no histórico.
            </CardAviso>
          ) : null}

          {ativa && config.semCartao ? (
            <CardAviso
              tom="amarelo"
              titulo={temCartao ? "Escolha um cartão de crédito" : "Adicione um cartão de crédito"}
              style={estiloForaDoAr}
              rodape={
                <Button
                  fullWidth
                  mt="md"
                  radius="md"
                  variant="default"
                  leftIcon={<IconPlus size="1rem" />}
                  onClick={adicionarCartao}
                  style={{ borderColor: "#FFD43B", color: "#8F5A00" }}
                >
                  Adicionar cartão
                </Button>
              }
            >
              {temCartao
                ? "A recarga automática está ligada, mas sem cartão para cobrar. Escolha um dos seus cartões abaixo e toque em Salvar alterações, ou adicione outro."
                : "A recarga automática está ligada, mas só consegue cobrar com um cartão de crédito cadastrado. Sem cartão, ela será desligada na próxima vez que o saldo precisar de recarga."}
            </CardAviso>
          ) : null}

          {ativa && !suspensa && config.limiteDiarioAtingido ? (
            <AvisoLimiteDiario texto={textoLimiteDiario(config.maximoPorDia)} style={estiloForaDoAr} />
          ) : null}

          <div className={classes.opcoes}>
            <Card
              ref={valorRef}
              shadow="sm"
              padding="md"
              radius="md"
              className="text-start"
              withBorder
              aria-disabled={!editavel}
              style={{ ...estiloTravado, ...(erroValor ? { borderColor: "#FA5252" } : {}) }}
            >
              <Text weight={600}>Valor da recarga</Text>
              <Text size="xs" color="dimmed" className="mb-2">
                Quanto será adicionado ao seu saldo a cada recarga
                {config.maximoPorDia ? `, até ${config.maximoPorDia} vezes por dia` : ""}.
              </Text>
              <div
                role="radiogroup"
                aria-label="Valor da recarga automática"
                className={classes.valores}
                style={{ "--colunas-valor": Math.min(config.valores.length, 3) || 1 }}
              >
                {config.valores.map((opcao) => {
                  const selecionado = valor === opcao;
                  return (
                    <UnstyledButton
                      key={opcao}
                      role="radio"
                      aria-checked={selecionado}
                      disabled={!editavel}
                      tabIndex={editavel ? 0 : -1}
                      onClick={() => escolherValor(opcao)}
                      style={{
                        ...estiloOpcao(selecionado),
                        minHeight: 52,
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 16,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatarValor(opcao)}
                    </UnstyledButton>
                  );
                })}
              </div>
              {erroValor ? (
                <Text size="xs" color="red" className="mt-2" role="alert">
                  Selecione um valor para tentar novamente.
                </Text>
              ) : null}
            </Card>

            <Card shadow="sm" padding="md" radius="md" className={`text-start ${classes.cartaoCredito}`} withBorder>
              <Text weight={600}>Cartão de crédito</Text>
              <Text size="xs" color="dimmed" className="mb-2">
                A cobrança de cada recarga é feita no cartão escolhido abaixo.
              </Text>

              {!temCartao ? (
                <div className="text-center p-3" style={{ backgroundColor: "#F8F9FA", borderRadius: 8, ...estiloTravado }}>
                  <ThemeIcon size={40} radius="xl" variant="light" color={foraDoAr ? "gray" : "blue"} className="mb-2">
                    <IconCreditCard size={22} />
                  </ThemeIcon>
                  <Text size="sm" weight={500}>
                    Você ainda não tem cartão de crédito cadastrado
                  </Text>
                  <Text size="xs" color="dimmed">
                    Cadastre um cartão para que as recargas possam ser cobradas.
                  </Text>
                </div>
              ) : (
                <div
                  role="radiogroup"
                  aria-label="Cartão de crédito da recarga automática"
                  className={classes.listaCartoes}
                  style={estiloTravado}
                >
                  {listaCartoes.map((cartao) => {
                    const selecionado = idCartao === cartao.id_cartao;
                    return (
                      <div
                        key={cartao.id_cartao}
                        role="radio"
                        aria-checked={selecionado}
                        aria-disabled={!editavel}
                        aria-label={descreverCartao(cartao)}
                        tabIndex={editavel ? 0 : -1}
                        className="d-flex align-items-center mb-2 ps-2 pe-3"
                        style={{ ...estiloOpcao(selecionado), minHeight: 56 }}
                        onClick={() => setIdCartao(cartao.id_cartao)}
                        onKeyDown={(evento) => selecionarComTeclado(evento, () => setIdCartao(cartao.id_cartao))}
                      >
                        <IconeBandeira bandeira={cartao.bandeira} selecionado={selecionado} />
                        <div className="mx-2 flex-grow-1" style={{ minWidth: 0 }}>
                          <Text
                            size="xs"
                            style={{ color: selecionado ? "rgba(255,255,255,0.85)" : "#495057", lineHeight: 1.2 }}
                          >
                            {nomeBandeira[cartao.bandeira] || "Cartão de crédito"}
                          </Text>
                          <Text weight={600} style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}>
                            •••• {cartao.cartao}
                          </Text>
                        </div>
                        {selecionado ? (
                          <IconCircleCheck size={22} color="white" aria-hidden="true" />
                        ) : (
                          <span
                            aria-hidden="true"
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              border: "2px solid #adb5bd",
                              margin: 1,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div
                className="mt-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: config.cartoes.length > LIMITE_CARTOES ? "1fr 1fr" : "1fr",
                  gap: 8,
                }}
              >
                {config.cartoes.length > LIMITE_CARTOES ? (
                  <Button
                    fullWidth
                    px="xs"
                    variant="light"
                    color="gray"
                    radius="md"
                    disabled={!editavel}
                    rightIcon={todosCartoes ? <IconChevronUp size="1rem" /> : <IconChevronDown size="1rem" />}
                    onClick={() => setTodosCartoes((aberto) => !aberto)}
                  >
                    {todosCartoes ? "Mostrar menos" : `Ver todos (${config.cartoes.length})`}
                  </Button>
                ) : null}
                <Button
                  fullWidth
                  px="xs"
                  variant="light"
                  color={foraDoAr ? "gray" : "blue"}
                  radius="md"
                  leftIcon={<IconPlus size="1rem" />}
                  onClick={adicionarCartao}
                >
                  Adicionar cartão
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {ativa || config.possuiHistorico ? (
          <UnstyledButton
            className="mt-3 p-3 text-start d-flex align-items-center bg-white"
            style={{ width: "100%", border: BORDA, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            onClick={() => FuncTrocaComp("HistoricoRecargaAutomatica")}
          >
            <ThemeIcon size={36} radius="md" variant="light" color={foraDoAr ? "gray" : "blue"}>
              <IconHistory size={20} />
            </ThemeIcon>
            <div className="mx-3 flex-grow-1">
              <Text weight={600} size="sm">
                Histórico de recargas
              </Text>
              <Text size="xs" color="dimmed">
                Veja as recargas aprovadas e recusadas
              </Text>
            </div>
            <IconChevronRight size={20} color="#868e96" />
          </UnstyledButton>
        ) : null}

        <Group position="center" mt="lg">
          <VoltarComponente />
        </Group>
      </div>

      <Portal>
        <Transition mounted={barraVisivel} transition="slide-up" duration={220} timingFunction="ease-out">
          {(estilos) => (
            <div
              ref={definirBarra}
              role="region"
              aria-label="Alterações não salvas"
              className="text-start"
              style={{
                ...estilos,
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                zIndex: 1000,
                backgroundColor: "white",
                borderTop: "1px solid #74C0FC",
                boxShadow: "0 -6px 24px rgba(25, 113, 194, 0.22)",
                padding: "16px 16px calc(16px + env(safe-area-inset-bottom))",
              }}
            >
              <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <Text size="xs" color="dimmed">
                  Alterações não salvas
                </Text>
                <Text size="sm" weight={600} className="mb-2" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatarValor(valor)}
                  {idCartao ? " no cartão " : ""}
                  <span className="text-nowrap">
                    {descreverCartao(config.cartoes.find((c) => c.id_cartao === idCartao))}
                  </span>
                </Text>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                  <Button
                    fullWidth
                    size="md"
                    radius="md"
                    variant="subtle"
                    color="gray"
                    onClick={descartarAlteracoes}
                    disabled={enviando}
                  >
                    Descartar
                  </Button>
                  <Button
                    fullWidth
                    size="md"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: "cyan", to: "blue", deg: 45 }}
                    loading={enviando}
                    disabled={!valor}
                    onClick={salvarAlteracoes}
                  >
                    Salvar alterações
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Transition>
      </Portal>

      <TermoRecargaAutomatica
        opened={termoAberto}
        onClose={() => setTermoAberto(false)}
        onConfirmar={confirmarTermo}
        saldoMinimo={config.saldoMinimo}
        valores={config.valores}
        valor={valor}
        somenteLeitura={termoLeitura}
      />
    </div>
  );
};

export default RecargaAutomatica;
