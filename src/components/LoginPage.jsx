import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { AuthContext } from "../pages/contexts/auth";
import  FuncTrocaComp  from "../util/FuncTrocaComp";
import { Button, Group, Input, PasswordInput, Modal, Card, Text, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBrandGmail, IconCircleCheck, IconCircleDashed, IconLockCode, IconMail, IconMailOpened, IconPassword, IconUser } from '@tabler/icons-react';
import { IconLock } from '@tabler/icons-react';
import { FaWhatsapp } from 'react-icons/fa';


const LoginPage = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [inputSenha, setInputSenha] = useState("form-control");
    const [inputLogin, setinputLogin] = useState("form-control");
    const [passwordType, setPasswordType] = useState("password");
    const [classolho , setClassolho] = useState("olho");
    const [errorLogin, setErrorLogin] = useState(false);
    const [errorSenha, setErrorSenha] = useState(false);
    const [emailDois, setEmailDois] = useState("")

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
                //setinputLogin("form-control is-invalid")
                setErrorLogin(true)
            }
            if (password === "") {
                //setInputSenha("form-control is-invalid")
                setErrorSenha(true)
            }
            setTimeout(() => {
                setErrorLogin(false)
                setErrorSenha(false)
                setEstado(false)
            }, 4000);
        }
        else if (email.includes("'") || password.includes("'") || email.includes('"') || password.includes('"')){
            setEstado(true)
            setMensagem(`Alguns caracteres como (' ") não são permitidos`)
            setTimeout(() => {
                setErrorLogin(false)
                setErrorSenha(false)
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
                setErrorLogin(true)
                setErrorSenha(true)
                setTimeout(() => {
                    setEstado(false)
                    setErrorLogin(false)
                    setErrorSenha(false)
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

    const contaAntiga = () => {
        FuncTrocaComp("Confirmation")
    }
    
    return (
        <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-100 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
                                <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
                            </div>
                            <div className="form-group mb-4 text-start">
                            <Input.Wrapper label="Login">                        
                            <Input icon={<IconUser size={18}/>} placeholder="Digite seu login CPF/CNPJ ou Email"
                            id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            error={errorLogin}
                            />
                            </Input.Wrapper>
                            </div>
                            <div className="form-group mb-2 text-start">
                            <PasswordInput
                            icon={<IconLock size={18} />}
                            placeholder="Digite sua senha"
                            label="Senha:"
                            id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            error={errorSenha}
                            withAsterisk
                            />
                            </div>
                            <p className="esqueciSenha"><small onClick={() => {recuperar()}} className="color-primary"><u>Esqueci minha senha</u></small></p>
                     
                            <div>
                                <Group position="left">
                                <Button onClick={() => open()}> clica </Button>
                                </Group>
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
                <Modal opened={opened} onClose={close} title="Recuperar conta antiga" centered>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group position="left">
                      <Text fz="md" >Digite seu email abaixo e clique no botão abaixo para sincronizar sua conta do sistema antigo com este.</Text>
                        <Text fz="lg">
                            <FaWhatsapp color="green" className="mb-1" size={20} />
                            ‎
                            Suporte: 51 9800-7341
                        </Text>
                        </Group>
                        <Divider my="sm" size="md" variant="dashed" />
                         <Input icon={<IconMail size={18}/>} placeholder="Digite seu email" className="mt-3"
                         value={emailDois} onChange={(e) => setEmailDois(e.target.value)}/>
                        <div className="mt-3 mb-4 text-center">
                            <Button variant="gradient" onClick={() => contaAntiga()}>Acessar </Button>
                        </div>
                    </Card>
                </Modal>
        </section>
    )
}


export default LoginPage;