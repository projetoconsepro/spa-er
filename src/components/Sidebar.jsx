/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  FaCarAlt,
  FaParking,
  FaMapMarkerAlt,
  FaUserPlus,
  FaCar,
  FaHistory,
  FaUser,
  FaWhatsapp,
  FaPrint,
  FaCalendarAlt,
  FaClipboardList,
  FaSearch,
} from "react-icons/fa";
import { BsConeStriped, BsCashCoin } from "react-icons/bs";
import {
  MdAddLocationAlt,
  MdCarCrash,
  MdHelp,
  MdOutlineSubdirectoryArrowRight,
} from "react-icons/md";
import { RiSettings5Fill, RiFileAddFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { BiLogOut, BiSearchAlt, BiTransfer } from "react-icons/bi";
import {
  AiFillEdit,
  AiFillPrinter,
  AiOutlineBarChart,
  AiOutlineFileSearch,
} from "react-icons/ai";
import { TbClipboardList, TbReportSearch } from "react-icons/tb";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { FcMoneyTransfer } from "react-icons/fc";
import { FcIdea } from "react-icons/fc";
import { IconPlugConnected } from "@tabler/icons-react";
import ConfigImpressora from "../util/ConfigImpressora";

const Sidebar = () => {
  const nome = localStorage.getItem("user");
  const teste = JSON.parse(nome);
  const [mostrarSidebar, setMostrarSidebar] = useState(true);
  const [ariaExpanded, setAriaExpanded] = useState(false);

  const toggleSidebar = (componente) => {
    setAriaExpanded(false);
    FuncTrocaComp(componente);
    setMostrarSidebar(false);
    setTimeout(() => {
      setMostrarSidebar(true);
    }, 1);
  };

  const componentefunc = (componente, index, type) => {
    if (commonLinks[index].subitem !== undefined && type !== "subItem") {
    } else {
      setAriaExpanded(false);
      if (
        componente !== "linkWhatsapp" &&
        componente !== "ConfigurarImpressora" &&
        componente !== "ConectarImpressora"
      ) {
        FuncTrocaComp(componente);
        setMostrarSidebar(false);
        setTimeout(() => {
          setMostrarSidebar(true);
        }, 1);
      } else if (componente === "ConfigurarImpressora") {
        setMostrarSidebar(false);
        setTimeout(() => {
          setMostrarSidebar(true);
        }, 1);
        ConfigImpressora("mostrar");
      } else if (componente === "ConectarImpressora") {
        setMostrarSidebar(false);
        setTimeout(() => {
          setMostrarSidebar(true);
        }, 1);
        ConfigImpressora("conectar");
      } else {
        window.open("https://app.hiperchat.com.br/", "_blank");
      }
    }
  };

  const handleLogout = () => {
    if (window.ReactNativeWebView) { 
       window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'logout' }));
  }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("perfil");
  };

  const displayOff = () => {
    const navbar = document.getElementById("nav");
    if (ariaExpanded) {
      navbar.classList.remove("fixed-top");
    } else {
      navbar.classList.add("fixed-top");
    }
  };

  useEffect(() => {
    displayOff();
  }, [ariaExpanded]);

  const commonStyles = "nav-link d-flex align-items-center fs-6";

  const commonLinks = [
      {
        className: commonStyles,
        icon: <FaUser />,
        name: "‎ Meu Perfil",
        subitem: [
          {
            className: commonStyles,
            icon: <RiSettings5Fill />,
            name: "‎ Configurar",
            componente: "ConfigurarPerfil",
          },
          {   
            deslogar: true,
            className: commonStyles,
            icon: <BiLogOut />,
            name: "‎ Desconectar",
          },
        ],
      }
    ];


  if (teste.perfil[0] === "parceiro") {
      const parceiroLinks = [
          { icon: <FaParking />, name: "‎ Registrar estacionamento", componente: "RegistrarEstacionamentoParceiro" },
          { icon: <BsCashCoin />, name: "‎ Adicionar créditos", componente: "AdicionarCreditos" },
          { icon: <AiOutlineFileSearch />, name: "‎ Histórico financeiro", componente: "HistoricoFinanceiroParceiro" },
          { icon: <FaMapMarkerAlt />, name: "‎ Regularizar", componente: "Regularizacao" }
      ];

      parceiroLinks.forEach(link => {
          commonLinks.push({ className: commonStyles, ...link });
      });
  } else if (teste.perfil[0] === "cliente") {
      const clienteLinks = [
          { icon: <FaCarAlt />, name: "‎ Veículos",
              subitem: [
                { icon: <FaCarAlt />, name: "‎ Meus Veículos", componente: "MeusVeiculos", className: commonStyles },
                { icon: <MdCarCrash />, name: "‎ Débito Automático", componente: "Configuracoes", className: commonStyles },
                { icon: <FaCarAlt />, name: "‎ Adicionar Veículo", componente: "CadastrarVeiculo", className: commonStyles },
                { icon: <TbReportSearch />, name: "‎ Histórico", componente: "HistoricoVeiculo", className: commonStyles },
            ]
          },
          { icon: <FaParking />, name: "‎ Registrar Estacionamento", componente: "RegistrarEstacionamento" },
          { icon: <BsCashCoin />, name: "‎ Financeiro",
              subitem: [
                  { icon: <BsCashCoin />, name: "‎ Adicionar Créditos", componente: "InserirCreditos", className: commonStyles },
                  { icon: <BiTransfer />, name: "‎ Transferir Créditos", componente: "TransferirCreditoCliente", className: commonStyles },
                  { icon: <TbReportSearch />, name: "‎ Histórico", componente: "HistoricoFinanceiro", className: commonStyles },
              ]
          },
          { icon: <BsConeStriped />, name: "‎ Irregularidades", componente: "Irregularidades" },
          { icon: <MdHelp />, name: "‎ Ajuda", componente: "Suporte" }
      ];

      clienteLinks.forEach(link => {
          commonLinks.push({ className: commonStyles, ...link });
      }
      );
  } else if (teste.perfil[0] === "admin") {
      const adminLinks = [
          { icon: <AiOutlineBarChart />, name: "‎ Dashboard", componente: "Dashboard" },
          { icon: <FaParking />, name: "‎ Registrar Estacionamento", componente: "RegistrarEstacionamentoParceiro" },
          { icon: <FaHistory />, name: "‎ Históricos",
          subitem: [
              { icon: <BsConeStriped />, name: "‎ Irregularidades", componente: "ListarNotificacoesAdmin", className: commonStyles },
              { icon: <FaParking />, name: "‎ Estacionamentos", componente: "OcupacaoVagasAdmin", className: commonStyles },
              { icon: <FaCar />, name: "‎ Veículos", componente: "ListagemMovimentoVeiculo", className: commonStyles },
              { icon: <FcIdea />, name: "‎ Sugestões", componente: "SugestoesAdmin", className: commonStyles },
            ]
          },
          { icon: <RiFileAddFill />, name: "‎ Cadastros",
          subitem: [
              { icon: <FaUserPlus />, name: "‎ Usuários", componente: "UsuariosAdmin", className: commonStyles },
              { icon: <FaCar />, name: "‎ Placas isentas", componente: "PlacaIsenta", className: commonStyles },
              { icon: <FaCar />, name: "‎ Modelos/Fabricante", componente: "AdicionarModelo", className: commonStyles },
              { icon: <MdAddLocationAlt />, name: "‎ Setores", componente: "SetoresAdmin", className: commonStyles },
              { icon: <FaParking />, name: "‎ Vagas ", componente: "VagasAdmin", className: commonStyles },
              { icon: <FaCalendarAlt />, name: "‎ Feriados", componente: "Feriados", className: commonStyles },
            ]
          },
          { icon: <FaSearch />, name: "‎ Consultas",
          subitem: [
            { icon: <FaCarAlt />, name: "‎ Buscar Veículo", componente: "BuscarVeiculo", className: commonStyles },
            { icon: <FaSearch />, name: "‎ Movimento PIX", componente: "BuscarMovimentoTxId", className: commonStyles },
            { icon: <FaUser />, name: "‎ Clientes", componente: "ClientesAdmin", className: commonStyles },
            ]
          },
          { icon: <BsCashCoin />, name: "‎ Financeiro",
          subitem: [
            { icon: <AiFillPrinter />, name: "‎ Prestação de Contas", componente: "PrestacaoContas", className: commonStyles },
            { icon: <TbClipboardList />, name: "‎ Relatório Monitor", componente: "RelatorioMonitorAdmin", className: commonStyles },
            { icon: <FaHistory />, name: "‎ Caixa Monitor", componente: "HistoricoCaixa", className: commonStyles },
            { icon: <FcMoneyTransfer />, name: "‎ Depósito Parceiro", componente: "TransferenciaParceiro", className: commonStyles },
            ]
          },
          { icon: <AiFillEdit />, name: "‎ Editar Parâmetro", componente: "EditarParametroAdmin" },
          { icon: <FaWhatsapp />, name: "‎ Whatsapp", componente: "linkWhatsapp" }
      ];
      adminLinks.forEach(link => {
          commonLinks.push({ className: commonStyles, ...link });
      });
  } else if (teste.perfil[0] === "monitor"){

      const monitorLinks = [
          { icon: <FaParking />, name: "‎ Registrar Estacionamento", componente: "RegistrarEstacionamentoParceiro" },
          { icon: <BsCashCoin />, name: "‎ Adicionar Créditos", componente: "AdicionarCreditos" },
          { icon: <FaCarAlt />, name: "‎ Listar Vagas", componente: "ListarVagasMonitor" },
          { icon: <BsConeStriped />, name: "‎ Listar Notificações", componente: "ListarNotificacoes" },
          { icon: <BiSearchAlt />, name: "‎ Buscar Veículo", componente: "BuscarVeiculo" },
          { icon: <BsCashCoin />, name: "‎ Abrir/fechar turno", componente: "AbrirTurno" },
          { icon: <AiFillPrinter />, name: "‎ Impressora",
            subitem: [
              { icon: <FaPrint />, name: "‎ Configurar", componente: "ConfigurarImpressora", className: commonStyles },
              { icon: <IconPlugConnected />, name: "‎ Conectar", componente: "ConectarImpressora", className: commonStyles },
            ]
          },
      ];

      monitorLinks.forEach(link => {
          commonLinks.push({ className: commonStyles, ...link });
      });
  } else if (teste.perfil[0] === "agente") {

      const agenteLinks = [
          { icon: <BsConeStriped />, name: "‎ Listar Notificações", componente: "ListarNotificacoesAgente" },
          { icon: <FaParking />, name: "‎ Veículos Estacionados", componente: "VeiculosAgente" },
          { icon: <FaClipboardList />, name: "‎ Autos de Infração", componente: "ListaAutoInfracao" }
      ];

      agenteLinks.forEach(link => {
          commonLinks.push({ className: commonStyles, ...link });
      });
  }

  const chamarMenu = () => {
    const perfilToComponent = {
      cliente: "MeusVeiculos",
      parceiro: "RegistrarEstacionamentoParceiro",
      admin: "Dashboard",
      monitor: "ListarVagasMonitor",
      agente: "ListarNotificacoesAgente",
    };

    toggleSidebar(perfilToComponent[teste.perfil[0]]);
  };

  return (
    <div className="header-container mb-4">
      <nav
        className="navbar navbar-dark fixed-top navbar-theme-primary px-4 col-12 d-lg-none bg-blue-50"
        id="nav"
      >
        <div className="d-flex align-items-center w-100 justify-content-between">
          <img
            src="../../assets/img/logoconseproof3.png"
            alt="Rich Logo"
            className="w-25"
            onClick={() => chamarMenu()}
          />
          <button
            className="navbar-toggler d-lg-none collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded={ariaExpanded}
            aria-label="Toggle navigation"
            onClick={() => {
              setAriaExpanded(true);
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>
      {mostrarSidebar ? (
        <nav
          id="sidebarMenu"
          className="sidebar d-lg-block bg-blue-50 text-white collapse"
          data-simplebar
        >
          <div className="sidebar-inner px-3 pt-3">
            <div className="row">
              <div className="col-10">
                <div className="nav-item align-items-end">
                  <a className="nav-link d-flex align-items-center pb-3" onClick={() => chamarMenu()}>
                    <span className="sidebar-icon">
                      <img
                        src="../../assets/img/logo.png"
                        height="20"
                        width="20"
                        alt="Rich Logo"
                      />{" "}
                    </span>
                    <span className="mt-1 ms-1 sidebar-text">CONSEPRO</span>
                  </a>
                </div>
              </div>
              <div className="col-2">
                <div className="d-flex d-md-none align-items-center justify-content-between justify-content-md-center mt-1 pb-4">
                  <div className="collapse-close d-md-none">
                    <a
                      onClick={() => {
                        setAriaExpanded(false);
                      }}
                      href="#sidebarMenu"
                      data-bs-toggle="collapse"
                      data-bs-target="#sidebarMenu"
                      aria-controls="sidebarMenu"
                      aria-expanded="true"
                      aria-label="Toggle navigation"
                    >
                      <svg
                        className="icon icon-xs"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
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
                  <img
                    className="avatar rounded-circle mb"
                    alt="Image placeholder"
                    src={
                      teste.perfil[0] === "cliente"
                        ? "assets/img/jumping.png"
                        : teste.perfil[0] === "parceiro"
                        ? "assets/img/business.png"
                        : teste.perfil[0] === "admin"
                        ? "assets/img/operator.png"
                        : teste.perfil[0] === "monitor"
                        ? "assets/img/worker.png"
                        : teste.perfil[0] === "agente"
                        ? "assets/img/business.png"
                        : "assets/img/jumping.png"
                    }
                    id="imagemPerfil"
                  />
                  <div className="media-body ms-3 text-white">
                    <div className="row">
                      <div className="col-12 text-start">
                        <span className="mb-0 fw-bold fs-6 text-start">
                          {window.innerWidth > 990
                            ? teste.nome.length > 17
                              ? `${teste.nome.substring(0, 17)}...`
                              : teste.nome
                            : window.innerWidth < 290
                            ? teste.nome.length > 15
                              ? `${teste.nome.substring(0, 15)}...`
                              : teste.nome
                            : teste.nome.length > 25
                            ? `${teste.nome.substring(0, 25)}...`
                            : teste.nome}{" "}
                        </span>{" "}
                        <br />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <MdOutlineSubdirectoryArrowRight
                          size={23}
                          className="mb-1"
                        />
                        <span className="mb-0 text-sm fs-6 mx-2 ">
                          {teste.perfil[0].perfil === undefined
                            ? teste.perfil[0].slice(0, 1).toUpperCase() +
                              teste.perfil[0].slice(1)
                            : teste.perfil[0].perfil}{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>

              <li className="nav-item">
                {teste.perfil[0] !== undefined ? (
                  <div>
                    {commonLinks.map((link, key) => (
                      <div key={key}>
                        <span
                          id="textoSm"
                          onClick={() => componentefunc(link.componente, key, "Item")}
                          className="nav-link collapsed d-flex justify-content-between align-items-center"
                          data-bs-toggle="collapse"
                          data-bs-target={`#submenu-app-${key}`}
                        >
                          <span>
                            <span>
                              {link.icon}
                              {link.name}
                            </span>
                          </span>
                          {link.subitem && (
                            <span className="link-arrow">
                              <svg
                                className="icon icon-sm"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </span>
                        <div
                          className="multi-level collapse"
                          role="list"
                          id={`submenu-app-${key}`}
                          aria-expanded="false"
                        >
                          <ul className="flex-column nav">
                            {link.subitem &&
                              link.subitem.map((subitem, key) => (
                                <li className="nav-item" key={key}>
                                  <a
                                    className={subitem.className}
                                    id="textoSm"
                                    onClick={
                                      subitem.deslogar
                                        ? () => handleLogout()
                                        : () => componentefunc(subitem.componente, key, "subItem")
                                    }
                                  >
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
                ) : null}
              </li>
            </ul>
          </div>
        </nav>
      ) : null}
      <div>
        {ariaExpanded ? null : (
          <div className="col-12 mb-4" id="divEspaco">
            {" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
