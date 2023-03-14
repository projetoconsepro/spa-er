import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from '../RegisterPage';
import LoginPage from '../LoginPage';
import HomePage from '../HomePage';
import Error from '../../components/Error';
import NewPassword from '../ResetPassword/newPassword';
import Confirmation from '../ResetPassword/confirmation';
import ResetPassword from '../ResetPassword';

export default function ComponentesBack({Componente}) {
        if(Componente === "RegisterPage"){
            return <RegisterPage />
        }
        else if (Componente === "LoginPage"){
            return <LoginPage />
        }
        else if(Componente === "HomePage"){
            return <HomePage />
        }
        else if ( Componente === "RegisterPage"){
            return <RegisterPage />
        }
        else if ( Componente === "ResetPassword"){
            return <ResetPassword />
        }
        else if ( Componente === "Confirmation"){
            return <Confirmation />
        }
        else if ( Componente === "NewPassword"){
            return <NewPassword />
        }
        else {
            return <Error />
        }
    }