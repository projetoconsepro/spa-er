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
    const [tolerancia, setTolerancia] = useState(10);

    const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "monitor"
        }
    })

    //setTimeout(() => {
      //  window.location.reload();
    //}, 30000);

    const getVagas = async (setor) => {
        const setor2 = document.getElementById('setoresSelect').value;
        if(setor2 !== undefined && setor2 !== null && setor2 !== ''){
            setor = setor2;
        for(let i = 0; i < resposta.length; i++){
                delete resposta[i];
        }
    }
    setSalvaSetor(setor);
        await requisicao.get(`/vagas?setor=${setor}`
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
                        const date = new Date();
                        resposta[i].Countdown= "";
                    }
                    else{
                        if (response.data.data[i].numero_notificacoes_pendentes !== 0){
                            resposta[i].display = 'testeNot';
                            resposta[i].numero_notificacoes_pendentes = response.data.data[i].numero_notificacoes_pendentes;
                        }
                        else {
                            resposta[i].display = 'testeNot2';
                            resposta[i].numero_notificacoes_pendentes = 0;
                        }
                        resposta[i].id_vaga_veiculo = response.data.data[i].id_vaga_veiculo;
                        resposta[i].chegada = response.data.data[i].chegada;
                        resposta[i].placa = response.data.data[i].placa;
                        resposta[i].temporestante = (response.data.data[i].temporestante);
                        resposta[i].tempo = (response.data.data[i].tempo);

                        const horasplit = resposta[i].temporestante.split(':');

                        if(resposta[i].temporestante === '00:00:00'){
                            resposta[i].corline = '#F8D7DA';
                            resposta[i].cor = '#842029';
                        }
                        else if (horasplit[0] === '00'){
                            const minutos = parseInt(horasplit[1]);
                            if(minutos <= tolerancia){
                                resposta[i].corline = '#FFF3CD';
                                resposta[i].cor = '#664D03';
                            }
                            else {
                                resposta[i].corline = '#D1E7DD';
                                resposta[i].cor = '#0F5132';
                            }
                        }
                        else if (horasplit[0] !== '00'){
                            resposta[i].corline = '#D1E7DD';
                                resposta[i].cor = '#0F5132';
                        }
                        else{
                            resposta[i].corline = '#fff';
                            resposta[i].cor = '#000';
                        }
                        if(resposta[i].numero_notificacoes_pendentes !== 0){
                            resposta[i].corline = '#000';
                            resposta[i].cor = '#fff';
                        }

                        const tempo = resposta[i].temporestante.split(':');
                        const data = new Date();
                        const ano = data.getFullYear();
                        const mes = data.getMonth() + 1;
                        const dia = data.getDate();
                        tempo[0] = (parseInt(tempo[0].replace(0, '')));
                        tempo[1] = (parseInt(tempo[1].replace(0, '')))
                        let minuto = data.getMinutes() + tempo[1];
                        if (minuto >= 60 ) {
                            tempo[0] = tempo[0] + 1;
                            minuto = minuto - 60;
                        }
                        const hora = data.getHours() + tempo[0];
                        const formatada = ano + "-" + mes + "-" + dia + " " + hora + ":" + minuto + ":00";
                        const formatada2 = (hora * 3600) + (minuto * 60);
                        resposta[i].Countdown = formatada;
                        console.log(formatada)
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
        requisicao.get('/setores'
        ).then(
            response => {
                for (let i = 0; i < response?.data?.data?.setores?.length; i++) {
                    resposta2[i] = {};
                    resposta2[i].setores = response.data.data.setores[i].nome;
                }
            }
        ).catch(function (error){
            console.log(error);
        }
        );

        requisicao.get('setores/tolerancia').then(
            response => {
                const timestamp = response.data.data.tolerancia;
                const data = new Date(timestamp * 1000);
                const minutes = data.getMinutes();
                const teste = parseInt(minutes)
                setTolerancia(teste);
            }
        ).catch(function (error) {
            console.log(error);
        });
        const setor = 'A'
        getVagas(setor);
    }, [])

    const estaciona = (numero, id_vaga, tempo, placa) => {
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
                    requisicao.post(`/estacionamento/saida`, {
                        idvagaVeiculo: id_vaga
                    }).then(
                        response => {
                            if(response.data.msg.resultado){
                            Swal.fire('Veículo liberado', '', 'success')
                            setTimeout(() => {
                                window.location.reload();
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
                  localStorage.setItem('id_vagaveiculo', id_vaga);
                  localStorage.setItem('vaga', numero);
                  localStorage.setItem('placa', placa);
                  localStorage.setItem('idVagaVeiculo', id_vaga);
                  localStorage.setItem('componente', 'Notificacao');
                  window.location.reload();
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
                                <tr key={index} onClick={()=>{estaciona(vaga.numero, vaga.id_vaga_veiculo, vaga.temporestante ,vaga.placa)}}> 
                                    <th className="text-white"scope="row" style={{ backgroundColor: vaga.corvaga, color: vaga.cor }}>{vaga.numero}</th>
                                    <td className="fw-bolder" style={{ backgroundColor: vaga.corline, color: vaga.cor}}>{vaga.placa} <small id={vaga.display}>{vaga.numero_notificacoes_pendentes}</small></td>
                                    <td className="fw-bolder" style={{ backgroundColor: vaga.corline, color: vaga.cor}}>{vaga.chegada}</td>
                                    <td className="fw-bolder" style={{ backgroundColor: vaga.corline, color: vaga.cor}}><Countdown date={vaga.Countdown}/></td>
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