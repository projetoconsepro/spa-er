import axios from "axios";
import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import Countdown from "react-countdown";
import Swal from "sweetalert2";

const ListarVagasMonitor = () =>{
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const [resposta, setResposta] = useState([]);
    const [resposta2, setResposta2] = useState([]);
    const [setor , setSetor] = useState('');
    const [tempoAtual , setTempoAtual] = useState('');
    const [estado , setEstado] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [salvaSetor, setSalvaSetor] = useState('');

    const vagas = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "monitor"
        }
    })

    const setores = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "monitor"
        }
    })

    const saida = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "monitor"
        }
    })

    const getVagas = async (setor) => {
        const setor2 = document.getElementById('setoresSelect').value;
        if(setor2 !== undefined && setor2 !== null && setor2 !== ''){
            setor = setor2;
        for(let i = 0; i < resposta.length; i++){
                delete resposta[i];
        }
    }
    setSalvaSetor(setor);
        await vagas.get(`/vagas?setor=${setor}`
        ).then(
            response => {
                if(response.data.msg.resultado !== false){
                    setEstado(false);
                    setMensagem("");
                for(let i = 0; i < response?.data?.data.length; i++){
                    setSetor(response.data.data[0].nome);
                    if(response.data.data[i].numero !== 0) {
                    resposta[i] = {};
                    resposta[i].numero = response.data.data[i].numero;
                    resposta[i].corvaga = response.data.data[i].cor;
                    if(response.data.data[i].estacionado === 'N') {
                        resposta[i].chegada = "";
                        resposta[i].placa = '';
                        resposta[i].temporestante = "";
                    }
                    else{
                        resposta[i].id_vaga_veiculo = response.data.data[i].id_vaga_veiculo;
                        resposta[i].chegada = response.data.data[i].chegada;
                        resposta[i].placa = response.data.data[i].placa;
                        resposta[i].temporestante = (response.data.data[i].temporestante);
                        resposta[i].tempo = (response.data.data[i].tempo);
                        if(resposta[i].temporestante === '00:00:00'){
                            resposta[i].corline = '#F8D7DA';
                            resposta[i].cor = '#842029';
                        }
                        else{
                            resposta[i].corline = '#fff';
                            resposta[i].cor = '#000';
                        }
                    }
                    }
                    const data = new Date();
                    const hora = data.getHours();
                    const minuto = data.getMinutes();
                    const horaAtual = hora + ":" + minuto;
                    setTempoAtual(horaAtual);
            }
        }
        else {
            setEstado(true);
            setMensagem(response.data.msg.msg);
        }
        }
        ).catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {
        const setor = 'A'
        getVagas(setor);
        
        setores.get('/setores'
        ).then(
            response => {
                for (let i = 0; i < response?.data?.data?.setores?.length; i++) {
                    resposta2[i] = {};
                    resposta2[i].setores = response.data.data.setores[i].nome;
                }
            }
        ).catch(function (error) {
            console.log(error);
        }
        );
    }, [])


    const estaciona = (numero, id_vaga, tempo) => {
        if(tempo === '00:00:00'){
            Swal.fire({
                title: 'Deseja liberar esse veículo?',
                showDenyButton: true,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Liberar',
                denyButtonText: `Notificar`,
              }).then((result) => {
                if (result.isConfirmed) {
                    saida.post(`/estacionamento/saida`, {
                        idvagaVeiculo: id_vaga
                    }).then(
                        response => {
                            if(response.data.msg.resultado){
                            const setor = salvaSetor;
                            Swal.fire('Veículo liberado', '', 'success')
                            setTimeout(() => {
                                getVagas(setor);
                            }, 1000);
                            }else {
                                Swal.fire(`${response.data.msg.msg}`, '', 'error')
                            }
                        }
                    ).catch(function (error) {
                        console.log(error);
                    }
                    );
                    
                } else if (result.isDenied) {
                  Swal.fire('Notificado', '', 'info')
                }

              })
        }
        else {
        localStorage.setItem('vaga', numero);
        localStorage.setItem('componente', 'RegistrarVagaMonitor');
        window.location.reload();
        }
    }

    return(
        <div className="dashboard-container pt-3">
        <div className="row">
            <div className="col-12 col-xl-8">
            <div className="row">
                <div className="col-12 mb-4">
                <div className="d-flex justify-content-between mx-2">                   
                    <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="setoresSelect"
                    onChange={()=>{getVagas('A')}}>
                    {resposta2.map((link, index) => (
                        <option value={link.setores} key={index}>Setor: {link.setores}</option>
                    ))}
                    </select>
                        
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
                                    <th className="border-bottom" scope="col">Tempo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resposta.map((vaga , index) => (  
                                <tr key={index} onClick={()=>{estaciona(vaga.numero, vaga.id_vaga_veiculo, vaga.temporestante)}}> 
                                    <th className="text-white" scope="row" style={{ backgroundColor: vaga.corvaga, color: vaga.cor }}>{vaga.numero}</th>
                                    <td className="fw-bolder text-gray-500" style={{ backgroundColor: vaga.corline, color: vaga.cor}}>{vaga.placa}</td>
                                    <td className="fw-bolder text-gray-500" style={{ backgroundColor: vaga.corline, color: vaga.cor}}>{vaga.chegada}</td>
                                    <td className="fw-bolder text-gray-500 fontbold" style={{ backgroundColor: vaga.corline, color: vaga.cor}}>{vaga.temporestante}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div className="alert alert-danger" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                {mensagem}
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
);
}
        
export default ListarVagasMonitor;