import React from 'react'
import Grafico from './Grafico'

const Dashboard = () => {
  return (
    <div>
       <div className="row">
                <div className="col-12 mb-4">
                    <div className="card bg-yellow-100 border-0 shadow">
                        <div className="card-header d-sm-flex flex-row align-items-center flex-0">
                            <div className="d-block mb-3 mb-sm-0">
                                <div className="fs-5 fw-normal mb-2">Sales Value</div>
                                <h2 className="fs-3 fw-extrabold">$10,567</h2>
                                <div className="small mt-2"> 
                                    <span className="fw-normal me-2">Yesterday</span>                              
                                    <span className="fas fa-angle-up text-success"></span>                                   
                                    <span className="text-success fw-bold">10.57%</span>
                                </div>
                            </div>
                            <div className="d-flex ms-auto">
                                <button className="btn4 botao btn-sm btn-ghost-secondary me-3" type="button"> Mês </button>
                                <button className="btn4 botao btn-sm btn-ghost-secondary me-2" type="button"> Semana </button>
                            </div>
                        </div>
                        <div className="card-body4 p-2">
                            <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                              <Grafico />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-4 mb-4">
                    <div className="card border-0 shadow">
                        <div className="card-body2">
                            <div className="row d-block d-xl-flex align-items-center">
                                <div className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                                    <div className="icon-shape icon-shape-primary rounded me-4 me-sm-0">
                                        <svg className="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                                    </div>
                                    <div className="d-sm-none">
                                        <h2 className="h5">Customers</h2>
                                        <h3 className="fw-extrabold mb-1">345,678</h3>
                                    </div>
                                </div>
                                <div className="col-12 col-xl-7 px-xl-0">
                                    <div className="d-none d-sm-block">
                                        <h2 className="h6 text-gray-400 mb-0">Customers</h2>
                                        <h3 className="fw-extrabold mb-2">345k</h3>
                                    </div>
                                    <small className="d-flex align-items-center text-gray-500">
                                        Feb 1 - Apr 1,  
                                        <svg className="icon icon-xxs text-gray-500 ms-2 me-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"></path></svg>
                                        USA
                                    </small> 
                                    <div className="small d-flex mt-1">                               
                                        <div>Since last month <svg className="icon icon-xs text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"></path></svg><span className="text-success fw-bolder">22%</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-4 mb-4">
                    <div className="card border-0 shadow">
                        <div className="card-body2">
                            <div className="row d-block d-xl-flex align-items-center">
                                <div className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                                    <div className="icon-shape icon-shape-secondary rounded me-4 me-sm-0">
                                        <svg className="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                                    </div>
                                    <div className="d-sm-none">
                                        <h2 className="fw-extrabold h5">Revenue</h2>
                                        <h3 className="mb-1">$43,594</h3>
                                    </div>
                                </div>
                                <div className="col-12 col-xl-7 px-xl-0">
                                    <div className="d-none d-sm-block">
                                        <h2 className="h6 text-gray-400 mb-0">Revenue</h2>
                                        <h3 className="fw-extrabold mb-2">$43,594</h3>
                                    </div>
                                    <small className="d-flex align-items-center text-gray-500">
                                        Feb 1 - Apr 1,  
                                        <svg className="icon icon-xxs text-gray-500 ms-2 me-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"></path></svg>
                                        GER
                                    </small> 
                                    <div className="small d-flex mt-1">                               
                                        <div>Since last month <svg className="icon icon-xs text-danger" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg><span className="text-danger fw-bolder">2%</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-4 mb-4">
                    <div className="card border-0 shadow">
                        <div className="card-body2">
                            <div className="row d-block d-xl-flex align-items-center">
                                <div className="col-12 col-xl-5 text-xl-center mb-3 mb-xl-0 d-flex align-items-center justify-content-xl-center">
                                    <div className="icon-shape icon-shape-tertiary rounded me-4 me-sm-0">
                                        <svg className="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"></path></svg>
                                    </div>
                                    <div className="d-sm-none">
                                        <h2 className="fw-extrabold h5"> Bounce Rate</h2>
                                        <h3 className="mb-1">50.88%</h3>
                                    </div>
                                </div>
                                <div className="col-12 col-xl-7 px-xl-0">
                                    <div className="d-none d-sm-block">
                                        <h2 className="h6 text-gray-400 mb-0"> Bounce Rate</h2>
                                        <h3 className="fw-extrabold mb-2">50.88%</h3>
                                    </div>
                                    <small className="text-gray-500">
                                        Feb 1 - Apr 1
                                    </small> 
                                    <div className="small d-flex mt-1">                               
                                        <div>Since last month <svg className="icon icon-xs text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"></path></svg><span className="text-success fw-bolder">4%</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <div className="card border-0 shadow">
                                <div className="card-header">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h2 className="fs-5 fw-bold mb-0">Page visits</h2>
                                        </div>
                                        <div className="col text-end">
                                            <a href="#" className="btn btn-sm btn-primary">See all</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table align-items-center table-flush">
                                        <thead className="thead-light">
                                        <tr>
                                            <th className="border-bottom" scope="col">Page name</th>
                                            <th className="border-bottom" scope="col">Page Views</th>
                                            <th className="border-bottom" scope="col">Page Value</th>
                                            <th className="border-bottom" scope="col">Bounce rate</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <th className="text-gray-900" scope="row">
                                                /demo/admin/index.html
                                            </th>
                                            <td className="fw-bolder text-gray-500">
                                                3,225
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                $20
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                <div className="d-flex">
                                                    <svg className="icon icon-xs text-danger me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"></path></svg>
                                                    42,55%
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-gray-900" scope="row">
                                                /demo/admin/forms.html
                                            </th>
                                            <td className="fw-bolder text-gray-500">
                                                2,987
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                0
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                <div className="d-flex">
                                                    <svg className="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"></path></svg>
                                                    43,24%
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-gray-900" scope="row">
                                                /demo/admin/util.html
                                            </th>
                                            <td className="fw-bolder text-gray-500">
                                                2,844
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                            294
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                <div className="d-flex">
                                                    <svg className="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"></path></svg>
                                                    32,35%
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-gray-900" scope="row">
                                                /demo/admin/validation.html
                                            </th>
                                            <td className="fw-bolder text-gray-500">
                                                2,050
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                $147
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                <div className="d-flex">
                                                    <svg className="icon icon-xs text-danger me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"></path></svg>
                                                    50,87%
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-gray-900" scope="row">
                                                /demo/admin/modals.html
                                            </th>
                                            <td className="fw-bolder text-gray-500">
                                                1,483
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                $19
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                <div className="d-flex">
                                                    <svg className="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"></path></svg>
                                                    26,12%
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 col-xxl-6 mb-4">
                            <div className="card border-0 shadow">
                                <div className="card-header border-bottom d-flex align-items-center justify-content-between">
                                    <h2 className="fs-5 fw-bold mb-0">Progress track</h2>
                                     <a href="#" className="btn btn-sm btn-primary">See tasks</a>
                                 </div>
                                <div className="card-body4">
                                   
                                    <div className="row mb-4">
                                        <div className="col-auto">
                                            <svg className="icon icon-sm text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"></path></svg>
                                        </div>
                                        <div className="col">
                                            <div className="progress-wrapper">
                                                <div className="progress-info">
                                                    <div className="h6 mb-0">Rocket - SaaS Template</div>
                                                    <div className="small fw-bold text-gray-500"><span>75 %</span></div>
                                                </div>
                                                <div className="progress mb-0">
                                                    <div className="progress-bar bg-success w-75" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                               
                                    <div className="row align-items-center mb-4">
                                        <div className="col-auto">
                                            <svg className="icon icon-sm text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"></path></svg>
                                        </div>
                                        <div className="col">
                                            <div className="progress-wrapper">
                                                <div className="progress-info">
                                                    <div className="h6 mb-0">Themesberg - Design System</div>
                                                    <div className="small fw-bold text-gray-500"><span>60 %</span></div>
                                                </div>
                                                <div className="progress mb-0">
                                                    <div className="progress-bar bg-success w-50" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                              
                                    <div className="row align-items-center mb-4">
                                        <div className="col-auto">
                                            <svg className="icon icon-sm text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"></path></svg>
                                        </div>
                                        <div className="col">
                                            <div className="progress-wrapper">
                                                <div className="progress-info">
                                                    <div className="h6 mb-0">Homepage Design in Figma</div>
                                                    <div className="small fw-bold text-gray-500"><span>45 %</span></div>
                                                </div>
                                                <div className="progress mb-0">
                                                    <div className="progress-bar bg-warning w-50" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                
                                    <div className="row align-items-center mb-3">
                                        <div className="col-auto">
                                            <svg className="icon icon-sm text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"></path></svg>
                                        </div>
                                        <div className="col">
                                            <div className="progress-wrapper">
                                                <div className="progress-info">
                                                    <div className="h6 mb-0">Backend for Themesberg v2</div>
                                                    <div className="small fw-bold text-gray-500"><span>34 %</span></div>
                                                </div>
                                                <div className="progress mb-0">
                                                    <div className="progress-bar bg-danger w-50" role="progressbar" aria-valuenow="34" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-xl-4">
                    <div className="col-12 px-0 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-header d-flex flex-row align-items-center flex-0 border-bottom">
                                <div className="d-block">
                                    <div className="h6 fw-normal text-gray mb-2">Total orders</div>
                                    <h2 className="h3 fw-extrabold">452</h2>
                                    <div className="small mt-2">                               
                                        <span className="fas fa-angle-up text-success"></span>                                   
                                        <span className="text-success fw-bold">18.2%</span>
                                    </div>
                                </div>
                                <div className="d-block ms-auto">
                                    <div className="d-flex align-items-center text-end mb-2">
                                        <span className="dot rounded-circle bg-gray-800 me-2"></span>
                                        <span className="fw-normal small">July</span>
                                    </div>
                                    <div className="d-flex align-items-center text-end">
                                        <span className="dot rounded-circle bg-secondary me-2"></span>
                                        <span className="fw-normal small">August</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-2">
                                <div className="ct-chart-ranking ct-golden-section ct-series-a"></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 px-0 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-body7">
                                <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
                                    <div>
                                        <div className="h6 mb-0 d-flex align-items-center">
                                            <svg className="icon icon-xs text-gray-500 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"></path></svg>
                                            Global Rank
                                        </div>
                                    </div>
                                    <div>
                                        <a href="#" className="d-flex align-items-center fw-bold">
                                            #755
                                            <svg className="icon icon-xs text-gray-500 ms-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"></path></svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between border-bottom py-3">
                                    <div>
                                        <div className="h6 mb-0 d-flex align-items-center">
                                            <svg className="icon icon-xs text-gray-500 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"></path></svg>
                                            Country Rank
                                        </div>
                                        <div className="small card-stats">
                                            United States
                                            <svg className="icon icon-xs text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"></path></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <a href="#" className="d-flex align-items-center fw-bold">
                                            #32
                                            <svg className="icon icon-xs text-gray-500 ms-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"></path></svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between pt-3">
                                    <div>
                                        <div className="h6 mb-0 d-flex align-items-center">
                                            <svg className="icon icon-xs text-gray-500 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"></path><path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"></path></svg>
                                            Category Rank
                                        </div>
                                        <div className="small card-stats">
                                            Computers Electronics  Technology
                                            <svg className="icon icon-xs text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"></path></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <a href="#" className="d-flex align-items-center fw-bold">
                                            #11
                                            <svg className="icon icon-xs text-gray-500 ms-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"></path></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 px-0">
                        <div className="card border-0 shadow">
                            <div className="card-body7">
                                <h2 className="fs-5 fw-bold mb-1">Acquisition</h2>
                                <p>Tells you where your visitors originated from, such as search engines, social networks or website referrals.</p>
                                <div className="d-block">
                                    <div className="d-flex align-items-center me-5">
                                        <div className="icon-shape icon-sm icon-shape-danger rounded me-3">
                                            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"></path></svg>
                                        </div>
                                        <div className="d-block">
                                            <label className="mb-0">Bounce Rate</label>
                                            <h4 className="mb-0">33.50%</h4>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center pt-3">
                                        <div className="icon-shape icon-sm icon-shape-purple rounded me-3">
                                            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>                                        </div>
                                        <div className="d-block">
                                            <label className="mb-0">Sessions</label>
                                            <h4 className="mb-0">9,567</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="theme-settings card bg-gray-800 pt-2 collapse" id="theme-settings">
    <div className="card-body bg-gray-800 text-white pt-4">
        <button type="button" className="btn-close theme-settings-close" aria-label="Close" data-bs-toggle="collapse"
            href="#theme-settings" role="button" aria-expanded="false" aria-controls="theme-settings"></button>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="m-0 mb-1 me-4 fs-7">Open source <span role="img" aria-label="gratitude">💛</span></p>
            <a className="github-button" href="https://github.com/themesberg/volt-bootstrap-5-dashboard"
                data-color-scheme="no-preference: dark; light: light; dark: light;" data-icon="octicon-star"
                data-size="large" data-show-count="true"
                aria-label="Star themesberg/volt-bootstrap-5-dashboard on GitHub">Star</a>
        </div>
        <a href="https://themesberg.com/product/admin-dashboard/volt-bootstrap-5-dashboard" target="_blank"
            className="btn btn-secondary d-inline-flex align-items-center justify-content-center mb-3 w-100">
            Download 
            <svg className="icon icon-xs ms-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z"></path></svg>
        </a>
        <p className="fs-7 text-gray-300 text-center">Available in the following technologies:</p>
        <div className="d-flex justify-content-center">
            <a className="me-3" href="https://themesberg.com/product/admin-dashboard/volt-bootstrap-5-dashboard"
                target="_blank">
                <img src="../../assets/img/technologies/bootstrap-5-logo.svg" className="image image-xs" />
            </a>
            <a href="https://demo.themesberg.com/volt-react-dashboard/#/" target="_blank">
                <img src="../../assets/img/technologies/react-logo.svg" className="image image-xs" />
            </a>
        </div>
    </div>
</div>

<div className="card theme-settings bg-gray-800 theme-settings-expand" id="theme-settings-expand">
    <div className="card-body bg-gray-800 text-white rounded-top p-3 py-2">
        <span className="fw-bold d-inline-flex align-items-center h6">
            <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"></path></svg>
            Settings
        </span>
    </div>
</div>
    </div>
  )
}

export default Dashboard