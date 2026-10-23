import {
  ActionIcon,
  Text,
  Card,
  Button,
  Image,
  Input,
  SimpleGrid,
  UnstyledButton,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheckFilled,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { React, useState, useEffect } from "react";
import FuncTrocaComp from "../util/FuncTrocaComp";
import ModalPix from "./ModalPix";
import { BsCreditCard2Back, BsCreditCard2Front } from "react-icons/bs";
import createAPI from "../services/createAPI";
import VoltarComponente from "../util/VoltarComponente";
import ModalErroBanco from "./ModalErroBanco";
import { MdPix } from "react-icons/md";
import Swal from "sweetalert2";
import { MensagemCompra } from "../util/MensagemCompra";
import MensagemErro from "../util/MensagemErro";
import TituloComVoltar from "../util/TituloComVoltar";
import {
  GRADIENTE,
  AZUL,
  AZUL_ESCURO,
  AZUL_CLARO,
  BORDA,
  BOTAO_PRINCIPAL,
} from "../util/estiloCredito";

const LIMITE_CARTOES = 3;
const VALOR_MAXIMO = 1000;

const METODOS = [
  { valor: "pix", nome: "Pix", Icone: MdPix },
  { valor: "cartaoDeb", nome: "Débito", Icone: BsCreditCard2Back },
  { valor: "cartaoCred", nome: "Crédito", Icone: BsCreditCard2Front },
];

const VALORES = {
  pix: ["15.00", "30.00", "50.00", "100.00"],
  cartao: ["20.00", "30.00", "50.00", "100.00"],
};

const BANDEIRAS = {
  visa: { nome: "Visa", logo: "../../assets/img/cartaoCredito/visa-unselected.png" },
  mastercard: { nome: "Mastercard", logo: "../../assets/img/cartaoCredito/mastercard.png" },
  elocard: { nome: "Elo", logo: "../../assets/img/cartaoCredito/elocard-unselected.png" },
};

const formatarReais = (numero) =>
  Number(numero).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const modalidadesCartao = (item) => {
  if (item.debito === "S" && item.credito === "S") return "Crédito e débito";
  if (item.credito === "S") return "Crédito";
  return "Débito";
};

const BlocoInfo = ({ Icone, children, acao }) => (
  <Box
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      borderRadius: 10,
      background: "#F8F9FA",
    }}
  >
    <Box
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        background: AZUL_CLARO,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icone size={20} color={AZUL_ESCURO} />
    </Box>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    {acao}
  </Box>
);

const InserirCreditos = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [valor, setValor] = useState("15.00");
  const [valor2, setValor2] = useState("");
  const [data, setData] = useState([]);
  const [notification, setNotification] = useState(true);
  const [tabsValue, setTabsValue] = useState("Meios de pagamento");
  const [metodo, setMetodo] = useState("pix");
  const [divAvancar, setDivAvancar] = useState(false);
  const [divAvancar2, setDivAvancar2] = useState(false);
  const [erroMaximo, setErroMaximo] = useState(false);
  const [pixExpirado, setPixExpirado] = useState("Sucesso!");
  const [onOpen, setOnOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [onOpenError, setOnOpenError] = useState(false);
  const [onCloseError, setOnCloseError] = useState(false);
  const [CreditCardSelected, setCreditCardSelected] = useState(null);
  const [mostrarTodosCartoes, setMostrarTodosCartoes] = useState(false);
  const [creditCard, setCreditCard] = useState([]);

  const buscarMensagem = async () => {
    const texto = await MensagemCompra();
    return texto;
  };

  const getCreditCardFUNC = async () => {
    const requisicao = createAPI();

    await requisicao
      .get("/cartao/")
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          const newData = resposta.data.data.map((item) => ({
            cartao: item.id_cartao,
            bandeira: item.bandeira,
            numero: `#### #### #### ${item.cartao}`,
            debito: item.debito,
            credito: item.credito,
          }));
          setCreditCard(newData);
        } else {
          setCreditCard([]);
        }
      })
      .catch((err) => {
        setCreditCard([]);
      });
  };

  const apagarCartao = (cartao) => {
    const finalDoNumero = cartao.numero.slice(-4);
    Swal.fire({
      title: "Tem certeza?",
      text: `Você deseja apagar o cartão de final ${finalDoNumero}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, apagar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const requisicao = createAPI();
        requisicao
          .delete(`/cartao/${parseInt(cartao.cartao)}`)
          .then((response) => {
            if (response.data.msg.resultado) {
              Swal.fire({
                icon: "success",
                title: response.data.msg.msg,
                showConfirmButton: false,
                timer: 1500,
              });
              setCreditCardSelected(null);
              setCreditCard(
                creditCard.filter((item) => item.cartao !== cartao.cartao)
              );
            } else {
              Swal.fire({
                icon: "error",
                title: response.data.msg.msg,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  useEffect(() => {
    if (localStorage.getItem("cartaoCredito") == "true") {
      const tipoCard = localStorage.getItem("tipoCard");
      if (tipoCard == "debito") {
        setMetodo("cartaoDeb");
      } else {
        setMetodo("cartaoCred");
      }

      localStorage.removeItem("cartaoCredito");
    }
    getCreditCardFUNC();
  }, []);

  const inserirCreditos = async (campo, valor) => {
    const requisicao = await createAPI();

    await requisicao
      .post("/usuario/saldo/pix", {
        txid: campo,
        valor: valor,
        pagamento: "pix",
      })
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          setTimeout(() => {
            FuncTrocaComp("MeusVeiculos");
          }, 3000);
        } else {
          setNotification(false);
          setPixExpirado("Pix expirado");
        }
      })
      .catch((err) => {
        setButtonDisabled(false);
        setOnOpenError(true);
      });
  };

  const fazerPix = () => {
    setButtonDisabled(true);

    const ValorFinal = valorNumerico.toFixed(2);

    if (
      ValorFinal <= 2 ||
      ValorFinal === "" ||
      ValorFinal == null ||
      ValorFinal === undefined ||
      isNaN(ValorFinal)
    ) {
      setButtonDisabled(false);
      setDivAvancar2(true);
      setTimeout(() => {
        setDivAvancar2(false);
      }, 5000);
      return;
    } else {
      const requisicao = createAPI();

      requisicao
        .post("/gerarcobranca", {
          valor: ValorFinal,
          campo: ValorFinal,
        })
        .then((resposta) => {
          setButtonDisabled(false);
          if (resposta.data.msg.resultado) {
            setData(resposta.data.data);
            inserirCreditos(resposta.data.data.txid, ValorFinal);
            setOnOpen(true);
            setNotification(true);
            open();
          } else {
          }
        })
        .catch((err) => {
          setButtonDisabled(false);
          setOnOpenError(true);
        });
    }
  };

  const handleTabs = () => {
    if (metodo === "pix") {
      setTabsValue("Valor");
    } else if (metodo === "cartaoDeb" || metodo === "cartaoCred") {
      if (creditCard.length > 0) {
        if (CreditCardSelected !== null) {
          setTabsValue("Valor");
        } else {
          setDivAvancar(true);
          setTimeout(() => {
            setDivAvancar(false);
          }, 5000);
        }
      } else {
        setDivAvancar(true);
        setTimeout(() => {
          setDivAvancar(false);
        }, 5000);
      }
    } else {
      setDivAvancar(true);
      setTimeout(() => {
        setDivAvancar(false);
      }, 5000);
    }
  };

  const FuncArrumaInput = (e) => {
    let valor = e.target.value;

    if (valor.length === 1 && valor !== "0") {
      valor = `0,0${valor}`;
    } else if (valor.length > 1) {
      valor = valor.replace(/\D/g, "");
      valor = valor.replace(/^0+/, "");

      if (valor.length < 3) {
        valor = `0,${valor}`;
      } else {
        valor = valor.replace(/(\d{2})$/, ",$1");
      }

      valor = valor.replace(/(?=(\d{3})+(\D))\B/g, ".");
    }

    setValor2(valor);
  };

  const pagamentoCartao = () => {
    const id_cartao = creditCard[CreditCardSelected].cartao;
    setButtonDisabled(true);
    const ValorFinal = valorNumerico.toFixed(2);
    if (
      ValorFinal < 13 ||
      ValorFinal === "" ||
      ValorFinal == null ||
      ValorFinal === undefined ||
      isNaN(ValorFinal)
    ) {
      setButtonDisabled(false);
      setDivAvancar2(true);
      setTimeout(() => {
        setDivAvancar2(false);
      }, 5000);
      return;
    }

    const requisicao = createAPI();
    requisicao
      .post("/cartao/credito", {
        cartao: id_cartao,
        valor: ValorFinal,
        tipo: metodo === "cartaoDeb" ? "debit" : "credit",
      })
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          setButtonDisabled(false);
          buscarMensagem().then((texto) => {
            Swal.fire({
              icon: "success",
              title: "Sucesso!",
              html: `
              Crédito inserido com sucesso!<br>
              ${
                texto
                  ? `<small style="display:block;margin-top:10px;color:#555;">${texto}</small>`
                  : ""
              }
            `,
              showConfirmButton: false,
              timerProgressBar: false,
              didOpen: () => {
                setTimeout(() => {
                  Swal.update({
                    showConfirmButton: true,
                  });
                  const btn = document.querySelector(".swal2-confirm");
                  if (btn) {
                    btn.style.opacity = "0";
                    btn.style.transition = "opacity 1.5s";
                    setTimeout(() => {
                      btn.style.opacity = "1";
                    }, 30);
                  }
                }, 2000);
              },
              confirmButtonText: "Ok",
            }).then(() => {
              FuncTrocaComp("MeusVeiculos");
            });
          });
        } else {
          setButtonDisabled(false);
          Swal.fire({
            icon: "warning",
            title: "Aviso!",
            text: "Ops, parece que o pagamento não foi concluído como esperado. Por favor, revise suas informações e tente realizar o pagamento novamente quando possível.",
            showConfirmButton: true,
            confirmButtonText: "Ok",
          });
        }
      });
  };

  useEffect(() => {
    if (metodo === "pix") {
      setValor("15.00");
    } else {
      setValor("20.00");
    }
    setCreditCardSelected(null);
  }, [metodo]);

  const validaFormato = () => {
    if (valorNumerico > VALOR_MAXIMO) {
      setDivAvancar2(false);
      setErroMaximo(true);
      setTimeout(() => {
        setErroMaximo(false);
      }, 5000);
      return;
    }
    setErroMaximo(false);
    if (metodo === "pix") {
      fazerPix();
    } else {
      pagamentoCartao();
    }
  };

  const ehPix = metodo === "pix";
  const etapa = tabsValue === "Valor" ? 1 : 0;
  const cartoesDoMetodo = creditCard
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item }) =>
        (item.credito === "S" && metodo === "cartaoCred") ||
        (item.debito === "S" && metodo === "cartaoDeb")
    );
  const temMaisCartoes = cartoesDoMetodo.length > LIMITE_CARTOES;
  const primeirosCartoes = cartoesDoMetodo.slice(0, LIMITE_CARTOES);
  const selecionadoEscondido =
    CreditCardSelected !== null &&
    !primeirosCartoes.some(({ index }) => index === CreditCardSelected);
  const cartoesVisiveis =
    mostrarTodosCartoes || !temMaisCartoes
      ? cartoesDoMetodo
      : selecionadoEscondido
      ? [
          ...primeirosCartoes.slice(0, LIMITE_CARTOES - 1),
          ...cartoesDoMetodo.filter(({ index }) => index === CreditCardSelected),
        ]
      : primeirosCartoes;
  const cartaoEscolhido =
    CreditCardSelected !== null ? creditCard[CreditCardSelected] : null;
  const metodoEscolhido = METODOS.find((m) => m.valor === metodo);
  const valorNumerico =
    valor === "outro"
      ? parseFloat(valor2.replace(/\./g, "").replace(",", "."))
      : parseFloat(valor);
  const temValor = !isNaN(valorNumerico) && valorNumerico > 0;
  const textoBotaoPagar = temValor
    ? ehPix
      ? `Gerar Pix de ${formatarReais(valorNumerico)}`
      : `Pagar ${formatarReais(valorNumerico)}`
    : ehPix
    ? "Gerar Pix"
    : "Pagar";

  const estiloOpcao = (selecionado) => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    minHeight: 64,
    padding: "10px 12px",
    borderRadius: 10,
    border: `1.5px solid ${selecionado ? AZUL : BORDA}`,
    background: selecionado ? AZUL_CLARO : "#fff",
    transition: "border-color 150ms ease, background-color 150ms ease",
  });

  const nomeModalidade = metodo === "cartaoDeb" ? "débito" : "crédito";

  return (
    <div className="tela-credito">
      <Card shadow="sm" padding="lg" radius="md" mb="sm" withBorder>
        <Card.Section
          component="nav"
          aria-label="Passos"
          mb="lg"
          style={{ display: "flex", borderBottom: `1px solid ${BORDA}` }}
        >
          {["Pagamento", "Valor"].map((nome, i) => {
            const atual = etapa === i;
            const concluido = i <= etapa;
            return (
              <UnstyledButton
                key={nome}
                aria-current={atual ? "step" : undefined}
                onClick={() => {
                  if (i === 0) setTabsValue("Meios de pagamento");
                  else if (etapa === 0) handleTabs();
                }}
                style={{ flex: 1, textAlign: "center" }}
              >
                <span
                  style={{
                    display: "block",
                    height: 4,
                    background: concluido ? GRADIENTE : "#E9ECEF",
                    transition: "background 200ms ease",
                  }}
                />
                <Text
                  size="sm"
                  weight={atual ? 700 : 600}
                  py={12}
                  style={{ color: atual ? AZUL_ESCURO : "#868E96" }}
                >
                  {i + 1}. {nome}
                </Text>
              </UnstyledButton>
            );
          })}
        </Card.Section>

        <TituloComVoltar
          titulo="Adicionar créditos"
          subtitulo="O valor é adicionado no seu saldo do sistema."
          rotuloVoltar="Voltar para pagamento"
          onVoltar={
            etapa === 1 ? () => setTabsValue("Meios de pagamento") : undefined
          }
        />

        {etapa === 0 ? (
          <div className="text-start">
            <Text weight={600} mb="xs" id="rotulo-metodo">
              Forma de pagamento
            </Text>
            <SimpleGrid
              cols={3}
              spacing="sm"
              role="radiogroup"
              aria-labelledby="rotulo-metodo"
            >
              {METODOS.map(({ valor: v, nome, Icone }) => {
                const selecionado = metodo === v;
                return (
                  <UnstyledButton
                    key={v}
                    role="radio"
                    aria-checked={selecionado}
                    onClick={() => setMetodo(v)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      minHeight: 84,
                      borderRadius: 12,
                      border: `1.5px solid ${selecionado ? "transparent" : BORDA}`,
                      background: selecionado ? GRADIENTE : "#fff",
                      color: selecionado ? "#fff" : "#212529",
                      boxShadow: selecionado
                        ? "0 4px 12px rgba(28, 126, 214, 0.25)"
                        : "none",
                      transition: "background 150ms ease, box-shadow 150ms ease",
                    }}
                  >
                    <Icone size={28} color={selecionado ? "#fff" : AZUL_ESCURO} />
                    <Text weight={600} size="sm" inherit>
                      {nome}
                    </Text>
                  </UnstyledButton>
                );
              })}
            </SimpleGrid>

            {ehPix ? (
              <Text size="sm" color="dimmed" mt="md">
                No próximo passo você escolhe o valor e recebe o QR Code para
                pagar.
              </Text>
            ) : (
              <>
                <Text weight={600} mt="xl" mb="xs" id="rotulo-cartao">
                  Cartão de {nomeModalidade}
                </Text>
                {divAvancar ? (
                  <MensagemErro mb="xs">
                    {cartoesDoMetodo.length === 0
                      ? `Cadastre um cartão de ${nomeModalidade} para continuar.`
                      : "Escolha um cartão para continuar."}
                  </MensagemErro>
                ) : null}
                <div
                  role="radiogroup"
                  aria-labelledby="rotulo-cartao"
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {cartoesDoMetodo.length === 0 ? (
                    <BlocoInfo Icone={metodoEscolhido.Icone}>
                      <Text weight={600} size="sm" color="dark">
                        Nenhum cartão de {nomeModalidade}
                      </Text>
                      <Text size="xs" style={{ color: "#495057" }}>
                        {creditCard.length === 0
                          ? "Você ainda não tem cartão cadastrado."
                          : `Seus cartões cadastrados não aceitam ${nomeModalidade}.`}{" "}
                        Adicione um cartão abaixo.
                      </Text>
                    </BlocoInfo>
                  ) : null}
                  {cartoesVisiveis.map(({ item, index }) => {
                    const selecionado = CreditCardSelected === index;
                    const bandeira = BANDEIRAS[item.bandeira];
                    const final = item.numero.slice(-4);
                    return (
                      <Box key={item.cartao} style={estiloOpcao(selecionado)}>
                        <UnstyledButton
                          role="radio"
                          aria-checked={selecionado}
                          onClick={() => setCreditCardSelected(index)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            flex: 1,
                            minWidth: 0,
                            alignSelf: "stretch",
                          }}
                        >
                          <Box
                            style={{
                              width: 52,
                              height: 36,
                              borderRadius: 6,
                              border: `1px solid ${BORDA}`,
                              background: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {bandeira ? (
                              <Image
                                src={bandeira.logo}
                                alt={bandeira.nome}
                                width={40}
                                height={26}
                                fit="contain"
                              />
                            ) : (
                              <BsCreditCard2Back size={22} color="#495057" />
                            )}
                          </Box>
                          <div style={{ minWidth: 0 }}>
                            <Text
                              weight={600}
                              style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                              •••• {final}
                            </Text>
                            <Text size="xs" color="dimmed">
                              {bandeira ? `${bandeira.nome} · ` : ""}
                              {modalidadesCartao(item)}
                            </Text>
                          </div>
                          {selecionado ? (
                            <IconCircleCheckFilled
                              size="1.4rem"
                              style={{ marginLeft: "auto", flexShrink: 0, color: AZUL }}
                            />
                          ) : null}
                        </UnstyledButton>
                        <ActionIcon
                          size="lg"
                          radius="md"
                          color="red"
                          variant="subtle"
                          ml={4}
                          aria-label={`Apagar cartão de final ${final}`}
                          onClick={() => apagarCartao(item)}
                        >
                          <IconTrash size="1.2rem" />
                        </ActionIcon>
                      </Box>
                    );
                  })}
                  {temMaisCartoes ? (
                    <UnstyledButton
                      aria-expanded={mostrarTodosCartoes}
                      onClick={() => setMostrarTodosCartoes(!mostrarTodosCartoes)}
                      className="botao-ver-cartoes"
                    >
                      {mostrarTodosCartoes
                        ? "Mostrar menos"
                        : `Ver todos os cartões (${cartoesDoMetodo.length})`}
                      {mostrarTodosCartoes ? (
                        <IconChevronUp size="1rem" />
                      ) : (
                        <IconChevronDown size="1rem" />
                      )}
                    </UnstyledButton>
                  ) : null}
                  <UnstyledButton
                    onClick={() => FuncTrocaComp("CartaoCredito")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      minHeight: 52,
                      borderRadius: 10,
                      border: `1.5px dashed ${BORDA}`,
                      color: AZUL_ESCURO,
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    <IconPlus size="1.1rem" />
                    Adicionar cartão
                  </UnstyledButton>
                </div>
              </>
            )}

            <Button
              {...BOTAO_PRINCIPAL}
              mt="xl"
              rightIcon={<IconArrowRight size="1.1rem" />}
              onClick={() => handleTabs()}
            >
              Continuar
            </Button>
          </div>
        ) : (
          <div className="text-start">
            <BlocoInfo
              Icone={metodoEscolhido.Icone}
              acao={
                <Button
                  variant="subtle"
                  color="blue"
                  compact
                  onClick={() => setTabsValue("Meios de pagamento")}
                >
                  Alterar
                </Button>
              }
            >
              <Text size="xs" color="dimmed">
                Pagando com
              </Text>
              <Text weight={600} size="sm">
                {metodoEscolhido.nome}
                {cartaoEscolhido
                  ? ` · ${
                      BANDEIRAS[cartaoEscolhido.bandeira]?.nome || "Cartão"
                    } •••• ${cartaoEscolhido.numero.slice(-4)}`
                  : ""}
              </Text>
            </BlocoInfo>

            <Text weight={600} mt="xl" id="rotulo-valor">
              Quanto você quer adicionar?
            </Text>
            <Text size="xs" color="dimmed" mt={2} mb="sm" id="minimo-valor">
              {ehPix
                ? "Valor mínimo no Pix: acima de R$ 2,00."
                : "Valor mínimo no cartão: R$ 13,00."}
            </Text>
            <SimpleGrid
              cols={2}
              breakpoints={[{ minWidth: 992, cols: 4 }]}
              spacing="sm"
              role="radiogroup"
              aria-labelledby="rotulo-valor"
              aria-describedby="minimo-valor"
            >
              {[...(ehPix ? VALORES.pix : VALORES.cartao), "outro"].map((v) => {
                const selecionado = valor === v;
                return (
                  <UnstyledButton
                    key={v}
                    role="radio"
                    aria-checked={selecionado}
                    onClick={() => setValor(v)}
                    style={{
                      ...estiloOpcao(selecionado),
                      justifyContent: "center",
                      minHeight: 56,
                      gridColumn: v === "outro" ? "1 / -1" : undefined,
                    }}
                  >
                    <Text
                      weight={selecionado ? 700 : 600}
                      size={v === "outro" ? "sm" : "lg"}
                      color={selecionado ? AZUL_ESCURO : "dark"}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {v === "outro" ? "Outro valor" : formatarReais(v)}
                    </Text>
                  </UnstyledButton>
                );
              })}
            </SimpleGrid>

            {valor === "outro" ? (
              <div style={{ marginTop: 8 }}>
                <Input
                  icon={
                    <Text size="sm" weight={600} color="dimmed">
                      R$
                    </Text>
                  }
                  aria-label="Valor"
                  placeholder="0,00"
                  inputMode="numeric"
                  size="md"
                  radius="md"
                  autoFocus
                  value={valor2}
                  onChange={(e) => FuncArrumaInput(e)}
                />
              </div>
            ) : null}

            {divAvancar2 ? (
              <MensagemErro mt="sm">
                {valor !== "" && metodo === "pix"
                  ? "Informe um valor acima de R$ 2,00."
                  : valor !== "" && metodo !== "pix"
                  ? "Informe um valor de pelo menos R$ 13,00."
                  : "Escolha um valor."}
              </MensagemErro>
            ) : null}
            {erroMaximo ? (
              <MensagemErro mt="sm">
                O valor máximo é {formatarReais(VALOR_MAXIMO)}.
              </MensagemErro>
            ) : null}

            <Button
              {...BOTAO_PRINCIPAL}
              mt="xl"
              loading={buttonDisabled}
              loaderPosition="right"
              rightIcon={buttonDisabled ? null : <IconCheck size="1.1rem" />}
              onClick={() => {
                validaFormato();
              }}
            >
              {textoBotaoPagar}
            </Button>
          </div>
        )}

        <ModalErroBanco onOpen={onOpenError} onClose={onCloseError} />
        <ModalPix
          qrCode={data.pixCopiaECola}
          status={notification}
          mensagemPix={pixExpirado}
          onOpen={onOpen}
        />
      </Card>
      <VoltarComponente />
    </div>
  );
};

export default InserirCreditos;
