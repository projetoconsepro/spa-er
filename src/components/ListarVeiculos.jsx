import axios from "axios";
import { listarVeiculo, api, veiculo } from "../services/api.js";
import { FcPlus } from "react-icons/fc";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaCarAlt, FaParking } from "react-icons/fa";
import { useState, useEffect } from "react";
import '../pages/LoginPage/styles.css';
import Detalhesveiculos from "./Detalhesveiculos.jsx";

const ListarVeiculos = () => {
    const [placaVeiculo, setPlacaVeiculo] = useState("");
    const [notificacao, setNotificacao] = useState("");
    const [notificacao2, setNotificacao2] = useState("");
    const [estacionado, setEstacionado] = useState("");
    const [resposta, setResposta] = useState([{}]);
    const [resposta2, setResposta2] = useState([]);
    const [mostrar, setMostrar] = useState(false);
    const [mostrar2, setMostrar2] = useState([]);

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    console.log(user2.id_usuario)

    const veiculo = axios.create({
        baseURL: "http://localhost:3001",
        headers: {
            'x-access-token': token,
            'id': user2.id_usuario,
            'perfil': "cliente"
        }
    })

    useEffect(() => {
        veiculo.get('/veiculo').then(
            response => {
                setResposta(response?.data?.data);
                for (let i = 0; i < response?.data?.data.length; i++) {
                    resposta2[i] = {};
                    mostrar2[i] = { "estado": false };
                    resposta2[i].placa = response.data.data[i].usuario;
                    if (response.data.data[i].estacionado === 'N') {
                        resposta2[i].estacionado = "Não estacionado"
                    }
                    else {
                        resposta2[i].estacionado ="Estacionado - Vaga:";
                    }
                    if (response.data.data[i].numero_notificacoes_pendentes === 0) {
                        resposta2[i].numero_notificacoes_pendentes ="Sem notificações";
                    }
                    else if (response.data.data[i].numero_notificacoes_pendentes === 1) {
                        resposta2[i].numero_notificacoes_pendentes = "Uma notificação"
                    }
                    else {
                        resposta2[i].numero_notificacoes_pendentes = `${response.data.data[i].numero_notificacoes_pendentes}` + " notificações"
                    }
                    setPlacaVeiculo(response.data.data.usuario);
                }
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
        <div class="col-12 px-3 mb-4">
            <p class="text-start fs-2 fw-bold">Meus veículos</p>
            <div class="card border-0 shadow">
                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between pb-3">
                        <div>
                            <div className="h6 mb-0 d-flex align-items-center">
                                Seu saldo é de:
                            </div>
                            <div class="h1 mt-2 d-flex align-items-center">
                                R$ 50,00
                            </div>
                        </div>
                        <div>
                            <div class="d-flex align-items-center fw-bold">
                                <FcPlus size={40} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            {resposta2.map((link, index) => (
                <div class="card border-0 shadow mt-5" key={index} >
                    <div class="card-body" onClick={()=>{handleClick(index)}}>
                        <div class="d-flex align-items-center justify-content-between pb-3">
                            <div>
                                <div class="h2 mb-0 d-flex align-items-center">
                                    {link.placa}
                                </div>
                                <div class="h6 mt-2 d-flex align-items-center">
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