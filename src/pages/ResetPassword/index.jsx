import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from "../contexts/auth";

import "../LoginPage/styles.css"

const ResetPassword = () => {

    const [metodo, setMetodo] = useState("");
    const [inputLogin, setinputLogin] = useState("form-control");

    const handleSubmit = async (e) => {
        const checkValidate = document.getElementById("flexCheckDefault").checked;
        e.preventDefault();
        if (checkValidate) {
            if (metodo === "") {
                setinputLogin("form-control is-invalid");
            } else {
                setinputLogin("form-control is-valid");
            }
        }
    }

    return (
        <section class="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
                                <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
                            </div>
                            <p className="pt-2 pb-3 fs-5"><strong>Para recuperar sua senha digite o seu método de identificação registrado abaixo.</strong></p>
                            <div className="form-group mb-4">
                                <label htmlFor="metodo" id="labelLogin">CPF/CNPJ ou Email:</label>
                                <div className="input-group">
                                    <input className={inputLogin} name="email" id="email" value={metodo} onChange={(e) => setMetodo(e.target.value)} placeholder="Digite seu login CPF/CNPJ ou Email" />
                                </div>
                            </div>
                            <div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                    <span className="form-check-label" for="flexCheckDefault">
                                        <small>Receber código por Email</small>
                                    </span>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                    <span className="form-check-label" for="flexCheckDefault">
                                        <small>Receber código por WhatsApp</small>
                                    </span>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                    <span className="form-check-label" for="flexCheckDefault">
                                        <small>Receber código por SMS</small>
                                    </span>
                                </div>        
                            </div>
                            <div className="mt-5 mb-5 gap-2 d-md-block">
                                    <button type="submit" onClick="aaa" className="btn4 botao">Acessar  <span className='align-self-end'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg></span></button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default ResetPassword;