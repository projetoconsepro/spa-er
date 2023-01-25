import { Link } from "react-router-dom";
import { 
    FaCarAlt,
    FaParking,
 } from "react-icons/fa";
import { BsConeStriped,
        BsCashCoin } from "react-icons/bs";
import { RiSettings5Fill } from "react-icons/ri";
import { useState, useContext } from "react";
import { AuthContext } from "../pages/contexts/auth";

const Sidebar = () => {
        const { authenticated, logout } = useContext(AuthContext);
        const nome = localStorage.getItem("user");
        const teste = JSON.parse(nome);
        console.log(teste.perfil)
        const [componente, setComponente] = useState("")
        console.log(componente)
        const componentefunc = (componente) =>{
            localStorage.setItem("componente", componente)
            window.location.reload();
        }

        const handleLogout = () => {
            logout();
        }
        
        const styles = {
        className: "nav-link d-flex align-items-center",
        }

    const links = [
        {
            
        }
    ]
    
    if(teste.perfil[0] === "Estacionamento"){
        links.push({
            className: styles.className,
            icon: <FaCarAlt />,
            name: "‎ Meus veiculos",
            componente: "MeusVeiculos",
        })
        links.push({
            className: styles.className,
            icon: <FaParking />,
            name: "‎ Registrar estacionamento",
            componente: "RegistrarEstacionamento",
        })
        links.push({
            className: styles.className,
            icon: <BsCashCoin />,
            name: "‎ Adicionar créditos",
            componente: "AdicionarCreditos",
        })
        links.push({
            className: styles.className,
            icon: <FaParking />,
            name: "‎ Vagas livres",
            componente: "VagasLivres",
        })
        links.push({
            className: styles.className,
            icon: <BsConeStriped />,
            name: "‎ Irregularidades",
            componente: "Irregularidades",
        })
        links.push({
            className: styles.className,
            icon: <RiSettings5Fill />,
            name: "‎ Configurar",
            componente: "Configurar",
        })
        links.push({
            className: styles.className,
            icon: <FaCarAlt />,
            name: "‎ Cadastrar novo veículo",
            componente: "CadastrarVeiculo",
        })

    }
    else if (teste.perfil[0] === "Admin"){
        links.push({
            className: styles.className,
            name: "Admin",
            to: "/admin",
        })
    }
    else if (teste.perfil[0] === "Monitor"){
        links.push({
            className: styles.className,
            name: "Monitor",
            to: "/monitor",
        })
        links.push({
            className: styles.className,
            name: "Registrar estacionamento",
            to: "/registrar",
        })
        links.push({
            className: styles.className,
            name: "Consultar vaga",
            to: "/consultarvaga",
        })
        links.push({
            className: styles.className,
            name: "Vaga livre",
            to: "/vagalivre",
        })
    }

    
    return(
    <div className="header-container">
         <nav class="navbar navbar-dark navbar-theme-primary px-4 col-12 d-lg-none">
            <Link class="navbar-brand me-lg-5" to={{ pathname: "/"}}><img class="navbar-brand-dark" src="assets/img/logo.svg" alt="Rich logo" /> <img class="navbar-brand-light" src="assets/img/dark.svg" alt="Rich logo" /></Link>
                <div class="d-flex align-items-center"><button class="navbar-toggler d-lg-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button></div>
            </nav>
            <nav id="sidebarMenu" class="sidebar d-lg-block bg-gray-800 text-white collapse" data-simplebar>
                <div class="sidebar-inner px-3 pt-4">
                <div class="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
                    <div class="collapse-close d-md-none">
                        <a href="#sidebarMenu" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="true" aria-label="Toggle navigation">
                            <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                    </div>
                </div>
                <ul class="nav flex-column pt-md-0 ">
                    <li class="nav-item"><a href="#" class="nav-link d-flex align-items-center pb-3"><span class="sidebar-icon"><img src="assets/img/logo.png" height="20" width="20" alt="Rich Logo" /> </span><span class="mt-1 ms-1 sidebar-text">CONSEPRO</span></a></li>
                    <li class="nav-item">
                    {links.map(link => (<li className={link.className} onClick={() => componentefunc(link.componente)}>{link.icon}{link.name}</li>))}
                    </li>
                </ul>
            </div>
            </nav>
            <nav class="navbar navbar-top navbar-expand navbar-dashboard navbar-dark ps-0 pe-2 pb-0">
                <div class="container-fluid px-0">
                <div class="d-flex justify-content-between w-100" id="navbarSupportedContent">
                    <div class="d-flex align-items-center">
                    </div>
                    <ul class="navbar-nav align-items-center">
                        <li class="nav-item dropdown ms-lg-3">
                            <a class="nav-link dropdown-toggle pt-1 px-0" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <div class="media d-flex align-items-center">
                                <img class="avatar rounded-circle" alt="Image placeholder" src="assets/img/profile-picture-4.jpg" />
                                <div class="media-body ms-2 text-dark align-items-center d-none d-lg-block"><span class="mb-0 font-small fw-bold text-gray-900">{teste.nome}</span></div>
                            </div>
                            </a>
                            <div class="dropdown-menu dashboard-dropdown dropdown-menu-end mt-2 py-1">
                            <a class="dropdown-item d-flex align-items-center" href="#">
                                <svg class="dropdown-icon text-gray-400 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path>
                                </svg>
                                My Profile 
                            </a>
                            <a class="dropdown-item d-flex align-items-center" href="#">
                                <svg class="dropdown-icon text-gray-400 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
                                </svg>
                                Settings 
                            </a>
                            <a class="dropdown-item d-flex align-items-center" href="#">
                                <svg class="dropdown-icon text-gray-400 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clip-rule="evenodd"></path>
                                </svg>
                                Messages 
                            </a>
                            <a class="dropdown-item d-flex align-items-center" href="#">
                                <svg class="dropdown-icon text-gray-400 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd"></path>
                                </svg>
                                Support
                            </a>
                            <div role="separator" class="dropdown-divider my-1"></div>
                            <a class="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                                <svg class="dropdown-icon text-danger me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                                Logout
                            </a>
                            </div>
                        </li>
                    </ul>
                </div>
                </div>
            </nav>
    </div>
    
    )
}

export default Sidebar;