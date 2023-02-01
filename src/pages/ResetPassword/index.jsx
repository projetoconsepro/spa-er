import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import "../LoginPage/styles.css";
import { Navigate, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [metodo, setMetodo] = useState("");
  const [inputLogin, setinputLogin] = useState("form-control");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [checkValidate1, setCheckValidate1] = useState(false);
  const [checkValidate2, setCheckValidate2] = useState(false);
  const [checkValidate3, setCheckValidate3] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();
  const checks = document.querySelectorAll('input[type="checkbox"]');

  const checkBoxValidate = () => {
    if (checks[0].checked === true) {
      checks[1].disabled = true;
      checks[2].disabled = true;
    } else if (checks[1].checked === true) {
      checks[0].disabled = true;
      checks[2].disabled = true;
    } else if (checks[2].checked === true) {
      checks[0].disabled = true;
      checks[1].disabled = true;
    } else {
      checks[0].disabled = false;
      checks[1].disabled = false;
      checks[2].disabled = false;
    }
  };

  const handleSubmit = async (e) => {
    setCheckValidate1(document.getElementById("flexCheckDefault1").checked);
    setCheckValidate1(document.getElementById("flexCheckDefault1").checked);
    setCheckValidate1(document.getElementById("flexCheckDefault1").checked);
    if(!sucesso){
    if (metodo === "") {
      setMensagem("Digite seu dado de identificação");
      setEstado(true);
      setTimeout(() => {
        setEstado(false);
      }, 4000);
    } 
    else{
        const veiculo = axios.create({
            baseURL: "http://localhost:3001",
        })
        
        veiculo.get('/verificar?cpf=03626831078').then(
            response => {
                const resposta = response.data.msg.resultado;
                console.log(resposta);
                if (resposta === false){
                    setMensagem(response.data.msg.msg);
                    setEstado(true);
                    setTimeout(() => {
                        setEstado(false);
                    }, 4000);
                }
                else{
                    setSucesso(true);
                }
            }
        ).catch(function (error) {
            console.log(error);
        });
    }
    }else{
     if (
      checks[0].checked === false &&
      checks[1].checked === false &&
      checks[2].checked === false
    ) {
      setMensagem("Selecione um método de recuperação de senha");
      setEstado(true);
      setTimeout(() => {
        setEstado(false);
      }, 4000);
    } else if (checks[1].checked || checks[2].checked) {
      setMensagem("Método de recuperação de senha não implementado");
      setEstado(true);
      setTimeout(() => {
        setEstado(false);
      }, 4000);
    }
    else{

        const veiculo = axios.create({
            baseURL: "http://localhost:3001",
        })
        
        veiculo.get('/codigo-recuperacao-senha?email=wendelfi66@gmail.com').then(
            response => {
                const resposta = response.data.msg.resultado;
                console.log(resposta);
                if (resposta === false){
                    setMensagem(response.data.msg.msg);
                    setEstado(true);
                    setTimeout(() => {
                        setEstado(false);
                    }, 4000);
                }
                else{
                    navigate('/confirmacao')
                }
            }
        ).catch(function (error) {
            console.log(error);
        });
}
  };
}

  return (
    <section class="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
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
              <div className="form-group mb-4">
                <label htmlFor="metodo" id="labelLogin">
                  Email ou Telefone:
                </label>
                <div className="input-group">
                  <input
                    className={inputLogin}
                    name="email"
                    id="email"
                    value={metodo}
                    onChange={(e) => setMetodo(e.target.value)}
                    placeholder="Digite seu email ou telefone"
                  />
                </div>
              </div>
              <div onChange={checkBoxValidate} style={{ display: sucesso ? 'block' : 'none' }}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    value={checkValidate1}
                    type="checkbox"
                    id="flexCheckDefault1"
                  />
                  <span className="form-check-label" for="flexCheckDefault">
                    <small>Receber código por Email</small>
                  </span>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    value={checkValidate2}
                    type="checkbox"
                    id="flexCheckDefault2"
                  />
                  <span className="form-check-label" for="flexCheckDefault">
                    <small>Receber código por WhatsApp</small>
                  </span>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={checkValidate3}
                    id="flexCheckDefault3"
                  />
                  <span className="form-check-label" for="flexCheckDefault">
                    <small>Receber código por SMS</small>
                  </span>
                </div>
              </div>
              <div className="mt-5 mb-5 gap-2 d-md-block">
                <button onClick={handleSubmit} className="btn4 botao">
                  {sucesso ? "Gerar código " : "Avançar "}
                  <span className="align-self-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  </span>
                </button>
              </div>
              <div
                class="alert alert-danger"
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
