import React, { useEffect, useState } from 'react';
import createAPI from "../services/createAPI";
import { AiOutlineReload } from "react-icons/ai";
import { FaEllipsisH, FaPowerOff } from "react-icons/fa";
import Swal from "sweetalert2";
import { Button, Group, Loader, Pagination, Modal } from "@mantine/core";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import { RiDeleteBinFill, RiEditLine } from "react-icons/ri";

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
  const [ModalAberto, setModalAberto] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const [index, setindex] = useState(false);
  const [tempoSelecionado, setTempoSelecionado] = useState('');

  useEffect(() => {
    const listar = async () => {
      setEstado(false);
      setMensagem("");
      const requisicao = createAPI();
      try {
        const response = await requisicao.get(`/movimento`, { params: { page } });
        if (response.data.data && response.data.data.length > 0) {
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
            estado_notificacao: item.estado_notificacao,
            id_notificacao: item.id_notificacao,
            id_vaga_veiculo: item.id_vaga_veiculo,
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
    const page = pageFiltro;
    requisicao
      .get(`/movimento/filtro/?query=${base64}`, { params: { page } })
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
            estado_notificacao: item.estado_notificacao,
            id_notificacao: item.id_notificacao,
            id_vaga_veiculo: item.id_vaga_veiculo,
          }));
          setData(newData);
          setTotalPagesFiltro(response.data.totalPages);
        } else {
          setData([]);
          setEstado(true);
          setEstado2(true);
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
    Swal.fire({
      title: `Tem certeza que deseja deletar o movimento de ${item.tipo_movimento === "notificacao" ? "Regularização" : tipoMovimentoComAcentos[item.tipo_movimento]}?`,
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
          .delete(`/movimento/${id_movimento}`)
          .then((response) => {
            Swal.fire(
              "Deletado!",
              "O Movimento foi deletado com sucesso.",
              "success"
            );
            if(item.estado_notificacao === "Regularizada") {
              data[index].estado_notificacao = "Pendente";
              setData((prevData) => 
                prevData.filter((movimento) => {
                  return !(movimento.id_vaga_veiculo === item.id_vaga_veiculo && movimento.tipo_movimento === 'regularizacao');
                })
              );
            }else{
            setData((prevData) => prevData.filter((movimento) => movimento.id_movimento !== item.id_movimento));
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
      }
    });
  };
  const cancelar = (item, index) => {
    Swal.fire({
      title: "Informe o motivo do cancelamento",
      html: '<input type="text" id="cancelamento" class="form-control">',
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Fechar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Salvar",
      preConfirm: () => {
        const cancelamentoInput = document.getElementById("cancelamento");
        const cancelamentoValue = cancelamentoInput.value.trim();

        if (!cancelamentoValue) {
          Swal.showValidationMessage(
            "Por favor, informe o motivo do cancelamento"
          );
        }

        return cancelamentoValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const motivo = result.value;
        const requisicao = createAPI();
        requisicao
          .post("/notificacao/cancelar/", {
            idNotificacao: item.id_notificacao,
            idVagaVeiculo: item.id_vaga_veiculo,
            descricao: motivo,
          })
          .then((response) => {
            if (response.data.msg.resultado) {
              Swal.fire(
                "Cancelado!",
                "Notificação cancelada com sucesso.",
                "success"
              );
              data[index].estado_notificacao = "Cancelada";
              setData([...data]);
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
      }
    });
  };

  const tipoMovimentoComAcentos = {
    tolerancia: 'Tolerância',
    credito: 'Crédito',
    notificacao: 'Notificação',
    regularizacao: 'Regularização',
    ajuste: 'Ajuste',
    cancelamento: 'Cancelamento',
    infracao: 'Infração',
    saida: 'Saída',
  }; 

  const editarTempo = (index, id, tempo) => {
    setLoadingButton(true)
    const requisicao = createAPI();
    requisicao
      .put(`/movimento`, {
        tempo: tempo,
        id: id
      })
      .then((response) => {
        setLoadingButton(false)
        setModalAberto(false)
        Swal.fire(
          "Atualizado!",
          "O tempo do movimento foi atualizado com sucesso.",
          "success"
        );
        const valorAtualizado = response.data.valor;
        const tempoAtualizado = response.data.tempo;
        data[index].valor = valorAtualizado;
        data[index].tempo = tempoAtualizado;
        setData([...data]);
      })
      .catch((error) => {
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
      });
  };

  useEffect(() => {
    if (selectedItem) {
      const opcoes = ["00:30:00", "01:00:00", "01:30:00", "02:00:00"].filter(opcao => opcao !== selectedItem.tempo);
      if (opcoes.length > 0) {
        setTempoSelecionado(opcoes[0]);
      }
    }
  }, [selectedItem]);

  const abrirModalEditarTempo = (item, index) => {
    setModalAberto(true);
    setSelectedItem(item);
    setindex(index)
  };  

  return (
    <div className="dashboard-container mb-3">
      <Modal
        opened={ModalAberto}
        onClose={() => {
          setModalAberto(false);
          setSelectedItem(null);
        }}
        centered
        title="Editar Tempo"
        size="md"
        className="flex items-center justify-center"
      >
        {selectedItem && (
          <div className="flex flex-col items-center justify-center">
            <select
              className="form-select form-select-lg mb-4 mt-5"
              aria-label=".form-select-lg example"
              value={tempoSelecionado}
              onChange={(e) => setTempoSelecionado(e.target.value)}
            >
              {selectedItem.tempo !== "00:30:00" && <option value="00:30:00">30 Minutos</option>}
              {selectedItem.tempo !== "01:00:00" && <option value="01:00:00">60 Minutos</option>}
              {selectedItem.tempo !== "01:30:00" && <option value="01:30:00">90 Minutos</option>}
              {selectedItem.tempo !== "02:00:00" && <option value="02:00:00">120 Minutos</option>}
            </select>
            <div className="mb-2 mt-3 gap-2 flex justify-center items-center w-full text-center">
              <Button
                loading={loadingButton}
                className="bg-blue-50 m-2"
                size="md"
                radius="md"
                onClick={() => editarTempo(index, selectedItem.id_movimento, tempoSelecionado)}
              >
                Salvar
              </Button>
              <VoltarComponente />
            </div>
          </div>
        )}
      </Modal>
      <p className="mx-3 text-start fs-4 fw-bold">Listar Movimentos</p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-lg-6 col-6">
            <Filtro nome={"ListarMovimentosAdmin"} onConsultaSelected={handleConsultaSelected} onLoading={estadoLoading} />
            </div>
            <div className="col-lg-3 col-3">
            </div>
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
                  <div className="table-responsive" style={{ overflowX: 'auto' }}>
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
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            setor
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
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
                            id="tabelaUsuarios"
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
                            id="tabelaUsuarios"
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
                            <td id="tabelaUsuarios">{item.placa_veiculo}</td>
                            <td id="tabelaUsuarios">
                              {tipoMovimentoComAcentos[item.tipo_movimento]}
                            </td>
                            <td id="tabelaUsuarios">{new Date(item.hora).toLocaleString()}</td>
                            <td id="tabelaUsuarios2">{item.nome_setor}</td>
                            <td id="tabelaUsuarios">{item.numero_vaga}</td>
                            {item.tipo_movimento == 'notificacao' ? (
                              <td id="tabelaUsuarios" colSpan="3" style={{ fontWeight: 'medium', marginTop: '2rem', color: item.estado_notificacao === 'Cancelada' ? 'black' : item.estado_notificacao === 'Regularizada' ? '#20E300' : item.estado_notificacao === 'Pendente' ? '#E30000' : 'black' }}>    
                              Notificação {item.estado_notificacao}

                              </td>
                            ) : (
                              <>
                                <td id="tabelaUsuarios2">{item.tipo || '...'}</td>
                                <td id="tabelaUsuarios">{item.valor ? `R$ ${parseFloat(item.valor).toFixed(2)}` : '...'}</td>
                                <td id="tabelaUsuarios">{item.tempo || '...'}</td>
                              </>
                            )}
                            <td id="tabelaUsuarios">{item.nome_usuario}</td>
                            <td id="tabelaUsuarios2">{item.perfil_usuario.charAt(0).toUpperCase() + item.perfil_usuario.slice(1)}</td>

                            <td className="fw-bolder col" id="tabelaUsuarios3">
                            <div className="btn-group">
                                {item.estado_notificacao === "Cancelada" || item.tipo_movimento === "cancelamento" ? (
                                  <div></div>
                                ) : (
                                  <button
                                    className="btn btn-link text-dark dropdown-toggle dropdown-toggle-split m-0 p-0"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    <FaEllipsisH />
                                  </button>
                                )}
                                <div className="dropdown-menu dashboard-dropdown dropdown-menu-start mt-3 py-1">
                                {item.tipo_movimento !== "notificacao" || item.estado_notificacao === "Regularizada" ? (
                                    <div>
                                      <h6 className="dropdown-item d-flex justify-content-center align-items-center text-danger"
                                        onClick={() => deletar(item, index)}
                                      >
                                        <RiDeleteBinFill />
                                        ‎‎ Remover {item.tipo_movimento === "notificacao" ? "Regularização" : tipoMovimentoComAcentos[item.tipo_movimento]}
                                      </h6>
                                      {item.tempo && (
                                        <h6 className="dropdown-item d-flex justify-content-center align-items-center text-info"
                                        onClick={() => abrirModalEditarTempo(item, index)}>
                                          <RiEditLine />
                                          Editar tempo
                                        </h6>
                                      )}
                                    </div>
                                  ) : (<h6 className="dropdown-item d-flex justify-content-center align-items-center text-primary"
                                    onClick={() => cancelar(item, index)}
                                  >
                                    <FaPowerOff />
                                    ‎‎ ‎Cancelar
                                  </h6>)}
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