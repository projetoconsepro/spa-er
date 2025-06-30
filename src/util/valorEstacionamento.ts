import axios from "axios";

type TempoPermitido = '00:30:00' | '01:00:00' | '01:30:00' | '02:00:00';

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

export default async function calcularValorEstacionamento(tempo: TempoPermitido): Promise<number> {
  const parametros = await parametro();
  if (!parametros) return 0;

  const valores: Record<TempoPermitido, number> = {
    '00:30:00': parametros.valor30,
    '01:00:00': parametros.valor60,
    '01:30:00': parametros.valor90,
    '02:00:00': parametros.valor120,
  };

  return valores[tempo] ?? 0;
}