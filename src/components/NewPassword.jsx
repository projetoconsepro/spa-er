import axios from 'axios';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';

const NewPassword = () => {
    const [inputSenha, setInputSenha] = useState("form-control");
    const [inputSenha2, setInputSenha2] = useState("form-control");
    const [passwordType, setPasswordType] = useState("password");
    const [classolho, setClassolho] = useState("olho");
    const [senha, setSenha] = useState("");
    const [senha2, setSenha2] = useState("");
    const codigoConfirm = localStorage.getItem('codigoConfirm');
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (senha === senha2 && senha.length >= 8) {
            const password = sha256(senha).toString();
            const veiculo = axios.create({
                baseURL: process.env.REACT_APP_HOST,
            })
            veiculo.post('/usuario/senha',{
                codigo_seguranca: codigoConfirm,
                senha: password
            }).then(
                response => {
                    const resposta = response.data.msg.resultado;
                    if (resposta === false){
                        setMensagem(response.data.msg.msg);
                        setEstado(true);
                        setTimeout(() => {
                        setMensagem("");
                        setEstado(false);
                        }, 4000);
                    }
                    else{
                        localStorage.removeItem('codigoConfirm');
                        localStorage.setItem('componente', 'LoginPage')
                    }
                }
            ).catch(function (error) {
                console.log(error);
            });
        } else {
            setInputSenha("form-control is-invalid");
            setInputSenha2("form-control is-invalid");
            setClassolho("olho is-invalid");

            setTimeout(() => {
                setClassolho("olho");
                setInputSenha("form-control is-valid");
                setInputSenha2("form-control is-valid");
            }, 4000);
        }
    }

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
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
                            <p className="pt-2 pb-3 fs-5"><strong>Digite sua nova senha:</strong></p>
                            <div className="form-group mb-4">
                                        <label id="labelLogin">Senha:</label>
                                        <div className="input-group">
                                            <input className={inputSenha} type={passwordType} name="password" id="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" />
                                            <button onClick={togglePassword} type="button" className={classolho}>
                                                {passwordType === "password" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group mb-4">
                                        <label id="labelLogin">Confirme sua senha:</label>
                                        <div className="input-group">
                                            <input className={inputSenha2} type="password" name="password" id="password" value={senha2} onChange={(e) => setSenha2(e.target.value)} placeholder="Digite sua senha novamente" />
                                        </div>
                                    </div>
                            <div className="mt-5 mb-5 gap-2 d-md-block">
                                    <button type="submit" onClick={() => {handleSubmit()}} className="btn4 botao">Acessar  <span className='align-self-end'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg></span></button>
                                </div>
                                <div
                className="alert alert-danger"
                role="alert"
                style={{ display: estado ? "block" : "none" }}
              >
                {mensagem}
              </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default NewPassword;