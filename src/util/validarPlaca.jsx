function validarPlaca(placa) {
    placa = placa.replace(/\s+/g, '');
    const regexPlacaAntiga = /^[a-zA-Z]{3}\d{4}$/;
    const regexPlacaNova = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

    if (regexPlacaAntiga.test(placa) || regexPlacaNova.test(placa)) {
      return true;
    } else {
      return false;
    }
  }

export default validarPlaca;