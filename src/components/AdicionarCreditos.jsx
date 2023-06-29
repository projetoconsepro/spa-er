import axios from "axios";
import { React, useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../pages/Style/styles.css";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import ModalPix from "./ModalPix";
import { useDisclosure } from "@mantine/hooks";
import { Button, Input, Loader } from "@mantine/core";
import { IconCash } from "@tabler/icons-react";

const AdicionarCreditos = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [cpf, setCPF] = useState("");
  const [valor, setValor] = useState('');
  const [InputPlaca, setInputPlaca] = useState("form-control fs-6");
  const [pagamentos, setPagamento] = useState("dinheiro");
  const [data, setData] = useState([]);
  const [onOpen, setOnOpen] = useState(false);
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [txid, setTxId] = useState("");
  const [estado2, setEstado2] = useState(false);

  async function getInfoPix(TxId, campo) {
    const startTime = Date.now();
    const endTime = startTime + 5 * 60 * 1000;

    let res = { status: "ATIVA" };

    while (Date.now() < endTime && res.status !== "CONCLUIDA") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const user2 = JSON.parse(user);
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });
      res = requisicao
        .get(`/verificarcobranca/${TxId}`)
        .then((resposta) => {
          if (resposta.data.msg.resultado) {
            res = { status: "CONCLUIDA" };
          } else {
            res = { status: "ATIVA" };
          }
        })
        .catch((err) => {
          console.log(err);
        });
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    funcPix(TxId, campo);
  }

  const funcPix = (TxId, campo) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: user2.perfil[0],
      },
    });
    requisicao
      .get(`/verificarcobranca/${TxId}`)
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          setNotification(false);
          handleRegistrar(campo);
          setTimeout(() => {
            close();
            setTimeout(() => {
              setNotification(true);
            }, 2000);
          }, 3000);
        } else {
          console.log("deu 5 min");
          setNotification(false);
          setPixExpirado("Pix expirado");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(valor);
  }, [valor]);


  const FuncArrumaInput = (e) => {
    let valor = e;

    if (valor.length === 1 && valor !== '0') {
      valor = `0,0${valor}`;
    } else if (valor.length > 1) {
      valor = valor.replace(/\D/g, "");
      valor = valor.replace(/^0+/, "");
  
      if (valor.length < 3) {
        valor = `0,${valor}`;
      } else {
        valor = valor.replace(/(\d{2})$/, ',$1');
      }
  
      valor = valor.replace(/(?=(\d{3})+(\D))\B/g, ".");
    }

    setValor(valor);
  };

  const fazerPix = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    let campo;
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: user2.perfil[0],
      },
    });
    let cpf2 = `/verificar?cpf=${cpf}`;
    if (cpf2 > 11) {
      cpf2 = `/verificar?cnpj=${cpf}`;
    } else {
      cpf2 = `/verificar?cpf=${cpf}`;
    }
    console.log(valor[0]);
    valor[0] = parseFloat(valor[0].replace(",", ".")).toFixed(2);

    requisicao
      .get(cpf2)
      .then((resposta) => {
        console.log(resposta);
        if (resposta.data.msg.resultado) {
          console.log(resposta);
          campo = {
            user: cpf,
            valor: valor,
            pagamento: pagamentos,
          };
          requisicao
            .post("/gerarcobranca", {
              valor: valor[0],
              campo: campo,
            })
            .then((resposta) => {
              if (resposta.data.msg.resultado) {
                console.log(resposta);
                setData(resposta.data.data);
                setTxId(resposta.data.data.txid);
                getInfoPix(resposta.data.data.txid, campo);
                setOnOpen(true);
                open();
              } else {
                console.log("n abriu nkk");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          setInputPlaca("form-control fs-5 is-invalid");
          setEstado(true);
          setMensagem("Verifique os campos novamente!");
          setTimeout(() => {
            setInputPlaca("form-control fs-5");
            setEstado(false);
            setMensagem("");
          }, 4000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRegistrar = (campo) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    setEstado2(true);
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: user2.perfil[0],
      },
    });
    if (campo !== undefined) {
      requisicao
        .post("usuario/credito", campo)
        .then((response) => {
          setEstado2(false);
          if (response.data.msg.resultado) {
            Swal.fire({
              title: "Sucesso!",
              text: "Créditos adicionados com sucesso!",
              icon: "success",
              timer: 3000,
              confirmButtonText: "Ok",
            }).then((result) => {
              if (result.isConfirmed) {
              }
            });
            setTimeout(() => {
              setOnOpen(false);
            }, 3000);
          } else {
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
    }
    setValor("");
    setCPF("");
  };

  const handleSubmit = async () => {
    if (pagamentos === "dinheiro") {
      transferencia();
    } else {
      fazerPix();
    }
  };

  const transferencia = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: user2.perfil[0],
      },
    });
    if (cpf !== "" && valor[0] !== "0") {
      setEstado2(true);
      requisicao
        .post("usuario/credito", {
          user: cpf,
          valor: valor,
          pagamento: pagamentos,
        })
        .then((response) => {
          console.log(response);
          if (response.data.msg.resultado) {
            setEstado2(false);
            Swal.fire({
              title: "Sucesso!",
              text: "Créditos adicionados com sucesso!",
              icon: "success",
              confirmButtonText: "Ok",
            }).then((result) => {
              if (result.isConfirmed) {
              }
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
      console.log(valor);
      setInputPlaca("form-control fs-5 is-invalid");
      setEstado(true);
      setMensagem("Verifique os campos novamente!");
      setTimeout(() => {
        setInputPlaca("form-control fs-5");
        setEstado(false);
        setMensagem("");
      }, 4000);
    } else {
      setInputPlaca("form-control fs-5 is-invalid");
      setEstado(true);
      setMensagem("Verifique os campos novamente!");
      setTimeout(() => {
        setInputPlaca("form-control fs-5");
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
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    if (
      localStorage.getItem("turno") !== "true" &&
      user2.perfil[0] === "monitor"
    ) {
      FuncTrocaComp("FecharTurno");
    }
    setValor("");
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="h5 mt-2 align-items-center">
              <small>Adicionar créditos</small>
            </div>
            <div className="row align-items-center pt-2">
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-info w-100"
                  onClick={() => FuncArrumaInput('1000')}
                >
                  10
                </button>
              </div>
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-info w-100"
                  onClick={() => FuncArrumaInput('2000')}
                >
                  20
                </button>
              </div>
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-info w-100"
                  onClick={() => FuncArrumaInput('3000')}
                >
                  30
                </button>
              </div>
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-info w-100"
                  onClick={() => FuncArrumaInput('5000')}
                >
                  50
                </button>
              </div>
            </div>
            <div className="form-group mb-4 mt-4">
              <h6 className="text-start mb-0">CPF ou CNPJ:</h6>
              <div className="input-group">
                <input
                  type="number"
                  className={InputPlaca}
                  value={cpf}
                  onChange={(e) => setCPF([e.target.value])}
                  placeholder="Digite o CPF ou CNPJ"
                />
              </div>
            </div>
            <div className="form-group mb-4 mt-4">
              <h6 className="text-start mb-2">Valor:</h6>

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
              <VoltarComponente space={true}/>
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
            <div style={{ display: estado2 ? "block" : "none" }}>
            </div>
          </div>
        </div>
      </div>
      <ModalPix
        qrCode={data.brcode}
        status={notification}
        mensagemPix={pixExpirado}
        onOpen={onOpen}
      />
    </div>
  );
};

export default AdicionarCreditos;
