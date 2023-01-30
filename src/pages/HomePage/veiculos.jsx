import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import Dashboard from '../../components/Dashboard';
import Sidebar from '../../components/Sidebar';
import AdminMenu from '../../components/AdminMenu';
import ListarVeiculos from '../../components/ListarVeiculos';
import RegistrarVeiculo from '../../components/RegistrarVeiculo';

const Veiculos = () => {
    const componente = localStorage.getItem("componente");
        if(componente === "MeusVeiculos"){
            return <ListarVeiculos />
        }
        else if (componente === "RegistrarEstacionamento"){
            return <AdminMenu />
        }
        else if(componente === "CadastrarVeiculo"){
            return <RegistrarVeiculo />
        }
        else{
            return <ListarVeiculos />
        }
    }

export default Veiculos;