const isComputador = () => {
  if (window.ReactNativeWebView) return false;

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex =
    /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;

  return !mobileRegex.test(userAgent);
};

export default isComputador;
