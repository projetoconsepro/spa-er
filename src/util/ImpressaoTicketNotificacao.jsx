import axios from 'axios';

const ImpressaoTicketNotificacao = async (via, monitor, vaga, placa, modelo, fabricante, motivo, endereco, valor) => {

  const param = async () => {
    try {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
    })
    const response = await requisicao.get("/parametros");
    const toma = response.data.data.param.estacionamento.valor_notificacao
    return toma;
    } catch(error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("perfil");
        console.log(error)
      }
  };

  console.log(via, monitor, vaga, placa, modelo, fabricante, motivo, endereco, await param())
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

    if(via === "PRIMEIRA"){
    const json = {
          tipo: 'NOTIFICACAO',
          dataEmissao: obterHoraAtual(),
          monitor: monitor,
          modelo: modelo,
          endereco: endereco,
          fabricante: fabricante,
          motivo: motivo,
          vaga: vaga[0],
          placa: placa,
          valor: await param(),
          via: '1'
    }

    console.log(json)
    if(window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(json));
   }
  } else {
    const json = {
      tipo: 'NOTIFICACAO',
      dataEmissao: obterHoraAtual(),
      monitor: monitor,
      modelo: modelo,
      endereco: endereco,
      fabricante: fabricante,
      motivo: motivo,
      vaga: vaga,
      placa: placa,
      valor: valor,
      via: '2'
    }
    console.log(json)
    if(window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(json));
   }
  }

}

export default ImpressaoTicketNotificacao