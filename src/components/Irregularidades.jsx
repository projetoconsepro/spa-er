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
import { ArrumaHora } from "../util/ArrumaHora";
import { verificaValidadeInfracao } from "../util/verificaValidadeInfracao";
import { Modal } from "@mantine/core";

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
  const [validacoes, setValidacoes] = useState({});
  const [infoPendencias, setInfoPendencias] = useState({ placa: '', total: '', quantidade: 0 });
  const [modalPendencias, setModalPendencias] = useState(false);
  const [indexInfo, setindexInfo] = useState("");

  const atualiza = (index) => {
    data[index].estado = !data[index].estado;
    setData([...data]);
  };
const handlePagar = (index) => {
  const placa = data[index].placa;
  const pendentes = data.filter(
    (item) =>
      item.placa === placa &&
      item.pago === "N" &&
      !(item.infracao === 'S' && validacoes[item.id_notificacao] === false)
  );

  if (pendentes.length > 1) {
     const total = pendentes.reduce(
      (acc, item) => acc + parseFloat(item.valor.toString().replace(",", ".")),
      0
    );
    setInfoPendencias({
      placa,
      total: total.toFixed(2).replace(".", ","),
      quantidade: pendentes.length,
      ids: pendentes.map(item => item.id_vaga_veiculo)
    });
    data[index].total = total;
    setModalPendencias(true);
  }else{
    data[index].total = data[index].valor;
    regularizar(index);
  }
  

  
  setindexInfo(index);
};

const regularizar = async (index) => {
  setLoadingButton(true);
  const select = document.getElementById("pagamentos").value;
  
  const idsParaRegularizar = infoPendencias.ids || [data[index].id_vaga_veiculo];
  
  const validacoesResult = {};
  for (const id of idsParaRegularizar) {
    const item = data.find(d => d.id_vaga_veiculo === id);
    if (item.infracao === 'S') {
      validacoesResult[id] = await verificaValidadeInfracao(item.data_infracao);
      if (validacoesResult[id] === false) {
        setLoadingButton(false);
        return;
      }
    }
  }

  if (select === "credito") {
      let numeroCorrigido = saldoCredito.replace(".", "");
      numeroCorrigido = parseFloat(numeroCorrigido.replace(",", "."));
      if (parseFloat(numeroCorrigido) < parseFloat(data[index].total)) {

      setLoadingButton(false);
      Swal.fire({
        icon: "error",
        title: "Saldo insuficiente",
        footer: '<a href="">Clique aqui para adicionar crédito.</a>',
      });
      return;
    }
    
    for (const id of idsParaRegularizar) {
      await FuncRegularizao(id, null, select); 
    }
    
    const newData = data.map(item => {
      if (idsParaRegularizar.includes(item.id_vaga_veiculo)) {
        return {...item, pago: "S"};
      }
      return item;
    });
    setData(newData);
    
    setLoadingButton(false);
    setModalPendencias(false);
    Swal.fire({
      title: "Regularizado!",
      text: `Todas as ${idsParaRegularizar.length} notificações foram regularizadas.`,
      icon: "success",
      timer: 2000,
    });
    setModalPendencias(false);
  } else {
    const valor = infoPendencias.total 
      ? infoPendencias.total.replace(",", ".")
      : data[index].total.toString().replace(",", ".");
    
    const valor2 = parseFloat(valor).toFixed(2);
    const requisicao = createAPI();


    requisicao
      .post("/gerarcobranca", {
        valor: valor2,
        campo: JSON.stringify(idsParaRegularizar),
      })
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          setData2(resposta.data.data);
          getInfoPix(resposta.data.data.txid, idsParaRegularizar);
          open();
          setOnOpen(true);
        }
      })
      .catch((err) => {
        setLoadingButton(false);
        setOnOpenError(true);
      });
  }
};

async function getInfoPix(TxId, idsParaRegularizar) {
  const requisicao = createAPI();
  await requisicao
    .post(`/notificacao/verificar/pix`, {
        txid: TxId ? TxId : "",
        notificacoes: idsParaRegularizar,
        formaPagamento: "pix"
    })
    .then((response) => {
      if (response.data.msg.resultado) {
        setLoadingButton(false);
        setOnOpen(false);
        setModalPendencias(false);
        Swal.fire({
          title: "Regularizado!",
          text: `Todas as ${idsParaRegularizar.length} notificações foram regularizadas.`,
          icon: "success",
          timer: 2000,
        });
        
        const newData = data.map(item => {
          if (idsParaRegularizar.includes(item.id_vaga_veiculo)) {
            return {...item, pago: "S"};
          }
          return item;
        });
        setData(newData);
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


  const onClose = () => {
    setLoadingButton(false);
  };

 const FuncRegularizao = async (idVagaVeiculo, index, pagamento) => {
  const requisicao = createAPI();

  requisicao
    .put("/notificacao/", {
      id_vaga_veiculo: idVagaVeiculo,
      tipoPagamento: pagamento,
    })
    .then((response) => {
      if (response.data.msg.resultado) {
        SaldoCredito();
        if (index !== null) {
          setLoadingButton(false);
          data[index].pago = "S";
          setData([...data]);
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
            data_infracao: item.data_infracao,
            infracao: item.infracao
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
            data_infracao: item.data_infracao,
            infracao: item.infracao
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

  const SaldoCredito = () => {
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
  }

  useEffect(() => {
    SaldoCredito();
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
            data_infracao: item.data_infracao,
            infracao: item.infracao
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
  
  useEffect(() => {
    const verificarInfracoes = async () => {
      const resultados = {};
      for (const item of data) {
        resultados[item.id_notificacao] = item.infracao === 'S'
          ? await verificaValidadeInfracao(item.data_infracao)
          : null;
      }
      setValidacoes(resultados);
    };

    if (data.length > 0) {
      verificarInfracoes();
    }
  }, [data]);

  return (
    <div className="col-12 px-3 mb-4">
      <Modal
        opened={modalPendencias}
        onClose={() => setModalPendencias(false)}
        title="Pendências na Placa"
        centered
      >
       <div>
  <p>
    A placa <b>{infoPendencias.placa}</b> possui <b>{infoPendencias.quantidade}</b> notificações de estacionamento pendentes.<br />
    Para realizar a regularização, é necessário quitar todas as pendências desta placa de forma conjunta.
  </p>
  <p>
    <b>Valor total:</b> R$ {infoPendencias.total}
  </p>
  <Button fullWidth onClick={() => regularizar(indexInfo)} mt={10}>
    Regularizar
  </Button>
</div>

      </Modal>
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
            <div className="col-2 text-end"></div>
            <div className="col-2 text-end">
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "blue", deg: 60 }}
                radius="md"
                size="sm"
                onClick={() => startNotificao()}
              >
                <IconReload color="white" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {data.map((link, index) => (
        <div className="card border-0 shadow mt-2 mb-0" key={index}>
          <div
            className={
              link.pago === "S" && link.estado === false
                ? "card-body10 pb-0 mb-4"
                : link.pago === "S" && link.estado === true
                  ? "card-body10 pb-0 mb-3"
                  : link.estado && link.infracao === 'S' && !validacoes[link.id_notificacao] === true
                    ? "card-body13 mb-3"
                    : "card-body9 mb-3"
            }
            onClick={() => (link.pago === "S" ? atualiza(index) : null)}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>

                <div className="d-flex flex-column gap-2">

                  <div className="h2 d-flex align-items-center">
                    {link.placa}
                  </div>

                  <div className="h6 d-flex align-items-center">
                    <BsCalendarDate className="me-2" />
                    {link.data}
                  </div>

                  <div className="h6 d-flex align-items-center fs-6">
                    <FaClipboardList className="me-2 flex-shrink-0" />
                    <span
                      className={`
        ${!link.estado ? "text-truncate d-block" : ""} 
        ${window.innerWidth <= 360 ? "w-auto" : ""}
      `}
                      style={{
                        maxWidth: '220px',
                        fontSize:
                          link.tipo_notificacao.includes("deficiente") || link.tipo_notificacao.includes("idoso") || link.tipo_notificacao.includes("excedido")
                            ? (link.estado ? '0.85rem' : '1rem')
                            : '1rem'
                      }}
                    >
                      Motivo: {link.tipo_notificacao}
                    </span>
                  </div>
                  <div className="h6 d-flex align-items-center">
                    <FaClipboardList className="me-2 align-self-start" style={{ marginTop: "2px" }} />
                    <span>
                      Status:{" "}
                      <span className={link.pago === "S" ? "text-success mx-1" : "text-danger mx-1"}>
                        {link.pago === "S" ? "Quitado" : "Pendente"}
                      </span>
                    </span>
                  </div>
                </div>
                {link.estado && link.infracao === 'S' && validacoes[link.id_notificacao] === false && (
                  <>
                    <div className="d-flex flex-column gap-2 mt-2 mb-3">
                      <div className="h6 d-flex align-items-center">
                        <FaParking className="me-2" />
                        <span>Vaga: {link.vaga}</span>
                      </div>
                      <div className="h6 d-flex align-items-center">
                        <FaCarAlt className="me-2" />
                        <span>Modelo: {link.modelo}</span>
                      </div>
                      <div className="h6 d-flex align-items-center">
                        <BsCashCoin className="me-2" />
                        <span>Valor: R${link.valor}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div>
                {link.pago === "N" ? (
                  <BiErrorCircle size={30} color="red" />
                ) : (
                  <AiFillCheckCircle size={30} color="green" />
                )}
              </div>
            </div>

            {link.estado && link.pago !== "S" && link.infracao === 'S' && validacoes[link.id_notificacao] === false && (
              <div className="alert alert-warning mb-2" style={{ width: 'calc(100%)' }}>
                <div className="text-start">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <span>Esta notificação gerou infração e excedeu o prazo de regularização</span>
                </div>
              </div>
            )}

            {link.pago === "N" && (
              <div className="row mt-3">
                <div className="col-12">
                  <Button
                    variant="outline"
                    color="red"
                    radius="md"
                    fullWidth
                    leftIcon={
                      link.estado ? (
                        <IconX size={20} />
                      ) : (
                        <BsConeStriped size={20} />
                      )
                    }
                    onClick={() => atualiza(index)}
                  >
                    {link.estado
                      ? "Fechar"
                      : !link.estado && link.infracao === 'S' && validacoes[link.id_notificacao] === false
                        ? "Abrir"
                        : "Regularize aqui"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {link.estado && !(link.infracao === 'S' && validacoes[link.id_notificacao] === false) && (
            <div className="pb-3 mb-1">
              <div className="d-flex flex-column gap-2 px-4">
                <div className="h6 d-flex align-items-center">
                  <FaParking className="me-2" />
                  <span>Vaga: {link.vaga}</span>
                </div>
                <div className="h6 d-flex align-items-center">
                  <FaCarAlt className="me-2" />
                  <span>Modelo: {link.modelo}</span>
                </div>
                <div className="h6 d-flex align-items-center">
                  <BsCashCoin className="me-2" />
                  <span>Valor: R${link.valor}</span>
                </div>
              </div>

              {link.pago === "S" ? null : (
                (link.infracao !== "S" || validacoes[link.id_notificacao] !== false) && (
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
                    <div className="pt-2 gap-6 d-md-block">
                      <div className="row">
                        <div className="col-12">
                          <Button
                            type="submit"
                            loading={loadingButton}
                            variant="gradient"
                            gradient={{ from: "blue", to: "cyan" }}
                            fullWidth
                            onClick={() => {
                              handlePagar(index);
                            }}
                          >
                            Pagar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
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

      <ModalErroBanco onOpen={onOpenError} onClose={onCloseError} />
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