import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { AuthProvider } from "./pages/contexts/auth";
import HomePage from "./pages/HomePage/HomePage";
import Error from "./components/Error";

const AppRoutes = () => {
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