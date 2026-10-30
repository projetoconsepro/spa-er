import React, { useEffect, useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { Badge, Button, Group, Loader, Pagination, Tabs } from "@mantine/core";
import createAPI from "../services/createAPI";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import {
  ROTULO_STATUS,
  codificarFiltro,
  descreverCartao,
  formatarValor,
  tratarErroRequisicao,
} from "../util/recargaAutomatica";

const corStatus = {
  APROVADO: "green",
  RECUSADO: "red",
  PROCESSANDO: "yellow",
};

const rotaPorAba = {
  cobrancas: "/cartao/recarga-automatica/historico",
  alteracoes: "/cartao/recarga-automatica/alteracoes",
};

const ListarLogsRecargaAutomatica = () => {
  const [aba, setAba] = useState("cobrancas");
  const [carregado, setCarregado] = useState(false);
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [data, setData] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtroAtual, setFiltroAtual] = useState("");
  const [recarregar, setRecarregar] = useState(0);

  useEffect(() => {
    let descartada = false;
    const listar = async () => {
      setCarregado(false);
      setMensagem("");
      setData([]);
      const requisicao = createAPI();
      try {
        const params = { page };
        if (filtroAtual) {
          params.query = codificarFiltro(filtroAtual);
        }
        const response = await requisicao.get(rotaPorAba[aba], { params });
        if (descartada) {
          return;
        }
        if (response.data.msg.resultado && response.data.data.length > 0) {
          setData(response.data.data);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setData([]);
          setTotalPages(1);
          setMensagem(response.data.msg.resultado ? "Não há registros para exibir" : response.data.msg.msg);
        }
      } catch (error) {
        if (!descartada) {
          tratarErroRequisicao(error);
        }
      } finally {
        if (!descartada) {
          setCarregado(true);
          setEstadoLoading(false);
        }
      }
    };

    listar();
    return () => {
      descartada = true;
    };
  }, [aba, page, filtroAtual, recarregar]);

  const trocarAba = (novaAba) => {
    setPage(1);
    setAba(novaAba);
  };

  const handleConsultaSelected = (consulta) => {
    setEstadoLoading(true);
    setPage(1);
    setFiltroAtual(consulta);
    setRecarregar((valor) => valor + 1);
  };

  return (
    <div className="dashboard-container mb-3">
      <p className=" text-start fs-4 fw-bold">Registro de Recargas Automáticas</p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-lg-6 col-6">
              <Filtro
                nome={"ListarLogsRecargaAutomatica"}
                onConsultaSelected={handleConsultaSelected}
                onLoading={estadoLoading}
              />
            </div>
            <div className="col-lg-3 col-3"></div>
            <div className="col-lg-3 col-3 text-end me-0">
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "blue", deg: 60 }}
                radius="md"
                size="sm"
                onClick={() => {
                  setFiltroAtual("");
                  setPage(1);
                  setRecarregar((valor) => valor + 1);
                }}
              >
                <AiOutlineReload color="white" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Tabs value={aba} onTabChange={trocarAba} mb="md">
        <Tabs.List>
          <Tabs.Tab value="cobrancas">Cobranças</Tabs.Tab>
          <Tabs.Tab value="alteracoes">Alterações</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <div className="row">
        <div className="col-12 mb-4">
          {carregado ? (
            <div className="card border-0 shadow">
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                {aba === "alteracoes" ? (
                <table className="table align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Data</th>
                      <th className="border-bottom" id="tabelaUsuarios2" scope="col">Cliente</th>
                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, posicao) => (
                      <tr key={`${item.data}-${posicao}`}>
                        <td id="tabelaUsuarios">{new Date(item.data).toLocaleString("pt-BR")}</td>
                        <td id="tabelaUsuarios2" className="text-truncate" style={{ maxWidth: "120px" }}>
                          {item.nome_cliente}
                        </td>
                        <td id="tabelaUsuarios" style={{ whiteSpace: "normal", minWidth: "260px" }}>{item.acao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                ) : (
                <table className="table align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Status</th>
                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Data</th>
                      <th className="border-bottom" id="tabelaUsuarios2" scope="col">Cliente</th>
                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Cartão</th>
                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Valor</th>
                      <th className="border-bottom" id="tabelaUsuarios" scope="col">Saldo antes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id_log}>
                        <td id="tabelaUsuarios">
                          <Badge color={corStatus[item.status] || "gray"} variant="filled">
                            {ROTULO_STATUS[item.status] || item.status}
                          </Badge>
                        </td>
                        <td id="tabelaUsuarios">{new Date(item.data).toLocaleString("pt-BR")}</td>
                        <td id="tabelaUsuarios2" className="text-truncate" style={{ maxWidth: "120px" }}>
                          {item.nome_cliente}
                        </td>
                        <td id="tabelaUsuarios">
                          {item.cartao ? descreverCartao(item) : "Cartão removido"}
                        </td>
                        <td id="tabelaUsuarios">{formatarValor(item.valor)}</td>
                        <td id="tabelaUsuarios">{formatarValor(item.saldo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>
              {mensagem ? (
                mensagem === "Filtro inválido!" ? (
                  <div className="alert alert-danger mt-4 mx-3" role="alert">
                    {mensagem}
                  </div>
                ) : (
                  <p className="text-center text-muted my-4 mx-3">{mensagem}</p>
                )
              ) : null}
            </div>
          ) : (
            <div className="col-12 text-center mt-4 mb-4">
              <Loader />
            </div>
          )}
        </div>
        {totalPages > 1 ? (
          <Group position="center" mb="md">
            <Pagination value={page} total={totalPages} onChange={setPage} />
          </Group>
        ) : null}
      </div>
      <VoltarComponente />
    </div>
  );
};

export default ListarLogsRecargaAutomatica;
