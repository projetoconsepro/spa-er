import React, { useEffect } from "react";
import createAPI from "../services/createAPI";
import ImpressaoTicketEstacionamento from "../util/ImpressaoTicketEstacionamento";
import CalcularHoras from "../util/CalcularHoras";
import CalcularValidade from "../util/CalcularValidade";
import Swal from "sweetalert2";
import ValidarRequisicao from "../util/ValidarRequisicao";
import FuncTrocaComp from "../util/FuncTrocaComp";
import io from "socket.io-client";

const socket = io(
  `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`
);

export const VagaMonitor = ({
  vaga,
  index,
  setEstado,
  setMensagem,
  resposta,
  setResposta,
  funcAttResposta,
  setor,
}) => {
  const getHours = () => {
    const dataAtual = new Date();
    const hora = dataAtual.getHours().toString().padStart(2, "0");
    const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
    const segundos = dataAtual.getSeconds().toString().padStart(2, "0");
    const horaAtual = `${hora}:${minutos}:${segundos}`;
    return horaAtual;
  };

  function converterParaSegundos(tempo) {
    if (tempo === undefined) {
      return 0;
    }
    const [horas2, minutos2, segundos2] = tempo.split(":").map(Number);
    return horas2 * 3600 + minutos2 * 60 + segundos2;
  }

  const horaAgoraFunc = async () => {
    const dataAtual = new Date();
    const hora = dataAtual.getHours().toString().padStart(2, "0");
    const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
    const segundos = dataAtual.getSeconds().toString().padStart(2, "0");
    const horaAtual = `${hora}:${minutos}:${segundos}`;
    return horaAtual;
  };

  const funcUpdateVaga = async (vagaNew) => {
    if (vagaNew.estacionado === "N") {
      vaga = {
        numero: vaga.numero,
        estacionado: vagaNew.estacionado,
        chegada: "",
        placa: "",
        temporestante: "",
        Countdown: "",
        variaDisplay: "escondido",
        corvaga: vaga.corvaga,
        tipo: vaga.tipo,
      };
    } else {
      const validade = await CalcularValidade(vagaNew.chegada, vagaNew.tempo);

      vaga = {
        numero: vaga.numero,
        chegada: vagaNew.chegada,
        placa: vagaNew.placa,
        temporestante: validade,
        Countdown: "",
        variaDisplay: "aparece",
        corvaga: vaga.corvaga,
        tipo: vaga.tipo,
        numero_notificacoes_pendentess: vagaNew.numero_notificacoes_pendentess,
        estacionado: vagaNew.estacionado,
        id_vaga_veiculo: vagaNew.id_vaga_veiculo,
        debito: vagaNew.debitar_automatico,
      };

      if (vagaNew.numero_notificacoes_pendentess !== 0) {
        const horaOriginal = new Date(vagaNew.hora_notificacao);
        horaOriginal.setHours(horaOriginal.getHours() + 2);
        const horaOriginalFormatada = horaOriginal.toLocaleTimeString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        });
        vaga.hora_notificacao = horaOriginalFormatada;
      }

      if (vagaNew.numero_notificacoes_pendentes !== 0) {
        vaga.display = "testeNot";
        vaga.numero_notificacoes_pendentes =
          vagaNew.numero_notificacoes_pendentes;
        vaga.numero_notificacoes = vagaNew.numero_notificacoes_pendentes;
      } else {
        vaga.display = "testeNot2";
        vaga.numero_notificacoes_pendentes = 0;
        vaga.numero_notificacoes = 0;
      }
    }

    funcAttResposta(vaga, index);
  };

  const funcLiberVaga = async (id_vaga, numero, index) => {
    const requisicao = await createAPI();
    requisicao
      .post(`/estacionamento/saida`, {
        idvagaVeiculo: id_vaga,
        vaga: numero,
      })
      .then(async (response) => {
        if (response.data.msg.resultado) {
          const vagaNew = {
            numero: vaga.numero,
            estacionado: "N",
            chegada: "",
            placa: "",
            temporestante: "",
            Countdown: "",
            variaDisplay: "escondido",
            corvaga: vaga.corvaga,
            tipo: vaga.tipo,
          };
          funcAttResposta(vagaNew, index);
        } else {
          Swal.fire(`${response.data.msg.msg}`, "", "error");
        }
      })
      .catch(function (error) {
        ValidarRequisicao(error);
      });
  };

  useEffect(() => {
    socket.emit("setor", { setor: setor }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [setor]);

  useEffect(() => {
    // Evento de conexão
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // Evento de desconexão
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("vaga", (message) => {
      if (message.vaga.numero === vaga.numero && message.setor === setor) {
        funcUpdateVaga(message.vaga);
      }
    });
  }, []);

  const registroDebitoAutomatico = async (placa, numero, id_vaga, index) => {
    const requisicao = await createAPI();

    requisicao
      .post("/estacionamento", {
        placa: placa,
        numero_vaga: numero,
        id_vaga_veiculo: id_vaga,
      })
      .then((response) => {
        if (response.data.msg.resultado === true) {
          const updatedResposta = [...resposta];
          let validade = CalcularHoras(
            CalcularValidade(
              response.data.data.chegada,
              response.data.data.tempo
            )
          );
          updatedResposta[index] = {
            ...updatedResposta[index],
            temporestante: CalcularValidade(
              response.data.data.chegada,
              response.data.data.tempo
            ),
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
              funcLiberVaga(id_vaga, numero, index);
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
        ValidarRequisicao(error);
      });
  };

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

  const estaciona = async (vaga) => {
    localStorage.setItem("numero_vaga", vaga.numero);
    const horaAgoraNew = await horaAgoraFunc();
    if (vaga.temporestante < horaAgoraNew && vaga.placa !== "") {
      if (
        vaga.numero_notificacoes_pendentes !== 0 &&
        vaga.numero_notificacoes_pendentess !== 0
      ) {
        if (horaAgoraNew < vaga.hora_notificacao) {
          Swal.fire({
            title: "Deseja liberar esta vaga?",
            showCancelButton: true,
            showDenyButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Liberar",
            denyButtonText: "Regularizar",
            denyButtonColor: "#3A58C8",
            footer: `
                <button class="btn3 botao bg-blue-50" id="ticket">
                Extrato de placa
                </button>
                `,
          }).then((result) => {
            if (result.isConfirmed) {
              funcLiberVaga(vaga.id_vaga_veiculo, vaga.numero, index);
            } else if (result.isDenied) {
              localStorage.setItem("VagaVeiculoId", vaga.id_vaga_veiculo);
              FuncTrocaComp("ListarNotificacoes");
            }
          });

          const btnFooter2 = document.getElementById("ticket");
          btnFooter2.addEventListener("click", function () {
            funcExtratoPlaca(vaga.placa);
          });
        } else {
          Swal.fire({
            title: "Deseja liberar esta vaga?",
            showCancelButton: true,
            showDenyButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Liberar",
            denyButtonText: `Notificar`,
            footer: `
                <button class="btn3 botao bg-green-50 mx-2" id="btnFooter">
                  Adicionar tempo
                </button>
                <button class="btn3 botao bg-blue-50" id="ticket">
                  Extrato de placa
                </button>
                `,
          }).then((result) => {
            if (result.isConfirmed) {
              funcLiberVaga(vaga.id_vaga_veiculo, vaga.numero, index);
            } else if (result.isDenied) {
              localStorage.setItem("vaga", vaga.numero);
              localStorage.setItem("placa", vaga.placa);
              FuncTrocaComp("Notificacao");
            }
          });

          const btnFooter2 = document.getElementById("ticket");
          btnFooter2.addEventListener("click", function () {
            funcExtratoPlaca(vaga.placa);
          });

          const btnFooter = document.getElementById("btnFooter");
          btnFooter.addEventListener("click", function () {
            localStorage.setItem("vaga", vaga.numero);
            localStorage.setItem("id_vagaveiculo", vaga.id_vaga_veiculo);
            localStorage.setItem("placa", vaga.placa);
            localStorage.setItem("popup", true);
            FuncTrocaComp("RegistrarVagaMonitor");
            Swal.close();
          });
        }
      } else if (vaga.debito === "S") {
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
            funcLiberVaga(vaga.id_vaga_veiculo, vaga.numero, index);
          } else if (result.isDenied) {
            registroDebitoAutomatico(
              vaga.placa,
              vaga.numero,
              vaga.id_vaga_veiculo,
              index
            );
          }
        });

        const btnFooter2 = document.getElementById("ticket");
        btnFooter2.addEventListener("click", function () {
          funcExtratoPlaca(vaga.placa);
        });
      } else {
        Swal.fire({
          title: "Deseja liberar esta vaga?",
          showDenyButton: true,
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Liberar",
          denyButtonText: "Notificar",
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
            funcLiberVaga(vaga.id_vaga_veiculo, vaga.numero, index);
          } else if (result.isDenied) {
            localStorage.setItem("id_vagaveiculo", vaga.id_vaga_veiculo);
            localStorage.setItem("vaga", vaga.numero);
            localStorage.setItem("placa", vaga.placa);
            localStorage.setItem("idVagaVeiculo", vaga.id_vaga_veiculo);
            FuncTrocaComp("Notificacao");
          }
        });

        const btnFooter = document.getElementById("btnFooter");
        btnFooter.addEventListener("click", function () {
          localStorage.setItem("vaga", vaga.numero);
          localStorage.setItem("id_vagaveiculo", vaga.id_vaga_veiculo);
          localStorage.setItem("placa", vaga.placa);
          localStorage.setItem("popup", true);
          FuncTrocaComp("RegistrarVagaMonitor");
          Swal.close();
        });

        const btnFooter2 = document.getElementById("ticket");
        btnFooter2.addEventListener("click", function () {
          funcExtratoPlaca(vaga.placa);
        });
      }
    } else {
      if (vaga.placa === "") {
        localStorage.setItem("vaga", vaga.numero);
        localStorage.setItem("tipoVaga", vaga.tipo);
        localStorage.setItem("popup", false);
        FuncTrocaComp("RegistrarVagaMonitor");
        return;
      }
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
          funcLiberVaga(vaga.id_vaga_veiculo, vaga.numero, index);
        } else if (result.isDenied) {
          localStorage.setItem("vaga", vaga.numero);
          localStorage.setItem("id_vagaveiculo", vaga.id_vaga_veiculo);
          localStorage.setItem("placa", vaga.placa);
          localStorage.setItem("popup", true);
          FuncTrocaComp("RegistrarVagaMonitor");
        }
      });

      const btnFooter2 = document.getElementById("ticket");
      btnFooter2.addEventListener("click", function () {
        funcExtratoPlaca(vaga.placa);
      });
    }
  };

  // Função para determinar a cor de fundo
  const determineBackgroundColor = (vaga) => {
    const horaAtual = getHours();

    if (!vaga || vaga.placa === "") {
      return "#fff";
    }

    const segundosHoraAtual = converterParaSegundos(horaAtual);
    const segundosTempoRestante = converterParaSegundos(vaga.temporestante);

    const diffSegundos = segundosTempoRestante - segundosHoraAtual;
    const diffMinutos = diffSegundos / 60;

    if (
      vaga.numero_notificacoes_pendentess &&
      vaga.numero_notificacoes_pendentess !== 0
    ) {
      return "#D3D3D4";
    } else if (vaga.temporestante < horaAtual) {
      return "#F8D7DA";
    } else if (diffMinutos <= 10.1) {
      return "#FFF3CD";
    } else if (diffMinutos > 10) {
      return "#D1E7DD";
    } else {
      return "#fff";
    }
  };

  const determineTextColor = (vaga) => {
    const horaAtual = getHours();

    if (!vaga || vaga.placa === "") {
      return "#000";
    }

    const segundosHoraAtual = converterParaSegundos(horaAtual);
    const segundosTempoRestante = converterParaSegundos(vaga.temporestante);

    const diffSegundos = segundosTempoRestante - segundosHoraAtual;
    const diffMinutos = diffSegundos / 60;

    if (vaga.numero_notificacoes_pendentess !== 0) {
      return "#141619";
    } else if (vaga.temporestante < horaAtual) {
      return "#842029";
    } else if (diffMinutos <= 10.1) {
      return "#664D03";
    } else if (diffMinutos > 10) {
      return "#0F5132";
    } else {
      return "#000";
    }
  };

  return (
    <tr
      className="card-list"
      data-vaga={vaga.numero}
      onClick={() => {
        estaciona(vaga);
      }}
    >
      <th
        className="text-white"
        scope="row"
        style={{
          backgroundColor: vaga.corvaga,
          color: determineTextColor(vaga),
        }}
      >
        {vaga.numero}
      </th>
      <td
        className="fw-bolder"
        style={{
          backgroundColor: determineBackgroundColor(vaga),
          color: determineTextColor(vaga),
        }}
      >
        {vaga.placa === "0" ? null : vaga.placa}{" "}
        <small id={vaga.display}>{vaga.numero_notificacoes}</small>
      </td>
      <td
        className="fw-bolder"
        style={{
          backgroundColor: determineBackgroundColor(vaga),
          color: determineTextColor(vaga),
        }}
      >
        {vaga.chegada}
      </td>
      <td
        className="fw-bolder"
        style={{
          backgroundColor: determineBackgroundColor(vaga),
          color: determineTextColor(vaga),
        }}
      >
        <h6
          id={vaga.variaDisplay}
          className="fw-bolder"
          style={{
            backgroundColor: determineBackgroundColor(vaga),
            color: determineTextColor(vaga),
          }}
        >
          {vaga.temporestante}
        </h6>
      </td>
    </tr>
  );
};
