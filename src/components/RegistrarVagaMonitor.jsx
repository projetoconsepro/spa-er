import axios from 'axios';
import { React, useState, useEffect } from 'react'
import '../pages/LoginPage/styles.css'

const RegistrarVagaMonitor = () => {
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [placaVeiculo, setPlacaVeiculo] = useState("");
    const [tempo, setTempo] = useState("00:10:00");
    const [valor, setValor] = useState("");
    const [mostrapag, SetMostrapag] = useState(false);
    const [valorCobranca, setValorCobranca] = useState(0);
    const [valorcobranca2, setValorCobranca2] = useState(0);
    const [vaga, setVaga] = useState("");
    const [InputPlaca, setInputPlaca] = useState(" form-control fs-5");

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    const estacionamento = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "monitor"
        }
    })

    const parametros = axios.create({
        baseURL: process.env.REACT_APP_HOST,
    })

    const param = async () => {
        await parametros.get('/parametros').then(
            response => {
                setValorCobranca(response.data.data.param.estacionamento.valorHora)
            }
        ).catch(function (error) {
            console.log(error);
        });

        setVaga(localStorage.getItem('vaga'));
    }


    const atualizafunc = () => {
        const tempoo = document.getElementById('tempos').value;
        const valorr = document.getElementById('pagamentos').value;
        setTempo(tempoo);
        console.log('bun', valorr)
        setValor(valorr);
        if(tempoo === "00:10:00"){
        SetMostrapag(false)
        setValor("");
        }
        else{
        SetMostrapag(true)
        }

        if(tempoo === "02:00:00"){
            setValorCobranca2(valorCobranca*2);
        }
        else if(tempoo === "01:00:00"){
            setValorCobranca2(valorCobranca);
        }
        else if(tempoo === "00:30:00"){
            setValorCobranca2(valorCobranca/2);
        }
        else{
            setValorCobranca2(valorCobranca*0);
        }
    }

    const HangleBack = () => {
        localStorage.removeItem('vaga');
        localStorage.setItem('componente', 'ListarVagasMonitor')
        window.location.reload();
    }
        


    const handleSubmit = async  () => {
        const vagaa = [];
        vagaa[0] = localStorage.getItem('vaga');
        if(placaVeiculo === ""){
            setInputPlaca("form-control fs-5 is-invalid");
            setEstado(true);
            setMensagem("Preencha o campo placa");
            setTimeout(() => {
                setInputPlaca("form-control fs-5");
                setEstado(false);
                setMensagem("");
            }, 4000);
            return;
        }
     await estacionamento.post('/estacionamento', {
        placa: placaVeiculo,
        numero_vaga: vagaa,
        tempo: tempo,
        pagamento: valor
        }).then(
            response => {
                console.log(response.data.msg)
              if(response.data.msg.resultado === true){
                localStorage.removeItem('vaga');
                localStorage.setItem('componente', 'ListarVagasMonitor')
                window.location.reload();
              }
              else {
                setEstado(true);
                setMensagem(response.data.msg.mensagem);
                setTimeout(() => {
                    setEstado(false);
                    setMensagem("");
                }, 4000);
              }
            }
        ).catch(function (error) {
            setEstado(true);
            setMensagem(error.response.data.data.message);
        }
    ) 
    }

    useEffect(() => {
        param();
    }, [])
    return (
        <section className="vh-lg-100 mt-2 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">

                            <div className="h5 mt-2 align-items-center">
                                <small>Registrar estacionamento</small>
                                <p id="tempoCusto" className=" pt-2"> Vaga selecionada: {vaga}</p>
                            </div>
                            <div className="form-group mb-4 mt-4">
                                <p className='text-start'>Placa:</p>
                                <div className="input-group">
                                    <input className={InputPlaca} value={placaVeiculo} onChange={(e) => setPlacaVeiculo([e.target.value])} placeholder="Exemplo: IKW8K88" />
                                </div>
                            </div>
                            <div className="h6 mt-3 " onChange={atualizafunc}>
                                <p className='text-start'>Determine um tempo:</p>
                                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="tempos">
                                    <option value="00:10:00" selected>Tolerância</option>
                                    <option value="00:30:00">30</option>
                                    <option value="01:00:00">60</option>
                                    <option value="02:00:00">120</option>
                                </select>
                                <p id="tempoCusto" className="text-end"> Valor a ser cobrado: R$ {valorcobranca2},00 </p>
                            </div>

                            <div className="h6 mt-3 " style={{ display : mostrapag ? 'block' : 'none' }} onChange={atualizafunc}>
                                <p className='text-start'>Forma de pagamento:</p>
                                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="pagamentos">
                                <option value="dinheiro">Dinheiro</option>
                                <option value="pix">PIX</option>
                                </select>
                            </div>

                            <div className="pt-4 mb-6 gap-2 d-md-block">
                                <button type="submit" className="btn2 botao"onClick={HangleBack}><a href="/">Cancelar</a></button>
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