function extrairNumeros(string) {
    return string ? string.replace(/\D/g, "") : string;
  }
  export default extrairNumeros;