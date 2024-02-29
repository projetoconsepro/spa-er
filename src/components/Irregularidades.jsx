import React, { useEffect, useState } from "react";
import { FaClipboardList, FaParking, FaCarAlt } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsCalendarDate, BsCashCoin, BsConeStriped } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import Swal from "sweetalert2";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import Filtro from "../util/Filtro";
import { IconReload, IconX } from "@tabler/icons-react";
import ModalPix from "./ModalPix";
import { useDisclosure } from "@mantine/hooks";
import createAPI from "../services/createAPI";
import { Button } from "@mantine/core";
import ModalErroBanco from "./ModalErroBanco";

const Irregularidades = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);
  const [saldoCredito, setSaldoCredito] = useState(0);
  const [loading, setOnLoading] = useState(false);
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [onOpen, setOnOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [onOpenError, setOnOpenError] = useState(false);
  const [onCloseError, setOnCloseError] = useState(false);

  const atualiza = (index) => {
    data[index].estado = !data[index].estado;
    setData([...data]);
  };


  const regularizar = (index) => {
    setLoadingButton(true);
    const select = document.getElementById("pagamentos").value;
    if (select === "credito") {
      let numeroCorrigido = saldoCredito.replace(".", "");
      numeroCorrigido = parseFloat(numeroCorrigido.replace(",", "."));
      if (parseFloat(numeroCorrigido) < parseFloat(data[index].valor)) {
        setLoadingButton(false);
        Swal.fire({
          icon: "error",
          title: "Saldo insuficiente",
          footer: '<a href="">Clique aqui para adicionar crédito.</a>',
        });
      } else {
        FuncRegularizao(data[index].id_vaga_veiculo, index, select);
      }
    } else {
      const valor = data[index].valor.toString();
      const valor2 = parseFloat(valor.replace(",", ".")).toFixed(2);
      const requisicao = createAPI();

      const campo = { 
        id_vaga_veiculo: data[index].id_vaga_veiculo,
        tipoPagamento: 'pix',
      }

      requisicao
        .post("/gerarcobranca", {
          valor: valor2,
          campo: JSON.stringify(campo)
        })
        .then((resposta) => {
          if (resposta.data.msg.resultado) {
            setData2(resposta.data.data);
            getInfoPix(resposta.data.data.txid, index);
            open();
            setOnOpen(true);
          } else {
          }
        })
        .catch((err) => {
          setLoadingButton(false);
          setOnOpenError(true);
        });
    }
  };

  async function getInfoPix(TxId, index) {
    const requisicao = createAPI();
      await requisicao
        .put(`/notificacao/pix`,{
          txid: TxId,
        })
        .then((response) => {
          if (response.data.msg.resultado) {
            setLoadingButton(false);
            setOnOpen(false);
            Swal.fire({
              title: "Regularizado!",
              text: "A notificação foi regularizada.",
              icon: "success",
              timer: 2000,
            });
            if (index !== undefined) {
              FuncTrocaComp("MeusVeiculos");
              data[index].pago = "S";
              setData([...data]);
            } else {
              FuncTrocaComp("MeusVeiculos");
              startNotificao();
            }
          } else {
            setLoadingButton(false);
            setNotification(false);
            setPixExpirado("Pix expirado");
          }
        })
        .catch((err) => {
          setLoadingButton(false);
          setOnOpenError(true);
        });
    }

  function ArrumaHora(data) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    const data6 = data2[1].split(":");
    const data5 = data4 + " " + (data6[0] - 3) + ":" + data6[1];
    return data5;
  }

  const onClose = () => {
  setLoadingButton(false);
  }

  const FuncRegularizao = async (idVagaVeiculo, index, pagamento) => {
    const requisicao = createAPI();

    requisicao
      .put("/notificacao/", {
        id_vaga_veiculo: idVagaVeiculo,
        tipoPagamento: pagamento,
      })
      .then((response) => {
        if (response.data.msg.resultado) {
          setLoadingButton(false);
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
          setLoadingButton(false);
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

  const startNotificao = async () => {
    const requisicao = createAPI();
    const idrequisicao = `{"where": [{ "field": "usuario", "operator": "=", "value": "${user2.id_usuario}" }]}`;
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
            monitor: item.monitor.nome,
            vaga: item.vaga,
            modelo: item.veiculo.modelo.nome,
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

  const startPlaca = async (placa) => {
    const requisicao = createAPI();
    const idrequisicao = `{"where": [{ "field": "placa", "operator": "=", "value": "${placa}" }]}`;
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
            monitor: item.monitor.nome,
            vaga: item.vaga,
            modelo: item.veiculo.modelo.nome,
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
    setTimeout(() => {
      localStorage.removeItem("placaCarro");
    }, 4000);
  };

  useEffect(() => {
    const requisicao = createAPI();

    requisicao
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
    if (
      localStorage.getItem("turno") !== "true" &&
      user2.perfil[0] === "monitor"
    ) {
      FuncTrocaComp("AbrirTurno");
    }
    const placa = localStorage.getItem("placaCarro");
    if (placa !== null && placa !== undefined && placa !== "") {
      startPlaca(placa);
    } else {
      startNotificao();
    }
  }, []);

  const handleConsultaSelected = (consulta) => {
    handleFiltro(consulta);
  };

  const handleFiltro = (consulta) => {
    setOnLoading(true);
    setEstado(false);
    setMensagem("");
    const requisicao = createAPI();
    const base64 = btoa(consulta);
    requisicao
      .get(`/notificacao/?query=${base64}`)
      .then((response) => {
        setOnLoading(false);
        if (response.data.msg.resultado) {
          setEstado(false);
          const newData = response.data.data.map((item) => ({
            data: ArrumaHora(item.data),
            id_notificacao: item.id_notificacao,
            id_vaga_veiculo: item.id_vaga_veiculo,
            tipo_notificacao: item.tipo_notificacao.nome,
            monitor: item.monitor.nome,
            vaga: item.vaga,
            modelo: item.veiculo.modelo.nome,
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

  return (
    <div className="col-12 px-3 mb-4">
      <p className="text-start fs-2 fw-bold mt-3">
        <VoltarComponente arrow={true} /> Notificações:
      </p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-7">
              <Filtro
                nome={"Irregularidades"}
                onConsultaSelected={handleConsultaSelected}
                onLoading={loading}
              />
            </div>
            <div className="col-3 text-end"></div>
            <div className="col-1 text-end">
              <IconReload
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

      {data.map((link, index) => (
        <div className="card border-0 shadow mt-2 mb-3" key={index}>
          <div
            className={link.pago === "S" ? "card-body10 mb-0 pb-0" : "card-body9"}
            onClick={() => link.pago === "S" ? atualiza(index) : null}
          >
            <div className="d-flex align-items-center justify-content-between">
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
                    className="h6 d-flex align-items-center fs-6 mb-0 pb-0"
                  >
                    {link.tipo_notificacao === "Ocupando vaga de deficiente" 
                    || link.tipo_notificacao === "Ocupando vaga de idoso" ? (
                      <h6>
                        {" "}
                        <FaClipboardList />‎{" "}
                        <small>Motivo: {link.tipo_notificacao}</small>
                      </h6>
                    ) : (
                      <h6>
                        {" "}
                        <FaClipboardList />‎ 
                        {window.innerWidth <= 360 ? 
                        <small>Motivo: {link.tipo_notificacao}</small>
                        :
                        `Motivo: ${link.tipo_notificacao}`}
                      </h6>
                    )}
                  </div>
                ) : (
                  <div className="h6 d-flex align-items-center fs-6 mb-0 pb-0">
                    {link.tipo_notificacao === "Ocupando vaga de deficiente" 
                    || link.tipo_notificacao === "Ocupando vaga de idoso" ? (
                      <h6>
                        {" "}
                        <FaClipboardList />‎{" "}
                        <small>Motivo: {link.tipo_notificacao}</small>
                      </h6>
                    ) : (
                      <h6>
                        {" "}
                        <FaClipboardList />‎ 
                        {window.innerWidth <= 360 ? 
                        <small>Motivo: {link.tipo_notificacao}</small>
                        :
                        `Motivo: ${link.tipo_notificacao}`}
                      </h6>
                    )}
                  </div>
                )}
               <div className="h6 d-flex align-items-center fs-6">
               <FaClipboardList />{" "} Status: {" "}
                  <h6 className={link.pago === "S" ? 'text-success mt-2 mx-1' : 'text-danger mt-2 mx-1' }>
                  {" "} {link.pago === "S" ? "Quitado" : "Pendente"}
                  </h6>
              </div>
              </div>
              <div>
                {link.pago === "N" ? (
                  <div className="d-flex align-items-center fw-bold mb-6">
                    <BiErrorCircle size={30} color="red" />
                  </div>
                ) : (
                  <div className="d-flex align-items-center fw-bold mb-6">
                    <AiFillCheckCircle size={30} color="green" />
                  </div>
                )}
              </div>
              
            </div>
            {link.pago === "N" ?
              <div className="row">
              <div className="col-12">
                  <Button
                    variant="outline"
                    color="red"
                    radius="md"
                    fullWidth
                    className="mt-2"
                    leftIcon={
                       link.estado ? <IconX size={20} /> :  <BsConeStriped size={20} />
                    }
                    onClick={() => {
                      atualiza(index);
                    }}
                  >
                    {link.estado ? "Fechar" : "Regularize aqui"}
                  </Button>
              </div>
              </div>
              : null }
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

              {link.pago === "S" ? null : (
                <div className="h6 mt-3 mx-5">
                  <select
                    className="form-select2 form-select-md mb-1 text-black"
                    id="pagamentos"
                    aria-label=".form-select-md"
                    defaultValue="credito"
                  >
                    <option value="pix">PIX</option>
                    <option value="credito">Saldo</option>
                  </select>
                  <div className="pt-3 gap-6 d-md-block">
                    <div className="row">
                      <div className="col-12">
                        <Button
                          type="submit"
                          loading={loadingButton}
                          variant="gradient"
                          gradient={{ from: "blue", to: "cyan" }}
                          fullWidth
                          onClick={() => {
                            regularizar(index);
                          }}
                        >
                          Pagar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ))}
      <div
        className="alert alert-danger mt-4"
        role="alert"
        style={{ display: estado ? "block" : "none" }}
      >
        {mensagem}
      </div>

      <VoltarComponente />

      <ModalErroBanco
          onOpen={onOpenError}
          onClose={onCloseError}
      />
      <ModalPix
        qrCode={data2.brcode}
        status={notification}
        mensagemPix={pixExpirado}
        onOpen={onOpen}
        onClose={onClose}
      />
    </div>
  );
};

export default Irregularidades;
