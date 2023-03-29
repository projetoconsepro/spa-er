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
import BuscarVeiculo from '../../components/BuscarVeiculo';
import Irregularidades from '../../components/Irregularidades';
import HistoricoVeiculo from '../../components/HistoricoVeiculo';
import RegisterPage from '../../components/Register';
import ResetPassword from '../../components/ResetPassword';
import Confirmation from '../../components/Confirmation';
import NewPassword from '../../components/NewPassword';
import LoginPage from '../../components/LoginPage';
import DoisPerfis from '../../components/DoisPerfis';
import RegistrarEstacionamentoParceiro from '../../components/RegistrarEstacionamentoParceiro';
import AdicionarCreditos from '../../components/AdicionarCreditos';
import AbrirCaixa from '../../components/AbrirCaixa';
export default function Veiculos({Componente}) {
        if(Componente === "MeusVeiculos"){
            return <ListarVeiculos />
        }
        else if (Componente === "RegistrarEstacionamento"){
            return <RegistrarVagaCliente />
        }
        else if(Componente === "CadastrarVeiculo"){
            return <RegistrarVeiculo />
        }
        else if(Componente === "RegistrarVagaMonitor"){
            return <RegistrarVagaMonitor />
        }
        else if (Componente === "ListarVagasMonitor"){
            return <ListarVagasMonitor />
        }
        else if ( Componente === "Notificacao"){
            return <Notificacao />
        }
        else if ( Componente === "Camera"){
            return <Camera />
        }
        else if ( Componente === "ListarNotificacoes"){
            return <ListarNotificacoes />
        }
        else if ( Componente === "BuscarVeiculo"){
            return <BuscarVeiculo />
        }
        else if ( Componente === "Irregularidades"){
            return <Irregularidades />
        }
        else if ( Componente === "ResetPassword"){
            return <ResetPassword />
        }
        else if ( Componente === "Confirmation"){
            return <Confirmation />
        }
        else if ( Componente === "NewPassword"){
            return <NewPassword />
        }else if ( Componente === "RegistrarEstacionamentoParceiro"){
            return <RegistrarEstacionamentoParceiro />
        }
        else if ( Componente === "HistoricoVeiculo"){
            return <HistoricoVeiculo />
        }
        else if ( Componente === "RegisterPage"){
            return <RegisterPage />
        }
        else if(Componente === "LoginPage"){
            return <LoginPage />
        }
        else if ( Componente === "EscolherPerfil"){
            return <DoisPerfis />
        }
        else if(Componente === "AdicionarCreditos"){
            return <AdicionarCreditos />
        }
        else if(Componente === "AbrirCaixa"){
            return <AbrirCaixa />
        }
        else {
            return <Error />
        }
    }