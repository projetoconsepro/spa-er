import { Link } from "react-router-dom";

function AdminMenu(){
    return(
        <li class="nav-item active">
                       <Link class="nav-link" to={{ pathname: "/"}}>
                            <span class="sidebar-icon">
                            <svg class="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                            </svg>
                            </span>
                            <span class="sidebar-text">Dashboard</span>
                        </Link>
                    </li>
        )}
        
export default AdminMenu;