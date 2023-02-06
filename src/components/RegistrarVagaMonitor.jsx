import axios from 'axios';
import { React, useState, useEffect } from 'react'
import '../pages/LoginPage/styles.css'

const RegistrarVagaMonitor = () => {
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

    const handleSubmit = () => {
       
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
                            <div className="form-group mb-4 mt-4">
                                <p className='text-start'>Placa:</p>
                                <div className="input-group">
                                    <input className={inputVaga} value={placaVeiculo} onChange={(e) => setPlacaVeiculo([e.target.value])} placeholder="Exemplo: IKW8K88" />
                                </div>
                            </div>
                            <div className="form-group mb-4 mt-4">
                                <p className='text-start'>Vaga:</p>
                                <div className="input-group">
                                    <input className={inputVaga} value={vaga} onChange={(e) => setVaga([e.target.value])} placeholder="Exemplo: 45" />
                                </div>
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
                            <div className="h6 mt-3 ">
                                <p className='text-start'>Forma de pagamento:</p>
                                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="placaa">
                                <option value="1">1</option>
                                </select>
                            </div>

                            <div className="pt-4 mb-6 gap-2 d-md-block">
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

export default RegistrarVagaMonitor