import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import ScrollTopArrow from "./ScrollTopArrow";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import createAPI from "../services/createAPI";
import { Button, Group } from "@mantine/core";
import { IconParking, IconReload } from "@tabler/icons-react";
import ImpressaoTicketEstacionamento from "../util/ImpressaoTicketEstacionamento";
import CalcularValidade from "../util/CalcularValidade";
import CalcularHoras from "../util/CalcularHoras";
import LiberarVaga from "../util/LiberarVaga";
import ValidarRequisicao from "../util/ValidarRequisicao";

const ListarVagasMonitor = () => {
  const [resposta, setResposta] = useState([]);
  const [vaga, setVaga] = useState("");
  const [resposta2, setResposta2] = useState([]);
  const [resposta3, setResposta3] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [salvaSetor, setSalvaSetor] = useState("");
  const [vagasLivres, setVagasLivres] = useState(0);
  const [vagasOcupadas, setVagasOcupadas] = useState(0);
  const [vagasVencidas, setVagasVencidas] = useState(0);
  const [horaAgora, setHoraAgora] = useState("");
  const [localVagas, setLocalVagas] = useState(true);
  const [attFunc, setAttFunc] = useState(false);
  const [contador, setContador] = useState(0);

  const getVagas = async (setor, timeout) => {
    const requisicao = createAPI();
    const setor2 = document.getElementById("setoresSelect").value;
    if (setor2 !== undefined && setor2 !== null && setor2 !== "") {
      setor = setor2;
      if (timeout !== true && timeout !== null) {
      for (let i = 0; i < resposta.length; i++) {
        delete resposta[i];
        }
      }
    }
    localStorage.setItem("setorTurno", setor);
    setSalvaSetor(setor);

    setEstado(true);
    setMensagem("Carregando vagas...");
    const startTime = performance.now();
    await requisicao.get(`/vagas?setor=${setor}`).then((response) => {
      const endTime = performance.now();
      const tempoDecorrido = (endTime - startTime) / 1000;
      setMensagem(`Vagas carregadas em ${tempoDecorrido.toFixed(2)} segundos`);
      if (response.data.msg.resultado !== false) {

        const updatedResposta = resposta.map((item) => ({ ...item }));

        for (let i = 0; i < response?.data?.data.length; i++) {
          setSalvaSetor(response.data.data[0].nome);

          if (response.data.data[i].numero !== 0) {
            const updatedItem = {
              numero: response.data.data[i].numero,
              corvaga: response.data.data[i].cor,
              tipo: response.data.data[i].tipo,
              id_vaga: response.data.data[i].id_vaga,
            };

            if (response.data.data[i].estacionado === "N") {
              updatedItem.chegada = "";
              updatedItem.placa = "";
              updatedItem.temporestante = "";
              updatedItem.Countdown = "";
              updatedItem.variaDisplay = "escondido";
            } else {
              updatedItem.debito = response.data.data[i].debitar_automatico;
              updatedItem.numero_notificacoes =
                response.data.data[i].numero_notificacoes_pendentes;
              updatedItem.variaDisplay = "aparece";
              if (response.data.data[i].numero_notificacoes_pendentes !== 0) {
                updatedItem.display = "testeNot";
                updatedItem.numero_notificacoes_pendentes =
                  response.data.data[i].numero_notificacoes_pendentess;
              } else {
                updatedItem.display = "testeNot2";
                updatedItem.numero_notificacoes_pendentes = 0;
              }
              updatedItem.id_vaga_veiculo =
                response.data.data[i].id_vaga_veiculo;
              updatedItem.chegada = response.data.data[i].chegada;
              updatedItem.placa = response.data.data[i].placa;
              updatedItem.temporestante = CalcularValidade(
                response.data.data[i].chegada,
                response.data.data[i].tempo
              );
              response.data.data[i].temporestante = updatedItem.temporestante;
              updatedItem.tempo = response.data.data[i].tempo;

              updatedItem.numero_notificacoes_pendentess =
                response.data.data[i].numero_notificacoes_pendentess;

              const dataAtual = new Date();
              const hora = dataAtual.getHours().toString().padStart(2, "0");
              const minutos = dataAtual
                .getMinutes()
                .toString()
                .padStart(2, "0");
              const segundos = dataAtual
                .getSeconds()
                .toString()
                .padStart(2, "0");
              const horaAtual = `${hora}:${minutos}:${segundos}`;

              function converterParaSegundos(tempo) {
                const [horas2, minutos2, segundos2] = tempo
                  .split(":")
                  .map(Number);
                return horas2 * 3600 + minutos2 * 60 + segundos2;
              }

              const segundosHoraAtual = converterParaSegundos(horaAtual);
              const segundosTempoRestante = converterParaSegundos(
                updatedItem.temporestante
              );

              const diffSegundos = segundosTempoRestante - segundosHoraAtual;
              const diffMinutos = diffSegundos / 60;

              if (updatedItem.temporestante < horaAtual) {
                updatedItem.corline = "#F8D7DA";
                updatedItem.cor = "#842029";
              } else if (diffMinutos <= 10) {
                updatedItem.corline = "#FFF3CD";
                updatedItem.cor = "#664D03";
              } else if (diffMinutos >= 10) {
                updatedItem.corline = "#D1E7DD";
                updatedItem.cor = "#0F5132";
              } else {
                updatedItem.corline = "#fff";
                updatedItem.cor = "#000";
              }
              if (updatedItem.numero_notificacoes_pendentess !== 0) {
                const horaOriginal = new Date(response.data.data[i].hora_notificacao);
                horaOriginal.setHours(horaOriginal.getHours() + 2);

                const horaOriginalFormatada = horaOriginal.toLocaleTimeString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                });

                updatedItem.hora_notificacao = horaOriginalFormatada;

                updatedItem.corline = "#D3D3D4";
                updatedItem.cor = "#141619";
              }
            }
            updatedResposta[i] = updatedItem;
          }
        }

        setResposta(updatedResposta)

        let estacionadoSCount = 0;
        let estacionadoNCount = 0;
        let estacionadoPCount = 0;

        const dataAtual = new Date();
        const hora = dataAtual.getHours().toString().padStart(2, "0");
        const minutos = dataAtual
          .getMinutes()
          .toString()
          .padStart(2, "0");
        const segundos = dataAtual
          .getSeconds()
          .toString()
          .padStart(2, "0");
        const horaAtual = `${hora}:${minutos}:${segundos}`;

        response.data.data.forEach((objeto) => {
          if (objeto.numero !== 0) {
            if (objeto.estacionado === "S") {
              estacionadoSCount++;
              if (objeto.temporestante < horaAtual && objeto.numero_notificacoes_pendentess === 0) {
                estacionadoPCount++;
              }
            } else if (objeto.estacionado === "N") {
              estacionadoNCount++;
            }
          }
        });

        setVagasLivres(estacionadoNCount);
        setVagasOcupadas(estacionadoSCount);
        setVagasVencidas(estacionadoPCount);
      } else {
        setEstado(true);
        setMensagem(response.data.msg.msg);
      }
    });
  };

useEffect(() => {
  localStorage.removeItem("id_vagaveiculo");
    if (localStorage.getItem("numero_vaga")) {
      setVaga(localStorage.getItem("numero_vaga"));
      setTimeout(() => {
        localStorage.removeItem("numero_vaga");
      }, 100);
    } 

  const cardToScroll = document.querySelector(
    `.card-list[data-vaga="${vaga}"]`
  );
  if (cardToScroll) {
    setTimeout(() => {
      cardToScroll.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }
  }, [vaga, attFunc]);

  useEffect(() => {
    if (contador === 60) {
      setContador(0);
      getVagas(salvaSetor, true);
    }
    setTimeout(() => {
      setContador(contador + 1);
    }, 1000);
  }, [contador]);

  const horaAgoraFunc = async () => {
    const dataAtual = new Date();
    const hora = dataAtual.getHours().toString().padStart(2, "0");
    const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
    const segundos = dataAtual.getSeconds().toString().padStart(2, "0");
    const horaAtual = `${hora}:${minutos}:${segundos}`;
    setHoraAgora(horaAtual);
    return horaAtual;
  };

  useEffect(() => {
      (async () => {
        const setor = localStorage.getItem("setorTurno");
        setSalvaSetor(setor);
        await getVagas(setor, null);
      })();
  }, [localVagas]);

  useEffect(() => {
    if (localStorage.getItem("turno") != "true") {
      FuncTrocaComp("AbrirTurno");
    };

    const requisicao = createAPI();
    localStorage.removeItem("idVagaVeiculo");
    requisicao.get("/setores")
      .then((response) => {
        for (let i = 0; i < response?.data?.data?.setores?.length; i++) {
          resposta2[i] = {};
          resposta2[i].setores = response.data.data.setores[i].nome;
        }
      })
      .catch(function (error) {
      ValidarRequisicao(error)
      });
    localStorage.removeItem("idVagaVeiculo");
    localStorage.removeItem("placa");
    localStorage.removeItem("vaga");
    localStorage.removeItem("placaCarro");
    localStorage.removeItem("tipoVaga");
    localStorage.removeItem("id_notificacao");
    for (let i = 0; i < 8; i++) {
      localStorage.removeItem(`foto${i}`);
    }
  }, []);

  const funcExtratoPlaca = (placa) => {
    const requisicao = createAPI();
    requisicao
      .get(`/veiculo/${placa}`)
      .then((response) => {
        if (
          response.data.msg.resultado === false &&
          response.data.msg.msg !== "Dados encontrados"
        ) {
          setMensagem(response.data.msg.msg);
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 3000);
        } else {
          const link = response?.data.data.map((item) => ({
            placa: item.placa,
            modelo: item.modelo.modelo,
            fabricante: item.modelo.fabricante.fabricante,
            cor: item.cor,
            vaga: item.estacionado[0].numerovaga,
            numero_notificacoes_pendentes: item.numero_notificacoes_pendentes,
            saldo_devedor: item.saldo_devedorr,
            estacionado: item.estacionado[0].estacionado,
            tempo: item.estacionado[0].tempo,
            chegada: item.estacionado[0].chegada,
            temporestante: item.estacionado[0].temporestante,
            id_vaga_veiculo: item.estacionado[0].id_vaga_veiculo,
          }));

          const impressao = link[0];

          ImpressaoTicketEstacionamento(
            "SEGUNDA",
            impressao.chegada,
            impressao.tempo,
            "Nao informado",
            impressao.vaga,
            impressao.placa,
            "Nao informado",
            "Nao informado",
            impressao.numero_notificacoes_pendentes
          );
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

  const estaciona = async (
    hora_notificacao,
    numero,
    id_vaga,
    tempo,
    placa,
    notificacoes,
    notificacoess,
    tipo,
    debito,
    index
  ) => {
    localStorage.setItem("numero_vaga", numero);
    const requisicao = createAPI();
    const horaAgoraNew = await horaAgoraFunc();
    if (tempo < horaAgoraNew && placa !== "") {
      if ((notificacoes !== 0 || notificacoess !== 0) && horaAgoraNew < hora_notificacao) {
        Swal.fire({
          title: "Deseja liberar esta vaga?",
          showCancelButton: true,
          showDenyButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Liberar",
          denyButtonText: `Regularizar`,
          denyButtonColor: "#3A58C8",
          footer: `
          <button class="btn3 botao bg-blue-50" id="ticket">
          Extrato de placa
          </button>
          `,
        }).then((result) => {
          if (result.isConfirmed) {
            requisicao
              .post(`/estacionamento/saida`, {
                idvagaVeiculo: id_vaga,
              })
              .then(async (response) => {
                if (response.data.msg.resultado) {
                  await LiberarVaga(resposta, setResposta, index);
                } else {
                  Swal.fire(`${response.data.msg.msg}`, "", "error");
                }
              })
              .catch(function (error) {
                ValidarRequisicao(error)
              });
          } else if (result.isDenied) {
            localStorage.setItem("VagaVeiculoId", id_vaga);
            FuncTrocaComp("ListarNotificacoes");
          }
        });

        const btnFooter2 = document.getElementById("ticket");
        btnFooter2.addEventListener("click", function () {
          funcExtratoPlaca(placa);
        });
      } else if ((notificacoes !== 0 || notificacoess !== 0) &&  horaAgoraNew >= hora_notificacao) {
        Swal.fire({
          title: "Deseja liberar esta vaga?",
          showCancelButton: true,
          showDenyButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Liberar",
          denyButtonText: `Notificar`,
          footer: `
          <button class="btn3 botao bg-blue-50" id="ticket">
          Extrato de placa
          </button>
          `,
        }).then((result) => {
          if (result.isConfirmed) {
            requisicao
              .post(`/estacionamento/saida`, {
                idvagaVeiculo: id_vaga,
              })
              .then(async (response) => {
                if (response.data.msg.resultado) {
                  await LiberarVaga(resposta, setResposta, index);
                } else {
                  Swal.fire(`${response.data.msg.msg}`, "", "error");
                }
              })
              .catch(function (error) {
                ValidarRequisicao(error)
              });
          } else if (result.isDenied) {
            localStorage.setItem("vaga", numero);
            localStorage.setItem("placa", placa);
            FuncTrocaComp("Notificacao");
          }
        });

        const btnFooter2 = document.getElementById("ticket");
        btnFooter2.addEventListener("click", function () {
          funcExtratoPlaca(placa);
        });
      } else if (debito === "S") {
        Swal.fire({
          title: "Deseja liberar esta vaga?",
          showDenyButton: true,
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Liberar",
          denyButtonText: `Debitar`,
          denyButtonColor: "green",
          footer: `
          <button class="btn3 botao bg-blue-50" id="ticket">
          Extrato de placa
          </button>
          `,
        }).then((result) => {
          if (result.isConfirmed) {
            requisicao
              .post(`/estacionamento/saida`, {
                idvagaVeiculo: id_vaga,
              })
              .then(async (response) => {
                if (response.data.msg.resultado) {
                  await LiberarVaga(resposta, setResposta, index);
                } else {
                  Swal.fire(`${response.data.msg.msg}`, "", "error");
                }
              })
              .catch(function (error) {
                ValidarRequisicao(error)
              });
          } else if (result.isDenied) {
            requisicao
              .post("/estacionamento", {
                placa: placa,
                numero_vaga: numero,
                tempo: tempo,
                id_vaga_veiculo: id_vaga,
              })
              .then((response) => {
                if (response.data.msg.resultado === true) {
                  ImpressaoTicketEstacionamento('PRIMEIRA',
                  response.data.data.chegada,
                  response.data.data.tempo,
                  response.config.headers.id_usuario,
                  [numero],
                  placa,
                  'debito',
                  '00:30:00',
                  response.data.data.notificacao_pendente
                  );
                  const updatedResposta = [...resposta];
                  let validade = CalcularHoras(CalcularValidade(response.data.data.chegada, response.data.data.tempo))
                  updatedResposta[index] = {
                    ...updatedResposta[index],
                    temporestante: CalcularValidade(response.data.data.chegada, response.data.data.tempo),
                    corline: validade.corline,
                    cor: validade.cor,
                  };
                  const newArray = updatedResposta.filter((item) => item !== undefined);
                  setResposta(newArray);
                  localStorage.setItem("listaVagas", JSON.stringify(newArray));

                } else {
                  Swal.fire({
                    title: `${response.data.msg.msg}`,
                    showCancelButton: true,
                    showDenyButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Liberar",
                    denyButtonText: `Notificar`,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      requisicao
                        .post(`/estacionamento/saida`, {
                          idvagaVeiculo: id_vaga,
                        })
                        .then(async (response) => {
                          if (response.data.msg.resultado) {
                            await LiberarVaga(resposta, setResposta, index);
                          } else {
                            Swal.fire(`${response.data.msg.msg}`, "", "error");
                          }
                        })
                        .catch(function (error) {
                          ValidarRequisicao(error)
                        });
                    } else if (result.isDenied) {
                      localStorage.setItem("id_vagaveiculo", id_vaga);
                      localStorage.setItem("vaga", numero);
                      localStorage.setItem("placa", placa);
                      localStorage.setItem("idVagaVeiculo", id_vaga);
                      FuncTrocaComp("Notificacao");
                    }
                  });
                }
              })
              .catch(function (error) {
                ValidarRequisicao(error)
              });
          }
        });

        const btnFooter2 = document.getElementById("ticket");
        btnFooter2.addEventListener("click", function () {
          funcExtratoPlaca(placa);
        });
      } else {
        Swal.fire({
          title: "Deseja liberar esta vaga?",
          showDenyButton: true,
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Liberar",
          denyButtonText: `Notificar`,
          footer: `
          <button class="btn3 botao bg-green-50 mx-2" id="btnFooter">
          Adicionar tempo
          </button>
          <br />
          <button class="btn3 botao bg-blue-50" id="ticket">
          Extrato de placa
          </button>
          `,
        }).then((result) => {
          if (result.isConfirmed) {
            requisicao
              .post(`/estacionamento/saida`, {
                idvagaVeiculo: id_vaga,
              })
              .then(async (response) => {
                if (response.data.msg.resultado) {
                  await LiberarVaga(resposta, setResposta, index);
                } else {
                  Swal.fire(`${response.data.msg.msg}`, "", "error");
                }
              })
              .catch(function (error) {
                ValidarRequisicao(error)
                });
          } else if (result.isDenied) {
            localStorage.setItem("id_vagaveiculo", id_vaga);
            localStorage.setItem("vaga", numero);
            localStorage.setItem("placa", placa);
            localStorage.setItem("idVagaVeiculo", id_vaga);
            FuncTrocaComp("Notificacao");
          }
        });

        const btnFooter = document.getElementById("btnFooter");
        btnFooter.addEventListener("click", function () {
          localStorage.setItem("vaga", numero);
          localStorage.setItem("id_vagaveiculo", id_vaga);
          localStorage.setItem("placa", placa);
          localStorage.setItem("popup", true);
          FuncTrocaComp("RegistrarVagaMonitor");
          Swal.close();
        });

        const btnFooter2 = document.getElementById("ticket");
        btnFooter2.addEventListener("click", function () {
          funcExtratoPlaca(placa);
        });
      }
    } else {
      if (placa === "") {
        localStorage.setItem("vaga", numero);
        localStorage.setItem("tipoVaga", tipo);
        localStorage.setItem("popup", false);
        FuncTrocaComp("RegistrarVagaMonitor");
      } else {
        Swal.fire({
          title: "Deseja liberar esse veículo?",
          showDenyButton: true,
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Liberar",
          denyButtonText: `Adicionar tempo`,
          denyButtonColor: "green",
          footer: `
          <button class="btn3 botao bg-blue-50" id="ticket">
          Extrato de placa
          </button>
          `,
        }).then((result) => {
          if (result.isConfirmed) {
            requisicao
              .post(`/estacionamento/saida`, {
                idvagaVeiculo: id_vaga,
              })
              .then(async (response) => {
                if (response.data.msg.resultado) {
                  await LiberarVaga(resposta, setResposta, index);
                } else {
                  Swal.fire(`${response.data.msg.msg}`, "", "error");
                }
              })
              .catch(function (error) {
                ValidarRequisicao(error)
                });
          } else if (result.isDenied) {
            localStorage.setItem("vaga", numero);
            localStorage.setItem("id_vagaveiculo", id_vaga);
            localStorage.setItem("placa", placa);
            localStorage.setItem("popup", true);
            FuncTrocaComp("RegistrarVagaMonitor");
          }
        });

        const btnFooter2 = document.getElementById("ticket");
        btnFooter2.addEventListener("click", function () {
          funcExtratoPlaca(placa);
        });
      }
    }
  };

  return (
    <div className="dashboard-container mb-5">
      <div className="row">
        <div className="col-12 col-xl-8">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="row mx-2">
                <Group position="apart">
                  <Button
                    variant="gradient"
                    gradient={{ from: "indigo", to: "blue", deg: 60 }}
                    className="w-75"
                    mb="md"
                    radius="md"
                    size="md"
                    onClick={() =>
                      FuncTrocaComp("RegistrarEstacionamentoParceiro")
                    }
                  >
                    Registrar estacionamento ‎{" "}
                    <IconParking color="white" size={18} />
                  </Button>
                  <Button
                    variant="gradient"
                    gradient={{ from: "indigo", to: "blue", deg: 60 }}
                    mb="md"
                    radius="md"
                    size="md"
                    onClick={() => getVagas(salvaSetor, 'reset')}
                  >
                    <IconReload color="white" size={20} />
                  </Button>
                </Group>
              </div>
              <div className="row mx-2">
                <div className="col-6 align-middle">
                  <select
                    className="form-select form-select-lg mb-3 mt-2"
                    value={salvaSetor}
                    aria-label=".form-select-lg example"
                    id="setoresSelect"
                    onChange={() => {
                      getVagas(salvaSetor, 'reset');
                    }}
                  >
                    {resposta2.map((link, index) => (
                      <option value={link.setores} key={index}>
                        Setor: {link.setores}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6 input-group w-50 h-25 mt-3">
                  <span
                    className="input-group-text bg-blue-50 text-white"
                    id="basic-addon1"
                  >
                    <FaSearch />
                  </span>
                  <input
                    className="form-control bg-white rounded-end border-bottom-0"
                    type="number"
                    value={vaga}
                    onChange={(e) => setVaga(e.target.value)}
                    placeholder="Número da vaga"
                    aria-describedby="basic-addon1"
                  />
                </div>
              </div>
              <div>
                <div className="row px-2 mb-1">
                  <div className="col-4 beetwen text-start">
                    {" "}
                    <small>
                      <small>Livres: {vagasLivres}</small>{" "}
                    </small>
                  </div>
                  <div className="col-4 beetwen">
                    <small>
                      <small>Ocupadas: {vagasOcupadas}</small>{" "}
                    </small>
                  </div>
                  <div className="col-4 beetwen text-end">
                    {" "}
                    <small>
                      <small>Tempo : {vagasVencidas}</small>{" "}
                    </small>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow">
                <div className="table-responsive">
                  <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th className="border-bottom" scope="col">
                          Vaga
                        </th>
                        <th className="border-bottom" scope="col">
                          Placa
                        </th>
                        <th className="border-bottom" scope="col">
                          Chegada
                        </th>
                        <th className="border-bottom" scope="col">
                          Tempo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {resposta.length !== 0 ? (
                        resposta.map((vaga, index) => (
                        vaga !== null && (
                        <tr
                          key={index}
                          className="card-list"
                          data-vaga={vaga.numero}
                          onClick={() => {
                            estaciona(
                              vaga.hora_notificacao,
                              vaga.numero,
                              vaga.id_vaga_veiculo,
                              vaga.temporestante,
                              vaga.placa,
                              vaga.numero_notificacoes_pendentes,
                              vaga.numero_notificacoes_pendentess,
                              vaga.tipo,
                              vaga.debito,
                              index
                            );
                          }}
                        >
                          <th
                            className="text-white"
                            scope="row"
                            style={{
                              backgroundColor: vaga.corvaga,
                              color: vaga.cor,
                            }}
                          >
                            {vaga.numero}
                          </th>
                          <td
                            className="fw-bolder"
                            style={{
                              backgroundColor: vaga.corline,
                              color: vaga.cor,
                            }}
                          >
                            {vaga.placa == '0' ? null : vaga.placa}{" "}
                            <small id={vaga.display}>
                              {vaga.numero_notificacoes}
                            </small>
                          </td>
                          <td
                            className="fw-bolder"
                            style={{
                              backgroundColor: vaga.corline,
                              color: vaga.cor,
                            }}
                          >
                            {vaga.chegada}
                          </td>
                          <td
                            className="fw-bolder"
                            style={{
                              backgroundColor: vaga.corline,
                              color: vaga.cor,
                            }}
                          >
                            <h6
                              id={vaga.variaDisplay}
                              style={{
                                backgroundColor: vaga.corline,
                                color: vaga.cor,
                              }}
                            >
                              <span>{vaga.temporestante}</span>
                            </h6>
                          </td>
                        </tr>
                        )
                      ))) : ( null )}

                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className="alert alert-danger"
                id="sim"
                role="alert"
                style={{ display: estado ? "block" : "none" }}
              >
                {mensagem}
              </div>
            </div>
          </div>
          <VoltarComponente />
        </div>
      </div>
      <ScrollTopArrow />
    </div>
  );
};

export default ListarVagasMonitor;
