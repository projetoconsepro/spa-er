import axios from "axios";
import React, { useEffect, useState } from "react";
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";
import Swal from "sweetalert2";


const HistoricoVeiculo = () => {
  const [resposta, setResposta] = useState([]);
  const [data, setData] = useState([]);
  const [estado, setEstado ] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);
  const [cont, setCont] = useState(0);
  const [filtro, setFiltro] = useState("");
  const [plaquinha, setPlaquinha] = useState("");
  const [perfil, setPerfil] = useState("");

  function ArrumaHora(data) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    const data6 = data2[1].split(":");
    const data5 = data4 + " - " + (data6[0]-3) + ":" + data6[1];
    return data5;
    }

  const tirarOpcao = async() => {

    const select = document.getElementById("filtroSelect").value;
    if (cont === 0) {
    let select = document.getElementById("filtro");
    select.remove();
    }
    setCont(cont + 1);

    let text = "";
    let type = "";
    let input = "";

    if(select === "selectPlaca") {
        text = "Digite a placa desejada";
        type = "text";
        input = "placa";
    }
    else if (select === "selectData") {
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
    }
    else if (select === "selectStatus") {
        text = "Digite o status da notificação";
        type = "text";
        input = "status";
    }


    if (select !== "selectData" && select !== "selectTipo") {
      if(select === "selectStatus") {
        const inputOptions = new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              'S': 'Com irregularidades',
              'N': 'Sem irregularidades'
            })
          }, 1000)
        })
        
        const { value: color } = await Swal.fire({
          title: 'Selecione o status',
          input: 'radio',
          inputOptions: inputOptions,
          inputValidator: (value) => {
            if (!value) {
              return 'Você deve selecionar um status de notificação!'
            }
          }
        })
        
        if (color) {
          if ( color === "S") {
          setFiltro(`Filtrado por movimentos: Com irregularidades`);
          }
          else {
            setFiltro(`Filtrado por movimentos: Sem irregularidades`);
          }
         respostaPopup(color);
        }
      }else {
    Swal.fire({
        title: text,
        input: type,
        inputAttributes: {
          autocapitalize: 'on',
        },
        showCancelButton: true,
        confirmButtonText: 'Filtrar',
        confirmButtonColor: '#3a58c8',
        cancelButtonText: 'Voltar',
        showLoaderOnConfirm: true,
        preConfirm: (resposta) => {
            if (resposta === "") {
                Swal.showValidationMessage(
                    `Digite uma ${input} válida`
                  )
                setFiltro("");
            }
            else {
                respostaPopup(resposta);
                setFiltro(`Filtrado pela ${input}: ${resposta}`);
            }
        },
      }).then((result) => {
        }
        )
      }
    }
    else {
        Swal.fire({
            title: text,
            html : `<input type="date" id="date" class="swal2-input">`,
            showCancelButton: true,
            confirmButtonText: 'Filtrar',
            confirmButtonColor: '#3a58c8',
            cancelButtonText: 'Voltar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const resposta =document.getElementById('date').value
                if (resposta === "" || resposta === null) {
                    Swal.showValidationMessage(
                        `Digite uma ${input} válida`
                    )
                }
                else {
                    setFiltro(`Filtrado pela ${input}: ${resposta}`);
                    respostaPopup(resposta);
                }
            }
            }).then((result) => {
        
            }
            )
        
    }
}

const chamarPopup = (index) => {
  if(data[index].notificacao === "S") {
  let tipo = "Sim";
  Swal.fire({
    title: data[index].placa,
    html: `Data: ${data[index].data} </br> Horário chegada: ${data[index].chegada} </br> Horário saída: ${data[index].saida} </br> 
    Vaga: ${data[index].vaga} </br> Houve irregularidades: ${tipo} </br>`,
    showCancelButton: true,
    confirmButtonText: 'Notificações',
    confirmButtonColor: '#3a58c8',
    cancelButtonText: 'Voltar',
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.setItem("componente", "ListarNotificacoes");
      localStorage.setItem("VagaVeiculoId", data[index].id_vaga_veiculo);
      //era pra ser window.location.reload()
    } else if (result.isDenied) {
      
    }
  })
} else{
  let tipo = "Não";
  Swal.fire({
    title: data[index].placa,
    html: `Data: ${data[index].data} </br></br> Horário chegada: ${data[index].chegada} </br></br> Horário saída: ${data[index].saida} </br></br> 
    Vaga: ${data[index].vaga} </br></br> Houve irregularidades: ${tipo} </br>`,
    showCancelButton: false,
    confirmButtonText: 'Voltar',
    confirmButtonColor: '#3a58c8',
  }).then((result) => {
    if (result.isConfirmed) {

    } else if (result.isDenied) {
      
    }
  })
}
}


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
    if (user2.perfil[0] === "monitor") {
    if (select === "selectData") {
       idrequisicao= `{where:{placa='${plaquinha}', hora='%${resposta}%'}}`
        passar = btoa(idrequisicao)
    }
    else if(select === "selectVaga") {
        idrequisicao= `{where:{placa='${plaquinha}', vaga='${resposta}'}}`
        passar = btoa(idrequisicao)
    }
    else if(select === "selectStatus"){
        idrequisicao= `{where:{placa='${plaquinha}', tipo='${resposta}'}}`
        console.log(resposta)
        passar = btoa(idrequisicao)
    }
  } else {
    if (select === "selectData") {
        idrequisicao= `{where:{hora=${resposta}}}`
         passar = btoa(idrequisicao)
     }
     else if(select === "selectVaga") {
         idrequisicao= `{where:{vaga='${resposta}'}}`
         passar = btoa(idrequisicao)
     }
     else if(select === "selectStatus"){
         idrequisicao= `{where:{tipo='${resposta}'}}`
         console.log(resposta)
         passar = btoa(idrequisicao)
     }else if (select === "selectPlaca") {
        idrequisicao= `{where:{placa='${resposta}'}}`
         passar = btoa(idrequisicao)
     }
  }

    if (idrequisicao !== "" && passar !== "") {
        requisicao.get(`/veiculo/historico/?query=${passar}`)
        .then((response) => {
          console.log(response.data)
          if (response.data.msg.resultado) {
            setEstado2(false);
            setEstado(false);
            setMensagem("")
          const arraySemNulos = response?.data.data.filter(valor => valor !== null);
          const newData = arraySemNulos.map((item) => ({
              vaga: item.numerovaga,
              chegada: item.chegada[0] + "" + item.chegada[1] + "" + item.chegada[2],
              horafinal: item.horafinal[0] + ":" + item.horafinal[1] + ":" + item.horafinal[2],
              saida: item.saida,
              data: ArrumaHora(item.data),
              estado: false,
              pago: item.pago,
              placa: item.placa,
              notificacao: item.notificacao,
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
            setMensagem("")
          }, 5000);
        }
        }).catch((error) => {
            console.log(error);
        });
    }
}

 useEffect(() => {
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
  if (user2.perfil[0] === "monitor") {
  const plaquinha = localStorage.getItem("placaCarro");
  setEstado2(true);
  idrequisicao= `{where:{placa='${plaquinha}'}}`
  passar = btoa(idrequisicao)
} else if (user2.perfil[0] === "cliente") {
  idrequisicao = `{where:{usuario='${user2.id_usuario}'}}`
  console.log(resposta)
  passar = btoa(idrequisicao)
}
if (idrequisicao !== "" && passar !== "") {
  requisicao.get(`/veiculo/historico/?query=${passar}`)
  .then((response) => {
    console.log(response)
    if (response.data.msg.resultado) {
    setEstado2(false);
    setEstado2(false);
    setEstado(false);
    setMensagem("");
    const arraySemNulos = response?.data.data.filter(valor => valor !== null);
    const newData = arraySemNulos.map((item) => ({
        vaga: item.numerovaga,
        chegada: item.chegada[0] + "" + item.chegada[1] + "" + item.chegada[2],
        horafinal: item.horafinal[0] + ":" + item.horafinal[1] + ":" + item.horafinal[2],
        saida: item.saida,
        data: ArrumaHora(item.data),
        estado: false,
        pago: item.pago,
        placa: item.placa,
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
      setMensagem("")
    }, 5000);
  }
  }).catch((error) => {
      console.log(error);
  });
}


}, []);
          


  return (
    <div className="dashboard-container">
      <p className="mx-3 text-start fs-4 fw-bold">Histórico:</p>
      <div onChange={() => {tirarOpcao()}}> 
      <select className="mx-3 form-select form-select-sm mb-3" aria-label=".form-select-lg example" id="filtroSelect">
        <option disabled selected id="filtro">Filtro</option>
        {perfil === "cliente" ? <option value="selectPlaca">Placa</option> : null}
        <option value="selectData">Data</option>
        <option value="selectVaga">Vaga</option>
        <option value="selectStatus">Status</option>
        </select>
        <h6 className="text-start mx-3"><small>{filtro}</small></h6>
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
                      <tr style={{backgroundColor: item.notificacao === 'S' ? "#F8D7DA" : "#FFF" }} onClick={() => {chamarPopup(index)}}>
                        <td style={{ color:  item.notificacao === 'S' ? "#842029" : "#303030" }}>{item.placa}</td>
                        <td style={{ color:  item.notificacao === 'S' ? "#842029" : "#303030" }}>{item.data}</td>
                        <td style={{ color:  item.notificacao === 'S' ? "#842029" : "#303030" }}>{item.vaga}</td>
                      </tr>
                   ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 mb-3" style={{ display: estado2 ? 'block' : 'none'}}>
                                    <p><small>Carregando...</small></p>
                                <TailSpin stroke="#3a58c8"/>
                </div>
                <div className="alert alert-danger mt-4 mx-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                      {mensagem}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricoVeiculo;