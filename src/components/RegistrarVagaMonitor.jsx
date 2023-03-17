import axios from 'axios';
import { React, useState, useEffect } from 'react'
import { FaUserInjured, FaWheelchair } from 'react-icons/fa';
import Swal from 'sweetalert2'
import '../pages/Style/styles.css';

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
    const [visible , setVisible] = useState(false);
    const [limite, setLimite] = useState(7);
    const [tipoVaga, setTipoVaga] = useState("");

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

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
        else if(tempoo === "00:10:00"){
            setValorCobranca2(valorCobranca*0);
        }
        else{
            if (placaVeiculo !== "") {
                const placaString = placaVeiculo.toString()
                const placaMaiuscula = placaString.toUpperCase();
                localStorage.setItem('placa',`${placaMaiuscula}`)
                localStorage.setItem('componente', 'Notificacao')
                //era pra ser window.location.reload()
                }
                else{
                    setEstado(true);
                    setMensagem("Preencha o campo placa");
                    setTimeout(() => {
                        setEstado(false);
                        setMensagem("");
                    }, 4000);
            }
        }
    }

    const HangleBack = () => {
        localStorage.removeItem('vaga');
        localStorage.removeItem('popup');
        localStorage.removeItem('id_vagaveiculo');
        localStorage.setItem('componente', 'ListarVagasMonitor')
        //era pra ser window.location.reload()
    }
        

    const handleSubmit = async  () => {
        const estacionamento = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        })
        const placaString = placaVeiculo.toString()
        const placaMaiuscula = placaString.toUpperCase();
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
     
     if (localStorage.getItem('popup')) {
        const idvaga = localStorage.getItem('id_vagaveiculo');

        estacionamento.post('/estacionamento', {
            placa: placaMaiuscula,
            numero_vaga: vagaa,
            tempo: tempo,
            pagamento: valor,
            id_vaga_veiculo: idvaga
        }).then(
            response => {
                if (response.data.msg.resultado === true) {
                    localStorage.removeItem('vaga');
                    localStorage.removeItem('popup');
                    localStorage.removeItem('id_vagaveiculo');
                    localStorage.setItem('componente', 'ListarVagasMonitor')
                    //era pra ser window.location.reload()
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: response.data.msg.msg,
                        footer: '<a href="">Por favor, tente novamente.</a>'
                      })

                }
            }
        ).catch(function (error) {
            console.log(error);
        });



     }
     else {
     await estacionamento.post('/estacionamento', {
        placa: placaMaiuscula,
        numero_vaga: vagaa,
        tempo: tempo,
        pagamento: valor
        }).then(
            response => {
              if(response.data.msg.resultado === true){
                localStorage.removeItem('vaga');
                localStorage.setItem('componente', 'ListarVagasMonitor')
                //era pra ser window.location.reload()
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
}

    useEffect(() => {
        setTipoVaga(localStorage.getItem('tipoVaga'))
        param();
        if (localStorage.getItem('popup')) {
            setPlacaVeiculo(localStorage.getItem('placa'))
            setVisible(true);
            setValorCobranca2(1);
            SetMostrapag(true);
            setValor("dinheiro");
            setTempo("00:30:00");
        }
        else {
            setVisible(false);

        }  
    }, [])

    const jae = () => {
        const sim = document.getElementById("flexSwitchCheckDefault").checked
        console.log(sim)
        if (sim === true) {
            setLimite(10);
        }
        else{
            setLimite(7);
        }
    }

    return (
        <section className="vh-lg-100 mt-2 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
                
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                       {tipoVaga === "cadeirante" ? <p className='text-start'><FaWheelchair size={20}/></p> : null }
                       {tipoVaga === "idoso" ? <p className='text-start'><FaUserInjured size={20}/></p> : null }
                            <div className="h5 mt-2 align-items-center">
                                <small>Registrar estacionamento</small>
                                <p id="tempoCusto" className=" pt-2"> Vaga selecionada: {vaga} </p>
                            </div>
                            <div className="row">
                                <div className="col-9 px-3 mt-4 pt-2">
                                    <h6>Placa estrangeira / Outro</h6>
                                </div>
                                <div className="col-3 px-3">
                                    <div className="form-check form-switch gap-2 d-md-block">
                                        <input className="form-check-input align-self-end" type="checkbox" 
                                        role="switch" id="flexSwitchCheckDefault" onChange={() => {jae()}}/>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-4 mt-4">
                                <p className='text-start'>Placa:</p>
                                <div className="input-group">
                                    <input className={InputPlaca} value={placaVeiculo} onChange={(e) => setPlacaVeiculo([e.target.value])} maxLength={limite} placeholder="Exemplo: IKW8K88" id="fonteInputPlaca"/>
                                </div>
                            </div>
                            <div className="h6 mt-3 " onChange={atualizafunc}>
                                <p className='text-start'>Determine um tempo:</p>
                                    {visible ? 
                                    <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="tempos">
                                    <option value="00:30:00">30</option>
                                    <option value="01:00:00">60</option>
                                    <option value="02:00:00">120</option>
                                    </select>
                                    :
                                    <select className="form-select form-select-lg mb-3" defaultValue="00:10:00" aria-label=".form-select-lg example" id="tempos">
                                    <option value="00:10:00">Tolerância</option>
                                    <option value="00:30:00">30</option>
                                    <option value="01:00:00">60</option>
                                    <option value="02:00:00">120</option>
                                    <option value="notificacao">Notificação</option>
                                    </select>
                                    }
                                <p id="tempoCusto" className="text-end"> Valor a ser cobrado: R$ {valorcobranca2},00 </p>
                            </div>

                            <div className="h6 mt-3 " style={{ display : mostrapag ? 'block' : 'none' }} onChange={atualizafunc}>
                                <p className='text-start'>Forma de pagamento:</p>
                                <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="pagamentos">
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