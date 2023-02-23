import { useContext } from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import { AuthProvider, AuthContext } from "./pages/contexts/auth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Loading from "./pages/LoginPage/loading";
import DoublePerfil from "./pages/DoublePerfil/doublePerfil";
import RegisterPage from "./pages/RegisterPage";
import ResetPassword from "./pages/ResetPassword/index.jsx";
import Confirmation from "./pages/ResetPassword/confirmation";
import NewPassword from "./pages/ResetPassword/newPassword";
import RegistrarVagaMonitor from "./components/RegistrarVagaMonitor";
import Error from "./components/Error";
import Camera from "./components/Camera";

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
                <Route exact path="/recuperar" element={<ResetPassword />} />
                <Route exact path="/confirmacao" element={<Confirmation />} />
                <Route exact path="/novasenha" element={<NewPassword />} />
                <Route exact path="/registrarmonitor" element={<RegistrarVagaMonitor />} />
                <Route exact path="/*" element={<Error />} />
                <Route exact path="/camera" element={<Camera />} />
            </Routes>
            </AuthProvider>
        </Router>
    )
}

export default AppRoutes;