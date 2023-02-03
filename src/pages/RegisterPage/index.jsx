import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import Swal from 'sweetalert2'
import { cpf, cnpj } from 'cpf-cnpj-validator';
import emailValidator from 'email-validator';
import { IMaskInput } from 'react-imask';
import '../LoginPage/styles.css';


const RegisterPage = () => {
    const { register } = useContext(AuthContext);
    const [nome, setNome] = useState("");
    const [mail, setMail] = useState('');
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
    const [classolho, setClassolho] = useState("olho");


    const navigate = useNavigate();

    const registrado = () => {
        localStorage.setItem("registrou", "true");
    }

    const handleSubmit = async (e) => {
        const checkValidate = document.getElementById("flexCheckDefault").checked;
        e.preventDefault();
        if (nome === "" || cpf === "" || telefone === "" || senha === "" || senha2 === "") {
            if (nome === "") {
                setInputNome("form-control is-invalid")
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
        } else if (nome.includes(" ") && nome.length < 3) {
            if (!nome.includes(1, 2, 3, 4, 5, 6, 7, 8, 9, 0)) {
                setEstado(true)
                setMensagem("Digite seu nome completo")
                setInputNome("form-control is-invalid")
                setTimeout(() => {
                    setEstado(false)
                    setInputNome("form-control")
                }, 4000);
            }
        }
        else if(mail !== ""){
        if (!await emailValidator.validate(mail)) {
                setEstado(true)
                setInputMail("form-control is-invalid")
                setMensagem("Email inválido!")
                setTimeout(() => {
                    setInputMail("form-control")
                    setEstado(false)
                }, 4000);
            }
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
            console.log(telefone)
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
        else if (senha2.length < 8) {
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
                    navigate("/")
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

    function popup() {
        return (
            Swal.fire({
                title: '',
                icon: 'info',
                html:
                    '<small>O cadastro online é a forma mais conveniente e econômica de efetuar seus pagamentos do dia a dia. <br/><br/>Além de prático e seguro é pré-carregado com valores os quais você define. <br/><br/>Dessa forma você mesmo limita seus gastos economizando muito mais. Você pode inclusive vincular placas de veículos de pessoas dependentes e familiares ao seu cadastro. <br/><br/>Uma vez cadastrado seu veículo, você compra créditos, recarrega sua conta de vários maneiras, pontos de venda, smartphone entre outras.</small>',

                showCloseButton: true,
                confirmButtonText:
                    '<i class="fa fa-thumbs-up"></i> Legal!',
                confirmButtonAriaLabel: 'Thumbs up, great!',
                width: 800,
            })
        )
    }

    return (
        <section className="vh-lg-150 bg-soft mt-5 mt-lg-5 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
                                <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
                            </div>
                            <small className="text-left">O cadastro online é a forma mais conveniente e econômica de efetuar seus pagamentos do dia a dia. </small>
                            <small onClick={popup} className="pointer-cursor"><ins>Veja mais</ins></small>
                            <p className="pt-2"><strong>Preencha os dados abaixo e clique em avançar.</strong></p>
                            <form action="#" className="mt-4">
                                <div className="form-group mb-4">
                                    <label htmlFor="email" id="labelLogin">Nome:</label>
                                    <div className="input-group">
                                        <input className={inputNome} name="nome" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite seu nome" />
                                    </div>
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="email" id="labelLogin">Email:</label>
                                    <div className="input-group">
                                        <input className={inputMail} name="email" id="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Digite seu endereço de email (não obrigatório)" />
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
                                        <IMaskInput className={inputTelefone} name="email" id="email" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Digite seu número de telefone" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="form-group mb-4">
                                        <label htmlFor="password" id="labelLogin">Senha:</label>
                                        <div className="input-group">
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
                                    <div className="form-group mb-4">
                                        <label htmlFor="password" id="labelLogin">Confirme sua senha:</label>
                                        <div className="input-group">
                                            <input className={inputSenha2} type="password" name="password" id="password" value={senha2} onChange={(e) => setSenha2(e.target.value)} placeholder="Digite sua senha novamente" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                            <span className="form-check-label" for="flexCheckDefault">
                                                <small>Aceito os <a data-bs-toggle="modal" data-bs-target="#exampleModal"><u className="color-primary">termos de uso</u></a> e <a data-bs-toggle="modal" data-bs-target="#exampleModal"><u className="color-primary">política de privacidade.</u></a></small>
                                                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                                <button type="button" className="btn botao" data-bs-dismiss="modal">Li e aceito.</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 mb-5 gap-2 d-md-block">
                                    <button type="submit" className="btn2 botao"><span className='align-self-start'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                    </svg></span> <a href="/">Voltar</a></button>
                                    <button type="submit" onClick={handleSubmit} className="btn botao">Acessar  <span className='align-self-end'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg></span></button>
                                    <p className='text-muted' onClick={registrado}> <small>Já possui uma conta?</small> <a href='/'><small className="color-primary"><u>Clique aqui!</u></small></a></p>
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
                </div >
            </div >
        </section >
    );
}

export default RegisterPage;