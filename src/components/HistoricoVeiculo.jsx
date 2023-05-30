import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CarroLoading from "./Carregamento";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import Filtro from "../util/Filtro";
import { AiOutlineReload } from "react-icons/ai";

const HistoricoVeiculo = () => {
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [user2, setUser2] = useState(null);
  const [cont, setCont] = useState(0);
  const [filtro, setFiltro] = useState("");
  const [perfil, setPerfil] = useState("");

  function ArrumaHora(data, hora) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    return data4;
  }

  const reload = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    setUser2(user2);
    if (
      localStorage.getItem("turno") !== "true" &&
      user2.perfil[0] === "monitor"
    ) {
      FuncTrocaComp( "FecharTurno");
    }
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: `${user2.perfil[0]}`,
      },
    });
    setPerfil(user2.perfil[0]);
    setEstado2(true);
    let idrequisicao = "";
    let passar = "";
    if (user2.perfil[0] === "monitor" || user2.perfil[0] === "admin") {
      const plaquinha = localStorage.getItem("placaCarro");
      setEstado2(true);
      idrequisicao = `{"where": [{ "field": "placa", "operator": "=", "value": "${plaquinha}" }]}`;
      passar = btoa(idrequisicao);
    } else if (user2.perfil[0] === "cliente") {
      idrequisicao = `{"where": [{ "field": "usuario", "operator": "=", "value": "${user2.id_usuario}" }]}`;
      passar = btoa(idrequisicao);
    }
    if (idrequisicao !== "" && passar !== "") {
      requisicao
        .get(`/veiculo/historico/?query=${passar}`)
        .then((response) => {
          if (response.data.msg.resultado) {
            setEstado2(false);
            setEstado2(false);
            setEstado(false);
            setMensagem("");
            const arraySemNulos = response?.data.data.filter(
              (valor) => valor !== null
            );
            const newData = arraySemNulos.map((item) => ({
              vaga: item.numerovaga,
              chegada:
                item.chegada[0] + "" + item.chegada[1] + "" + item.chegada[2],
              horafinal:
                item.horafinal[0] +
                ":" +
                item.horafinal[1] +
                ":" +
                item.horafinal[2],
              saida: item.saida,
              local: item.local,
              data: ArrumaHora(item.data),
              estado: false,
              pago: item.pago,
              placa: item.placa,
              regularizacao: item.regularizacao,
              notificacao: item.notificacao,
              id_vaga_veiculo: item.id_vaga_veiculo,
            }));
            setData(newData);
          } else {
            setEstado2(false);
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
  }

  useEffect(() => {
    reload();
  }, []);

  const chamarPopup = (index) => {
    if (data[index].notificacao === "S") {
      let tipo = "Sim";
      Swal.fire({
        title: data[index].placa,
        html: `Data: ${data[index].data} </br></br> Horário chegada: ${data[index].chegada} </br></br> Horário saída: ${data[index].saida} </br></br>
    Vaga: ${data[index].vaga} </br></br> Houve irregularidades: ${tipo} </br></br> Endereço: ${data[index].local} </br>`,
        showCancelButton: true,
        confirmButtonText: "Notificações",
        confirmButtonColor: "#3a58c8",
        cancelButtonText: "Voltar",
      }).then((result) => {
        if (result.isConfirmed) {
          FuncTrocaComp( "ListarNotificacoes");
          localStorage.setItem("placaCarro", data[index].placa);
        } else if (result.isDenied) {
        }
      });
    } else {
      let tipo = "Não";
      Swal.fire({
        title: data[index].placa,
        html: `Data: ${data[index].data} </br></br> Horário chegada: ${data[index].chegada} </br></br> Horário saída: ${data[index].saida} </br></br> 
    Vaga: ${data[index].vaga} </br></br> Houve irregularidades: ${tipo} </br></br> Endereço: ${data[index].local} </br>`,
        showCancelButton: false,
        confirmButtonText: "Voltar",
        confirmButtonColor: "#3a58c8",
      }).then((result) => {
        if (result.isConfirmed) {
        } else if (result.isDenied) {
        }
      });
    }
  };

  const handleConsultaSelected = (consulta) => {
    handleFiltro(consulta)
  }
  
  const handleFiltro = (where) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
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
    requisicao.get(`veiculo/historico/?query=${base64}`).then((response) => {
      if (response.data.msg.resultado) {
        console.log('aacabou')
        setEstadoLoading(false)
        setEstado2(false);
        setEstado(false);
        setMensagem("");
        const arraySemNulos = response?.data.data.filter(
          (valor) => valor !== null
        );
        const newData = arraySemNulos.map((item) => ({
          vaga: item.numerovaga,
          chegada:
            item.chegada[0] + "" + item.chegada[1] + "" + item.chegada[2],
          horafinal:
            item.horafinal[0] +
            ":" +
            item.horafinal[1] +
            ":" +
            item.horafinal[2],
          saida: item.saida,
          local: item.local,
          data: ArrumaHora(item.data),
          estado: false,
          pago: item.pago,
          placa: item.placa,
          regularizacao: item.regularizacao,
          notificacao: item.notificacao,
          id_vaga_veiculo: item.id_vaga_veiculo,
        }));
        setData(newData);
      } else {
        setEstado2(false);
        setEstado(true);
        setMensagem(response.data.msg.msg);
        setTimeout(() => {
          setEstado(false);
          setMensagem("");
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

  return (
    <div className="dashboard-container">
      <p className="mx-3 text-start fs-4 fw-bold">Histórico:</p>
      <div>
      <div className="row mb-4">
        <div className="col-7">
        <Filtro nome={
          user2 !== null ?
          user2.perfil[0] === 'cliente' ? 'HistoricoVeiculo' : 'HistoricoVeiculoAdmin' : null
        } 
          onConsultaSelected={handleConsultaSelected} 
          onLoading={estadoLoading}
        />
          </div>
          <div className="col-3 text-end">
            
          </div>
          <div className="col-1 text-end">
            <AiOutlineReload onClick={() => {reload()}} className="mt-1" size={21}/>
          </div>
          </div>


      </div>
      <div className="row">
        <div className="col-12 col-xl-8">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card border-0 shadow">
                <div className="table-responsive">
                  <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th className="border-bottom" scope="col">
                          Placa
                        </th>
                        <th className="border-bottom" scope="col">
                          Chegada
                        </th>
                        <th className="border-bottom" scope="col">
                          Vaga
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor:
                              item.regularizacao === "S"
                                ? "#D1E7DD"
                                : item.notificacao === "S" &&
                                  item.regularizacao !== "S"
                                ? "#F8D7DA"
                                : "#FFF",
                          }}
                          onClick={() => {
                            chamarPopup(index);
                          }}
                        >
                          <td
                            style={{
                              color:
                                item.regularizacao === "S"
                                  ? "#0F5132"
                                  : item.notificacao === "S" &&
                                    item.regularizacao !== "S"
                                  ? "#842029"
                                  : "#303030",
                            }}
                          >
                            {item.placa}
                          </td>
                          <td
                            style={{
                              color:
                                item.regularizacao === "S"
                                  ? "#0F5132"
                                  : item.notificacao === "S" &&
                                    item.regularizacao !== "S"
                                  ? "#842029"
                                  : "#303030",
                            }}
                          >
                            {item.data} - {item.chegada}
                          </td>
                          <td
                            style={{
                              color:
                                item.regularizacao === "S"
                                  ? "#0F5132"
                                  : item.notificacao === "S" &&
                                    item.regularizacao !== "S"
                                  ? "#842029"
                                  : "#303030",
                            }}
                          >
                            {item.vaga}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  className="mt-3 mb-3"
                  style={{ display: estado2 ? "block" : "none" }}
                >
                  <CarroLoading />
                </div>
                <div
                  className="alert alert-danger mt-4 mx-3"
                  role="alert"
                  style={{ display: estado ? "block" : "none" }}
                >
                  {mensagem}
                </div>
              </div>
            </div>
          </div>
          <VoltarComponente />
        </div>
      </div>
    </div>
  );
};

export default HistoricoVeiculo;
