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
import SugestoesAdmin from '../../components/SugestoesAdmin';
import AdicionarModelo from '../../components/AdicionarModelo';
import Feriados from '../../components/Feriados';
import ListaAutoInfracao from '../../components/ListaAutoInfracao';
import PlacaIsenta from '../../components/PlacaIsenta';
import BuscarMovimentoTxId from '../../components/BuscarMovimentoTxId';

export default function Veiculos({Componente}) {
    switch(Componente) {
        case "MeusVeiculos":
            return <ListarVeiculos />;
        case "AdicionarModelo":
            return <AdicionarModelo />;
        case "RegistrarEstacionamento":
            return <RegistrarVagaCliente />;
        case "CadastrarVeiculo":
            return <RegistrarVeiculo />;
        case "SetoresAdmin":
            return <SetoresAdmin />;
        case "RegistrarVagaMonitor":
            return <RegistrarVagaMonitor />;
        case "ListarVagasMonitor":
            return <ListarVagasMonitor />;
        case "Notificacao":
            return <Notificacao />;
        case "Camera":
            return <Camera />;
        case "ListarNotificacoes":
            return <ListarNotificacoes />;
        case "BuscarVeiculo":
            return <BuscarVeiculo />;
        case "Irregularidades":
            return <Irregularidades />;
        case "ResetPassword":
            return <ResetPassword />;
        case "Confirmation":
            return <Confirmation />;
        case "NewPassword":
            return <NewPassword />;
        case "RegistrarEstacionamentoParceiro":
            return <RegistrarEstacionamentoParceiro />;
        case "HistoricoFinanceiroParceiro":
            return <HistoricoFinanceiroParceiro />;
        case "HistoricoVeiculo":
            return <HistoricoVeiculo />;
        case "RegisterPage":
            return <RegisterPage />;
        case "LoginPage":
            return <LoginPage />;
        case "EscolherPerfil":
            return <DoisPerfis />;
        case "AdicionarCreditos":
            return <AdicionarCreditos />;
        case "AbrirTurno":
            return <AbrirTurno />;
        case "FecharTurno":
            return <FecharTurno />;
        case "HistoricoFinanceiro":
            return <HistoricoFinanceiro />;
        case "Configuracoes":
            return <Configuracoes />;
        case "Regularizacao":
            return <Regularizacao />;
        case "SugestoesAdmin":
            return <SugestoesAdmin />;
        case "UsuariosAdmin":
            return <UsuariosAdmin />;
        case "VagasAdmin":
            return <VagasAdmin />;
        case "HistoricoCaixa":
            return <HistoricoCaixa />;
        case "ListarNotificacoesAdmin":
            return <ListarNotificacoesAdmin />;
        case "ListarNotificacoesAgente":
            return <ListarNotificacoesAgente />;
        case "AutoInfracao":
            return <AutoInfracao />;
        case "Dashboard":
            return <Dashboard />;
        case "VeiculosAdmin":
            return <VeiculosAdmin />;
        case "ClientesAdmin":
            return <ClientesAdmin />;
        case "OcupacaoVagasAdmin":
            return <OcupacaoVagasAdmin />;
        case "TransferirCreditoCliente":
            return <TransferirCreditoCliente />;
        case "VeiculosAgente":
            return <VeiculosAgente />;
        case "PrestacaoContas":
            return <PrestacaoContas />;
        case "ConfigurarPerfil":
            return <ConfigurarPerfil />;
        case "EditarParametroAdmin":
            return <EditarParametroAdmin />;
        case "TransferenciaParceiro":
            return <TransferenciaParceiro />;
        case "CartaoCredito":
            return <CartaoCredito />;
        case "InserirCreditos":
            return <InserirCreditos />;
        case "CameraTicketNotificacao":
            return <CameraTicketNotificacao />;
        case "Suporte":
            return <Suporte />;
        case "CameraAutoInfracao":
            return <CameraAutoInfracao />;
        case "Feriados":
            return <Feriados />;
        case "ListaAutoInfracao":
            return <ListaAutoInfracao />;
        case "PlacaIsenta":
            return <PlacaIsenta />;
        case "BuscarMovimentoTxId":
            return <BuscarMovimentoTxId />;
        default:
            return <Error />;
    }
}
