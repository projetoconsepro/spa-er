import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminMenu from '../../components/AdminMenu';
import ListarVeiculos from '../../components/ListarVeiculos';
import RegistrarVeiculo from '../../components/RegistrarVeiculo';
import RegistrarVagaCliente from '../../components/RegistrarVagaCliente';
import RegistrarVagaMonitor from '../../components/RegistrarVagaMonitor';

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
        else if(componente === "RegistrarVagaMonitor"){
            return <RegistrarVagaMonitor />
        }
        else {
            return <AdminMenu />
        }
    }

export default Veiculos;