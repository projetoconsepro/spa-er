import axios from 'axios'

const ImpressaoTicketEstacionamento = (tempo, monitor, vaga, placa, valor) => {
        console.log(tempo, monitor, vaga, placa, valor)
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
        
          const horaInicio = obterHoraAtual();
          const duracao = tempo;
          const horaValidade = calcularValidade(horaInicio, duracao);
          console.log('OLHAA SO EM', horaInicio, horaValidade)
          
          const tipoEstacionamento = (tempo) => {
            let tipo2 = tempo
            if(tempo === '00:10:00'){
                tipo2 = 'TOLERANCIA'
            } else {
                tipo2 = 'COMPRA DE PERIODOS'
            }
            console.log(tipo2)
            return tipo2
        }

        const valorTicket = () => {
            let valor2 = tempo
            if(tempo === '00:10:00'){
                valor2 = '0,00'
            } else if (tempo === '00:30:00'){
                valor2 = '1,00'
            } else if (tempo === '01:00:00'){
                valor2 = '2,00'
            } else if (tempo === '01:30:00'){
                valor2 = '3,00'
            } else if (tempo === '02:00:00'){
                valor2 = '4,00'
            }
            console.log(valor2)
            return valor2
        }

        const getDataDeHoje = () => {
            const data = new Date();
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
          
            return `${dia}/${mes}/${ano}`;
          }

          const json = {
                tipo: tipoEstacionamento(),
                dataHoje: getDataDeHoje(),
                horaInicio: horaInicio,
                horaValidade: horaValidade,
                monitor: monitor,
                vaga: vaga[0],
                placa: placa,
                valor: valorTicket(),
          }

          if(window.ReactNativeWebView) {     
            window.ReactNativeWebView.postMessage(JSON.stringify(json));
         }

}

export default ImpressaoTicketEstacionamento