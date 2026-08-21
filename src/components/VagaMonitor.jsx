import React, { useEffect, useState } from "react";
import createAPI from "../services/createAPI";
import ImpressaoTicketEstacionamento from "../util/ImpressaoTicketEstacionamento";
import CalcularHoras from "../util/CalcularHoras";
import CalcularValidade from "../util/CalcularValidade";
import Swal from "sweetalert2";
import ValidarRequisicao from "../util/ValidarRequisicao";
import FuncTrocaComp from "../util/FuncTrocaComp";
import io from "socket.io-client";

const socket = io(
  `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`,
  {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 2000,
    timeout: 10000
  }
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
  getVagas,
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
    if (vagaNew.estacionado == "N") {
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
        regularizado: vagaNew.regularizado,
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

    const handleConnect = () => {
      socket.emit("setor", { setor: setor });
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [setor]);

  useEffect(() => {
    const handleVaga = (message) => {
      if (message.vaga.numero === vaga.numero && message.setor === setor) {
        funcUpdateVaga(message.vaga);
      }
    };

    socket.on("vaga", handleVaga);

    return () => {
      socket.off("vaga", handleVaga);
    };
  }, [setor, vaga.numero]);

  const registroDebitoAutomatico = async (placa, numero, id_vaga, index) => {
    const requisicao = await createAPI();

    requisicao
      .post("/estacionamento", {
        placa: placa,
        numero_vaga: numero,
        id_vaga_veiculo: id_vaga,
      })
      .then(async (response) => {
        if (response.data.msg.resultado === true) {
          if(response.data.msg.msg === 'Veículo já foi debitado nos últimos 30 minutos' || response.data.msg.msg === 'Veiculo ja possui tempo valido'){
            localStorage.removeItem('listaVagas');
            FuncTrocaComp( "ListarVagasMonitor");
            await getVagas(setor, 'reset');
            return;
          }
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

  const verificarDebitoAutomatico = async (placa) => {
    if (!placa) return false;
    const requisicao = createAPI();
    return requisicao
      .get(`/veiculo/debito/${placa}`)
      .then((response) => {
        if (response.data.msg.resultado) {
          return response.data.data;
        }
        return false;
      })
      .catch((error) => {
        ValidarRequisicao(error);
        return false;
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

  const buscarDadosVeiculo = async (placa) => {
    const requisicao = createAPI();
    try {
      const response = await requisicao.get(`/veiculo/${placa}`);
      if (
        response.data.msg.resultado === false &&
        response.data.msg.msg !== "Dados encontrados"
      ) {
        return null;
      }
      const item = response?.data?.data?.[0];
      if (!item) return null;
      return {
        placa: item.placa,
        modelo: item.modelo?.modelo,
        fabricante: item.modelo?.fabricante?.fabricante,
        cor: item.cor,
        vaga: item.estacionado[0].numerovaga,
        numero_notificacoes_pendentes: item.numero_notificacoes_pendentes,
        saldo_devedor: item.saldo_devedorr,
        debito: item.debitar_automatico === "S" ? "Ativo" : "Inativo",
        saldo: item.saldo,
        cpf: item.cpf,
        nome: item.nome,
        hora_notificacao: item.estacionado[0].hora_notificacao,
        hora_fim_notificacao: item.estacionado[0].hora_fim_notificacao,
        notificado: item.estacionado[0].notificado,
        regularizado: item.estacionado[0].regularizado,
        temporestante: CalcularValidade(
          item.estacionado[0].chegada,
          item.estacionado[0].tempo
        ),
      };
    } catch (error) {
      ValidarRequisicao(error);
      return null;
    }
  };

  const montarInfoVeiculoHtml = (info) => {
    if (!info) return "";
    const badgeStyle =
      "display:inline-block;max-width:100%;box-sizing:border-box;padding:2px 10px;border-radius:12px;font-size:0.72rem;font-weight:600;overflow-wrap:anywhere;word-break:break-word;white-space:normal;";

    const temNotificacao = info.numero_notificacoes_pendentes !== 0;
    const badgeNotificacao = temNotificacao
      ? `<span style="${badgeStyle}margin-left:-5px;margin-top:2px;background:#f8d7da;color:#842029;">${info.numero_notificacoes_pendentes} pendente${info.numero_notificacoes_pendentes > 1 ? "s" : ""}</span>`
      : `<span style="${badgeStyle}margin-left:-3px;margin-top:2px;background:#d1e7dd;color:#0f5132;"> Nenhuma </span>`;

    const badgeDebito = info.debito === "Ativo"
      ? `<span style="${badgeStyle}background:#d1e7dd;color:#0f5132;">Ativo</span>`
      : `<span style="${badgeStyle}background:#e9ecef;color:#495057;">Inativo</span>`;

    const campo = (label, valor) => `
      <div style="min-width:0;max-width:100%;">
        <div style="color:#868e96;font-size:0.7rem;overflow-wrap:anywhere;word-break:break-word;">${label}</div>
        <div style="font-weight:600;font-size:0.85rem;overflow-wrap:anywhere;word-break:break-word;white-space:normal;line-height:1.3;">${valor}</div>
      </div>`;

    const detalhesDebito = info.debito === "Ativo"
      ? `
        <div style="border-top:1px solid #eee;margin-top:10px;padding-top:10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px 12px;">
          ${campo("Debitando de", info.nome)}
          ${campo("Saldo", info.saldo)}
        </div>`
      : "";
       const detalhesNotificacao = info.notificado === "S"
      ? `
        <div style="border-top:1px solid #eee;margin-top:10px;padding-top:10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px 12px;">
            ${campo("Hora da notificação", info.hora_notificacao || "Sem informações")}
            ${campo("Hora do fim da notificação", info.hora_fim_notificacao || "Sem informações")}
            ${campo(
              "Regularizado",
              info.regularizado === "S"
                ? "Sim"
                : info.regularizado === "N"
                  ? "Não"
                  : "Sem informações"
            )}        
        </div>`
      : "";
    return `
      <style>
        @media (min-width:480px){
          .swal2-popup{padding:8px 20px 40px 20px !important;}
        }
       @media (max-width:480px){        
          .swal2-popup{padding:8px 4px 40px 4px !important;}
        }
        .swal2-html-container{margin:0 0 .15em !important;padding-left:0 !important;padding-right:0 !important;width:100% !important;box-sizing:border-box !important;}
        .vaga-info-actions{display:flex !important;flex-wrap:wrap !important;justify-content:center !important;gap:12px !important;width:100%;box-sizing:border-box;margin:.5em 0 0 !important;padding:0 16px !important;}
        .vaga-info-actions button{flex:1 1 100px;min-width:100px;margin:0 !important;padding:13px 6px !important;font-size:.78rem !important;border-radius:8px !important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .vaga-info-actions .swal2-cancel,
        .vaga-info-actions .swal2-confirm{flex:0 1 auto !important;min-width:0 !important;padding:12px 18px !important;font-size:.85rem !important;}
        @media (min-width:480px){
          .vaga-info-actions .swal2-cancel,
          .vaga-info-actions .swal2-confirm{min-width:120px !important;}
        }
        @media (min-width:351px) and (max-width:375px){
          .vaga-info-actions .swal2-cancel,
          .vaga-info-actions .swal2-confirm{padding:13px 13px !important;}
        }
        .swal2-footer{box-sizing:border-box;display:flex !important;flex-wrap:wrap !important;justify-content:center !important;gap:6px !important;padding:1em 16px 0 !important;}
        .swal2-footer button{flex:1 1 140px !important;min-width:140px;width:auto !important;margin:0 !important;padding:13px 10px !important;}
        @media (max-width:352px){
          .vaga-info-actions,
          .swal2-footer{flex-direction:column !important;}
          .vaga-info-actions button,
          .vaga-info-actions .swal2-cancel,
          .vaga-info-actions .swal2-confirm,
          .swal2-footer button{flex:1 1 auto !important;width:100% !important;min-width:0 !important;}
        }
      </style>
      <div style="box-sizing:border-box;width:100%;max-width:100%;text-align:left;margin-top:18px;padding:20px 20px 5px 16px;">
        <button type="button" id="btnToggleInfoVeiculo" style="box-sizing:border-box;width:100%;max-width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;background:#eef1fc;border:1px solid #c7d2fe;border-radius:8px;font-weight:600;font-size:.90rem;color:#3a58c8;cursor:pointer;margin-bottom:6px;overflow:hidden;">
          <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Detalhes do veículo · ${info.placa}</span>
          <span id="setaInfoVeiculo" style="flex-shrink:0;font-size:1.1rem;line-height:1;">▾</span>
        </button>
        <div id="detalhesInfoVeiculo" style="display:none;box-sizing:border-box;width:100%;max-width:100%;border:1px solid #dee2e6;border-radius:8px;padding:12px;font-size:.85rem;overflow-wrap:anywhere;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px 12px;">
            ${campo("Notificações", badgeNotificacao)}
            ${campo("Vaga", info.vaga)}
            ${campo("Tempo restante", info.temporestante)}
            ${campo("Modelo", info.modelo || "Sem informações")}
            ${campo("Fabricante", info.fabricante || "Sem informações")}
            ${campo("Cor", info.cor || "Sem informações")}
            ${campo("Saldo devedor", info.saldo_devedor)}
          </div>
          <div style="border-top:1px solid #eee;margin-top:10px;padding-top:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
            <span style="color:#868e96;font-size:.78rem;">Débito automático</span>
            ${badgeDebito}
          </div>
          ${detalhesDebito}     
          ${detalhesNotificacao}
        </div>
      </div>
    `;
  };

  const attachInfoVeiculoToggle = () => {
    const btn = document.getElementById("btnToggleInfoVeiculo");
    const detalhes = document.getElementById("detalhesInfoVeiculo");
    const seta = document.getElementById("setaInfoVeiculo");
    if (btn && detalhes) {
      btn.addEventListener("click", () => {
        const aberto = detalhes.style.display !== "none";
        detalhes.style.display = aberto ? "none" : "block";
        if (seta) seta.textContent = aberto ? "▾" : "▴";
      });
    }
  };

  const estaciona = async (vaga) => {
    localStorage.setItem("numero_vaga", vaga.numero);
    const horaAgoraNew = await horaAgoraFunc();

    if (vaga.placa === "") {
      localStorage.setItem("vaga", vaga.numero);
      localStorage.setItem("tipoVaga", vaga.tipo);
      localStorage.setItem("popup", false);
      FuncTrocaComp("RegistrarVagaMonitor");
      return;
    }

    const debitoAtivo = await verificarDebitoAutomatico(vaga.placa);
    const infoVeiculo = await buscarDadosVeiculo(vaga.placa);
    const infoVeiculoHtml = montarInfoVeiculoHtml(infoVeiculo);

    if (vaga.temporestante < horaAgoraNew) {
      if (
        vaga.numero_notificacoes_pendentes !== 0 &&
        vaga.numero_notificacoes_pendentess !== 0
      ) {
        if (horaAgoraNew < vaga.hora_notificacao) {
          Swal.fire({
            title: "Deseja liberar esta vaga?",
            html: infoVeiculoHtml,
            width: "min(94vw, 480px)",
            customClass: { actions: "vaga-info-actions" },
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
          attachInfoVeiculoToggle();

          const btnFooter2 = document.getElementById("ticket");
          btnFooter2.addEventListener("click", function () {
            funcExtratoPlaca(vaga.placa);
          });
        } else {
          Swal.fire({
            title: "Deseja liberar esta vaga?",
            html: infoVeiculoHtml,
            width: "min(94vw, 480px)",
            customClass: { actions: "vaga-info-actions" },
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
          attachInfoVeiculoToggle();

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
      } else if (vaga.debito === "S" || debitoAtivo) {
        Swal.fire({
          title: "Deseja liberar esta vaga?",
          html: infoVeiculoHtml,
          width: "min(94vw, 480px)",
          customClass: { actions: "vaga-info-actions" },
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
            Swal.fire({
              title: 'Processando...',
              html: '<div style="display: flex; justify-content: center;"><div class="loader"></div></div>',
              showConfirmButton: false,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
            registroDebitoAutomatico(
              vaga.placa,
              vaga.numero,
              vaga.id_vaga_veiculo,
              index
            ).then(() => {
                Swal.close();
              })  }
            });
          }
        });
        attachInfoVeiculoToggle();

        const btnFooter2 = document.getElementById("ticket");
        btnFooter2.addEventListener("click", function () {
          funcExtratoPlaca(vaga.placa);
        });
      } else {
        Swal.fire({
          title: "Deseja liberar esta vaga?",
          html: infoVeiculoHtml,
          width: "min(94vw, 480px)",
          customClass: { actions: "vaga-info-actions" },
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
        attachInfoVeiculoToggle();

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
      Swal.fire({
        title: "Deseja liberar esse veículo?",
        html: infoVeiculoHtml,
        width: "min(94vw, 480px)",
        customClass: { actions: "vaga-info-actions" },
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
      attachInfoVeiculoToggle();

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
if(vaga.regularizado === 'S'){
      return "#cfe0f8";
    }
    else if (
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
        {vaga.placa == "0" ? null : vaga.placa}{" "}
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
