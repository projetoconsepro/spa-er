import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaClipboardList, FaParking, FaCarAlt } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsCalendarDate, BsFillPersonFill, BsCashCoin} from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import Swal  from "sweetalert2";


const ListarNotificacoes = () => {
  const [resposta, setResposta] = useState([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);
  const [cont, setCont] = useState(0);
    const [filtro, setFiltro] = useState("");

  const requisicao = axios.create({
    baseURL: "https://2b7aa0fe-b0f8-4f65-a1ee-11309f25f174.mock.pstmn.io",
    headers: {
      token: token,
      id_usuario: user2.id_usuario,
      perfil_usuario: "cliente",
    },
  });

  const atualiza = (index) => {
    data[index].estado = !data[index].estado;
    setData([...data]);
  };

  const regularizar = (index) => {
    Swal.fire("Regularizado!", "A notificação foi regularizada.", "success");
  }

  

    function ArrumaHora(data) {
    const data2 = data.split(" ");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    const data6 = data2[1].split(":");
    const data5 = data4 + " " + data6[0] + ":" + data6[1];
    return data5;
    }

  useEffect(() => {
    requisicao
      .get("/notificacoes/?query=e3doZXJlOntkYXRhPScyMDIyLTAyLTE1J319")
      .then((response) => {
        const hora = ArrumaHora(response.data.data[0].data);
        const newData = response?.data.data.map((item) => ({
          data: hora,
          id_notificacao: item.id_notificacao,
          tipo_notificacao: item.tipo_notificacao.tipo,
          monitor: item.monitor.nome,
          vaga: item.vaga,
          modelo: item.veiculo.modelo.nome,
          valor: item.valor,
          placa: item.veiculo.placa,
          estado: false,
          pago: item.pago,
        }));
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

    const tirarOpcao = () => {

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

    if (select !== "selectData" && select !== "selectTipo") {
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
                teste(resposta);
                setFiltro(`Filtrado pela ${input}: ${resposta}`);
            }
        },
      }).then((result) => {
        }
        )
    } else if (select === "selectTipo") {
        Swal.fire({
            title: text,
            input: 'select',
            inputOptions: {
                'Tempo excedido' : 'Tempo excedido',
                'Estacionar em vaga de idoso' : 'Estacionar em vaga de idoso',
                'Estacionar em vada de cadeirante' : 'Estacionar em vada de cadeirante'
            },
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Filtrar',
            confirmButtonColor: '#3a58c8',
            cancelButtonText: 'Voltar',
            showLoaderOnConfirm: true,
            preConfirm: (item) => {
                setFiltro(`Filtrado pelo ${input}: ${item}`);
                teste(item);
            }
            }).then((result) => {
            }
            )
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
                    teste(resposta);
                }
            }
            }).then((result) => {

        
            }
            )
        
    }
}

    const teste = (oi) => {
    console.log(oi);
    }




  return (
    <div className="col-12 px-3">
      <p className="text-start fs-2 fw-bold">Notificações emitidas:</p>
      <div onChange={() => {tirarOpcao()}}> 
      <select className="form-select form-select-sm mb-3" aria-label=".form-select-lg example" id="filtroSelect">
        <option disabled selected id="filtro">Filtro</option>
        <option value="selectData">Data</option>
        <option value="selectPlaca">Placa</option>
        <option value="selectVaga">Vaga</option>
        <option value="selectTipo">Tipo de notificação</option>
        </select>
        <h6 className="text-start"><small>{filtro}</small></h6>
    </div>

      {data.map((link, index) => (
        <div className="card border-0 shadow mt-2" key={index}>
          <div
            className="card-body3"
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
                  id="vamove"
                >
                  <h6> <FaClipboardList />‎ Motivo: {link.tipo_notificacao}</h6>
                </div>
                ) : 
                <div
                  className="h6 d-flex align-items-center fs-6"
                >
                  <h6> <FaClipboardList />‎ Motivo: {link.tipo_notificacao}</h6>
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
                  >
                    <option value="00:30:00">PIX</option>
                    <option value="01:00:00" selected>
                      Dinheiro
                    </option>
                  </select>
                  <div className="pt-3">
                  <button type="submit" className="btn4 botao fs-5" onClick={()=> {regularizar(index)}}>
                    Regularizar
                  </button>
                  </div>
                </div>
                )}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default ListarNotificacoes;
