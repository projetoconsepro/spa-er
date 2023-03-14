import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';
import ComponentesBack from './ComponentesBack';

const BackPage =  () => {
    const [data , setData] = useState('');
    const [cont, setCont] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setCont(cont + 1)
        }, 500);
        setData(localStorage.getItem("componente"));
        
        if(localStorage.getItem("componente") === null){
            setData("LoginPage")
        }
    }, [cont])

    return (
        <>
            {data === '' ? null : <ComponentesBack Componente={data} />}
        </>
    )
}

export default BackPage;