import { Link } from "react-router-dom";

function AdminMenu(){
    const nome = localStorage.getItem("user");
    const teste = JSON.parse(nome);
    console.log(teste.nome)









    return(
        <div className="dashboard-container">
        <div class="py-4"></div>
        <div class="row">
            <div class="col-12 col-xl-8">
            <div class="row">
                <div class="col-12 mb-4">
                    <div class="card border-0 shadow">
                        <div class="card-header">
                        <div class="row align-items-center">
                            <div class="col">
                                <h2 class="fs-5 fw-bold mb-0">Pagasdasdasde visits</h2>
                            </div>
                            <div class="col text-end"><a href="#" class="btn btn-sm btn-primary">See all</a></div>
                        </div>
                        </div>
                        <div class="table-responsive">
                        <table class="table align-items-center table-flush">
                            <thead class="thead-light">
                                <tr>
                                    <th class="border-bottom" scope="col">teste</th>
                                    <th class="border-bottom" scope="col">Page testrewtr</th>
                                    <th class="border-bottom" scope="col">asdasf Value</th>
                                    <th class="border-bottom" scope="col">Bounce asdasd</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th class="text-gray-900" scope="row">/demo/admin/index.html</th>
                                    <td class="fw-bolder text-gray-500">3,2asdasf25</td>
                                    <td class="fw-bolder text-gray-500">$2asdsad0</td>
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
                                    <th class="text-gray-900" scope="row">/demo/aasdasddmin/forms.html</th>
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
        
export default AdminMenu;