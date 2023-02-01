import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sha256 from 'crypto-js/sha256';

import {api, createSession, registrar } from '../../services/api'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const recoveredUser = localStorage.getItem('user');
        const teste = JSON.parse(recoveredUser);
        if(teste){
            setUser(recoveredUser);
            navigate("/home")
        }
        setLoading(false);
    }, []);

    const register = async (nome, email, cpf, telefone , senha) => {
    const password = sha256(senha).toString();
    const response = await registrar(nome, email, cpf, telefone , password);
    console.log("register", response.data.message);
        try{
        if(response.data.msg.resultado === true){
        const registrou = localStorage.setItem("registrou", true)
        console.log(registrou)
        return {
            auth: response.data.msg.resultado,
            message: response.data.msg.msg
        }
        }
        return {
            auth: response.data.msg.resultado,
            message: response.data.msg.msg
        }
    
        }catch(error){
            console.log(error)
        }
    }

    const login = async (login, senha) => {
        const password = sha256(senha).toString();
        console.log(password)
        const response = await createSession(login, password);
        try{
        console.log("login", response.data);
        if(response.data.msg.resultado === true) {
        console.log("teste", response.data.dados.user.perfil.length)
        if(response.data.msg.resultado === true && response.data.dados.user.perfil.length === 1){
        const loggedUser = response.data.dados.user;
        const token = response.data.dados.token;
        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("token", token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        console.log("Qwfowejfg")
        navigate('/home')
        }
        else if(response.data.msg.resultado === true && response.data.dados.user.perfil.length > 1){
        const loggedUser = response.data.dados.user;
        const token = response.data.dados.token;
        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("token", token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        navigate('/double')
        }
        }
        else {
        return {
            auth: response.data.msg.resultado,
            message: response.data.msg.msg
        };
    }
        

        }catch(error){
            console.log(error);
        }

    }

    const logout = () => {
        console.log("logout");
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        localStorage.removeItem("perfil")
        localStorage.removeItem("perfil2")
        localStorage.removeItem("componente")
        api.defaults.headers.Authorization = null;
        setUser(null);
        navigate("/")
    }

    return(
    <AuthContext.Provider value={{ authenticated: 
        !!user, user, loading, login, logout, register}}>
            { children }
        </AuthContext.Provider>
    )
}