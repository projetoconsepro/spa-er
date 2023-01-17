import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from "../contexts/auth";
import sha256 from 'crypto-js/sha256';

import "./styles.css"

const LoginPage = () => {
    const { authenticated, login} = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit", { email, password });
        login(email, password);
    }
    
    return (
        <section class="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
            <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
            <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="text-center text-md-center mb-4 mt-md-0">
                <h1 className="mb-0 h3">Faça login</h1>
            </div>
            <p>{String(authenticated)}</p>
            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                    <label htmlFor="email">Email</label>
                    <div className="input-group">
                       <span className="input-group-text" id="basic-addon1">
                      <svg className="icon icon-xs text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                        </span>
                    <input className="form-control" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="password">Senha</label>
                    <div class="input-group">
                        <span class="input-group-text" id="basic-addon2">
                    <svg class="icon icon-xs text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                     </span>
                    <input className="form-control" type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="mt-3 mb-4 text-center">
                    <button type="submit" className="btn btn-gray-800">Entrar</button>
                </div>
            </form>
            </div>
            </div>
            </div>
            </div>
        </section>
    )
}

export default LoginPage;