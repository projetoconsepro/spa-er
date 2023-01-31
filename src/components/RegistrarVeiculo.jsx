import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const RegistrarVeiculo = () => {
    const [placa, setPlaca] = useState("placa")
    const [textoPlaca, setTextoPlaca] = useState("")
    const [limite, setLimite] = useState(7)
    const [inputVazio, setInputVazio] = useState("inputvazio")

    const handlePlaca = () => {
    const clicado = document.getElementById("flexSwitchCheckDefault").checked
        if(clicado === true){
            setPlaca("placa2")
            setLimite(100)
            setInputVazio("inputvazio2")
        }
        else{
            setPlaca("placa")
            setLimite(7)
            setInputVazio("inputvazio")
        }
    }

    const requisicao = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    console.log(user2.id_usuario)
    console.log(token)
    const veiculo = axios.create({
        baseURL: "http://localhost:3001",
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })
    
    veiculo.post('/veiculo',{
        placa: textoPlaca,
        id_usuario: user2.id_usuario
      }).then(
        response => {
            console.log(response.data)
        }
    ).catch(function (error) {
        console.log(error);
    });
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
                                        <input class="form-check-input align-self-end" type="checkbox" 
                                        role="switch" onClick={handlePlaca} id="flexSwitchCheckDefault"/>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 pt-1 mt-md-0 w-100 p-6" id={placa}>
                                <input type="text" id={inputVazio} className='mt-6 pt-4 fs-1 justify-content-center align-items-center text-align-center' value={textoPlaca} onChange={(e) => setTextoPlaca(e.target.value)} maxLength={limite}/>
                            </div>
                            <div className="mt-1 mb-6 gap-2 d-md-block">
                                    <button type="submit" className="btn2 botao"><a href="/">Voltar</a></button>
                                    <button type="submit" onClick={requisicao} className="btn3 botao">Cadastrar</button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RegistrarVeiculo