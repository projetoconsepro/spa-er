import axios from 'axios';

const ImpressaoTicketRegularizacao = async (via, item) => {
  console.log(item)
    const obterHoraAtual = () => {
      const dataAtual = new Date();
      const dia = dataAtual.getDate().toString().padStart(2, '0');
      const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataAtual.getFullYear().toString();
      const hora = dataAtual.getHours().toString().padStart(2, '0');
      const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
      const segundos = dataAtual.getSeconds().toString().padStart(2, '0');
      return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos} \n Hora Notif.: ${item.data} \n `;
    };

    if (via === "PRIMEIRA"){
        const json = {
            tipo: 'REGULARIZACAO',
            dataEmissao: obterHoraAtual(),
            monitor: item.monitor,
            modelo: item.modelo,
            endereco: item.endereco,
            fabricante: item.fabricante,
            motivo: item.tipo_notificacao,
            vaga: item.vaga,
            placa: item.placa,
            valor: item.valor,
            via: via
        }

        if(window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(json));
        }
    
      } else {
        const json = {
          tipo: 'REGULARIZACAO',
          dataEmissao: item.data,
          monitor: item.monitor,
          modelo: item.modelo,
          endereco: item.endereco,
          fabricante: item.fabricante,
          motivo: item.tipo_notificacao,
          vaga: item.vaga,
          placa: item.placa,
          valor: item.valor,
          via: via
      }
      if(window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(json));
      }

    }

   

}

export default ImpressaoTicketRegularizacao;