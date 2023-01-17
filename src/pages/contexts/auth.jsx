import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sha256 from 'crypto-js/sha256';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import {api, createSession } from '../../services/api'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const recoveredUser = localStorage.getItem('user');
        const teste = JSON.parse(recoveredUser);
        console.log(teste)
        if(teste){
            setUser(recoveredUser);
            navigate("/home")
        }
        else(navigate("/login"))

        setLoading(false);
    }, []);

    const login = async (login, senha) => {
        const password = sha256(senha).toString();
        console.log(password)
        const response = await createSession(login, password);
        console.log("login", response.data);
        try{
        if(response.data.auth === true && response.data.user.perfil.length === 1){
        const loggedUser = response.data.user;
        const token = response.data.token;
        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("token", token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        navigate('/home')
        }
        else if(response.data.auth === true && response.data.user.perfil.length > 1){
        const loggedUser = response.data.user;
        const token = response.data.token;
        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("token", token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        navigate('/double')
        }
        else{
            const MySwal = withReactContent(Swal)

            MySwal.fire({
                icon: 'error',
                title: 'Ops!',
                text: 'Você provavelmente escreveu algo errado, tente novamente!',
                footer: '<a href="/kkk">Ainda não possui uma conta? Clique aqui!</a>'
              })
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
        api.defaults.headers.Authorization = null;
        setUser(null);
        navigate("/login")
    }

    return(
    <AuthContext.Provider value={{ authenticated: 
        !!user, user, loading, login, logout}}>
            { children }
        </AuthContext.Provider>
    )
}