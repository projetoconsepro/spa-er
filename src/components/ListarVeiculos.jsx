import axios from "axios";
import { FcPlus } from "react-icons/fc";
import { FaBell, FaCarAlt, FaParking } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { IoTrashSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { TbHandClick, TbSquareRoundedPlusFilled } from "react-icons/tb";
import "../pages/Style/styles.css";
import Swal from "sweetalert2";
import FuncTrocaComp from "../util/FuncTrocaComp";
import VoltarComponente from "../util/VoltarComponente";
import { Button, Divider, Grid, Group, Input, Modal, Text } from "@mantine/core";
import { IconArrowRight, IconChevronRight, IconParking, IconPlus, IconPrinter, IconReload, IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import createAPI from "../services/createAPI";
import EnviarNotificacao from "../util/EnviarNotificacao";
import LimparNotificacao from "../util/LimparNotificacao";
import { CarCrashOutlined } from "@mui/icons-material";
import { BsConeStriped } from "react-icons/bs";
import { IconCirclePlus } from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import jsPDF from "jspdf";


const ListarVeiculos = () => {
  const [resposta, setResposta] = useState([]);
  const [valorcobranca, setValorCobranca] = useState("");
  const [valorcobranca2, setValorCobranca2] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [mostrar2, setMostrar2] = useState([]);
  const [mostrardiv, setMostrarDiv] = useState([]);
  const [nofityvar, setNotifyVar] = useState([]);
  const [saldoCredito, setSaldoCredito] = useState("");
  const [vaga, setVaga] = useState([]);
  const [notificacao, setNotificacao] = useState([]);
  const [selectedButton, setSelectedButton] = useState("01:00:00");
  const [botaoOff, setBotaoOff] = useState(false);
  const [contador, setContador] = useState(0);
  const [horaAgora, setHoraAgora] = useState("");
  const [cont, setCont] = useState(0);
  const [openedModal, { open: openModal, close: closeModal }] =
  useDisclosure(false);
  const [data2, setData2] = useState([]);
  const [date, setDate] = useState("");
  const [emissao, setEmissao] = useState("");
  const [validade, setValidade] = useState("");

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
          resposta[i].div = "card-body10 mb-2";
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
              resposta[
                i
              ].numero_notificacoes_pendentes = `${response.data.data[i].numero_notificacoes_pendentes} ${response.data.data[i].numero_notificacoes_pendentes === 1 ?  "notificação" : "notificações"}`;
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
              resposta[
                i
              ].numero_notificacoes_pendentes = `${response.data.data[i].numero_notificacoes_pendentes} ${response.data.data[i].numero_notificacoes_pendentes === 1 ?  "notificação" : "notificações"}`;
              nofityvar[i] = { notifi: "notify2" };
              notificacao[i] = { estado: false };
            }
          }
        }
        setBotaoOff(false);
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
    if (contador >= 10) {
      setContador(0);
    }
    setTimeout(() => {
      setContador(contador + 1);
    }, 1000);
  }, [contador]);

  useEffect(() => {
    if (cont != 0) {
      atualizacomp();
    } else {
      setCont(1);
    }
  }, [cont]);

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
    const requisicao = createAPI();
    const tempo1 = selectedButton;

    const resposta = await mexerValores();

    if (vaga.length === 0) {
      vaga[0] = 0;
    }

    const numeroCorrigido = parseFloat(saldoCredito.replace(",", "."));
    if (parseFloat(numeroCorrigido) < parseFloat(resposta)) {
      setBotaoOff(false);
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
        .then(async (response) => {
          if (response.data.msg.resultado === true) {
            setData2(response.data.data);
            setDate(FormatDate(response.data.data.data));
            setEmissao(response.data.data.chegada)
            const validade = await calcularValidade(response.data.data.chegada, response.data.data.tempo)
            setValidade(validade)
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

    vagaa[0] = vaga;

    const tempo1 = selectedButton;

    const resposta = await mexerValores();

    const numeroCorrigido = parseFloat(saldoCredito.replace(",", "."));
    if (parseFloat(numeroCorrigido) < parseFloat(resposta)) {
      setBotaoOff(false);
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
        .then(async (response) => {
          if (response.data.msg.resultado === true) {
            setData2(response.data.data);
            setDate(FormatDate(response.data.data.data));
            setEmissao(response.data.data.chegada)
            const validade = await calcularValidade(response.data.data.chegada, response.data.data.tempo)
            setValidade(validade)
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

  async function gerarPDF() {
    // Cria um novo objeto jsPDF
    const pdfWidth = 80; // 100 mm
    const pdfHeight = 100; // 150 mm
    const pdf = new jsPDF({
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    const tamanhoFonte = 12;

    // Posições para posicionar o conteúdo do PDF
    const x = 18 ;
    const y = 15;

    // Iniciar a criação do PDF e adicionar o conteúdo da div
    pdf.setFontSize(tamanhoFonte);
    pdf.text("CONSEPRO TAQUARA", x, y);
    pdf.text("- - - - - - - - - - - - - - - - - - - - - - - -", 10 , y + 5);
    pdf.setFontSize(tamanhoFonte - 2);
    pdf.text("Tipo: Estacionamento avulso" , x, y + 12);
    pdf.text(`Início: ${date} - ${emissao}` , x, y + 17);
    pdf.text(`Validade: ${date} - ${await calcularValidade(data2.chegada, data2.tempo)}` , x, y + 22);
    pdf.text("Placa: " + data2.placa , x, y + 27);
    pdf.text("Tempo: " + data2.tempoCredito , x, y + 32);
    pdf.text("Valor: R$ " + data2.valor , x, y + 37);
    pdf.setFontSize(tamanhoFonte);
    pdf.text("- - - - - - - - - - - - - - - - - - - - - - - -", 10 , y + 44);
    pdf.setFontSize(tamanhoFonte - 2);
    pdf.text("CNPJ: 89.668.040/0001-10", x, y + 49);
    pdf.text("Rua Julio de Castilhos, 2500" , x, y + 54);
    pdf.text("Taquara - RS" , x, y + 59);
    pdf.text("(51) 9 8660-4241", x, y + 64);

    // Gera o PDF
    pdf.save("Comprovante_Ticket.pdf");
  }

  return (
    <>
    <Modal
    opened={openedModal}
    onClose={() => {
      closeModal()
    }}
    centered
    size="xl"
    title="Comprovante de estacionamento:"
  >
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
        <h6>Início: {date} - {emissao} </h6>
      </div>
      <div>
        <h6>Validade: {date} - {validade} </h6>
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
        onClick={() => {
          gerarPDF(data2);
        }}
      >
        Imprimir
      </Button>
    </div>
  </Modal>
    <div className="col-12 px-3 mb-7">
      <div className="row">
        <div className="col-10">
          <p className="text-start fs-2 fw-bold">
            <VoltarComponente arrow={true} /> Meus veículos
          </p>
        </div>
        <div className="col-2" onClick={() => atualizacomp()}>
          <IconReload className="text-end mt-2" />
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
              gradient={{ from: 'green', to: 'teal' }}
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
                <IconChevronRight size={30} className="mx-1 mb-5" onClick={() => FuncTrocaComp("HistoricoFinanceiro")}/>
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
          >
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
                    <h6 className={link.data < horaAgora ? "text-danger" : ""}>
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
                  {link.estacionado !== "Não estacionado" ?
                  <div>
                    <img src="../../assets/img/estacionamento.png" alt="Rich Logo" className={window.innerWidth > 900 ? "w-25" : ""}/>
                  </div>
                  : null }
                </div>
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
                        loading={botaoOff}
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
                        className="btn3 botao"
                        loading={botaoOff}
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
              gradient={{ from: 'cyan', to: 'teal' }}
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
