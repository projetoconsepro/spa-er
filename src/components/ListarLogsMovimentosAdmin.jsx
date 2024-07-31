import React, { useEffect, useState } from "react";
import createAPI from "../services/createAPI";
import { AiOutlineReload } from "react-icons/ai";
import { Button, Group, Loader, Pagination } from "@mantine/core";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";

const ListarMovimentosAdmin = () => {
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [mostrarPaginacao, setMostrarPaginacao] = useState(true);
  const [filtroAtual, setFiltroAtual] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageFiltro, setPageFiltro] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPagesFiltro, setTotalPagesFiltro] = useState(1);

  useEffect(() => {
    const listar = async () => {
      setEstado(false);
      setMensagem("");
      const requisicao = createAPI();
      try {
        const response = await requisicao.get(`/movimento/logs`, {
          params: { page },
        });
        if (response.status === 200 && response.data.msg.resultado) {
          setEstado2(true);
          const newData = response.data.data.map((item) => ({
            hora: item.hora,
            tipo: item.tipo,
            movimento_original: item.movimento_original,
            movimento_alterado: item.movimento_alterado,
            nome_usuario: item.nome_usuario,
          }));
          setData(newData);
          setTotalPages(response.data.totalPages);
          setMostrarPaginacao(true);
        } else {
          setData([]);
          setEstado(true);
          setEstado2(true);
          setMensagem("Não há movimentos para exibir");
        }
      } catch (error) {
        if (
          error?.response?.data?.msg === "Cabeçalho inválido!" ||
          error?.response?.data?.msg === "Token inválido!" ||
          error?.response?.data?.msg ===
            "Usuário não possui o perfil mencionado!"
        ) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("perfil");
        } else {
          console.log(error);
        }
      }
    };

    listar();
  }, [page]);

  const handleConsultaSelected = (consulta) => {
    setFiltroAtual(consulta);
    handleFiltro(consulta);
  };

  const handleFiltro = async (where, pageFiltro) => {
    setEstadoLoading(true);
    setEstado(false);
    setMensagem("");
    setMostrarPaginacao(false);
    const requisicao = createAPI();
    const base64 = btoa(where);
    const page = pageFiltro;
    requisicao
      .get(`/movimento/filtro/logs?query=${base64}`, { params: { page } })
      .then((response) => {
        setEstadoLoading(false);
        setEstado2(true);
        if (response.status === 200 && response.data.msg.resultado) {
          setEstado2(true);
          const newData = response.data.data.map((item) => ({
            hora: item.hora,
            tipo: item.tipo,
            movimento_original: item.movimento_original,
            movimento_alterado: item.movimento_alterado,
            nome_usuario: item.nome_usuario,
          }));
          setData(newData);
          setTotalPagesFiltro(response.data.totalPages);
        } else {
          setData([]);
          setEstado(true);
          setEstado2(true);
          setMensagem("Não há movimentos para exibir");
        }
      })
      .catch((error) => {
        if (
          error?.response?.data?.msg === "Cabeçalho inválido!" ||
          error?.response?.data?.msg === "Token inválido!" ||
          error?.response?.data?.msg ===
            "Usuário não possui o perfil mencionado!"
        ) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("perfil");
        } else {
          console.log(error);
        }
      });
  };

  const tipoComAcentos = {
    remocao: "Remoção",
    edicao: "Edição",
  };

  const tipoMovimentoComAcentos = {
    tolerancia: "Tolerância",
    credito: "Crédito",
    notificacao: "Notificação",
    regularizacao: "Regularização",
    ajuste: "Ajuste",
    cancelamento: "Cancelamento",
    infracao: "Infração",
    saida: "Saída",
  };

  return (
    <div className="dashboard-container mb-3">
      <p className="mx-3 text-start fs-4 fw-bold">
        Histórico de Ações Movimentos
      </p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-lg-6 col-6">
              <Filtro
                nome={"ListarLogsMovimentosAdmin"}
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
                  setPage(0);
                  setEstado2(false);
                }}
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
                  <div
                    className="table-responsive"
                    style={{ overflowX: "auto" }}
                  >
                    <table className="table align-items-center table-flush">
                      <thead className="thead-light">
                        <tr>
                          <th
                            className="border"
                            colSpan="3"
                            id="tabelaUsuarios2"
                          ></th>
                          <th
                            className="border"
                            colSpan="3"
                            id="tabelaUsuarios"
                          >
                            Original
                          </th>
                          <th
                            className="border"
                            colSpan="3"
                            id="tabelaUsuarios"
                          >
                            Alterado
                          </th>
                        </tr>
                        <tr>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Ação
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Data
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Nome
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Tipo
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Tempo
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Valor
                          </th>

                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Tipo
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Tempo
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Valor
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <tr key={index}>
                            <td id="tabelaUsuarios2">
                              {tipoComAcentos[item.tipo]}
                            </td>
                            <td id="tabelaUsuarios2">
                              {new Date(item.hora).toLocaleString()}
                            </td>
                            <td id="tabelaUsuarios2">{item.nome_usuario}</td>
                            {item.tipo === "edicao" &&
                            item.movimento_original &&
                            item.movimento_original.creditoMovimentoOriginal ? (
                              <>
                                {item.movimento_original.creditoMovimentoOriginal.map(
                                  (mov, idx) => (
                                    <React.Fragment key={idx}>
                                      <td
                                        id="tabelaUsuarios"
                                        className="border-start"
                                      >
                                        {tipoMovimentoComAcentos[mov.tipo]}
                                      </td>
                                      <td id="tabelaUsuarios">{mov.tempo}</td>
                                      <td id="tabelaUsuarios">
                                        R$ {parseFloat(mov.valor).toFixed(2)}
                                      </td>
                                    </React.Fragment>
                                  )
                                )}
                                {item.movimento_alterado &&
                                  item.movimento_alterado
                                    .creditoMovimentoAlterado &&
                                  item.movimento_alterado.creditoMovimentoAlterado.map(
                                    (mov, idx) => (
                                      <React.Fragment key={idx}>
                                        <td
                                          id="tabelaUsuarios"
                                          className="border-start"
                                        >
                                          {mov.tipo}
                                        </td>
                                        <td id="tabelaUsuarios">{mov.tempo}</td>
                                        <td id="tabelaUsuarios">
                                          R$ {parseFloat(mov.valor).toFixed(2)}
                                        </td>
                                      </React.Fragment>
                                    )
                                  )}
                              </>
                            ) : (
                              <>
                                {" "}
                                {item.movimento_original.movimento.map(
                                  (mov, idx) => (
                                    <React.Fragment key={idx}>
                                      <td
                                        id="tabelaUsuarios"
                                        className="border-start"
                                      >
                                        {tipoMovimentoComAcentos[mov.tipo]}
                                      </td>
                                    </React.Fragment>
                                  )
                                )}
                                {item.movimento_original.creditoMovimento &&
                                item.movimento_original.creditoMovimento
                                  .length > 0
                                  ? item.movimento_original.creditoMovimento.map(
                                      (mov, idx) => (
                                        <React.Fragment key={idx}>
                                          <td id="tabelaUsuarios">
                                            {mov.tempo}
                                          </td>
                                          <td id="tabelaUsuarios">
                                            R${" "}
                                            {parseFloat(mov.valor).toFixed(2)}
                                          </td>
                                        </React.Fragment>
                                      )
                                    )
                                  : item.movimento_original.movimento.map(
                                      (mov, idx) => (
                                        <React.Fragment key={idx}>
                                          <td id="tabelaUsuarios" colSpan="1">
                                            {new Date(
                                              mov.hora
                                            ).toLocaleString()}
                                          </td>
                                          <td> </td>
                                        </React.Fragment>
                                      )
                                    )}
                                <td
                                  id="tabelaUsuarios"
                                  className="border-start"
                                  colSpan="3"
                                >
                                  REMOVIDO
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
        <Group position="center" mb="md">
          {mostrarPaginacao ? (
            <Pagination
              page={page}
              total={totalPages}
              onChange={(newPage) => {
                setPage(newPage);
                setEstado2(false);
              }}
            />
          ) : (
            <Pagination
              page={pageFiltro}
              total={totalPagesFiltro}
              onChange={(newPage) => {
                setPageFiltro(newPage);
                handleFiltro(filtroAtual, newPage);
                setEstado2(false);
              }}
            />
          )}
        </Group>
      </div>
      <VoltarComponente />
    </div>
  );
};

export default ListarMovimentosAdmin;
