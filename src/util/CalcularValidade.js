const calcularValidade = (horaInicio, duracao) => {
  if (horaInicio === undefined && duracao === undefined) {
    return "";
  }

    const [horas, minutos, segundos] = duracao.split(":").map(Number);
    const dataInicio = new Date(`2000-01-01T${horaInicio}`);
    const dataValidade = new Date(
      dataInicio.getTime() + horas * 3600000 + minutos * 60000 + segundos * 1000
    );
    const horaValidade = dataValidade.toLocaleTimeString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    return horaValidade;
  };

export default calcularValidade;