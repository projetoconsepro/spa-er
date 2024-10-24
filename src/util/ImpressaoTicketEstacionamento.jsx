import axios from 'axios'

const ImpressaoTicketEstacionamento = async (via, tempoChegada, tempo, monitor, vaga, placa, metodo, tempoValor, notificacao) => {
        const obterHoraAtual = () => {
            const dataAtual = new Date();
            const hora = dataAtual.getHours().toString().padStart(2, '0');
            const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
            const segundos = dataAtual.getSeconds().toString().padStart(2, '0');
            return `${hora}:${minutos}:${segundos}`;
          };
        
          const calcularValidade = (horaInicio, duracao) => {
            const [horas, minutos, segundos] = duracao.split(':').map(Number);
            const dataInicio = new Date(`2000-01-01T${horaInicio}`);
            const dataValidade = new Date(dataInicio.getTime() + (horas * 3600000) + (minutos * 60000) + (segundos * 1000));
            const horaValidade = dataValidade.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            return horaValidade;
          };

          const duracao = tempo;
          let horaValidade = calcularValidade(tempoChegada, duracao); 
          
          const tipoEstacionamento = () => {
            let tipo2 = tempo
            if(tempo === '00:10:00'){
                tipo2 = 'TOLERANCIA'
            } else {
                tipo2 = 'COMPRA DE PERIODOS'
            }
            return tipo2
        }

        const forma = () => {
          let forma2 = metodo
          if(tempo === '00:10:00'){
            forma2 = 'TOLERANCIA'
          }
          else {
            forma2 = metodo
          }
          return forma2
        }

        const valorTicket = async () => {
            try {
                const requisicao = axios.create({
                  baseURL: process.env.REACT_APP_HOST,
                })
                const response = await requisicao.get("/parametros");
                  let valorCobrar;
                  let valorCobranca = await response.data.data.param.estacionamento.valorHora
                  if (tempoValor === "02:00:00") {
                    valorCobrar = valorCobranca * 2
                  } else if (tempoValor === "01:00:00") {
                    valorCobrar = valorCobranca
                  } else if (tempoValor === "01:30:00"){
                    valorCobrar = valorCobranca * 1.5
                  }
                  else if (tempoValor === "00:30:00") {
                    valorCobrar = valorCobranca / 2
                  } else if (tempoValor === "00:10:00") {
                    valorCobrar = valorCobranca * 0
                  } else {
                    valorCobrar = valorCobranca * 0
                  }
                  return valorCobrar;

                } catch(error) {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  localStorage.removeItem("perfil");
                };
        }

        const getDataDeHoje = () => {
            const data = new Date();
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }

          if(via === 'PRIMEIRA'){
          const json = {
                via: via,
                tipo: tipoEstacionamento(),
                dataHoje: getDataDeHoje(),
                horaInicio: tempoChegada,
                horaValidade: horaValidade,
                monitor: monitor,
                metodo: forma(),
                vaga: metodo === 'PIX' ? vaga : vaga[0],
                placa: placa,
                valor: await valorTicket(),
                notificacaoPendente: notificacao
          }
          
          if(window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(json));
          }

        } else {
            const json = {
                via: via,
                tipo: 'EXTRATO DE PLACA',
                dataHoje: getDataDeHoje(),
                horaInicio: tempoChegada,
                horaValidade: horaValidade,
                monitor: monitor,
                metodo: forma(),
                vaga: vaga,
                placa: placa,
                valor: await valorTicket(),
                notificacaoPendente: notificacao
            } 

          if(window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(json));
         }
        }
}

export default ImpressaoTicketEstacionamento
