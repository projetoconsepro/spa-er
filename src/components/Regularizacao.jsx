import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { AiFillCheckCircle, AiFillPrinter, AiOutlineInfoCircle } from "react-icons/ai";
import { FaCarAlt, FaCarSide, FaClipboardList, FaParking } from "react-icons/fa";
import { BsCalendarDate, BsFillPersonFill, BsCashCoin, BsPaintBucket} from "react-icons/bs";
import { RiTimerLine } from "react-icons/ri";
import Cronometro from './Cronometro';
import { RxLapTimer } from 'react-icons/rx';
import { TbHandClick } from 'react-icons/tb';
import ListarNotificacoes from './ListarNotificacoes';
import { BiErrorCircle } from 'react-icons/bi';
import Swal from 'sweetalert2';


const Regularizacao = () => {
    const [placa, setPlaca] = useState("placa")
    const [textoPlaca, setTextoPlaca] = useState("")
    const [limite, setLimite] = useState(8)
    const [inputVazio, setInputVazio] = useState("inputvazio3")
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [cont, setCont] = useState(0);
    const [div , setDiv] = useState(false)
    const [teste, setTeste] = useState("")
    const [data, setData] = useState([])
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);


    const handlePlaca = () => {
        const clicado = document.getElementById("flexSwitchCheckDefault").checked
            if(clicado === true){
                setPlaca("placa2")
                setLimite(10)
                setInputVazio("inputvazio2")
            }
            else{
                setPlaca("placa")
                setLimite(8)
                setInputVazio("inputvazio3")
            }
        }

    

        useEffect(() => {
            const clicado = document.getElementById("flexSwitchCheckDefault").checked
            if(clicado === false){
            if (textoPlaca.at(4) === '1' || textoPlaca.at(4) === '2' 
            || textoPlaca.at(4) === '3' || textoPlaca.at(4) === '4' || textoPlaca.at(4) === '5'
            || textoPlaca.at(4) === '6' || textoPlaca.at(4) === '7' || textoPlaca.at(4) === '8'
            || textoPlaca.at(4) === '9' || textoPlaca.at(4) === '0') {
                setPlaca("placa3")
                if (cont === 0) {
                    const fim = textoPlaca.substring(3, textoPlaca.length);
                    const texto = textoPlaca.substring(0, 3);
                    const traco = "-"
                    setTextoPlaca(texto +traco+ fim)
                    setCont(cont + 1)
                    }
                    else {
                    const fim = textoPlaca.substring(4, textoPlaca.length);
                    const texto = textoPlaca.substring(0, 3);
                    const traco = "-"
                    setTextoPlaca(texto +traco+ fim)
                    setCont(cont + 1)
                    }
            } else {
            setPlaca("placa")
            setCont(0)
            }
            setTeste(textoPlaca.replace("-", ""))
        }
        },[textoPlaca])
        
        const handleRequisicao = async () => {
           localStorage.setItem("placaCarro", teste)
           localStorage.setItem("componente", "ListarNotificacoes")
        }

  return (
    <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="h6 mt-1 align-items-left text-start">
                                Consultar veículo
                            </div>
                            <div className="row">
                                <div className="col-9 px-3 mt-4 pt-1">
                                    <h5 id="h5Placa">Placa estrangeira</h5>
                                </div>
                                <div className="col-3 px-3">
                                    <div className="form-check form-switch gap-2 d-md-block">
                                        <input className="form-check-input align-self-end" type="checkbox" 
                                        role="switch" onClick={handlePlaca} id="flexSwitchCheckDefault"/>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-1 mt-md-0 w-100 p-3" id={placa}>
                                <input type="text" id={inputVazio} className='mt-5 fs-1 justify-content-center align-items-center text-align-center' value={textoPlaca} onChange={(e) => setTextoPlaca(e.target.value)} maxLength={limite}/>
                            </div>
                            <div className="mb-2 mt-3 gap-2 d-md-block">
                                    <button type="submit" onClick={()=>{handleRequisicao()}}  className="btn3 botao">Buscar</button>
                                </div>
                                <div className="alert alert-danger mt-4" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                {mensagem}
                                </div> 
                        </div>
                    </div>
                </div>
            </div>
  )
}

export default Regularizacao