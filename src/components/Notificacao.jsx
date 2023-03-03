import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiFillCamera } from 'react-icons/ai';
import { FaCarAlt } from 'react-icons/fa';
import arrayCores from './cores';

const Notificacao = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [vaga, setVaga] = useState([]);
    const [vagaVeiculo, setVagaVeiculo] = useState("");
    const [dados, setDados] = useState(true);
    const [seminfo, setSemInfo] = useState(false);
    const [infoBanco, setInfoBanco] = useState(false);
    const [placa, setPlaca] = useState("");
    const [imagens] = useState([]);
    const [modelo, setModelo] = useState([]);
    const [cor, setCor] = useState([]);
    const [cor2, setCor2] = useState("");
    const [fabricante, setFabricante] = useState([]);
    const [tipoNot, setTipoNot] = useState("1");
    const [tiposNotificacao, setTiposNot] = useState([]);
    let [cont, setCont] = useState(0);
    const [outro, setOutro] = useState (true);

    const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "monitor"
        }
    });

    const submit = async () => {
        console.log(tipoNot)
        console.log(vagaVeiculo)
        if (vagaVeiculo !== null && vagaVeiculo !== undefined && vagaVeiculo !== "") { 
        requisicao.post('/notificacao', {
            "id_vaga_veiculo": vagaVeiculo,
            "id_tipo_notificacao": tipoNot,
            "imagens": imagens,
    }).then(
            response => {
                if(response.data.msg.resultado === true){
                    localStorage.setItem("componente", "ListarVagasMonitor");
                    localStorage.removeItem("vaga");
                    localStorage.removeItem("id_vagaveiculo");
                    localStorage.removeItem("placa");
                    for (let i = 0; i < 6; i++) {
                        localStorage.removeItem(`foto${i}`);
                    }
                    window.location.reload();
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
            console.log(error);
        });
    }
    else{
        console.log(vaga)
        requisicao.post('/notificacao', {
            "placa": placa,
            "vaga": vaga,
            "id_tipo_notificacao": tipoNot,
            "imagens": imagens,
    }).then(
            response => {
                if(response.data.msg.resultado === true){
                    localStorage.setItem("componente", "ListarVagasMonitor");
                    localStorage.removeItem("vaga");
                    localStorage.removeItem("id_vagaveiculo");
                    localStorage.removeItem("placa");
                    for (let i = 0; i < 6; i++) {
                        localStorage.removeItem(`foto${i}`);
                    }
                    window.location.reload();
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
            console.log(error);
        });
    }

}

    const back = () => {
        localStorage.setItem("componente", "ListarVagasMonitor");
        localStorage.removeItem("vaga");
        localStorage.removeItem("id_vagaveiculo");
        localStorage.removeItem("placa");
        for (let i = 0; i < 6; i++) {
            localStorage.removeItem(`foto${i}`);
        }
        window.location.reload();
    }

    const renderCamera = () => {
        localStorage.setItem("componente", "Camera");
        window.location.reload();
    }

    const pegarFotos = async () => {
        for (let i = 0; i < 6; i++) {
            if (localStorage.getItem(`foto${i}`) !== null) {
                imagens.push(localStorage.getItem(`foto${i}`));
            }
        }

    }

    const getTipoNot= () => {
        const tipoNotificacao = document.getElementById('tiposNot').value;
        console.log(tipoNotificacao)
        setTipoNot(tipoNotificacao);
    }

    const getModelos = () => {
        const fabricante = document.getElementById('fabricantes').value;
        console.log(fabricante)
        requisicao.get(`/veiculo/modelos/${fabricante}`).then(
            response => {
                const newData = response?.data?.data?.modelos.map(item => ({
                    nome: item.nome,
                    id_modelo: item.id_modelo
                }));
                setModelo(newData);
            }
        ).catch(function (error){
            console.log(error);
        });
    }

    const getCor = () => {
        const newData = arrayCores.map(item => ({
            cor: item.cor,
    }));
    setCor(newData);
}

    useEffect(() => {
        getCor();
        requisicao.get('/notificacao/tipos').then(
            response => {
                const newData = response?.data?.data?.map(item => ({
                    nome: item.nome,
                    id_tipo_notificacao: item.id_tipo_notificacao
                  }));
                setTiposNot(newData);
            }
        ).catch(function (error){
            console.log(error);
        });
        
        requisicao.get('/veiculo/fabricantes').then(
            response => {
                console.log(response?.data?.data.fabricantes)
                const newData = response?.data?.data?.fabricantes.map(item => ({
                    nome: item.nome,
                    id_fabricante_veiculo: item.id_fabricante_veiculo
                    }));
                setFabricante(newData);
            }
        ).catch(function (error){
            console.log(error);
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
            console.log(error);
        });

        //
        //requisicao info veiculos
        //

        const getVaga = localStorage.getItem("vaga");
        const getPlaca = localStorage.getItem("placa");
        const getVagaVeiculo = localStorage.getItem("id_vagaveiculo");
        if (getVaga !== null && getPlaca !== null) {
            setVagaVeiculo(getVagaVeiculo)
            setSemInfo(true);
            setPlaca(getPlaca);
            setVaga(getVaga);
        }
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
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            {dados ?
                                <div>
                                    <div className="h5 mt-2 align-items-center">
                                        <small>Notificação</small>
                                        <p>Veículo selecionado: {placa}</p>
                                        <p><small>Vaga selecionada: {vaga}</small></p>
                                    </div>
                                    <div className='text-start bg-gray-200 text-dark rounded'>
                                        {infoBanco ?
                                        <div class="row justify-content-center">
                                            <div className="col-8">
                                                <h6 className='mx-3 pt-2'><small>Modelo: {modelo}</small></h6>
                                                <h6 className='mx-3'><small>Cor: {cor}</small></h6>
                                                <h6 className='mx-3 pb-2'><small>Fabricante: {fabricante}</small></h6>
                                            </div>
                                            <div className="col-4 text-center pt-3 mt-3">
                                                <FaCarAlt size={35} />
                                            </div>
                                        </div>
                                        : 
                                        <div class="row justify-content-center">
                                        <div className="col-8">
                                            <div onChange={()=>{getModelos()}}>
                                            <h6 className='mx-4 mt-3'><small>Fabricante:</small></h6>
                                            <select class="form-select form-select-sm mb-3 mx-3" aria-label=".form-select-lg example" id="fabricantes">
                                        {fabricante.map((link, index) => (
                                            <option value={link.id_fabricante_veiculo} key={index}>{link.nome}</option>
                                        ))}
                                            </select>
                                            </div>
                                            <div>
                                            <h6 className='mx-4'><small>Modelo:</small></h6>
                                            <select class="form-select form-select-sm mb-3 mx-3" aria-label=".form-select-lg example">
                                        {modelo.map((link, index) => (
                                            <option value={link.id_modelo} key={index}>{link.nome}</option>
                                        ))}
                                            </select>
                                            </div>
                                            {outro ?
                                            <div  onChange={()=>{attcor()}}>
                                            <h6 className='mx-4'><small>Cor:</small></h6>
                                            <select class="form-select form-select-sm mb-3 mx-3" aria-label=".form-select-lg example" id="selectCores">
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
                                    <div className="h6 mt-3" onChange={getTipoNot}>
                                        <p className='text-start'>Tipo de notificação:</p>
                                       <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="tiposNot">
                                    {tiposNotificacao.map((link, index) => (
                                            <option value={link.id_tipo_notificacao} key={index}>{link.nome}</option>
                                        ))}
                                </select>
                                    </div>
                                    <div className="h6 mt-5">
                                        <button type="submit" className="btn4 botao" onClick={renderCamera}>Tirar fotos do veículo <AiFillCamera /></button>
                                    </div>
                                    <div className='row'>
                                        {imagens.map((imagem, key) => (
                                            <div key={key} className="col">
                                                {imagem !== null ?
                                                        <img src={imagem} alt="foto" />
                                                    : null}
                                            </div>
                                        ))}

                                    </div>
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
                                                <button type="submit" className="btn3 botao" onClick={() => { setDados(true) }}>Buscar dados</button>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className="form-group mb-4">
                                                <label htmlFor="email" id="labelLogin">Placa do veiculo:</label>
                                                <div className="input-group">
                                                    <input className="form-control" name="placa" value={placa} onChange={(e) => setPlaca(e.target.value)} id="fonteInputPlaca" placeholder="Digite a placa do veículo" />
                                                </div>
                                            </div>
                                            <div className="form-group mb-4">
                                                <label htmlFor="email" id="labelLogin">Vaga:</label>
                                                <div className="input-group">
                                                    <input className="form-control" name="vaga" value={placa} onChange={(e) => setPlaca(e.target.value)} id="fonteInputPlaca" placeholder="Digite a vaga que o veículo está" />
                                                </div>
                                            </div>
                                            <div className="h6 mt-3">
                                                <button type="submit" className="btn4 botao" onClick={() => { setDados(true) }}>Buscar dados</button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Notificacao