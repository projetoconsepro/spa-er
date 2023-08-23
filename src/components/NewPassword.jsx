import axios from "axios";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import sha256 from "crypto-js/sha256";
import FuncTrocaComp from "../util/FuncTrocaComp";
import VoltarComponente from "../util/VoltarComponente";
import { Button, Input, PasswordInput } from "@mantine/core";
import { IconLock, IconPhone } from "@tabler/icons-react";
import { IconLockCheck } from "@tabler/icons-react";
import ReactInputMask from "react-input-mask";

const NewPassword = () => {
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const codigoConfirm = localStorage.getItem("codigoConfirm");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [errorSenha, setErrorSenha] = useState(false);
  const [errorSenha2, setErrorSenha2] = useState(false);
  const [telefone] = useState(localStorage.getItem("telefone"));
  const [input, setInput] = useState("");
  const [errorSenhaTelefone, setErrorSenhaTelefone] = useState(false);

  function extrairNumeros(string) {
    return string ? string.replace(/\D/g, '') : string;
}

  const handleSubmit = async () => {

    if (telefone === "Não cadastrado") {
        if (input === "") {
            setErrorSenhaTelefone(true);
            setMensagem("Digite seu telefone!");
            setEstado(true);
            setTimeout(() => {
                setErrorSenhaTelefone(false);
                setMensagem("");
                setEstado(false);
            }, 4000);
            return;
        }
    }

    if (senha === senha2 && senha.length >= 4) {
      const password = sha256(senha).toString();
      const veiculo = axios.create({
        baseURL: process.env.REACT_APP_HOST,
      });
      if (localStorage.getItem("SenhaDefault") === "true") {
        veiculo
          .post("/usuario/senha", {
            senha: password,
            id_usuario: localStorage.getItem("id_usuario"),
          })
          .then((response) => {
            const resposta = response.data.msg.resultado;
            if (resposta === false) {
              setMensagem(response.data.msg.msg);
              setEstado(true);
              setTimeout(() => {
                setMensagem("");
                setEstado(false);
              }, 4000);
            } else {
              localStorage.removeItem("codigoConfirm");
              FuncTrocaComp("LoginPage");
            }
          })
          .catch(function (error) {
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
              console.log(error);
            }
          });
      } else {
        let cell = ''
        if (telefone === "Não cadastrado") {
            cell = extrairNumeros(input);
        }
        veiculo
          .post("/usuario/senha", {
            codigo_seguranca: codigoConfirm,
            senha: password,
            ...(cell !== 'Não cadastrado' ? { telefone: cell } : {})
          })
          .then((response) => {
            const resposta = response.data.msg.resultado;
            if (resposta === false) {
              setMensagem(response.data.msg.msg);
              setEstado(true);
              setTimeout(() => {
                setMensagem("");
                setEstado(false);
              }, 4000);
            } else {
              localStorage.removeItem("codigoConfirm");
              localStorage.removeItem("SenhaDefault");
              localStorage.removeItem("telefone");
              FuncTrocaComp("LoginPage");
            }
          })
          .catch(function (error) {
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
              console.log(error);
            }
          });
      }
    } else {
      setErrorSenha2(true);
      setErrorSenha(true);
      setMensagem(
        "As senhas não coincidem ou não possuem o tamanho mínimo de 4 caracteres!"
      );
      setEstado(true);
      setTimeout(() => {
        setErrorSenha2(false);
        setErrorSenha(false);
        setMensagem("");
        setEstado(false);
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
            <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
              <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
                <img
                  src="../../assets/img/logoconseproof2.png"
                  alt="logo"
                  className="mb-4"
                />
              </div>
              <p className="pt-2 pb-3 fs-5">
                <strong>Digite sua nova senha{telefone === "Não cadastrado" ? ' e telefone: ' : ': '}</strong>
              </p>
              
              {telefone === "Não cadastrado" ? (
                <div className="form-group mb-4 text-start">
                <small><span>Telefone:</span></small>
                  <Input
                    icon={<IconPhone size={18} />}
                    placeholder="Digite seu telefone"
                    autocomplete="off"
                    value={input}
                    component={ReactInputMask} mask={'(99) 99999-9999'}
                    onChange={(e) => setInput(e.target.value)}
                    error={setErrorSenhaTelefone}
                    className="mt-1"
                  />
                </div>
              ) : null}
              <div className="form-group mb-4 text-start">
                <PasswordInput
                  label="Senha:"
                  autocomplete="off"
                  icon={<IconLock size={18} />}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  error={errorSenha}
                />
              </div>
              <div className="form-group mb-4">
                <Input
                  icon={<IconLockCheck size={18} />}
                  type="password"
                  autocomplete="off"
                  placeholder="Digite sua senha novamente"
                  value={senha2}
                  onChange={(e) => setSenha2(e.target.value)}
                  error={errorSenha2}
                />
              </div>
              <div className="mt-5 mb-5 gap-2 d-md-block">
                <VoltarComponente space={true} />
                <Button
                  onClick={() => handleSubmit()}
                  loaderPosition="right"
                  className="bg-blue-50"
                  size="md"
                  radius="md"
                >
                  Confirmar
                </Button>
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
  );
};

export default NewPassword;
