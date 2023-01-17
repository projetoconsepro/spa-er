import { useState, useContext } from "react";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Loading from "./pages/LoginPage/loading";
import MonitorPage from "./pages/MonitorPage/monitor";
import DoublePerfil from "./pages/DoublePerfil/doublePerfil";

import { AuthProvider, AuthContext } from "./pages/contexts/auth";

const AppRoutes = () => {
    const Private = ({children}) => {
        const { authenticated, loading } = useContext(AuthContext);
        
        if(loading){
            return <div className="loading">Carregando...</div>
        }

        if(!authenticated){
            return <Navigate to="/login" />
        }

        return children;
    }

    return(
        <Router>
            <AuthProvider>
            <Routes>
                <Route exact path="/login" element={<LoginPage />} />
                <Route exact path="/home" element={<HomePage />}/>
                <Route exact path="/loading" element={<Loading />}/>
                <Route exact path="/monitor" element={<MonitorPage />}/>
                <Route exact path="/double" element={<DoublePerfil />}/>
            </Routes>
            </AuthProvider>
        </Router>
    )
}

export default AppRoutes;