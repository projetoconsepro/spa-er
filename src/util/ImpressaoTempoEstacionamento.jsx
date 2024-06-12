import createAPI from "../services/createAPI";
import ImpressaoTicketEstacionamento from "./ImpressaoTicketEstacionamento";
import { voltar } from "./VoltarComponente";

const ImpressaoTempoEstacionamento = async (placa, tempo, vaga, valorTempo) => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const obterHoraAtual = () => {
        const dataAtual = new Date();
        const dia = dataAtual.getDate().toString().padStart(2, "0");
        const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
        const ano = dataAtual.getFullYear().toString();
        const hora = dataAtual.getHours().toString().padStart(2, "0");
        const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
        const segundos = dataAtual.getSeconds().toString().padStart(2, "0");
        
        const dataCompleta = `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
        const apenasHora = `${hora}:${minutos}:${segundos}`;

        return { dataCompleta, apenasHora };
    };

    const convertToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const convertToHHMMSS = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const somaTempo = (t1, t2) => {
        const totalSeconds = convertToSeconds(t1) + convertToSeconds(t2);
        return convertToHHMMSS(totalSeconds);
    }; 
    const requisicao = createAPI();

    try {
        const response = await requisicao.get(`/veiculo/${placa}`);
        const { data } = response;

        if (data.msg.resultado === false && data.msg.msg !== "Dados encontrados") {
            console.log(data.msg.msg, "Dados não encontrados");
        } else {
            const link = data.data.map((item) => ({
                placa: item.placa ?? "Não informado",
                vaga: vaga ?? "Não informado",
                numero_notificacoes_pendentes: item.numero_notificacoes_pendentes ?? "Não informado",
                estacionado: item.estacionado[0]?.estacionado ?? "Não informado",
                tempo: tempo ?? item.estacionado[0]?.tempo ?? "Não informado",
                valor: valorTempo,
                chegada: item.estacionado[0]?.estacionado === "S" ? item.estacionado[0]?.chegada : obterHoraAtual().apenasHora,
                temporestante: item.estacionado[0]?.chegada && item.estacionado[0]?.tempo !== "00:00:00"
                    ? somaTempo(tempo, item.estacionado[0].tempo)
                    : tempo,
            }));
            const impressao = link[0];
            if (impressao) {
                ImpressaoTicketEstacionamento(
                    "PRIMEIRA",
                    impressao.chegada,
                    impressao.temporestante,
                    user2.id_usuario,
                    impressao.vaga,
                    impressao.placa,
                    "PIX",
                    impressao.valor,
                    impressao.numero_notificacoes_pendentes,
                );
                voltar();
            }
        }
    } catch (error) {
        console.error("Erro ao chamar a API:", error);
        if (
            error?.response?.data?.msg === "Cabeçalho inválido!" ||
            error?.response?.data?.msg === "Token inválido!" ||
            error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"
        ) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("perfil");
        } else {
            console.error(error);
        }
    }
};

export default ImpressaoTempoEstacionamento;