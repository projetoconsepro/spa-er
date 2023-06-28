import { FaCarAlt, FaParking, FaMapMarkerAlt, FaUserPlus, FaCar, FaHistory, FaUser, FaClipboardList } from "react-icons/fa";
import { RiFileAddFill } from "react-icons/ri";
import { BsConeStriped, BsCashCoin, BsPersonCircle, BsCashStack } from "react-icons/bs";
import { MdAddLocationAlt, MdOutlineContactSupport, MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { RiAlertFill, RiSettings5Fill } from "react-icons/ri";
import { useState } from "react";
import {HiBanknotes } from "react-icons/hi";
import { BiCreditCard, BiLogOut, BiSearchAlt, BiTransfer } from "react-icons/bi";
import { AiFillEdit, AiFillPrinter, AiOutlineBarChart, AiOutlineFileSearch } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import  FuncTrocaComp  from "../util/FuncTrocaComp";
import { useEffect } from "react";
import { FcMoneyTransfer } from "react-icons/fc";

const SidebarAvulso = () => {
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
            setAriaExpanded(false)
            FuncTrocaComp(componente)
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

    return(
    <div className="header-container mb-4">
         <nav className="navbar navbar-dark fixed-top navbar-theme-primary px-4 col-12 d-lg-none bg-blue-50" id="nav">
                <div className="d-flex align-items-center w-100 justify-content-between">
                <img src="../../assets/img/logoconseproof3.png" alt="Rich Logo" className="w-25" />  
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
                           
                            </a>

<li className="nav-item">
  <div>
  </div>
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

export default SidebarAvulso;