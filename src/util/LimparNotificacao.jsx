const LimparNotificacao = async () => {
  const json = {
    tipo: "LIMPAR NOTIFICACAO",
  };

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(json));
  }
};

export default LimparNotificacao;
