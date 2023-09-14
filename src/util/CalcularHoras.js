const CalcularHoras = (tempoRestante) => {
const dataAtual = new Date();
const hora = dataAtual.getHours().toString().padStart(2, "0");
const minutos = dataAtual
    .getMinutes()
    .toString()
    .padStart(2, "0");
const segundos = dataAtual
    .getSeconds()
    .toString()
    .padStart(2, "0");
const horaAtual = `${hora}:${minutos}:${segundos}`;
function converterParaSegundos(tempo) {
    const [horas2, minutos2, segundos2] = tempo
      .split(":")
      .map(Number);
    return horas2 * 3600 + minutos2 * 60 + segundos2;
  }

  const segundosHoraAtual = converterParaSegundos(horaAtual);
  const segundosTempoRestante = converterParaSegundos(tempoRestante);
  const diffSegundos = segundosTempoRestante - segundosHoraAtual;
  const diffMinutos = diffSegundos / 60;
  let json;
  if (tempoRestante < horaAtual) {
    json = {
        corline: "#F8D7DA",
        cor: "#842029",
    }
  } else if (diffMinutos <= 10) {
    json = {
        corline: "#FFF3CD",
        cor: "#664D03",
    }
  } else if (diffMinutos >= 10) {
    json = {
        corline: "#D1E7DD",
        cor: "#0F5132",
    }
  } else {
    json = {
    corline: "#fff",
    cor: "#000",
    }
  }
  console.log('json', json, tempoRestante, horaAtual)
  return json;
}

export default CalcularHoras;