import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import Sidebar from '../../components/Sidebar';
import Componentes from './Componentes';
import { useState } from 'react';

const HomePage =  () => {
    const { authenticated, logout } = useContext(AuthContext);
    const [data , setData] = useState('');
    const navigate = useNavigate();
    const teste = localStorage.getItem("user");
    const teste2 = JSON.parse(teste);
    const [cont, setCont] = useState(0);

    const handleLogout = () => {
        logout();
    }

    if(teste === null || teste === undefined){
        if (localStorage.getItem("componente") !== "RegisterPage" && localStorage.getItem("componente") !== "LoginPage"
            && localStorage.getItem("componente") !== "NewPassword" && localStorage.getItem("componente") !== "Confirmation"
            && localStorage.getItem("componente") !== "ResetPassword") {
            localStorage.setItem("componente", "LoginPage");
        }
    } else {
        if (localStorage.getItem("componente") === "RegisterPage" || localStorage.getItem("componente") === "LoginPage"
            || localStorage.getItem("componente") === "NewPassword" || localStorage.getItem("componente") === "Confirmation"
            || localStorage.getItem("componente") === "ResetPassword") {
            if (teste2.perfil[0] === 'cliente') {
            localStorage.setItem("componente", "MeusVeiculos");
            } else if (teste2.perfil[0] === 'monitor') {
                localStorage.setItem("componente", "ListarVagasMonitor");
            } else if (teste2.perfil[0] === 'parceiro') {
                localStorage.setItem("componente", "RegistrarEstacionamentoParceiro");
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setCont(cont + 1)
        }, 500);
        setData(localStorage.getItem("componente"));
    }, [cont])

    return (
        <>
        {teste2 === null || data === "EscolherPerfil" ? null : <Sidebar />}
        {teste2 !== null && data !== "EscolherPerfil" ?
            <main className="content">
                    {data === '' ? null : <Componentes Componente={data} />}
            </main> : 
            <main className="main">
                {data === '' ? null  : <Componentes Componente={data} />}
            </main>
            }
        </>
    )
}

export default HomePage;