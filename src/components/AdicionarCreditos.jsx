import axios from 'axios';
import { React, useState, useEffect } from 'react'
import { FaUserInjured, FaWheelchair } from 'react-icons/fa';
import Swal from 'sweetalert2'
import '../pages/Style/styles.css';

const AdicionarCreditos = () => {
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [cpf, setCPF] = useState("");
    const [valor, setValor] = useState(0);
    const [InputPlaca, setInputPlaca] = useState("form-control fs-6");
    const [pagamentos, setPagamento] = useState("dinheiro");

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    const parametros = axios.create({
        baseURL: process.env.REACT_APP_HOST,
    })

    const param = async () => {
        await parametros.get('/parametros').then(
            response => {
              console.log(response)
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
        

    const handleSubmit = async  () => {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': user2.perfil[0]
            }
        })



        if(cpf !== "" && valor[0] !== '0'){
            requisicao.post('usuario/credito', {
                user: cpf,
                valor: valor,
                pagamento: pagamentos
            }
            ).then(
                response => {
                    if (response.data.msg.resultado) {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'Créditos adicionados com sucesso!',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                    })
                }
                else {
                    Swal.fire({
                        title: 'Erro!',
                        text: ` ${response.data.msg.msg}`,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            
                        }
                    })
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
        else if (valor === 0){
            console.log(valor)
            setInputPlaca("form-control fs-5 is-invalid");
            setEstado(true); 
            setMensagem("Verifique os campos novamente!");
            setTimeout(() => {
                setInputPlaca("form-control fs-5");
                setEstado(false);
                setMensagem("");
            }, 4000);
        }
        else{
            setInputPlaca("form-control fs-5 is-invalid");
            setEstado(true); 
            setMensagem("Verifique os campos novamente!");
            setTimeout(() => {
                setInputPlaca("form-control fs-5");
                setEstado(false);
                setMensagem("");
            }, 4000);
        }
        setValor(0)
        setCPF("")
     }

    const HangleBack = () => {
        if (user2.perfil[0] === "parceiro") {
        localStorage.setItem("componente", "RegistrarEstacionamentoParceiro");
        } else if(user2.perfil[0] === "monitor") {
        localStorage.setItem("componente", "ListarVagasMonitor");
        }
        else if (user2.perfil[0] === "admin") {
            localStorage.setItem("componente", "ListarVagas");
        }
    }

    const atualiza = () => {
        const pagamentos = document.getElementById('pagamentos').value;
        setPagamento(pagamentos);
    }

    useEffect(() => {
        if (localStorage.getItem("turno") !== 'true' && user2.perfil[0] === "monitor") {
            localStorage.setItem("componente", "FecharTurno");
        }
        setValor(0)
    }, [])

    return (
        <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="h5 mt-2 align-items-center">
                                <small>Adicionar créditos</small>
                            </div>
                            <div className="row align-items-center pt-2">
                                <div className="col-3">
                                    <button type="button" className="btn btn-info w-100" onClick={() => setValor(10)}>10</button>
                                </div> 
                                <div className="col-3">
                                    <button type="button" className="btn btn-info w-100" onClick={() => setValor(20)}>20</button>
                                </div> 
                                <div className="col-3">
                                    <button type="button" className="btn btn-info w-100" onClick={() => setValor(30)}>30</button>
                                </div> 
                                <div className="col-3">
                                    <button type="button" className="btn btn-info w-100" onClick={() => setValor(50)}>50</button>
                                </div>
                            </div>
                            <div className="form-group mb-4 mt-4">
                                <h6 className='text-start mb-0'>CPF ou CNPJ:</h6>
                                <div className="input-group">
                                    <input type="number" className={InputPlaca} value={cpf} onChange={(e) => setCPF([e.target.value])} placeholder="Digite o CPF ou CNPJ"/>
                                </div>
                            </div>
                            <div className="form-group mb-4 mt-4">
                                <h6 className='text-start mb-0'>Valor:</h6>
                                
                                <div className="input-group w-25">
                                    <span className="mt-3">R$ ‎</span>
                                    <input className="form-control pt-3" placeholder="00" id="inputParceiro" value={valor} onChange={(e) => setValor([e.target.value])} type="number"/>
                                    <span className="mt-3">,00</span>
                                </div>
                            </div>
                            <div className="h6 mt-3" onChange={() => {atualiza()}}>
                                <p className='text-start'>Forma de pagamento:</p>
                                <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" id="pagamentos">
                                <option value="dinheiro">Dinheiro</option>
                                <option value="pix">PIX</option>
                                </select>
                            </div>

                            <div className="pt-4 mb-6 gap-2 d-md-block">
                                <button type="submit" className="btn2 botao" onClick={HangleBack}>Cancelar</button>
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

export default AdicionarCreditos