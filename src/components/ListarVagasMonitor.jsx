import axios from "axios";
import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

const ListarVagasMonitor = () =>{
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const [resposta] = useState([]);
    const [setor , setSetor] = useState('');
    const [tempoAtual , setTempoAtual] = useState('');

    const vagas = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "monitor"
        }
    })

    const getVagas = async () => {
        await vagas.get('/vagas?setor=A'
        ).then(
            response => {
                for(let i = 0; i < response?.data?.data.length; i++){
                    setSetor(response.data.data[0].nome);
                    if(response.data.data[i].numero !== 0) {
                    resposta[i] = {};
                    resposta[i].numero = response.data.data[i].numero;
                    resposta[i].cor = response.data.data[i].cor;
                    if(response.data.data[i].estacionado === 'N') {
                        resposta[i].chegada = "";
                        resposta[i].placa = '';
                        resposta[i].temporestante = "";
                    }
                    else{
                        resposta[i].chegada = response.data.data[i].chegada;
                        resposta[i].placa = response.data.data[i].placa;
                        resposta[i].temporestante = response.data.data[i].temporestante;
                    }
                    }
                    const data = new Date();
                    const hora = data.getHours();
                    const minuto = data.getMinutes();
                    const horaAtual = hora + ":" + minuto;
                    setTempoAtual(horaAtual);
                    
                    
            }
        }
        ).catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {
        getVagas();
    }, [])


    const estaciona = (numero) => {
        localStorage.setItem('vaga', numero);
        localStorage.setItem('componente', 'RegistrarVagaMonitor');
        window.location.reload();
    }


    return(
        <div className="dashboard-container pt-3">
        <div className="row">
            <div className="col-12 col-xl-8">
            <div className="row">
                <div className="col-12 mb-4">
                <div className="d-flex justify-content-between mx-2">
                    
                    <p>Setor: {setor}</p> 

                    <p>Atualizado em: {tempoAtual}</p>
                
                   <div onClick={()=>{ getVagas()}}><FiRefreshCw  size={20}/> </div>
                
                </div>
                   <div className="card border-0 shadow">
                        <div className="table-responsive">
                        <table className="table align-items-center table-flush">
                            <thead className="thead-light">
                                <tr>
                                    <th className="border-bottom" scope="col">Vaga</th>
                                    <th className="border-bottom" scope="col">Placa</th>
                                    <th className="border-bottom" scope="col">Chegada</th>
                                    <th className="border-bottom" scope="col">Tempo Restante</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resposta.map((vaga , index) => (  
                                <tr key={index} onClick={()=>{estaciona(vaga.numero)}}> 
                                    <th className="text-white" scope="row" style={{ backgroundColor: vaga.cor}}>{vaga.numero}</th>
                                    <td className="fw-bolder text-gray-500">{vaga.placa}</td>
                                    <td className="fw-bolder text-gray-500">{vaga.chegada}</td>
                                    <td className="fw-bolder text-gray-500">{vaga.temporestante}</td>
                                </tr>
                                ))}
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
}
        
export default ListarVagasMonitor;