import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import VoltarComponente from '../util/VoltarComponente'
import FuncTrocaComp from '../util/FuncTrocaComp'
import { Button, Divider } from '@mantine/core'
import createAPI from '../services/createAPI'

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
    const veiculo = createAPI();


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
            FuncTrocaComp( "MeusVeiculos")
            }
        }
    ).catch(function (error) {
        if(error?.response?.data?.msg === "Cabeçalho inválido!" 
        || error?.response?.data?.msg === "Token inválido!" 
        || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
        } else {
            console.log(error)
        }
    });
    }
}

    useEffect(() => {
        const clicado = document.getElementById("flexSwitchCheckDefault").checked
        if(clicado === false){
            if (textoPlaca[4] === '1' || textoPlaca[4] === '2' ||
            textoPlaca[4] === '3' || textoPlaca[4] === '4' || textoPlaca[4] === '5'||
            textoPlaca[4] === '6' || textoPlaca[4] === '7' || textoPlaca[4] === '8'||
            textoPlaca[4] === '9' || textoPlaca[4] === '0') {
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
                        <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="h5 mt-2 align-items-center">
                                Registre seu veículo aqui
                            </div>
                            <Divider my="sm" size="md" variant="dashed" />
            <div className="row">
                <div className="col-9 px-3 pt-1">
                    <h6>Placa estrangeira/Outra</h6>
                </div>
                <div className="col-3 px-3">
                    <div className="form-check3 form-switch gap-2 d-md-block">
                        <input
                        className="form-check-input align-self-end"
                        type="checkbox"
                        role="switch"
                        onClick={handlePlaca}
                        id="flexSwitchCheckDefault"
                        onChange={() => {
                        }}
                        />
                    </div>
                </div>
            </div>
            
                    <div className="pt-1 mt-md-0 w-100 p-3" id={placa}>
                        <input type="text" id={inputVazio} className="mt-5 fs-1 justify-content-center align-items-center text-center" value={textoPlaca} onChange={(e) => setTextoPlaca(e.target.value)} maxLength={limite}/>
                    </div>
                    <div className="mt-1 mb-6 gap-2 d-md-block">
                        <VoltarComponente space={true}/>
                        <Button onClick={requisicao} className="bg-blue-50" size="md" radius="md">Cadastrar</Button>
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