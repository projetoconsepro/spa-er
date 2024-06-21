const ConfigImpressora = async (option) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(option);
    }
  };
  
export default ConfigImpressora;
  