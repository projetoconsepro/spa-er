const EnviarNotificacao = async (tempo, idVeiculo, placa) => {

    console.log(tempo, idVeiculo, placa)

        const json = {
            tipo: "ENVIAR NOTIFICACAO",
            tempoDebitado: tempo,
            idVeiculo: idVeiculo,
            placa: placa,
        }

        console.log(json)
        if(window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(json));
    }
        

   

}

export default EnviarNotificacao;