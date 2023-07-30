import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaClipboardList, FaParking, FaCarAlt } from "react-icons/fa";
import {
  AiFillCheckCircle,
  AiFillPrinter,
  AiOutlineReload,
} from "react-icons/ai";
import { BsCalendarDate, BsFillPersonFill, BsCashCoin } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import Swal from "sweetalert2";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import Filtro from "../util/Filtro";
import { ActionIcon, Button, Loader } from "@mantine/core";
import ModalPix from "./ModalPix";
import { useDisclosure } from "@mantine/hooks";
import ImpressaoTicketNotificacao from "../util/ImpressaoTicketNotificacao";
import createAPI from "../services/createAPI";
import { IconPrinter, IconReceipt } from "@tabler/icons-react";
import ImpressaoTicketRegularizacao from "../util/ImpressaoTicketRegularizacao";

const ListarNotificacoes = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [placaSetada, setPlacaSetada] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [cont, setCont] = useState(0);
  const [filtro, setFiltro] = useState("");
  const [data2, setData2] = useState([]);
  const [onOpen, setOnOpen] = useState(false);
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [perfil, setPerfil] = useState("");

  const atualiza = (index) => {
    data[index].estado = !data[index].estado;
    setData([...data]);
  };

  const pagamento = (index) => {
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
            console.log("n abriu nkk");
          }
        })
        .catch((err) => {
          console.log(err);
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
        if (response.data.msg.resultado) {
          ImpressaoTicketRegularizacao('PRIMEIRA', item)
          console.log(response.data.data)
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
        console.log(err);
      });
  }

  const regularizacaoSegundaVia = (item) => {
  ImpressaoTicketRegularizacao('SEGUNDA', item)
  }

  const regularizar = async (idVagaVeiculo, index, pagamento, item) => {
    const requisicao = createAPI();
    console.log(idVagaVeiculo);
    requisicao.put("/notificacao/", {
        id_vaga_veiculo: idVagaVeiculo,
        tipoPagamento: pagamento,
      }).then((response) => {
        console.log(response);
        if (response.data.msg.resultado) {
          ImpressaoTicketRegularizacao('PRIMEIRA', item)
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
    const requisicao = createAPI();
    const idrequisicao = `{"where": [{ "field": "vaga_veiculo", "operator": "=", "value": "${localVagaVeiculo}" }]}`;
    const passar = btoa(idrequisicao);

    await requisicao
      .get(`/notificacao/?query=${passar}`)
      .then((response) => {
        if (response.data.msg.resultado) {
          const newData = response?.data.data.map((item) => ({
            data: ArrumaHora(item.data),
            id_notificacao: item.id_notificacao,
            id_vaga_veiculo: item.id_vaga_veiculo,
            tipo_notificacao: item.tipo_notificacao.nome,
            monitor: item.monitor.id_usuario,
            vaga: item.vaga,
            modelo: item.veiculo.modelo.nome,
            fabricante: item.veiculo.modelo.fabricante.nome,
            endereco: item.local,
            valor: item.valor,
            placa: item.veiculo.placa,
            estado: false,
            pago: item.pago,
          }));
          setData(newData);
          setEstado2(true);
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
        console.log(error);
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

    setTimeout(() => {
      localStorage.removeItem("VagaVeiculoId");
    }, 2000);
  };

  const startNotificao = async () => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    setEstado2(false);
    const requisicao = createAPI();
    const idrequisicao = `{"where": [{ "field": "usuario", "operator": "=", "value": "${user2.id_usuario}" }]}`;
    const passar = btoa(idrequisicao);
    await requisicao
      .get(`/notificacao/?query=${passar}`)
      .then((response) => {
        setEstado2(true);
        if (response.data.msg.resultado) {
          setEstado(false);
          const newData = response?.data.data.map((item) => ({
            data: ArrumaHora(item.data),
            id_notificacao: item.id_notificacao,
            id_vaga_veiculo: item.id_vaga_veiculo,
            tipo_notificacao: item.tipo_notificacao.nome,
            monitor: item.monitor.id_usuario,
            vaga: item.vaga,
            modelo: item.veiculo.modelo.nome,
            fabricante: item.veiculo.modelo.fabricante.nome,
            endereco: item.local,
            valor: item.valor,
            placa: item.veiculo.placa,
            estado: false,
            pago: item.pago,
          }));
          setData(newData);
        } else {
          setEstado(true);
          setMensagem(response.data.msg.msg);
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

  const startPlaca = async (placa) => {
    setEstado2(false);
    const requisicao = createAPI();
    const idrequisicao = `{"where": [{ "field": "placa", "operator": "=", "value": "${placa}" }]}`;
    const passar = btoa(idrequisicao);
    await requisicao
      .get(`/notificacao/?query=${passar}`)
      .then((response) => {
        setEstado2(true);
        if (response.data.msg.resultado) {
          const newData = response?.data.data.map((item) => ({
            data: ArrumaHora(item.data),
            id_notificacao: item.id_notificacao,
            id_vaga_veiculo: item.id_vaga_veiculo,
            tipo_notificacao: item.tipo_notificacao.nome,
            monitor: item.monitor.id_usuario,
            vaga: item.vaga,
            modelo: item.veiculo.modelo.nome,
            fabricante: item.veiculo.modelo.fabricante.nome,
            endereco: item.local,
            valor: item.valor,
            placa: item.veiculo.placa,
            estado: false,
            pago: item.pago,
          }));
          setData(newData);
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

  useEffect(() => {

    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);

    setPerfil(user2.perfil[0])
    
    if (
      localStorage.getItem("turno") !== "true" &&
      user2.perfil[0] === "monitor"
    ) {
      FuncTrocaComp("FecharTurno");
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
    console.log(item);
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
      item.data,
    );
  };

  return (
    <div className="col-12 px-3 mb-3">
      {perfil === "monitor" ? (
      <p className="text-start fs-2 fw-bold">Notificações emitidas:</p>
      ) : 
      <p className="text-start fs-2 fw-bold">Notificações:</p>}
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
            <div className="col-3 text-end"></div>
            <div className="col-1 text-end">
              <AiOutlineReload
                onClick={() => {
                  startNotificao();
                }}
                className="mt-1"
                size={21}
              />
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

                  {link.pago === "S" ? 
                  <div className="px-3">
                   {perfil === "monitor" ? (
                    <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} fullWidth mt="md" radius="md"
                    onClick={() => regularizacaoSegundaVia(link)}>
                    IMPRIMIR SEGUNDA VIA ‎ <IconReceipt size={18}/>
                   </Button>
                   ) : null}
                  </div>
                  : (
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
                            <button
                              type="submit"
                              className="btn5 botao align-itens-center fs-6"
                              onClick={() => {
                                pagamento(index);
                              }}
                            >
                              Regularizar
                            </button>
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
      <ModalPix
        qrCode={data2.brcode}
        status={notification}
        mensagemPix={pixExpirado}
        onOpen={onOpen}
      />
    </div>
  );
};

export default ListarNotificacoes;
