import React, { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { AuthContext } from "../pages/contexts/auth";
import FuncTrocaComp from "../util/FuncTrocaComp";
import {
  Button,
  Group,
  Input,
  PasswordInput,
  Modal,
  Card,
  Text,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { IconLock } from "@tabler/icons-react";
import { FaCar, FaClipboard, FaCoins} from "react-icons/fa";
import axios from "axios";
import extrairNumeros from "../util/extrairNumeros";

const LoginPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [mensagem2, setMensagem2] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const [errorSenha, setErrorSenha] = useState(false);
  const [emailDois, setEmailDois] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    localStorage.removeItem("SenhaDefault");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("componenteAnterior");
  }, []);

  const handleSubmit = async (e) => {
    if (email === "" || password === "") {
      setEstado(true);
      setMensagem("Preencha todos os campos!");
      if (email === "") {
        //setinputLogin("form-control is-invalid")
        setErrorLogin(true);
      }
      if (password === "") {
        //setInputSenha("form-control is-invalid")
        setErrorSenha(true);
      }
      setTimeout(() => {
        setErrorLogin(false);
        setErrorSenha(false);
        setEstado(false);
      }, 4000);
    } else if (
      email.includes("'") ||
      password.includes("'") ||
      email.includes('"') ||
      password.includes('"')
    ) {
      setEstado(true);
      setMensagem(`Alguns caracteres como (' ") não são permitidos`);
      setTimeout(() => {
        setErrorLogin(false);
        setErrorSenha(false);
        setEstado(false);
      }, 4000);
    } else {
      e.preventDefault();
      let emailNovo = email;
      if (cpf.isValid(emailNovo) || cnpj.isValid(emailNovo)) {
        emailNovo = extrairNumeros(email);
      }
      const resposta = await login(emailNovo, password);
      if (resposta.auth === false) {
        setEstado(true);
        setMensagem(resposta.message);
        setErrorLogin(true);
        setErrorSenha(true);
        setTimeout(() => {
          setEstado(false);
          setErrorLogin(false);
          setErrorSenha(false);
        }, 6000);
      } else {
        const user = JSON.parse(localStorage.getItem("user"));
        const perfil = user.perfil[0];
        if (perfil === "cliente") {
          const token = btoa(unescape(encodeURIComponent(localStorage.getItem("token"))));
          const id_usuario = btoa(user.id_usuario);
          if (window.ReactNativeWebView) {
            const data = {
              type: "login",
              token: token,
              id_usuario: id_usuario,
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }
        }
      }
    }
  };

  const registrado = () => {
    FuncTrocaComp("RegisterPage");
  };

  const recuperar = () => {
    FuncTrocaComp("ResetPassword");
  };

  const contaAntiga = () => {
    if (emailDois !== "") {
      setLoading(true);
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
      });
      requisicao
        .get(`/verificar?email=${emailDois}`)
        .then((response) => {
          const resposta = response.data.msg.resultado;
          if (resposta === false) {
            setLoading(false);
            setMensagem2(response.data.msg.msg);
            setEstado2(true);
            setTimeout(() => {
              setEstado2(false);
            }, 4000);
          } else {
            const telefone = response.data.usuario[0].telefone; 
            localStorage.setItem("email", emailDois);
            const veiculo = axios.create({
              baseURL: process.env.REACT_APP_HOST,
            });
            veiculo
              .get(`/codigo-recuperacao-senha?email=${emailDois}`)
              .then((response) => {
                const resposta = response.data.msg.resultado;
                if (resposta === false) {
                  setLoading(false);
                  setMensagem2(response.data.msg.msg);
                  setEstado2(true);
                  setTimeout(() => {
                    setEstado2(false);
                  }, 4000);
                } else {
                  if (telefone === "") {
                    localStorage.setItem("telefone", "Não cadastrado");
                  }
                  FuncTrocaComp("Confirmation");
                }
              })
              .catch(function (error) {
                setLoading(false);
                if (
                  error?.response?.data?.msg === "Cabeçalho inválido!" ||
                  error?.response?.data?.msg === "Token inválido!" ||
                  error?.response?.data?.msg ===
                    "Usuário não possui o perfil mencionado!"
                ) {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  localStorage.removeItem("perfil");
                } else {
                  setLoading(false);
                  console.log(error);
                }
              });
          }
        })
        .catch(function (error) {
          setLoading(false);
          if (
            error?.response?.data?.msg === "Cabeçalho inválido!" ||
            error?.response?.data?.msg === "Token inválido!" ||
            error?.response?.data?.msg ===
              "Usuário não possui o perfil mencionado!"
          ) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("perfil");
          } else {
            setLoading(false);
            console.log(error);
          }
        });
    } else {
      setLoading(false);
      setMensagem2("Digite um email válido!");
      setEstado2(true);
      setTimeout(() => {
        setEstado2(false);
      }, 4000);
    }
  };

  return (
    <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
      <div className="container">
        <div
          className="row justify-content-center form-bg-image"
          data-background-lg="../../assets/img/illustrations/signin.svg"
        >
          <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="bg-gray-100 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
              <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
                <img
                  src="../../assets/img/logoconseproof2.png"
                  alt="logo"
                  className="mb-4"
                />
              </div>
              <div className="form-group mb-4 text-start">
                <Input.Wrapper label="Login:">
                  <Input
                    icon={<IconUser size={18} />}
                    placeholder="Digite seu login CPF/CNPJ ou Email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errorLogin}
                  />
                </Input.Wrapper>
              </div>
              <div className="form-group mb-2 text-start">
                <PasswordInput
                  icon={<IconLock size={18} />}
                  placeholder="Digite sua senha"
                  label="Senha:"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errorSenha}
                />
              </div>
              <p className="esqueciSenha">
                <small
                  onClick={() => {
                    recuperar();
                  }}
                  className="color-primary"
                >
                  <u>Esqueci minha senha</u>
                </small>
              </p>

              <div className="mt-3 mb-4 text-center" onClick={() => open()}>
                <img
                  src="../../assets/img/Banner.png"
                  style={{ borderRadius: "10px" }}
                  alt="gif"
                />
              </div>

              <div className="mt-5 mb-4 text-center">
                <button
                  type="submit"
                  className="btn botao"
                  onClick={handleSubmit}
                >
                  Acessar <span className="align-self-end">➜</span>
                </button>
                <p className="text-muted">
                  {" "}
                  <small>Ainda não possui uma conta?</small>{" "}
                  <small
                    className="color-primary"
                    onClick={() => {
                      registrado();
                    }}
                  >
                    <u>Clique aqui!</u>
                  </small>
                </p>
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
      <Modal
        opened={opened}
        onClose={close}
        title="Recuperar conta antiga"
        centered
      >
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group position="left">
            <Text fz="md">
              Digite seu email abaixo para sincronizar sua conta.
            </Text>
            <div className="row">
              <div className="col-12">
                <h6>
                  <small>Será recuperado:</small>
                </h6>
                <div className="row">
                <div className="col-12 px-4"><FaClipboard size={15} />  <small>Suas informações</small></div>
                </div>
                <div className="row">
                  <div className="col-12 px-4"><FaCar size={15} />  <small>Seus veículos</small></div>
                </div>
                <div className="row">
                <div className="col-12 px-4"><FaCoins size={15} />  <small>Seu saldo</small></div>
                </div>
              </div>
            </div>
          </Group>
          <Divider my="sm" size="md" variant="dashed" />
          <small className="mt-3">
            <span>Email: </span>
          </small>
          <Input
            label="Email:"
            icon={<IconMail size={18} />}
            placeholder="Digite seu email"
            value={emailDois}
            onChange={(e) => setEmailDois(e.target.value)}
          />
          <div className="mt-3 mb-4 text-center">
            <Button
              variant="gradient"
              loading={loading}
              onClick={() => contaAntiga()}
            >
              Avançar{" "}
            </Button>
          </div>
          <div
            className="alert alert-danger"
            role="alert"
            style={{ display: estado2 ? "block" : "none" }}
          >
            {mensagem2}
          </div>
        </Card>
      </Modal>
    </section>
  );
};

export default LoginPage;
