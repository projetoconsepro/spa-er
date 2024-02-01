import axios from "axios";
import { React, useState, useEffect } from "react";
import "../pages/Style/styles.css";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { Button, Card, Divider, Grid, Group, Modal, Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { rem } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";
import { FaCar } from "react-icons/fa";
import createAPI from "../services/createAPI";
import jsPDF from "jspdf";
import { useDisclosure } from "@mantine/hooks";

const RegistrarVagaCliente = () => {
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [inputVaga, setInputVaga] = useState("form-control fs-5");
  const [vaga, setVaga] = useState([]);
  const [resposta, setResposta] = useState([{}]);
  const [resposta2, setResposta2] = useState([]);
  const [valor, setValor] = useState(0);
  const [valorcobranca, setValorCobranca] = useState("");
  const [valorcobranca2, setValorCobranca2] = useState("");
  const [selectedButton, setSelectedButton] = useState("01:00:00");
  const [placaSelecionada, setPlacaSelecionada] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [data2, setData2] = useState([]);
  const [date, setDate] = useState("");
  const [emissao, setEmissao] = useState("");
  const [validade, setValidade] = useState("");
  const [openedModal, { open: openModal, close: closeModal }] =
  useDisclosure(false);

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

  async function gerarPDF() {
    const pdfWidth = 80;
    const pdfHeight = 100; 
    const pdf = new jsPDF({
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    const tamanhoFonte = 12;
    const x = 18 ;
    const y = 15;
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

  const parametros = axios.create({
    baseURL: process.env.REACT_APP_HOST,
  });

  async function saldo () {
    const requisicao = createAPI();
    requisicao
      .get("/usuario/saldo-credito")
      .then((response) => {
        if (response.data.msg.resultado) {
          setValor(response.data.data.saldo);
        } else {
          setValor(0);
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

  useEffect(() => {
    const requisicao = createAPI();
    requisicao
      .get("/veiculo")
      .then((response) => {
        setResposta(response?.data?.data);
        if (response.data.msg.resultado === false) {
          FuncTrocaComp("MeusVeiculos");
        }
        for (let i = 0; i < response?.data?.data.length; i++) {
          resposta2[i] = {};
          resposta2[i].placa = response.data.data[i].usuario;
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
      
    saldo()

    parametros
      .get("/parametros")
      .then((response) => {
        setValorCobranca(response.data.data.param.estacionamento.valorHora);
        setValorCobranca2(response.data.data.param.estacionamento.valorHora);
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

  const FormatDate = (date) => {
    const data = new Date(date);
    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, "0");
    const day = String(data.getDate()).padStart(2, "0");
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  };

  const handleSubmit = async () => {
    setLoadingButton(true);
    const requisicao = createAPI();
    const tempo1 = selectedButton;
    const placa2 = placaSelecionada;

    if (placaSelecionada === "") {
      setLoadingButton(false);
      setMensagem("Selecione um veículo.");
      setEstado(true);
      setTimeout(() => {
        setMensagem("");
        setEstado(false);
      }, 4000);
      return;
    }

    const resposta = await mexerValores();

    const numeroCorrigido = parseFloat(valor.replace(",", "."));
    if (parseFloat(numeroCorrigido) < parseFloat(resposta)) {
      setLoadingButton(false);
      setMensagem("Saldo insuficiente.");
      setEstado(true);
      setTimeout(() => {
        setMensagem("");
        setEstado(false);
      }, 4000);
    } else {
      if (vaga.length === 0) {
        vaga[0] = 0;
      }

      let campo = {
        placa: placa2,
        numero_vaga: vaga,
        tempo: tempo1,
        pagamento: "credito",
      };

      await requisicao
        .get(`/veiculo/${placaSelecionada}`)
        .then((response) => {
          if (response.data.msg.msg === "Dados encontrados") {
            if (response.data.data[0].estacionado[0].estacionado === "S") {
              campo = {
                placa: placa2,
                numero_vaga: vaga,
                tempo: tempo1,
                pagamento: "credito",
                id_vaga_veiculo:
                  response.data.data[0].estacionado[0].id_vaga_veiculo,
              };
            }
          }
        })
        .catch(function (error) {
          console.log("a", error);
        });

      await requisicao
        .post("/estacionamento", campo)
        .then(async (response) => {
          setLoadingButton(false);
          if (response.data.msg.resultado) {
            setData2(response.data.data);
            setDate(FormatDate(response.data.data.data));
            setEmissao(response.data.data.chegada)
            const validade = await calcularValidade(response.data.data.chegada, response.data.data.tempo)
            saldo()
            setValidade(validade)
            openModal();

          } else {
            setMensagem(response.data.msg.msg);
            setEstado(true);
            setTimeout(() => {
              setMensagem("");
              setEstado(false);
            }, 4000);
          }
        })
        .catch(function (error) {
          setLoadingButton(false);
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
    <div className="container">
      <div
        className="row justify-content-center form-bg-image"
        data-background-lg="../../assets/img/illustrations/signin.svg"
      >
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="h5 mt-2 align-items-center">
              <small>Registrar estacionamento</small>
            </div>

            <Divider my="sm" size="md" variant="dashed" />

            <div className="h6 mt-3 ">
              <p className="text-start">Selecione seu veículo:</p>
              {resposta2.length > 3 ? (
                <Carousel
                  slideGap="md"
                  slideSize="25%"
                  align="start"
                  slidesToScroll={1}
                  withIndicators
                  height={120}
                  styles={{
                    control: {
                      "&[data-inactive]": {
                        opacity: 0,
                        cursor: "default",
                      },
                      marginTop: rem(40),
                      borderColor: "rgba(0, 0, 0, .55)",
                    },
                    indicator: {
                      backgroundColor: "rgba(0, 0, 0, .55)",
                      width: rem(12),
                      height: rem(4),
                      transition: "width 250ms ease",

                      "&[data-active]": {
                        width: rem(40),
                      },
                    },
                  }}
                >
                  {resposta2.map((item, index) => (
                    <Carousel.Slide key={index}>
                      <Card
                        padding="xs"
                        radius="lg"
                        className={
                          placaSelecionada === item.placa
                            ? "bg-blue-500"
                            : "bg-blue-400"
                        }
                        onClick={() => setPlacaSelecionada(item.placa)}
                      >
                        <Grid>
                          <Grid.Col span={12}>
                            <Text fz="sm" weight={600}>
                              {item.placa}
                            </Text>
                            <FaCar size={26} color="gray" className="mt-1" />
                          </Grid.Col>
                        </Grid>
                      </Card>
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <Group position= {resposta2.length == 3 ? 'apart' :'start' 
                }>
                  {resposta2.map((item, index) => (
                    <Grid key={index}>
                      <Grid.Col span={12}>
                        <Card
                          padding="xs"
                          radius="lg"
                          className={
                            placaSelecionada === item.placa
                              ? "bg-blue-500"
                              : "bg-blue-400"
                          }
                          onClick={() => setPlacaSelecionada(item.placa)}
                        >
                          <Text fz="sm" weight={600}>
                            {item.placa}
                          </Text>
                          <FaCar size={26} color="gray" className="mt-1" />
                        </Card>
                      </Grid.Col>
                    </Grid>
                  ))}
                </Group>
              )}
            </div>

            <Divider my="sm" size="md" variant="dashed" />
            <p className="text-start">Determine o tempo (minutos):</p>
            <div className="h6 mt-3 mx-2">
              <Grid>
                <Grid.Col span={3}>
                  <button
                    type="button"
                    className={`btn icon-shape icon-shape rounded align-center ${
                      selectedButton === "00:30:00"
                        ? "corTempoSelecionado "
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
              <div className="mt-3">
                <p id="tempoCusto" className="text-end">
                  {" "}
                  Valor a ser cobrado: R$ {valorcobranca2}{" "}
                </p>
              </div>
            </div>


            <div className="mt-1 mb-5 gap-2 d-md-block">
              <VoltarComponente space={true} />
              <Button
                loading={loadingButton}
                onClick={() => {
                  handleSubmit();
                }}
                className="bg-blue-50"
                size="md"
                radius="md"
              >
                Confirmar
              </Button>
            </div>
            <div
              className="alert alert-danger"
              role="alert"
              style={{ display: estado ? "block" : "none" }}
            >
              {mensagem}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegistrarVagaCliente;
