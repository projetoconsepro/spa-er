import React, { useEffect, useState } from "react";
import createAPI from "../services/createAPI";
import { AiOutlineReload } from "react-icons/ai";
import { Button, Group, Loader, Pagination } from "@mantine/core";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";

const ListarLogsDebitoAuto = () => {
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
        const response = await requisicao.get(`/movimento/debito/logs`, {
          params: { page },
        });
        if (response.status === 200 && response.data.msg.resultado) {
          setEstado2(true);
          const newData = response.data.data.map((item) => ({
            hora: item.hora,
            nome_cliente: item.nome_cliente,
            nome_monitor: item.nome_monitor,
            placa: item.placa,
            saldo: parseFloat(item.saldo).toFixed(2),
            status: item.status,
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
      .get(`/movimento/debito/logs?query=${base64}`, { params: { page } })
      .then((response) => {
        setEstadoLoading(false);
        setEstado2(true);
        if (response.status === 200 && response.data.msg.resultado) {
          setEstado2(true);
          const newData = response.data.data.map((item) => ({
            hora: item.hora,
            nome_cliente: item.nome_cliente,
            nome_monitor: item.nome_monitor,
            placa: item.placa,
            saldo: parseFloat(item.saldo).toFixed(2),
            status: item.status,
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

  return (
    <div className="dashboard-container mb-3">
      <p className=" text-start fs-4 fw-bold">
        Registro de Tentativas de Débito Automático
      </p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-lg-6 col-6">
              <Filtro
                nome={"ListarLogsDebitoAuto"}
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
                          <th className="border-bottom" id="tabelaUsuarios" scope="col" style={{ width: '8%' }}>Status</th>                          
                          <th className="border-bottom" id="tabelaUsuarios" scope="col" style={{ width: '8%' }}>Saldo</th>
                          <th className="border-bottom" id="tabelaUsuarios" scope="col" style={{ width: '8%' }}>Placa</th>
                          <th className="border-bottom" id="tabelaUsuarios" scope="col" style={{ width: '10%' }}>Data</th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col" style={{ width: '15%' }}>Cliente</th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col" style={{ width: '15%' }}>Monitor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <tr key={index}>
                            <td
                              id="tabelaUsuarios"
                              style={{
                                fontWeight: "bold",
                                color: item.status === "RECUSADO" ? "red" : item.status === "CONCLUIDO" ? "green" : "inherit",
                              }}
                            >
                              {item.status === "CONCLUIDO" ? "CONCLUÍDO" : item.status}
                            </td>                            <td id="tabelaUsuarios">R$ {item.saldo}</td>

                            <td id="tabelaUsuarios">{item.placa}</td>
                            <td id="tabelaUsuarios">{new Date(item.hora).toLocaleString()}</td>
                            <td id="tabelaUsuarios2" className="text-truncate" style={{ maxWidth: '90px' }}>{item.nome_cliente}</td>
                            <td id="tabelaUsuarios2" className="text-truncate" style={{ maxWidth: '90px' }}>{item.nome_monitor}</td>
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

export default ListarLogsDebitoAuto;
