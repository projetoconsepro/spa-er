import axios from "axios";

interface EstacionamentoParametros {
  valor30: number;
  valor60: number;
  valor90: number;
  valor120: number;
}

async function parametro(): Promise<EstacionamentoParametros | null> {
  try {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
    });
    const response = await requisicao.get("/parametros");
    return response.data.data.param.estacionamento as EstacionamentoParametros;
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("perfil");
    return null;
  }
}

export default async function calcularValorEstacionamento(tempo: string): Promise<number> {
  const parametros = await parametro();
  if (!parametros) return 0;

  if (tempo === '00:30:00') {
    return parametros.valor30;
  } else if (tempo === '01:00:00') {
    return parametros.valor60;
  } else if (tempo === '01:30:00') {
    return parametros.valor90;
  } else if (tempo === '02:00:00') {
    return parametros.valor120;
  }

  return 0;
}