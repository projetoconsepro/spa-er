import React, { useEffect, useState } from "react";
import { FaClipboardList, FaParking, FaCarAlt } from "react-icons/fa";
import { AiFillCheckCircle, AiOutlineReload } from "react-icons/ai";
import { BsCalendarDate, BsFillPersonFill, BsCashCoin } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import Swal from "sweetalert2";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import Filtro from "../util/Filtro";
import { ActionIcon, Button, Grid, Loader, Modal, Text } from "@mantine/core";
import ModalPix from "./ModalPix";
import { useDisclosure } from "@mantine/hooks";
import ImpressaoTicketNotificacao from "../util/ImpressaoTicketNotificacao";
import createAPI from "../services/createAPI";
import { IconPrinter, IconReceipt } from "@tabler/icons-react";
import ImpressaoTicketRegularizacao from "../util/ImpressaoTicketRegularizacao";
import ModalErroBanco from "./ModalErroBanco";

const ListarNotificacoes = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [placaSetada, setPlacaSetada] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [data2, setData2] = useState([]);
  const [onOpen, setOnOpen] = useState(false);
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [perfil, setPerfil] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [onOpenError, setOnOpenError] = useState(false);
  const [onCloseError, setOnCloseError] = useState(false);
  const [selectedButton, setSelectedButton] = useState("pix");
  const [estadoModal, setEstadoModal] = useState("select");

  const atualiza = (index) => {
    data[index].estado = !data[index].estado;
    setData([...data]);
  };

  const pagamento = (index) => {
    setButtonLoading(true);
    const select = document.getElementById("pagamentos").value;

    if (select === "dinheiro") {
      regularizar(data[index].id_vaga_veiculo, index, select, data[index]);
    } else {
      const valor = data[index].valor.toString();
      const valor2 = parseFloat(valor.replace(",", ".")).toFixed(2);
      const requisicao = createAPI();

      const campo = {
        id_vaga_veiculo: data[index].id_vaga_veiculo,
        tipoPagamento: "pix",
      };

      requisicao
        .post("/gerarcobranca", {
          valor: valor2,
          campo: JSON.stringify(campo),
        })
        .then((resposta) => {
          if (resposta.data.msg.resultado) {
            setOnOpen(true);
            setData2(resposta.data.data);
            getInfoPix(resposta.data.data.txid, index, data[index]);
            open();
          } else {
          }
        })
        .catch((err) => {
          setButtonLoading(false);
          setOnOpenError(true);
        });
    }
  };

  async function getInfoPix(TxId, index, item) {
    const requisicao = createAPI();
    await requisicao
      .put(`/notificacao/pix`, {
        txid: TxId,
      })
      .then((response) => {
        setButtonLoading(false);
        if (response.data.msg.resultado) {
          ImpressaoTicketRegularizacao("PRIMEIRA", item);
          setOnOpen(false);
          Swal.fire({
            title: "Regularizado!",
            text: "A notificação foi regularizada.",
            icon: "success",
            timer: 2000,
          });
          if (index !== undefined) {
            data[index].pago = "S";
            setData([...data]);
          } else {
            startNotificao();
          }
        } else {
          setNotification(false);
          setPixExpirado("Pix expirado");
        }
      })
      .catch((err) => {
        setButtonLoading(false);
        setOnOpenError(true);
      });
  }

  const regularizacaoSegundaVia = (item) => {
    ImpressaoTicketRegularizacao("SEGUNDA", item);
  };

  const regularizar = async (idVagaVeiculo, index, pagamento, item) => {
    const requisicao = createAPI();
    requisicao
      .put("/notificacao/", {
        id_vaga_veiculo: idVagaVeiculo,
        tipoPagamento: pagamento,
      })
      .then((response) => {
        setButtonLoading(false);
        if (response.data.msg.resultado) {
          ImpressaoTicketRegularizacao("PRIMEIRA", item);
          Swal.fire({
            title: "Regularizado!",
            text: "A notificação foi regularizada.",
            icon: "success",
            timer: 2000,
          });
          if (index !== undefined) {
            data[index].pago = "S";
            setData([...data]);
          } else {
            startNotificao();
          }
        } else {
          setEstado(true);
          setMensagem(response.data.msg.msg);
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 5000);
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

  function ArrumaHora(data) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    const data6 = data2[1].split(":");
    const data5 = data4 + " " + (data6[0] - 3) + ":" + data6[1];
    return data5;
  }

  const startVagaVeiculo = async (localVagaVeiculo) => {
    const idrequisicao = `{"where": [{ "field": "vaga_veiculo", "operator": "=", "value": "${localVagaVeiculo}" }]}`;
    handleFiltro(idrequisicao);

    setTimeout(() => {
      localStorage.removeItem("VagaVeiculoId");
    }, 2000);
  };

  const startNotificao = async () => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const idrequisicao = `{"where": [{ "field": "usuario", "operator": "=", "value": "${user2.id_usuario}" }]}`;
    handleFiltro(idrequisicao);
  };

  const onClose = () => {
    setButtonLoading(false);
  };

  const startPlaca = async (placa) => {
    const idrequisicao = `{"where": [{ "field": "placa", "operator": "=", "value": "${placa}" }]}`;
    handleFiltro(idrequisicao);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);

    setPerfil(user2.perfil[0]);

    if (
      localStorage.getItem("turno") !== "true" &&
      user2.perfil[0] === "monitor"
    ) {
      FuncTrocaComp("AbrirTurno");
    }
    const localVagaVeiculo = localStorage.getItem("VagaVeiculoId");
    const placa = localStorage.getItem("placaCarro");
    if (
      localVagaVeiculo !== null &&
      localVagaVeiculo !== undefined &&
      localVagaVeiculo !== ""
    ) {
      startVagaVeiculo(localVagaVeiculo);
    } else if (placa !== null && placa !== undefined && placa !== "") {
      setPlacaSetada(placa);
      startPlaca(placa);
    } else {
      startNotificao();
    }
  }, []);

  const handleConsultaSelected = (consulta) => {
    handleFiltro(consulta);
  };

  const handleFiltro = (where) => {
    setEstadoLoading(true);
    const requisicao = createAPI();
    const base64 = btoa(where);
    requisicao
      .get(`/notificacao/?query=${base64}`)
      .then((response) => {
        setEstadoLoading(false);
        if (response.data.msg.resultado) {
          setEstado(false);
          setMensagem("");
          setEstado2(true);
          const newData = response.data.data.map((item) => ({
            data: ArrumaHora(item.data),
            id_notificacao: item.id_notificacao,
            tipo_notificacao: item.tipo_notificacao.nome,
            monitor: item.monitor.id_usuario,
            id_vaga_veiculo: item.id_vaga_veiculo,
            vaga: item.vaga,
            modelo: item.veiculo.modelo.nome,
            fabricante: item.veiculo.modelo.fabricante.nome,
            endereco: item.local,
            valor: item.valor,
            placa: item.veiculo.placa,
            estado: false,
            pago: item.pago,
            checked: false,
          }));
          setData(newData);
        } else {
          setData([]);
          setEstado(true);
          setMensagem("Não há notificações para exibir");
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

  const imprimirSegundaVia = (item) => {
    ImpressaoTicketNotificacao(
      "SEGUNDA",
      item.monitor,
      item.vaga,
      item.placa,
      item.modelo,
      item.fabricante,
      item.tipo_notificacao,
      item.endereco,
      item.valor,
      item.data
    );
  };

  const registroPixRegularizacao = () => {
    let valor = data.filter((item) => item.checked).reduce((acc, item) => acc + item.valor, 0);
    valor = valor.toString();
    let valor2 = valor.replace(',', '.');
    valor2 = parseFloat(valor2).toFixed(2);
    const requisicao = createAPI();

    const campo = data.filter((item) => item.checked).map((item) => item.id_vaga_veiculo);

    requisicao
      .post("/gerarcobranca", {
        valor: valor2,
        campo: JSON.stringify(campo)
      })
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          setOnOpen(true);
          setData2(resposta.data.data);
          close();
          registrarMultiplasRegularizacoes(data, "pix", resposta.data.data.txid);
        } else {
          setButtonLoading(false);
          setEstado(true);
          setMensagem(resposta.data.msg.msg);
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 5000);
        }
      })
      .catch((err) => {
        setButtonLoading(false);
        setOnOpenError(true);
      });
    };




  const registrarMultiplasRegularizacoes = (array, formaPagamento, txid) => {
    let arrayRegularizacao = [];
    const requisicao = createAPI();
    if ( formaPagamento === "dinheiro") {
      arrayRegularizacao = array.filter((item) => item.checked).map((item) => item.id_vaga_veiculo);
    }

    requisicao
      .post("/notificacao/verificar/pix", {
        txid: txid ? txid : "",
        notificacoes: arrayRegularizacao,
        formaPagamento: formaPagamento,
      })
      .then((response) => {
        if (response.data.msg.resultado) {
          const arrayImpressao = [];
          for (let i = 0; i < array.length; i++) {
            const item = array[i];
            if (item.checked) {
              ImpressaoTicketRegularizacao("PRIMEIRA", item);
              item.pago = "S";
              item.checked = false;
            }
            arrayImpressao.push(item);
          }
          setData([...arrayImpressao]);
          setOnOpen(false);
          Swal.fire({
            title: "Regularizado!",
            text: "As notificações foram regularizadas.",
            icon: "success",
            timer: 2000,
          });
        } else {
          setEstado(true);
          setMensagem(response.data.msg.msg);
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 5000);
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
  }

    

  return (
    <>
      <Modal
        title="Múltiplas regularizações"
        centered
        size="xl"
        opened={opened}
        onClose={() => {close(); setEstadoModal("select")}}
      >
      {estadoModal === "select" ? (
        <>
        <div className="row">
            <div className="col-12">
              <h6>Selecione as notificações para regularizar:</h6>
              <div className="text-start d-flex">
              <h6>Selecionar todas:  </h6> <input type="checkbox"  style={{ width: "15px", height: "15px", marginLeft: "8px", marginTop: "4px" }} onChange={(e) => data.filter(item => item.pago === "N").map(item => item.checked = e.target.checked)} />
              </div>
            </div>
          </div>
          <table className="table table-striped table-hover table-bordered table-responsive">
              <thead>
                <tr className="text-center">
                  <th>
                    <AiFillCheckCircle size={20} />
                  </th>
                  <th>Placa</th>
                  <th>Data</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {data.map(
                  (link, index) => link.pago !== "S" && (
                    <tr key={index}>
                      <td
                        className="px-1"
                        style={{ width: "40px", textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={link.checked}
                          onChange={() => (link.checked = !link.checked)}
                          style={{ width: "20px", height: "20px" }} />
                      </td>
                      <td>{link.placa}</td>
                      <td><small>{link.data}</small></td>
                      <td> R$ {link.valor.toFixed(2)}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            </>
          ) : (
          <>
            <div className="col-12 text-center mt-4 mb-4">
              <h6>Valor total <h3 className="mt-2">R$ {data.filter((item) => item.checked).reduce((acc, item) => acc + item.valor, 0).toFixed(2)} </h3></h6>
            </div>

            <p className="text-start">Forma de pagamento:</p>
                <Grid cols={12} gap="md" className="text-center">
                    <Grid.Col span={6}>
                      <button type="button" className={`btn icon-shape w-75 icon-shape rounded align-center ${
                      selectedButton === "pix"
                        ? "corTempoSelecionado"
                        : "corTempo"
                      }`} 
                      onClick={() => setSelectedButton("pix")}
                      value="pix">
                        <Text fz="lg" weight={700}>
                          PIX
                        </Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={6}>
                    <button type="button" className={`btn icon-shape w-75 icon-shape rounded align-center ${
                      selectedButton === "dinheiro"
                        ? "corTempoSelecionado"
                        : "corTempo"
                      }`} 
                      onClick={() => setSelectedButton("dinheiro")}
                      value="dinheiro">
                        <Text fz="lg" weight={700}>
                          Dinheiro
                        </Text>
                      </button>
                    </Grid.Col>
                  </Grid>


          </> 
          )}
        <Button
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          fullWidth
          mt="md"
          radius="md"
          onClick={() => {
            if (estadoModal === "pagamento") {
              close();
              if (selectedButton === "pix") {
                registroPixRegularizacao();
              } else {
                registrarMultiplasRegularizacoes(data, selectedButton);
              }
              setEstadoModal("select");
            } else if (estadoModal === "select" && data.filter((item) => item.checked).length > 0) {
              setEstadoModal("pagamento");
            } else {
              Swal.fire({
                title: "Selecione ao menos uma notificação",
                icon: "warning",
              });
            }
          }}
        >
          {estadoModal === "select" ? 'Avançar' : 'Finalizar' } ‎ <AiFillCheckCircle size={18} />
        </Button>
      </Modal>

      <div className="col-12 px-3 mb-3">
        {perfil === "monitor" ? (
          <p className="text-start fs-2 fw-bold">Notificações emitidas:</p>
        ) : (
          <p className="text-start fs-2 fw-bold">Notificações:</p>
        )}
        <div className="row mb-3">
          <div className="col-12">
            <div className="row">
              <div className="col-7">
                <Filtro
                  nome={"ListarNotificacoesAdmin"}
                  onConsultaSelected={handleConsultaSelected}
                  onLoading={estadoLoading}
                />
              </div>
              <div className="col-2 text-end">
                <Button
                  variant="gradient"
                  gradient={{ from: "indigo", to: "blue", deg: 60 }}
                  mb="sm"
                  radius="sm"
                  size="sm"
                  onClick={() => {
                    open();
                  }}
                >
                  <AiFillCheckCircle size={20} />
                </Button>
              </div>
              <div className="col-2 text-end">
                <Button
                  variant="gradient"
                  gradient={{ from: "indigo", to: "blue", deg: 60 }}
                  mb="sm"
                  radius="sm"
                  size="sm"
                  onClick={() => {
                    startNotificao();
                  }}
                >
                  <AiOutlineReload size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {estado2 ? (
          <div>
            {data.map((link, index) => (
              <div className="card border-0 shadow mt-2 mb-2" key={index}>
                <div
                  className="card-body"
                  onClick={() => {
                    atualiza(index);
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
                          {" "}
                          <BsCalendarDate />‎ {link.data}
                        </h6>
                      </div>
                      {link.estado ? (
                        <div
                          className="h6 d-flex align-items-center fs-6"
                          id="bordaBaixo"
                        >
                          <h6>
                            {" "}
                            <FaClipboardList />‎{" "}
                            <small>Motivo: {link.tipo_notificacao}</small>
                          </h6>
                        </div>
                      ) : (
                        <div className="h6 d-flex align-items-center fs-6">
                          <h6>
                            {" "}
                            <FaClipboardList />‎{" "}
                            <small>Motivo: {link.tipo_notificacao}</small>
                          </h6>
                        </div>
                      )}
                    </div>
                    <div>
                      {link.pago === "N" ? (
                        <div className="d-flex align-items-center fw-bold">
                          <BiErrorCircle size={30} color="red" />
                        </div>
                      ) : (
                        <div className="d-flex align-items-center fw-bold">
                          <AiFillCheckCircle size={30} color="green" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {link.estado ? (
                  <div className="justify-content-between pb-3 mb-1">
                    <div
                      className="h6 align-items-start text-start px-4"
                      id="estacionadocarroo"
                    >
                      <h6>
                        {" "}
                        <FaParking />‎ Vaga: {link.vaga}
                      </h6>
                    </div>
                    <div
                      className="h6 align-items-start text-start px-4"
                      id="estacionadocarroo"
                    >
                      <h6>
                        {" "}
                        <BsFillPersonFill />‎ Monitor: {link.monitor}
                      </h6>
                    </div>
                    <div
                      className="h6 align-items-start text-start px-4"
                      id="estacionadocarroo"
                    >
                      <h6>
                        {" "}
                        <FaCarAlt />‎ Modelo: {link.modelo}
                      </h6>
                    </div>
                    <div
                      className="h6 align-items-start text-start px-4"
                      id="estacionadocarroo"
                    >
                      <h6>
                        {" "}
                        <BsCashCoin />‎ Valor: R${link.valor}
                      </h6>
                    </div>

                    {link.pago === "S" ? (
                      <div className="px-3">
                        {perfil === "monitor" ? (
                          <Button
                            variant="gradient"
                            gradient={{ from: "indigo", to: "cyan" }}
                            fullWidth
                            mt="md"
                            radius="md"
                            onClick={() => regularizacaoSegundaVia(link)}
                          >
                            IMPRIMIR SEGUNDA VIA ‎ <IconReceipt size={18} />
                          </Button>
                        ) : null}
                      </div>
                    ) : (
                      <div className="h6 mt-3 mx-5">
                        <select
                          className="form-select form-select-lg mb-1"
                          aria-label=".form-select-lg example"
                          id="pagamentos"
                          defaultValue="01:00:00"
                        >
                          <option value="pix">PIX</option>
                          <option value="dinheiro">Dinheiro</option>
                        </select>
                        <div className="pt-3 gap-6 d-md-block">
                          <div className="row">
                            <div className="col-10">
                              <Button
                                className="btn5 botao align-itens-center fs-6"
                                onClick={() => {
                                  pagamento(index);
                                }}
                                loading={buttonLoading}
                              >
                                Regularizar
                              </Button>
                            </div>
                            {perfil === "monitor" ? (
                              <div className="col-2 pt-1">
                                <ActionIcon
                                  variant="outline"
                                  color="indigo"
                                  size="lg"
                                >
                                  <IconPrinter
                                    onClick={() => imprimirSegundaVia(link)}
                                  />
                                </ActionIcon>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="col-12 text-center mt-4 mb-4">
            <Loader />
          </div>
        )}
        <div
          className="alert alert-danger mt-4"
          role="alert"
          style={{ display: estado ? "block" : "none" }}
        >
          {mensagem}
        </div>
        <VoltarComponente />
        <ModalErroBanco onOpen={onOpenError} onClose={onCloseError} />
        <ModalPix
          qrCode={data2.brcode}
          status={notification}
          mensagemPix={pixExpirado}
          onOpen={onOpen}
          onClose={onClose}
        />
      </div>
    </>
  );
};

export default ListarNotificacoes;
