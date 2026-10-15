import React, { useMemo, useState } from "react";
import { Badge, Tabs } from "@mantine/core";
import { AiFillPrinter } from "react-icons/ai";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Swal from "sweetalert2";
import createAPI from "../services/createAPI";
import ValidarRequisicao from "../util/ValidarRequisicao";
import Filtro from "../util/Filtro";
import CarroLoading from "./Carregamento";
import { FormatDateIsoBr } from "../util/formatDate";
import RelatorioSetorPDF, {
  descreverPeriodo,
  formatarMoeda,
  formatarQuantidade,
} from "../util/RelatorioSetorPDF";

const estiloCabecalhoOrdenavel = { cursor: "pointer", whiteSpace: "nowrap" };

const ORDENACAO_INICIAL_DIAS = { campo: "data", direcao: "asc" };
const ORDENACAO_INICIAL_VAGAS = { campo: "valor", direcao: "desc" };

const compararCampo = (a, b, campo) =>
  typeof a[campo] === "string" ? a[campo].localeCompare(b[campo]) : a[campo] - b[campo];

const ordenarLista = (lista, { campo, direcao }) => {
  const sinal = direcao === "asc" ? 1 : -1;
  return lista
    .map((item, indice) => ({ ...item, posicao: indice + 1 }))
    .sort((a, b) => sinal * compararCampo(a, b, campo) || a.posicao - b.posicao);
};

const proximaOrdenacao = (atual, campo) =>
  atual.campo === campo
    ? { campo, direcao: atual.direcao === "asc" ? "desc" : "asc" }
    : { campo, direcao: campo === "valor" ? "desc" : "asc" };

const indicadorOrdenacao = (ordenacao, campo) => {
  const estilo = { marginLeft: 4, marginBottom: 2 };
  if (ordenacao.campo !== campo) return <FaSort style={estilo} />;
  return ordenacao.direcao === "asc" ? <FaSortUp style={estilo} /> : <FaSortDown style={estilo} />;
};

const descreverVagas = ({ quantidadeVagas, quantidadeVagasInativas }) => {
  const total = formatarQuantidade(quantidadeVagas);
  if (quantidadeVagasInativas === 0) return total;
  const sufixo = quantidadeVagasInativas === 1 ? "inativa" : "inativas";
  return `${total} (${formatarQuantidade(quantidadeVagasInativas)} ${sufixo})`;
};

const avisar = (texto) =>
  Swal.fire({ title: "Atenção!", text: texto, icon: "warning", confirmButtonText: "Ok" });

const RelatorioSetorAdmin = () => {
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [relatorio, setRelatorio] = useState(null);
  const [aba, setAba] = useState("dias");
  const [ordenacaoDias, setOrdenacaoDias] = useState(ORDENACAO_INICIAL_DIAS);
  const [ordenacaoVagas, setOrdenacaoVagas] = useState(ORDENACAO_INICIAL_VAGAS);

  const diasOrdenados = useMemo(
    () => (relatorio ? ordenarLista(relatorio.dias, ordenacaoDias) : []),
    [relatorio, ordenacaoDias]
  );

  const vagasOrdenadas = useMemo(
    () => (relatorio ? ordenarLista(relatorio.vagas, ordenacaoVagas) : []),
    [relatorio, ordenacaoVagas]
  );

  const handleConsulta = (consulta) => {
    setEstadoLoading(true);
    createAPI()
      .get(`/setores/relatorio?query=${btoa(consulta)}`)
      .then((res) => {
        setRelatorio(res.data.data);
        setOrdenacaoDias(ORDENACAO_INICIAL_DIAS);
        setOrdenacaoVagas(ORDENACAO_INICIAL_VAGAS);
        setAba("dias");
      })
      .catch((err) => {
        ValidarRequisicao(err);
        if (err?.response?.status === 400) {
          avisar(err.response.data?.msg?.msg);
          return;
        }
        Swal.fire({
          title: "Erro!",
          text: err?.response?.data?.msg?.msg || "Não foi possível gerar o relatório do setor.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      })
      .finally(() => setEstadoLoading(false));
  };

  const imprimir = () => {
    RelatorioSetorPDF({ ...relatorio, dias: diasOrdenados, vagas: vagasOrdenadas }, aba);
  };

  return (
    <div className="dashboard-container mb-3 mx-auto" style={{ maxWidth: "1050px" }}>
      <p className="me-3 text-start fs-4 fw-bold">Relatório por Setor</p>
      <div className="row g-2 mb-3">
        <div className="col-9 col-md-10">
          <Filtro nome={"RelatorioSetorAdmin"} onConsultaSelected={handleConsulta} onLoading={estadoLoading} />
        </div>
        <div className="col-3 col-md-2">
          {relatorio ? (
            <button className="btn3 botao p-0 m-0 w-100 h-100" type="button" onClick={imprimir}>
              <AiFillPrinter size={21} />
            </button>
          ) : (
            <button className="btn2 botao p-0 m-0 w-100 h-100" disabled type="button">
              <AiFillPrinter size={21} />
            </button>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 mb-4">
              {relatorio ? (
                <div className="text-start mb-3">
                  <div className="d-flex flex-wrap align-items-baseline mb-2" style={{ columnGap: "0.75rem" }}>
                    <span className="fs-5 fw-bold">Setor {relatorio.setor.nome}</span>
                    <span className="text-muted">Período: {descreverPeriodo(relatorio.periodo)}</span>
                  </div>
                  <div className="d-flex flex-wrap bg-white rounded shadow-sm py-3" style={{ rowGap: "0.75rem" }}>
                    {[
                      { rotulo: "Total arrecadado", valor: formatarMoeda(relatorio.resumo.valorTotal) },
                      { rotulo: "Vagas", valor: descreverVagas(relatorio.resumo) },
                      { rotulo: "Créditos", valor: formatarQuantidade(relatorio.resumo.quantidadeCreditos) },
                      { rotulo: "Regularizações", valor: formatarQuantidade(relatorio.resumo.quantidadeRegularizacoes) },
                      { rotulo: "Notificações", valor: formatarQuantidade(relatorio.resumo.quantidadeNotificacoes) },
                    ].map(({ rotulo, valor }, indice, itens) => (
                      <div
                        key={rotulo}
                        className={`flex-fill text-center px-3${indice < itens.length - 1 ? " border-end" : ""}`}
                        style={{ flexBasis: 0, minWidth: "9rem" }}
                      >
                        <div className="small text-muted">{rotulo}</div>
                        <div className="fw-bold">{valor}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="card border-0 shadow">
                {estadoLoading ? (
                  <div className="text-center py-4">
                    <CarroLoading />
                  </div>
                ) : relatorio ? (
                  <Tabs value={aba} onTabChange={setAba}>
                    <Tabs.List>
                      <Tabs.Tab value="dias">Por dia</Tabs.Tab>
                      <Tabs.Tab value="vagas">Por vaga</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="dias">
                      <div className="table-responsive">
                        <table className="table align-items-center table-flush">
                          <thead className="thead-light">
                            <tr>
                              <th className="border-bottom" id="tabelaUsuarios" scope="col" style={estiloCabecalhoOrdenavel} onClick={() => setOrdenacaoDias((atual) => proximaOrdenacao(atual, "data"))}>
                                Data{indicadorOrdenacao(ordenacaoDias, "data")}
                              </th>
                              <th className="border-bottom" id="tabelaUsuarios" scope="col" style={estiloCabecalhoOrdenavel} onClick={() => setOrdenacaoDias((atual) => proximaOrdenacao(atual, "valor"))}>
                                Valor{indicadorOrdenacao(ordenacaoDias, "valor")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {diasOrdenados.map((dia) => (
                              <tr key={dia.data}>
                                <td id="tabelaUsuarios">{FormatDateIsoBr(dia.data)}</td>
                                <td id="tabelaUsuarios">{formatarMoeda(dia.valor)}</td>
                              </tr>
                            ))}
                            <tr>
                              <td id="tabelaUsuarios" className="fw-bold">Total</td>
                              <td id="tabelaUsuarios" className="fw-bold">{formatarMoeda(relatorio.resumo.valorTotal)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="vagas">
                      {relatorio.vagas.length === 0 ? (
                        <div className="alert alert-danger mt-4 mx-3" role="alert">
                          Nenhuma vaga cadastrada neste setor.
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table align-items-center table-flush">
                            <thead className="thead-light">
                              <tr>
                                <th className="border-bottom" id="tabelaUsuarios" scope="col" style={estiloCabecalhoOrdenavel} onClick={() => setOrdenacaoVagas((atual) => proximaOrdenacao(atual, "numero"))}>
                                  Vaga{indicadorOrdenacao(ordenacaoVagas, "numero")}
                                </th>
                                <th className="border-bottom" id="tabelaUsuarios2" scope="col">Localização</th>
                                <th className="border-bottom" id="tabelaUsuarios" scope="col" style={estiloCabecalhoOrdenavel} onClick={() => setOrdenacaoVagas((atual) => proximaOrdenacao(atual, "valor"))}>
                                  Valor{indicadorOrdenacao(ordenacaoVagas, "valor")}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {vagasOrdenadas.map((vaga) => (
                                <tr key={vaga.id_vaga}>
                                  <td id="tabelaUsuarios">
                                    {vaga.numero}
                                    {!vaga.ativa ? (
                                      <Badge color="gray" size="xs" ml={6}>
                                        inativa
                                      </Badge>
                                    ) : null}
                                  </td>
                                  <td id="tabelaUsuarios2">{vaga.local?.trim() || "Não informado"}</td>
                                  <td id="tabelaUsuarios">{formatarMoeda(vaga.valor)}</td>
                                </tr>
                              ))}
                              <tr>
                                <td id="tabelaUsuarios" className="fw-bold">Total</td>
                                <td id="tabelaUsuarios2"></td>
                                <td id="tabelaUsuarios" className="fw-bold">{formatarMoeda(relatorio.resumo.valorTotal)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Tabs.Panel>
                  </Tabs>
                ) : (
                  <div className="text-center py-4">
                    Filtre por setor e data ou período para gerar o relatório.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioSetorAdmin;
