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
import FecharTurno from '../../components/FecharTurno';
import AbrirTurno from '../../components/AbrirTurno';
import HistoricoFinanceiro from '../../components/HistoricoFinanceiro';
import HistoricoFinanceiroParceiro from '../../components/HistoricoFinanceiroParceiro';
import Configuracoes from '../../components/Configuracoes';
import Regularizacao from '../../components/Regularizacao';
import UsuariosAdmin from '../../components/UsuariosAdmin';
import SetoresAdmin from '../../components/SetoresAdmin';
import VagasAdmin from '../../components/VagasAdmin';
import HistoricoCaixa from '../../components/HistoricoCaixa';
import ListarNotificacoesAdmin from '../../components/ListarNotificacoesAdmin';
import ListarNotificacoesAgente from '../../components/ListarNotificacoesAgente';
import AutoInfracao from '../../components/AutoInfracao';
import Dashboard from '../../components/Dashboard/Dashboard';
import VeiculosAdmin from '../../components/VeiculosAdmin';
import ClientesAdmin from '../../components/ClientesAdmin';
import OcupacaoVagasAdmin from '../../components/OcupacaoVagasAdmin';
import TransferirCreditoCliente from '../../components/TransferirCreditoCliente';
import MovimentosAdmin from '../../components/MovimentosAdmin';
import VeiculosAgente from '../../components/VeiculosAgente';
import PrestacaoContas from '../../components/PrestacaoContas';
import ConfigurarPerfil from '../../components/ConfigurarPerfil';
import EditarParametroAdmin from '../../components/EditarParametroAdmin';
import TransferenciaParceiro from '../../components/TransferenciaParceiro';
import CartaoCredito from '../../components/CartaoCredito';
import InserirCreditos from '../../components/InserirCreditos';
import CameraTicketNotificacao from '../../components/CameraTicketNotificacao';
import Suporte from '../../components/Suporte';
import CameraAutoInfracao from '../../components/CameraAutoInfracao';

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
        else if (Componente === "SetoresAdmin"){
            return <SetoresAdmin />
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
        else if ( Componente === "HistoricoFinanceiroParceiro"){
            return <HistoricoFinanceiroParceiro />
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
        else if(Componente === "AbrirTurno"){
            return <AbrirTurno />
        }
        else if(Componente === "FecharTurno"){
            return <FecharTurno />
        }
        else if(Componente === "HistoricoFinanceiro"){
            return <HistoricoFinanceiro />
        }
        else if(Componente === "Configuracoes"){
            return <Configuracoes />
        }
        else if(Componente === "Regularizacao"){
            return <Regularizacao />
        }
        else if(Componente === "UsuariosAdmin"){
            return <UsuariosAdmin />
        }
        else if (Componente === "VagasAdmin"){
            return <VagasAdmin />
        }
        else if(Componente === "HistoricoCaixa"){
            return <HistoricoCaixa />
        }
        else if(Componente === "ListarNotificacoesAdmin"){
            return <ListarNotificacoesAdmin />
        }
        else if(Componente === "ListarNotificacoesAgente"){
            return <ListarNotificacoesAgente />
        }
        else if(Componente === "AutoInfracao"){
            return <AutoInfracao />
        }
        else if(Componente === "Dashboard"){
            return <Dashboard />
        }
        else if(Componente === "VeiculosAdmin"){
            return <VeiculosAdmin />
        }
        else if(Componente === "ClientesAdmin"){
            return <ClientesAdmin />
        }
        else if(Componente === "OcupacaoVagasAdmin"){
            return <OcupacaoVagasAdmin />
        }
        else if(Componente === "TransferirCreditoCliente"){
            return <TransferirCreditoCliente />
        }
        else if(Componente === "MovimentosAdmin"){
            return <MovimentosAdmin />
        }
        else if(Componente === "VeiculosAgente"){
            return <VeiculosAgente />
        }
        else if(Componente === "PrestacaoContas"){
            return <PrestacaoContas />
        }
        else if(Componente === "ConfigurarPerfil"){
            return <ConfigurarPerfil />
        }
        else if(Componente === "EditarParametroAdmin"){
            return <EditarParametroAdmin />
        }
        else if (Componente === "TransferenciaParceiro"){
            return <TransferenciaParceiro />
        }
        else if (Componente === "CartaoCredito"){
            return <CartaoCredito />
        }
        else if (Componente === "InserirCreditos"){
            return <InserirCreditos />
        }
        else if (Componente === "CameraTicketNotificacao"){
            return <CameraTicketNotificacao />
        }
        else if (Componente === "Suporte"){
            return <Suporte />
        }
        else if (Componente === "CameraAutoInfracao"){
            return <CameraAutoInfracao />
        }
        else {
            return <Error />
        }
    }