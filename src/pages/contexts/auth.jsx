import React, { createContext, useState, useEffect } from "react";
import sha256 from 'crypto-js/sha256';

import {api, createSession, registrar } from '../../services/api'
import FuncTrocaComp from "../../util/FuncTrocaComp";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const recoveredUser = localStorage.getItem('user');
        const teste = JSON.parse(recoveredUser);
        if(teste){
            setUser(recoveredUser);
        }
        
        setLoading(false);
    }, []);

    const register = async (nome, email, cpf, cnpj, telefone , senha) => {
    const password = sha256(senha).toString();
    const response = await registrar(nome, email, cpf, cnpj, telefone , password);
        try{
        if(response.data.msg.resultado === true){
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
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        }
    }

    const login = async (login, senha) => {
        const password = sha256(senha).toString();
        const response = await createSession(login, password);
        try{
        if (response.data.msg.resultado === true) {
        if (response.data.dados.senhaPadrao === true) {
            localStorage.setItem('id_usuario', response.data.dados.usuario.id_usuario);
            localStorage.setItem('SenhaDefault', true)
            FuncTrocaComp( 'NewPassword');
            return {
                auth: response.data.msg.resultado,
                message: response.data.msg.msg
            };
        } else {
        if (response.data.msg.resultado === true && response.data.dados.usuario.perfil.length === 1) {
        let loggedUser = response.data.dados.usuario;
        loggedUser.perfil = [loggedUser.perfil[0].perfil];
        const token = response.data.dados.token;
        if (loggedUser.perfil[0] === 'cliente'){
            FuncTrocaComp( 'MeusVeiculos');
        } else if (loggedUser.perfil[0] === 'monitor'){
            FuncTrocaComp( 'ListarVagasMonitor');
        } else if (loggedUser.perfil[0] === 'parceiro'){
            FuncTrocaComp( 'RegistrarEstacionamentoParceiro');
        } else if (loggedUser.perfil[0] === 'admin'){
            FuncTrocaComp( 'Dashboard');
        } else if (loggedUser.perfil[0] === 'agente'){
            FuncTrocaComp( 'ListarNotificacoesAgente');
        }
        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("token", token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        } else if(response.data.msg.resultado === true && response.data.dados.usuario.perfil.length > 1){
        const loggedUser = response.data.dados.usuario;
        const token = response.data.dados.token;
        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("token", token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        FuncTrocaComp( 'EscolherPerfil');
        }
        return {
            auth: response.data.msg.resultado,
            message: response.data.msg.msg
        };
        }
        } else {
        return {
            auth: response.data.msg.resultado,
            message: response.data.msg.msg
        };
    }
        

        }catch(error){
                        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        }

    }

    const logout = () => {
        api.defaults.headers.Authorization = null;
        setUser(null);
    }


    return(
    <AuthContext.Provider value={{ authenticated: 
        !!user, user, loading, login, logout, register}}>
            { children }
        </AuthContext.Provider>
    )
}