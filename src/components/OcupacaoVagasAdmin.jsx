import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CarroLoading from "./Carregamento";
import Filtro from "../util/Filtro";
import { AiFillPrinter } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import RelatoriosPDF from "../util/RelatoriosPDF";
import  FuncTrocaComp  from "../util/FuncTrocaComp";
import VoltarComponente from "../util/VoltarComponente";

const OcupacaoVagasAdmin = () => {
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [dataHoje, setDataHoje] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);
  const [cont, setCont] = useState(0);
  const [filtro, setFiltro] = useState("");

  function ArrumaHora(data, hora) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    return data4;
  }

  const imprimir = () => {
    const dataD = [...data.map((item) => ([item.placa, item.data + ' - ' + item.chegada, 
    item.vaga, item.saida, item.local, item.regularizacao === "S" ? "Regularizado": item.notificacao === "S" ? "Notificado": "Normal" ]))];
    const nomeArquivo = 'Relatório ocupação de vagas'
    const cabecalho = ['Placa', 'Chegada', 'Vaga', 'Saida', 'Local', 'Situação']
    RelatoriosPDF(nomeArquivo, cabecalho, dataD)
  }

  const tirarOpcao = async () => {
    const select = document.getElementById("filtroSelect").value;
    if (cont === 0) {
      let select = document.getElementById("filtro");
      select.remove();
    }
    setCont(cont + 1);

    let text = "";
    let type = "";
    let input = "";

    if (select === "selectPlaca") {
      text = "Digite a placa desejada";
      type = "text";
      input = "placa";
    } else if (select === "selectData") {
      text = "Selecione a data desejada";
      type = "date";
      input = "data";
    } else if (select === "selectVaga") {
      text = "Digite a vaga desejada";
      type = "number";
      input = "vaga";
    } else if (select === "selectTipo") {
      text = "Digite o tipo de notificação";
      type = "text";
      input = "tipo";
    } else if (select === "selectStatus") {
      text = "Digite o status da notificação";
      type = "text";
      input = "status";
    }

    if (select !== "selectData" && select !== "selectTipo") {
      if (select === "selectStatus") {
        const inputOptions = new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              S: "Com irregularidades",
              N: "Sem irregularidades",
            });
          }, 1000);
        });

        const { value: color } = await Swal.fire({
          title: "Selecione o status",
          input: "radio",
          inputOptions: inputOptions,
          inputValidator: (value) => {
            if (!value) {
              return "Você deve selecionar um status de notificação!";
            }
          },
        });

        if (color) {
          if (color === "S") {
            setFiltro(`Filtrado por movimentos: Com irregularidades`);
          } else {
            setFiltro(`Filtrado por movimentos: Sem irregularidades`);
          }
          respostaPopup(color);
        }
      } else {
        Swal.fire({
          title: text,
          input: type,
          inputAttributes: {
            autocapitalize: "on",
          },
          showCancelButton: true,
          confirmButtonText: "Filtrar",
          confirmButtonColor: "#3a58c8",
          cancelButtonText: "Voltar",
          showLoaderOnConfirm: true,
          preConfirm: (resposta) => {
            if (resposta === "") {
              Swal.showValidationMessage(`Digite uma ${input} válida`);
              setFiltro("");
            } else {
              respostaPopup(resposta);
              setFiltro(`Filtrado pela ${input}: ${resposta}`);
            }
          },
        }).then((result) => {});
      }
    } else {
      Swal.fire({
        title: text,
        html: `<input type="date" id="date" class="swal2-input">`,
        showCancelButton: true,
        confirmButtonText: "Filtrar",
        confirmButtonColor: "#3a58c8",
        cancelButtonText: "Voltar",
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const resposta = document.getElementById("date").value;
          if (resposta === "" || resposta === null) {
            Swal.showValidationMessage(`Digite uma ${input} válida`);
          } else {
            setFiltro(`Filtrado pela ${input}: ${resposta}`);
            respostaPopup(resposta);
          }
        },
      }).then((result) => {});
    }
  };

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
          FuncTrocaComp("ListarNotificacoes")
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

  const respostaPopup = (resposta) => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: `${user2.perfil[0]}`,
      },
    });
    const plaquinha = localStorage.getItem("placaCarro");
    setEstado2(true);
    for (let i = 0; i < data.length; i++) {
      delete data[i];
    }
    const select = document.getElementById("filtroSelect").value;
    let idrequisicao = "";
    let passar = "";
    if (user2.perfil[0] === "monitor" || user2.perfil[0] === "admin") {
      if (select === "selectData") {
        idrequisicao = `{where:{placa='${plaquinha}', hora='%${resposta}%'}}`;
        passar = btoa(idrequisicao);
      } else if (select === "selectVaga") {
        idrequisicao = `{where:{placa='${plaquinha}', vaga='${resposta}'}}`;
        passar = btoa(idrequisicao);
      } else if (select === "selectStatus") {
        idrequisicao = `{where:{placa='${plaquinha}', tipo='${resposta}'}}`;
        passar = btoa(idrequisicao);
      }
    } else {
      if (select === "selectData") {
        idrequisicao = `{where:{hora=${resposta}}}`;
        passar = btoa(idrequisicao);
      } else if (select === "selectVaga") {
        idrequisicao = `{where:{vaga='${resposta}'}}`;
        passar = btoa(idrequisicao);
      } else if (select === "selectStatus") {
        idrequisicao = `{where:{tipo='${resposta}'}}`;
        passar = btoa(idrequisicao);
      } else if (select === "selectPlaca") {
        idrequisicao = `{where:{placa='${resposta}'}}`;
        passar = btoa(idrequisicao);
      }
    }

    if (idrequisicao !== "" && passar !== "") {
      requisicao
        .get(`/veiculo/historico/?query=${passar}`)
        .then((response) => {
          if (response.data.msg.resultado) {
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
              notificacao: item.notificacao,
              regularizacao: item.regularizacao,
              id_vaga_veiculo: item.id_vaga_veiculo,
            }));
            setData(newData);
          } else {
            setEstado2(false);
            for (let i = 0; i < data.length; i++) {
              delete data[i];
            }
            const resposta3 = data.filter((el) => el !== null);
            setData(resposta3);
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
  };

  const reload = () => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: `${user2.perfil[0]}`,
      },
    });

    const data = new Date();
      const dia = data.getDate();
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      const ano = data.getFullYear();
      const dataHoje = ano + "-" + mes + "-" + dia;

        setDataHoje(dataHoje);

    const idrequisicao= `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${dataHoje}%" }]}`
    const passar = btoa(idrequisicao)
      requisicao.get(`/veiculo/historico/?query=${passar}`).then((response) => {
          console.log(response)
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
              tempo: item.tempo,
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

  useEffect(() => {
    reload()
    }, []);

  const handleConsulta = (consulta) => {
    setEstadoLoading(true)
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
          'token': token,
          'id_usuario': user2.id_usuario,
          'perfil_usuario': "admin"
      }
  })

  const base64 = btoa(consulta)
  requisicao.get(`/veiculo/historico/?query=${base64}`).then((response) => {
    console.log(response)
    setEstadoLoading(false)
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
        tempo: item.tempo,
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
    

  return (
    <div className="dashboard-container">
      <p className="mx-3 text-start fs-4 fw-bold">Histórico:</p>
      <div className="row">
        <div className="col-12 col-xl-8 mb-4">
        <div className="row mx-2 mb-4">
                        <div className="col-6 align-middle mt-2">
                        <Filtro nome={"OcupacaoVagasAdmin"} onConsultaSelected={handleConsulta} onLoading={estadoLoading}/>
                        </div>
                        <div className="col-2">
                        </div>
                        <div className="col-4 mt-1">
                          <button className="btn3 botao p-0 m-0 w-100 h-100" type="button" onClick={()=>{imprimir()}}><AiFillPrinter  size={21}/></button>
                        </div>
                </div>
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card border-0 shadow">
                <div className="table-responsive">
                  <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th className="border-bottom" scope="col" id="tabelaUsuarios">
                          Placa
                        </th>
                        <th className="border-bottom" scope="col" id="tabelaUsuarios">
                          Chegada
                        </th>
                        <th className="border-bottom" scope="col" id="tabelaUsuarios">
                          Vaga
                        </th>
                        <th className="border-bottom" scope="col" id="tabelaUsuarios2">
                            Saida
                        </th>
                        <th className="border-bottom" scope="col" id="tabelaUsuarios2">
                            Local
                        </th>
                        <th className="border-bottom" scope="col" id="tabelaUsuarios2">
                            Situação
                        </th>
                        <th className="border-bottom" scope="col" id="tabelaUsuarios2">
                            Tempo
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
                            id="tabelaUsuarios2"
                          >
                            {item.saida}
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
                            id="tabelaUsuarios2"
                          >
                            {item.local}
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
                            id="tabelaUsuarios2"
                          >
                            {item.regularizacao === "S"
                                ? "Regularizado"
                                : item.notificacao === "S" 
                                ? "Notificado"
                                : "Normal" }
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
                            id="tabelaUsuarios2"
                          >
                            {item.tempo}
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

export default OcupacaoVagasAdmin;
