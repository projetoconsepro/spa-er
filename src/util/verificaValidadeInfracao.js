import createAPI from "../services/createAPI";

async function verificaValidadeInfracao(data) {
  const dataFornecida = new Date(data);
  const dataAtual = new Date();

  let diasUteis = 0;

  const dataTemp = new Date(dataFornecida);
  dataTemp.setDate(dataTemp.getDate() + 1);
  dataTemp.setHours(0, 0, 0, 0);

  while (dataTemp <= dataAtual) {
    const diaSemana = dataTemp.getDay();

    if (diaSemana !== 0 && diaSemana !== 6) {
      const requisicao = createAPI();
      const response = await requisicao.post("turno/verifica-feriado", {
        data: dataTemp, 
      });

      const isFeriado = response.data.isFeriado;
      console.log(isFeriado);
      if (!isFeriado) {
        diasUteis++;
      }
    }

    if (diasUteis >= 2) {
      const finalDoSegundoDiaUtil = new Date(dataTemp);
      finalDoSegundoDiaUtil.setHours(23, 59, 59, 999);
      if (dataAtual > finalDoSegundoDiaUtil) {
        return false;
      }
    }

    dataTemp.setDate(dataTemp.getDate() + 1);
    dataTemp.setHours(0, 0, 0, 0);
  }

  return true;
}

export { verificaValidadeInfracao };