/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { FcPlus } from "react-icons/fc";
import { FaBell, FaCarAlt, FaParking } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { IoTrashSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { TbHandClick } from "react-icons/tb";
import "../pages/Style/styles.css";
import Swal from "sweetalert2";
import Cronometro from "./Cronometro";
import FuncTrocaComp from "../util/FuncTrocaComp";
import VoltarComponente from "../util/VoltarComponente";
import { Button, Grid, Group, Input, Text } from "@mantine/core";
import { IconParking } from "@tabler/icons-react";
import createAPI from "../services/createAPI";

const ListarVeiculos = () => {
  const [resposta, setResposta] = useState([]);
  const [valorcobranca, setValorCobranca] = useState("");
  const [valorcobranca2, setValorCobranca2] = useState("2");
  const [mostrar, setMostrar] = useState(false);
  const [mostrar2, setMostrar2] = useState([]);
  const [mostrardiv, setMostrarDiv] = useState([]);
  const [nofityvar, setNotifyVar] = useState([]);
  const [saldoCredito, setSaldoCredito] = useState("");
  const [vaga, setVaga] = useState([]);
  const [notificacao, setNotificacao] = useState([]);
  const [selectedButton, setSelectedButton] = useState("01:00:00");
  const [botaoOff, setBotaoOff] = useState(false);

  const handleButtonClick = (buttonIndex) => {
    setSelectedButton(buttonIndex);
    const tempo1 = buttonIndex;
    if (tempo1 === "02:00:00") {
      setValorCobranca2(valorcobranca * 2);
    } else if (tempo1 === "01:00:00") {
      setValorCobranca2(valorcobranca);
    } else if (tempo1 === "01:30:00") {
      setValorCobranca2(valorcobranca * 1.5);
    } else if (tempo1 === "00:30:00") {
      setValorCobranca2(valorcobranca / 2);
    }
  };

  const parametros = axios.create({
    baseURL: process.env.REACT_APP_HOST,
  });

  const removerVeiculo = (idVeiculo) => {
    Swal.fire({
      title: "Deseja realmente remover este veículo?",
      showCancelButton: true,
      confirmButtonText: `Sim`,
      cancelButtonText: `Não`,
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        const requisicao = createAPI();
        requisicao
          .put(`/veiculo/remover`, {
            id_veiculo: idVeiculo,
          })
          .then((response) => {
            if (response.data.msg.resultado === true) {
              Swal.fire({
                title: response.data.msg.msg,
                icon: "success",
                timer: 2000,
              });
              atualizacomp();
            } else {
              Swal.fire({
                title: response.data.msg.msg,
                icon: "error",
                timer: 2000,
              });
            }
          });
      }
    });
  };

  const atualizacomp = async () => {
    const requisicao = createAPI();
    await requisicao
      .get("/veiculo")
      .then((response) => {
        if (response.data.msg.resultado === false) {
          FuncTrocaComp("CadastrarVeiculo");
        }
        for (let i = 0; i < resposta.length; i++) {
          delete resposta[i];
        }
        for (let i = 0; i < response?.data?.data.length; i++) {
          resposta[i] = {};
          resposta[i].div = "card-body mb-2";
          notificacao[i] = { estado: true };
          mostrar2[i] = { estado: false };
          mostrardiv[i] = { estado: true };
          nofityvar[i] = { notifi: "notify" };
          resposta[i].placa = response.data.data[i].usuario;
          resposta[i].id_veiculo = response.data.data[i].id_veiculo;
          if (response.data.data[i].estacionado === "N") {
            resposta[i].div = "card-body mb-2";
            resposta[i].textoestacionado = "Clique aqui para estacionar";
            resposta[i].estacionado = "Não estacionado";
            resposta[i].temporestante = "";
            notificacao[i] = { estado: true };
            if (response.data.data[i].numero_notificacoes_pendentes === 0) {
              resposta[i].div = "card-body mb-2";
              resposta[i].numero_notificacoes_pendentes = "Sem notificações";
              notificacao[i] = { estado: true };
            } else if (
              response.data.data[i].numero_notificacoes_pendentes === 1
            ) {
              resposta[i].div = "card-body2 mb-2";
              notificacao[i] = { estado: false };
              resposta[i].numero_notificacoes_pendentes = "Uma notificação";
              nofityvar[i] = { notifi: "notify2" };
            } else {
              resposta[i].div = "card-body2 mb-2";
              resposta[
                i
              ].numero_notificacoes_pendentes = `${response.data.data[i].numero_notificacoes_pendentes} notificações`;
              nofityvar[i] = { notifi: "notify2" };
              notificacao[i] = { estado: false };
            }
          } else {
            resposta[i].div = "card-body2 mb-2";
            resposta[i].textoestacionado = "Clique aqui para adicionar tempo";
            mostrardiv[i] = { estado: false };
            resposta[i].notificacoesVaga =
              response.data.data[i].numero_notificacoes_pendentess;
            resposta[i].vaga = response.data.data[i].numerovaga;
            resposta[i].estacionado =
              "Estacionado - Vaga: " + response.data.data[i].numerovaga;
            resposta[i].tempo = response.data.data[i].tempo;
            resposta[i].chegada = response.data.data[i].chegada;
            resposta[i].id_vaga_veiculo = response.data.data[i].id_vaga_veiculo;
            resposta[i].temporestante = response.data.data[i].temporestante;
            if (response.data.data[i].numero_notificacoes_pendentess > 0) {
              resposta[i].textoestacionado = "Clique aqui para regularizar";
              resposta[i].temporestante = "00:00:00";
            }
            if (response.data.data[i].numero_notificacoes_pendentes === 0) {
              resposta[i].numero_notificacoes_pendentes = "Sem notificações";
              notificacao[i] = { estado: true };
            } else if (
              response.data.data[i].numero_notificacoes_pendentes === 1
            ) {
              notificacao[i] = { estado: false };
              resposta[i].numero_notificacoes_pendentes = "Uma notificação";
              nofityvar[i] = { notifi: "notify2" };
            } else {
              resposta[
                i
              ].numero_notificacoes_pendentes = `${response.data.data[i].numero_notificacoes_pendentes} notificações`;
              nofityvar[i] = { notifi: "notify2" };
              notificacao[i] = { estado: false };
            }
          }
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

    await requisicao
      .get("/usuario/saldo-credito")
      .then((response) => {
        setSaldoCredito(response?.data?.data?.saldo);
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

    await parametros
      .get("/parametros")
      .then((response) => {
        setValorCobranca(response.data.data.param.estacionamento.valorHora);
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
  };

  useEffect(() => {
    atualizacomp();
  }, []);

  function mexerValores() {
    const tempo1 = selectedButton;

    if (tempo1 === "02:00:00") {
      return valorcobranca * 2;
    } else if (tempo1 === "01:00:00") {
      return valorcobranca;
    } else if (tempo1 === "01:30:00") {
      return valorcobranca * 1.5;
    } else if (tempo1 === "00:30:00") {
      return valorcobranca / 2;
    }
  }

  function handleClick(index) {
    setMostrar(!mostrar);
    mostrar2[index].estado = !mostrar2[index].estado;
  }

  const hangleplaca = async (placa, index) => {
    setBotaoOff(true);
    setTimeout(() => {
      setBotaoOff(false);
    }, 2000);
    const requisicao = createAPI();
    const tempo1 = selectedButton;

    const resposta = await mexerValores();

    if (vaga.length === 0) {
      vaga[0] = 0;
    }

    if (parseFloat(saldoCredito) < parseFloat(resposta)) {
      Swal.fire({
        icon: "error",
        title: "Saldo insuficiente",
        footer: '<a href="">Clique aqui para adicionar crédito.</a>',
      });
    } else {
      requisicao
        .post("/estacionamento", {
          placa: placa,
          numero_vaga: vaga,
          tempo: tempo1,
          pagamento: "credito",
        })
        .then((response) => {
          if (response.data.msg.resultado === true) {
            atualizacomp();
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.data.msg.msg,
              footer: '<a href="">Por favor, tente novamente.</a>',
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
  };
  const AddTempo = async (placa, index, id_vaga_veiculo, vaga) => {
    setBotaoOff(true);
    setTimeout(() => {
      setBotaoOff(false);
    }, 2000);
    const requisicao = createAPI();
    const vagaa = [];

    vagaa[0] = vaga;

    const tempo1 = selectedButton;

    const resposta = await mexerValores();

    if (parseFloat(saldoCredito) < parseFloat(resposta)) {
      Swal.fire({
        icon: "error",
        title: "Saldo insuficiente",
        footer: '<a href="">Clique aqui para adicionar crédito.</a>',
      });
    } else {
      requisicao
        .post("/estacionamento", {
          placa: placa,
          numero_vaga: vagaa,
          tempo: tempo1,
          pagamento: "credito",
          id_vaga_veiculo: id_vaga_veiculo,
        })
        .then((response) => {
          if (response.data.msg.resultado === true) {
            atualizacomp();
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops..",
              text: response.data.msg.msg,
              footer: '<a href="">Por favor, tente novamente.</a>',
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
  };

  const regularizarNot = async (placa) => {
    localStorage.setItem("placaCarro", placa);
    FuncTrocaComp("Irregularidades");
  };

  return (
    <div className="col-12 px-3 mb-4">
      <p className="text-start fs-2 fw-bold">
        <VoltarComponente arrow={true} /> Meus veículos
      </p>
      <div className="card border-0 shadow">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between pb-3">
            <div>
              <div className="h6 mb-0 d-flex align-items-center">
                Seu saldo é de:
              </div>
              <div className="h1 mt-2 d-flex align-items-center">
                R$ {saldoCredito}
              </div>
            </div>
            <div>
              <div className="d-flex align-items-center fw-bold">
                <FcPlus
                  size={40}
                  onClick={() => {
                    FuncTrocaComp("InserirCreditos");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {resposta.map((link, index) => (
        <div className="card border-0 shadow mt-5" key={index}>
          <div
            id=""
            className={link.div}
            onClick={() => {
              handleClick(index);
            }}
          >
            <div className="d-flex align-items-center justify-content-between pb-3">
              <div>
                <div className="h2 mb-0 d-flex align-items-center">
                  {link.placa}
                </div>
                <div
                  className="h6 mt-2 d-flex align-items-center fs-6"
                  id="estacionadocarro"
                >
                  <h6>
                    <FaParking />‎ {link.estacionado}
                  </h6>
                </div>
                {mostrardiv[index].estado ? null : (
                  <div
                    className="h6 d-flex align-items-center fs-6"
                    id="estacionadocarroo"
                  >
                    <h6>
                      <RxLapTimer />‎ Tempo restante:{" "}
                      <Cronometro time={link.temporestante} />{" "}
                    </h6>
                  </div>
                )}
                {notificacao[index].estado ? null : (
                  <div
                    className="h6 d-flex align-items-center fs-6"
                    id="estacionadocarroo"
                  >
                    <h6>
                      <AiOutlineInfoCircle />‎{" "}
                      {link.numero_notificacoes_pendentes}
                    </h6>
                  </div>
                )}
                <div className="h6 mt-1 d-flex align-items-center fs-6 text-start">
                  <h6 className="fs-6">
                    <TbHandClick /> <small>{link.textoestacionado}</small>
                  </h6>
                </div>
              </div>
              <div>
                <div className="d-flex align-items-center fw-bold">
                  <FaCarAlt size={40} />
                </div>
              </div>
            </div>
          </div>
          {mostrar2[index].estado ? (
            <div className="mb-1">
              {link.notificacoesVaga > 0 ? (
                <div className="card border-0">
                  <div className="card-body2">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div
                          className="h6 d-flex text-start fs-6"
                          id="estacionadocarroo"
                        >
                          <h6>
                            <FaBell /> Você foi notificado nesta vaga.{" "}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn3 botao mt-3"
                      onClick={() => {
                        regularizarNot(link.placa);
                      }}
                    >
                      Regularizar
                    </button>
                    <div className="mt-4 text-end">
                      <span>
                        <IoTrashSharp
                          color="red"
                          size={25}
                          onClick={() => {
                            removerVeiculo(link.id_veiculo);
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ) : mostrardiv[index].estado ? (
                <div className="h6 mt-3 mx-4">
                  <Group position="apart">
                    <p className="text-start mb-3">
                      Determine o tempo (minutos):
                    </p>
                  </Group>
                  <Grid>
                    <Grid.Col span={3}>
                      <button
                        type="button"
                        className={`btn icon-shape icon-shape rounded align-center ${
                          selectedButton === "00:30:00"
                            ? "corTempoSelecionado"
                            : "corTempo"
                        }`}
                        onClick={() => handleButtonClick("00:30:00")}
                      >
                        <Text fz="lg" weight={700}>
                          30
                        </Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button"
                        className={`btn icon-shape icon-shape rounded align-center ${
                          selectedButton === "01:00:00"
                            ? "corTempoSelecionado"
                            : "corTempo"
                        }`}
                        onClick={() => handleButtonClick("01:00:00")}
                      >
                        <Text fz="lg" weight={700}>
                          60
                        </Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button"
                        className={`btn icon-shape icon-shape rounded align-center  ${
                          selectedButton === "01:30:00"
                            ? "corTempoSelecionado"
                            : "corTempo"
                        }`}
                        onClick={() => handleButtonClick("01:30:00")}
                      >
                        <Text fz="lg" weight={700}>
                          90
                        </Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button"
                        className={`btn icon-shape icon-shape rounded align-center ${
                          selectedButton === "02:00:00"
                            ? "corTempoSelecionado"
                            : "corTempo"
                        }`}
                        onClick={() => handleButtonClick("02:00:00")}
                      >
                        <Text fz="lg" weight={700}>
                          120
                        </Text>
                      </button>
                    </Grid.Col>
                  </Grid>
                  <div className="h6 mt-3 mx-2">
                    <p id="tempoCusto" className="text-end">
                      Esse tempo irá custar: R$ {valorcobranca2}{" "}
                    </p>
                    <div className="mt-1 mb-5 gap-2 d-flex justify-content-between">
                      <div></div>
                      <Button
                        type="submit"
                        className="btn3 botao"
                        onClick={() => {
                          hangleplaca(link.placa, index);
                        }}
                        disabled={botaoOff}
                      >
                        Ativar
                      </Button>
                      <div>
                        <span>
                          <IoTrashSharp
                            color="red"
                            size={25}
                            onClick={() => {
                              removerVeiculo(link.id_veiculo);
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h6 mx-4">
                  <Group position="apart">
                    <p className="text-start mb-3">
                      Determine o tempo (minutos):
                    </p>
                  </Group>
                  <Grid>
                    <Grid.Col span={3}>
                      <button
                        type="button"
                        className={`btn icon-shape icon-shape rounded align-center ${
                          selectedButton === "00:30:00"
                            ? "corTempoSelecionado"
                            : "corTempo"
                        }`}
                        onClick={() => handleButtonClick("00:30:00")}
                      >
                        <Text fz="lg" weight={700}>
                          30
                        </Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button"
                        className={`btn icon-shape icon-shape rounded align-center ${
                          selectedButton === "01:00:00"
                            ? "corTempoSelecionado"
                            : "corTempo"
                        }`}
                        onClick={() => handleButtonClick("01:00:00")}
                      >
                        <Text fz="lg" weight={700}>
                          60
                        </Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button"
                        className={`btn icon-shape icon-shape rounded align-center ${
                          selectedButton === "01:30:00"
                            ? "corTempoSelecionado"
                            : "corTempo"
                        }`}
                        onClick={() => handleButtonClick("01:30:00")}
                      >
                        <Text fz="lg" weight={700}>
                          90
                        </Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button"
                        className={`btn icon-shape icon-shape rounded align-center ${
                          selectedButton === "02:00:00"
                            ? "corTempoSelecionado"
                            : "corTempo"
                        }`}
                        onClick={() => handleButtonClick("02:00:00")}
                      >
                        <Text fz="lg" weight={700}>
                          120
                        </Text>
                      </button>
                    </Grid.Col>
                  </Grid>
                  <div className="h6 mx-2 mt-3">
                    <p id="tempoCusto" className="text-end">
                      Esse tempo irá custar: R$ {valorcobranca2}{" "}
                    </p>
                    <p className="text-start" id="horarioChegada">
                      Horário chegada: {link.chegada}{" "}
                    </p>
                    <p className="text-start pb-3" id="horarioChegada">
                      Tempo Creditado: {link.tempo}{" "}
                    </p>
                    <div className="mt-1 mb-5 gap-2 d-flex justify-content-between">
                      <div></div>
                      <button
                        type="submit"
                        onClick={() => {
                          AddTempo(
                            link.placa,
                            index,
                            link.id_vaga_veiculo,
                            link.vaga
                          );
                        }}
                        className="btn3 botao"
                        disabled={botaoOff}
                      >
                        Ativar
                      </button>
                      <div>
                        <span>
                          <IoTrashSharp
                            color="red"
                            size={25}
                            onClick={() => {
                              removerVeiculo(link.id_veiculo);
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ))}

      <Button
        variant="gradient"
        gradient={{ from: "blue", to: "indigo" }}
        className="mt-5"
        radius="md"
        onClick={() => {
          FuncTrocaComp("CadastrarVeiculo");
        }}
      >
        <FaCarAlt size={20} />‎ ‎ ‎ ‎Cadastrar novo veículo
      </Button>
    </div>
  );
};

export default ListarVeiculos;
