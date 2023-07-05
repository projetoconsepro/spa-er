import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiFillCamera } from 'react-icons/ai';
import { FaCarAlt, FaEdit } from 'react-icons/fa';
import arrayCores from '../services/cores';
import VoltarComponente from '../util/VoltarComponente';
import FuncTrocaComp from '../util/FuncTrocaComp';
import { Button, Loader } from '@mantine/core';
import ImpressaoTicketNotificacao from '../util/ImpressaoTicketNotificacao';

const Notificacao = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [vaga, setVaga] = useState([]);
    const [vagaVeiculo, setVagaVeiculo] = useState("");
    const [dados, setDados] = useState(false);
    const [seminfo, setSemInfo] = useState(false);
    const [infoBanco, setInfoBanco] = useState(false);
    const [imagensSalvas, setImagenSalvas] = useState(false);
    const [placa, setPlaca] = useState("");
    const [imagens, setImagens] = useState([]);
    const [modelo, setModelo] = useState([]);
    const [modeloVeiculo, setModeloVeiculo] = useState("");
    const [cor, setCor] = useState([]);
    const [corVeiculo, setCorVeiculo] = useState("");
    const [cor2, setCor2] = useState("");
    const [fabricante, setFabricante] = useState([]);
    const [fabricanteVeiculo, setFabricanteVeiculo] = useState("");
    const [tipoNot, setTipoNot] = useState("1");
    const [tiposNotificacao, setTiposNot] = useState([]);
    const [outro, setOutro] = useState (true);
    const [estado2, setEstado2] = useState(false);
    let [cont, setCont] = useState(0);

    const submit = async () => {
        setEstado2(true)
        if(imagens.length === 0){
                setEstado2(false)
                setMensagem("Necessário retirar fotos do veículo")
                setEstado(true)
                setTimeout(() => {
                    setEstado(false);
                    setMensagem("");
                }, 4000);
        } else {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        });
        if (!infoBanco) {
                const getmodelo = document.getElementById("selectModelos").value;
                const getfabricante = document.getElementById("selectFabricantes").value;
            if (outro === true) {
                const getcor = document.getElementById("selectCores").value;
                if (getmodelo === "" || getfabricante === "" || getcor === "") {
                    setMensagem("Necessário selecionar modelo, fabricante e cor")
                    setEstado(true)
                    setTimeout(() => {
                        setEstado(false);
                        setMensagem("");
                    }, 4000);
                    return;
                }
        requisicao.post(`/veiculo/${placa}`, {
            "placa": placa,
             "modelo": {
                "idModelo": getmodelo,
                "fabricante": {
                    "idFabricante": getfabricante,
                }
            },
            "cor": getcor,
    }).then(
            response => {
                console.log(response, 'olha só em')
            }
        ).catch(function (error) {
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
        });
    }
    else{
        if (getmodelo === "" || getfabricante === ""){
            setMensagem("Necessário selecionar modelo e fabricante")
            setEstado(true)
            setTimeout(() => {
                setEstado(false);
                setMensagem("");
            }, 4000);
            return;
        }
        requisicao.post(`/veiculo/${placa}`, {
            "placa": placa,
             "modelo": {
                "idModelo": getmodelo,
                "fabricante": {
                    "idFabricante": getfabricante,
                }
            },
            "cor": cor2,
        }).then(
            response => {
            console.log(response, 'olha só em2')
        }
        ).catch(function (error) {
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
        });
    }
    }
    if (imagens.length !== 0) {
        if (vagaVeiculo !== null && vagaVeiculo !== undefined && vagaVeiculo !== "") { 
        requisicao.post('/notificacao', {
            "id_vaga_veiculo": vagaVeiculo,
            "id_tipo_notificacao": tipoNot,
            "imagens": imagens,
    }).then(
            response => {
                setEstado2(false)
                if(response.data.msg.resultado === true){
                    if(response.data.data.id_notificacao !== undefined){
                        const id = response.data.data.id_notificacao
                        localStorage.setItem('id_notificacao', id)
                    }
                    ImpressaoTicketNotificacao(response.config.headers.id_usuario, vaga, placa)
                    FuncTrocaComp( "CameraTicketNotificacao");
                    localStorage.removeItem("vaga");
                    localStorage.removeItem("id_vagaveiculo");
                    localStorage.removeItem("placa");
                    for (let i = 0; i < 6; i++) {
                        localStorage.removeItem(`foto${i}`);
                    }
                    
                }
                else {
                    setMensagem(response.data.msg.msg)
                    setEstado(true)
                    setTimeout(() => {
                        setEstado(false);
                        setMensagem("");
                    }, 4000);
                }
            }).catch(function (error) {
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
        });
    } else{
        requisicao.post('/notificacao', {
            "placa": placa,
            "vaga": vaga,
            "id_tipo_notificacao": tipoNot,
            "imagens": imagens,
    }).then(response => {
                setEstado2(false)
                if(response.data.msg.resultado === true){
                    if(response.data.data.id_notificacao !== undefined){
                        const id = response.data.data.id_notificacao
                        localStorage.setItem('id_notificacao', id)
                    }
                    ImpressaoTicketNotificacao(response.config.headers.id_usuario, vaga, placa)
                    FuncTrocaComp("CameraTicketNotificacao");
                    localStorage.removeItem("vaga");
                    localStorage.removeItem("id_vagaveiculo");
                    localStorage.removeItem("placa");
                    for (let i = 0; i < 6; i++) {
                        localStorage.removeItem(`foto${i}`);
                    }
                    
                }
                else {
                    setMensagem(response.data.msg.msg)
                    setEstado(true)
                    setTimeout(() => {
                        setEstado(false);
                        setMensagem("");
                    }, 4000);
                }
            }).catch(function (error) {
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
        });
    }
 } else {
    setMensagem("Necessário retirar fotos do veículo")
    setEstado(true)
    setTimeout(() => {
        setEstado(false);
        setMensagem("");
    }, 4000);
 }
}
}

    const back = () => {
        FuncTrocaComp( "ListarVagasMonitor");
        localStorage.removeItem("vaga");
        localStorage.removeItem("id_vagaveiculo");
        localStorage.removeItem("placa");
        for (let i = 0; i < 6; i++) {
            localStorage.removeItem(`foto${i}`);
        }
        
    }

    const renderCamera = () => {
        FuncTrocaComp( "Camera");  
    }

    const pegarFotos = async () => {
        for (let i = 0; i < 6; i++) {
            if (localStorage.getItem(`foto${i}`) !== null) {
                imagens.push(localStorage.getItem(`foto${i}`));
            }
        }
     if (imagens.length !== 0) {
        setImagenSalvas(true);
    }
    else {
        setImagenSalvas(false);
    }
}

    const getTipoNot= () => {
        const tipoNotificacao = document.getElementById('tiposNot').value;
        setTipoNot(tipoNotificacao);
    }

    const getModelos = () => {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        });
        const fabricante = document.getElementById('selectFabricantes').value;
        requisicao.get(`/veiculo/modelos/${fabricante}`).then(
            response => {
                const newData = response?.data?.data?.modelos.map(item => ({
                    nome: item.nome,
                    id_modelo: item.id_modelo
                }));
                console.log('newdata2', newData)
                setModelo(newData);
            }
        ).catch(function (error){
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });
    }

    const getCor = () => {
        const newData = arrayCores.map(item => ({
            cor: item.cor,
    }));
    setCor(newData);
}


    const SetdadosTrue = () => {
        setEstado2(true)
        let vaga2 = vaga;
        const placaString = placa.toString()
        const placaMaiuscula = placaString.toUpperCase();
        const placaLimpa = placaMaiuscula.replace(/[^a-zA-Z0-9]/g, '');
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        });
        if(vaga.length === 0){
            vaga2[0] = [0]
        }
        console.log(vaga)
        requisicao.get(`/vagas/verifica/${vaga2}`).then(
            response => {
                if(response.data.msg.resultado){
                    setEstado2(false)
                    setPlaca(placaLimpa);   
                    setVaga(vaga);
                    localStorage.setItem("vaga" , vaga);
                    localStorage.setItem("placa", placaLimpa);
                    setDados(true);
                } else {
                    setEstado2(false)
                    setMensagem(response.data.msg.msg)
                    setEstado(true)
                    setTimeout(() => {
                        setEstado(false);
                        setMensagem("");
                    }, 4000);
                }
            })
    }

    useEffect(() => {
        if (localStorage.getItem("turno") !== 'true' && user2.perfil[0] === "monitor") {
            FuncTrocaComp("FecharTurno");
        }
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        });
        getCor();
        if (localStorage.getItem("placa") !== null && localStorage.getItem("placa") !== undefined && localStorage.getItem("placa") !== "" || localStorage.getItem("vaga") !== null) {
        
        const getVaga = localStorage.getItem("vaga");
        const getPlaca = localStorage.getItem("placa");
        const getVagaVeiculo = localStorage.getItem("id_vagaveiculo");
        setDados(true);

        if (getVaga !== null && getPlaca !== null) {
            setVagaVeiculo(getVagaVeiculo)
            setSemInfo(true);
            setPlaca(getPlaca);
            setVaga(getVaga);
        }
        
        requisicao.get(`/veiculo/${getPlaca}`).then(
            response => {
                if(response.data.msg.resultado === true){
                    setInfoBanco(true);
                    setCorVeiculo(response.data.data[0].cor)
                    setModeloVeiculo(response.data.data[0].modelo.modelo)
                    setFabricanteVeiculo(response.data.data[0].modelo.fabricante.fabricante)
                }
                else{
                    setInfoBanco(false);
                }
            }
        ).catch(function (error){
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });
    }
    else {
        setDados(false);
    }


        requisicao.get('/notificacao/tipos').then(
            response => {
                const newData = response?.data?.data?.map(item => ({
                    nome: item.nome,
                    id_tipo_notificacao: item.id_tipo_notificacao
                  }));
                setTiposNot(newData);
            }
        ).catch(function (error){
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });
        
        requisicao.get('/veiculo/fabricantes').then(
            response => {
                const newData = response?.data?.data?.fabricantes.map(item => ({
                    nome: item.nome,
                    id_fabricante_veiculo: item.id_fabricante_veiculo
                    }));
                setFabricante(newData);
            }
        ).catch(function (error){
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });

        requisicao.get(`/veiculo/modelos/1`).then(
            response => {
                const newData = response?.data?.data?.modelos.map(item => ({
                    nome: item.nome,
                    id_modelo: item.id_modelo
                }));
                setModelo(newData);
            }
        ).catch(function (error){
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });
        if (cont === 0) {
            pegarFotos();
        }
        setCont(cont++);
    }, [])

    const attcor = () => {

        const cor = document.getElementById('selectCores').value;
        if (cor === "Outra") {
            setOutro(false);
        }
    }


    return (
        <section className="vh-lg-100 mt-2 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            {dados ?
                                <div>
                                    <div className="h5 mt-2 align-items-center">
                                        <small>Notificação</small>
                                        <p>Veículo selecionado: {placa}</p>
                                        <p><small>Vaga selecionada: {vaga}</small></p>
                                    </div>
                                    <div className="h6 mt-3">
                                        <button type="submit" className="btn4 botao" onClick={renderCamera}>Tirar fotos do veículo <AiFillCamera /></button>
                                    </div>
                                    <div className='row pb-3'>
                                        {imagens.map((imagem, key) => (
                                            <div key={key} className="col">
                                                {imagem !== null ?
                                                        <img src={imagem} alt="foto" />
                                                    : null}
                                            </div>
                                        ))}

                                    </div>
                                    {imagensSalvas ? 
                                    <div>
                                        <div className="h6" onChange={getTipoNot}>
                                            <p className='text-start'>Tipo de notificação:</p>
                                            <select className="form-select form-select-sm mb-3" aria-label=".form-select-sm example" id="tiposNot">
                                            {tiposNotificacao.map((link, index) => (
                                            <option value={link.id_tipo_notificacao} key={index}>{link.nome}</option>
                                            ))}
                                            </select>
                                        </div>
                                    <div className='text-start bg-gray-200 text-dark rounded'>
                                    {infoBanco ?
                                        <div className="row justify-content-center">
                                            <div className="col-7">
                                                <h6 className='mx-3 pt-2'><small>Modelo: {modeloVeiculo}</small></h6>
                                                <h6 className='mx-3'><small>Cor: {corVeiculo}</small></h6>
                                                <h6 className='mx-3 pb-2'><small>Fabricante: {fabricanteVeiculo}</small></h6>
                                            </div>
                                            <div className="col-3 text-center pt-3 mt-3">
                                                <FaCarAlt size={35} />
                                                </div>
                                            <div className="col-2 pt-3 mt-5">
                                                <FaEdit size={20} className='mt-2' onClick={()=>{setInfoBanco(false)}}/>
                                            </div>
                                        </div>
                                        : 
                                        <div className="row justify-content-center">
                                        <div className="col-8">
                                            <div onChange={()=>{getModelos()}}>
                                            <h6 className='mx-4 mt-3'><small>Fabricante:</small></h6>
                                            <select className="form-select form-select-sm mb-3 mx-3" aria-label=".form-select-sm example" id="selectFabricantes">
                                            <option value="">Selecione um fabricante</option>
                                        {fabricante.map((link, index) => (
                                            <option value={link.id_fabricante_veiculo} key={index}>{link.nome}</option>
                                        ))}
                                            </select>
                                            </div>
                                            <div>
                                            <h6 className='mx-4'><small>Modelo:</small></h6>
                                            <select className="form-select form-select-sm mb-3 mx-3" aria-label=".form-select-sm example" id="selectModelos">
                                            <option value="">Selecione um modelo</option>
                                            {modelo.map((link, index) => (
                                            <option value={link.id_modelo} key={index}>{link.nome}</option>
                                        ))}
                                            </select>
                                            </div>
                                            {outro ?
                                            <div  onChange={()=>{attcor()}}>
                                            <h6 className='mx-4'><small>Cor:</small></h6>
                                            <select className="form-select form-select-sm mb-3 mx-3" aria-label=".form-select-sm example" id="selectCores">
                                            <option value="">Selecione uma cor</option>
                                            {cor.map((link, index) => (
                                                <option value={link.cor} key={index}>{link.cor}</option>
                                            ))}
                                            </select>
                                            </div>
                                            :
                                            <div>
                                            <h6 className='mx-4'><small>Cor:</small></h6>
                                            <input type="text" className="form-control mx-3 mb-3" id="infoVeiculos" placeholder="Outra cor" value={cor2} onChange={(e) => setCor2(e.target.value)}/>
                                            </div>
                                            }
                                        </div>
                                        <div className="col-4 text-center pt-6 mt-4">
                                            <FaCarAlt size={35} />
                                        </div>
                                    </div>
                                        }

                                    </div>
                                    </div>
                                    : null}
                                    <div className="mt-4 mb-5 gap-2 d-md-block">
                                        <button type="submit" className="btn2 botao" onClick={back}>Cancelar</button>
                                        <button type="submit" className="btn3 botao" onClick={submit}>Confirmar</button>
                                    </div>
                                    <div className="alert alert-danger" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                        {mensagem}
                                    </div>
                                </div>
                                :
                                <div className="h5 mt-2 align-items-center">
                                    {seminfo ?
                                        <div>
                                            <div className="h5 mt-2 align-items-center">
                                                <small>Notificação</small>
                                                <p>Veículo selecionado: {placa}</p>
                                                <p> <small>Vaga selecionada: {vaga}</small></p>
                                            </div>
                                            <div className="h6 mt-3">
                                                <button type="submit" className="btn3 botao" onClick={() => { setDados(true) }}>Buscar</button>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className="form-group mb-4">
                                                <label id="labelLogin">Placa do veiculo:</label>
                                                <div className="input-group">
                                                    <input className="form-control" name="placa" value={placa} onChange={(e) => setPlaca(e.target.value)} id="fonteInputPlaca" placeholder="Digite a placa do veículo" />
                                                </div>
                                            </div>
                                            <div className="form-group mb-4">
                                                <label id="labelLogin">Vaga:</label>
                                                <div className="input-group">
                                                    <input className="form-control" name="vaga" value={vaga} onChange={(e) => setVaga(e.target.value)} id="fonteInputPlaca" placeholder="Digite a vaga que o veículo está" />
                                                </div>
                                            </div>
                                            <div className="pt-4 mb-6 gap-2 d-md-block">
                                                <VoltarComponente space={true} />
                                                <Button 
                                                loading={estado2} 
                                                onClick={() => { SetdadosTrue() }}
                                                loaderPosition="right"
                                                className="bg-blue-50"
                                                size="md"
                                                radius="md"
                                                >
                                                    Buscar
                                                </Button>
                                            </div>

                                            <div className="alert alert-danger fs-6" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                                {mensagem}
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                            <div style={{ display: estado2 ? 'block' : 'none'}}>
                                <Loader />
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </section>
    )
}

export default Notificacao;