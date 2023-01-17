import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'

const MonitorPage = () => {
    const { authenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

        if(!authenticated){
            navigate('/login')
        }

    const handleLogout = () => {
        logout();
    }

    return (
        <>  
            <h1> HELLO MONITOR. </h1>
            <p>{String(authenticated)}</p>
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default MonitorPage;