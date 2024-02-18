import React, { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaCarAlt, FaParking } from "react-icons/fa";
import { BsCarFrontFill, BsCardList, BsCashCoin, BsClipboard, BsClipboard2Check, BsPaintBucket } from "react-icons/bs";
import { RxLapTimer } from "react-icons/rx";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { Button, Divider } from "@mantine/core";
import createAPI from "../services/createAPI";
import ImpressaoTicketEstacionamento from "../util/ImpressaoTicketEstacionamento";
import calcularValidade from "../util/CalcularValidade";
import { CarCrashOutlined, CarRepair } from "@mui/icons-material";

const BuscarVeiculo = () => {
  const [placa, setPlaca] = useState("placa");
  const [textoPlaca, setTextoPlaca] = useState("");
  const [limite, setLimite] = useState(8);
  const [inputVazio, setInputVazio] = useState("inputvazio3");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [cont, setCont] = useState(0);
  const [div, setDiv] = useState(false);
  const [data, setData] = useState([]);
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);

  const goHistorico = () => {
    const tirarTraco = textoPlaca.split("-").join("");
    const upperCase = tirarTraco.toUpperCase();
    localStorage.setItem("placaCarro", upperCase);
    FuncTrocaComp("HistoricoVeiculo");
  };

  const handlePlaca = () => {
    const clicado = document.getElementById("flexSwitchCheckDefault").checked;
    if (clicado === true) {
      setPlaca("placa2");
      setLimite(10);
      setInputVazio("inputvazio2");
    } else {
      setPlaca("placa");
      setLimite(8);
      setInputVazio("inputvazio3");
    }
  };

  useEffect(() => {

    localStorage.removeItem("usuario");


    if (
      localStorage.getItem("turno") !== "true" &&
      user2.perfil[0] === "monitor"
    ) {
      FuncTrocaComp("AbrirTurno");
    }
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

  const goEstacionar = (link) => {
    const tirarTraco = textoPlaca.split("-").join("");
    const upperCase = tirarTraco.toUpperCase();
    localStorage.setItem("popup", true);
    localStorage.setItem("placa", upperCase);
    localStorage.setItem("id_vagaveiculo", link.id_vaga_veiculo);
    localStorage.setItem("vaga", link.vaga);
    FuncTrocaComp("RegistrarVagaMonitor");
  };

  const hangleRequisicao = () => {
    if (textoPlaca === "") {
        setEstado(true);
        setMensagem("Preencha a placa do veículo");
        setTimeout(() => {
            setEstado(false);
            setMensagem("");
        }, 3000);
        return;
    }

    setEstado2(true);
    const requisicao = createAPI();
    const tirarTraco = textoPlaca.split("-").join("");
    const upperCase = tirarTraco.toUpperCase();
    requisicao
      .get(`/veiculo/${upperCase}`)
      .then((response) => {
        console.log(response.data.data);
        setEstado2(false);
        if (
          response.data.msg.resultado === false &&
          response.data.msg.msg !== "Dados encontrados"
        ) {
          setDiv(false);
          setEstado(true);
          setMensagem(response.data.msg.msg);
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 3000);
        } else {
          setEstado(false);
          setMensagem("");
          setDiv(true);

          const newData = response?.data.data.map((item) => ({
            placa: item.placa,
            modelo: item.modelo.modelo,
            fabricante: item.modelo.fabricante.fabricante,
            cor: item.cor,
            vaga: item.estacionado[0].numerovaga,
            numero_notificacoes_pendentes: item.numero_notificacoes_pendentes,
            saldo_devedor: item.saldo_devedorr,
            debito: item.debitar_automatico === "S" ? "Ativo" : "Inativo",
            saldo: item.saldo,
            cpf: item.cpf,
            estacionado: item.estacionado[0].estacionado,
            tempo: item.estacionado[0].tempo,
            chegada: item.estacionado[0].chegada,
            temporestante: calcularValidade(
              item.estacionado[0].chegada,
              item.estacionado[0].tempo
            ),
            id_vaga_veiculo: item.estacionado[0].id_vaga_veiculo,
            estado: false,
          }));
          setData(newData);
        }
      })
      .catch((error) => {
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

  const notificacoes = () => {
    const tirarTraco = textoPlaca.split("-").join("");
    const upperCase = tirarTraco.toUpperCase();
    localStorage.setItem("placaCarro", upperCase);
    FuncTrocaComp("ListarNotificacoes");
  };

  const imprimirSegundaVia = (link) => {
    if (link.estacionado === "S") {
      ImpressaoTicketEstacionamento(
        "SEGUNDA",
        link.chegada,
        link.tempo,
        "Nao informado",
        link.vaga,
        link.placa,
        "Nao informado",
        "Nao informado",
        link.numero_notificacoes_pendentes
      );
    } else {
    }
  };

  const funcAddCredit = () => {
    localStorage.setItem("usuario", data[0].cpf);
    FuncTrocaComp("AdicionarCreditos");
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
              Consultar veículo
            </div>
            <Divider my="sm" size="md" variant="dashed" />
            <div className="row">
              <div className="col-9 px-3">
                <h5 id="h5Placa">Placa estrangeira</h5>
              </div>
              <div className="col-3 px-3">
                <div className="form-check3 form-switch gap-2 d-md-block">
                  <input
                    className="form-check-input align-self-end"
                    type="checkbox"
                    role="switch"
                    onClick={handlePlaca}
                    id="flexSwitchCheckDefault"
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
            <div className="mb-2 mt-3 gap-2 d-md-block">
              <VoltarComponente space={true} />
              <Button
                loading={estado2}
                onClick={() => {
                  hangleRequisicao();
                }}
                loaderPosition="right"
                className="bg-blue-50 mx-1"
                size="md"
                radius="md"
              >
                Buscar
              </Button>
            </div>
            <div
              className="alert alert-danger mt-4"
              role="alert"
              style={{ display: estado ? "block" : "none" }}
            >
              {mensagem}
            </div>
            {div ? (
              <div>
                {data.map((link, index) => (
                  <div className="card border-3 shadow mt-5" key={index}>
                    <div
                      className={
                        link.numero_notificacoes_pendentes !== 0 &&
                        link.estacionado === "S"
                          ? "card-body8 h-75"
                          : "card-body8"
                      }
                    >
                      <div className="d-flex align-items-center justify-content-between pb-3">
                        <div>
                          <div className="h2 mb-0 d-flex align-items-center">
                            {link.placa}
                          </div>
                          {link.numero_notificacoes_pendentes === 0 ? (
                            <div
                              className="h6 mt-2 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <AiOutlineInfoCircle />‎ Sem notificações
                                pendentes
                              </h6>
                            </div>
                          ) : (
                            <div
                              className="h6 mt-2 d-flex align-items-center fs-6 text-danger"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <AiOutlineInfoCircle />‎{" "}
                                {link.numero_notificacoes_pendentes}{" "}
                                {link.numero_notificacoes_pendentes > 1
                                  ? "notificações"
                                  : "notificação"}{" "}
                                pendentes
                              </h6>
                            </div>
                          )}
                          {link.estacionado === "N" ? (
                            <div
                              className="h6 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <FaParking />‎ Não estacionado
                              </h6>
                            </div>
                          ) : (
                            <div>
                              <div
                                className="h6 d-flex align-items-center fs-6"
                                id="estacionadocarroo"
                              >
                                <h6>
                                  <FaParking />‎ Estacionado - Vaga: {link.vaga}{" "}
                                </h6>
                              </div>
                              <div
                                className="h6 d-flex align-items-center fs-6"
                                id="estacionadocarroo"
                              >
                                <h6>
                                  <RxLapTimer />‎ Tempo restante:{" "}
                                  {link.temporestante}{" "}
                                </h6>
                              </div>
                            </div>
                          )}
                          {link.modelo === null || link.modelo === undefined ? (
                            <div
                              className="h6 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <FaCarAlt />‎ Modelo: Sem informações
                              </h6>
                            </div>
                          ) : (
                            <div
                              className="h6 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <FaCarAlt />‎ Modelo: {link.modelo}
                              </h6>
                            </div>
                          )}
                          <div
                            className="h6 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <BsCashCoin />‎ Saldo devedor:{" "}
                              {link.saldo_devedor}
                            </h6>
                          </div>
                          {link.cor === null || link.cor === undefined ? (
                            <div
                              className="h6 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <BsPaintBucket />‎ Cor: Sem informações
                              </h6>
                            </div>
                          ) : (
                            <div
                              className="h6 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <BsPaintBucket />‎ Cor: {link.cor}
                              </h6>
                            </div>
                          )}
                          {link.fabricante === null ||
                          link.fabricante === undefined ? (
                            <div
                              className="h6 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <FaCarAlt />‎ Fabricante: Sem informações
                              </h6>
                            </div>
                          ) : (
                            <div
                              className="h6 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <FaCarAlt />‎ Fabricante: {link.fabricante}
                              </h6>
                            </div>
                          )}

                          <div
                            className="h6 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <BsClipboard2Check />‎ Debito: {link.debito}
                            </h6>
                          </div>

                          {link.debito === "Ativo" ? (
                            <>
                            <div
                              className="h6 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <BsCashCoin  />‎ Saldo: {link.saldo}
                              </h6>
                            </div>
                            <div
                            className="h6 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <BsCardList />‎ Documento: {link.cpf}
                            </h6>
                          </div>
                          </>
                          ) : null}
                        </div>

                        <div id="sumirCarro">
                          <div className="d-flex align-items-center fw-bold">
                            <FaCarAlt size={40} />
                          </div>
                        </div>
                      </div>
                      <div className=" mb-5 gap-2 d-md-block justify-content-between w-100">
                        {link.numero_notificacoes_pendentes === 0 ? null : (
                          <button
                            type="submit"
                            className="btn4 mb-2 bg-danger botao"
                            onClick={() => {
                              notificacoes();
                            }}
                          >
                            Notificações
                          </button>
                        )}
                        {link.estacionado === "S" ? (
                          <button
                            type="submit"
                            className="btn4 mb-2 botao"
                            onClick={() => {
                              goEstacionar(link);
                            }}
                          >
                            Adicionar tempo
                          </button>
                        ) : null}


                        <button
                          type="submit"
                          className="btn4 mb-2 botao"
                          onClick={() => {
                            imprimirSegundaVia(link);
                          }}
                        >
                          Imprimir via
                        </button>
                        {link.debito === "Ativo" ? (
                          <button
                            type="submit"
                            className="btn4 bg-success mb-2 botao"
                            onClick={() => {
                              funcAddCredit();
                            }}
                          >
                            Adicionar Saldo
                          </button>
                        ) : null}
                        <button
                          type="submit"
                          className="btn4 bg-gray-400 botao"
                          onClick={() => {
                            goHistorico();
                          }}
                        >
                          Histórico
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuscarVeiculo;
