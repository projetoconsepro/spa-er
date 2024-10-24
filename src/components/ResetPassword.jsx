import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { Input } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

const ResetPassword = () => {
  const [metodo, setMetodo] = useState("");
  const [inputLogin] = useState("form-control");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [checkValidate1] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e) => {
    const checks = document.querySelectorAll('input[type="checkbox"]');
    if(!sucesso){
      if (
        checks[0].checked === false
      ) {
        setMensagem("Selecione um método de recuperação de senha");
        setEstado(true);
        setTimeout(() => {
          setEstado(false);
        }, 4000);
      } else if (1 == 2 ) {
        setMensagem("Método de recuperação de senha não implementado");
        setEstado(true);
        setTimeout(() => {
          setEstado(false);
        }, 4000);
      }
    else{
        setSucesso(true);
    } 
  }else{
    if (metodo === "") {
      setMensagem("Digite seu dado de identificação");
      setEstado(true);
      setTimeout(() => {
        setEstado(false);
      }, 4000);
    } 
    else{
      const veiculo = axios.create({
        baseURL: process.env.REACT_APP_HOST,
    })
    veiculo.get(`/verificar?email=${metodo}`).then(
        response => {
            const resposta = response.data.msg.resultado;
            if (resposta === false){
                setMensagem(response.data.msg.msg);
                setEstado(true);
                setTimeout(() => {
                    setEstado(false);
                }, 4000);
            }
            else{
              localStorage.setItem('email', metodo);
              const veiculo = axios.create({
                baseURL: process.env.REACT_APP_HOST,
            })
            veiculo.get(`/codigo-recuperacao-senha?email=${metodo}`).then(
                response => {
                    const resposta = response.data.msg.resultado;
                    if (resposta === false){
                        setMensagem(response.data.msg.msg);
                        setEstado(true);
                        setTimeout(() => {
                            setEstado(false);
                        }, 4000);
                    }
                    else{
                      FuncTrocaComp('Confirmation')
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
      }).catch(function (error) {
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
    }
  };

  const voltarPagina = () => {
    FuncTrocaComp( 'LoginPage')
  }

  return (
    <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
      <div className="container">
        <div
          className="row justify-content-center form-bg-image"
          data-background-lg="../../assets/img/illustrations/signin.svg"
        >
          <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
              <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
                <img
                  src="../../assets/img/logoconseproof2.png"
                  alt="logo"
                  className="mb-4"
                />
              </div>
              <p className="pt-2 pb-3 fs-5">
                <strong>
                  Para recuperar sua senha digite o seu método de identificação
                  registrado abaixo.
                </strong>
              </p>
              <div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    value={checkValidate1}
                    type="checkbox"
                    id="flexCheckDefault1"
                  />
                  <span className="form-check-label">
                    <small>Receber código por Email</small>
                  </span>
                </div>
              </div>
              <div className="text-start" style={{ display: sucesso ? 'block' : 'none' }}>
                <div>
                  <label className="mt-3 text-start">Email:</label>
                  <Input
                    icon={<IconUser  />}
                    label= "Email"
                    name="email"
                    value={metodo}
                    onChange={(e) => setMetodo(e.target.value)}
                    placeholder="Digite seu email ou telefone"
                  />
                </div>
              </div>
              <div className="mt-5 mb-6 gap-2 d-md-block">
                <button type="submit" className="btn2 botao" onClick={() => {voltarPagina()}}>Voltar</button>
                <button onClick={handleSubmit} className="btn3 botao">
                  {sucesso ? "Gerar código " : "Avançar "}
                </button>
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

export default ResetPassword;
