import React, { useEffect, useState } from 'react'
import { AiFillCamera } from 'react-icons/ai';
import { FaCarAlt } from 'react-icons/fa';

const Notificacao = () => {
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [inputVaga, setinputVaga] = useState("form-control fs-5");
    const [vaga, setVaga] = useState([]);
    const [dados, setDados] = useState(true);
    const [seminfo, setSemInfo] = useState(false);
    const [placa, setPlaca] = useState("");
    const [imagens] = useState([]);
    let [cont, setCont] = useState(0);


    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    const back = () => {
        localStorage.setItem("componente", "ListarVagasMonitor");
        localStorage.removeItem("vaga");
        localStorage.removeItem("placa");
        window.location.reload();
    }

    const renderCamera = () => {
        localStorage.setItem("componente", "Camera");
        window.location.reload();
    }

    const teste = () => {
        for (let i = 0; i < 6; i++) {
            if (localStorage.getItem(`foto${i}`) !== null) {
                imagens.push(localStorage.getItem(`foto${i}`));
            }
        }
    }
    useEffect(() => {
        const getVaga = localStorage.getItem("vaga");
        const getPlaca = localStorage.getItem("placa");
        if (getVaga !== null && getPlaca !== null) {
            setSemInfo(true);
            setPlaca(getPlaca);
            setVaga(getVaga);
        }
        if (cont === 0) {
            teste();
        }

        setCont(cont++);
        console.log('teste')
    }, [])

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
                                        <div class="row justify-content-center">
                                            <div className="col-8">
                                                <h6 className='mx-3 pt-2'><small>Modelo: Celta</small></h6>
                                                <h6 className='mx-3'><small>Cor: Preto</small></h6>
                                                <h6 className='mx-3 pb-2'><small>Fabricante: Chevrolet</small></h6>
                                            </div>
                                            <div className="col-4 text-center pt-3 mt-3">
                                                <FaCarAlt size={35} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h6 mt-3 ">
                                        <p className='text-start'>Tipo de notificação:</p>
                                        <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="placaa">
                                            <option value="tempoExcedido">Tempo excedido</option>
                                            <option value="tempoExcedido">Vaga de idoso</option>
                                            <option value="tempoExcedido">Vaga de deficiente</option>
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
                                        <button type="submit" className="btn3 botao">Confirmar</button>
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