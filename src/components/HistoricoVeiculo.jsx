import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";


const HistoricoVeiculo = () => {
  const [resposta, setResposta] = useState([]);
  const [data, setData] = useState([]);
  const [estado, setEstado ] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);
  const [cont, setCont] = useState(0);
  const [filtro, setFiltro] = useState("");

  const requisicao = axios.create({
    baseURL: process.env.REACT_APP_HOST,
    headers: {
      token: token,
      id_usuario: user2.id_usuario,
      perfil_usuario: "cliente",
    },
  });

  function ArrumaHora(data) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    const data6 = data2[1].split(":");
    const data5 = data4 + " " + (data6[0]-3) + ":" + data6[1];
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

    if (select === "selectData") {
        text = "Selecione a data desejada";
        type = "date";
        input = "data";
    } else if (select === "selectPlaca") {
        text = "Digite a placa desejada";
        type = "text";
        input = "placa";
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
              'Pago': 'Pago',
              'Pendente': 'Pendente'
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
          setFiltro(`Filtrado pelo ${input}: ${color}`);
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

const respostaPopup = (resposta) => {
    for (let i = 0; i < data.length; i++) {
        delete data[i];
    }
    const select = document.getElementById("filtroSelect").value;
    let idrequisicao = "";
    let passar = "";
    if (select === "selectData") {
       idrequisicao= `{where:{hora=${resposta}}}`
        passar = btoa(idrequisicao)
    }
    else if(select === "selectPlaca") {
        idrequisicao= `{where:{placa='${resposta}'}}`
        passar = btoa(idrequisicao)
    }
    else if(select === "selectVaga") {
        idrequisicao= `{where:{vaga='${resposta}'}}`
        passar = btoa(idrequisicao)
    }
    else if(select === "selectStatus"){
        idrequisicao= `{where:{status='${resposta}'}}`
        passar = btoa(idrequisicao)
    }

    if (idrequisicao !== "" && passar !== "") {
        requisicao.get(`/notificacao/?query=${passar}`)
        .then((response) => {
          console.log(response.data)
          if (response.data.msg.resultado) {
          const arraySemNulos = response?.data.data.filter(valor => valor !== null);
          const newData = arraySemNulos.map((item) => ({
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
            setData(newData);
        } else {
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


  return (
    <div className="dashboard-container">
      <p className="mx-3 text-start fs-4 fw-bold">Notificações:</p>
      <div onChange={() => {tirarOpcao()}}> 
      <select className="mx-3 form-select form-select-sm mb-3" aria-label=".form-select-lg example" id="filtroSelect">
        <option disabled selected id="filtro">Filtro</option>
        <option value="selectData">Data</option>
        <option value="selectPlaca">Placa</option>
        <option value="selectVaga">Vaga</option>
        <option value="selectStatus">Status</option>
        </select>
        <h6 className="text-start mx-3"><small>{filtro}</small></h6>
    </div>
    <div className="alert alert-danger mt-4 mx-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
            {mensagem}
    </div>
      <div className="row">
        <div className="col-12 col-xl-8">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card border-0 shadow">
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col">
                      <h2 className="fs-5 fw-bold mb-0">IKW7067</h2>
                    </div>
                    <div className="col text-end"></div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th className="border-bottom" scope="col">
                          Data
                        </th>
                        <th className="border-bottom" scope="col">
                          Chegada
                        </th>
                        <th className="border-bottom" scope="col">
                          Saida
                        </th>
                        <th className="border-bottom" scope="col">
                          Vaga
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr >
                      <td scope="row">17/02/2023</td>
                        <td >15:30</td>
                        <td>16:30</td>
                        <td>42</td>
                      </tr>
                      <tr style={{ backgroundColor: "#F8D7DA" }}>
                        <td scope="row" style={{ color: "#842029" }}>17/02/2023</td>
                        <td style={{ color: "#842029" }}>15:30</td>
                        <td style={{ color: "#842029" }}>16:30</td>
                        <td style={{ color: "#842029" }}>42</td>
                      </tr>
                    </tbody>
                  </table>
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
