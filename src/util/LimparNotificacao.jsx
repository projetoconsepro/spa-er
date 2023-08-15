const LimparNotificacao = async () => {

    const json = {
        tipo: "LIMPAR NOTIFICACAO",
    }

    console.log(json)
    if(window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(json));
}
    



}

export default LimparNotificacao;