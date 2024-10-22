import axios from "axios";
import { FaBell, FaCarAlt, FaParking } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { IoTrashSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import "../pages/Style/styles.css";
import Swal from "sweetalert2";
import FuncTrocaComp from "../util/FuncTrocaComp";
import VoltarComponente from "../util/VoltarComponente";
import {
  Button,
  Divider,
  Grid,
  Group,
  Modal,
  Notification,
  Text,
} from "@mantine/core";
import {
  IconChevronRight,
  IconPrinter,
  IconReload,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";
import createAPI from "../services/createAPI";
import EnviarNotificacao from "../util/EnviarNotificacao";
import LimparNotificacao from "../util/LimparNotificacao";
import { IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import jsPDF from "jspdf";
import moment from "moment";
import calcularValorCobranca from '../util/ValorCobranca';

const ListarVeiculos = () => {
  const [resposta] = useState([]);
  const [valorcobranca, setValorCobranca] = useState("");
  const [valorcobranca2, setValorCobranca2] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [mostrar2] = useState([]);
  const [mostrardiv] = useState([]);
  const [nofityvar] = useState([]);
  const [saldoCredito, setSaldoCredito] = useState("0.00");
  const [vaga] = useState([]);
  const [notificacao] = useState([]);  
  const [selectedButton, setSelectedButton] = useState("01:00:00");
  const [botaoOff, setBotaoOff] = useState(false);
  const [contador, setContador] = useState(0);
  const [horaAgora, setHoraAgora] = useState("");
  const [openedModal, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [data2, setData2] = useState([]);
  const [date, setDate] = useState("");
  const [emissao, setEmissao] = useState("");
  const [validade, setValidade] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [divError, setDivError] = useState(false);
  const [encerramento, setEncerramento] = useState("");
  const [ModalContent, setModalContent] = useState("ModalTermos");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = btoa(unescape(encodeURIComponent(localStorage.getItem("token"))));
  const id_usuario = btoa(user.id_usuario);
  const [tempoValidade, setTempoValidade] = useState();
  const [textoBotao, setTextoBotao] = useState("30");
  const [valorBotao, setValorBotao] = useState("00:30:00");
  const dataAtual = new Date();
  const horasAtuais = dataAtual.getHours();
  const minutosAtuais = dataAtual.getMinutes();
  const tempoLimite = "17:35:00";
  const condicaoHorario60 = (horasAtuais >= 17 && minutosAtuais >= 30 && horasAtuais <= 18);
  const condicaoHorario90 = (horasAtuais >= 17 && horasAtuais <= 18);
  const condicaoHorario120 = (horasAtuais == 16 && minutosAtuais >= 30) || (horasAtuais == 17 && horasAtuais <= 18);

  if (window.ReactNativeWebView) {
    const data = {
      type: "listarVeiculos",
      token: token,
      id_usuario: id_usuario,
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  }

  const handleButtonClick = (buttonIndex) => {
    setSelectedButton(buttonIndex);
    const tempo1 = buttonIndex;
    if (tempo1) {
      const valorcobranca = calcularValorCobranca(tempo1);
      setValorCobranca2(valorcobranca);
    }
  };

  async function ajustarHora() {
    let dataAtual = moment();

    if (dataAtual.day() === 6 && dataAtual.hour() >= 13) {
      return false;
    } else if (dataAtual.day() === 0) {
      return false;
    } else if (dataAtual.hour() >= encerramento) {
      return false;
    }

    return true;
  }

  const calcularValidade = (horaInicio, duracao) => {
    const [horas, minutos, segundos] = duracao.split(":").map(Number);
    const dataInicio = new Date(`2000-01-01T${horaInicio}`);
    const dataValidade = new Date(
      dataInicio.getTime() + horas * 3600000 + minutos * 60000 + segundos * 1000
    );
    const horaValidade = dataValidade.toLocaleTimeString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    return horaValidade;
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

  const calcularValidade2 = (horaInicio, duracao) => {
    const [horas, minutos, segundos] = duracao.split(":").map(Number);
    const dataInicio = new Date(`2000-01-01T${horaInicio}`);
    const dataValidade = new Date(
      dataInicio.getTime() + horas * 3600000 + minutos * 60000 + segundos * 1000
    );

    const dataAtual = new Date();
    dataAtual.setHours(dataValidade.getHours());
    dataAtual.setMinutes(dataValidade.getMinutes() - 10);
    dataAtual.setSeconds(dataValidade.getSeconds());
    const timestamp = dataAtual.getTime();

    return timestamp;
  };

  const FormatDate = (date) => {
    const data = new Date(date);
    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, "0");
    const day = String(data.getDate()).padStart(2, "0");
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  };

  const atualizacomp = async () => {
    setDivError(false);
    const requisicao = createAPI();
    atualizaHora();
    await requisicao
      .get("/veiculo")
      .then((response) => {
        LimparNotificacao();
        if (response.data.msg.resultado === false) {
          FuncTrocaComp("CadastrarVeiculo");
        }
        for (let i = 0; i < resposta.length; i++) {
          delete resposta[i];
        }
        for (let i = 0; i < response?.data?.data.length; i++) {
          resposta[i] = {};
          resposta[i].div = `card-body10 mb-2`;
          notificacao[i] = { estado: true };
          mostrar2[i] = { estado: false };
          mostrardiv[i] = { estado: true };
          nofityvar[i] = { notifi: "notify" };
          resposta[i].placa = response.data.data[i].usuario;
          resposta[i].id_veiculo = response.data.data[i].id_veiculo;
          if (response.data.data[i].estacionado === "N") {
            resposta[i].div = "card-body10 mb-2";
            resposta[i].textoestacionado = "Clique aqui para estacionar";
            resposta[i].estacionado = "Não estacionado";
            resposta[i].temporestante = "";
            notificacao[i] = { estado: true };
            if (response.data.data[i].numero_notificacoes_pendentes === 0) {
              resposta[i].div = "card-body10 mb-2";
              resposta[i].numero_notificacoes_pendentes = "Sem notificações";
              notificacao[i] = { estado: true };
            } else {
              resposta[i].div = "card-body9 mb-2";
              resposta[i].numero_notificacoes_pendentes = `${
                response.data.data[i].numero_notificacoes_pendentes
              } ${
                response.data.data[i].numero_notificacoes_pendentes === 1
                  ? "notificação"
                  : "notificações"
              }`;
              nofityvar[i] = { notifi: "notify2" };
              notificacao[i] = { estado: false };
            }
          } else {
            EnviarNotificacao(
              calcularValidade2(
                response.data.data[i].chegada,
                response.data.data[i].tempo
              ),
              response.data.data[i].id_vaga_veiculo,
              response.data.data[i].usuario
            );
            resposta[i].div = "card-body9 mb-2";
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
            resposta[i].temporestante = calcularValidade(
              response.data.data[i].chegada,
              response.data.data[i].tempo
            );
            const diffDate = FormatDate(response.data.data[i].date);
            resposta[i].data = `${diffDate} - ${resposta[i].temporestante}`;
            if (response.data.data[i].numero_notificacoes_pendentess > 0) {
              resposta[i].textoestacionado = "Clique aqui para regularizar";
            }
            if (response.data.data[i].numero_notificacoes_pendentes === 0) {
              resposta[i].numero_notificacoes_pendentes = "Sem notificações";
              notificacao[i] = { estado: true };
            } else {
              resposta[i].numero_notificacoes_pendentes = `${
                response.data.data[i].numero_notificacoes_pendentes
              } ${
                response.data.data[i].numero_notificacoes_pendentes === 1
                  ? "notificação"
                  : "notificações"
              }`;
              nofityvar[i] = { notifi: "notify2" };
              notificacao[i] = { estado: false };
            }
          }
        }
        setBotaoOff(false);
      })
      .catch(function (error) {
        setDivError(true);
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
        setEncerramento(response.data.data.param.turno.horaEncerramento);
        setValorCobranca(response.data.data.param.estacionamento.valorHora);
        setValorCobranca2(response.data.data.param.estacionamento.valorHora);
        setSelectedButton("01:00:00");
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

  const atualizaHora = () => {
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, "0");
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
    const ano = dataAtual.getFullYear();
    const hora = dataAtual.getHours().toString().padStart(2, "0");
    const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
    const segundos = dataAtual.getSeconds().toString().padStart(2, "0");

    const dataHoraAtual = `${dia}/${mes}/${ano} - ${hora}:${minutos}:${segundos}`;
    setHoraAgora(dataHoraAtual);
  };

  useEffect(() => {
    if (contador >= 90 || contador === 0) {
      setContador(1);
      atualizacomp();
    }
    setTimeout(() => {
      setContador(contador + 1);
    }, 1000);
  }, [contador]);

  useEffect(() => {
    if (localStorage.getItem("NewTerm") !== "true") {
      setModalContent("");
      setTimeout(() => {
        openModal();
        localStorage.setItem("NewTerm", "true");
      }, 1000);
    }
  }, []);

  function mexerValores() {
    const tempo1 = selectedButton;

    if (tempo1) {
      const valorcobranca = calcularValorCobranca(tempo1);
      return valorcobranca;
    }
  }


  function handleClick(index) {
    let validades;
    if(resposta[index].chegada){
    validades = calcularValidade(resposta[index].chegada, resposta[index].tempo);
    setTempoValidade(validades);}
    setMostrar(!mostrar);
    mostrar2[index].estado = !mostrar2[index].estado;
  }

  const hangleplaca = async (placa, index) => {
    setBotaoOff(true);

    const verifica = await ajustarHora();

    if (!verifica) {
      setBotaoOff(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "O estacionamento rotativo está fechado!",
        footer: '<a href="">Por favor, tente novamente.</a>',
      });
      return;
    }
    const requisicao = createAPI();
    const tempo1 = selectedButton;

    const resposta = await mexerValores();

    if (vaga.length === 0) {
      vaga[0] = 0;
    }

    let numeroCorrigido = saldoCredito.replace(".", "");
    numeroCorrigido = parseFloat(numeroCorrigido.replace(",", "."));
    if (parseFloat(numeroCorrigido) < parseFloat(resposta)) {
      setBotaoOff(false);
      Swal.fire({
        icon: "error",
        title: "Saldo insuficiente",
        footer:
          '<a id="linkAdicionarCredito">Clique aqui para adicionar crédito.</a>',
      });

      document
        .getElementById("linkAdicionarCredito")
        .addEventListener("click", function (event) {
          event.preventDefault();
          FuncTrocaComp("InserirCreditos");
          Swal.close();
        });
    } else {
      requisicao
        .post("/estacionamento", {
          placa: placa,
          numero_vaga: vaga,
          tempo: tempo1,
          pagamento: "credito",
        })
        .then(async (response) => {
          if (response.data.msg.resultado === true) {
            setModalContent("Comprovante");
            setData2(response.data.data);
            setDate(FormatDate(response.data.data.data));
            setEmissao(response.data.data.chegada);
            const validade = await calcularValidade(
              response.data.data.chegada,
              response.data.data.tempo
            );
            setValidade(validade);
            openModal();
            atualizacomp();
          } else {
            setBotaoOff(false);
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
    const requisicao = createAPI();
    const vagaa = [];

    const verifica = await ajustarHora();

    if (!verifica) {
      setBotaoOff(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "O estacionamento rotativo está fechado!",
        footer: '<a href="">Por favor, tente novamente.</a>',
      });
      return;
    }

    vagaa[0] = vaga;

    const tempo1 = selectedButton;

    const resposta = await mexerValores();

    let numeroCorrigido = saldoCredito.replace(".", "");
    numeroCorrigido = parseFloat(numeroCorrigido.replace(",", "."));
    if (parseFloat(numeroCorrigido) < parseFloat(resposta)) {
      setBotaoOff(false);
      Swal.fire({
        icon: "error",
        title: "Saldo insuficiente",
        footer:
          '<a id="linkAdicionarCredito">Clique aqui para adicionar crédito.</a>',
      });

      document
        .getElementById("linkAdicionarCredito")
        .addEventListener("click", function (event) {
          event.preventDefault();
          FuncTrocaComp("InserirCreditos");
          Swal.close();
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
        .then(async (response) => {
          if (response.data.msg.resultado === true) {
            setModalContent("Comprovante");
            setData2(response.data.data);
            setDate(FormatDate(response.data.data.data));
            setEmissao(response.data.data.chegada);
            const validade = await calcularValidade(
              response.data.data.chegada,
              response.data.data.tempo
            );
            setValidade(validade);
            openModal();
            atualizacomp();
          } else {
            setBotaoOff(false);
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

  window.addEventListener("message", (message) => {
    closeModal();
    setPdfLoading(false);
  });

  async function gerarJSON(data2) {
    setPdfLoading(true);
    const data = {
      tipo: "Estacionamento avulso",
      inicio: `${date} - ${emissao}`,
      validade: `${date} - ${await calcularValidade(
        data2.chegada,
        data2.tempo
      )}`,
      placa: data2.placa,
      tempo: data2.tempoCredito,
      valor: `R$ ${data2.valor}`,
      cnpj: "89.668.040/0001-10",
      endereco: "Rua Julio de Castilhos, 2500",
      cidade: "Taquara - RS",
      telefone: "(51) 9 8660-4241",
    };

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    } else {
      const pdfWidth = 80;
      const pdfHeight = 100;
      const pdf = new jsPDF({
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      const tamanhoFonte = 12;

      const x = 18;
      const y = 15;

      pdf.setFontSize(tamanhoFonte);
      pdf.text("CONSEPRO TAQUARA", x, y);
      pdf.text("- - - - - - - - - - - - - - - - - - - - - - - -", 10, y + 5);
      pdf.setFontSize(tamanhoFonte - 2);
      pdf.text("Tipo: Estacionamento avulso", x, y + 12);
      pdf.text(`Início: ${date} - ${emissao}`, x, y + 17);
      pdf.text(
        `Validade: ${date} - ${await calcularValidade(
          data2.chegada,
          data2.tempo
        )}`,
        x,
        y + 22
      );
      pdf.text("Placa: " + data2.placa, x, y + 27);
      pdf.text("Tempo: " + data2.tempoCredito, x, y + 32);
      pdf.text("Valor: R$ " + data2.valor, x, y + 37);
      pdf.setFontSize(tamanhoFonte);
      pdf.text("- - - - - - - - - - - - - - - - - - - - - - - -", 10, y + 44);
      pdf.setFontSize(tamanhoFonte - 2);
      pdf.text("CNPJ: 89.668.040/0001-10", x, y + 49);
      pdf.text("Rua Julio de Castilhos, 2500", x, y + 54);
      pdf.text("Taquara - RS", x, y + 59);
      pdf.text("(51) 9 8660-4241", x, y + 64);

      pdf.save("Comprovante_Ticket.pdf");
      setPdfLoading(false);
    }
  }

  const calcularMinutos = (hora) => {
    const horaLimite = new Date();
    horaLimite.setHours(18, 0, 0, 0);
    const diferencaMinutos = horaLimite - hora;
    return Math.max(Math.floor(diferencaMinutos / 60000) + 1, 0);
  };

  const atualizarBotao = (hora) => {
    const minutosAte = calcularMinutos(hora);
    setTextoBotao(minutosAte.toString().padStart(2, '0'));
    setValorBotao(`00:${minutosAte.toString().padStart(2, '0')}:00`);
  };

  const verificarTempo = () => {
    const agora = new Date();
    const tempoAtual = agora.getHours() * 60 + agora.getMinutes();
    const tempoLimite = 17 * 60 + 30;
    const tempoFim = 18 * 60; 

    if (tempoValidade) {
      const [horas, minutos, segundos] = tempoValidade.split(':').map(Number);
      const dataValidade = new Date();
      dataValidade.setHours(horas, minutos, segundos, 0);
      const tempoValidadeMinutos = dataValidade.getHours() * 60 + dataValidade.getMinutes();

      if (tempoValidadeMinutos > tempoLimite) {
        atualizarBotao(dataValidade);
        return;
      }
    }

    if (tempoAtual > tempoLimite && tempoAtual < tempoFim) {
      atualizarBotao(agora);
    } else {
      setTextoBotao("30");
      setValorBotao("00:30:00");
    }
  };

  useEffect(() => {
    verificarTempo();
    const intervalo = setInterval(verificarTempo, 60000); 
    return () => clearInterval(intervalo);
  }, [tempoValidade]);

  return (
    <>
      <Modal
        opened={openedModal}
        onClose={() => {
          closeModal();
        }}
        centered
        size="xl"
        title= {ModalContent === "Comprovante" ?"Comprovante de estacionamento:" : "Aviso!"}
      >
       {ModalContent === "Comprovante" ? (
        <>
        <div
          className="rounded border border-gray p-3 text-center"
          id="conteudoParaPDF"
        >
          <div className="mb-4">CONSEPRO TAQUARA</div>
          <Divider my="sm" size="md" variant="dashed" />
          <div>
            <h6>Tipo: Estacionamento avulso</h6>
          </div>
          <div>
            <h6>
              Início: {date} - {emissao}{" "}
            </h6>
          </div>
          <div>
            <h6>
              Validade: {date} - {validade}{" "}
            </h6>
          </div>
          <div>
            <h6>Placa: {data2.placa}</h6>
          </div>
          <div>
            <h6>Tempo: {data2.tempoCredito}</h6>
          </div>
          <div>
            <h6>Valor: R$ {data2.valor}</h6>
          </div>
          <Divider my="sm" size="md" variant="dashed" />
          CNPJ: 89.668.040/0001-10
          <br />
          Rua Julio de Castilhos, 2500
          <br />
          Taquara - RS
          <br />
          (51) 9 8660-4241
          <br />
        </div>

        <div className="mt-4">
          <Button
            variant="gradient"
            gradient={{ from: "teal", to: "indigo", deg: 300 }}
            size="md"
            radius="md"
            fullWidth
            rightIcon={<IconPrinter size={23} />}
            loaderPosition="right"
            loading={pdfLoading}
            onClick={() => {
              gerarJSON(data2);
            }}
          >
            Salvar
          </Button>
        </div>
        </>
       ) :  (
        <div className="rounded border border-gray p-3 modal-body" id="modalTexto">
          <div className='text-center m-3'>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
              <path fill="none" stroke="#424242" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 13V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13c0 1-.6 3-3 3m0 0H6c-1 0-3-.6-3-3v-2h12v2c0 2.4 2 3 3 3M9 7h8m-8 4h4"/>
            </svg>
          </div>
          <small >
          Gostaríamos de informar que o CONSEPRO - Conselho Comunitário Pró-Segurança Pública de Taquara, a partir de agora, 
          estará reduzindo o uso de papel no estacionamento rotativo. 
          Para os usuários com débito automático ativo, não será mais impresso o comprovante de estacionamento.
          Atualizando assim os termos de uso do Débito Automático!  <br />  <br /> 
          </small>
          <small>
            Agradecemos a compreensão e colaboração de todos. 
          </small>
         <div className="row">
          <div className="col-12 text-center mt-3">
            <Button onClick={() => closeModal()} variant="gradient" gradient={{ from: "teal", to: "indigo", deg: 300 }} size="md" radius="md" fullWidth>
              <Text>
                Ok!
              </Text>
            </Button>
          </div>
         </div>
          </div>
       )
       }
      </Modal>
      <div className="col-12 px-3 mb-7">
        <div className="row">
          <div className="col-9">
            <p className="text-start fs-3 fw-bold">
              <VoltarComponente arrow={true} /> Meus veículos
            </p>
          </div>
          <div className="col-3" onClick={() => atualizacomp()}>
            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "blue", deg: 60 }}
              radius="md"
              size="sm"
            >
              <IconReload color="white" size={20} />
            </Button>
          </div>
        </div>
        <div className="card border-0 shadow">
          <div className="card-body10">
            <div className="d-flex align-items-center justify-content-between pb-3">
              <div>
                <div className="h6 mb-0 d-flex align-items-center">
                  Seu saldo é de:
                </div>
                <div className="h1 mt-2 d-flex align-items-center">
                  R$ {saldoCredito}
                </div>
                <Button
                  variant="gradient"
                  gradient={{ from: "green", to: "teal" }}
                  radius="xl"
                  className="mt-3"
                  fullWidth
                  onClick={() => {
                    FuncTrocaComp("InserirCreditos");
                  }}
                >
                  <IconSquareRoundedPlusFilled className="mx-1" />
                  Adicionar saldo
                </Button>
              </div>
              <div>
                <div className="d-flex align-items-center fw-bold">
                  <IconChevronRight
                    size={30}
                    className="mx-1 mb-5"
                    onClick={() => FuncTrocaComp("HistoricoFinanceiro")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {divError ? (
          <Notification color="red" title="Aviso!" mt={12}>
            Não foi possível carregar seus veículos! <br /> Por favor, tente
            novamente.
          </Notification>
        ) : null}

        {resposta.map((link, index) => (
          <div className="card border-0 shadow mt-5" key={index}>
            <div id="" className={link.div}>
              <div className="row d-flex align-items-center justify-content-between pb-3">
                <div className="col-9">
                  <div className="h2 mb-0 d-flex align-items-center">
                    {link.placa}
                  </div>
                  {mostrardiv[index].estado ? null : (
                    <div
                      className="h6 d-flex align-items-center mt-2 fs-6"
                      id="estacionadocarro"
                    >
                      <h6
                        className={link.data < horaAgora ? "text-danger" : ""}
                      >
                        <RxLapTimer />‎ Validade:{" "}
                        <span>{link.temporestante}</span>{" "}
                      </h6>
                    </div>
                  )}

                  <div
                    className="h6 d-flex align-items-center mt-1 fs-6"
                    id="estacionadocarro"
                  >
                    <h6>
                      <FaParking />‎ {link.estacionado}
                    </h6>
                  </div>
                  {notificacao[index].estado ? null : (
                    <div
                      className="h6 d-flex align-items-center fs-6"
                      id="estacionadocarro"
                    >
                      <h6 className="text-danger">
                        <AiOutlineInfoCircle />‎{" "}
                        {link.numero_notificacoes_pendentes}
                      </h6>
                    </div>
                  )}
                </div>
                <div className="col-3">
                  <div className="d-flex align-items-center fw-bold">
                    {link.estacionado !== "Não estacionado" ? (
                      <div>
                        <img
                          src="../../assets/img/estacionamento.png"
                          alt="Rich Logo"
                          className={
                            window.innerWidth > 1500
                              ? "w-25"
                              : window.innerWidth > 760
                              ? "w-50"
                              : ""
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="h6 mt-1 d-flex align-items-center fs-6 text-start">
                  <Button
                    variant="outline"
                    radius="md"
                    fullWidth
                    onClick={() => {
                      handleClick(index);
                    }}
                  >
                    {mostrar2[index].estado ? (
                      <IconX size={20} className="mx-1" />
                    ) : (
                      <FaCarAlt size={20} className="mx-1" />
                    )}
                    {mostrar2[index].estado ? "Fechar" : link.textoestacionado}
                  </Button>
                  {mostrar2[index].estado ? null : (
                    <div className="mt-1">
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
                  )}
                </div>
              </div>
            </div>
            {mostrar2[index].estado ? (
              <div className="mb-1">
                {link.notificacoesVaga > 0 ? (
                  <div className="card border-0">
                    <div className="card-body9">
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
                  selectedButton === valorBotao ? "corTempoSelecionado" : "corTempo"
                }`}
                onClick={() => handleButtonClick(valorBotao)}
              >
                <Text fz="lg" weight={700}>{textoBotao}</Text>
              </button>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        {condicaoHorario60 ? null : (
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
                        )}
                      </Grid.Col>
                      <Grid.Col span={3}>
                      {condicaoHorario90 ? null : (
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
                        )}
                      </Grid.Col>
                      <Grid.Col span={3}>
                      {condicaoHorario120 ? null : (
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
                        )}
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
                          variant="gradient"
                          gradient={{ from: "blue", to: "indigo" }}
                          fullWidth
                          onClick={() => {
                            hangleplaca(link.placa, index);
                          }}
                          loading={botaoOff}
                        >
                          Ativar
                        </Button>
                        <div className="mt-1">
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
                  selectedButton === valorBotao ? "corTempoSelecionado" : "corTempo"
                }`}
                onClick={() => handleButtonClick(valorBotao)}
              >
                <Text fz="lg" weight={700}>{textoBotao}</Text>
              </button>
                      </Grid.Col>
                      <Grid.Col span={3}>
                      {condicaoHorario60 || link.temporestante > tempoLimite ? null : (
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
                            )}
                      </Grid.Col>
                      <Grid.Col span={3}>
                      {condicaoHorario90 || link.temporestante > tempoLimite ? null : (
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
                            )}
                      </Grid.Col>
                      <Grid.Col span={3}>
                      {condicaoHorario120 || link.temporestante > tempoLimite ? null : (
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
                            )}
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
                        <Button
                          type="submit"
                          onClick={() => {
                            AddTempo(
                              link.placa,
                              index,
                              link.id_vaga_veiculo,
                              link.vaga
                            );
                          }}
                          fullWidth
                          variant="gradient"
                          gradient={{ from: "blue", to: "indigo" }}
                          loading={botaoOff}
                        >
                          Ativar
                        </Button>
                        <div className="mt-1 text-end">
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
        <div className="row mx-0" id="footerButton">
          <div className="row">
            <div className="col-12">
              <Button
                variant="gradient"
                gradient={{ from: "blue", to: "indigo" }}
                radius="md"
                fullWidth
                onClick={() => {
                  FuncTrocaComp("CadastrarVeiculo");
                }}
              >
                <FaCarAlt size={20} className="mx-1" /> Cadastrar novo veículo
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="col-7">
              <Button
                variant="gradient"
                gradient={{ from: "cyan", to: "teal" }}
                radius="md"
                className="mt-2"
                fullWidth
                onClick={() => {
                  FuncTrocaComp("Configuracoes");
                }}
              >
                Débito automático
              </Button>
            </div>
            <div className="col-5">
              <Button
                variant="gradient"
                gradient={{ from: "red", to: "orange" }}
                radius="md"
                fullWidth
                className="mt-2"
                onClick={() => {
                  FuncTrocaComp("Irregularidades");
                }}
              >
                Notificação
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListarVeiculos;
