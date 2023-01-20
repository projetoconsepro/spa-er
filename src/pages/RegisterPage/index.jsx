import React, { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { cpf, cnpj } from 'cpf-cnpj-validator';
import emailValidator from 'email-validator';
import { IMaskInput } from 'react-imask';


const RegisterPage = () => {
    const { register } = useContext(AuthContext);
    const [nome, setNome] = useState("");
    const [mail, setMail] = useState("");
    const [cpff, setCpff] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [senha2, setSenha2] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [mensagem2, setMensagem2] = useState("");
    const [estado, setEstado] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [inputNome, setInputNome] = useState("form-control");
    const [inputMail, setInputMail] = useState("form-control");
    const [inputCpf, setInputCpf] = useState("form-control");
    const [inputTelefone, setInputTelefone] = useState("form-control");
    const [inputSenha, setInputSenha] = useState("form-control");
    const [inputSenha2, setInputSenha2] = useState("form-control");
    const [passwordType, setPasswordType] = useState("password");
    const [classolho , setClassolho] = useState("olho");


    const navigate = useNavigate();

    const registrado = () => {
        localStorage.setItem("registrou", "true");
    }




    const handleSubmit = async (e) => {
        const checkValidate = document.getElementById("flexCheckDefault").checked;
        e.preventDefault();
        if (nome === "" || mail === "" || cpf === "" || telefone === "" || senha === "") {
            if (nome === "") {
                setInputNome("form-control is-invalid")
            }
            if (mail === "") {
                setInputMail("form-control is-invalid")
            }
            if (cpff === "") {
                setInputCpf("form-control is-invalid")
            }
            if (telefone === "") {
                setInputTelefone("form-control is-invalid")
            }
            if (senha === "") {
                setInputSenha("form-control is-invalid")
                setClassolho("olho-error")
            }
            if (senha2 === "") {
                setInputSenha2("form-control is-invalid")
            }
            setEstado(true)
            setMensagem("Preencha todos os campos!")
            setTimeout(() => {
                setEstado(false)
                setInputNome("form-control")
                setInputMail("form-control")
                setInputCpf("form-control")
                setInputTelefone("form-control")
                setInputSenha("form-control")
                setInputSenha2("form-control")
                setClassolho("olho")
            }, 4000);
        } else if (!nome.includes(" ") && nome.length < 3) {
            if(!nome.includes(1, 2, 3, 4, 5, 6, 7, 8, 9, 0)){
            setEstado(true)
            setMensagem("Digite seu nome completo")
            setInputNome("form-control is-invalid")
            setTimeout(() => {
                setEstado(false)
                setInputNome("form-control")
            }, 4000);
        }
        }
        else if (!await emailValidator.validate(mail)) {
            setEstado(true)
            setInputMail("form-control is-invalid")
            setMensagem("Email inválido!")
            setTimeout(() => {
                setInputMail("form-control")
                setEstado(false)
            }, 4000);
        }

        else if (cpf.isValid(cpff) === false && cnpj.isValid(cpff) === false) {
            setEstado(true)
            setMensagem("CPF ou CNPJ inválido!")
            setInputCpf("form-control is-invalid")
            setTimeout(() => {
                setInputCpf("form-control")
                setEstado(false)
            }, 4000);
        }
        else if (telefone.length < 11) {
            setEstado(true)
            setInputTelefone("form-control is-invalid")
            setMensagem("O telefone deve conter 11 caracteres!")
            setTimeout(() => {
                setInputTelefone("form-control")
                setEstado(false)
            }, 4000);
        }
        else if (senha.length < 8) {
            setEstado(true)
            setInputSenha("form-control is-invalid")
            setClassolho("olho-error")
            setMensagem("A senha deve conter no mínimo 8 caracteres!")
            
            setTimeout(() => {
                setInputSenha("form-control")
                setClassolho("olho")
                setEstado(false)
            }, 4000);
        }
        else if(senha2.length < 8) {
            setEstado(true)
            setInputSenha2("form-control is-invalid")
            setMensagem("A senha deve conter no mínimo 8 caracteres!")
            setTimeout(() => {
                setInputSenha2("form-control")
                setEstado(false)
            }, 4000);
        }
        else if (senha !== senha2) {
            setEstado(true)
            setInputSenha2("form-control is-invalid")
            setInputSenha("form-control is-invalid")
            setMensagem("As senhas não coincidem!")
            setClassolho("olho-error")
            
            setTimeout(() => {
                setInputSenha2("form-control")
                setInputSenha("form-control")
                setClassolho("olho")
                setEstado(false)
            }, 4000);
        }
        else if (checkValidate === false) {
            setEstado(true)
            setMensagem("Você deve aceitar os termos de uso!")
            setTimeout(() => {
                setEstado(false)
            }, 4000);
        }
        else {
            const creito = await register(nome, mail, cpff, telefone, senha)
            console.log(creito)
            if (creito.auth) {
                setMensagem2("Cadastro realizado com sucesso! Você será redirecionado a página de login")
                setSucesso(true)
                setTimeout(() => {
                    setSucesso(false)
                    navigate("/login")
                }, 3000);
            }
            else {
                setEstado(true)
                setMensagem("Erro ao cadastrar! " + creito.message)
                setTimeout(() => {
                    setEstado(false)
                }, 4000);
            }
        }
    }
    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }

    function popup () {
        return(
            Swal.fire({
                title: '',
                icon: 'info',
                html:
                  'O cadastro online é a forma mais conveniente e econômica de efetuar seus pagamentos do dia a dia. Além de prático e seguro é pré-carregado com valores os quais você define. Dessa forma você mesmo limita seus gastos economizando muito mais. Você pode inclusive vincular placas de veículos de pessoas dependentes e familiares ao seu cadastro. Uma vez cadastrado seu veículo, você compra créditos, recarrega sua conta de vários maneiras, pontos de venda, smartphone entre outras.',
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText:
                  '<i class="fa fa-thumbs-up"></i> Legal!',
                confirmButtonAriaLabel: 'Thumbs up, great!',
              })
        )
    }

    return (
        <section class="vh-lg-150 bg-soft mt-5 mt-lg-5 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
                                <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
                            </div>
                            <small className="text-left">O cadastro online é a forma mais conveniente e econômica de efetuar seus pagamentos do dia a dia. </small>
                            <small onClick={popup} className="pointer-cursor"><ins>Veja mais</ins></small>
                            <p>Preencha os dados abaixo e clique em avançar.</p>
                            <form action="#" class="mt-4">
                                <div className="form-group mb-4">
                                    <label htmlFor="email" id="labelLogin">Nome:</label>
                                    <div className="input-group">
                                        <input className={inputNome} name="nome" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite seu nome" />
                                    </div>
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="email" id="labelLogin">Email:</label>
                                    <div className="input-group">
                                        <input className={inputMail} name="email" id="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Digite seu endereço de email" />
                                    </div>
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="email" id="labelLogin">CPF/CNPJ:</label>
                                    <div className="input-group">
                                        <input className={inputCpf} name="cpf" id="cpf" value={cpff} onChange={(e) => setCpff(e.target.value)} placeholder="Digite seu CPF p/ pessoa física ou CPNJ p/ jurídica" />
                                    </div>
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="email" id="labelLogin">Telefone:</label>
                                    <div className="input-group">
                                        <IMaskInput className={inputTelefone} mask="(00) 00000-0000" name="email" id="email" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Digite seu número de telefone" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div className="form-group mb-4">
                                        <label htmlFor="password" id="labelLogin">Senha:</label>
                                        <div class="input-group">
                                            <input className={inputSenha} type={passwordType} name="password" id="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" />
                                            <button onClick={togglePassword} type="button" className={classolho}>
                                                {passwordType === "password" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                </svg>}
                                            </button>
                                        </div>
                                    </div>
                                    <div class="form-group mb-4">
                                        <label htmlFor="password" id="labelLogin">Confirme sua senha:</label>
                                        <div class="input-group">
                                            <input className={inputSenha2} type="password" name="password" id="password" value={senha2} onChange={(e) => setSenha2(e.target.value)} placeholder="Digite sua senha novamente" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                            <span className="form-check-label" for="flexCheckDefault">
                                                <small>Aceito os <a href="/termos" className="color-primary"><u>termos de uso</u></a> e <a href="/politica" className="color-primary"><u>política de privacidade.</u></a></small>
                                            </span>
                                        </div>
                                    </div>

                                </div>
                                <div className="mt-5 mb-5 d-grid gap-2 d-md-block">
                                    <button type="submit" className="btn2 botao"><span className='align-self-start'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                    </svg></span> Voltar</button>
                                    <button type="submit" onClick={handleSubmit} className="btn botao">Acessar  <span className='align-self-end'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg></span></button>
                                    <p className='text-muted' onClick={registrado}> <small>Já possui uma conta?</small> <a href='/login'><small className="color-primary"><u>Clique aqui!</u></small></a></p>
                                </div>
                            </form>
                            <div class="alert alert-danger" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                {mensagem}
                            </div>
                            <div class="alert alert-success" role="alert" style={{ display: sucesso ? 'block' : 'none' }}>
                                {mensagem2}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegisterPage;