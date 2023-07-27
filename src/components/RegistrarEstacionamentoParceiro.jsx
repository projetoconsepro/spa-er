import axios from "axios";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { useDisclosure } from "@mantine/hooks";
import ModalPix from "./ModalPix";
import { Button, Divider, Input } from "@mantine/core";
import { FaParking } from "react-icons/fa";
import Swal from "sweetalert2";
import ImpressaoTicketEstacionamento from "../util/ImpressaoTicketEstacionamento";
import createAPI from "../services/createAPI";

const RegistrarEstacionamentoParceiro = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const socketRef = useRef(null);
  const [data, setData] = useState([]);
  const [placa, setPlaca] = useState("placa");
  const [textoPlaca, setTextoPlaca] = useState("");
  const [limite, setLimite] = useState(8);
  const [inputVazio, setInputVazio] = useState("inputvazio3");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [cont, setCont] = useState(0);
  const [success, setSuccess] = useState(false);
  const [vaga, setVaga] = useState("");
  const [tempo, setTempo] = useState("");
  const [valorCobranca, setValorCobranca] = useState(0);
  const [valorcobranca2, setValorCobranca2] = useState(0);
  const [token, setToken] = useState("");
  const [user2, setUser2] = useState("");
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [txid, setTxId] = useState("");
  const [onOpen, setOnOpen] = useState(false);
  const [divPagamento, setDivPagamento] = useState(true);

  const param = async () => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
    });
    await requisicao
      .get("/parametros")
      .then((response) => {
        setValorCobranca(response.data.data.param.estacionamento.valorHora);
      })
      .catch(function (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("perfil");
      });
  };

  const ValidaFormato = () => {
    const clicado = document.getElementById("pagamentos").value;

    if (clicado === "pix") {
      fazerPix();
    } else {
      handleRegistrar();
    }
  };

  function validarPlaca(placa) {
    const regexPlacaAntiga = /^[a-zA-Z]{3}\d{4}$/;
    const regexPlacaNova =
      /^([A-Z]{3}[0-9][A-Z0-9][0-9]{2})|([A-Z]{4}[0-9]{2})$/;

    if (regexPlacaAntiga.test(placa) || regexPlacaNova.test(placa)) {
      return true;
    } else {
      return false;
    }
  }

  const handlePlaca = () => {
    const clicado = document.getElementById("flexSwitchCheckDefault").checked;
    if (clicado === true) {
      setPlaca("placa2");
      setLimite(100);
      setInputVazio("inputvazio2");
    } else {
      setPlaca("placa");
      setLimite(8);
      setInputVazio("inputvazio3");
    }
  };

  const fazerPix = async () => {
    if (vaga === "") {
      setVaga(0);
    }
    const tirarTraco = textoPlaca.split("-").join("");
    const placaMaiuscula = tirarTraco.toUpperCase();
    const requisicao = createAPI();

    let estado;

    await requisicao
      .get(`/vagas/verifica/${vaga === "" || vaga[0] === "" ? 0 : vaga}`)
      .then((response) => {
        if (!response.data.msg.resultado) {
          setEstado(true);
          setMensagem(response.data.msg.msg);
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 4000);
          estado = true;
          return;
        } else {
          estado = false;
        }
      });

    if (estado) {
      return;
    }

    const formaPagamentoo = document.getElementById("pagamentos").value;
    if (placaMaiuscula === "" || placaMaiuscula.length < 7) {
      setMensagem("Preencha o campo placa");
      setEstado(true);
      setTimeout(() => {
        setEstado(false);
        setMensagem("");
      }, 3000);
      return;
    }

    const sim = document.getElementById("flexSwitchCheckDefault").checked;
    if (!sim) {
      if (!validarPlaca(placaMaiuscula)) {
        setEstado(true);
        setMensagem("Placa inválida");
        setTimeout(() => {
          setEstado(false);
          setMensagem("");
        }, 4000);
        return;
      }
    }

    const vagaa = [];
    if (vaga === "") {
      vagaa[0] = 0;
    } else {
      vagaa[0] = vaga;
    }

    let campo;

    await requisicao
      .get(`/veiculo/${placaMaiuscula}`)
      .then((response) => {
        if (response.data.msg.msg === "Dados encontrados") {
          if (response.data.data[0].estacionado[0].estacionado === "S") {
            campo = {
              placa: placaMaiuscula,
              pagamento: formaPagamentoo,
              numero_vaga: vagaa,
              tempo: tempo,
              id_vaga_veiculo:
                response.data.data[0].estacionado[0].id_vaga_veiculo,
            };
          } else {
            campo = {
              placa: placaMaiuscula,
              pagamento: formaPagamentoo,
              numero_vaga: vagaa,
              tempo: tempo,
            };
          }
        } else {
          campo = {
            placa: placaMaiuscula,
            pagamento: formaPagamentoo,
            numero_vaga: vagaa,
            tempo: tempo,
          };
        }
      })
      .catch(function (error) {
        console.log("a", error);
      });

    const valor = valorcobranca2.toString();
    const valor2 = parseFloat(valor.replace(",", ".")).toFixed(2);

    requisicao
      .post("/gerarcobranca", {
        valor: valor2,
        campo: JSON.stringify(campo),
      })
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          setData(resposta.data.data);
          setTxId(resposta.data.data.txid);
          getInfoPix(resposta.data.data.txid);
          setOnOpen(true);
          open();
        } else {
          console.log("n abriu nkk");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRegistrar = async () => {
    const tirarTraco = textoPlaca.split("-").join("");
    const placaMaiuscula = tirarTraco.toUpperCase();
    const requisicao = createAPI();

    const formaPagamentoo = document.getElementById("pagamentos").value;
      if (vaga === "") {
        setVaga(0);
      }

      if (placaMaiuscula === "" || placaMaiuscula.length < 7) {
        setMensagem("Preencha o campo placa");
        setEstado(true);
        setTimeout(() => {
          setEstado(false);
          setMensagem("");
        }, 3000);
      }

      const sim = document.getElementById("flexSwitchCheckDefault").checked;
      if (!sim) {
        if (!validarPlaca(placaMaiuscula)) {
          setEstado(true);
          setMensagem("Placa inválida");
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 4000);
          return;
        }
      }

      if (textoPlaca.length >= 7) {
        const vagaa = [];
        if (vaga === "") {
          vagaa[0] = 0;
        } else {
          vagaa[0] = vaga;
        }
        await requisicao.get(`/veiculo/${placaMaiuscula}`).then((response) => {
            if (response.data.msg.msg === "Dados encontrados") {
              if (response.data.data[0].estacionado[0].estacionado === "S") {
                requisicao.post("/estacionamento", {
                    placa: placaMaiuscula,
                    numero_vaga: vagaa,
                    tempo: tempo,
                    pagamento: formaPagamentoo,
                    id_vaga_veiculo:
                      response.data.data[0].estacionado[0].id_vaga_veiculo,
                  })
                  .then((response) => {
                    if (response.data.msg.resultado) {
                      ImpressaoTicketEstacionamento(
                        'PRIMEIRA',
                        response.data.data.chegada,
                        response.data.data.tempo_restante,
                        response.config.headers.id_usuario,
                        vagaa,
                        placaMaiuscula,
                        "Dinheiro",
                        tempo,
                        response.data.data.notificacao_pendente,
                      );
                      setVaga("");
                      setTextoPlaca("");
                        if (user2 === "monitor"){
                          FuncTrocaComp("ListarVagasMonitor")
                        } else {
                        setMensagem("Estacionamento registrado com sucesso");
                        setSuccess(true);
                        setTimeout(() => {
                          setSuccess(false);
                          setMensagem("");
                        }, 3000);
                      }
                    } else {
                      setMensagem(response.data.msg.msg);
                      setEstado(true);
                      setTimeout(() => {
                        setEstado(false);
                        setMensagem("");
                      }, 3000);
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
              } else {
                console.log(vagaa);
                requisicao
                  .post("/estacionamento", {
                    placa: placaMaiuscula,
                    numero_vaga: vagaa,
                    tempo: tempo,
                    pagamento: formaPagamentoo,
                  })
                  .then((response) => {
                    if (response.data.msg.resultado) {
                      ImpressaoTicketEstacionamento(
                        'PRIMEIRA',
                        response.data.data.chegada,
                        response.data.data.tempo_restante,
                        response.config.headers.id_usuario,
                        vagaa,
                        placaMaiuscula,
                        "Dinheiro",
                        tempo,
                        response.data.data.notificacao_pendente
                      );
                      setVaga("");
                      setTextoPlaca("");
                        if (user2 === "monitor"){
                          FuncTrocaComp("ListarVagasMonitor")
                        } else {
                        setMensagem("Estacionamento registrado com sucesso");
                        setSuccess(true);
                        setTimeout(() => {
                          setSuccess(false);
                          setMensagem("");
                        }, 3000);
                      }
                    } else {
                      setMensagem(response.data.msg.msg);
                      setEstado(true);
                      setTimeout(() => {
                        setEstado(false);
                        setMensagem("");
                      }, 3000);
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
            } else {
              requisicao.post("/estacionamento", {
                  placa: placaMaiuscula,
                  numero_vaga: vagaa,
                  tempo: tempo,
                  pagamento: formaPagamentoo,
                })
                .then((response) => {
                  if (response.data.msg.resultado) {
                    ImpressaoTicketEstacionamento(
                      'PRIMEIRA',
                      response.data.data.chegada,
                      response.data.data.tempo_restante,
                      response.config.headers.id_usuario,
                      vagaa,
                      placaMaiuscula,
                      "Dinheiro",
                      tempo,
                      response.data.data.notificacao_pendente
                    );
                    setVaga("");
                    setTextoPlaca("");
                      if (user2 === "monitor"){
                        FuncTrocaComp("ListarVagasMonitor")
                      } else {
                      setMensagem("Estacionamento registrado com sucesso");
                      setSuccess(true);
                      setTimeout(() => {
                        setSuccess(false);
                        setMensagem("");
                      }, 3000);
                    }
                  } else {
                    setMensagem(response.data.msg.msg);
                    setEstado(true);
                    setTimeout(() => {
                      setEstado(false);
                      setMensagem("");
                    }, 3000);
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
      
    }

  const atualiza = () => {
    const tempoo = document.getElementById("tempos").value;
    setTempo(tempoo);

    if (tempoo === "02:00:00") {
      setValorCobranca2(valorCobranca * 2);
    } else if (tempoo === "01:00:00") {
      setValorCobranca2(valorCobranca);
    } else if (tempoo === "01:30:00") {
      setValorCobranca2(valorCobranca * 1.5);
    } else if (tempoo === "00:30:00") {
      setValorCobranca2(valorCobranca / 2);
    } else if (tempoo === "00:10:00") {
      setDivPagamento(false)
      setValorCobranca2(valorCobranca * 0);
    } else {
      setValorCobranca2(valorCobranca * 0);
    }
  };

  async function getInfoPix(TxId) {
    const requisicao = createAPI();

    const tirarTraco = textoPlaca.split("-").join("");
    const placaMaiuscula = tirarTraco.toUpperCase();

    await requisicao.post(`/estacionamento/pix`, {
        txid: TxId,
      })
      .then((response) => {
        if (response.data.msg.resultado) {
          console.log('pix', response)
          ImpressaoTicketEstacionamento(
            'PRIMEIRA',
            response.data.data.chegada,
            response.data.data.tempo_restante,
            response.config.headers.id_usuario,
            response.data.data.numero_vagas[0],
            placaMaiuscula,
            "PIX",
            tempo,
            response.data.data.notificacao_pendente
          );
          setOnOpen(false);
          setVaga("");
          setTextoPlaca("");
            if (user2 === "monitor"){
              FuncTrocaComp("ListarVagasMonitor")
            } else {
            setMensagem("Estacionamento registrado com sucesso");
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              setMensagem("");
            }, 3000);
          }
        } else {
          setNotification(false);
          setPixExpirado("Pix expirado");
          setMensagem(response.data.msg.msg);
          setEstado(true);
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    const clicado = document.getElementById("flexSwitchCheckDefault").checked;
    if (clicado === false) {
      if (
        textoPlaca[4] === "1" ||
        textoPlaca[4] === "2" ||
        textoPlaca[4] === "3" ||
        textoPlaca[4] === "4" ||
        textoPlaca[4] === "5" ||
        textoPlaca[4] === "6" ||
        textoPlaca[4] === "7" ||
        textoPlaca[4] === "8" ||
        textoPlaca[4] === "9" ||
        textoPlaca[4] === "0"
      ) {
        setPlaca("placa3");
        if (cont === 0) {
          const fim = textoPlaca.substring(3, textoPlaca.length);
          const texto = textoPlaca.substring(0, 3);
          const traco = "-";
          setTextoPlaca(texto + traco + fim);
          setCont(cont + 1);
        } else {
          const fim = textoPlaca.substring(4, textoPlaca.length);
          const texto = textoPlaca.substring(0, 3);
          const traco = "-";
          setTextoPlaca(texto + traco + fim);
          setCont(cont + 1);
        }
      } else {
        setPlaca("placa");
        setCont(0);
      }
    }
  }, [textoPlaca]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    setToken(token);
    setUser2(user2.perfil[0]);
    if (
      localStorage.getItem("turno") !== "true" &&
      user2.perfil[0] === "monitor"
    ) {
      FuncTrocaComp("FecharTurno");
    }
    localStorage.removeItem("placaCarro");
    param();
    setValorCobranca2(1);
    setTempo("00:30:00");
  }, []);

  const jae = () => {
    const sim = document.getElementById("flexSwitchCheckDefault").checked;
    if (sim === true) {
      setLimite(10);
    } else {
      setLimite(8);
    }
  };

  return (
    <div className="container">
      <div
        className="row justify-content-center form-bg-image"
        data-background-lg="../../assets/img/illustrations/signin.svg"
      >
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="h6 mt-1 align-items-left text-start">
              Registrar estacionamento
            </div>
            <Divider my="sm" size="md" variant="dashed" />
            <div className="row">
              <div className="col-9 px-3 pt-1">
                <h6>Placa estrangeira/Outra</h6>
              </div>
              <div className="col-3 px-3">
                <div className="form-check3 form-switch gap-2 d-md-block">
                  <input
                    className="form-check-input align-self-end"
                    type="checkbox"
                    role="switch"
                    onClick={handlePlaca}
                    id="flexSwitchCheckDefault"
                    onChange={() => {
                      jae();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="pt-1 mt-md-0 w-100 p-3" id={placa}>
              <input
                type="text"
                id={inputVazio}
                className="mt-5 fs-1 justify-content-center align-items-center text-align-center"
                value={textoPlaca}
                onChange={(e) => setTextoPlaca(e.target.value)}
                maxLength={limite}
              />
            </div>
            {user2 === "monitor" ? (
            <div className="text-start mt-3 px-2">
              <h6>Número da vaga (opcional):</h6>
              <Input
                type="number"
                value={vaga}
                icon={<FaParking />}
                onChange={(e) => setVaga([e.target.value])}
                maxLength={limite}
                placeholder="Exemplo: 0 "
              />
            </div>
            ) : null}
            <div className="text-start mt-3 mb-1 px-2" onChange={() => {atualiza();}}>
              <h6>Selecione o tempo:</h6>
              <select
                className="form-select form-select-lg mb-2"
                aria-label=".form-select-lg example"
                id="tempos"
                defaultValue="00:30:00"
              >
                {user2 === "monitor" ? (
                  <option value="00:10:00">Tolerância</option>
                ) : null}
                <option value="00:30:00">30 Minutos</option>
                <option value="01:00:00">60 Minutos</option>
                <option value="01:30:00">90 Minutos</option>
                <option value="02:00:00">120 Minutos</option>
              </select>
              <p id="tempoCusto" className="text-end">
                {" "}
                Valor a ser cobrado: R$ {valorcobranca2}{" "}
              </p>
            </div>
            
            <div className="h6 mt-1 mb-4 px-2" style={{ display: tempo !== "00:10:00" ? 'block' : 'none'}}>
              <p className="text-start">Forma de pagamento:</p>
              <select
                className="form-select form-select-lg mb-3"
                defaultValue="dinheiro"
                aria-label=".form-select-lg example"
                id="pagamentos"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                {user2 === "monitor" ? (
                  <option value="parkimetro">Parkimetro</option>
                ) : null}
              </select>
            </div>

            <div className="mb-2 mt-3 gap-2 d-md-block">
              <VoltarComponente space={true} />
              <Button
                className="bg-blue-50"
                size="md"
                radius="md"
                onClick={() => {
                  ValidaFormato();
                }}
              >
                Registrar
              </Button>
            </div>
            <div
              className="alert alert-danger mt-4"
              role="alert"
              style={{ display: estado ? "block" : "none" }}
            >
              {mensagem}
            </div>
            <div
              className="alert alert-success mt-4"
              role="alert"
              style={{ display: success ? "block" : "none" }}
            >
              {mensagem}
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

export default RegistrarEstacionamentoParceiro;
