import React from "react";
import { useState, useEffect } from "react";

const RegistrarEstacionamentoParceiro = () => {
  const [placa, setPlaca] = useState("placa");
  const [textoPlaca, setTextoPlaca] = useState("");
  const [limite, setLimite] = useState(8);
  const [inputVazio, setInputVazio] = useState("inputvazio3");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [cont, setCont] = useState(0);
  const [teste, setTeste] = useState("");
  const [vaga, setVaga] = useState("");
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

  const handleRegistrar = () => {
    if (textoPlaca === "") {
      setMensagem("Preencha o campo placa");
      setEstado(true);
      setTimeout(() => {
        setEstado(false);
        setMensagem("");
      }, 3000);
    } 

    if (vaga === "") {
        setVaga(0);
    }

    if (textoPlaca !== "") {
        
    }
  };

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
    <div className="container">
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
              <div className="col-9 px-3 mt-4 pt-1">
                <h5 id="h5Placa">Placa estrangeira</h5>
              </div>
              <div className="col-3 px-3">
                <div className="form-check form-switch gap-2 d-md-block">
                  <input
                    className="form-check-input align-self-end"
                    type="checkbox"
                    role="switch"
                    onClick={handlePlaca}
                    id="flexSwitchCheckDefault"
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
            <div className="text-start mt-3 px-2">
              <h6>Número da vaga:</h6>
              <div className="input-group">
                <input
                  className="form-control"
                  type="number"
                  value={vaga}
                  onChange={(e) => setVaga([e.target.value])}
                  maxLength={limite}
                  placeholder="Exemplo: 0 "
                />
              </div>
            </div>
            <div className="text-start mt-3 mb-5 px-2">
              <h6>Selecione o tempo:</h6>
              <select
                className="form-select form-select-lg mb-3"
                aria-label=".form-select-lg example"
                id="tempos"
              >
                <option value="00:30:00">30 Minutos</option>
                <option value="01:00:00">60 Minutos</option>
                <option value="02:00:00">120 Minutos</option>
              </select>
            </div>
            <div className="mb-2 mt-3 gap-2 d-md-block">
              <button
                type="submit"
                onClick={() => {
                  handleRegistrar();
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegistrarEstacionamentoParceiro;
