import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaClipboardList, FaParking, FaCarAlt } from "react-icons/fa";
import { AiFillCheckCircle, AiFillPrinter, AiOutlineReload } from "react-icons/ai";
import { BsCalendarDate, BsFillPersonFill, BsCashCoin} from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import Swal  from "sweetalert2";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import Filtro from "../util/Filtro";
import { Loader } from '@mantine/core';

const ListarNotificacoes = () => {
  const [data, setData] = useState([]);
  const [estado, setEstado ] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [placaSetada, setPlacaSetada] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);
  const [cont, setCont] = useState(0);
  const [filtro, setFiltro] = useState("");

  const atualiza = (index) => {
    data[index].estado = !data[index].estado;
    setData([...data]);
  };

  const regularizar = (index) => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: user2.perfil[0]
      },
    });
    const idVagaVeiculo = data[index].id_vaga_veiculo;
    const pagamento = document.getElementById(`pagamentos`).value;
    console.log(idVagaVeiculo)
    requisicao.put('/notificacao/',{
        id_vaga_veiculo: idVagaVeiculo,
        tipoPagamento: pagamento,
    }).then((response) => {
      console.log(response)
      if(response.data.msg.resultado){
        Swal.fire("Regularizado!", "A notificação foi regularizada.", "success");
        data[index].pago = 'S';
        setData([...data]);
      }
      else {
        setEstado(true);
        setMensagem(response.data.msg.msg);
        setTimeout(() => {
          setEstado(false);
          setMensagem("")
        }, 5000);
      }
    }).catch((error) => {
      if(error?.response?.data?.msg === "Cabeçalho inválido!" 
      || error?.response?.data?.msg === "Token inválido!" 
      || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("perfil");
      } else {
          console.log(error)
      }
    })
  }

    function ArrumaHora(data) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    const data6 = data2[1].split(":");
    const data5 = data4 + " " + (data6[0]-3) + ":" + data6[1];
    return data5;
    }

    const startVagaVeiculo = async (localVagaVeiculo) => {
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });
      const idrequisicao= `{"where": [{ "field": "vaga_veiculo", "operator": "=", "value": "${localVagaVeiculo}" }]}`
      const passar = btoa(idrequisicao)
      
      await requisicao
        .get(`/notificacao/?query=${passar}`)
        .then((response) => {
          console.log(response, 'response')
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
          setEstado2(true);
        } else {
          setEstado(true);
          setMensagem(response.data.msg.msg);
          setTimeout(() => {
            setEstado(false);
            setMensagem("")
          }, 5000);
        }
        })
        .catch((error) => {
          console.log(error)
                      if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });

        setTimeout(() => {
          localStorage.removeItem("VagaVeiculoId");
        }, 2000);
      };

    const startNotificao = async () => {
      setEstado2(false);
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });
    const idrequisicao= `{"where": [{ "field": "usuario", "operator": "=", "value": "${user2.id_usuario}" }]}`
    const passar = btoa(idrequisicao)
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
      }
      })
      .catch((error) => {
                    if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
      });
    };

    const startPlaca = async (placa) => {
      setEstado2(false);
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0]
        },
      });
      const idrequisicao= `{"where": [{ "field": "placa", "operator": "=", "value": "${placa}" }]}`
      const passar = btoa(idrequisicao)
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
          setMensagem("")
        }, 5000);
      }
      })
      .catch((error) => {
                    if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
      });
  };

  useEffect(() => {
    if (localStorage.getItem("turno") !== 'true' && user2.perfil[0] === "monitor") {
      FuncTrocaComp( "FecharTurno");
    }
    const localVagaVeiculo = localStorage.getItem("VagaVeiculoId");
    const placa = localStorage.getItem("placaCarro");
    if (localVagaVeiculo !== null && localVagaVeiculo !== undefined && localVagaVeiculo !== "") {
      startVagaVeiculo(localVagaVeiculo)
    } else if (placa !== null && placa !== undefined && placa !== ""){
      setPlacaSetada(placa)
      startPlaca(placa);
    }
    else {
      startNotificao();
    }
  }, []);

const handleConsultaSelected = (consulta) => {
  handleFiltro(consulta)
}

const handleFiltro = (where) => {
  setEstadoLoading(true)
  const requisicao = axios.create({
    baseURL: process.env.REACT_APP_HOST,
    headers: {
      token: token,
      id_usuario: user2.id_usuario,
      perfil_usuario: user2.perfil[0],
    },
  });
  const base64 = btoa(where)
  requisicao.get(`/notificacao/?query=${base64}`).then((response) => {
    console.log(response.data.msg.resultado)
    setEstadoLoading(false)
    if (response.data.msg.resultado){
      setEstado(false)
      const newData = response.data.data.map((item) => ({
        data: ArrumaHora(item.data),
        id_notificacao: item.id_notificacao,
        tipo_notificacao: item.tipo_notificacao.nome,
        monitor: item.monitor.nome,
        id_vaga_veiculo: item.id_vaga_veiculo,
        vaga: item.vaga,
        modelo: item.veiculo.modelo.nome,
        valor: item.valor,
        placa: item.veiculo.placa,
        estado: false,
        pago: item.pago,
      }));
      setData(newData)
    }
    else {
      setData([])
      setEstado(true)
      setMensagem("Não há notificações para exibir")
    }
}).catch((error) => {
  if(error?.response?.data?.msg === "Cabeçalho inválido!" 
  || error?.response?.data?.msg === "Token inválido!" 
  || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  localStorage.removeItem("perfil");
  } else {
      console.log(error)
  }
  })
}



  return (
    <div className="col-12 px-3">
      <p className="text-start fs-2 fw-bold">Notificações emitidas:</p>
      <div className="row mb-3">
        <div className="col-12">
        <div className="row">
        <div className="col-7">
        <Filtro nome={'ListarNotificacoesAdmin'} onConsultaSelected={handleConsultaSelected} onLoading={estadoLoading}/>
          </div>
          <div className="col-3 text-end">
            
          </div>
          <div className="col-1 text-end">
            <AiOutlineReload onClick={() => {startNotificao()}} className="mt-1" size={21}/>
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
                  <h6> <BsCalendarDate />‎ {link.data}</h6>
                </div>
                {link.estado ? (
                <div
                  className="h6 d-flex align-items-center fs-6"
                  id="bordaBaixo"
                >
                   {link.tipo_notificacao === "Ocupando vaga de deficiente" ? 
                  <h6> <FaClipboardList />‎ <small>Motivo: {link.tipo_notificacao}</small></h6>
                  :
                  <h6> <FaClipboardList />‎ Motivo: {link.tipo_notificacao}</h6>
                  }
                  
                </div>
                ) : 
                <div
                  className="h6 d-flex align-items-center fs-6"
                >
                   {link.tipo_notificacao === "Ocupando vaga de deficiente" ? 
                  <h6> <FaClipboardList />‎ <small>Motivo: {link.tipo_notificacao}</small></h6>
                  :
                  <h6> <FaClipboardList />‎ Motivo: {link.tipo_notificacao}</h6>
                  }
                </div>
                }
              </div>
              <div>
              {link.pago === "N" ?  
              (
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
                  <h6> <FaParking />‎ Vaga: {link.vaga}</h6>
                </div>
                <div
                  className="h6 align-items-start text-start px-4"
                  id="estacionadocarroo"
                >
                  <h6> <BsFillPersonFill />‎ Monitor: {link.monitor}</h6>
                </div>
                <div
                  className="h6 align-items-start text-start px-4"
                  id="estacionadocarroo"
                >
                  <h6> <FaCarAlt />‎ Modelo: {link.modelo}</h6>
                </div>
                <div
                  className="h6 align-items-start text-start px-4"
                  id="estacionadocarroo"
                >
                  <h6> <BsCashCoin />‎ Valor: R${link.valor},00</h6>
                </div>

                {link.pago === "S" ?  (null) : (
                <div className="h6 mt-3 mx-5">
                  <select
                    className="form-select form-select-lg mb-1"
                    aria-label=".form-select-lg example"
                    id="pagamentos"
                    defaultValue="01:00:00"
                  >
                    <option value="pix">PIX</option>
                    <option value="dinheiro">
                      Dinheiro
                    </option>
                  </select>
                  <div className="pt-3 gap-6 d-md-block">
                    <div className="row">
                      <div className="col-10">
                      <button type="submit" className="btn5 botao align-itens-center fs-6" onClick={()=>{regularizar(index)}}>Regularizar</button>
                      </div>
                      <div className="col-2 pt-2">
                      <span className=""> <AiFillPrinter size={25}/> </span>
                      </div>
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
        <div className="alert alert-danger mt-4" role="alert" style={{ display: estado ? 'block' : 'none' }}>
            {mensagem}
        </div>
        <VoltarComponente />
    </div>
  );
};

export default ListarNotificacoes;
