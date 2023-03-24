import axios from "axios";
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
  const [success, setSuccess] = useState(false);
  const [vaga, setVaga] = useState("");
  const [tempo, setTempo] = useState("");
  const [valorCobranca, setValorCobranca] = useState(0);
  const [valorcobranca2, setValorCobranca2] = useState(0);
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const user2 = JSON.parse(user);


  const param = async () => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
    })
    await requisicao.get('/parametros').then(
        response => {
            setValorCobranca(response.data.data.param.estacionamento.valorHora)
        }
    ).catch(function (error) {
      localStorage.clear();
    });
}

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

  const handleRegistrar = async () => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
          'token': token,
          'id_usuario': user2.id_usuario,
          'perfil_usuario': 'parceiro'
      }
    })

    if (vaga === "") {
      setVaga(0);
    }

    if (textoPlaca === "" || textoPlaca.length < 7) {
      setMensagem("Preencha o campo placa");
      setEstado(true);
      setTimeout(() => {
        setEstado(false);
        setMensagem("");
      }, 3000);
    } 


    if (textoPlaca.length >= 7) {
      const tirarTraco = textoPlaca.split("-").join("");
      const placaMaiuscula = tirarTraco.toUpperCase();
      const vagaa = []
      vagaa[0] = vaga;
      await requisicao.get(`/veiculo/${placaMaiuscula}`).then(
          response => {
            console.log('b', response)
            if(response.data.msg.msg === "Dados encontrados"){
              if (response.data.data[0].estacionado[0].estacionado === "S") {
                requisicao.post('/estacionamento', {
                  placa: placaMaiuscula,
                  numero_vaga: vagaa,
                  tempo: tempo,
                  pagamento: "credito",
                  id_vaga_veiculo: response.data.data[0].estacionado[0].id_vaga_veiculo
                }).then(
                  response => {
                    console.log('a', response)
                    if(response.data.msg.resultado){
                      setVaga("");
                      setTextoPlaca("");
                      setMensagem("Estacionamento registrado com sucesso");
                      setSuccess(true);
                      setTimeout(() => {
                        setSuccess(false);
                        setMensagem("");
                      }, 3000);
                    }
                    else{
                      setMensagem("Erro ao registrar estacionamento");
                      setEstado(true);
                      setTimeout(() => {
                        setEstado(false);
                        setMensagem("");
                      }, 3000);
                    }
                }
                ).catch(function (error) {
                  localStorage.clear();
                }
              );

                  
              }else {
                  requisicao.post('/estacionamento', {
                  placa: placaMaiuscula,
                  numero_vaga: vagaa,
                  tempo: tempo,
                  pagamento: "dinheiro"
                }).then(
                    response => {
                      console.log(response)
                      if (response.data.msg.resultado) {
                        setMensagem("Estacionamento registrado com sucesso");
                        setSuccess(true);
                        setVaga("");
                        setTextoPlaca("");
                        setTimeout(() => {
                          setSuccess(false);
                          setMensagem("");
                        }, 3000);
                      } else {
                        setMensagem("Erro ao registrar estacionamento");
                        setEstado(true);
                        setTimeout(() => {
                          setEstado(false);
                          setMensagem("");
                        }, 3000);
                      }
                    }
                ).catch(function (error) {
                  localStorage.clear();
                }
              );
              }
            } else{
                requisicao.post('/estacionamento', {
                placa: placaMaiuscula,
                numero_vaga: vagaa,
                tempo: tempo,
                pagamento: "dinheiro"
              }).then(
                  response => {
                    console.log(response)
                    if (response.data.msg.resultado) {
                      setMensagem("Estacionamento registrado com sucesso");
                      setSuccess(true);
                      setVaga("");
                      setTextoPlaca("");
                      setTimeout(() => {
                        setSuccess(false);
                        setMensagem("");
                      }, 3000);
                    } else {
                      setMensagem("Erro ao registrar estacionamento");
                      setEstado(true);
                      setTimeout(() => {
                        setEstado(false);
                        setMensagem("");
                      }, 3000);
                    }
                  }
              ).catch(function (error) {
                localStorage.clear();
              }
            );
            }
          }
      ).catch(function (error) {
        localStorage.clear();
      }
      );
    }else{
      console.log('sim')
    }
  };

  const atualiza = () => {
    const tempoo = document.getElementById('tempos').value;
        setTempo(tempoo);

        if(tempoo === "02:00:00"){
            setValorCobranca2(valorCobranca*2);
        }
        else if(tempoo === "01:00:00"){
            setValorCobranca2(valorCobranca);
        }
        else if(tempoo === "00:30:00"){
            setValorCobranca2(valorCobranca/2);
        }
        else if(tempoo === "00:10:00"){
            setValorCobranca2(valorCobranca*0);
        }
}

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

  useEffect(() => {
    param();
    setValorCobranca2(1);
    setTempo("00:30:00");
  }, []);

  const jae = () => {
    const sim = document.getElementById("flexSwitchCheckDefault").checked
    console.log(sim)
    if (sim === true) {
        setLimite(10);
    }
    else{
        setLimite(8);
    }
}

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
              <div className="col-9 px-3 mt-4 pt-2">
                <h6 >Placa estrangeira/Outra</h6>
              </div>
              <div className="col-3 px-3">
                <div className="form-check form-switch gap-2 d-md-block">
                  <input
                    className="form-check-input align-self-end"
                    type="checkbox"
                    role="switch"
                    onClick={handlePlaca}
                    id="flexSwitchCheckDefault"
                    onChange={() => {jae()}}
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
            <div className="text-start mt-3 mb-5 px-2" onChange={() => {atualiza()}}>
              <h6>Selecione o tempo:</h6>
              <select
                className="form-select form-select-lg mb-2"
                aria-label=".form-select-lg example"
                id="tempos"
              >
                <option value="00:30:00">30 Minutos</option>
                <option value="01:00:00">60 Minutos</option>
                <option value="02:00:00">120 Minutos</option>
                </select>
                <p id="tempoCusto" className="text-end"> Valor a ser cobrado: R$ {valorcobranca2},00 </p>
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
    </div>
  );
};
export default RegistrarEstacionamentoParceiro;
