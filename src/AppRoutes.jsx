import { useContext } from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import { AuthProvider, AuthContext } from "./pages/contexts/auth";
import HomePage from "./pages/HomePage/HomePage";
import Error from "./components/Error";

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
                <Route exact path="/" element={<HomePage />}/>
                <Route exact path="/*" element={<Error />} />
            </Routes>
            </AuthProvider>
        </Router>
    )
}

export default AppRoutes;