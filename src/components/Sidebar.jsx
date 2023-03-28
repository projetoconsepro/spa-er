import { 
    FaCarAlt,
    FaParking,
    FaMapMarkerAlt
 } from "react-icons/fa";
import { BsConeStriped, BsCashCoin } from "react-icons/bs";
import { RiAlertFill, RiSettings5Fill } from "react-icons/ri";
import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { useEffect } from "react";

const Sidebar = () => {

        const nome = localStorage.getItem("user");
        const teste = JSON.parse(nome);
        const [mostrarSidebar, setMostrarSidebar] = useState(true);
        const [ariaExpanded, setAriaExpanded] = useState(false);
        const componentefunc = (componente) =>{
            setAriaExpanded(false)
            localStorage.setItem("componente", componente)
            setMostrarSidebar(false)
            setTimeout(() => {
                setMostrarSidebar(true)
            }, 1);
        }

        const handleLogout = () => {
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil")
        }

        const displayOff = () => {
            const navbar = document.getElementById('nav');
              if (ariaExpanded) {
                navbar.classList.remove('fixed-top');
              } else {
                navbar.classList.add('fixed-top');
              }
    }


    useEffect(() => {
        displayOff()
    }, [ariaExpanded])


        
        const styles = {
        className: "nav-link d-flex align-items-center fs-6",
        }

    const links = [{}]

    if(teste.perfil[0] === "parceiro"){
        links.push({
            className: styles.className,
            icon: <FaParking />,
            name: "‎ Registrar estacionamento",
            componente: "RegistrarEstacionamentoParceiro",
        })
        links.push({
            className: styles.className,
            icon: <BsCashCoin />,
            name: "‎ Adicionar créditos",
            componente: "AdicionarCreditos",
        })
        links.push({
            className: styles.className,
            icon: "",
            name: "",
            componente: "VagasLivres",
        })
        links.push({
            className: styles.className,
            icon: "",
            name: "",
            componente: "VagasLivres",
        })
    }
    
    if(teste.perfil[0] === "cliente"){
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
            componente: "VagasLivres",
        })
        links.push({
            className: styles.className,
            icon: <FaMapMarkerAlt />,
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
        links.push({
            className: styles.className,
            icon: <AiOutlineFileSearch />,
            name: "‎ Histórico",
            componente: "HistoricoVeiculo",
        })
        }
    else if (teste.perfil[0] === "admin"){
        links.push({
            className: styles.className,
            name: "Admin",
            to: "/admin",
        })
    }
    else if (teste.perfil[0] === "monitor"){
        links.push({
            className: styles.className,
            icon: <FaParking />,
            name: "‎ Registrar estacionamento",
            componente: "RegistrarEstacionamentoParceiro",
        })
        links.push({
            className: styles.className,
            icon: <BsCashCoin />,
            name: "‎ Adicionar créditos",
            componente: "AdicionarCreditos",
        })
        links.push({
            className: styles.className,
            name: "‎ Consultar vaga",
            componente: "ConsultarVaga",
            icon: <FaParking />,
        })
        links.push({
            className: styles.className,
            name: "‎ Notificacão",
            componente: "Notificacao",
            icon: <RiAlertFill />,
        })
        links.push({
            className: styles.className,
            name: "‎ Vaga livre",
            icon: <FaMapMarkerAlt />,
        })
        links.push({
            className: styles.className,
            name: "‎ Listar Vagas",
            icon: <FaCarAlt />,
            componente: "ListarVagasMonitor"
        })
        links.push({
            className: styles.className,
            name: "‎ Listar Notificações",
            icon: <BsConeStriped />,
            componente: "ListarNotificacoes"
        })
        links.push({
            className: styles.className,
            name: "‎ Buscar veículo",
            icon: <BiSearchAlt />,
            componente: "BuscarVeiculo"
        })
    }

    return(
    <div className="header-container mb-4">
         <nav className="navbar navbar-dark fixed-top navbar-theme-primary px-4 col-12 d-lg-none bg-blue-50" id="nav">
                <div className="d-flex align-items-center w-100 justify-content-between">
                <img src="../../assets/img/logoconseproof3.png" alt="Rich Logo" className="w-25" />
                    <button className="navbar-toggler d-lg-none collapsed" onClick={()=>{setAriaExpanded(true)}} type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded={ariaExpanded} aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>
            {mostrarSidebar ? <nav id="sidebarMenu" className="sidebar d-lg-block bg-blue-50 text-white collapse" data-simplebar> 
                <div className="sidebar-inner px-3 pt-3">
                    <div className="row">
                        <div className="col-10">
                        <div className="nav-item align-items-end"><a className="nav-link d-flex align-items-center pb-3"><span className="sidebar-icon"><img src="../../assets/img/logo.png" height="20" width="20" alt="Rich Logo" /> </span><span className="mt-1 ms-1 sidebar-text">CONSEPRO</span></a></div>
                </div>
                <div className="col-2">
                <div className="d-flex d-md-none align-items-center justify-content-between justify-content-md-center mt-1 pb-4" onClick={()=>{setAriaExpanded(false)}}>
                    <div className="collapse-close d-md-none">
                        <a href="#sidebarMenu" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="true" aria-label="Toggle navigation">
                            <svg className="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                            </svg>
                        </a>
                    </div>
                    <hr />
                </div>
                </div>
                </div>
                <ul className="nav flex-column pt-md-0">
                <a className="nav-link dropdown-toggle pt-1 px-2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <div className="media d-flex align-items-center border-bottom border-top  border-white pb-4 pt-4">
                                <img className="avatar rounded-circle" alt="Image placeholder" src="assets/img/img_avatar.png" id="imagemPerfil"/>
                                <div className="media-body ms-2 text-white align-items-center"><span className="mb-0 fw-bold fs-6 mx-2">{teste.nome}</span></div>
                            </div>
                            </a>
                            <div className="dropdown-menu dashboard-dropdown dropdown-menu-start py-1">
                            <a className="dropdown-item d-flex align-items-center text-dark">
                                <svg className="dropdown-icon text-gray-400 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"></path>
                                </svg>
                                Meu perfil
                            </a>
                            <a className="dropdown-item d-flex align-items-center text-dark">
                                <svg className="dropdown-icon text-gray-400 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                Suporte
                            </a>
                            <div role="separator" className="dropdown-divider my-1"></div>
                            <a className="dropdown-item d-flex align-items-center text-danger" onClick={() => {handleLogout()}}>
                                <svg className="dropdown-icon text-danger me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                                Desconectar-se
                            </a>
                            </div>
                    <li className="nav-item">
                    {links.map((link, key) => (<a key={key} className={link.className} id="textoSm" onClick={() => componentefunc(link.componente)}>{link.icon}{link.name}</a>))}
                    </li>
                </ul>
            </div>
            </nav> : null}
        <div>
            {ariaExpanded ?  null : ( <div className="col-12 mb-4" id="divEspaco"> </div> )} 
        </div>
    </div>
    
    )
}

export default Sidebar;