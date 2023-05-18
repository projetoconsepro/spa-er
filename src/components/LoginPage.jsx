import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { AuthContext } from "../pages/contexts/auth";
import  FuncTrocaComp  from "../util/FuncTrocaComp";


const LoginPage = () => {

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [inputSenha, setInputSenha] = useState("form-control");
    const [inputLogin, setinputLogin] = useState("form-control");
    const [passwordType, setPasswordType] = useState("password");
    const [classolho , setClassolho] = useState("olho");

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }

    function extrairNumeros(string) {
        return string ? string.replace(/\D/g, '') : string;
    }

    useEffect(() => {
        localStorage.removeItem("SenhaDefault");
        localStorage.removeItem("id_usuario");
        localStorage.removeItem("componenteAnterior")
    }, [])

    const handleSubmit = async (e) => {
        if (email === "" || password === "") {
            setEstado(true)
            setMensagem("Preencha todos os campos!")
            if (email === "") {
                setinputLogin("form-control is-invalid")
            }
            if (password === "") {
                setInputSenha("form-control is-invalid")
                setClassolho("olho-error")
            }
            setTimeout(() => {
                setinputLogin("form-control")
                setInputSenha("form-control")
                setClassolho("olho")
                setEstado(false)
            }, 4000);
        }
        else if (email.includes("'") || password.includes("'") || email.includes('"') || password.includes('"')){
            setEstado(true)
            setMensagem(`Alguns caracteres como (' ") não são permitidos`)
            setTimeout(() => {
                setinputLogin("form-control")
                setInputSenha("form-control")
                setClassolho("olho")
                setEstado(false)
            }, 4000);
        }
        else {
            e.preventDefault();
            let emailNovo = email;
            if (cpf.isValid(emailNovo) || cnpj.isValid(emailNovo)) {
                emailNovo = extrairNumeros(email);
            }
            const resposta = await login(emailNovo, password);
            if (resposta.auth === false) {
                setEstado(true)
                setMensagem(resposta.message)
                setinputLogin("form-control is-invalid")
                setInputSenha("form-control is-invalid")
                setClassolho("olho-error")
                setTimeout(() => {
                    setEstado(false)
                    setinputLogin("form-control")
                    setInputSenha("form-control")
                    setClassolho("olho")
                }, 6000);
            }
        }
    }

    const registrado = () => {
        FuncTrocaComp( "RegisterPage");
    }

    const recuperar = () => {
        FuncTrocaComp( "ResetPassword");
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
                            <div className="form-group mb-4">
                                <label id="labelLogin">Login:</label>
                                <div className="input-group">
                                    <input className={inputLogin} name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu login CPF/CNPJ ou Email" />
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label id="labelLogin">Senha:</label>
                                <div className="input-group" >
                                    <input className={inputSenha} type={passwordType} name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha" />
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
                                <p className="esqueciSenha"><small onClick={() => {recuperar()}}>Esqueci minha senha</small></p>
                            </div>
                            <div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                    <span className="form-check-label">
                                        <small>Lembrar dados</small>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 mb-4 text-center">
                                <button type="submit" className="btn botao" onClick={handleSubmit}>Acessar  <span className='align-self-end'>➜</span></button>
                                <p className='text-muted'> <small>Ainda não possui uma conta?</small> <small className="color-primary" onClick={() => {registrado()}}><u>Clique aqui!</u></small></p>
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


export default LoginPage;