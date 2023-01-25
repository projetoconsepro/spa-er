import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import Dashboard from '../../components/Dashboard';
import Sidebar from '../../components/Sidebar';
import AdminMenu from '../../components/AdminMenu';

const HomePage = () => {
    const { authenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const teste = localStorage.getItem("user");
    const teste2 = JSON.parse(teste);
    console.log(teste2)

    const handleLogout = () => {
        logout();
    }


    useEffect(() => {
    
    if(teste2.perfil.length > 1){
        navigate('/double')
    }
    
    }, [])

    
    function funcao (){
    const componente = localStorage.getItem("componente");
    console.log(componente)
        if(componente === "MeusVeiculos"){
            return <Dashboard />
        }
        else if (componente === "RegistrarEstacionamento"){
            return <AdminMenu />
        }
        else{
            console.log("sfsf")
        }
    }
    
        if(!authenticated){
            navigate('/login')
        }


    return (
        <>
            <Sidebar />
            <main class="content">
            {funcao()}
            </main>
        </>
    )
}

export default HomePage;