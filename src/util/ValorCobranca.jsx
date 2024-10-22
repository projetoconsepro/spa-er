function calcularValorCobranca(tempo) {
  const tempoParts = tempo.split(':');
  const horas = parseInt(tempoParts[0], 10);
  const minutos = parseInt(tempoParts[1], 10);
  const tempoEmHoras = horas + (minutos / 60);
  const valor = tempoEmHoras * 2.50;
  return valor.toFixed(2);
}

export default calcularValorCobranca;