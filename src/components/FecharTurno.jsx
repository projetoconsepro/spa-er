import axios from 'axios'
import {React, useState, useEffect} from 'react'
import Swal from 'sweetalert2'
import  FuncTrocaComp  from "../util/FuncTrocaComp";
import createAPI from '../services/createAPI';
import { Button } from '@mantine/core';
import { IconReceipt } from '@tabler/icons-react';

const FecharTurno = () => {
    const [estadoTurno, setEstadoTurno] = useState(true);
    const [estadoCaixa, setEstadoCaixa] = useState(true);
    const [abrirTurno, setAbrirTurno] = useState(false);
    const [estadoSelect, setEstadoSelect] = useState(false);
    const [setorSelecionado, setSetorSelecionado] = useState(1);
    const [resposta2, setResposta2] = useState([]);
    const [tempoAtual, setTempoAtual] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [estadoDiv, setEstadoDiv] = useState(false);
    const [Nome , setNome] = useState("");

    useEffect(() => {

        if (localStorage.getItem("turno") !== 'true' && localStorage.getItem("caixa") !== 'true') {
            FuncTrocaComp( "AbrirTurno")
        }
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const user2 = JSON.parse(user);
        setNome(user2.nome)

        if(localStorage.getItem("turno") === 'true'){
            setEstadoTurno(true)
            setEstadoSelect(false)
            setAbrirTurno(false)

        } else { 
            setEstadoTurno(false)
            setEstadoSelect(true)
            setAbrirTurno(true)
        }

        setTempoAtual(localStorage.getItem('horaTurno'))

        const requisicao = createAPI();
        requisicao.get('/setores'
        ).then(
            response => {
                for (let i = 0; i < response?.data?.data?.setores?.length; i++) {
                    resposta2[i] = {};
                    resposta2[i].setores = response.data.data.setores[i].nome;
                    resposta2[i].id_setores = response.data.data.setores[i].id_setor;
                }
            }
        ).catch(function (error) {
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        }
        );
    }, [])

    const setarSetor = () => {
        const setor2 = document.getElementById("setoresSelect2").value;
        localStorage.setItem("setorTurno", setor2)

        const setorA = resposta2.find((setor) => setor.setores === setor2);
        const setorId2 = setorA && setorA.id_setores;
        setSetorSelecionado(setorId2)
    }

    const fecharTurno = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const user2 = JSON.parse(user);
        localStorage.setItem("setorTurno", "A")
        setSetorSelecionado(1)
        const requisicao = createAPI();
        requisicao.post('/turno/fechar',{
            hora: tempoAtual,
            }
        ).then(
            response => {
               if(response.data.msg.resultado === true){
                    localStorage.setItem("turno", false)
                    setEstadoTurno(false)
                    setEstadoSelect(true)
                    setAbrirTurno(true)
               }
               else{
                setEstadoTurno(false)
                setEstadoSelect(true)
                setEstadoDiv(true)
                setMensagem(response.data.msg.msg)
                    setTimeout(() => {
                    setEstadoDiv(false)
                    setMensagem("")
                    }, 4000)
               }
            }
        ).catch(function (error) {
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        }
        );
    }

    const abrirTurno2 = () => {
        const requisicao = createAPI();

        requisicao.post('/turno/abrir',{
            hora: tempoAtual,
            idSetor: setorSelecionado
            }
        ).then(
            response => {
               if(response.data.msg.resultado === true){
                localStorage.setItem("turno", true)
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
                localStorage.setItem("horaTurno", horaAtual)
                FuncTrocaComp( "ListarVagasMonitor")
               }
               else{
                localStorage.setItem("turno", true)
                setEstadoTurno(true)
                setEstadoDiv(true)
                setEstadoSelect(false)
                setMensagem(response.data.msg.msg)
                    setTimeout(() => {
                    setEstadoDiv(false)
                    setMensagem("")
                    }, 4000)

            }
            }
        ).catch(function (error) {
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
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
        const requisicao = createAPI();

        requisicao.get('/turno/caixa').then(
            response => {
                if(response.data.msg.resultado){
                    const sim = parseFloat(response.data.caixa.valor_abertura) + parseFloat(response.data.caixa.valor_movimentos);
                    Swal.fire({
                        title: 'Confirmar fechamento de caixa',
                        showDenyButton: true,
                        html: `<div className="row justify-content-center align-items-center"> <div className="col-12"> <h6 class="text-start">Confirmar fechamento de caixa:</h6> </div> </div> <div className="row justify-content-center align-items-center"><div className="col-12"><h6 class="mt-4 text-start">Você inicou o caixa com: R$${response.data.caixa.valor_abertura}</h6></div><div className="col-12"><h6 class="mt-4 text-start">Saldo movimentos: R$${response.data.caixa.valor_movimentos}</h6></div><div className="col-12"><h4 class="mt-4 text-start">Saldo final: R$${sim}</h4></div><div className="col-12"></div></div></div>`,
                        confirmButtonText: `Confirmar`,
                        confirmButtonColor: '#28a745',
                        denyButtonText: `Cancelar`,
                        
                        }).then((result) => {
                        if (result.isConfirmed) {
                            requisicao.post('/turno/fechar',{
                                hora: tempoAtual,
                                caixa: {
                                    valor_movimentacao: sim,
                                }
                                }
                            ).then(
                                response => {
                                if(response.data.msg.resultado === true){
                                    Swal.fire('Caixa fechado com sucesso', '', 'success')
                                    localStorage.setItem("caixa", false)
                                    localStorage.setItem("turno", false)
                                    FuncTrocaComp( "AbrirTurno")
                                }
                                else{
                                    Swal.fire('Erro ao fechar caixa', `${response.data.msg.msg}`, 'error')
                                }
                                }
                            ).catch(function (error) {
                                            if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
                }
                );
            } else if (result.isDenied) {
                            
            }
            })
            }
            else {}
            }
        ).catch(function (error) {
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        }
        );
    }

    const testarImpressora = () => {
        const json = {
            tipo: 'TESTE',
        }
        if(window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(json));
        }
    }

  return (
    <div className="container">
    <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
        <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="row">
                <div className="col-12">
                    <h5 className="mt-1">{estadoSelect === true ? 'Abrir turno' : 'Fechar turno'}</h5>
                </div>
                <div className="col-12">
                    <h6 className="mt-2 text-start">Nome do monitor: {Nome}</h6>
                </div>
                <div className="col-12">
                    {localStorage.getItem("turno") === 'true' ? <h6 className="mt-2 text-start">Turno iniciado as: {tempoAtual}</h6> : null }
                </div>
                <div className="col-12">
                    {localStorage.getItem("turno") === 'true' ? <h6 className="mt-2 text-start">Setor atual: {localStorage.getItem("setorTurno")}</h6> : null }
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
                    {estadoTurno === true ? 
                    <button type="button" className="btn4 botao mt-3" onClick={() => {fecharTurno()}}>Fechar turno</button> 
                    : 
                    <button type="button" className="btn4 botao mt-3" onClick={() => {abrirTurno2()}}>Abrir turno</button>}
                    {estadoTurno === true ? 
                    <div>{estadoCaixa === true ? <button type="button" className="btn7 botao mt-3" onClick={() => {fecharCaixa()}}>Fechar caixa</button> : null}
                    </div>: null }   
                    <Button variant="gradient" gradient={{ from: 'orange', to: 'red' }} fullWidth mt="md" radius="md"
                    onClick={() => testarImpressora()}>
                    Testar impressão ‎ <IconReceipt size={18}/>
                    </Button>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <div className="alert alert-danger" id="sim" role="alert" style={{ display: estadoDiv ? 'block' : 'none' }}>
                                {mensagem}
                            </div>
    </div>
  )
}

export default FecharTurno;