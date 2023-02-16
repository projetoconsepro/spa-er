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
            setLimite(100)
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

    console.log(uppercase)

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
            window.location.reload();
            }
        }
    ).catch(function (error) {
        console.log(error);
    });
    }

    const HangleBack = () => {
        localStorage.setItem('componente', 'MeusVeiculos')
        window.location.reload();
    }

    useEffect(() => {
        if (textoPlaca.at(4) === '1' || textoPlaca.at(4) === '2' 
        || textoPlaca.at(4) === '3' || textoPlaca.at(4) === '4' || textoPlaca.at(4) === '5'
        || textoPlaca.at(4) === '6' || textoPlaca.at(4) === '7' || textoPlaca.at(4) === '8'
        || textoPlaca.at(4) === '9' || textoPlaca.at(4) === '0') {
            setPlaca("placa3")
            if (cont === 0) {
                const fim = textoPlaca.substring(3, textoPlaca.length);
                console.log(fim)
                const texto = textoPlaca.substring(0, 3);
                const traco = "-"
                setTextoPlaca(texto +traco+ fim)
                setCont(cont + 1)
                }
                else {
                const fim = textoPlaca.substring(4, textoPlaca.length);
                console.log(fim)
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

    }, [textoPlaca])

    
    return (
        <section className="vh-lg-100 mt-lg-0 bg-soft d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="h5 mt-2 align-items-center">
                                Registre seu veículo aqui
                            </div>
                            <div className="row">
                                <div className="col-9 px-3 mt-4 pt-1">
                                    <h5 for="flexSwitchCheckDefault align-self-start" id="h5Placa">Placa estrangeira</h5>
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
        </section>
    )
}

export default RegistrarVeiculo