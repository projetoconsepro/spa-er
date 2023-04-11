import axios from 'axios'
import { React, useState, useEffect } from 'react'
import { FaCarAlt, FaParking } from 'react-icons/fa'
import { TbHandClick } from 'react-icons/tb'
import { BsFillTrashFill } from 'react-icons/bs'

const Configuracoes = () => {
const [data, setData] = useState([])
const [mostrar2, setMostrar2] = useState([])
const [configuracoes, setConfiguracoes] = useState("")
const [cardBody, setCardBody] = useState("card-body3")
const [estadoDiv, setEstadoDiv] = useState(false)
const [isChecked, setIsChecked] = useState(false);
const [bordaBaixo, setBordaBaixo] = useState("")
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const user2 = JSON.parse(user);

const handleCheckboxChange = () => {
    console.log(isChecked)
    setIsChecked(!isChecked);
};

const abrirDiv = (index) => {
    data[index].estado = !data[index].estado
    if(data[index].debito === "S"){
        setIsChecked(true)
    }else{
        setIsChecked(false)
    }
}


useEffect(() => {
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
               debito: item.disponivel_debito_automatico,
               estado: false
            }));
            setData(newData)
        })
}, [])

  return (
    <div>
    <p className="text-start fs-5 fw-bold">Configurações</p>
    {data.map((link, index) => (
        <div className="card border-0 shadow mt-5" key={index}>
                    <div className={cardBody}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <div className="h2 mb-0 d-flex align-items-center">
                                    {link.placa}
                                </div>
                                <div className="h6 mt-1 d-flex align-items-center fs-6 text-start" onClick={() => {abrirDiv(index)}}>
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
                                <div className="card-body4">
                               {data[index].estado ? <div id="bordaBaixo"></div> : null}
                               <div className="form-check2">
                               <input
                                 className="form-check-input"
                                 type="checkbox"
                                 id="exampleCheckbox"
                                 value="option1"
                                 checked={isChecked}
                                 onChange={handleCheckboxChange}/>
                               <label className="form-check-label">
                               ‎ ‎ Débito automático
                               </label>
                                </div>
                                    <div className="row">
                                        <div className="col-10">
                                        </div>
                                        <div className="col-2">
                                            <BsFillTrashFill size={25} color="red"/>
                                        </div>
                                    </div>
                                </div>
                                : 
                                null}
                </div>
                ))}
    </div>
  )
}

export default Configuracoes