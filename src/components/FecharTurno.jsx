import axios from 'axios'
import {React, useState, useEffect} from 'react'
import Swal from 'sweetalert2'

const FecharTurno = () => {
    const [estadoTurno, setEstadoTurno] = useState(true);
    const [estadoCaixa, setEstadoCaixa] = useState(true);
    const [abrirTurno, setAbrirTurno] = useState(false);
    const [estadoSelect, setEstadoSelect] = useState(false);
    const [setorSelecionado, setSetorSelecionado] = useState("");
    const [setorSelecionado2, setSetorSelecionado2] = useState("");
    const [resposta2, setResposta2] = useState([]);
    const [confirmFecharCaixa, setConfirmFecharCaixa] = useState(false);
    const [tempoAtual, setTempoAtual] = useState("");
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    useEffect(() => {
        setTempoAtual(localStorage.getItem('horaTurno'))

        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        })
        requisicao.get('/setores'
        ).then(
            response => {
                console.log(response)
                for (let i = 0; i < response?.data?.data?.setores?.length; i++) {
                    resposta2[i] = {};
                    resposta2[i].setores = response.data.data.setores[i].nome;
                    resposta2[i].id_setores = response.data.data.setores[i].id_setor;
                }
            }
        ).catch(function (error) {
            console.log(error)
        }
        );
    }, [])

    const setarSetor = () => {
        const setor2 = document.getElementById("setoresSelect2").value;
        localStorage.setItem("setorTurno", setor2)

        const setorA = resposta2.find((setor) => setor.setores === setor2);
        const setorId2 = setorA && setorA.id_setores;
        console.log(setorId2)
        setSetorSelecionado(setorId2)
    }

    const fecharTurno = () => {

        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        })
        requisicao.post('/turno/fechar',{
            hora: tempoAtual,
            }
        ).then(
            response => {
               console.log(response)
               if(response.data.msg.resultado === true){
                    setEstadoTurno(false)
                    setEstadoSelect(true)
                    setAbrirTurno(true)
               }
            }
        ).catch(function (error) {
            console.log(error)
        }
        );
    }

    const abrirTurno2 = () => {
         //parametros requisicao
         const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        })
        //abrir turno

        requisicao.post('/turno/abrir',{
            hora: tempoAtual,
            idSetor: setorSelecionado
            }
        ).then(
            response => {
               if(response.data.msg.resultado === true){
                localStorage.setItem("horaTurno", tempoAtual)
                localStorage.setItem("componente", "ListarVagasMonitor")
               }
            }
        ).catch(function (error) {
            console.log(error)
        }
        );

        const data = new Date();
        let hora = data.getHours();
        if(hora < 10){
            hora = "0" + hora;
        }
        let minuto = data.getMinutes();
        if(minuto < 10){
            minuto = "0" + minuto;
        }
        let segundos = data.getSeconds();
        if(segundos < 10){
            segundos = "0" + segundos;
        }
        const horaAtual = hora + ":" + minuto + ":" + segundos;
        setTempoAtual(horaAtual);
    }

    const fecharCaixa = () => {
        //parametros requisicao
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        })
        
        requisicao.get('/turno/caixa').then(
            response => {
               console.log(response)
               setConfirmFecharCaixa(true)
               setEstadoCaixa(false)
            }
        ).catch(function (error) {
            console.log(error)
        }
        );
    }

    const abrirCaixa2 = () => {

        setConfirmFecharCaixa(false)
    }

  return (
    <div className="container">
    <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
        <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="row">
                <div className="col-12">
                    <h5 className="mt-1">Fechar turno</h5>
                </div>
                <div className="col-12">
                    <h6 className="mt-2 text-start">Nome do monitor: {user2.nome}</h6>
                </div>
                <div className="col-12">
                    <p className="mt-2 text-start">Turno iniciado as: {tempoAtual}</p>
                </div>
            </div>
                <div>

                    {estadoSelect === true ? 
                    <div className="row mt-4">
                <div className="col-12">
                    <h6 className="text-start">Escolha seu setor:</h6>
                </div>
                <div className="col-6">
                <select className="form-select form-select-sm mb-3 mt-2" aria-label=".form-select-lg example" id="setoresSelect2"
                onChange={() => {setarSetor()}}>

                    {resposta2.map((link, index) => (
                    <option value={link.setores} key={index}>Setor: {link.setores}</option>
                    ))}
                    </select>
                </div>
                </div> : null}

                </div>
                    <div>
                    {estadoTurno === true ? <button type="button" className="btn4 botao mt-3" onClick={() => {fecharTurno()}}>Fechar turno</button> : <button type="button" className="btn4 botao mt-3" onClick={() => {abrirTurno2()}}>Abrir turno</button>}
                    {estadoCaixa === true ? <button type="button" className="btn7 botao mt-3" onClick={() => {fecharCaixa()}}>Fechar caixa</button> : null}
                    </div>

                    <div>
                    
                    </div>

                    <div>
                    {confirmFecharCaixa === true ?
                        <div className="align-items-center justify-content-between pb-3 mt-4">

                            <div className="row justify-content-center align-items-center">
                                <div className="col-12">
                                    <h6 className="text-start">Confirmar fechamento de caixa:</h6>
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center">
                                <div className="col-12">
                                    <h6 className="mt-4 text-start">Você inicou o caixa com: R$00,00</h6>
                                </div>
                                <div className="col-12">
                                    <h6 className="mt-4 text-start">Saldo fechamento: R$00,00</h6>
                                </div>
                                <div className="col-12">
                                    <h6 className="mt-4 text-start">Quantidade a ser devolvida: R$00,00</h6>
                                </div>
                                <div className="col-12">
                                <button type="button" className="btn6 botao mt-3"  onClick={() => {abrirCaixa2()}}>Confirmar</button>
                                </div>
                            </div>
                        </div> : null}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FecharTurno