import axios from 'axios'
import { React, useState, useEffect, useRef } from 'react'
import { FaCarAlt, FaParking } from 'react-icons/fa'
import { TbHandClick } from 'react-icons/tb'
import { BsFillTrashFill } from 'react-icons/bs'
import Swal from 'sweetalert2'

const Configuracoes = () => {
const [data, setData] = useState([])
const [IsDisponivel, setIsDisponivel] = useState(false)
const [estado, setEstado] = useState(false)
const [estadoBotao, setEstadoBotao] = useState(false)
const [mensagem, setMensagem] = useState("")
const [mostrar2, setMostrar2] = useState([])
const [configuracoes, setConfiguracoes] = useState("")
const [cardBody, setCardBody] = useState("card-body3")
const [estadoDiv, setEstadoDiv] = useState(false)
const [bordaBaixo, setBordaBaixo] = useState("")
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const user2 = JSON.parse(user);

const handleCheckboxChange = (index) => {
    data[index].check = !data[index].check;
    setData([...data])
};

const abrirDiv = (index) => {
    data[index].estado = !data[index].estado
    setData([...data])
}

const requisicao = async() => {
    const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: "cliente",
        },
      });

        requisicao.get("/veiculo")
        .then((response) => {
            console.log(response)
            const newData = response.data.data.map((item) => ({
               placa: item.usuario,
               debito: item.debito_automatico,
               debitoDisponivel: item.disponivel_debito_automatico,
               estado: false,
               estadoOn: false,
               check: false,
               idVeiculo: item.id_veiculo
            }));
            for(let index = 0; index < newData.length; index++){
                if(newData[index].debito == "S"){
                    newData[index].check = true
                }else{
                    newData[index].check = false
                }
            }
            setData(newData)
            
        })
        .catch((error) => {
            console.log(error)
        })
    }


useEffect(() => {
    requisicao()
}, [])

const salvarAlteracoes = (index) => {
        const requisicao = axios.create({
          baseURL: process.env.REACT_APP_HOST,
          headers: {
            token: token,
            id_usuario: user2.id_usuario,
            perfil_usuario: "cliente",
          },
        });
        const idVeiculo = data[index].idVeiculo;
        console.log(idVeiculo)
        requisicao.put('/veiculo',{
            "idVeiculo": idVeiculo,
            "debitoAutomatico": data[index].check ? "S" : "N"
        }).then((response) => {
            console.log(response)
          if(response.data.msg.resultado){
            Swal.fire("Confirmado!", "O débito automático foi alterado com sucesso!", "success");
            data[index].estadoOn = !data[index].estadoOn
            setData([...data]);
            requisicao();
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
        })
}

const mudaEstado = (index) => {
    data[index].estadoOn = !data[index].estadoOn
    setData([...data])
}

  return (
    <div className="col-12 px-3">
    <p className="text-start fs-5 fw-bold">Configurações</p>
    {data.map((link, index) => (
        <div className="card border-0 shadow mt-5 mb-5" key={index} id="divD" disabled={(link.debitoDisponivel === 'N' && link.debito === 'N') || (link.debitoDisponivel === 'N' && link.debito !== 'S') ? true : false}>
                    <div className={cardBody} onClick={() => {abrirDiv(index)}}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <div className="h2 mb-0 d-flex align-items-center">                                  
                                    {link.placa}
                                </div>
                                <div className="h6 mt-1 d-flex align-items-center fs-6 text-start">
                                <h6 className="fs-6"><TbHandClick /> <small>Abrir configurações do veículo:</small></h6>
                                </div>
                                
                            </div>
                            <div>
                                <div className="d-flex align-items-center fw-bold">
                                    <FaCarAlt size={40} />
                                </div>
                            </div>
                            
                        </div>

                    </div>
                    {data[index].estado ?
                                <div className="card-body5" onChange={() => {mudaEstado(index)}}>
                               {data[index].estado ? <div id="bordaBaixo"></div> : null}
                               <div className="form-check2">
                               <input
                                 className="form-check-input"
                                 type="checkbox"
                                 id="exampleCheckbox"
                                 value="option1"
                                 checked={data[index].check}
                                 onChange={()=>{handleCheckboxChange(index)}}/>
                               <label className="form-check-label">
                               ‎ ‎ Débito automático
                               </label>
                                </div>
                                {data[index].estadoOn === true ?
                                    <div className="row mt-3">
                                        <div className="col-2">
                                        </div>
                                        <div className="col-8">
                                            <button type="button" className="btn3 botao" onClick={() => {salvarAlteracoes(index)}}>Salvar</button>
                                        </div>
                                        <div className="col-2">
                                            <BsFillTrashFill size={25} color="red"/>
                                        </div>
                                        </div>
                                        :
                                        <div className="row mt-3">
                                        <div className="col-2">
                                        </div>
                                        <div className="col-8">
                                        </div>
                                        <div className="col-2">
                                            <BsFillTrashFill size={25} color="red"/>
                                        </div>
                                        </div>
                                        }
                                </div>
                                : 
                                null}
                                <h6 style={{ display: (link.debitoDisponivel === 'N' && link.debito === 'N') || (link.debitoDisponivel === 'N' && link.debito !== 'S') ? "block" : "none"}} 
                    className="px-4 fs-6">
                        <small>Este veículo já possui débito automático ativo em outro dispositivo.</small>
                    </h6>
                </div>
                ))}
    </div>
  )
}

export default Configuracoes