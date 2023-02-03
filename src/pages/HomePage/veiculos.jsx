import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import AdminMenu from '../../components/AdminMenu';
import ListarVeiculos from '../../components/ListarVeiculos';
import RegistrarVeiculo from '../../components/RegistrarVeiculo';
import RegistrarVagaCliente from '../../components/RegistrarVagaCliente';

const Veiculos = () => {
    const componente = localStorage.getItem("componente");
        if(componente === "MeusVeiculos"){
            return <ListarVeiculos />
        }
        else if (componente === "RegistrarEstacionamento"){
            return <RegistrarVagaCliente />
        }
        else if(componente === "CadastrarVeiculo"){
            return <RegistrarVeiculo />
        }
        else{
            return <ListarVeiculos />
        }
    }

export default Veiculos;