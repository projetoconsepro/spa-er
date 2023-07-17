const ImpressaoTicketNotificacao = (monitor, vaga, placa, modelo, fabricante, motivo) => {
  const obterHoraAtual = () => {
      const dataAtual = new Date();
      const dia = dataAtual.getDate().toString().padStart(2, '0');
      const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataAtual.getFullYear().toString();
      const hora = dataAtual.getHours().toString().padStart(2, '0');
      const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
      const segundos = dataAtual.getSeconds().toString().padStart(2, '0');
      return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
    };

    const json = {
          tipo: 'NOTIFICACAO',
          dataEmissao: obterHoraAtual(),
          monitor: monitor,
          modelo: modelo,
          fabricante: fabricante,
          motivo: motivo,
          vaga: vaga[0],
          placa: placa,
          valor: '12.00',
    }
    if(window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(json));
   }

}

export default ImpressaoTicketNotificacao