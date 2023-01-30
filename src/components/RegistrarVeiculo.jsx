import React from 'react'
import { useState } from 'react'


const RegistrarVeiculo = () => {
    const [placa, setPlaca] = useState("placa")

    const handlePlaca = () => {
    const clicado =document.getElementById("flexSwitchCheckDefault").checked
        if(clicado === true){
            setPlaca("placa2")
        }
        else{
            setPlaca("placa")
        }
    }
    
    return (
        <section class="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center text-md-center mb-3 pt-3 mt-4 mt-md-0">
                                <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
                            </div>
                            <div class="h5 mt-2 align-items-center">
                                Registre seu veículo aqui
                            </div>
                            <div className="row">
                                <div class="col-9 px-3 mt-4 pt-1">
                                    <h5 for="flexSwitchCheckDefault align-self-start" id="h5Placa">Placa estrangeira</h5>
                                </div>
                                <div class="col-3 px-3">
                                    <div class="form-check form-switch gap-2 d-md-block">
                                        <input class="form-check-input align-self-end" type="checkbox" role="switch" onClick={handlePlaca} id="flexSwitchCheckDefault" />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center text-md-center mb-3 pt-1 mt-md-0 w-100 p-6" id={placa}>
                                <input type="text" id="inputvazio" className='mt-6 pt-4 fs-1 justify-content-center align-items-center text-align-center' />
                            </div>
                            <div className="mt-1 mb-6 gap-2 d-md-block">
                                    <button type="submit" className="btn2 botao"><span className='align-self-start'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                    </svg></span> <a href="/">Voltar</a></button>
                                    <button type="submit" onClick="" className="btn botao">Acessar  <span className='align-self-end'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                                    </svg></span></button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RegistrarVeiculo