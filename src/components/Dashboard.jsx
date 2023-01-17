function Dashboard() {
    const nome = localStorage.getItem("user");
    const teste = JSON.parse(nome);
    console.log(teste.nome)
    return (
        <div className="dashboard-container">
            <nav class="navbar navbar-top navbar-expand navbar-dashboard navbar-dark ps-0 pe-2 pb-0">
                <div class="container-fluid px-0">
                <div class="d-flex justify-content-between w-100" id="navbarSupportedContent">
                    <div class="d-flex align-items-center">
                        <form class="navbar-search form-inline" id="navbar-search-main">
                            <div class="input-group input-group-merge search-bar">
                            <span class="input-group-text" id="topbar-addon">
                                <svg class="icon icon-xs" x-description="Heroicon name: solid/search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                                </svg>
                            </span>
                            <input type="text" class="form-control" id="topbarInputIconLeft" placeholder="Search" aria-label="Search" aria-describedby="topbar-addon" />
                            </div>
                        </form>
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
                            <a class="dropdown-item d-flex align-items-center" href="#">
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
            <div class="py-4"></div>
            <div class="row">
                <div class="col-12 col-xl-8">
                <div class="row">
                    <div class="col-12 mb-4">
                        <div class="card border-0 shadow">
                            <div class="card-header">
                            <div class="row align-items-center">
                                <div class="col">
                                    <h2 class="fs-5 fw-bold mb-0">Page visits</h2>
                                </div>
                                <div class="col text-end"><a href="#" class="btn btn-sm btn-primary">See all</a></div>
                            </div>
                            </div>
                            <div class="table-responsive">
                            <table class="table align-items-center table-flush">
                                <thead class="thead-light">
                                    <tr>
                                        <th class="border-bottom" scope="col">Page name</th>
                                        <th class="border-bottom" scope="col">Page Views</th>
                                        <th class="border-bottom" scope="col">Page Value</th>
                                        <th class="border-bottom" scope="col">Bounce rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th class="text-gray-900" scope="row">/demo/admin/index.html</th>
                                        <td class="fw-bolder text-gray-500">3,225</td>
                                        <td class="fw-bolder text-gray-500">$20</td>
                                        <td class="fw-bolder text-gray-500">
                                        <div class="d-flex">
                                            <svg class="icon icon-xs text-danger me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            42,55%
                                        </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="text-gray-900" scope="row">/demo/admin/forms.html</th>
                                        <td class="fw-bolder text-gray-500">2,987</td>
                                        <td class="fw-bolder text-gray-500">0</td>
                                        <td class="fw-bolder text-gray-500">
                                        <div class="d-flex">
                                            <svg class="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            43,24%
                                        </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="text-gray-900" scope="row">/demo/admin/util.html</th>
                                        <td class="fw-bolder text-gray-500">2,844</td>
                                        <td class="fw-bolder text-gray-500">294</td>
                                        <td class="fw-bolder text-gray-500">
                                        <div class="d-flex">
                                            <svg class="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            32,35%
                                        </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="text-gray-900" scope="row">/demo/admin/validation.html</th>
                                        <td class="fw-bolder text-gray-500">2,050</td>
                                        <td class="fw-bolder text-gray-500">$147</td>
                                        <td class="fw-bolder text-gray-500">
                                        <div class="d-flex">
                                            <svg class="icon icon-xs text-danger me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            50,87%
                                        </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="text-gray-900" scope="row">/demo/admin/modals.html</th>
                                        <td class="fw-bolder text-gray-500">1,483</td>
                                        <td class="fw-bolder text-gray-500">$19</td>
                                        <td class="fw-bolder text-gray-500">
                                        <div class="d-flex">
                                            <svg class="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                            </svg>
                                            26,12%
                                        </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;