import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import FuncTrocaComp from '../util/FuncTrocaComp';

const Confirmation = () => {
    const [codigo, setCodigo] = useState("");
    const [inputLogin, setInputLogin] = useState("form-control");
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);

    const handleSubmit = async (e) => {
        const veiculo = axios.create({
            baseURL: process.env.REACT_APP_HOST,
        })
        veiculo.get(`/verificar?codigo=${codigo}`).then(
            response => {
                const resposta = response.data.msg.resultado;
                if (resposta === false){
                    setMensagem(response.data.msg.msg);
                    setEstado(true);
                    setTimeout(() => {
                        setEstado(false);
                    }, 5000);
                }
                else{
                    localStorage.setItem('codigoConfirm', codigo);
                    localStorage.removeItem('email')
                    FuncTrocaComp( "NewPassword");
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

    const reenviarCodigo = async (e) => {
        const email = localStorage.getItem('email');
        const veiculo = axios.create({
            baseURL: process.env.REACT_APP_HOST,
        })
        veiculo.get(`/codigo-recuperacao-senha?email=${email}`).then(
            response => {
                const resposta = response.data.msg.resultado;
                if (resposta === false){
                    setMensagem(response.data.msg.msg);
                    setEstado(true);
                    setTimeout(() => {
                        setEstado(false);
                    }, 5000);
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

    return (
        <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
                                <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
                            </div>
                            <p className="pt-2 pb-3 fs-5"><strong>Digite o código de verificação enviado ao seu Email</strong></p>
                            <div className="form-group mb-4">
                                <label id="labelLogin">Código de verificação:</label>
                                <div className="input-group">
                                    <input className={inputLogin} name="email" id="email" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Digite o codigo enviado ao seu email" />
                                </div>
                            </div>
                            <p className="text-start" style={{cursor: "pointer"}} onClick={reenviarCodigo}><small>Reenviar código</small></p>
                            <div className="mt-5 mb-5 gap-2 d-md-block">
                                    <button type="submit" onClick={() => {handleSubmit()}} className="btn4 botao">Acessar  <span className='align-self-end'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg></span></button>
                                </div>
                                <div className="alert alert-danger" role="alert" style={{ display: estado ? "block" : "none" }}>
                                    {mensagem}
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default Confirmation;