import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { useDisclosure } from "@mantine/hooks";
import ModalPix from "./ModalPix";
import { Button, Divider, Grid, Text } from "@mantine/core";
import ImpressaoTicketEstacionamento from "../util/ImpressaoTicketEstacionamento";
import createAPI from "../services/createAPI";
import ModalErroBanco from "./ModalErroBanco";

const RegistrarEstacionamentoParceiro = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [placa, setPlaca] = useState("placa");
  const [textoPlaca, setTextoPlaca] = useState("");
  const [limite, setLimite] = useState(8);
  const [inputVazio, setInputVazio] = useState("inputvazio3");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [success, setSuccess] = useState(false);
  const [vaga, setVaga] = useState("");
  const [tempo, setTempo] = useState("");
  const [valorCobranca, setValorCobranca] = useState(0);
  const [valorcobranca2, setValorCobranca2] = useState(0);
  const [user2, setUser2] = useState("");
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [onOpen, setOnOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [selectedButton, setSelectedButton] = useState("pix");
  const [onOpenError, setOnOpenError] = useState(false);
  const [onCloseError, setOnCloseError] = useState(false);

  const param = async () => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
    });
    await requisicao
      .get("/parametros")
      .then((response) => {
        setValorCobranca(response.data.data.param.estacionamento.valorHora);
        setValorCobranca2(response.data.data.param.estacionamento.valorHora / 2);
      })
      .catch(function (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("perfil");
      });
  };

  const ValidaFormato = () => {
    setLoadingButton(true);
    
    const clicado = selectedButton;

    if (clicado === "pix" && user2 === 'admin'){
      setLoadingButton(false);
      setSelectedButton("parkimetro");
      setEstado(true);
      setMensagem('Por favor tente estacionar novamente.');
      setTimeout(() => {
        setEstado(false);
        setMensagem("");
      }, 2000);
      return;
    }

    if (clicado === "pix" && user2 !== 'admin') {
      fazerPix();
    } else {
      handleRegistrar();
    }
  };

  function validarPlaca(placa) {
    placa = placa.replace(/\s+/g, '');
    const regexPlacaAntiga = /^[a-zA-Z]{3}\d{4}$/;
    const regexPlacaNova = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

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

    const formaPagamentoo = selectedButton;
    if (placaMaiuscula === "" || placaMaiuscula.length < 7) {
      setLoadingButton(false);
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
          getInfoPix(resposta.data.data.txid);
          setOnOpen(true);
          open();
        } else {
          setLoadingButton(false);
          setEstado(true);
          setMensagem(resposta.data.msg.msg);
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 3000);
        }
      })
      .catch((err) => {
        setLoadingButton(false);
        setOnOpenError(true);
      });
  };

  const handleRegistrar = async () => {
    const tirarTraco = textoPlaca.split("-").join("");
    const placaMaiuscula = tirarTraco.toUpperCase();
    const requisicao = createAPI();

    const formaPagamentoo = selectedButton;
      if (vaga === "") {
        setVaga(0);
      }

      if (placaMaiuscula === "" || placaMaiuscula.length < 7) {
        setLoadingButton(false);
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
          setLoadingButton(false);
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
                    pagamento: selectedButton,
                    id_vaga_veiculo:
                      response.data.data[0].estacionado[0].id_vaga_veiculo,
                  })
                  .then((response) => {
                    setLoadingButton(false);
                    if (response.data.msg.resultado) {
                      if (response.data.msg.msg !== "Vaga atualizada com sucesso") {
                      ImpressaoTicketEstacionamento(
                        'PRIMEIRA',
                        response.data.data.chegada,
                        response.data.data.tempo,
                        response.config.headers.id_usuario,
                        vagaa,
                        placaMaiuscula,
                        "Dinheiro",
                        tempo,
                        response.data.data.notificacao_pendente,
                      );
                      }
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
                requisicao
                  .post("/estacionamento", {
                    placa: placaMaiuscula,
                    numero_vaga: vagaa,
                    tempo: tempo,
                    pagamento: selectedButton,
                  })
                  .then((response) => {
                    setLoadingButton(false);
                    if (response.data.msg.resultado) {
                      if (response.data.msg.msg !== "Vaga atualizada com sucesso") {
                      ImpressaoTicketEstacionamento(
                        'PRIMEIRA',
                        response.data.data.chegada,
                        response.data.data.tempo,
                        response.config.headers.id_usuario,
                        vagaa,
                        placaMaiuscula,
                        "Dinheiro",
                        tempo,
                        response.data.data.notificacao_pendente
                      );
                      }
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
                  setLoadingButton(false);
                  if (response.data.msg.resultado) {
                    if (response.data.msg.msg !== "Vaga atualizada com sucesso") {
                    ImpressaoTicketEstacionamento(
                      'PRIMEIRA',
                      response.data.data.chegada,
                      response.data.data.tempo,
                      response.config.headers.id_usuario,
                      vagaa,
                      placaMaiuscula,
                      "Dinheiro",
                      tempo,
                      response.data.data.notificacao_pendente
                    );
                    }
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
        setLoadingButton(false);
        if (response.data.msg.resultado) {
          if (response.data.msg.msg !== "Vaga atualizada com sucesso") {
          ImpressaoTicketEstacionamento(
            'PRIMEIRA',
            response.data.data.chegada,
            response.data.data.tempo,
            response.config.headers.id_usuario,
            response.data.data.numero_vagas[0],
            placaMaiuscula,
            "PIX",
            tempo,
            response.data.data.notificacao_pendente
          );
          }
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
        setLoadingButton(false);
        setOnOpenError(true);
      });
  }

  const onClose = () => {
    setLoadingButton(false);
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
      } else {
        setPlaca("placa");
      }
    }
  }, [textoPlaca]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    setUser2(user2.perfil[0]);
    if (
      localStorage.getItem("turno") !== "true" &&
      user2.perfil[0] === "monitor"
    ) {
      FuncTrocaComp("AbrirTurno");
    }
    localStorage.removeItem("placaCarro");
    param();
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
    <>
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
                    } } />
                </div>
              </div>
            </div>
            <div className="pt-1 mt-md-0 w-100 p-3" id={placa}>
              <input
                autoFocus
                type="text"
                id={inputVazio}
                className="mt-5 fs-1 justify-content-center align-items-center text-align-center"
                value={textoPlaca}
                onChange={(e) => setTextoPlaca(e.target.value)}
                maxLength={limite} />
            </div>
            <div className="text-start mt-3 mb-1 px-2" onChange={() => { atualiza(); } }>
              <h6>Selecione o tempo:</h6>
              <select
                className="form-select form-select-lg mb-2"
                aria-label=".form-select-lg example"
                id="tempos"
                defaultValue="00:30:00"
              >
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

            <div className="h6 mt-1 mb-4 px-2" style={{ display: tempo !== "00:10:00" ? 'block' : 'none' }}>
              <p className="text-start">Forma de pagamento:</p>
              {user2 !== 'admin' ?
                <>
                  <Grid>
                    <Grid.Col span={6}>
                      <button type="button" className={`btn icon-shape w-75 icon-shape rounded align-center ${
                      selectedButton === "pix"
                        ? "corTempoSelecionado"
                        : "corTempo"
                      }`} 
                      onClick={() => setSelectedButton("pix")}
                      value="pix">
                        <Text fz="lg" weight={700}>
                          PIX
                        </Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={6}>
                    <button type="button" className={`btn icon-shape w-75 icon-shape rounded align-center ${
                      selectedButton === "dinheiro"
                        ? "corTempoSelecionado"
                        : "corTempo"
                      }`} 
                      onClick={() => setSelectedButton("dinheiro")}
                      value="dinheiro">
                        <Text fz="lg" weight={700}>
                          Dinheiro
                        </Text>
                      </button>
                    </Grid.Col>
                  </Grid>
                  </>
                : 
                <Grid>
                    <Grid.Col span={12}>
                    <button type="button" className={`btn icon-shape w-75 icon-shape rounded align-center ${
                      selectedButton === "parkimetro"
                        ? "corTempoSelecionado"
                        : "corTempo"
                      }`} 
                      onClick={() => setSelectedButton("parkimetro")}
                      value="parkimetro">
                        <Text fz="lg" weight={700}>
                          Parkimetro
                        </Text>
                      </button>
                    </Grid.Col>
                  </Grid>
                   }
          </div>

          <div className="mb-2 mt-3 gap-2 d-md-block">
            <VoltarComponente space={true} />
            <Button
              loading={loadingButton}
              className="bg-blue-50"
              size="md"
              radius="md"
              onClick={() => {
                ValidaFormato();
              } }
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
    <ModalErroBanco
          onOpen={onOpenError}
          onClose={onCloseError}
        />
    <ModalPix
        qrCode={data.brcode}
        status={notification}
        mensagemPix={pixExpirado}
        onOpen={onOpen}
        onClose={onClose} />
    </div>
    </>
  );
};

export default RegistrarEstacionamentoParceiro;
