import axios from "axios";
import { FcPlus } from "react-icons/fc";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaCarAlt, FaParking } from "react-icons/fa";
import { useState, useEffect } from "react";
import '../pages/LoginPage/styles.css';
import Detalhesveiculos from "./Detalhesveiculos.jsx";

const ListarVeiculos = () => {
    const [resposta] = useState([]);
    const [mostrar, setMostrar] = useState(false);
    const [mostrar2] = useState([]);
    const [nofityvar] = useState([]);
    const [saldoCredito, setSaldoCredito] = useState("");

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    const saldo = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })

    const veiculo = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })

    useEffect(() => {
        veiculo.get('/veiculo').then(
            response => {
                console.log(response)
                if(response.data.msg.resultado === false){
                    localStorage.setItem("componente", "CadastrarVeiculo")
                    window.location.reload();
                }
                for (let i = 0; i < response?.data?.data.length; i++) {
                    resposta[i] = {};
                    mostrar2[i] = { "estado": false };
                    nofityvar[i] = { "notifi": "notify" };
                    resposta[i].placa = response.data.data[i].usuario;
                    if (response.data.data[i].estacionado === 'N') {
                        resposta[i].estacionado = "Não estacionado"
                    }
                    else {
                        resposta[i].estacionado ="Estacionado - Vaga:";
                    }
                    if (response.data.data[i].numero_notificacoes_pendentes === 0) {
                        resposta[i].numero_notificacoes_pendentes ="Sem notificações";
                    }
                    else if (response.data.data[i].numero_notificacoes_pendentes === 1) {
                        resposta[i].numero_notificacoes_pendentes = "Uma notificação"
                        nofityvar[i] = { "notifi": "notify2" };
                    }
                    else {
                        resposta[i].numero_notificacoes_pendentes = `${response.data.data[i].numero_notificacoes_pendentes}` + " notificações";
                        nofityvar[i] = { "notifi": "notify2" };
                    }
                }
            }
        ).catch(function (error) {
            console.log(error);
        });

        saldo.get('/usuario/saldo-credito').then(
            response => {
                console.log(response?.data?.data?.saldo)
                setSaldoCredito(response?.data?.data?.saldo)
            }
        ).catch(function (error) {
            console.log(error);
        });
    }, [])
    


    function handleClick(index) {
        setMostrar(!mostrar);
        mostrar2[index].estado = !mostrar2[index].estado;
    }


    return (
        <div className="col-12 px-3 mb-4">
            <p className="text-start fs-2 fw-bold">Meus veículos</p>
            <div className="card border-0 shadow">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between pb-3">
                        <div>
                            <div className="h6 mb-0 d-flex align-items-center">
                                Seu saldo é de:
                            </div>
                            <div className="h1 mt-2 d-flex align-items-center">
                                R$ {saldoCredito}
                            </div>
                        </div>
                        <div>
                            <div className="d-flex align-items-center fw-bold">
                                <FcPlus size={40} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            {resposta.map((link, index) => (
                <div class="card border-0 shadow mt-5" key={index} >
                    <div class="card-body" onClick={()=>{handleClick(index)}}>
                        <div class="d-flex align-items-center justify-content-between pb-3">
                            <div>
                                <div class="h2 mb-0 d-flex align-items-center">
                                    {link.placa}
                                </div>
                                <div class="h6 mt-2 d-flex align-items-center" id={nofityvar[index].notifi}>
                                    <AiOutlineInfoCircle />‎ {link.numero_notificacoes_pendentes}
                                </div>
                                <div class="h6 mt-2 d-flex align-items-center">
                                    <h6><FaParking />‎ {link.estacionado}</h6>
                                </div>
                            </div>
                            <div>
                                <div class="d-flex align-items-center fw-bold">
                                    <FaCarAlt size={40} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {mostrar2[index].estado ? <Detalhesveiculos /> : null}
                </div>
            ))}
        </div>
    );
}

export default ListarVeiculos;