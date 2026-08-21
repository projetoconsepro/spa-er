import { useEffect, useRef, useState } from "react";
import { AiOutlineReload, AiFillPrinter, AiOutlineClose } from "react-icons/ai";
import { Button, Group, Loader, Pagination } from "@mantine/core";
import createAPI from "../services/createAPI";
import VoltarComponente from "../util/VoltarComponente";
import RelatoriosPDF from "../util/RelatoriosPDF";

const opcoesTempo = [
  { value: "", label: "Todos" },
  { value: "00:30:00", label: "30 Minutos" },
  { value: "01:00:00", label: "1 Hora" },
  { value: "02:00:00", label: "2 Horas" },
  { value: "03:00:00", label: "3 Horas" },
  { value: "04:00:00", label: "4 Horas" },
  { value: "personalizado", label: "Personalizado" },
];

const movimentoComAcentos = {
  tolerancia: "Tolerância",
  credito: "Crédito",
  notificacao: "Notificação",
  regularizacao: "Regularização",
  ajuste: "Ajuste",
  cancelamento: "Cancelamento",
  infracao: "Infração",
  saida: "Saída",
  entrada: "Entrada",
};

const paraMinutos = (tempo) => {
  if (!tempo) return 0;
  const [horas, minutos, segundos] = tempo.split(":").map(Number);
  return horas * 60 + minutos + segundos / 60;
};

const corLinha = (tempo) => {
  const minutos = paraMinutos(tempo);
  if (minutos >= 240) {
    return { corline: "#F8D7DA", cor: "#842029" }; // Crítico: 4h ou mais (vermelho)
  } else if (minutos >= 180) {
    return { corline: "#FFDFC4", cor: "#7A3800" }; // Alerta alto: 3h a 4h (laranja escuro)
  } else if (minutos >= 120) {
    return { corline: "#FFE8CC", cor: "#8A4B00" }; // Alerta: 2h a 3h (laranja)
  } else if (minutos >= 60) {
    return { corline: "#FFF3CD", cor: "#664D03" }; // Atenção: 1h a 2h (amarelo)
  } else if (minutos >= 30) {
    return { corline: "#EFF7D6", cor: "#4F6228" }; // Atenção leve: 30min a 1h (amarelo-esverdeado)
  }
  return { corline: "#D1E7DD", cor: "#0F5132" }; // Normal: menos de 30min (verde)
};

const VagasInativasAdmin = () => {
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tempoSelecionado, setTempoSelecionado] = useState("");
  const [tempoPersonalizado, setTempoPersonalizado] = useState("");
  const [setorSelecionado, setSetorSelecionado] = useState("");
  const [setoresDisponiveis, setSetoresDisponiveis] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const requisicaoAtualRef = useRef(null);

  const dataFiltrada = setorSelecionado
    ? data.filter((item) => item.setor === setorSelecionado)
    : data;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataFiltrada.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = dataFiltrada.length
    ? Math.ceil(dataFiltrada.length / itemsPerPage)
    : 1;

  const buscar = async (tempo) => {
    requisicaoAtualRef.current?.abort();
    const controller = new AbortController();
    requisicaoAtualRef.current = controller;
    setEstado2(false);
    setEstado(false);
    setMensagem("");
    setCurrentPage(1);
    const requisicao = createAPI();
    try {
      const response = await requisicao.get("/vagas/sem-movimentacao", {
        params: tempo ? { tempo } : {},
        signal: controller.signal,
      });
      const lista = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      if (lista.length > 0) {
        const newData = lista.map((item) => ({
          numero_vaga: item.numero_vaga,
          setor: item.setor,
          placa: item.placa,
          ultimo_movimento: item.ultimo_movimento,
          tempo_sem_movimentacao: item.tempo_sem_movimentacao,
          tempo_restante: item.tempo_restante,
          monitor_responsavel: item.monitor_responsavel,
        }));
        setData(newData);
      } else {
        setData([]);
        setEstado(true);
        setMensagem("Não há vagas sem movimentação para exibir");
      }
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return;
      }
      if (
        error?.response?.data?.msg === "Cabeçalho inválido!" ||
        error?.response?.data?.msg === "Token inválido!" ||
        error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("perfil");
      } else {
        setEstado(true);
        setMensagem("Ocorreu um erro ao buscar as vagas sem movimentação");
        console.log(error);
      }
    } finally {
      if (requisicaoAtualRef.current === controller) {
        setEstado2(true);
      }
    }
  };

  useEffect(() => {
    buscar("");

    const requisicao = createAPI();
    requisicao
      .get("/setores")
      .then((response) => {
        const setores = response.data?.data?.setores || [];
        const nomes = [...new Set(setores.map((item) => item.nome))]
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        setSetoresDisponiveis(nomes);
      })
      .catch(() => {});
  }, []);

  const alterarTempoSelecionado = (e) => {
    const valor = e.target.value;
    setTempoSelecionado(valor);
    if (valor === "personalizado") {
      return;
    }
    buscar(valor);
  };

  const alterarTempoPersonalizado = (e) => {
    const valor = e.target.value;
    setTempoPersonalizado(valor);
    if (!valor) {
      return;
    }
    const tempoFormatado = valor.length === 5 ? `${valor}:00` : valor;
    buscar(tempoFormatado);
  };

  const alterarSetorSelecionado = (e) => {
    setSetorSelecionado(e.target.value);
    setCurrentPage(1);
  };

  const imprimir = () => {
    const dataD = dataFiltrada.map((item) => [
      item.numero_vaga,
      item.setor,
      item.placa,
      movimentoComAcentos[item.ultimo_movimento] || item.ultimo_movimento || "...",
      item.tempo_sem_movimentacao || "...",
      item.tempo_restante || "...",
      item.monitor_responsavel || "...",
    ]);
    const nomeArquivo = "Relatório vagas sem movimentação";
    const cabecalho = [
      "Vaga",
      "Setor",
      "Placa",
      "Último Movimento",
      "Tempo sem Movimentação",
      "Tempo Restante",
      "Monitor Responsável",
    ];
    RelatoriosPDF(nomeArquivo, cabecalho, dataD);
  };

  return (
    <div className="dashboard-container mb-3">
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex flex-nowrap align-items-end gap-2">
            <div style={{ flex: "0 1 280px", minWidth: 0 }}>
              <div className="d-flex flex-column" style={{ maxWidth: "280px" }}>
                <label
                  className="form-label text-muted mb-2 text-start"
                >
                  Tempo sem movimentação maior que:
                </label>
                {tempoSelecionado === "personalizado" ? (
                  <div className="d-flex align-items-center gap-1">
                    <input
                      type="time"
                      step="1"
                      autoFocus
                      className="form-control"
                      value={tempoPersonalizado}
                      onChange={alterarTempoPersonalizado}
                    />
                    <button
                      type="button"
                      className="btn btn-sm p-1"
                      title="Escolher um período pré-definido"
                      onClick={() => {
                        setTempoSelecionado("");
                        setTempoPersonalizado("");
                        buscar("");
                      }}
                    >
                      <AiOutlineClose color="#000000" size={16} />
                    </button>
                  </div>
                ) : (
                  <select
                    id="filtroTempoSemMovimentacao"
                    className="form-select"
                    value={tempoSelecionado}
                    onChange={alterarTempoSelecionado}
                  >
                    {opcoesTempo.map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div style={{ flex: "0 1 280px", minWidth: 0 }}>
              <div className="d-flex flex-column" style={{ maxWidth: "280px" }}>
                <label
                  className="form-label text-muted mb-2 text-start"
                >
                  Setor:
                </label>
                <select
                  id="filtroSetor"
                  className="form-select"
                  value={setorSelecionado}
                  onChange={alterarSetorSelecionado}
                >
                  <option value="">Todos</option>
                  {setoresDisponiveis.map((setor) => (
                    <option key={setor} value={setor}>
                      {setor}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 ms-auto" style={{ flexShrink: 0 }}>
              <button
                className="btn3 botao p-0 m-0"
                type="button"
                onClick={imprimir}
                disabled={dataFiltrada.length === 0}
                style={{
                  width: "42px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AiFillPrinter size={21} />
              </button>
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "blue", deg: 60 }}
                radius="md"
                size="sm"
                onClick={() => buscar(tempoSelecionado)}
                px="xs"
                style={{ width: "42px", height: "38px", flexShrink: 0 }}
              >
                <AiOutlineReload color="white" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 mb-4">
              {estado2 ? (
                <div className="card border-0 shadow">
                  {data.length > 0 && dataFiltrada.length === 0 ? (
                    <div className="alert alert-warning m-3" role="alert">
                      Não há vagas sem movimentação para o setor selecionado
                      nesse período.
                    </div>
                  ) : (
                    <div className="table-responsive" style={{ overflowX: "auto" }}>
                      <table
                        className="table align-items-center table-flush"
                        style={{ minWidth: "820px" }}
                      >
                        <thead className="thead-light">
                          <tr>
                            <th className="border-bottom" id="tabelaUsuarios" scope="col" style={{ whiteSpace: "nowrap", width: "8%" }}>
                              Vaga
                            </th>
                            <th className="border-bottom" id="tabelaUsuarios2" scope="col" style={{ whiteSpace: "nowrap", width: "8%"  }}>
                              Setor
                            </th>
                            <th className="border-bottom" id="tabelaUsuarios" scope="col" style={{ whiteSpace: "nowrap" }}>
                              Placa
                            </th>
                            <th className="border-bottom" id="tabelaUsuarios2" scope="col" style={{ whiteSpace: "nowrap" }}>
                              Último Movimento
                            </th>
                            <th className="border-bottom" id="tabelaUsuarios" scope="col" style={{ whiteSpace: "nowrap" }}>
                              Tempo sem Movimentação
                            </th>
                            <th className="border-bottom" id="tabelaUsuarios2" scope="col" style={{ whiteSpace: "nowrap" }}>
                              Tempo Restante
                            </th>
                            <th className="border-bottom" id="tabelaUsuarios" scope="col" style={{ whiteSpace: "nowrap" }}>
                              Monitor Responsável
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((item, index) => {
                            const { corline, cor } = corLinha(
                              item.tempo_sem_movimentacao
                            );
                            const celula = { color: cor, wordBreak: "break-word" };
                            return (
                              <tr key={index} style={{ backgroundColor: corline }}>
                                <td style={celula}>{item.numero_vaga}</td>
                                <td style={celula} id="tabelaUsuarios2">
                                  {item.setor}
                                </td>
                                <td style={celula}>{item.placa}</td>
                                <td style={celula} id="tabelaUsuarios2">
                                  {movimentoComAcentos[item.ultimo_movimento] ||
                                    item.ultimo_movimento ||
                                    "..."}
                                </td>
                                <td style={celula}>
                                  {item.tempo_sem_movimentacao || "..."}
                                </td>
                                <td style={celula} id="tabelaUsuarios2">
                                  {item.tempo_restante || "..."}
                                </td>
                                <td style={celula}>
                                  {item.monitor_responsavel || "..."}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div
                    className="alert alert-danger mt-4 mx-3"
                    role="alert"
                    style={{ display: estado ? "block" : "none" }}
                  >
                    {mensagem}
                  </div>
                </div>
              ) : (
                <div className="col-12 text-center mt-4 mb-4">
                  <Loader />
                </div>
              )}
            </div>
          </div>
        </div>
        {dataFiltrada.length > itemsPerPage && (
          <Group position="center" mb="md">
            <Pagination
              value={currentPage}
              size="sm"
              total={totalPages}
              onChange={setCurrentPage}
            />
          </Group>
        )}
      </div>
      <VoltarComponente />
    </div>
  );
};

export default VagasInativasAdmin;
