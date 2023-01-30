import { useState, useContext } from "react";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";

import { redirect } from 'react-router-dom';

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Loading from "./pages/LoginPage/loading";
import DoublePerfil from "./pages/DoublePerfil/doublePerfil";

import { AuthProvider, AuthContext } from "./pages/contexts/auth";
import RegisterPage from "./pages/RegisterPage";

const AppRoutes = () => {
    const Private = ({children}) => {
        const { authenticated, loading } = useContext(AuthContext);
        
        if(loading){
            return <div className="loading">Carregando...</div>
        }

        if(!authenticated){
            return <Navigate to="/" />
        }

        return children;
    }

    return(
        <Router>
            <AuthProvider>
            <Routes>
                <Route exact path="/" element={<LoginPage />} />
                <Route exact path="/home" element={<HomePage />}/>
                <Route exact path="/loading" element={<Loading />}/>
                <Route exact path="/double" element={<DoublePerfil />}/>
                <Route exact path="/register" element={<RegisterPage />}/>
            </Routes>
            </AuthProvider>
        </Router>
    )
}

export default AppRoutes;