import { Link } from "react-router-dom";
const Sidebar = () =>{
        const nome = localStorage.getItem("user");
        const teste = JSON.parse(nome);
        console.log(teste.perfil)
        const styles = {
        className: "nav-link",
        }
    const links = [
        {
            
        }
    ]
    
    if(teste.perfil[0] === "Estacionamento"){
        links.push({
            className: styles.className,
            name: "Estacionamento",
            to: "/estacionamento",
        })
        links.push({
            className: styles.className,
            name: "Meus veiculos",
            to: "/meusveiculos",
        })
        links.push({
            className: styles.className,
            name: "Vagas livres",
            to: "/meusdados",
        })
        links.push({
            className: styles.className,
            name: "Adicionar Creditos",
            to: "/adicionarcreditos",
        })
        links.push({
            className: styles.className,
            name: "Adicionar veiculos",
            to: "/adicionarveiculos",
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
                <div class="sidebar-inner px-4 pt-3">
                <div class="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
                    <div class="collapse-close d-md-none">
                        <a href="#sidebarMenu" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="true" aria-label="Toggle navigation">
                            <svg class="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                    </div>
                </div>
                <ul class="nav flex-column pt-3 pt-md-0">
                    <li class="nav-item"><a href="#" class="nav-link d-flex align-items-center"><span class="sidebar-icon"><img src="assets/img/logo.png" height="20" width="20" alt="Rich Logo" /> </span><span class="mt-1 ms-1 sidebar-text">CONSEPRO</span></a></li>
                    <li class="nav-item active">
                    {links.map(link => (<Link className={link.className} to={link.to}>{link.name}</Link>))}
                    </li>
                </ul>
            </div>
            </nav>
    </div>
    )
}

export default Sidebar;