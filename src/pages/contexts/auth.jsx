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
            localStorage.setItem("componente", "HomePage")
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
        const response = await createSession(login, password);
        try{
        if(response.data.msg.resultado === true) {
        if(response.data.msg.resultado === true && response.data.dados.usuario.perfil.length === 1){
        let loggedUser = response.data.dados.usuario;
        loggedUser.perfil = [loggedUser.perfil[0].perfil];
        const token = response.data.dados.token;
        if(loggedUser.perfil[0] === 'cliente'){
            localStorage.setItem('componente', 'MeusVeiculos');
        }else if (loggedUser.perfil[0] === 'monitor'){
            localStorage.setItem('componente', 'ListarVagasMonitor');
        }
        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("token", token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        localStorage.setItem("componente", "HomePage")
        }
        else if(response.data.msg.resultado === true && response.data.dados.usuario.perfil.length > 1){
        const loggedUser = response.data.dados.usuario;
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
        navigate('/')
        localStorage.setItem("componente", "LoginPage")
        localStorage.setItem("registrou", true)
    }

    return(
    <AuthContext.Provider value={{ authenticated: 
        !!user, user, loading, login, logout, register}}>
            { children }
        </AuthContext.Provider>
    )
}