function AdminMenu(){
    const nome = localStorage.getItem("user");
    const teste = JSON.parse(nome);
    console.log(teste.nome)


    return(
        <div className="dashboard-container">
        <div className="py-4"></div>
        <div className="row">
            <div className="col-12 col-xl-8">
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="card border-0 shadow">
                        <div className="card-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h2 className="fs-5 fw-bold mb-0">Pagasdasdasde visits</h2>
                            </div>
                            <div className="col text-end"><a href="#" className="btn btn-sm btn-primary">See all</a></div>
                        </div>
                        </div>
                        <div className="table-responsive">
                        <table className="table align-items-center table-flush">
                            <thead className="thead-light">
                                <tr>
                                    <th className="border-bottom" scope="col">teste</th>
                                    <th className="border-bottom" scope="col">Page testrewtr</th>
                                    <th className="border-bottom" scope="col">asdasf Value</th>
                                    <th className="border-bottom" scope="col">Bounce asdasd</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className="text-gray-900" scope="row">/demo/admin/index.html</th>
                                    <td className="fw-bolder text-gray-500">3,2asdasf25</td>
                                    <td className="fw-bolder text-gray-500">$2asdsad0</td>
                                    <td className="fw-bolder text-gray-500">
                                    <div className="d-flex">
                                        <svg className="icon icon-xs text-danger me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        42,55%
                                    </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="text-gray-900" scope="row">/demo/aasdasddmin/forms.html</th>
                                    <td className="fw-bolder text-gray-500">2,987</td>
                                    <td className="fw-bolder text-gray-500">0</td>
                                    <td className="fw-bolder text-gray-500">
                                    <div className="d-flex">
                                        <svg className="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        43,24%
                                    </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="text-gray-900" scope="row">/demo/admin/util.html</th>
                                    <td className="fw-bolder text-gray-500">2,844</td>
                                    <td className="fw-bolder text-gray-500">294</td>
                                    <td className="fw-bolder text-gray-500">
                                    <div className="d-flex">
                                        <svg className="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        32,35%
                                    </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="text-gray-900" scope="row">/demo/admin/validation.html</th>
                                    <td className="fw-bolder text-gray-500">2,050</td>
                                    <td className="fw-bolder text-gray-500">$147</td>
                                    <td className="fw-bolder text-gray-500">
                                    <div className="d-flex">
                                        <svg className="icon icon-xs text-danger me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        50,87%
                                    </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="text-gray-900" scope="row">/demo/admin/modals.html</th>
                                    <td className="fw-bolder text-gray-500">1,483</td>
                                    <td className="fw-bolder text-gray-500">$19</td>
                                    <td className="fw-bolder text-gray-500">
                                    <div className="d-flex">
                                        <svg className="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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