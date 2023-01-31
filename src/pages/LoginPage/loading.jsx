import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import "./styles.css"

const Loading = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const analisarDados = localStorage.getItem(['user']);
        const analiseString = JSON.parse(analisarDados);
        if(analiseString.perfil.length === 1){
            navigate("/home")
        }
        else if(analiseString.perfil.length > 2 && localStorage.getItem('passou')){
            console.log("teste")
        }

    }, []);
    
    return (
            <div>
            </div>
    )
}

export default Loading;