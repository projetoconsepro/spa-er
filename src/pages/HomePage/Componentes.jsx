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
import ListagemMovimentoVeiculo from '../../components/ListagemMovimentoVeiculo';

const componentesMap = {
    MeusVeiculos: <ListarVeiculos />,
    AdicionarModelo: <AdicionarModelo />,
    RegistrarEstacionamento: <RegistrarVagaCliente />,
    CadastrarVeiculo: <RegistrarVeiculo />,
    SetoresAdmin: <SetoresAdmin />,
    RegistrarVagaMonitor: <RegistrarVagaMonitor />,
    ListarVagasMonitor: <ListarVagasMonitor />,
    Notificacao: <Notificacao />,
    Camera: <Camera />,
    ListarNotificacoes: <ListarNotificacoes />,
    BuscarVeiculo: <BuscarVeiculo />,
    Irregularidades: <Irregularidades />,
    ResetPassword: <ResetPassword />,
    Confirmation: <Confirmation />,
    NewPassword: <NewPassword />,
    RegistrarEstacionamentoParceiro: <RegistrarEstacionamentoParceiro />,
    HistoricoFinanceiroParceiro: <HistoricoFinanceiroParceiro />,
    HistoricoVeiculo: <HistoricoVeiculo />,
    RegisterPage: <RegisterPage />,
    LoginPage: <LoginPage />,
    EscolherPerfil: <DoisPerfis />,
    AdicionarCreditos: <AdicionarCreditos />,
    AbrirTurno: <AbrirTurno />,
    HistoricoFinanceiro: <HistoricoFinanceiro />,
    Configuracoes: <Configuracoes />,
    Regularizacao: <Regularizacao />,
    UsuariosAdmin: <UsuariosAdmin />,
    VagasAdmin: <VagasAdmin />,
    HistoricoCaixa: <HistoricoCaixa />,
    ListarNotificacoesAdmin: <ListarNotificacoesAdmin />,
    ListarNotificacoesAgente: <ListarNotificacoesAgente />,
    AutoInfracao: <AutoInfracao />,
    Dashboard: <Dashboard />,
    VeiculosAdmin: <VeiculosAdmin />,
    ClientesAdmin: <ClientesAdmin />,
    OcupacaoVagasAdmin: <OcupacaoVagasAdmin />,
    TransferirCreditoCliente: <TransferirCreditoCliente />,
    VeiculosAgente: <VeiculosAgente />,
    PrestacaoContas: <PrestacaoContas />,
    ConfigurarPerfil: <ConfigurarPerfil />,
    EditarParametroAdmin: <EditarParametroAdmin />,
    TransferenciaParceiro: <TransferenciaParceiro />,
    CartaoCredito: <CartaoCredito />,
    InserirCreditos: <InserirCreditos />,
    CameraTicketNotificacao: <CameraTicketNotificacao />,
    Suporte: <Suporte />,
    CameraAutoInfracao: <CameraAutoInfracao />,
    Feriados: <Feriados />,
    ListaAutoInfracao: <ListaAutoInfracao />,
    PlacaIsenta: <PlacaIsenta />,
    BuscarMovimentoTxId: <BuscarMovimentoTxId />,
    SugestoesAdmin: <SugestoesAdmin />,
    ListagemMovimentoVeiculo: <ListagemMovimentoVeiculo />,
    Error: <Error />,
};

export default function Veiculos({Componente}) {

    const ComponenteSelecionado = componentesMap[Componente];

    return ComponenteSelecionado || <Error />;

};
