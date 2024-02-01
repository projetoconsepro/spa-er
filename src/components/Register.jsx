import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../pages/contexts/auth";
import Swal from 'sweetalert2'
import { cpf, cnpj } from 'cpf-cnpj-validator';
import emailValidator from 'email-validator';
import InputMask from "react-input-mask";
import  FuncTrocaComp  from "../util/FuncTrocaComp";
import { Input, Loader, PasswordInput } from "@mantine/core";
import { IconClipboardText, IconLock, IconMail, IconPhone, IconUser } from "@tabler/icons-react";
import { IconLockCheck } from "@tabler/icons-react";

const RegisterPage = () => {
    const { register } = useContext(AuthContext);
    const [nome, setNome] = useState("");
    const [mail, setMail] = useState('');
    const [cpff, setCpff] = useState('');
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [senha2, setSenha2] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [mensagem2, setMensagem2] = useState("");
    const [estado, setEstado] = useState(false);
    const [estado2, setEstado2] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [passwordType, setPasswordType] = useState("password");
    const [errorNome, setErrorNome] = useState(false);
    const [errorMail, setErrorMail] = useState(false);
    const [errorCpf, setErrorCpf] = useState(false);
    const [errorTelefone, setErrorTelefone] = useState(false);
    const [errorSenha, setErrorSenha] = useState(false);
    const [errorSenha2, setErrorSenha2] = useState(false);

    const registrado = () => {
        FuncTrocaComp( "LoginPage");
    }

    function extrairNumeros(string) {
        return string ? string.replace(/\D/g, '') : string;
    }

    const handleSubmit = async (e) => {
        const checkValidate = document.getElementById("flexCheckDefault").checked;
        e.preventDefault();
        if (nome === "" || cpff === "" || telefone === "" || senha === "" || senha2 === "") {
            if (nome === "") {
                setErrorNome(true)
            }
            if (cpff === "") {
                setErrorCpf(true)
            }
            if (telefone === "") {
                setErrorTelefone(true)
            }
            if (senha === "") {
                setErrorSenha(true)
            }
            if (senha2 === "") {
                setErrorSenha2(true)
            }
            setEstado(true)
            setMensagem("Preencha todos os campos!")
            setTimeout(() => {
                setEstado(false)
                setErrorNome(false)
                setErrorMail(false)
                setErrorCpf(false)
                setErrorTelefone(false)
                setErrorSenha(false)
                setErrorSenha2(false)
            }, 4000);
        } else if (nome.includes('"') || cpff.includes('"') || telefone.includes('"') || senha.includes('"') || senha2.includes('"')
        || nome.includes("'") || cpff.includes("'") || telefone.includes("'") || senha.includes("'") || senha2.includes("'")) {
            setEstado(true)
            setMensagem(`Alguns caracteres como (' ") não são permitidos`)
            setTimeout(() => {
                setEstado(false)
            }, 4000);
        }
        else if (nome.includes(" ") && nome.length < 3) {
            if (!nome.includes(1, 2, 3, 4, 5, 6, 7, 8, 9, 0)) {
                setEstado(true)
                setMensagem("Digite seu nome completo")
                setErrorNome(true)
                setTimeout(() => {
                    setEstado(false)
                    setErrorNome(false)
                }, 4000);
            }
        }
        else if (cpf.isValid(cpff) === false && cnpj.isValid(cpff) === false) {
            setEstado(true)
            setMensagem("CPF ou CNPJ inválido!")
            setErrorCpf(true)
            setTimeout(() => {
                setErrorCpf(false)
                setEstado(false)
            }, 4000);
        }
        else if (telefone.length < 11) {
            setEstado(true)
            setErrorTelefone(true)
            setMensagem("O telefone deve conter 11 caracteres!")
            setTimeout(() => {
                setErrorTelefone(false)
                setEstado(false)
            }, 4000);
        }
        else if (senha.length < 4) {
            setEstado(true)
            setErrorSenha(true)
            setMensagem("A senha deve conter no mínimo 4 caracteres!")

            setTimeout(() => {
                setErrorSenha(false)
                setEstado(false)
            }, 4000);
        }
        else if (senha2.length < 4) {
            setEstado(true)
            setErrorSenha(true)
            setMensagem("A senha deve conter no mínimo 4 caracteres!")
            setTimeout(() => {
                setErrorSenha(false)
                setEstado(false)
            }, 4000);
        }
        else if (senha !== senha2) {
            setEstado(true)
            setErrorSenha(true)
            setErrorSenha2(true)
            setMensagem("As senhas não coincidem!")

            setTimeout(() => {
                setErrorSenha(false)
                setErrorSenha2(false)
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
        else if(mail.length >= 0){
            if (!(await emailValidator.validate(mail)) && mail !== '') {
                    setEstado(true)
                    setErrorMail(true)
                    setMensagem("Email inválido!")
                    setTimeout(() => {
                        setErrorMail(false)
                        setEstado(false)
                    }, 4000);
                }
            else{
                const cell = extrairNumeros(telefone)
                const cpf2 = extrairNumeros(cpff)
                setCpff(cpf2)
                let cnpjNovo = ""
                let cpfNovo = ""
                if(cpf2.length === 11){
                     cpfNovo = cpf2
                     cnpjNovo = ''
                }else{
                     cnpjNovo = cpf2
                     cpfNovo = ''
                }
                setEstado2(true)
                const cadastro = await register(nome, mail, cpfNovo, cnpjNovo, cell, senha)
                if (cadastro.auth) {
                setMensagem2("Cadastro realizado com sucesso! Você será redirecionado a página de login")
                setSucesso(true)
                setEstado2(false)
                setTimeout(() => {
                    setSucesso(false)
                    setEstado2(false)
                    FuncTrocaComp( "LoginPage")
                }, 5000);
                }
            else {
                setEstado2(false)
                setEstado(true)
                setMensagem("Aviso! " + cadastro.message)
                setTimeout(() => {
                    setEstado(false)
                }, 4000);
            }
        }
            }
    }

    function popup() {
        return (
            Swal.fire({
                title: '',
                icon: 'info',
                html:
                    '<small>O cadastro online é a forma mais conveniente e econômica de efetuar seus pagamentos do dia a dia. <br/><br/>Além de prático e seguro é pré-carregado com valores os quais você define. <br/><br/>Dessa forma você mesmo limita seus gastos economizando muito mais. Você pode inclusive vincular placas de veículos de pessoas dependentes e familiares ao seu cadastro. <br/><br/>Uma vez cadastrado seu veículo, você compra créditos, recarrega sua conta de várias maneiras, pontos de venda, smartphone entre outras.</small>',

                showCloseButton: true,
                confirmButtonText:
                    '<i class="fa fa-thumbs-up"></i> Legal!',
                confirmButtonAriaLabel: 'Thumbs up, great!',
                width: 800,
            })
        )
    }

    const aceitarTermo = () => {
        const checkbox = document.getElementById('flexCheckDefault');
        checkbox.checked = true; 
    }


    const voltarLogin = () => {
        FuncTrocaComp( "LoginPage")
    }

    const telefoneRef = useRef(null)

    return (
        <section className="vh-lg-150 mt-5 mt-lg-5 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500 mb-4">
                            <div className="text-center text-md-center mb-2 mt-1 mt-md-0">
                                <img src="../../assets/img/logoconseproof2.png" alt="logo" />
                            </div>
                            <div>
                            <h6 className="pt-2"><strong>Preencha os dados abaixo e clique em acessar.</strong></h6>
                            <small id="modalTexto">O cadastro online é a forma mais conveniente e econômica de efetuar seus pagamentos do dia a dia. </small>
                            <small onClick={popup} className="pointer-cursor"><ins>Veja mais</ins></small>
                            </div>
                            <form className="mt-2">
                                <div className="form-group mb-2 text-start">
                                <Input.Wrapper label="Nome:">                        
                                    <Input icon={<IconUser size={18}/>} placeholder="Digite seu nome"
                                    id="nome" value={nome} onChange={(e) => setNome(e.target.value)}
                                    error={errorNome}
                                    />
                                </Input.Wrapper>
                                </div>
                                <div className="form-group mb-2 text-start">
                                <Input.Wrapper label="Email:">                        
                                    <Input icon={<IconMail size={18}/>} placeholder="Digite seu endereço de email (não obrigatório)"
                                    id="email" value={mail} onChange={(e) => setMail(e.target.value)}
                                    error={errorMail}
                                    />
                                </Input.Wrapper>
                                </div>
                                <div className="form-group mb-2 text-start">
                                <Input.Wrapper label="CPF/CNPJ:">                        
                                    <Input icon={<IconClipboardText size={18}/>} placeholder="Digite seu CPF p/ pessoa física ou CNPJ p/ jurídica"
                                    id="cpf" value={cpff} onChange={(e) => setCpff(e.target.value)}
                                    error={errorCpf}
                                    />
                                </Input.Wrapper>
                                </div>
                                <div className="form-group mb-2 text-start">
                                <Input.Wrapper label="Telefone:">                        
                                    <Input icon={<IconPhone size={18}/>} component={InputMask} mask={'(99) 99999-9999'} ref={telefoneRef} 
                                    id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} 
                                    placeholder="Digite seu número de telefone"
                                    error={errorTelefone}
                                    />
                                </Input.Wrapper>
                                </div>
                                <div className="form-group text-start">
                                    <div className="form-group mb-2">
                                        <PasswordInput
                                            icon={<IconLock size={18} />}
                                            placeholder="Digite sua senha"
                                            label="Senha:"
                                            id="password2" value={senha} onChange={(e) => setSenha(e.target.value)}
                                            error={errorSenha}
                                        />
                                    </div>
                                    <div className="form-group mb-2">
                                    <Input.Wrapper label="Confirme a senha:">                        
                                        <Input icon={<IconLockCheck size={18}/>} type="password" placeholder="Digite sua senha novamente"
                                        id="password" value={senha2} onChange={(e) => setSenha2(e.target.value)}
                                        error={errorSenha2}
                                        withAsterisk
                                        />
                                    </Input.Wrapper>
                                    </div>
                                    <div>
                                        <div className="form-check pt-2 mt-0">
                                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                            <span className="form-check-label">
                                                <small>Aceito os <a data-bs-toggle="modal" data-bs-target="#exampleModal"><u className="color-primary">termos de uso</u></a> e <a data-bs-toggle="modal" data-bs-target="#exampleModal"><u className="color-primary">política de privacidade.</u></a></small>
                                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Termos de uso e política de privacidade.</h1>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body" id="modalTexto">
                                                                <small><strong>SEÇÃO 1 - O QUE FAREMOS COM ESTA INFORMAÇÃO?</strong><br /><br />
                                                                    Quando você realiza alguma transação com nossa loja, como parte do processo de compra e venda, coletamos as informações pessoais que você nos dá tais como: nome, e-mail e endereço.

                                                                    Quando você acessa nosso site, também recebemos automaticamente o protocolo de internet do seu computador, endereço de IP, a fim de obter informações que nos ajudam a aprender sobre seu navegador e sistema operacional.

                                                                    Email Marketing será realizado apenas caso você permita. Nestes emails você poderá receber notícia sobre nossa loja, novos produtos e outras atualizações.
                                                                </small>
                                                                <br />
                                                                <br />
                                                                <small>
                                                                    <strong>SEÇÃO 2 - CONSENTIMENTO</strong><br /><br />
                                                                    Como vocês obtêm meu consentimento?

                                                                    Quando você fornece informações pessoais como nome, telefone e endereço, para completar: uma transação, verificar seu cartão de crédito, fazer um pedido, providenciar uma entrega ou retornar uma compra. Após a realização de ações entendemos que você está de acordo com a coleta de dados para serem utilizados pela nossa empresa.

                                                                    Se pedimos por suas informações pessoais por uma razão secundária, como marketing, vamos lhe pedir diretamente por seu consentimento, ou lhe fornecer a oportunidade de dizer não.

                                                                    E caso você queira retirar seu consentimento, como proceder?

                                                                    Se após você nos fornecer seus dados, você mudar de ideia, você pode retirar o seu consentimento para que possamos entrar em contato, para a coleção de dados contínua, uso ou divulgação de suas informações, a qualquer momento, entrando em contato conosco em consepro@gmail.com ou nos enviando uma correspondência em: Condominio Viena Shopping - R. Júlio de Castilhos, 2500 - 12 - Centro, Taquara - RS, 95600-000
                                                                </small>
                                                                <br />
                                                                <br />
                                                                <small>
                                                                    <strong>SEÇÃO 3 - DIVULGAÇÃO</strong><br /><br />
                                                                    Podemos divulgar suas informações pessoais caso sejamos obrigados pela lei para fazê-lo ou se você violar nossos Termos de Serviço.
                                                                </small>
                                                                <br />
                                                                <br />
                                                                <small>
                                                                    <strong>SEÇÃO 4 - SERVIÇOS DE TERCEIROS</strong><br /><br />
                                                                    No geral, os fornecedores terceirizados usados por nós irão apenas coletar, usar e divulgar suas informações na medida do necessário para permitir que eles realizem os serviços que eles nos fornecem.

                                                                    Entretanto, certos fornecedores de serviços terceirizados, tais como gateways de pagamento e outros processadores de transação de pagamento, têm suas próprias políticas de privacidade com respeito à informação que somos obrigados a fornecer para eles de suas transações relacionadas com compras.

                                                                    Para esses fornecedores, recomendamos que você leia suas políticas de privacidade para que você possa entender a maneira na qual suas informações pessoais serão usadas por esses fornecedores.

                                                                    Em particular, lembre-se que certos fornecedores podem ser localizados em ou possuir instalações que são localizadas em jurisdições diferentes que você ou nós. Assim, se você quer continuar com uma transação que envolve os serviços de um fornecedor de serviço terceirizado, então suas informações podem tornar-se sujeitas às leis da(s) jurisdição(ões) nas quais o fornecedor de serviço ou suas instalações estão localizados.

                                                                    Como um exemplo, se você está localizado no Canadá e sua transação é processada por um gateway de pagamento localizado nos Estados Unidos, então suas informações pessoais usadas para completar aquela transação podem estar sujeitas a divulgação sob a legislação dos Estados Unidos, incluindo o Ato Patriota.

                                                                    Uma vez que você deixe o site da nossa loja ou seja redirecionado para um aplicativo ou site de terceiros, você não será mais regido por essa Política de Privacidade ou pelos Termos de Serviço do nosso site.
                                                                </small>
                                                                <br />
                                                                <br />
                                                                <small>
                                                                    <strong>SEÇÃO 5 - SEGURANÇA</strong><br /><br />
                                                                    Para proteger suas informações pessoais, tomamos precauções razoáveis e seguimos as melhores práticas da indústria para nos certificar que elas não serão perdidas inadequadamente, usurpadas, acessadas, divulgadas, alteradas ou destruídas.

                                                                    Se você nos fornecer as suas informações de cartão de crédito, essa informação é criptografada usando tecnologia "secure socket layer" (SSL) e armazenada com uma criptografia AES-256. Embora nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro, nós seguimos todos os requisitos da PCI-DSS e implementamos padrões adicionais geralmente aceitos pela indústria.
                                                                </small>
                                                                <br />
                                                                <br />
                                                                <small>
                                                                    <strong>SEÇÃO 6 - ALTERAÇÕES PARA ESSA POLÍTICA DE PRIVACIDADE</strong><br /><br />
                                                                    Reservamos o direito de modificar essa política de privacidade a qualquer momento, então por favor, revise-a com frequência. Alterações e esclarecimentos vão surtir efeito imediatamente após sua publicação no site. Se fizermos alterações de materiais para essa política, iremos notificá-lo aqui que eles foram atualizados, para que você tenha ciência sobre quais informações coletamos, como as usamos, e sob que circunstâncias, se alguma, usamos e/ou divulgamos elas.

                                                                    Se nossa loja for adquirida ou fundida com outra empresa, suas informações podem ser transferidas para os novos proprietários para que possamos continuar a vender produtos para você.
                                                                </small>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn botao" data-bs-dismiss="modal" onClick={()=>aceitarTermo()}>Li e aceito.</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-5 gap-2 d-md-block">
                                    <button type="submit" className="btn2 botao" onClick={() => {voltarLogin()}}><span className='align-self-start'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                        <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                    </svg></span>Voltar</button>
                                    <button type="submit" onClick={handleSubmit} className="btn botao">Acessar  <span className='align-self-end'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg></span></button>

                                    <div className="mt-3" style={{ display: estado2 ? 'block' : 'none'}}>
                                    <Loader />
                                    </div>
                                    <p className='text-muted'> <small>Já possui uma conta? </small><small className="color-primary" onClick={() => {registrado()}}><u>Clique aqui!</u></small></p>
                                </div>
                            </form>
                            <div className="alert alert-danger" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                {mensagem}
                            </div>
                            <div className="alert alert-success" role="alert" style={{ display: sucesso ? 'block' : 'none' }}>
                                {mensagem2}
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </section >
    );
}

export default RegisterPage;