import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

const RegistrarVeiculo = () => {
    const [placa, setPlaca] = useState("placa")
    const [textoPlaca, setTextoPlaca] = useState("")
    const [limite, setLimite] = useState(8)
    const [inputVazio, setInputVazio] = useState("inputvazio")
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [cont, setCont] = useState(0);
    const [teste, setTeste] = useState("")

    const handlePlaca = () => {
    const clicado = document.getElementById("flexSwitchCheckDefault").checked
        if(clicado === true){
            setPlaca("placa2")
            setLimite(10)
            setInputVazio("inputvazio2")
        }
        else{
            setPlaca("placa")
            setLimite(8)
            setInputVazio("inputvazio")
        }
    }

    const requisicao = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const uppercase = teste.toUpperCase();
    const veiculo = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })


    function validarPlaca(placa) {
        const regexPlacaAntiga = /^[a-zA-Z]{3}\d{4}$/;
        const regexPlacaNova = /^([A-Z]{3}[0-9][A-Z0-9][0-9]{2})|([A-Z]{4}[0-9]{2})$/;
      
        if (regexPlacaAntiga.test(placa) || regexPlacaNova.test(placa)) {
          return true;
        } else {
          return false;
        }
      }
      let estadoIf = false;

    if (placa !== "placa2"){
        let placaFinal = ""
        if (placa === "placa"){
            placaFinal = textoPlaca;
        }
        else {
            const split = textoPlaca.split("-")
            placaFinal = split[0] + split[1]
        }
        placaFinal = placaFinal.toUpperCase()
        if(validarPlaca(placaFinal) === false ) {
            estadoIf = false;
            setMensagem("Placa inválida")
            setEstado(true)
            setTimeout(() => {
                setEstado(false)
                setMensagem("")
            }, 5000);
        } else {
            estadoIf = true
        }
    } else {
        estadoIf = true
    } 
    
    if(estadoIf){
    veiculo.post('/veiculo',{
        placa: uppercase,
        id_usuario: user2.id_usuario
      }).then(
        response => {
            const resposta = response.data.msg.resultado;
            if (resposta === false){
                setMensagem(response.data.msg.msg)
                setEstado(true)
                setTimeout(() => {
                    setEstado(false)
                }, 4000);
            }
            else {
            localStorage.setItem("componente", "MeusVeiculos")
            }
        }
    ).catch(function (error) {
        localStorage.clear();
    });
    }
}


    const HangleBack = () => {
        localStorage.setItem('componente', 'MeusVeiculos')
        //era pra ser window.location.reload()
    }

    useEffect(() => {
        const clicado = document.getElementById("flexSwitchCheckDefault").checked
        if(clicado === false){
        if (textoPlaca.at(4) === '1' || textoPlaca.at(4) === '2' 
        || textoPlaca.at(4) === '3' || textoPlaca.at(4) === '4' || textoPlaca.at(4) === '5'
        || textoPlaca.at(4) === '6' || textoPlaca.at(4) === '7' || textoPlaca.at(4) === '8'
        || textoPlaca.at(4) === '9' || textoPlaca.at(4) === '0') {
            setPlaca("placa3")
            if (cont === 0) {
                const fim = textoPlaca.substring(3, textoPlaca.length);
                const texto = textoPlaca.substring(0, 3);
                const traco = "-"
                setTextoPlaca(texto +traco+ fim)
                setCont(cont + 1)
                }
                else {
                const fim = textoPlaca.substring(4, textoPlaca.length);
                const texto = textoPlaca.substring(0, 3);
                const traco = "-"
                setTextoPlaca(texto +traco+ fim)
                setCont(cont + 1)
                }
        } else {
        setPlaca("placa")
        setCont(0)
        }
        setTeste(textoPlaca.replace("-", ""))
    }

    },[textoPlaca])

    
    return (
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="h5 mt-2 align-items-center">
                                Registre seu veículo aqui
                            </div>
                            <div className="row">
                                <div className="col-9 px-3 mt-4 pt-1">
                                    <h5 id="h5Placa">Placa estrangeira</h5>
                                </div>
                                <div className="col-3 px-3">
                                    <div className="form-check form-switch gap-2 d-md-block">
                                        <input className="form-check-input align-self-end" type="checkbox" 
                                        role="switch" onClick={handlePlaca} id="flexSwitchCheckDefault"/>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 pt-1 mt-md-0 w-100 p-6" id={placa}>
                                <input type="text" id={inputVazio} className='mt-6 pt-4 fs-1 justify-content-center align-items-center text-align-center' value={textoPlaca} onChange={(e) => setTextoPlaca(e.target.value)} maxLength={limite}/>
                            </div>
                            <div className="mt-1 mb-6 gap-2 d-md-block">
                                    <button type="submit" className="btn2 botao" onClick={HangleBack}>Voltar</button>
                                    <button type="submit" onClick={requisicao} className="btn3 botao">Cadastrar</button>
                                </div>
                                <div className="alert alert-danger" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                {mensagem}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default RegistrarVeiculo