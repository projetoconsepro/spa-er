import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import Dashboard from '../../components/Dashboard';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import AdminMenu from '../../components/AdminMenu';

const HomePage = () => {
    const { authenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const teste = localStorage.getItem("user");
    const teste2 = JSON.parse(teste);
    console.log(teste2)


    useEffect(() => {
    if(teste2.perfil.length > 1){
        navigate('/double')
    }
    }, [])
    
        if(!authenticated){
            navigate('/login')
        }

    const handleLogout = () => {
        logout();
    }

    return (
        <>  
            <Sidebar />
            <main class="content">
            <Dashboard />
            </main>
            <p>{String(authenticated)}</p>
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default HomePage;