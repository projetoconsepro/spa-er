import { Link } from "react-router-dom";
function Sidebar(){
    <div className="header-container">
         <nav class="navbar navbar-dark navbar-theme-primary px-4 col-12 d-lg-none">
            <Link class="navbar-brand me-lg-5" to={{ pathname: "/"}}><img class="navbar-brand-dark" src="assets/img/logo.svg" alt="Rich logo" /> <img class="navbar-brand-light" src="assets/img/dark.svg" alt="Rich logo" /></Link>
                <div class="d-flex align-items-center"><button class="navbar-toggler d-lg-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button></div>
            </nav>
    </div>
}

export default Sidebar;