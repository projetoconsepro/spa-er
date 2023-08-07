import axios from "axios";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { React, useState, useEffect } from "react";
import { IconCash } from "@tabler/icons-react";
import { Input } from "@mantine/core";
import createAPI from "../services/createAPI";
import Swal from "sweetalert2";
import ImpressaoFecharCaixa from "../util/ImpressaoFecharCaixa";

const AbrirTurno = () => {
  const [valor, setValor] = useState('');
  const [estado, setEstado] = useState(true);
  const [estado2, setEstado2] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [abTurno, setAbTurno] = useState(false);
  const [setorSelecionado, setSetorSelecionado] = useState(1);
  const [setorSelecionado2, setSetorSelecionado2] = useState("A");
  const [botaoFecharTurno, setBotaoFecharTurno] = useState(false);
  const [nome, setNome] = useState("");
  const [caixa, setCaixa] = useState([]);
  const [tempoAtual, setTempoAtual] = useState("");
  const [resposta2, setResposta2] = useState([]);
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);

  const verificarTurno = () => {
    const requisicao = createAPI();
    requisicao.get("/turno/verificar").then((response) => {
      console.log(response)
      if(response.data.msg.resultado) {
        localStorage.setItem("turno", true);
        localStorage.setItem("caixa", true);
        setAbTurno(true);
      } 
      else {
        localStorage.setItem("turno", false);
        setAbTurno(false)
      }
    });

    if(localStorage.getItem('caixa') == 'true'){
      console.log('aqui')
    setCaixa(false)
    } else {
    setCaixa(true)
    }
  }

  useEffect(() => {
    const requisicao = createAPI();
    requisicao.get("/setores").then((response) => {
        for (let i = 0; i < response?.data?.data?.setores?.length; i++) {
          resposta2[i] = {};
          resposta2[i].setores = response.data.data.setores[i].nome;
          resposta2[i].id_setores = response.data.data.setores[i].id_setor;
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

    verificarTurno()

    setNome(user2.nome);
    const data = new Date();
    let hora = data.getHours();
    if (hora < 10) {
      hora = "0" + hora;
    }
    let minuto = data.getMinutes();
    if (minuto < 10) {
      minuto = "0" + minuto;
    }
    let segundos = data.getSeconds();
    if (segundos < 10) {
      segundos = "0" + segundos;
    }
    const horaAtual = hora + ":" + minuto + ":" + segundos;
    setTempoAtual(horaAtual);

  }, []);

  const setarSetor = () => {
    const setor2 = document.getElementById("setoresSelect2").value;
    setSetorSelecionado2(setor2);

    const setorA = resposta2.find((setor) => setor.setores === setor2);
    const setorId2 = setorA && setorA.id_setores;
    setSetorSelecionado(setorId2);
  };


  const FuncArrumaInput = (e) => {
    let valor = e;

    if (valor.length === 1 && valor !== '0') {
      valor = `0,0${valor}`;
    } else if (valor.length > 1) {
      valor = valor.replace(/\D/g, "");
      valor = valor.replace(/^0+/, "");
  
      if (valor.length < 3) {
        valor = `0,${valor}`;
      } else {
        valor = valor.replace(/(\d{2})$/, ',$1');
      }
  
      valor = valor.replace(/(?=(\d{3})+(\D))\B/g, ".");
    }

    setValor(valor);
  };

  const abrirTurno = () => {
    const requisicao = createAPI();
    const valorFinal = parseFloat(valor.replace(",", ".")).toFixed(2);
    requisicao.post("/turno/abrir", {
        hora: tempoAtual,
        idSetor: setorSelecionado,
        caixa: {
          valor_abertura: `${valorFinal}`,
        },
      })
      .then((response) => {
        if (response.data.msg.resultado) {
          localStorage.setItem("turno", true);
          localStorage.setItem("caixa", true);
          localStorage.setItem("horaTurno", tempoAtual);
          localStorage.setItem("setorTurno", setorSelecionado2);
          FuncTrocaComp("ListarVagasMonitor");
        } else {
          setEstado2(true);
          setMensagem(response.data.msg.msg);
          setTimeout(() => {
            setEstado2(false);
            setMensagem("");
          }, 5000);
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
  };

  const abrirTurno2 = () => {
    const requisicao = createAPI();

    requisicao.post('/turno/abrir',{
        hora: tempoAtual,
        idSetor: setorSelecionado
        }
    ).then(
        response => {
           if(response.data.msg.resultado === true){
            localStorage.setItem("turno", true)
            localStorage.setItem("setorTurno", setorSelecionado2)
            const data = new Date();
            let hora = data.getHours();
            if(hora < 10){
                hora = "0" + hora;
            }
            let minuto = data.getMinutes();
            if(minuto < 10){
                minuto = "0" + minuto;
            }
                let segundos = data.getSeconds();
            if(segundos < 10){
                segundos = "0" + segundos;
            }
            const horaAtual = hora + ":" + minuto + ":" + segundos;
            localStorage.setItem("horaTurno", horaAtual)
            FuncTrocaComp( "ListarVagasMonitor")
           }
           else{
            console.log(response)
            localStorage.setItem("turno", true)
            setMensagem(response.data.msg.msg)
            setEstado2(true)
                setTimeout(() => {
                setEstado2(false)
                setMensagem("")
                }, 4000)

        }
        }
    ).catch(function (error) {
                    if(error?.response?.data?.msg === "Cabeçalho inválido!" 
        || error?.response?.data?.msg === "Token inválido!" 
        || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
            localStorage.removeItem("user")
        localStorage.removeItem("token")
        localStorage.removeItem("perfil");
        } else {
            console.log(error)
        }
    }
    );

    const data = new Date();
    let hora = data.getHours();
    if(hora < 10){
        hora = "0" + hora;
    }
    let minuto = data.getMinutes();
    if(minuto < 10){
        minuto = "0" + minuto;
    }
    let segundos = data.getSeconds();
    if(segundos < 10){
        segundos = "0" + segundos;
    }
    const horaAtual = hora + ":" + minuto + ":" + segundos;
    setTempoAtual(horaAtual);
}

  const fecharTurno = () => {
    const requisicao = createAPI();
    requisicao.post('/turno/fechar',{
        hora: tempoAtual,
        }
    ).then(
        response => {
           console.log(response)
           if(response.data.msg.resultado){
                verificarTurno()
                setAbTurno(false)
           }
           else{
            console.log(response)
            setEstado2(true)
            setMensagem(response.data.msg.msg)
                setTimeout(() => {
                setEstado2(false)
                setMensagem("")
                }, 4000)
           }
        }
    ).catch(function (error) {
        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
        || error?.response?.data?.msg === "Token inválido!" 
        || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
            localStorage.removeItem("user")
        localStorage.removeItem("token")
        localStorage.removeItem("perfil");
        } else {
            console.log(error)
        }
    }
    );
  }

  const fecharCaixa = () => {
    const requisicao = createAPI();
    requisicao.get('/turno/caixa').then(
        response2 => {
            if(response2.data.msg.resultado){
                console.log(response2)
                const sim = parseFloat(response2.data.caixa.valor_abertura) + parseFloat(response2.data.caixa.valor_movimentos);
                Swal.fire({
                    title: 'Confirmar fechamento de caixa',
                    showDenyButton: true,
                    html: `<div className="row justify-content-center align-items-center"> <div className="col-12"> <h6 class="text-start">Confirmar fechamento de caixa:</h6> </div> </div> <div className="row justify-content-center align-items-center"><div className="col-12"><h6 class="mt-4 text-start">Você inicou o caixa com: R$${response2.data.caixa.valor_abertura},00</h6></div><div className="col-12"><h6 class="mt-4 text-start">Saldo movimentos: R$${response2.data.caixa.valor_movimentos},00</h6></div><div className="col-12"><h4 class="mt-4 text-start">Saldo final: R$${sim},00</h4></div><div className="col-12"></div></div></div>`,
                    confirmButtonText: `Confirmar`,
                    confirmButtonColor: '#28a745',
                    denyButtonText: `Cancelar`,
                    
                    }).then((result) => {
                    if (result.isConfirmed) {
                        requisicao.post('/turno/fechar',{
                            hora: tempoAtual,
                            caixa: {
                                valor_movimentacao: sim,
                            }
                            }
                        ).then(
                            response => {
                            console.log(response)
                            if(response.data.msg.resultado === true){
                                localStorage.setItem("turno", false);
                                localStorage.setItem("caixa", false);
                                Swal.fire('Caixa fechado com sucesso', '', 'success')
                                verificarTurno();
                                ImpressaoFecharCaixa(response2.data.caixa, sim, response.config.headers.id_usuario)
                            }
                            else{
                                Swal.fire('Erro ao fechar caixa', `${response.data.msg.msg}`, 'error')
                                console.log(response)
                            }
                            }).catch(function (error) {
        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
        || error?.response?.data?.msg === "Token inválido!" 
        || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        localStorage.removeItem("perfil");
        } else {
            console.log(error)
        }
            }
            );
        } else if (result.isDenied) {
                        
        }
        })
        }
        else {
          if (response2.data.msg.resultado === false){
            const requisicao = createAPI();
            requisicao.post('/turno/fechar',{
                hora: tempoAtual,
                }
            ).then(
                response => {
                    console.log(response)
                    if(response.data.msg.resultado){
                      setAbTurno(false)
                      setCaixa(true)
                    }
                  }
            )}
        }}).catch(function (error) {
                    if(error?.response?.data?.msg === "Cabeçalho inválido!" 
        || error?.response?.data?.msg === "Token inválido!" 
        || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
            localStorage.removeItem("user")
        localStorage.removeItem("token")
        localStorage.removeItem("perfil");
        } else {
            console.log(error)
        }
    }
    );
  }

  return (
    <div className="container">
      <div
        className="row justify-content-center form-bg-image"
        data-background-lg="../../assets/img/illustrations/signin.svg"
      >
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="row">
              <div className="col-12">
                <h5 className="mt-1">Menu de turno</h5>
              </div>
              <div className="col-12">
                <h6 className="mt-2">Nome do monitor: {nome}</h6>
              </div>
              <div className="col-12">
                <small className="mt-2">Horário: {tempoAtual}</small>
              </div>
            </div>
            {abTurno === true ? (
              <div>
                  <button type="button" className="btn5 botao mt-3" onClick={() => {fecharTurno();}}>Fechar turno</button>
                  <button type="button" className="btn7 botao mt-3" onClick={() => {fecharCaixa()}}>Fechar caixa</button>
              </div>
            ) : (
              <div>
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-start">Escolha seu setor:</h6>
                  </div>
                  <div className="col-6">
                    <select
                      className="form-select form-select-sm mb-3 mt-2"
                      aria-label=".form-select-lg example"
                      id="setoresSelect2"
                      onChange={() => {
                        setarSetor();
                      }}
                    >
                      {resposta2.map((link, index) => (
                        <option value={link.setores} key={index}>
                          Setor: {link.setores}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {caixa === true ? (
                  <div className="align-items-center justify-content-between pb-3 mt-2">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-12">
                        <h6 className="text-start">Defina o valor do caixa:</h6>
                      </div>
                      <div className="row align-items-center pt-2 pb-3">
                        <div className="col-3">
                          <button
                            type="button"
                            className="btn btn-info w-100"
                            onClick={() => FuncArrumaInput("1000")}
                          >
                            10
                          </button>
                        </div>
                        <div className="col-3">
                          <button
                            type="button"
                            className="btn btn-info w-100"
                            onClick={() => FuncArrumaInput("2000")}
                          >
                            20
                          </button>
                        </div>
                        <div className="col-3">
                          <button
                            type="button"
                            className="btn btn-info w-100"
                            onClick={() => FuncArrumaInput("3000")}
                          >
                            30
                          </button>
                        </div>
                        <div className="col-3">
                          <button
                            type="button"
                            className="btn btn-info w-100"
                            onClick={() => FuncArrumaInput("5000")}
                          >
                            50
                          </button>
                        </div>
                      </div>
                      <div className="col-">
                        <div className="input-group">
                          <Input
                            icon={<IconCash />}
                            placeholder="R$ 0,00"
                            value={valor}
                            onChange={(e) => FuncArrumaInput(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-8"></div>
                    </div>

                    <div className="row justify-content-center align-items-center">
                      <div className="col-12">
                        { valor !== "" ? (
                        <h6 className="mt-4 text-start">
                          Valor definido em: R${valor === 0 ? "00" : valor}
                        </h6>
                        ) : (
                            null
                        )}
                      </div>
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn5 botao mt-3"
                          onClick={() => {
                            abrirTurno();
                          }}
                        >
                          Confirmar abertura
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button type="button" className="btn5 botao mt-3" onClick={() => {abrirTurno2();}}>Abrir turno</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div
          className="alert alert-danger mt-4 mx-3"
          role="alert"
          style={{ display: estado2 ? "block" : "none" }}
        >
          {mensagem}
        </div>
      </div>
    </div>
  );
};

export default AbrirTurno;
