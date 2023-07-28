import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import Cronometro from "./Cronometro";
import ScrollTopArrow from "./ScrollTopArrow";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import createAPI from "../services/createAPI";
import { Button, Group } from "@mantine/core";
import { IconParking, IconReload } from "@tabler/icons-react";

const ListarVagasMonitor = () => {
  const [resposta, setResposta] = useState([]);
  const [vaga, setVaga] = useState("");
  const [resposta2, setResposta2] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [salvaSetor, setSalvaSetor] = useState("");
  const [tolerancia, setTolerancia] = useState(10);
  const [contador, setContador] = useState(0);
  const [vagasLivres, setVagasLivres] = useState(0);
  const [vagasOcupadas, setVagasOcupadas] = useState(0);
  const [vagasVencidas, setVagasVencidas] = useState(0);

  const getVagas = async (setor) => {
    const requisicao = createAPI();
    const setor2 = document.getElementById("setoresSelect").value;
    if (setor2 !== undefined && setor2 !== null && setor2 !== "") {
      setor = setor2;
      for (let i = 0; i < resposta.length; i++) {
        delete resposta[i];
      }
    }
    localStorage.setItem("setorTurno", setor);
    setSalvaSetor(setor);
    await requisicao
      .get(`/vagas?setor=${setor}`)
      .then((response) => {
        if (response.data.msg.resultado !== false) {
          setEstado(false);
          setMensagem("");
          for (let i = 0; i < response?.data?.data.length; i++) {
            setSalvaSetor(response.data.data[0].nome);
            if (response.data.data[i].numero !== 0) {
              resposta[i] = {};
              resposta[i].numero = response.data.data[i].numero;
              resposta[i].corvaga = response.data.data[i].cor;
              resposta[i].tipo = response.data.data[i].tipo;
              resposta[i].id_vaga = response.data.data[i].id_vaga;

              if (response.data.data[i].estacionado === "N") {
                resposta[i].chegada = "";
                resposta[i].placa = "";
                resposta[i].temporestante = "";
                resposta[i].Countdown = "";
                resposta[i].variaDisplay = "escondido";
              } else {
                resposta[i].debito = response.data.data[i].debitar_automatico;
                resposta[i].numero_notificaoes =
                  response.data.data[i].numero_notificacoes_pendentes;
                resposta[i].variaDisplay = "aparece";
                if (response.data.data[i].numero_notificacoes_pendentes !== 0) {
                  resposta[i].display = "testeNot";
                  resposta[i].numero_notificacoes_pendentes =
                    response.data.data[i].numero_notificacoes_pendentess;
                } else {
                  resposta[i].display = "testeNot2";
                  resposta[i].numero_notificacoes_pendentes = 0;
                }
                resposta[i].id_vaga_veiculo =
                  response.data.data[i].id_vaga_veiculo;
                resposta[i].chegada = response.data.data[i].chegada;
                resposta[i].placa = response.data.data[i].placa;
                resposta[i].temporestante = response.data.data[i].temporestante;
                resposta[i].tempo = response.data.data[i].tempo;

                const horasplit = resposta[i].temporestante.split(":");

                resposta[i].numero_notificacoes_pendentess =
                  response.data.data[i].numero_notificacoes_pendentess;
                if (
                  response.data.data[i].numero_notificacoes_pendentess !== 0
                ) {
                  resposta[i].temporestante = "00:00:00";
                }

                if (resposta[i].temporestante === "00:00:00") {
                  resposta[i].corline = "#F8D7DA";
                  resposta[i].cor = "#842029";
                } else if (horasplit[0] === "00") {
                  const minutos = parseInt(horasplit[1]);
                  if (minutos <= tolerancia) {
                    resposta[i].corline = "#FFF3CD";
                    resposta[i].cor = "#664D03";
                  } else {
                    resposta[i].corline = "#D1E7DD";
                    resposta[i].cor = "#0F5132";
                  }
                } else if (horasplit[0] !== "00") {
                  resposta[i].corline = "#D1E7DD";
                  resposta[i].cor = "#0F5132";
                } else {
                  resposta[i].corline = "#fff";
                  resposta[i].cor = "#000";
                }
                if (resposta[i].numero_notificacoes_pendentess !== 0) {
                  resposta[i].corline = "#D3D3D4";
                  resposta[i].cor = "#141619";
                }

                const tempo = resposta[i].temporestante.split(":");
                const data = new Date();
                const ano = data.getFullYear();
                const mes = data.getMonth() + 1;
                const dia = data.getDate();
                tempo[0] = parseInt(tempo[0].replace(0, ""));
                tempo[1] = parseInt(tempo[1].replace(0, ""));
                let minuto = data.getMinutes() + tempo[1];
                if (minuto >= 60) {
                  tempo[0] = tempo[0] + 1;
                  minuto = minuto - 60;
                }
                const hora = data.getHours() + tempo[0];
                const formatada =
                  ano +
                  "-" +
                  mes +
                  "-" +
                  dia +
                  " " +
                  hora +
                  ":" +
                  minuto +
                  ":00";
                resposta[i].Countdown = formatada;
              }
            }
          }
          let estacionadoSCount = 0;
          let estacionadoNCount = 0;
          let estacionadoPCount = 0;

          response.data.data.forEach((objeto) => {
            if (objeto.numero !== 0) {
              if (objeto.estacionado === "S") {
                estacionadoSCount++;
                if (objeto.temporestante === "00:00:00") {
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
    if (contador === 60) {
      setContador(0);
      getVagas(salvaSetor);
    }
    setTimeout(() => {
      setContador(contador + 1);
    }, 1000);
  }, [contador]);

  useEffect(() => {
    setTimeout(() => {
      if (localStorage.getItem("numero_vaga")) {
        setVaga(localStorage.getItem("numero_vaga"));
        setTimeout(() => {
          localStorage.removeItem("numero_vaga");
        }, 1000);
      }
    }, 2300);

    const cardToScroll = document.querySelector(
      `.card-list[data-vaga="${vaga}"]`
    );
    if (cardToScroll) {
      setTimeout(() => {
        cardToScroll.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [vaga]);

  useEffect(() => {
    if (localStorage.getItem("turno") !== "true") {
      FuncTrocaComp("FecharTurno");
    }

    const requisicao = createAPI();
    localStorage.removeItem("idVagaVeiculo");
    requisicao
      .get("/setores")
      .then((response) => {
        for (let i = 0; i < response?.data?.data?.setores?.length; i++) {
          resposta2[i] = {};
          resposta2[i].setores = response.data.data.setores[i].nome;
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
    requisicao
      .get("setores/tolerancia")
      .then((response) => {
        const timestamp = response.data.data.tolerancia;
        const data = new Date(timestamp * 1000);
        const minutes = data.getMinutes();
        const teste = parseInt(minutes);
        setTolerancia(teste);
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

    const setor = localStorage.getItem("setorTurno");
    setSalvaSetor(setor);
    getVagas(setor);
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

  const estaciona = (
    numero,
    id_vaga,
    tempo,
    placa,
    notificacoes,
    notificacoess,
    tipo,
    debito
  ) => {

    localStorage.setItem("numero_vaga", numero);
    const requisicao = createAPI();
    if (tempo === "00:00:00") {
      if (notificacoes !== 0 || notificacoess !== 0) {
        Swal.fire({
          title: "Deseja liberar esta vaga?",
          showCancelButton: true,
          showDenyButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Liberar",
          denyButtonText: `Regularizar`,
          denyButtonColor: "#3A58C8",
        }).then((result) => {
          if (result.isConfirmed) {
            requisicao
              .post(`/estacionamento/saida`, {
                idvagaVeiculo: id_vaga,
              })
              .then((response) => {
                if (response.data.msg.resultado) {
                  Swal.fire({
                    text:"Vaga liberada", 
                    title:"", 
                    icon:"success",
                    timer: 1200,
                  });
                  setTimeout(() => {
                    getVagas(salvaSetor);
                  }, 1000);
                } else {
                  Swal.fire(`${response.data.msg.msg}`, "", "error");
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
          } else if (result.isDenied) {
            localStorage.setItem("VagaVeiculoId", id_vaga);
            FuncTrocaComp("ListarNotificacoes");
          }
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
        }).then((result) => {
          if (result.isConfirmed) {
            requisicao.post(`/estacionamento/saida`, {
                idvagaVeiculo: id_vaga,
              })
              .then((response) => {
                if (response.data.msg.resultado) {
                  Swal.fire({
                    text:"Vaga liberada", 
                    title:"", 
                    icon:"success",
                    timer: 1200,
                  });
                  setTimeout(() => {
                    getVagas(salvaSetor);
                  }, 1000);
                } else {
                  Swal.fire(`${response.data.msg.msg}`, "", "error");
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
          } else if (result.isDenied) {
            requisicao.post("/estacionamento", {
                placa: placa,
                numero_vaga: numero,
                tempo: tempo,
                id_vaga_veiculo: id_vaga,
              }).then((response) => {
                if (response.data.msg.resultado === true) {
                  getVagas(salvaSetor);
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
                      requisicao.post(`/estacionamento/saida`, {
                          idvagaVeiculo: id_vaga,
                        }).then((response) => {
                          if (response.data.msg.resultado) {
                            Swal.fire({
                              text:"Vaga liberada", 
                              title:"", 
                              icon:"success",
                              timer: 1200,
                            });
                            setTimeout(() => {
                              getVagas(salvaSetor);
                            }, 1000);
                          } else {
                            Swal.fire(`${response.data.msg.msg}`, "", "error");
                          }
                        })
                        .catch(function (error) {
                          if (
                            error?.response?.data?.msg ===
                              "Cabeçalho inválido!" ||
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
        });
      } else {
        Swal.fire({
          title: "Deseja liberar esta vaga?",
          showDenyButton: true,
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Liberar",
          denyButtonText: `Notificar`,
          footer: `<button class="btn3 botao bg-green-50" id="btnFooter">
          Adicionar tempo
          </button>`,
        }).then((result) => {
          if (result.isConfirmed) {
            requisicao
              .post(`/estacionamento/saida`, {
                idvagaVeiculo: id_vaga,
              })
              .then((response) => {
                if (response.data.msg.resultado) {
                  Swal.fire({
                    text:"Vaga liberada", 
                    title:"", 
                    icon:"success",
                    timer: 1200,
                  });
                  setTimeout(() => {
                    getVagas(salvaSetor);
                  }, 1000);
                } else {
                  Swal.fire(`${response.data.msg.msg}`, "", "error");
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
          } else if (result.isDenied) {
            localStorage.setItem("id_vagaveiculo", id_vaga);
            localStorage.setItem("vaga", numero);
            localStorage.setItem("placa", placa);
            localStorage.setItem("idVagaVeiculo", id_vaga);
            FuncTrocaComp("Notificacao");
          }
        });

        const btnFooter = document.getElementById('btnFooter');
            btnFooter.addEventListener('click', function() {
            localStorage.setItem("vaga", numero);
            localStorage.setItem("id_vagaveiculo", id_vaga);
            localStorage.setItem("placa", placa);
            localStorage.setItem("popup", true);
            FuncTrocaComp("RegistrarVagaMonitor");
            Swal.close()
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
        }).then((result) => {
          if (result.isConfirmed) {
            requisicao
              .post(`/estacionamento/saida`, {
                idvagaVeiculo: id_vaga,
              })
              .then((response) => {
                if (response.data.msg.resultado) {
                  Swal.fire({
                    text:"Vaga liberada", 
                    title:"", 
                    icon:"success",
                    timer: 1200,
                  });
                  getVagas(salvaSetor);
                } else {
                  Swal.fire(`${response.data.msg.msg}`, "", "error");
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
          } else if (result.isDenied) {
            localStorage.setItem("vaga", numero);
            localStorage.setItem("id_vagaveiculo", id_vaga);
            localStorage.setItem("placa", placa);
            localStorage.setItem("popup", true);
            FuncTrocaComp("RegistrarVagaMonitor");
          }
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
              <Button variant="gradient" gradient={{ from: "indigo", to: "blue", deg: 60 }} className="w-75" mb="md" radius="md" size="md"
              onClick={() => FuncTrocaComp("RegistrarEstacionamentoParceiro")}>
              Registrar estacionamento ‎ <IconParking color="white" size={18} />
              </Button>
              <Button variant="gradient" gradient={{ from: "indigo", to: "blue", deg: 60 }} mb="md" radius="md" size="md"
              onClick={() => getVagas(salvaSetor)}>
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
                      getVagas(salvaSetor);
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
                  <div className="col-4 beetwen text-start"> <small><small>Livres: {vagasLivres}</small> </small></div>
                  <div className="col-4 beetwen"><small><small>Ocupadas: {vagasOcupadas}</small> </small></div>
                  <div className="col-4 beetwen text-end"> <small><small>Tempo : {vagasVencidas}</small> </small></div>
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
                      {resposta.map((vaga, index) => (
                        <tr
                          key={index}
                          className="card-list"
                          data-vaga={vaga.numero}
                          onClick={() => {
                            estaciona(
                              vaga.numero,
                              vaga.id_vaga_veiculo,
                              vaga.temporestante,
                              vaga.placa,
                              vaga.numero_notificacoes_pendentes,
                              vaga.numero_notificacoes_pendentess,
                              vaga.tipo,
                              vaga.debito
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
                            {vaga.placa}{" "}
                            <small id={vaga.display}>
                              {vaga.numero_notificaoes}
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
                              <Cronometro time={vaga.temporestante} />
                            </h6>
                          </td>
                        </tr>
                      ))}
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