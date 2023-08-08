import axios from "axios";
import { React, useState, useEffect, useRef } from "react";
import { FaUserInjured, FaWheelchair } from "react-icons/fa";
import Swal from "sweetalert2";
import "../pages/Style/styles.css";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { useDisclosure } from "@mantine/hooks";
import ModalPix from "./ModalPix";
import { Button, Divider, Loader } from "@mantine/core";
import ImpressaoTicketEstacionamento from "../util/ImpressaoTicketEstacionamento";
import { Elderly } from "@mui/icons-material";
import createAPI from "../services/createAPI";

const RegistrarVagaMonitor = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const socketRef = useRef(null);
  const [mensagem, setMensagem] = useState("");
  const [placa, setPlaca] = useState("placa");
  const [textoPlaca, setTextoPlaca] = useState("");
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [placaVeiculo, setPlacaVeiculo] = useState("");
  const [tempo, setTempo] = useState("00:10:00");
  const [valor, setValor] = useState("dinheiro");
  const [inputVazio, setInputVazio] = useState("inputvazio3");
  const [mostrapag, SetMostrapag] = useState(false);
  const [valorCobranca, setValorCobranca] = useState(0);
  const [valorcobranca2, setValorCobranca2] = useState(0);
  const [vaga, setVaga] = useState("");
  const [cont, setCont] = useState(0);
  const [InputPlaca, setInputPlaca] = useState(" form-control fs-5");
  const [visible, setVisible] = useState(false);
  const [limite, setLimite] = useState(8);
  const [tipoVaga, setTipoVaga] = useState("");
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [txid, setTxId] = useState("");
  const [onOpen, setOnOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);

  const fazerPix = () => {
    const placaString = textoPlaca.toString();
    const placaMaiuscula = placaString.toUpperCase();
    const tirarTraco = placaMaiuscula.split("-").join("");
    const vagaa = [];
    vagaa[0] = localStorage.getItem("vaga");
    if (tirarTraco === "") {
      setInputPlaca("form-control fs-5 is-invalid");
      setEstado(true);
      setMensagem("Preencha o campo placa");
      setTimeout(() => {
        setInputPlaca("form-control fs-5");
        setEstado(false);
        setMensagem("");
      }, 4000);
      return;
    }
    const sim = document.getElementById("flexSwitchCheckDefault").checked;
    if (!sim) {
      if (!validarPlaca(tirarTraco)) {
        setInputPlaca("form-control fs-5 is-invalid");
        setEstado(true);
        setMensagem("Placa inválida");
        setTimeout(() => {
          setInputPlaca("form-control fs-5");
          setEstado(false);
          setMensagem("");
        }, 4000);
        return;
      }
    }
    const valor = valorcobranca2.toString();
    const valor2 = parseFloat(valor.replace(",", ".")).toFixed(2);
    console.log(valor2);
    const requisicao = createAPI();

    let campo = "";

    if (localStorage.getItem("popup") == "true") {
      const idvaga = localStorage.getItem("id_vagaveiculo");
      campo = {
        placa: tirarTraco,
        numero_vaga: vagaa,
        tempo: tempo,
        pagamento: "pix",
        id_vaga_veiculo: idvaga,
      };
    } else {
      campo = {
        placa: tirarTraco,
        numero_vaga: vagaa,
        tempo: tempo,
        pagamento: "pix",
      };
    }
    requisicao
      .post("/gerarcobranca", {
        valor: valor2,
        campo: JSON.stringify(campo),
      })
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          setData(resposta.data.data);
          setTxId(resposta.data.data.txid);
          getInfoPix(resposta.data.data.txid);
          setOnOpen(true);
          open();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  async function getInfoPix(TxId) {
    const requisicao = createAPI();

    const tirarTraco = textoPlaca.split("-").join("");
    const placaMaiuscula = tirarTraco.toUpperCase();

    await requisicao.post(`/estacionamento/pix`, {
        txid: TxId,
      })
      .then((response) => {
        setLoadingButton(false);
        if (response.data.msg.resultado === true) {
          if (response.data.msg.msg !== "Vaga atualizada com sucesso"){
          ImpressaoTicketEstacionamento(
            'PRIMEIRA',
            response.data.data.chegada,
            response.data.data.tempo,
            response.config.headers.id_usuario,
            response.data.data.numero_vagas[0],
            placaMaiuscula,
            "PIX",
            tempo,
            response.data.data.notificacao_pendente
          );
          }
          localStorage.removeItem("vaga");
          localStorage.removeItem("popup");
          localStorage.removeItem("id_vagaveiculo");

          if (user2.perfil[0] === "monitor") {
            FuncTrocaComp("ListarVagasMonitor");
          } else if (user2.perfil[0] === "admin") {
            FuncTrocaComp("Dashboard");
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

  const onClose = () => {
    setLoadingButton(false);
  }
  
  const parametros = axios.create({
    baseURL: process.env.REACT_APP_HOST,
  });

  const registrarEstacionamento = (campo) => {
    const estacionamento = createAPI();
    const placaString = textoPlaca.toString();
    const placaMaiuscula = placaString.toUpperCase();
    const tirarTraco = placaMaiuscula.split("-").join("");
    const vagaa = [];
    vagaa[0] = localStorage.getItem("vaga");
    if (tirarTraco === "") {
      setLoadingButton(false);
      setInputPlaca("form-control fs-5 is-invalid");
      setEstado(true);
      setMensagem("Preencha o campo placa");
      setTimeout(() => {
        setInputPlaca("form-control fs-5");
        setEstado(false);
        setMensagem("");
      }, 4000);
      return;
    }
    const sim = document.getElementById("flexSwitchCheckDefault").checked;
    if (!sim) {
      if (!validarPlaca(tirarTraco)) {
        setLoadingButton(false);
        setInputPlaca("form-control fs-5 is-invalid");
        setEstado(true);
        setMensagem("Placa inválida");
        setTimeout(() => {
          setInputPlaca("form-control fs-5");
          setEstado(false);
          setMensagem("");
        }, 4000);
        return;
      }
    }

    if (localStorage.getItem("popup") == "true") {
      const idvaga = localStorage.getItem("id_vagaveiculo");
      estacionamento.post("/estacionamento", {
          placa: tirarTraco,
          numero_vaga: vagaa,
          tempo: tempo,
          pagamento: valor,
          id_vaga_veiculo: idvaga,
        })
        .then((response) => {
          console.log(response)
          if (response.data.msg.resultado === true) {
            setLoadingButton(false);
            if (response.data.msg.msg !== "Vaga atualizada com sucesso"){
            ImpressaoTicketEstacionamento(
              'PRIMEIRA',
              response.data.data.chegada,
              response.data.data.tempo,
              response.config.headers.id_usuario,
              vagaa,
              tirarTraco,
              valor,
              tempo,
              response.data.data.notificacao_pendente
            );
            }
 
            localStorage.removeItem("vaga");
            localStorage.removeItem("popup");
            localStorage.removeItem("id_vagaveiculo");

            if (user2.perfil[0] === "monitor") {
              FuncTrocaComp("ListarVagasMonitor");
            } else if (user2.perfil[0] === "admin") {
              FuncTrocaComp("Dashboard");
            }
          } else {
            setLoadingButton(false);
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
    } else {
      estacionamento.post("/estacionamento", {
          placa: tirarTraco,
          numero_vaga: vagaa,
          tempo: tempo,
          pagamento: valor,
        })
        .then((response) => {
          console.log(response)
          if (response.data.msg.resultado === true) {
            setLoadingButton(false);
            if (response.data.msg.msg !== "Vaga atualizada com sucesso"){
            ImpressaoTicketEstacionamento(
              'PRIMEIRA',
              response.data.data.chegada,
              response.data.data.tempo,
              response.config.headers.id_usuario,
              vagaa,
              tirarTraco,
              valor,
              tempo,
              response.data.data.notificacao_pendente
            );
            }
            localStorage.removeItem("vaga");

            if (user2.perfil[0] === "monitor") {
              FuncTrocaComp("ListarVagasMonitor");
            } else if (user2.perfil[0] === "admin") {
              FuncTrocaComp("Dashboard");
            }
          } else {
            setLoadingButton(false);
            setEstado(true);
            setMensagem(response.data.msg.msg);
            setTimeout(() => {
              setEstado(false);
              setMensagem("");
            }, 4000);
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

  useEffect(() => {
    const clicado = document.getElementById("flexSwitchCheckDefault").checked;
    if (clicado === false) {
      if (
        textoPlaca[4] === "1" ||
        textoPlaca[4] === "2" ||
        textoPlaca[4] === "3" ||
        textoPlaca[4] === "4" ||
        textoPlaca[4] === "5" ||
        textoPlaca[4] === "6" ||
        textoPlaca[4] === "7" ||
        textoPlaca[4] === "8" ||
        textoPlaca[4] === "9" ||
        textoPlaca[4] === "0"
      ) {
        setPlaca("placa3");
      } else {
        setPlaca("placa");
        setCont(0);
      }
    }
  }, [textoPlaca]);

  const handlePlaca = () => {
    const clicado = document.getElementById("flexSwitchCheckDefault").checked;
    if (clicado === true) {
      setPlaca("placa2");
      setLimite(100);
      setInputVazio("inputvazio2");
    } else {
      setPlaca("placa");
      setLimite(8);
      setInputVazio("inputvazio3");
    }
  };

  const param = async () => {
    await parametros
      .get("/parametros")
      .then((response) => {
        console.log(response);
        setValorCobranca(response.data.data.param.estacionamento.valorHora);
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

    setVaga(localStorage.getItem("vaga"));
  };

  const atualizafunc = () => {
    const tempoo = document.getElementById("tempos").value;
    const valorr = document.getElementById("pagamentos").value;
    setTempo(tempoo);
    setValor(valorr);
    if (tempoo === "00:10:00") {
      SetMostrapag(false);
      setValor("");
    } else if (tempoo === "notificacao"){
      SetMostrapag(false);
      setValor("");
    } 
    else {
      SetMostrapag(true);
    }

    if (tempoo === "02:00:00") {
      setValorCobranca2(valorCobranca * 2);
    } else if (tempoo === "01:00:00") {
      setValorCobranca2(valorCobranca);
    } else if (tempoo === "00:30:00") {
      setValorCobranca2(valorCobranca / 2);
    } else if (tempoo === "01:30:00") {
      setValorCobranca2(valorCobranca * 1.5);
    } else if (tempoo === "00:10:00") {
      setValorCobranca2(valorCobranca * 0);
    } else {
      if (textoPlaca !== "") {
        const placaString = textoPlaca.toString();
        const placaMaiuscula = placaString.toUpperCase();
        localStorage.setItem("placa", `${placaMaiuscula}`);
        FuncTrocaComp("Notificacao");
      } else {
        setEstado(true);
        setMensagem("Preencha o campo placa");
        setTimeout(() => {
          setEstado(false);
          setMensagem("");
        }, 4000);
      }
    }
  };

  const HangleBack = () => {
    localStorage.removeItem("vaga");
    localStorage.removeItem("popup");
    localStorage.removeItem("id_vagaveiculo");
  };

  function validarPlaca(placa) {
    const regexPlacaAntiga = /^[a-zA-Z]{3}\d{4}$/;
    const regexPlacaNova =
      /^([A-Z]{3}[0-9][A-Z0-9][0-9]{2})|([A-Z]{4}[0-9]{2})$/;

    if (regexPlacaAntiga.test(placa) || regexPlacaNova.test(placa)) {
      return true;
    } else {
      return false;
    }
  }

  const handleSubmit = async () => {
    setLoadingButton(true);
    let select = document.getElementById("pagamentos").value;
    const tolerancia = document.getElementById("tempos").value;

    if (tolerancia === "notificacao" && textoPlaca !== ""){
      const placaString = textoPlaca.toString();
      const placaMaiuscula = placaString.toUpperCase();
      localStorage.setItem("placa", `${placaMaiuscula}`);
      FuncTrocaComp("Notificacao");
    } else if (tolerancia === "notificacao" && textoPlaca === ""){
      setLoadingButton(false);
    }

    if (tolerancia === '00:10:00'){
      registrarEstacionamento();
    }
    else if (select === "pix") {
      fazerPix();
    } else {
      registrarEstacionamento();
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("turno") !== "true" &&
      user2.perfil[0] === "monitor"
    ) {
      FuncTrocaComp("FecharTurno");
    }
    setTipoVaga(localStorage.getItem("tipoVaga"));
    param();
    if (localStorage.getItem("popup") == "true") {
      setTextoPlaca(localStorage.getItem("placa"));
      setVisible(true);
      setValorCobranca2(1);
      SetMostrapag(true);
      setValor("dinheiro");
      setTempo("00:30:00");
    } else {
      setVisible(false);
    }
  }, []);

  return (
    <section className="vh-lg-100 mt-2 mt-lg-0 bg-soft d-flex align-items-center">
      <div className="container">
        <div
          className="row justify-content-center form-bg-image"
          data-background-lg="../../assets/img/illustrations/signin.svg"
        >
          <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
              {tipoVaga === "cadeirante" ? (
                <p className="text-start">
                  <FaWheelchair size={20} />
                </p>
              ) : null}
              {tipoVaga === "idoso" ? (
                <p className="text-start">
                  <Elderly size={20} />
                </p>
              ) : null}
              <div className="h5 mt-2 align-items-center">
                <small>Registrar estacionamento</small>
                <p id="tempoCusto" className=" pt-2">
                  {" "}
                  Vaga selecionada: {vaga}{" "}
                </p>
              </div>
              <Divider my="sm" size="md" variant="dashed" />
              <div className="row">
                <div className="col-9 px-3 pt-1">
                  <h6>Placa estrangeira / Outro</h6>
                </div>
                <div className="col-3 px-3">
                  <div className="form-check3 form-switch gap-2 d-md-block">
                    <input
                      className="form-check-input align-self-end"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                      onChange={() => {
                        handlePlaca();
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group mb-4">
                <div className="pt-1 mt-md-0 w-100 p-3" id={placa}>
                  <input
                    type="text"
                    id={inputVazio}
                    className="mt-5 fs-1 justify-content-center align-items-center text-align-center"
                    value={textoPlaca}
                    onChange={(e) => setTextoPlaca(e.target.value)}
                    maxLength={limite}
                  />
                </div>
                <Divider my="sm" size="md" variant="dashed" />
              </div>

              <div className="h6 mt-3 " onChange={atualizafunc}>
                <p className="text-start">Determine um tempo:</p>
                {visible ? (
                  <select
                    className="form-select form-select-lg mb-3"
                    aria-label=".form-select-lg example"
                    id="tempos"
                  >
                    <option value="00:30:00">30 Minutos</option>
                    <option value="01:00:00">60 Minutos</option>
                    <option value="01:30:00">90 Minutos</option>
                    <option value="02:00:00">120 Minutos</option>
                  </select>
                ) : (
                  <select
                    className="form-select form-select-lg mb-3"
                    defaultValue="00:10:00"
                    aria-label=".form-select-lg example"
                    id="tempos"
                  >
                    <option value="00:10:00">Tolerância</option>
                    {tipoVaga === "cadeirante" ||
                    tipoVaga === "idoso" ? null : (
                      <option value="00:30:00">30 Minutos</option>
                    )}
                    {tipoVaga === "cadeirante" ||
                    tipoVaga === "idoso" ? null : (
                      <option value="01:00:00">60 Minutos</option>
                    )}
                    {tipoVaga === "cadeirante" ||
                    tipoVaga === "idoso" ? null : (
                      <option value="01:30:00">90 Minutos</option>
                    )}
                    {tipoVaga === "cadeirante" ||
                    tipoVaga === "idoso" ? null : (
                      <option value="02:00:00">120 Minutos</option>
                    )}
                    <option value="notificacao">Notificação</option>
                  </select>
                )}
                <p id="tempoCusto" className="text-end">
                  {" "}
                  Valor a ser cobrado: R$ {valorcobranca2}{" "}
                </p>
              </div>

              <div
                className="h6 mt-3 "
                style={{ display: mostrapag ? "block" : "none" }}
                onChange={atualizafunc}
              >
                <p className="text-start">Forma de pagamento:</p>
                <select
                  className="form-select form-select-lg mb-3"
                  aria-label=".form-select-lg example"
                  id="pagamentos"
                >
                  <option value="pix">PIX</option>
                  <option value="dinheiro">Dinheiro</option>
                </select>
              </div>

              <div className="pt-4 mb-4 gap-2 d-md-block">
                <VoltarComponente space={true} onClick={() => HangleBack()} />
                <Button
                  loading={loadingButton}
                  onClick={handleSubmit}
                  size="md"
                  radius="md"
                  className="bg-blue-50"
                >
                  Confirmar
                </Button>
              </div>
              <div
                className="alert alert-danger mt-3"
                role="alert"
                style={{ display: estado ? "block" : "none" }}
              >
                {mensagem}
              </div>
            </div>
          </div>
        </div>
        <ModalPix
          qrCode={data.brcode}
          status={notification}
          mensagemPix={pixExpirado}
          onOpen={onOpen}
          onClose={onClose}
        />
      </div>
    </section>
  );
};

export default RegistrarVagaMonitor;
