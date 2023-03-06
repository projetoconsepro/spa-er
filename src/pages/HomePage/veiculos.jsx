import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListarVagasMonitor from '../../components/ListarVagasMonitor';
import ListarVeiculos from '../../components/ListarVeiculos';
import RegistrarVeiculo from '../../components/RegistrarVeiculo';
import RegistrarVagaCliente from '../../components/RegistrarVagaCliente';
import RegistrarVagaMonitor from '../../components/RegistrarVagaMonitor';
import Error from '../../components/Error';
import Notificacao from '../../components/Notificacao';
import Camera from '../../components/Camera';
import ListarNotificacoes from '../../components/ListarNotificacoes';

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
        else if (componente === "ListarVagasMonitor"){
            return <ListarVagasMonitor />
        }
        else if ( componente === "Notificacao"){
            return <Notificacao />
        }
        else if ( componente === "Camera"){
            return <Camera />
        }
        else if ( componente === "ListarNotificacoes"){
            return <ListarNotificacoes />
        }
        else {
            return <Error />
        }
    }

export default Veiculos;