import React, { useEffect, useState } from 'react';
import createAPI from "../services/createAPI";
import { AiOutlineReload } from "react-icons/ai";
import { FaEllipsisH } from "react-icons/fa";
import Swal from "sweetalert2";
import { Button, Group, Loader, Pagination } from "@mantine/core";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import { RiDeleteBinFill } from "react-icons/ri";

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
        const response = await requisicao.get(`/estacionamento/movimentos`, { params: { page } });
        if (response.data.resultado) {
          setEstado2(true);
          const newData = response.data.data.map((item) => ({
            id_movimento: item.id_movimento,
            hora: item.hora,
            tipo: item.tipo,
            tipo_movimento: item.tipo_movimento,
            nome_usuario: item.nome_usuario,
            perfil_usuario: item.perfil_usuario,
            valor: item.valor,
            tempo: item.tempo,
            numero_vaga: item.numero_vaga,
            placa_veiculo: item.placa_veiculo,
            nome_setor: item.nome_setor,
          }));
          setData(newData);
          setTotalPages(response.data.totalPages);
          setMostrarPaginacao(true);
        } else {
          setData([]);
          setEstado(true);
          setMensagem("Não há movimentos para exibir");
        }
      } catch (error) {
        if (
          error?.response?.data?.msg === "Cabeçalho inválido!" ||
          error?.response?.data?.msg === "Token inválido!" ||
          error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"
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
    requisicao
      .get(`/estacionamento/?query=${base64}`, { params: { pageFiltro } })
      .then((response) => {
        setEstadoLoading(false);
        setEstado2(true);
        if (response.data.data && response.data.data.length > 0) {
          setEstado(false);
          const newData = response.data.data.map((item) => ({
            id_movimento: item.id_movimento,
            hora: item.hora,
            tipo_movimento: item.tipo_movimento,
            nome_usuario: item.nome_usuario,
            perfil_usuario: item.perfil_usuario,
            valor: item.valor,
            tempo: item.tempo,
            tipo: item.tipo,
            numero_vaga: item.numero_vaga,
            placa_veiculo: item.placa_veiculo,
            nome_setor: item.nome_setor,
          }));
          setData(newData);
          setTotalPagesFiltro(response.data.totalPagesFiltro);
        } else {
          setData([]);
          setEstado(true);
          setMensagem("Não há movimentos para exibir");
        }
      }).catch((error) => {
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

  const deletar = (item, index) => {
    console.log(item);
    Swal.fire({
      title: "Tem certeza que deseja deletar esse movimento?",
      icon: "error",
      showCancelButton: true,
      cancelButtonText: "Não",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim",
    }).then((result) => {
      if (result.isConfirmed) {
        const requisicao = createAPI();
        const id_movimento = item.id_movimento;
        requisicao
          .delete(`/estacionamento/movimentos/${id_movimento}`)
          .then((response) => {
            Swal.fire(
              "Deletado!",
              "O Movimento foi deletado com sucesso.",
              "success"
            );
            setData((prevData) => prevData.filter((movimento) => movimento.id_movimento !== item.id_movimento));

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
      }
    });
  };


  return (
    <div className="dashboard-container mb-3">
      <p className="mx-3 text-start fs-4 fw-bold">Listar Movimentos</p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-6 mx-2">
              <Filtro nome={"ListarMovimentosAdmin"} onConsultaSelected={handleConsultaSelected} onLoading={estadoLoading} />

            </div>
            <div className="col-2 text-end">
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "blue", deg: 60 }}
                radius="md"
                size="sm"
                onClick={() => {
                  setPage(prevPage => prevPage);
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
                  <div className="table-responsive">
                    <table className="table align-items-center table-flush">
                      <thead className="thead-light">
                        <tr>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            placa
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            tipo
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            data
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            setor
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            vaga
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            pagamento
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            valor
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            tempo
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            usuário
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            perfil
                          </th>

                          <th className="border-bottom" scope="col">
                            ‎‎
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <tr key={index}>
                            <td id="tabelaUsuarios2">{item.placa_veiculo}</td>
                            <td id="tabelaUsuarios2">{item.tipo_movimento}</td>
                            <td id="tabelaUsuarios2">{new Date(item.hora).toLocaleString()}</td>
                            <td id="tabelaUsuarios2">{item.nome_setor}</td>
                            <td id="tabelaUsuarios2">{item.numero_vaga}</td>
                            <td id="tabelaUsuarios2">{item.tipo || '...'}</td>
                            <td id="tabelaUsuarios2">{item.valor ? `R$ ${parseFloat(item.valor).toFixed(2)}` : '...'}</td>
                            <td id="tabelaUsuarios2">{item.tempo || '...'}</td>
                            <td id="tabelaUsuarios2">{item.nome_usuario}</td>
                            <td id="tabelaUsuarios2">{item.perfil_usuario}</td>

                            <td className="fw-bolder col" id="tabelaUsuarios3">
                              <div className="btn-group">
                                <button
                                  className="btn btn-link text-dark dropdown-toggle dropdown-toggle-split m-0 p-0"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <FaEllipsisH />
                                </button>
                                <div className="dropdown-menu dashboard-dropdown align-items-center dropdown-menu-start">
                                  <h6
                                    className="dropdown-item d-flex align-items-center justify-content-center text-danger mt-2"
                                    onClick={() => deletar(item, index)}
                                    style={{ padding: '0' }}
                                  >
                                    <RiDeleteBinFill />
                                    ‎‎ Deletar
                                  </h6>
                                </div>
                              </div>
                            </td>
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
            />)}
        </Group>
      </div>
      <VoltarComponente />
    </div>
  );
}

export default ListarMovimentosAdmin;