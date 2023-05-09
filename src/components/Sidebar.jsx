import { 
    FaCarAlt,
    FaParking,
    FaMapMarkerAlt,
    FaUserPlus,
    FaCar,
    FaHistory,
    FaUser
 } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { SiOpenstreetmap } from "react-icons/si";
import { RiFileAddFill } from "react-icons/ri";
import { BsConeStriped, BsCashCoin, BsPersonCircle } from "react-icons/bs";
import { MdAddLocationAlt, MdOutlineContactSupport } from "react-icons/md";
import { RiAlertFill, RiSettings5Fill } from "react-icons/ri";
import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import { useEffect } from "react";

const Sidebar = () => {

        const nome = localStorage.getItem("user");
        const teste = JSON.parse(nome);
        const [mostrarSidebar, setMostrarSidebar] = useState(true);
        const [ariaExpanded, setAriaExpanded] = useState(false);

        const toggleSidebar = (componente) => {
            setAriaExpanded(false)
            localStorage.setItem("componente", componente)
            setMostrarSidebar(false)
            setTimeout(() => {
                setMostrarSidebar(true)
            }, 1);
        }
        const componentefunc = (componente, index) =>{
            if (links[index].subitem !== undefined) {
                
            } else {
            setAriaExpanded(false)
            localStorage.setItem("componente", componente)
            setMostrarSidebar(false)
            setTimeout(() => {
                setMostrarSidebar(true)
            }, 1);
            }
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

    const links = []

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
            icon: <AiOutlineFileSearch />,
            name: "‎ Histórico financeiro",
            componente: "HistoricoFinanceiroParceiro",
        })
        links.push({
            className: styles.className,
            icon: <FaMapMarkerAlt />,
            name: "‎ Vagas livres",
            componente: "VagasLivres",
        })
        links.push({
            className: styles.className,
            icon: <FaMapMarkerAlt />,
            name: "‎ Regularizar",
            componente: "Regularizacao",
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
            icon: <TbReportSearch />,
            className: styles.className,
            name: "‎ Históricos",
            subitem: [
                {
                    className: styles.className,
                    icon: <FaCarAlt />,
                    name: "‎ Estacionamentos",
                    componente: "HistoricoVeiculo",
                },
                {
                    className: styles.className,
                    icon: <BsCashCoin />,
                    name: "‎ Financeiro",
                    componente: "HistoricoFinanceiro",
                },
            ]
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
            componente: "Configuracoes",
        })
        links.push({
            className: styles.className,
            icon: <FaCarAlt />,
            name: "‎ Cadastrar novo veículo",
            componente: "CadastrarVeiculo",
        })
        }
    else if (teste.perfil[0] === "admin"){
        links.push({
            className: styles.className,
            icon: <FaCarAlt />,
            name: "‎ Dashboard",
            componente: "Dashboard",
        })
        links.push({
            className: styles.className,
            icon: <FaCarAlt />,
            name: "‎ Buscar Veículo",
            componente: "BuscarVeiculo",
        })
        links.push({
            icon: <RiFileAddFill />,
            className: styles.className,
            name: "‎ Cadastros",
            subitem: [
                {
                    className: styles.className,
                    icon: <FaUserPlus />,
                    name: "‎ Usuários",
                    componente: "UsuariosAdmin",
                },
                {
                    className: styles.className,
                    icon: <FaUser />,
                    name: "‎ Clientes",
                    componente: "ClientesAdmin",
                },
                {
                    className: styles.className,
                    icon: <MdAddLocationAlt />,
                    name: "‎ Setores",
                    componente: "SetoresAdmin",
                },
                
                {
                    icon: <FaParking />,
                    className: styles.className,
                    name: "‎ Vagas ", 
                    componente: "VagasAdmin",
                },
                {
                    className: styles.className,
                    icon: <FaCar />,
                    name: "‎ Listar veículos",
                    componente: "VeiculosAdmin",
                }
            ]
        })
        links.push({
            icon: <FaHistory />,
            className: styles.className,
            name: "‎ Históricos",
            subitem: [
                {
                    className: styles.className,
                    icon: <FaHistory />,
                    name: "‎ Caixa monitor",
                    componente: "HistoricoCaixa",
                },
                {
                    className: styles.className,
                    icon: <BsConeStriped />,
                    name: "‎ Irregularidades",
                    componente: "ListarNotificacoesAdmin",
                }
            ]
        })
        links.push({
            className: styles.className,
            icon: <BsCashCoin />,
            name: "‎ Adicionar créditos",
            componente: "AdicionarCreditos",
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
        links.push({
            className: styles.className,
            icon: <BsCashCoin />,
            name: "‎ Abrir/fechar turno",
            componente: "AbrirTurno",
        })
    }
    else if (teste.perfil[0] === "agente"){
        links.push({
            className: styles.className,
            icon: <FaParking />,
            name: "‎ Listar Notificações",
            componente: "ListarNotificacoesAgente",
        })
        links.push({
            className: styles.className,
            icon: <FaParking />,
            name: "‎ Componente",
            componente: "Componente",
        })
        links.push({
            className: styles.className,
            icon: <FaParking />,
            name: "‎ Componente",
            componente: "Componente",
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
                            <BsPersonCircle />
                            ‎ Meu perfil
                            </a>
                            <a className="dropdown-item d-flex align-items-center text-dark">
                            <MdOutlineContactSupport />
                            ‎ Suporte
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
{teste.perfil[0] !== undefined ? 
  <div>
    {links.map((link, key) => (
      <div key={key}>
        <span id="textoSm" onClick={() => componentefunc(link.componente, key)} className="nav-link collapsed d-flex justify-content-between align-items-center" data-bs-toggle="collapse" data-bs-target={`#submenu-app-${key}`}>
          <span>
            <span>{link.icon}{link.name}</span>
          </span>
          {link.subitem && 
          <span className="link-arrow" >
            <svg className="icon icon-sm" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
            }
        </span>
        <div className="multi-level collapse" role="list" id={`submenu-app-${key}`} aria-expanded="false">
          <ul className="flex-column nav" >
          {link.subitem &&
          link.subitem.map((subitem, key) => (
            <li className="nav-item" key={key}>
                <a className={subitem.className} id="textoSm" onClick={() => toggleSidebar(subitem.componente)}>
                    {subitem.icon}
                    {subitem.name}
                </a>
            </li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
  : null
}
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