import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import Sidebar from '../../components/Sidebar';
import Componentes from './Componentes';
import { useState } from 'react';
import Error from '../../components/Error';

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

    useEffect(() => {
        if(teste2.perfil.length > 1){
            navigate('/double')
        }

        setTimeout(() => {
            setCont(cont + 1)
        }, 500);
        setData(localStorage.getItem("componente"));
    }, [cont])


    return (
        <>
            <Sidebar />
            <main className="content">
                {data === '' ? null : <Componentes Componente={data} />}
            </main>
        </>
    )
}

export default HomePage;