import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiFillCamera } from 'react-icons/ai';
import { FaCarAlt, FaEdit, FaParking } from 'react-icons/fa';
import arrayCores from '../services/cores';
import VoltarComponente from '../util/VoltarComponente';
import FuncTrocaComp from '../util/FuncTrocaComp';
import { Button, Divider, Input, Loader, Select, Text } from '@mantine/core';
import ImpressaoTicketNotificacao from '../util/ImpressaoTicketNotificacao';
import createAPI from '../services/createAPI';

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
    const [fabricanteCerto, setFabricanteCerto] = useState('');
    const [modeloSelecionado, setModeloSelecionado] = useState('');
    const [modeloCerto, setModeloCerto] = useState('');
    const [tipoNotificacaoNome, setTipoNotificacaoNome] = useState("Tempo limite excedido");
    const [disabled, setDisabled] = useState(false);

  const handleModeloChange = (value) => {
    setModeloSelecionado(value);
    setTimeout(() => {
        getModelosOutro();
    }, 0);
}

    const getModelosOutro = () => {
        const modeloSelecionado = document.getElementById('selectModelos').value.toLowerCase();
        const modeloEncontrado = modelo.find(item => item.label.toLowerCase() === modeloSelecionado);
        if(modeloEncontrado !== undefined){
        setModeloCerto(modeloEncontrado.value);
        }
    }

    const submit = async () => {
        setDisabled(true);
        let modeloImpressao = "";
        let fabricanteImpressao = "";
        setEstado2(true)
        if(imagens.length === 0){
                setEstado2(false)
                setMensagem("Necessário retirar fotos do veículo")
                setEstado(true)
                setTimeout(() => {
                    setEstado(false);
                    setMensagem("");
                }, 4000);
            return;
        } 

        if (!infoBanco){
            if (modeloCerto === "" || cor === "") {
                setEstado2(false)
                setMensagem("Necessário selecionar modelo, fabricante e cor")
                setEstado(true)
                setTimeout(() => {
                    setEstado(false);
                    setMensagem("");
                }, 4000);
                return;
            }
        }

        const requisicao = createAPI();
        if (!infoBanco) {
                const getmodelo = modeloCerto;
                if (document.getElementById('selectCores') !== null && document.getElementById('selectCores') !== undefined){
                    const corSelect = document.getElementById('selectCores').value;
                    if(corSelect === ""){
                        setEstado2(false)
                        setMensagem("Necessário selecionar modelo, fabricante e cor")
                        setEstado(true)
                        setTimeout(() => {
                        setEstado(false);
                        setMensagem("");
                    }, 4000);
                    return;
                    }
                }
                


                if((document.getElementById('selectCores') === null || document.getElementById('selectCores') === undefined) && cor2 === ''){
                    setEstado2(false)
                    setMensagem("Necessário selecionar modelo, fabricante e cor")
                    setEstado(true)
                    setTimeout(() => {
                    setEstado(false);
                    setMensagem("");
                }, 4000);
                return;
                }
                let corNova = '';
                if(cor2 !== ""){
                    corNova = cor2
                } else {
                    const corSelect = document.getElementById('selectCores').value;
                    corNova = corSelect
                }
        requisicao.post(`/veiculo/${placa}`, {
            "placa": placa,
             "modelo": {
                "idModelo": getmodelo,
                "fabricante": {
                    "idFabricante": ''
                }
            },
            "cor": corNova,
    }).then(
            response => {
                modeloImpressao = response.data.data.reposta.modelo.modelo
                fabricanteImpressao = response.data.data.reposta.modelo.fabricante.fabricante
            }
        ).catch(function (error) {
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
        });
    }
   
    if (imagens.length !== 0) {
        if(infoBanco){
            modeloImpressao = modeloVeiculo;
            fabricanteImpressao = fabricanteVeiculo;
        }
        if (vagaVeiculo !== null && vagaVeiculo !== undefined && vagaVeiculo !== "") {
        requisicao.post('/notificacao', {
            "id_vaga_veiculo": vagaVeiculo,
            "placa" : placa,
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

                    const primeiraParam = "PRIMEIRA";
                    const idUsuario = response.config.headers.id_usuario;
                    const local = response.data.data.local;

                    localStorage.setItem('parametrosImpressaoTicket', JSON.stringify({
                        primeiraParam: primeiraParam,
                        idUsuario: idUsuario,
                        vaga: vaga,
                        placa: placa,
                        modeloImpressao: modeloImpressao,
                        fabricanteImpressao: fabricanteImpressao,
                        tipoNotificacaoNome: tipoNotificacaoNome,
                        local: local,
                      }));

                    ImpressaoTicketNotificacao("PRIMEIRA",
                     response.config.headers.id_usuario, 
                     vaga, 
                     placa, 
                     modeloImpressao,
                     fabricanteImpressao, 
                     tipoNotificacaoNome, 
                     response.data.data.local)

                    if (localStorage.getItem("listaVagas")) {
                        const listaVagas = JSON.parse(localStorage.getItem('listaVagas')) || [];
                        
                        const indexByPlaca = listaVagas.findIndex((vaga) => vaga.placa == placa);
                        if (indexByPlaca !== -1) {
                          console.log('achou placa')
                          listaVagas[indexByPlaca].numero_notificacoes += 1;
                          listaVagas[indexByPlaca].numero_notificacoes_pendentes += 1;
                          listaVagas[indexByPlaca].numero_notificacoes_pendentess += 1;
                          listaVagas[indexByPlaca].corline = "#D3D3D4";
                          listaVagas[indexByPlaca].cor = "#141619";
                          listaVagas[indexByPlaca].variaDisplay = "aparece";
                          listaVagas[indexByPlaca].display = "testeNot";
                        } else {
                            console.log('n achou placa')
                        }
                        localStorage.setItem('listaVagas', JSON.stringify(listaVagas));
                    }


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
    } else {
        requisicao.post('/notificacao', {
            "placa": placa,
            "vaga": vaga,
            "id_tipo_notificacao": tipoNot,
            "imagens": imagens,
    }).then(response => {
        console.log(response)
                setEstado2(false)
                if(response.data.msg.resultado === true){
                    if(response.data.data.id_notificacao !== undefined){
                        const id = response.data.data.id_notificacao
                        localStorage.setItem('id_notificacao', id)
                    }
                    const primeiraParam = "PRIMEIRA";
                    const idUsuario = response.config.headers.id_usuario;
                    const local = response.data.data.local;

                    localStorage.setItem('parametrosImpressaoTicket', JSON.stringify({
                        primeiraParam: primeiraParam,
                        idUsuario: idUsuario,
                        vaga: vaga,
                        placa: placa,
                        modeloImpressao: modeloImpressao,
                        fabricanteImpressao: fabricanteImpressao,
                        tipoNotificacaoNome: tipoNotificacaoNome,
                        local: local,
                      }));

                    ImpressaoTicketNotificacao("PRIMEIRA",
                     response.config.headers.id_usuario, 
                     vaga, 
                     placa, 
                     modeloImpressao,
                     fabricanteImpressao, 
                     tipoNotificacaoNome, 
                     response.data.data.local)

                     if (localStorage.getItem("listaVagas")) {
                     const listaVagas = JSON.parse(localStorage.getItem('listaVagas')) || [];

                     console.log(vaga)
                     const indexByVaga = listaVagas.findIndex((item) => item.numero == vaga);

                     if (indexByVaga !== -1) {
                         const hora = new Date();
                         const horaAtual = hora.getHours();
                         const minutoAtual = hora.getMinutes();
                         const segundosAtual = hora.getSeconds();
                         const horaMinuto = `${horaAtual}:${minutoAtual}:${segundosAtual}`;
                         listaVagas[indexByVaga].numero_notificacoes = 1;
                         listaVagas[indexByVaga].numero_notificacoes_pendentes = 1;
                         listaVagas[indexByVaga].numero_notificacoes_pendentess = 1;
                         listaVagas[indexByVaga].corline = "#D3D3D4";
                         listaVagas[indexByVaga].cor = "#141619";
                         listaVagas[indexByVaga].chegada = horaMinuto;
                         listaVagas[indexByVaga].tempo = horaMinuto;
                         listaVagas[indexByVaga].variaDisplay = "aparece";
                         listaVagas[indexByVaga].temporestante = horaMinuto;
                         listaVagas[indexByVaga].display = "testeNot";
                         listaVagas[indexByVaga].placa = placa;
                     } else {
                         console.log('n achou vaga')
                     }
                        localStorage.setItem('listaVagas', JSON.stringify(listaVagas));
                    }
                     
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


setTimeout(() => {
    setDisabled(false);
}, 2000);

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

        const objetoEncontrado = tiposNotificacao.find(item => item.id_tipo_notificacao == tipoNotificacao);
      
        if (objetoEncontrado) {
          const nomeTipoNotificacao = objetoEncontrado.nome;
          setTipoNotificacaoNome(nomeTipoNotificacao);

        } else {
          setTipoNotificacaoNome("Ocupando vaga de idoso")
        }
    }

    const getModelos = () => {
        const requisicao = createAPI();
            requisicao.get(`/veiculo/modelos/`).then(
                response => {
                    const newData = response?.data?.data?.modelos.map(item => ({
                        label: item.nome,
                        value: item.id_modelo
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
        const requisicao = createAPI();
        if(vaga.length === 0){
            vaga2[0] = [0]
        }

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
            FuncTrocaComp("AbrirTurno");
        }
        const requisicao = createAPI();
        getModelos();
        getCor();
        if (localStorage.getItem("placa") !== null && localStorage.getItem("placa") !== undefined && localStorage.getItem("placa") !== "" || localStorage.getItem("vaga") !== null) {
        
        const getVaga = localStorage.getItem("vaga");
        const getPlaca = localStorage.getItem("placa");
        const getVagaVeiculo = localStorage.getItem("id_vagaveiculo");
        const placaSemTraco = getPlaca.replace(/-/g, '');
        setDados(true);

        if (getVaga !== null && getPlaca !== null) {
            setVagaVeiculo(getVagaVeiculo)
            setSemInfo(true);
            setPlaca(placaSemTraco);
            setVaga(getVaga);
        }
        
        requisicao.get(`/veiculo/${placaSemTraco}`).then(
            response => {
                if(response.data.msg.resultado === true){
                    console.log(response)
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
                            <Text fw={500} fz="lg" className="text-center"> Notificar veículo:</Text>
                            <Divider my="sm" size="md" variant="dashed" />
                            {dados ?
                                <div>
                                    <div className="h5 mt-2 align-items-center">
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
                                                <h6 className='mx-3 pt-2'><small>Fabricante: {fabricanteVeiculo}</small></h6>
                                                <h6 className='mx-3'><small>Modelo: {modeloVeiculo}</small></h6>
                                                <h6 className='mx-3 pb-2'><small>Cor: {corVeiculo}</small></h6>
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
                                            <div>
                                            <h6 className='mx-4 mt-2'><small>Modelo:</small></h6>
                                            <Select
                                                className="mx-3 mb-3"
                                                searchable
                                                nothingFound="Sem resultados"
                                                id="selectModelos"
                                                data={modelo}
                                                value={modeloSelecionado}
                                                onChange={(value) => handleModeloChange(value)}
                                            />
                                            </div>
                                            {outro ?
                                            <div  onChange={()=>{attcor()}}>
                                            <h6 className='mx-4'><small>Cor:</small></h6>
                                            <select className="form-select form-select-sm mb-3 mx-3" defaultValue="" aria-label=".form-select-sm example" id="selectCores">
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
                                    <Button className="bg-gray-500 mx-2" size="md" radius="md" onClick={() => {back()}}>Voltar</Button> 
                                        <Button 
                                        loading={estado2} 
                                        disabled={disabled} onClick={() => submit()}
                                        loaderPosition="right"
                                        className="bg-blue-50"
                                        size="md"
                                        radius="md"
                                        >
                                        Confirmar
                                        </Button>
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
                                                <button type="submit" className="btn3 botao" onClick={() => { setDados(true) }}>Avançar </button>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                             <div className="form-group mb-3 text-start">
                                                <Text fw={400} className="mx-1 mb-1"> Placa do veiculo:</Text>
                                                <div>
                                                    <Input 
                                                    name="placa" 
                                                    value={placa} 
                                                    icon={<FaCarAlt />}
                                                    onChange={(e) => setPlaca(e.target.value)} 
                                                    id="fonteInputPlaca"
                                                    placeholder="Digite a placa" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group mb-3 text-start">
                                                <Text fw={400} className="mx-1 mb-1"> Vaga do veiculo:</Text>
                                                <div>
                                                    <Input 
                                                    type="number"
                                                    name="vaga" 
                                                    value={vaga} 
                                                    icon={<FaParking />}
                                                    onChange={(e) => setVaga(e.target.value)} 
                                                    id="fonteInputPlaca"
                                                    placeholder="Digite a vaga" 
                                                    />
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
                                                    Avançar
                                                </Button>
                                            </div>

                                            <div className="alert alert-danger fs-6" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                                {mensagem}
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

export default Notificacao;