import axios from 'axios';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useRef, useState } from 'react'
import VoltarComponente from '../util/VoltarComponente';
import ModalPix from './ModalPix';
import SidebarAvulso from './SidebarAvulso';

const EstacionamentoAvulso = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [placa, setPlaca] = useState("placa");
  const [textoPlaca, setTextoPlaca] = useState("");
  const [limite, setLimite] = useState(8);
  const [inputVazio, setInputVazio] = useState("inputvazio3");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tempo, setTempo] = useState("");
  const [valorCobranca, setValorCobranca] = useState(0);
  const [valorcobranca2, setValorCobranca2] = useState(0);
  const [user2, setUser2] = useState("");
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [txid, setTxId] = useState("");
  const [onOpen, setOnOpen] = useState(false);
  const [cont, setCont] = useState(0);
  const [teste, setTeste] = useState("");

  const param = async () => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
    });
    await requisicao
      .get("/parametros")
      .then((response) => {
        setValorCobranca(response.data.data.param.estacionamento.valorHora);
      })
      .catch(function (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("perfil");
      });
  };

  const ValidaFormato = () => {
    const clicado = document.getElementById("pagamentos").value;

    if (clicado === "pix") {
      
    } else {
      
    }
  };

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

  const atualiza = () => {
    const tempoo = document.getElementById("tempos").value;
    setTempo(tempoo);
    console.log(valorCobranca)
    if (tempoo === "02:00:00") {
      setValorCobranca2(valorCobranca * 2);
    } else if (tempoo === "01:00:00") {
      setValorCobranca2(valorCobranca);
    } else if (tempoo === "01:30:00"){
      setValorCobranca2(valorCobranca*1.5);
    }
    else if (tempoo === "00:30:00") {
      setValorCobranca2(valorCobranca / 2);
    } else if (tempoo === "00:10:00") {
      setValorCobranca2(valorCobranca * 0);
    } else {
      setValorCobranca2(valorCobranca * 0);
    }
  };

  const jae = () => {
    const sim = document.getElementById("flexSwitchCheckDefault").checked;
    console.log(sim);
    if (sim === true) {
      setLimite(10);
    } else {
      setLimite(8);
    }
  };

  useEffect(() => {
    param();
  }, []);

  useEffect(() => {
    const clicado = document.getElementById("flexSwitchCheckDefault").checked;
    if (clicado === false) {
      if (
        textoPlaca.at(4) === "1" ||
        textoPlaca.at(4) === "2" ||
        textoPlaca.at(4) === "3" ||
        textoPlaca.at(4) === "4" ||
        textoPlaca.at(4) === "5" ||
        textoPlaca.at(4) === "6" ||
        textoPlaca.at(4) === "7" ||
        textoPlaca.at(4) === "8" ||
        textoPlaca.at(4) === "9" ||
        textoPlaca.at(4) === "0"
      ) {
        setPlaca("placa3");
        if (cont === 0) {
          const fim = textoPlaca.substring(3, textoPlaca.length);
          const texto = textoPlaca.substring(0, 3);
          const traco = "-";
          setTextoPlaca(texto + traco + fim);
          setCont(cont + 1);
        } else {
          const fim = textoPlaca.substring(4, textoPlaca.length);
          const texto = textoPlaca.substring(0, 3);
          const traco = "-";
          setTextoPlaca(texto + traco + fim);
          setCont(cont + 1);
        }
      } else {
        setPlaca("placa");
        setCont(0);
      }
      setTeste(textoPlaca.replace("-", ""));
    }
  }, [textoPlaca]);

  return (
    <>
    <SidebarAvulso />
    <main className="content">
    <div className="container mb-4">
      <div
        className="row justify-content-center form-bg-image"
        data-background-lg="../../assets/img/illustrations/signin.svg"
      >
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="h6 mt-1 align-items-left text-start">
              Registrar estacionamento
            </div>
            <div className="row">
              <div className="col-9 px-3 mt-4 pt-2">
                <h6>Placa estrangeira/Outra</h6>
              </div>
              <div className="col-3 px-3">
                <div className="form-check form-switch gap-2 d-md-block">
                  <input
                    className="form-check-input align-self-end"
                    type="checkbox"
                    role="switch"
                    onClick={handlePlaca}
                    id="flexSwitchCheckDefault"
                    onChange={() => {
                      jae();
                    }}
                  />
                </div>
              </div>
            </div>
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
            <div
              className="text-start mt-3 mb-1 px-2"
              onChange={() => {
                atualiza();
              }}
            >
              <h6>Selecione o tempo:</h6>
              <select
                className="form-select form-select-lg mb-2"
                aria-label=".form-select-lg example"
                id="tempos"
                defaultValue="00:30:00"
              >
                {user2 === "monitor" ? (
                  <option value="00:10:00">Tolerância</option>
                ) : null}
                <option value="00:30:00">30 Minutos</option>
                <option value="01:00:00">60 Minutos</option>
                <option value="01:30:00">90 Minutos</option>
                <option value="02:00:00">120 Minutos</option>
              </select>
              <p id="tempoCusto" className="text-end">
                {" "}
                Valor a ser cobrado: R$ {valorcobranca2},00{" "}
              </p>
            </div>

            <div className="h6 mt-1 mb-4">
              <p className="text-start">Forma de pagamento:</p>
              <select
                className="form-select form-select-lg mb-3"
                defaultValue="dinheiro"
                aria-label=".form-select-lg example"
                id="pagamentos"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                {user2 === "monitor" ? (
                  <option value="parkimetro">Parkimetro</option>
                ) : null}
              </select>
            </div>

            <div className="mb-2 mt-3 gap-2 d-md-block">
              <VoltarComponente />
              <button
                type="submit"
                onClick={() => {
                  ValidaFormato();
                }}
                className="btn3 botao"
              >
                Registrar
              </button>
            </div>
            <div
              className="alert alert-danger mt-4"
              role="alert"
              style={{ display: estado ? "block" : "none" }}
            >
              {mensagem}
            </div>
            <div
              className="alert alert-success mt-4"
              role="alert"
              style={{ display: success ? "block" : "none" }}
            >
              {mensagem}
            </div>
          </div>
        </div>
      </div>
      <ModalPix qrCode={data.brcode} status={notification} mensagemPix={pixExpirado} onOpen={onOpen} />
    </div>
    </main>
    </>
  )
}

export default EstacionamentoAvulso