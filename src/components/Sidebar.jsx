import { FaCarAlt, FaParking, FaMapMarkerAlt, FaUserPlus, FaCar, FaHistory, FaUser, FaWhatsapp, FaPrint, FaConnectdevelop, FaCalendar, FaCalendarAlt } from "react-icons/fa";
import { BsConeStriped, BsCashCoin, BsCashStack } from "react-icons/bs";
import { MdAddLocationAlt, MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { RiAlertFill, RiSettings5Fill, RiFileAddFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { BiLogOut, BiSearchAlt, BiTransfer } from "react-icons/bi";
import { AiFillEdit, AiFillPrinter, AiOutlineBarChart, AiOutlineFileSearch } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import  FuncTrocaComp  from "../util/FuncTrocaComp";
import { FcMoneyTransfer } from "react-icons/fc";
import { FcIdea } from "react-icons/fc";
import { IconHelpCircleFilled, IconHttpConnect, IconPlugConnected } from "@tabler/icons-react";
import { CarCrashOutlined } from "@mui/icons-material";

const Sidebar = () => {
    const nome = localStorage.getItem("user");
    const teste = JSON.parse(nome);
    const [mostrarSidebar, setMostrarSidebar] = useState(true);
    const [ariaExpanded, setAriaExpanded] = useState(false);

    const toggleSidebar = (componente) => {
            setAriaExpanded(false)
            FuncTrocaComp(componente)
            setMostrarSidebar(false)
            setTimeout(() => {
                setMostrarSidebar(true)
            }, 1);
    }

    const componentefunc = (componente, index) =>{
            if (links[index].subitem !== undefined) {
            } else {
            setAriaExpanded(false)
            if (componente !== "linkWhatsapp" && componente !== "ConfigurarImpressora" && componente !== "ConectarImpressora") {
            FuncTrocaComp(componente)
            setMostrarSidebar(false)
            setTimeout(() => {
                setMostrarSidebar(true)
            }, 1);
            }
            else if (componente === "ConfigurarImpressora"){
            setMostrarSidebar(false)
            setTimeout(() => {
                setMostrarSidebar(true)
            }, 1);
                if(window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage('mostrar');
                }
            } else if (componente === "ConectarImpressora"){
                setMostrarSidebar(false)
                setTimeout(() => {
                    setMostrarSidebar(true)
                }, 1);
                if(window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage('conectar');
                }
            }
            else {
                window.open('https://app.hiperchat.com.br/', '_blank');
            }
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
    const links = [{
            className: styles.className,
            icon: <FaUser />,
            name: "‎ Meu perfil",
            subitem: [
                {
                    className: styles.className,
                    icon: <RiSettings5Fill />,
                    name: "‎ Configurar",
                    componente: "ConfigurarPerfil",
                },
                {   
                    deslogar: true,
                    className: styles.className,
                    icon: <BiLogOut />,
                    name: "‎ Desconectar",
                },
            ]
    }]
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
            name: "‎ Regularizar",
            componente: "Regularizacao",
        })
    } 
    if(teste.perfil[0] === "cliente"){
        links.push({
            className: styles.className,
            icon: <FaCarAlt />,
            name: "‎ Meus Veiculos",
            componente: "MeusVeiculos",
        })
        links.push({
            className: styles.className,
            icon:  <CarCrashOutlined />,
            name: "‎ Débito automático",
            componente: "Configuracoes",
        })
        links.push({
            className: styles.className,
            icon: <FaParking />,
            name: "‎ Registrar Estacionamento",
            componente: "RegistrarEstacionamento",
        })
        links.push({
            className: styles.className,
            icon: <BsCashCoin />,
            name: "‎ Financeiro",
            subitem: [
                {
                    className: styles.className,
                    icon: <BsCashCoin />,
                    name: "‎ Adicionar Créditos",
                    componente: "InserirCreditos",
                },
                {
                    className: styles.className,
                    icon: <BiTransfer />,
                    name: "‎ Transferir Créditos",
                    componente: "TransferirCreditoCliente",
                }
            ]
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
            icon: <FaCar />,
            name: "‎ Cadastrar Novo Veículo",
            componente: "CadastrarVeiculo",
        })
        links.push({
            className: styles.className,
            icon: <BsConeStriped />,
            name: "‎ Irregularidades",
            componente: "Irregularidades",
        })
        links.push({
            className: styles.className,
            icon: <IconHelpCircleFilled />,
            name: "‎ Ajuda",
            componente: "Suporte",
        })
    }
    else if (teste.perfil[0] === "admin") {
        links.push({
            className: styles.className,
            icon: <AiOutlineBarChart />,
            name: "‎ Dashboard",
            componente: "Dashboard",
        })
        links.push({
            className: styles.className,
            icon: <FaParking />,
            name: "‎ Registrar Estacionamento",
            componente: "RegistrarEstacionamentoParceiro",
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
                    icon: <FaCar />,
                    name: "‎ Adicionar veículo",
                    componente: "AdicionarModelo",
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
                    name: "‎ Caixa Monitor",
                    componente: "HistoricoCaixa",
                },
                {
                    className: styles.className,
                    icon: <BsConeStriped />,
                    name: "‎ Irregularidades",
                    componente: "ListarNotificacoesAdmin",
                },
                {
                    className: styles.className,
                    icon: <FaParking />,
                    name: "‎ Estacionamento",
                    componente: "OcupacaoVagasAdmin",
                },
                {
                    className: styles.className,
                    icon: <FcIdea />,
                    name: "‎ Sugestões",
                    componente: "SugestoesAdmin",
                }
            ]
        })
        links.push({
            className: styles.className,
            icon: <FcMoneyTransfer />,
            name: "‎ Depósito Parceiro",
            componente: "TransferenciaParceiro",
        })
        links.push({
            className: styles.className,
            icon: <FaUser />,
            name: "‎ Clientes",
            componente: "ClientesAdmin",
        })
        links.push({
            className: styles.className,
            icon: <AiFillPrinter />,
            name: "‎ Prestação de Contas",
            componente: "PrestacaoContas",
        })
        links.push({
            className: styles.className,
            icon: <FaCalendarAlt />,
            name: "‎ Feriados",
            componente: "Feriados",
        })
        links.push({
            className: styles.className,
            icon: <AiFillEdit />,
            name: "‎ Editar Parâmetro",
            componente: "EditarParametroAdmin",
        })
        links.push({
            className: styles.className,
            icon: <FaWhatsapp />,
            name: "‎ Whatsapp",
            componente: "linkWhatsapp",
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
        links.push({
            className: styles.className,
            icon: <FaPrint />,
            name: "‎ Configurar impressora",
            componente: "ConfigurarImpressora",
        })
        links.push({
            className: styles.className,
            icon: <IconPlugConnected />,
            name: "‎ Conectar",
            componente: "ConectarImpressora",
        })
    }
    else if (teste.perfil[0] === "agente"){
        links.push({
            className: styles.className,
            icon: <BsConeStriped />,
            name: "‎ Listar Notificações",
            componente: "ListarNotificacoesAgente",
        })
        links.push({
            className: styles.className,
            icon: <FaParking />,
            name: "‎ Veículos Estacionados",
            componente: "VeiculosAgente",
        })
    }

    const chamarMenu = () => {
    if (teste.perfil[0] === "cliente") {
        FuncTrocaComp("MeusVeiculos")
    }
    else if (teste.perfil[0] === "parceiro") {
        FuncTrocaComp("RegistrarEstacionamentoParceiro")
    }
    else if (teste.perfil[0] === "admin") {
        FuncTrocaComp("Dashboard")
    }
    else if (teste.perfil[0] === "monitor") {
        FuncTrocaComp("ListarVagasMonitor")
    }
    else if (teste.perfil[0] === "agente") {
        FuncTrocaComp("ListarNotificacoesAgente")
    }
}

    return(
    <div className="header-container mb-4">
         <nav className="navbar navbar-dark fixed-top navbar-theme-primary px-4 col-12 d-lg-none bg-blue-50" id="nav">
                <div className="d-flex align-items-center w-100 justify-content-between">
                <img src="../../assets/img/logoconseproof3.png" alt="Rich Logo" className="w-25" onClick={() => chamarMenu()}/>
                    <button className="navbar-toggler d-lg-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded={ariaExpanded} aria-label="Toggle navigation" onClick={()=>{setAriaExpanded(true)}}>
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
                <div className="d-flex d-md-none align-items-center justify-content-between justify-content-md-center mt-1 pb-4">
                    <div className="collapse-close d-md-none">
                        <a onClick={()=>{setAriaExpanded(false)}} href="#sidebarMenu" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="true" aria-label="Toggle navigation">
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
                <a className="nav-link  pt-1 px-2">
                            <div className="media d-flex align-items-center border-bottom border-top  border-white pb-4 pt-4">
                                <img className="avatar rounded-circle mb" alt="Image placeholder" src={
                                    teste.perfil[0] === "cliente" ? "assets/img/jumping.png" :
                                    teste.perfil[0] === "parceiro" ? "assets/img/business.png" :
                                    teste.perfil[0] === "admin" ? "assets/img/operator.png" :
                                    teste.perfil[0] === "monitor" ? "assets/img/worker.png" :
                                    teste.perfil[0] === "agente" ? "assets/img/business.png" : "assets/img/jumping.png"
                                } id="imagemPerfil"/>
                                <div className="media-body ms-3 text-white">
                                    <div className="row">
                                    <div className="col-12 text-start">
                                    <span className="mb-0 fw-bold fs-6 text-start">{
                                    window.innerWidth > 990 ?
                                    teste.nome.length > 17 ? `${teste.nome.substring(0, 17)}...` : teste.nome
                                    :
                                    window.innerWidth < 290 ?
                                    teste.nome.length > 15 ? `${teste.nome.substring(0, 15)}...` : teste.nome
                                    :
                                    teste.nome.length > 25 ? `${teste.nome.substring(0, 25)}...` : teste.nome
                                    } </span> <br />
                                    </div>
                                    </div>
                                    <div className="row">
                                    <div className="col-12">
                                    <MdOutlineSubdirectoryArrowRight size={23} className="mb-1" />      
                                    <span className="mb-0 text-sm fs-6 mx-2 ">{teste.perfil[0].perfil === undefined ? teste.perfil[0].slice(0, 1).toUpperCase() + teste.perfil[0].slice(1) : teste.perfil[0].perfil} </span>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            </a>

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
                <a className={subitem.className} id="textoSm" onClick={subitem.deslogar ? () => handleLogout() : () => toggleSidebar(subitem.componente)}>
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