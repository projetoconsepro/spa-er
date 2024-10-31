import axios from "axios";
import { FaBell, FaCarAlt, FaParking, FaRegTrashAlt } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import "../pages/Style/styles.css";
import Swal from "sweetalert2";
import FuncTrocaComp from "../util/FuncTrocaComp";
import VoltarComponente from "../util/VoltarComponente";
import { IoMdAdd } from "react-icons/io";
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
import {FormatDateBr} from "../util/formatDate";
import { IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import jsPDF from "jspdf";
import moment from "moment";
import calcularValidade from "../util/CalcularValidade";

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
  const dataAtual = new Date();
  const horasAtuais = dataAtual.getHours();
  const minutosAtuais = dataAtual.getMinutes();
  const tempoLimite = "17:35:00";
  const condicaoHorario60 = (horasAtuais >= 17 && minutosAtuais >= 30 && horasAtuais <= 18);
  const condicaoHorario90 = (horasAtuais >= 17 && horasAtuais <= 18);
  const condicaoHorario120 = (horasAtuais == 16 && minutosAtuais >= 30) || (horasAtuais == 17 && horasAtuais <= 18);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = btoa(unescape(encodeURIComponent(localStorage.getItem("token"))));
  const id_usuario = btoa(user.id_usuario);
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
          resposta[i].div = `card-body20 mb-2`;
          notificacao[i] = { estado: true };
          mostrar2[i] = { estado: false };
          mostrardiv[i] = { estado: true };
          nofityvar[i] = { notifi: "notify" };
          resposta[i].placa = response.data.data[i].usuario;
          resposta[i].id_veiculo = response.data.data[i].id_veiculo;
          if (response.data.data[i].estacionado === "N") {
            resposta[i].div = "card-body20 mb-2";
            resposta[i].textoestacionado = "Adicionar tempo";
            resposta[i].estacionado = "Não estacionado";
            resposta[i].temporestante = "";
            notificacao[i] = { estado: true };
            if (response.data.data[i].numero_notificacoes_pendentes === 0) {
              resposta[i].div = "card-body20 mb-2";
              resposta[i].numero_notificacoes_pendentes = "Sem notificações";
              notificacao[i] = { estado: true };
            } else {
              resposta[i].div = "card-body19 mb-2";
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
            resposta[i].div = "card-body19 mb-2";
            resposta[i].textoestacionado = "Adicionar tempo";
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
            const diffDate = FormatDateBr(response.data.data[i].date);
            resposta[i].data = `${diffDate} - ${resposta[i].temporestante}`;
            if (response.data.data[i].numero_notificacoes_pendentess > 0) {
              resposta[i].textoestacionado = "Regularizar";
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
            setDate(FormatDateBr(response.data.data.data));
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
            setDate(FormatDateBr(response.data.data.data));
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
        <div className="border-0 mt-3">
          <div className="card-body11 shadow ">
            <div className="d-flex align-items-center justify-content-between ">
              <div>
                <div className="h6 mb-0 d-flex align-items-center text-black text-opacity-75">
                  Seu saldo é de:
                </div>
                <div className="h1 mt-2 d-flex align-items-cente pb-5" style={{ color: "#15A3B3", fontSize: "32px", fontWeight: 700 }}>
                  R$ {saldoCredito}
                </div>
              
              </div>
              <div>
                <div className="d-flex align-items-center fw-bold">
                    <button className="mx-1 mb-5" style={{ width: '43px', height: '41px', borderRadius: '100px', background: 'linear-gradient(61deg, #4076F1 13.44%, #0CA57B 82.1%)', border: 'none' }}
                     onClick={() => {
                      FuncTrocaComp("InserirCreditos");
                    }}>
                    <IoMdAdd color="white" size="30px" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row text-center d-flex flex-column justify-content-center align-items-center">
           <div className="row g-2">
           <div className="col-6 col-lg-4" style={{ paddingLeft: '10px' }}>
        <button className="btn w-100 text-white" style={{ borderRadius: '5px', background: '#3381D4'}}
          onClick={() => {
            FuncTrocaComp("Configuracoes");
          }}>
      Débito automático
    </button>
        </div>
        
        <div className="col-6 col-lg-4" style={{ paddingRight: '10px' }}>
        <button className="btn w-100 text-white" style={{ borderRadius: '5px', background: '#1099A8'}}
           onClick={() => {
            FuncTrocaComp("Irregularidades");
          }}>
    Notificação
  </button>        </div>
       
        <div className="col-12 col-lg-4 px-2">
        <button className="btn w-100 text-white" style={{ borderRadius: '5px', background: 'linear-gradient(90deg, #4076F1 0%, #0CA57B 100%)' }}
         onClick={() => {
          FuncTrocaComp("CadastrarVeiculo");
        }}>
        <FaCarAlt size={20} className="mx-1" /> Cadastrar novo veículo
          </button>
        </div></div>
      </div>
    </div>
        


        {divError ? (
          <Notification color="red" title="Aviso!" mt={12}>
            Não foi possível carregar seus veículos! <br /> Por favor, tente
            novamente.
          </Notification>
        ) : null}

        {resposta.map((link, index) => (
          <div className="card border-0 shadow mt-4" key={index}>
            <div id="" className={link.div}>
              <div className="row d-flex align-items-center justify-content-between pb-3">
                <div className="col-9">
                <div className="h2 mb-2 ms-1 d-flex align-items-center" style={{ color: '#3381D4', fontFamily: 'Inter', fontSize: '24px', fontStyle: 'normal', fontWeight: 700, lineHeight: 'normal' }}>

                    {link.placa}
                  </div>
                  {mostrardiv[index].estado ? null : (
                    <div
                      className="h6 d-flex align-items-center ms-1 fs-6"
                      id="estacionadocarro"
                      style={{ opacity: 0.8 }}
                    >
                      <h6
                        className={link.data < horaAgora ? "text-danger" : ""}
                      >
                        Válido até:{" "}
                        <span>{link.temporestante}</span>{" "}
                      </h6>
                    </div>
                  )}

                  <div
                    className={`h6 d-flex align-items-center ms-1 fs-6 ${link.estacionado === 'Não estacionado' ? 'mt-2' : ''}`}
                    id="estacionadocarro"
                    style={{ opacity: 0.8 }}
                  >
                    <h6>
                    {link.estacionado !== 'Não estacionado' ? `Estacionado: Vaga ${link.estacionado.match(/\d+/)}` : link.estacionado}
                    </h6>
                  </div>
                  
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
                </div>{notificacao[index].estado ? null : (
                    <div
                      className="h6 d-flex align-items-center fs-6 ms-1"
                      id="estacionadocarro"
                    >
                      <h6 className="text-danger">
                        <AiOutlineInfoCircle />‎{" "}
                        {link.numero_notificacoes_pendentes}
                      </h6>
                    </div>
                  )}
                <div className={`h6 d-flex align-items-center fs-6 text-start ms-1 ${notificacao[index].estado ? 'mt-4' : 'mt-2'}`}>                  <Button
                    style={{ borderRadius: '5px', border: '2px solid #1099A8', backgroundColor: '#ffff', color: '#15A3B3', fontSize: '18px', fontWeight: 600, height: '40px' }}
                    fullWidth
                    onClick={() => {
                      handleClick(index);
                    }}
                  >
                  
                    {mostrar2[index].estado ? "Fechar" : link.textoestacionado}
                  </Button>
                  {mostrar2[index].estado ? null : (
                    <div className="ms-2 me-2">
                   <Button
                    style={{ borderRadius: '5px', border: '2px solid #1099A8', backgroundColor: '#ffff', color: '#15A3B3', fontSize: '15px', fontWeight: 600, height: '40px' }}
                    fullWidth
                    onClick={() => {
                      removerVeiculo(link.id_veiculo);
                    }}
                  >
                   <FaRegTrashAlt
                          color="#1099A8"
                          size={22}/>
                    
                  </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {mostrar2[index].estado ? (
              <div className="mb-1">
                {link.notificacoesVaga > 0 ? (
                  <div className="card-body20 border-0">
                    <div className="card-body20">
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
                        style={{ borderRadius: '5px', background: 'linear-gradient(90deg, #4076F1 0%, #0CA57B 100%)'}}
                        onClick={() => {
                          regularizarNot(link.placa);
                        }}
                      >
                        Regularizar
                      </button>
                      <div className="mt-4 text-end">
                        <span>
                         
                        </span>
                      </div>
                    </div>
                  </div>
                ) : mostrardiv[index].estado ? (
                  <div className="h6 mt-2 mx-4">
                    <Group position="apart">
                      <p className="text-start mb-3 ms-1" style={{color: '#3381D4', fontSize: '17px', fontWeight: '600'}}>
                        Determine o tempo (minutos)
                      </p>
                    </Group>
                    <Grid>
                      <Grid.Col span={3}>
                      <button
                          type="button"
                          className={`btn icon-shape icon-shape rounded align-center ms-1 ${
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
                    <div className="mt-3 mx-2">
                    <p id="tempoCusto" className="text-end mb-2">
                      Esse tempo irá custar: R$ {valorcobranca2}
                      </p>
                      <div className="mb-3 mt-4 gap-0 d-flex justify-content-between">
                        <div></div>
                        <Button
                          type="submit"
                          variant="gradient"
                          style={{backgroundColor: '#3381D4', fontSize: '18px', fontWeight: '600', padding: '12px 0 12px 0',  height: 'auto'}}
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
                           
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h6 mx-4">
                    <Group position="apart">
                    <p className="text-start mb-3 ms-1" style={{color: '#3381D4', fontSize: '17px', fontWeight: '600'}}>
                        Determine o tempo (minutos)
                      </p>
                    </Group>
                    <Grid className="mb-1"> 
                      <Grid.Col span={3}>
                        <button
                          type="button"
                          className={`ms-1 btn icon-shape icon-shape rounded align-center ${
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
                      </Grid.Col>
                    </Grid>
                    <div className="h6 mx-2 mt-2"> 
                      <p id="tempoCusto" className="text-end mb-2">
                      Esse tempo irá custar: R$ {valorcobranca2}
                      </p>
                      <p className="text-start" id="horarioChegada">
                      Tempo Creditado: {link.tempo}
                      </p> 
                      <p className="text-start mt-2" id="horarioChegada">
                      Horário chegada: {link.chegada}
                      </p>
                     
                      <div className="mt-3 mb-3 gap-0 d-flex justify-content-between">
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
                          style={{backgroundColor: '#3381D4', fontSize: '18px', fontWeight: '600', padding: '12px 0 12px 0',  height: 'auto'}}
                          loading={botaoOff}
                        >
                          Ativar
                        </Button>
                        <div className="mt-1 text-end">
                          <span>
                           
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
       
      </div>
    </>
  );
};

export default ListarVeiculos;
