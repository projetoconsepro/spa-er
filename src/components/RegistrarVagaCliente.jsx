import axios from 'axios';
import { React, useState, useEffect } from 'react'
import '../pages/Style/styles.css';

const RegistrarVagaCliente = () => {
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [inputVaga, setinputVaga] = useState("form-control fs-5");
    const [vaga, setVaga] = useState([]);
    const [resposta2, setResposta2] = useState([]);
    const [resposta, setResposta] = useState([{}]);
    const [placaVeiculo, setPlacaVeiculo] = useState("");
    const [tempo, setTempo] = useState("00:10:00");
    const [valor, setValor] = useState(0);
    const [valorcobranca, setValorCobranca] = useState("");
    const [valorcobranca2, setValorCobranca2] = useState("2");

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
   
    const parametros = axios.create({
        baseURL: process.env.REACT_APP_HOST,
    })

    useEffect(() => {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "cliente"
            }
        })
        requisicao.get('/veiculo').then(
            response => {
                setResposta(response?.data?.data);
                if (response.data.msg.resultado === false) {
                    localStorage.setItem("componente", "MeusVeiculos")
                    
                }
                for (let i = 0; i < response?.data?.data.length; i++) {
                    resposta2[i] = {};
                    resposta2[i].placa = response.data.data[i].usuario;
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
        });

        requisicao.get('/usuario/saldo-credito'
        ).then(
            response => {
                if(response.data.msg.resultado){
                    setValor(response.data.data.saldo);
                }
                else{
                    setValor(0);
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
        });

        parametros.get('/parametros').then(
            response => {
                setValorCobranca(response.data.data.param.estacionamento.valorHora)
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
        });
    }, [])

    function mudanca (){
        localStorage.setItem("componente", "MeusVeiculos")
    }

    function mexerValores () {

        const tempo1 = document.getElementById("tempos").value;

        if(tempo1 === "02:00:00"){
            return valorcobranca*2;
        }
        else if(tempo1 === "01:00:00"){
            return valorcobranca;
        }
        else if(tempo1 === "00:30:00"){
            return valorcobranca/2;
        }
    }
    const atualizafunc = () => {
        const tempo1 = document.getElementById("tempos").value;

        if(tempo1 === "02:00:00"){
            setValorCobranca2(valorcobranca*2);
        }
        else if(tempo1 === "01:00:00"){
            setValorCobranca2(valorcobranca);
        }
        else if(tempo1 === "00:30:00"){
            setValorCobranca2(valorcobranca/2);
        }
    }


    const handleSubmit = async  () => {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "cliente"
            }
        })
        const tempo1 = document.getElementById("tempos").value;
        const placa2 = document.getElementById("placaa").value;
        const placa3 =  resposta2[placa2].placa
        
        if (vaga.length === 0) {
            vaga[0]= 0;
        }

        const resposta = await mexerValores();
        if(valor < resposta){
            setMensagem("Saldo insuficiente.");
            setEstado(true);
            setTimeout(() => {
                setMensagem("");
                setEstado(false);
            }, 4000);
        }
        else{
            requisicao.post('/estacionamento', {
                placa: placa3,
                numero_vaga: vaga,
                tempo: tempo1,
                pagamento: "credito"
            }).then(
                response => {
                    if (response.data.msg.resultado === true) {
                        localStorage.setItem("componente", "MeusVeiculos")
                        
                    }
                    else {
                        setMensagem(response.data.msg.msg);
                        setEstado(true);
                        setTimeout(() => {
                            setMensagem("");
                            setEstado(false);
                        }, 4000);
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
            });
        }
    }

    return (
        <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="h5 mt-2 align-items-center">
                                <small>Registrar estacionamento</small>
                            </div>
                            <div className="h6 mt-3 ">
                                <p className='text-start'>Escolha seu veículo:</p>
                                <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="placaa">
                                    {resposta2.map((link, index) => (
                                            <option value={index} key={index}>{link.placa}</option>
                                        ))}
                                </select>
                            </div>

                            <div className="h6 mt-3" onChange={atualizafunc}>
                                <p className='text-start'>Determine um tempo:</p>
                                <select className="form-select form-select-lg mb-1"  defaultValue="01:00:00" aria-label=".form-select-lg example" id="tempos">
                                    <option value="00:30:00">30 Minutos</option>
                                    <option value="01:00:00">60 Minutos</option>
                                    <option value="02:00:00">120 Minutos</option>
                                </select>
                                <p id="tempoCusto" className="text-end">Esse tempo ira custar: R$ {valorcobranca2},00 </p>
                            </div>

                            <div className="form-group mb-4 mt-4">
                                <p className='text-start'>Numero da vaga:</p>
                                <div className="input-group">
                                    <input className={inputVaga} value={vaga} onChange={(e) => setVaga([e.target.value])} placeholder="Exemplo: 003" />
                                </div>
                            </div>

                            <div className="mt-1 mb-5 gap-2 d-md-block">
                                <button type="submit" onClick={mudanca} className="btn2 botao"><a href="/">Cancelar</a></button>
                                <button type="submit" onClick={handleSubmit} className="btn3 botao">Confirmar</button>
                            </div>
                            <div className="alert alert-danger" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                {mensagem}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default RegistrarVagaCliente