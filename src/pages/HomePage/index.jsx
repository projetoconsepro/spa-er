import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import Sidebar from '../../components/Sidebar';
import Veiculos from './veiculos';

const HomePage =  () => {
    const { authenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const teste = localStorage.getItem("user");
    const teste2 = JSON.parse(teste);

    const handleLogout = () => {
        logout();
    }

    useEffect(() => {
        
        if(teste2.perfil.length > 1){
            navigate('/double')
        }
    
    
    }, [])

    if(!authenticated){
        navigate('/')
    }
    
    return (
        <>
            <Sidebar />
            <main class="content">
            <Veiculos />
            </main>
        </>
    )
}

export default HomePage;