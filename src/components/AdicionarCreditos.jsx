import { React, useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../pages/Style/styles.css";
import VoltarComponente, { voltar } from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import ModalPix from "./ModalPix";
import { useDisclosure } from "@mantine/hooks";
import { Button, Divider, Input } from "@mantine/core";
import { IconCash, IconUser } from "@tabler/icons-react";
import createAPI from "../services/createAPI";
import ImpressaoTicketCredito from "../util/ImpressaoTicketCredito";
import ModalErroBanco from "./ModalErroBanco";

const AdicionarCreditos = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [cpf, setCPF] = useState("");
  const [valor, setValor] = useState("");
  const [pagamentos, setPagamento] = useState("dinheiro");
  const [data, setData] = useState([]);
  const [onOpen, setOnOpen] = useState(false);
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [estado2, setEstado2] = useState(false);
  const [onOpenError, setOnOpenError] = useState(false);
  const [user] = useState(localStorage.getItem("user"));
  const user2 = JSON.parse(user);
  async function getInfoPix(TxId) {
    const requisicao = createAPI();
    await requisicao
      .post("usuario/credito/pix", {
        txid: TxId,
      })
      .then((response) => {
        if (response.data.msg.resultado) {
          ImpressaoTicketCredito(
            cpf,
            valor,
            pagamentos,
            response.config.headers.id_usuario
          );
          setValor("");
          setCPF("");
          setOnOpen(false);
          Swal.fire({
            title: "Sucesso!",
            text: "Créditos adicionados com sucesso!",
            icon: "success",
            timer: 2000,
          });
        } else {
          setNotification(false);
          setPixExpirado("Pix expirado");
        }
      })
      .catch((err) => {
        setEstado2(false);
        setOnOpenError(true);
      });
  }

  const Imprimir = async (cpf, valor, pagamento) => {
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
      monitor: user2.id_usuario,
      valor: valor,
      cpf: cpf[0],
      pagamento: pagamento,
    };
    voltar();
    console.table(user);
    console.table(user.perfil);
    console.table(json);

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(json));
    }
  };

  const FuncArrumaInput = (e) => {
    let valor = e;

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

    setValor(valor);
  };

  const fazerPix = async () => {
    let campo;
    const requisicao = createAPI();
    let cpf2 = `/verificar?cpf=${cpf}`;
    if (cpf2 > 11) {
      cpf2 = `/verificar?cnpj=${cpf}`;
    } else {
      cpf2 = `/verificar?cpf=${cpf}`;
    }
    const Newvalor = parseFloat(valor.replace(",", ".")).toFixed(2);

    requisicao
      .get(cpf2)
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          campo = {
            user: cpf,
            valor: Newvalor,
            pagamento: pagamentos,
          };
          requisicao
            .post("/gerarcobranca", {
              valor: Newvalor,
              campo: JSON.stringify(campo),
            })
            .then((resposta) => {
              if (resposta.data.msg.resultado) {
                setData(resposta.data.data);
                getInfoPix(resposta.data.data.txid);
                setOnOpen(true);
                open();
              } else {
              }
            })
            .catch((err) => {
              setEstado2(false);
              setOnOpenError(true);
            });
        } else {
          setEstado(true);
          setMensagem("Verifique os campos novamente!");
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 4000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async () => {
    const Newvalor = parseFloat(valor.replace(",", ".")).toFixed(2);
    if (Newvalor < 2 || isNaN(Newvalor)) {
      setEstado(true);
      setMensagem("Valor mínimo de R$ 2,00!");
      setTimeout(() => {
        setEstado(false);
        setMensagem("");
      }, 4000);
      return;
    }

    if (pagamentos === "dinheiro") {
      transferencia();
    } else {
      fazerPix();
    }
  };

  const transferencia = async () => {
    const requisicao = createAPI();
    if (cpf !== "" && valor !== "0") {
      setEstado2(true);
      const Newvalor = parseFloat(valor.replace(",", ".")).toFixed(2);
      requisicao
        .post("usuario/credito", {
          user: cpf,
          valor: Newvalor,
          pagamento: pagamentos,
        })
        .then((response) => {
          if (response.data.msg.resultado) {
            ImpressaoTicketCredito(
              cpf,
              Newvalor,
              pagamentos,
              response.config.headers.id_usuario
            );
            setEstado2(false);
            setValor("");
            setCPF("");
            Swal.fire({
              title: "Sucesso!",
              text: "Créditos adicionados com sucesso!",
              icon: "success",
              timer: 2000,
            });
          } else {
            setEstado2(false);
            Swal.fire({
              title: "Erro!",
              text: ` ${response.data.msg.msg}`,
              icon: "error",
              confirmButtonText: "Ok",
            }).then((result) => {
              if (result.isConfirmed) {
              }
            });
          }
        })
        .catch(function (error) {
          if (
            error?.response?.data?.msg === "Cabeçalho inválido!" ||
            error?.response?.data?.msg === "Token inválido!" ||
            error?.response?.data?.msg ===
              "Usuário não possui o perfil mencionado!"
          ) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("perfil");
          } else {
            console.log(error);
          }
        });
    } else if (valor === 0) {
      setEstado(true);
      setMensagem("Verifique os campos novamente!");
      setTimeout(() => {
        setEstado(false);
        setMensagem("");
      }, 4000);
    } else {
      setEstado(true);
      setMensagem("Verifique os campos novamente!");
      setTimeout(() => {
        setEstado(false);
        setMensagem("");
      }, 4000);
    }
    setValor("");
    setCPF("");
  };

  const atualiza = () => {
    const pagamentos = document.getElementById("pagamentos").value;
    setPagamento(pagamentos);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    if (
      localStorage.getItem("turno") !== "true" &&
      user2.perfil[0] === "monitor"
    ) {
      FuncTrocaComp("AbrirTurno");
    }
    setValor("");
    if (localStorage.getItem("usuario") !== null) {
      const user = localStorage.getItem("usuario");
      setCPF([user]);
    }
  }, []);

  return (
    <div className="container">
      <div
        className="row justify-content-center form-bg-image"
        data-background-lg="../../assets/img/illustrations/signin.svg"
      >
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="h5 mt-2 align-items-center text-start">
              <small>Adicionar créditos</small>
            </div>
            <Divider my="sm" size="md" variant="dashed" />
            <div className="row align-items-center pt-2">
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-info w-100"
                  onClick={() => FuncArrumaInput("1000")}
                >
                  10
                </button>
              </div>
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-info w-100"
                  onClick={() => FuncArrumaInput("2000")}
                >
                  20
                </button>
              </div>
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-info w-100"
                  onClick={() => FuncArrumaInput("3000")}
                >
                  30
                </button>
              </div>
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-info w-100"
                  onClick={() => FuncArrumaInput("5000")}
                >
                  50
                </button>
              </div>
            </div>
            <div className="form-group mb-4 mt-4">
              <h6 className="text-start mb-1">CPF ou CNPJ:</h6>
              <div className="input-group">
                <Input
                  type="number"
                  icon={<IconUser />}
                  placeholder="Digite o CPF ou CNPJ"
                  value={cpf}
                  onChange={(e) => setCPF([e.target.value])}
                />
              </div>
            </div>
            <div className="form-group mb-4 mt-4">
              <h6 className="text-start mb-1">Valor:</h6>
              <div className="input-group w-75">
                <Input
                  icon={<IconCash />}
                  placeholder="R$ 0,00"
                  value={valor}
                  onChange={(e) => FuncArrumaInput(e.target.value)}
                />
              </div>
            </div>
            <div
              className="h6 mt-3"
              onChange={() => {
                atualiza();
              }}
            >
              <p className="text-start">Forma de pagamento:</p>
              <select
                className="form-select form-select-lg mb-3"
                aria-label=".form-select-lg example"
                id="pagamentos"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
              </select>
            </div>

            <div className="pt-4 mb-6 gap-2 d-md-block">
              <VoltarComponente space={true} />
              <Button
                loading={estado2}
                onClick={handleSubmit}
                loaderPosition="right"
                className="bg-blue-50"
                size="md"
                radius="md"
              >
                Confirmar
              </Button>
            </div>
            <div
              className="alert alert-danger"
              role="alert"
              style={{ display: estado ? "block" : "none" }}
            >
              {mensagem}
            </div>
            <div style={{ display: estado2 ? "block" : "none" }}></div>
          </div>
        </div>
      </div>
      <ModalErroBanco onOpen={onOpenError} />
      <ModalPix
        qrCode={data.brcode}
        status={notification}
        mensagemPix={pixExpirado}
        onOpen={onOpen}
        funcao={() => Imprimir(cpf, valor, pagamentos)}
      />
    </div>
  );
};

export default AdicionarCreditos;
