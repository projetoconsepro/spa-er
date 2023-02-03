import axios from 'axios';
import { React, useState, useEffect } from 'react'
import '../pages/LoginPage/styles.css'

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

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    const veiculo = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })
    const saldo = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })

    const estacionamento = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })

    useEffect(() => {
        veiculo.get('/veiculo').then(
            response => {
                setResposta(response?.data?.data);
                console.log(response)
                if (response.data.msg.resultado === false) {
                    localStorage.setItem("componente", "MeusVeiculos")
                    window.location.reload();
                }
                for (let i = 0; i < response?.data?.data.length; i++) {
                    resposta2[i] = {};
                    resposta2[i].placa = response.data.data[i].usuario;
                }
            }
        ).catch(function (error) {
            console.log(error);
        });

        ////////////////////

        saldo.get('/usuario/saldo-credito'
        ).then(
            response => {
                console.log(response)
                if(response.data.msg.resultado){
                    console.log("entrou aqui")
                    setValor(response.data.data.saldo);
                }
                else{
                    setValor(0);
                }
            }
        ).catch(function (error) {
            console.log(error);
        });
    }, [])

    const handleSubmit = () => {
        const tempo1 = document.getElementById("tempos").value;
        const placa2 = document.getElementById("placaa").value;
        const placa3 =  resposta2[placa2].placa
        console.log(placa3)
        let valorcobran = 0;

        if (vaga === "") {
            setinputVaga("form-control fs-5 is-invalid");
            setMensagem("Preencha o campo vaga.");
            setEstado(true);
            setTimeout(() => {
                setMensagem("");
                setEstado(false);
            }, 4000);
        }
        if(tempo1 === "02:00:00"){
            valorcobran = 4;
        }
        else if(tempo1 === "01:00:00"){
            valorcobran = 2;
        }
        else if(tempo1 === "00:30:00"){
            valorcobran = 1;
        }
        else {
            valorcobran = 0;
        }
    
        console.log(valor)
        if(valor < valorcobran){
            setMensagem("Saldo insuficiente.");
            setEstado(true);
            setTimeout(() => {
                setMensagem("");
                setEstado(false);
            }, 4000);
        }
        else{
            estacionamento.post('/estacionamento', {
                placa: placa3,
                numero_vaga: vaga,
                tempo: tempo1,
                pagamento: "credito"
            }).then(
                response => {
                    console.log(response)
                    if (response.data.msg.resultado === true) {
                        localStorage.setItem("componente", "MeusVeiculos")
                        window.location.reload();
                    }
                    else {
                        setMensagem("Erro ao registrar vaga.");
                        setEstado(true);
                        setTimeout(() => {
                            setMensagem("");
                            setEstado(false);
                        }, 4000);
                    }
                }
            ).catch(function (error) {
                console.log(error);
            });
        }
    }
    return (
        <section className="vh-lg-100 mt-2 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center text-md-center mb-3 pt-3 mt-4 mt-md-0">
                                <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
                            </div>
                            <div className="h5 mt-2 align-items-center">
                                <small>Registrar estacionamento</small>
                            </div>
                            <div className="h6 mt-3 ">
                                <p className='text-start'>Escolha seu veículo:</p>
                                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="placaa">
                                    {resposta2.map((link, index) => (
                                            <option value={index}>{link.placa}</option>
                                        ))}
                                </select>
                            </div>

                            <div className="h6 mt-3 ">
                                <p className='text-start'>Determine um tempo:</p>
                                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="tempos">
                                    <option value="00:10:00" selected>Tolerância</option>
                                    <option value="00:30:00">30</option>
                                    <option value="01:00:00">60</option>
                                    <option value="02:00:00">120</option>
                                </select>
                            </div>

                            <div className="form-group mb-4 mt-4">
                                <p className='text-start'>Numero da vaga:</p>
                                <div className="input-group">
                                    <input className={inputVaga} value={vaga} onChange={(e) => setVaga([e.target.value])} placeholder="Exemplo: 003" />
                                </div>
                            </div>

                            <div className="mt-1 mb-6 gap-2 d-md-block">
                                <button type="submit" className="btn2 botao"><a href="/">Cancelar</a></button>
                                <button type="submit" onClick={handleSubmit} className="btn3 botao">Confirmar</button>
                            </div>
                            <div className="alert alert-danger" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                {mensagem}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RegistrarVagaCliente