import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import VoltarComponente from "../util/VoltarComponente";
import { Button, Card, Select } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import creditCardType from "credit-card-type";
import createAPI from "../services/createAPI";
import FuncTrocaComp from "../util/FuncTrocaComp";
import MensagemErro from "../util/MensagemErro";
import TituloComVoltar from "../util/TituloComVoltar";
import { AZUL, BOTAO_PRINCIPAL } from "../util/estiloCredito";

const MESES = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

const ANOS = Array.from({ length: 16 }, (_, i) => {
  const ano = new Date().getFullYear() + i;
  return { value: String(ano).slice(-2), label: String(ano) };
});

const ESTILO_SELECT = {
  input: {
    height: 44,
    minHeight: 44,
    borderRadius: 8,
    borderColor: "#CED4DA",
    fontSize: 16,
    fontWeight: 400,
    color: "#212529",
    "&::placeholder": { color: "#868E96" },
    "&:focus": {
      borderColor: AZUL,
      boxShadow: "0 0 0 3px rgba(28,126,214,.2)",
    },
  },
  item: { fontSize: 15 },
};

const TIPOS = [
  { valor: "credito", nome: "Crédito" },
  { valor: "debito", nome: "Débito" },
  { valor: "debito,credito", nome: "Ambos" },
];

const CartaoCredito = () => {
  const [cardNumber, setCardNumber] = useState("#### #### #### ####");
  const [cardHolder, setCardHolder] = useState("");
  const [expMonth, setExpMonth] = useState("mm");
  const [expYear, setExpYear] = useState("yy");
  const [cvv, setCvv] = useState("");
  const [logoMarca, setLogoMarca] = useState("");
  const [divMensagem, setDivmMensagem] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [mensagemApi, setMensagemApi] = useState(false);
  const [typeCard, setTypeCard] = useState("");
  const [respostaAPI, setRespostaAPI] = useState("");

  const getCardFlag = async (cardNumber) => {
    const cardTypeLabels = {
      visa: "visa",
      mastercard: "mastercard",
      elo: "elocard",
    };

    const [cardType] = creditCardType(cardNumber);

    if (!cardType || !cardTypeLabels[cardType.type]) return undefined;

    return { label: cardTypeLabels[cardType.type] };
  };

  const handleCardNumberChange = async (e) => {
    let valorInput = e.target.value;
    let formattedValue = "";

    if (valorInput.length > 19) return;

    const numericValue = valorInput.replace(/\D/g, "");

    for (let i = 0; i < 16; i++) {
      formattedValue += numericValue[i] || "#";
      if ((i + 1) % 4 === 0 && i !== 15) {
        formattedValue += " ";
      }
    }

    setCardNumber(formattedValue);

    const bandeira = await getCardFlag(numericValue);

    if (bandeira) {
      setLogoMarca(`../../assets/img/cartaoCredito/${bandeira.label}.png`);
    } else {
      setLogoMarca("");
    }

    handleCvvMouseLeave();
  };

  const handleCardHolderChange = (e) => {
    let valorInput = e.target.value;
    valorInput = valorInput.replace(/[0-9]/g, "");

    if (valorInput === "") {
      setCardHolder("");
    }

    const UpperCase = valorInput.toUpperCase();

    setCardHolder(UpperCase);

    handleCvvMouseLeave();
  };

  const handleExpMonthChange = (mes) => {
    if (mes) {
      setExpMonth(mes);
    }

    handleCvvMouseLeave();
  };

  const handleExpYearChange = (ano) => {
    if (ano) {
      setExpYear(ano);
    }

    handleCvvMouseLeave();
  };

  const handleTypeCardChange = (tipo) => {
    setTypeCard(tipo);
  };

  const handleCvvMouseEnter = () => {
    document.querySelector(".front").style.transform =
      "perspective(1000px) rotateY(-180deg)";
    document.querySelector(".back").style.transform =
      "perspective(1000px) rotateY(0deg)";
  };

  const handleCvvMouseLeave = () => {
    document.querySelector(".front").style.transform =
      "perspective(1000px) rotateY(0deg)";
    document.querySelector(".back").style.transform =
      "perspective(1000px) rotateY(180deg)";
  };

  const handleOnclick = () => {
    if (
      document.querySelector(".front").style.transform !==
      "perspective(1000px) rotateY(-180deg)"
    ) {
      document.querySelector(".front").style.transform =
        "perspective(1000px) rotateY(-180deg)";
      document.querySelector(".back").style.transform =
        "perspective(1000px) rotateY(0deg)";
    } else {
      document.querySelector(".front").style.transform =
        "perspective(1000px) rotateY(0deg)";
      document.querySelector(".back").style.transform =
        "perspective(1000px) rotateY(180deg)";
    }
  };

  const handleCvvChange = (e) => {
    setCvv(e.target.value);

    handleCvvMouseEnter();
  };

  function shuffleString(inputString, numPositions, order) {
    const array = inputString.split(""); // Converte a string em um array de caracteres

    for (let i = 0; i < order.length; i += 2) {
      const pos1 = order[i] % numPositions;
      const pos2 = order[i + 1] % numPositions;

      // Troca os elementos nas posições especificadas
      const temp = array[pos1];
      array[pos1] = array[pos2];
      array[pos2] = temp;
    }

    return array.join("");
  }

  const handleRegistrar = async () => {
    if (
      cardNumber.includes("#") ||
      cardHolder === "" ||
      expMonth === "mm" ||
      expYear === "yy" ||
      cvv === "" ||
      typeCard === "" ||
      typeCard === "tipo"
    ) {
      setMensagemApi(false);
      setRespostaAPI("");
      setDivmMensagem(true);

      setTimeout(() => {
        setDivmMensagem(false);
      }, 5000);
    } else {
      setLoadingButton(true);
      const user = localStorage.getItem("user");
      const user2 = JSON.parse(user);

      const cardNumberText = cardNumber.replace(/\s/g, "");

      const bandeira = await getCardFlag(cardNumberText);

      const dados = {
        numero_cartao: cardNumberText,
        ccv: cvv,
        validade: `${expMonth},${expYear}`,
        bandeira: bandeira && bandeira.label ? bandeira.label : "",
        tipo: typeCard,
      };

      const stringDados = JSON.stringify(dados);

      let dadosBase64 = btoa(stringDados);

      dadosBase64 = dadosBase64.replace(/=/g, "._.");

      dadosBase64 = dadosBase64.replace(/i/g, "@");

      dadosBase64 = dadosBase64.replace(/Y/g, "=");

      dadosBase64 = dadosBase64.replace(/j/g, "i");

      dadosBase64 = btoa(dadosBase64);

      dadosBase64 = dadosBase64.split("").reverse().join("");

      const idString = user2.id_usuario.toString();

      const numPositions =
        parseInt(idString.length) + parseInt(idString[0]) * 2;

      const data = new Date();

      let orderString = `${data.getDate()},${data.getMonth()},${data.getFullYear()},${data.getHours()}`;

      orderString = btoa(orderString);

      const order = [
        data.getDate(),
        data.getMonth(),
        data.getFullYear(),
        data.getHours(),
      ];

      const shuffledString = shuffleString(dadosBase64, numPositions, order);

      const requisicao = createAPI();

      requisicao
        .post("/cartao/", {
          dados: `${shuffledString}$${orderString}`,
        })
        .then((resposta) => {
          setLoadingButton(false);
          if (resposta.data.msg.resultado) {
            const destino = localStorage.getItem("componenteAnterior") === "RecargaAutomatica"
              ? "RecargaAutomatica"
              : "InserirCreditos";
            if (destino === "InserirCreditos") {
              localStorage.setItem("cartaoCredito", "true");
            }
            FuncTrocaComp(destino);
          } else {
            if (resposta.data.msg.msg === "Cartão já cadastrado!") {
              setRespostaAPI(resposta.data.msg.msg);
            } else {
              setRespostaAPI("");
            }
            setMensagemApi(true);
            setDivmMensagem(true);
            setTimeout(() => {
              setDivmMensagem(false);
            }, 6000);
          }
        })
        .catch((erro) => {
          console.log(erro);
        });
    }
  };

  return (
    <div className="tela-credito">
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        mb="sm"
        className="container2 text-start"
      >
        <TituloComVoltar
          titulo="Novo cartão"
          subtitulo="Cadastre um cartão para adicionar créditos à sua conta."
        />
        <div className="cadastro-cartao-corpo">
        <div
          className="card-container"
          onClick={() => {
            handleOnclick();
          }}
        >
          <div className="front">
            <div className="image">
              <img src="../../assets/img/cartaoCredito/chip.png" alt="" />
              {logoMarca && (
                <img src={logoMarca} alt="" className="logo" />
              )}
            </div>
            <div className="card-number-box">{cardNumber}</div>
            <div className="flexbox">
              <div className="box">
                <span>Nome</span>
                <div className="card-holder-name">
                  <TransitionGroup>
                    {cardHolder.split("").map((digit, index) => (
                      <CSSTransition
                        key={index}
                        classNames="fade"
                        timeout={300}
                      >
                        <span className="card-holder">{digit}</span>
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                </div>
              </div>
              <div className="box">
                <span>Validade</span>
                <div className="expiration">
                  <span className="exp-month">{expMonth}/</span>
                  <span className="exp-year">{expYear}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="back">
            <div className="stripe"></div>
            <div className="box">
              <span>CVV</span>
              <div className="cvv-box">{cvv}</div>
              {logoMarca && <img src={logoMarca} alt="" className="logo" />}
            </div>
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="inputBox">
            <label htmlFor="cartao-numero">Número do cartão</label>
            <input
              id="cartao-numero"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              maxLength={16}
              className="card-number-input"
              onChange={(e) => handleCardNumberChange(e)}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </div>
          <div className="inputBox">
            <label htmlFor="cartao-titular">Nome impresso no cartão</label>
            <input
              id="cartao-titular"
              type="text"
              autoComplete="cc-name"
              placeholder="Nome completo"
              className="card-holder-input"
              onChange={(e) => handleCardHolderChange(e)}
              value={cardHolder}
              maxLength={20}
            />
          </div>
          <div className="cadastro-cartao-linha">
            <fieldset className="inputBox">
              <legend>Validade</legend>
              <div className="cadastro-cartao-validade">
                <Select
                  aria-label="Mês da validade"
                  placeholder="Mês"
                  data={MESES}
                  value={expMonth === "mm" ? null : expMonth}
                  onChange={handleExpMonthChange}
                  maxDropdownHeight={220}
                  styles={ESTILO_SELECT}
                />
                <Select
                  aria-label="Ano da validade"
                  placeholder="Ano"
                  data={ANOS}
                  value={expYear === "yy" ? null : expYear}
                  onChange={handleExpYearChange}
                  maxDropdownHeight={220}
                  styles={ESTILO_SELECT}
                />
              </div>
            </fieldset>
            <div className="inputBox">
              <label htmlFor="cartao-cvv">CVV</label>
              <input
                id="cartao-cvv"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                maxLength="4"
                className="cvv-input"
                onMouseEnter={handleCvvMouseEnter}
                onMouseLeave={handleCvvMouseLeave}
                onFocus={handleCvvMouseEnter}
                onBlur={handleCvvMouseLeave}
                onChange={handleCvvChange}
              />
            </div>
          </div>
          <fieldset className="inputBox">
            <legend>Usar este cartão no</legend>
            <div className="cadastro-cartao-tipos" role="radiogroup">
              {TIPOS.map(({ valor, nome }) => (
                <button
                  key={valor}
                  type="button"
                  role="radio"
                  aria-checked={typeCard === valor}
                  className={
                    typeCard === valor
                      ? "cadastro-cartao-tipo selecionado"
                      : "cadastro-cartao-tipo"
                  }
                  onClick={() => handleTypeCardChange(valor)}
                >
                  {nome}
                </button>
              ))}
            </div>
          </fieldset>
          {divMensagem && (
            <MensagemErro mt="md">
              {mensagemApi && respostaAPI !== ""
                ? "Este cartão já está cadastrado na sua conta."
                : mensagemApi
                ? "Não conseguimos salvar seu cartão. Confira os dados e tente novamente."
                : "Preencha todos os campos para salvar o cartão."}
            </MensagemErro>
          )}
          <Button
            {...BOTAO_PRINCIPAL}
            mt={6}
            loading={loadingButton}
            rightIcon={loadingButton ? null : <IconCheck size="1.1rem" />}
            onClick={() => {
              handleRegistrar();
            }}
          >
            Salvar cartão
          </Button>
        </form>
        </div>
      </Card>
      <VoltarComponente />
    </div>
  );
};

export default CartaoCredito;
