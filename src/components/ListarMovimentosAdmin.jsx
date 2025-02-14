import { useEffect, useState, useRef } from "react";
import createAPI from "../services/createAPI";
import { AiOutlineReload } from "react-icons/ai";
import { FaEllipsisH, FaPowerOff } from "react-icons/fa";
import Swal from "sweetalert2";
import { Button, Group, Loader, Pagination, Modal } from "@mantine/core";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import { RiDeleteBinFill, RiEditLine } from "react-icons/ri";
import { Divider } from "@mantine/core";
import validarPlaca from "../util/validarPlaca";

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
  const [tempoSelecionado, setTempoSelecionado] = useState("");
  const [placa, setPlaca] = useState("placa");
  const [limite, setLimite] = useState(8);
  const [inputVazio, setInputVazio] = useState("inputvazio3");
  const [placaSelecionada, setPlacaSelecionada] = useState("");
  const [isPlacaEstrangeira, setIsPlacaEstrangeira] = useState(false);
  const switchRef = useRef(null);
  const [motivoEdicao, setMotivoEdicao] = useState("");

  useEffect(() => {
    const listar = async () => {
      setEstado(false);
      setMensagem("");
      const requisicao = createAPI();
      try {
        const response = await requisicao.get(`/movimento`, {
          params: { page },
        });
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

  const deletar = (item, index) => {
    Swal.fire({
      title: `Tem certeza que deseja deletar o movimento de ${
        item.tipo_movimento === "notificacao"
          ? "Regularização"
          : tipoMovimentoComAcentos[item.tipo_movimento]
      }?`,
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
            if (item.estado_notificacao === "Regularizada") {
              data[index].estado_notificacao = "Pendente";
              setData((prevData) =>
                prevData.filter((movimento) => {
                  return !(
                    movimento.id_vaga_veiculo === item.id_vaga_veiculo &&
                    movimento.tipo_movimento === "regularizacao"
                  );
                })
              );
            } else {
              setData((prevData) =>
                prevData.filter(
                  (movimento) => movimento.id_movimento !== item.id_movimento
                )
              );
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
    tolerancia: "Tolerância",
    credito: "Crédito",
    notificacao: "Notificação",
    regularizacao: "Regularização",
    ajuste: "Ajuste",
    cancelamento: "Cancelamento",
    infracao: "Infração",
    saida: "Saída",
  };

  /**
   * Compara duas datas e verifica se elas pertencem ao mesmo dia.
   * @param {Date} date1 - A primeira data a ser comparada.
   * @param {Date} date2 - A segunda data a ser comparada.
   * @returns {boolean} Retorna true se as datas forem no mesmo dia.
   */
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  /**
   * Atualiza um movimento de veículo com novos dados de tempo e placa.
   * Realiza validações antes de enviar a atualização ao backend.
   * @param {number} index - O índice do movimento na lista.
   * @param {number} id - O ID do movimento.
   * @param {string} tempo - O novo tempo selecionado.
   * @param {string} placa - A nova placa informada.
   * @param {string} motivo - Motivo da edição de movimento.
   * 
   */
  const editarMovimento = (index, id, tempo, placa, motivo) => {
    const placaNormalizada = placa
      .trim()
      .replace(/\s+/g, "")
      .toUpperCase()
      .replace(/-/g, "");

    // Verifica se houve alguma alteração significativa
    const placaAlterada = placaNormalizada !== selectedItem.placa_veiculo;
    const tempoAlterado = tempo !== selectedItem.tempo;

    // Se não houve alteração na placa nem no tempo, fecha o modal sem exigir motivo
    if (!placaAlterada && !tempoAlterado) {
      Swal.fire(
        "Nenhuma alteração",
        "Nenhuma alteração foi feita no movimento.",
        "info"
      );
      setModalAberto(false);
      return;
    }

    // Verifica se a placa está vazia
    if (placaNormalizada === "") {
      setLoadingButton(false);
      Swal.fire("Erro!", "Preencha o campo placa", "error");
      return;
    }

    // Verifica se o motivo está vazio (apenas se houver alteração)
    if ((placaAlterada || tempoAlterado) && motivo.trim() === "") {
      setLoadingButton(false);
      Swal.fire("Erro!", "Preencha o campo motivo", "error");
      return;
    }

    // Valida placa caso não seja estrangeira
    const sim = document.getElementById("flexSwitchCheckDefault").checked;
    if (!sim && !validarPlaca(placaNormalizada)) {
      setLoadingButton(false);
      Swal.fire("Erro!", "Placa inválida", "error");
      return;
    }

    setLoadingButton(true);

    // Envia a atualização para o backend
    const requisicao = createAPI();
    const placaAtualizada = placaAlterada
      ? placaNormalizada
      : selectedItem.placa_veiculo;

    requisicao
      .put(`/movimento`, { id, tempo, placa: placaAtualizada, motivo })
      .then((response) => {
        setLoadingButton(false);
        setModalAberto(false);

        // Atualiza dados na tabela local
        const valorAtualizado = response.data.valor;
        const tempoAtualizado = response.data.tempo;
        const placaAtualizadaResponse = placaAlterada
          ? response.data.placa
          : selectedItem.placa_veiculo;

        data[index].valor = valorAtualizado;
        data[index].tempo = tempoAtualizado;
        data[index].placa_veiculo = placaAtualizadaResponse;
        setData([...data]);

        Swal.fire(
          "Atualizado!",
          "O movimento foi atualizado com sucesso.",
          "success"
        );
      })
      .catch((error) => {
        setLoadingButton(false);

        if (
          [
            "Cabeçalho inválido!",
            "Token inválido!",
            "Usuário não possui o perfil mencionado!",
          ].includes(error?.response?.data?.msg)
        ) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("perfil");
        } else {
          console.log(error);
        }

        Swal.fire(
          "Erro!",
          "Ocorreu um erro ao atualizar o movimento.",
          "error"
        );
      });
  };

  useEffect(() => {
    if (selectedItem) {
      setTempoSelecionado(selectedItem.tempo);
      setPlacaSelecionada(selectedItem.placa_veiculo);

      const isEstrangeira = !validarPlaca(selectedItem.placa_veiculo);
      setIsPlacaEstrangeira(isEstrangeira);
      setPlaca(isEstrangeira ? "placa2" : "placa");
      setLimite(isEstrangeira ? 10 : 8);
      setInputVazio(isEstrangeira ? "inputvazio2" : "inputvazio3");
    }
  }, [selectedItem]);

  /**
   * Manipula a alteração do switch de placa estrangeira.
   * Atualiza os limites de caracteres e a identificação do input.
   * @param {Event} e - O evento de clique no switch.
   */
  const handlePlacaSwitch = (e) => {
    const ativado = e.target.checked;
    setIsPlacaEstrangeira(ativado);
    setPlaca(ativado ? "placa2" : "placa");
    setLimite(ativado ? 10 : 8);
    setInputVazio(ativado ? "inputvazio2" : "inputvazio3");
  };

  /**
   * Configura e abre o modal para edição de um movimento.
   * Preenche os dados com base no item selecionado e determina se a placa é estrangeira.
   * @param {Object} item - O movimento selecionado.
   * @param {number} index - O índice do movimento na lista.
   */
  const abrirModalEditarMovimento = (item, index) => {
    const isPlacaEstrangeira = !validarPlaca(item.placa_veiculo);
    setIsPlacaEstrangeira(isPlacaEstrangeira);
    setPlaca(isPlacaEstrangeira ? "placa2" : "placa");
    setLimite(isPlacaEstrangeira ? 10 : 8);
    setInputVazio(isPlacaEstrangeira ? "inputvazio2" : "inputvazio3");
    setSelectedItem(item);
    setindex(index);
    setMotivoEdicao("");
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setSelectedItem(null);
    setMotivoEdicao("");
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
        title="Editar Movimento"
        size="md"
        className="flex items-center justify-center"
      >
        {selectedItem && (
          <div className="flex flex-col items-center justify-center w-100">
            <Divider my="sm" size="md" variant="dashed" />
            <div className="row">
              <div className="col-9 px-3">
                <h5 id="h5Placa">Placa Estrangeira</h5>
              </div>
              <div className="col-3 px-3">
                <div className="form-check3 form-switch gap-2 d-md-block">
                  <input
                    ref={switchRef}
                    className="form-check-input align-self-end"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    checked={isPlacaEstrangeira}
                    onChange={handlePlacaSwitch}
                  />
                </div>
              </div>
            </div>

            <div className="pt-1 mt-md-0 w-100 p-3" id={placa}>
              <input
                type="text"
                id={inputVazio}
                className="mt-5 fs-1 justify-content-center align-items-center text-align-center"
                value={placaSelecionada}
                onChange={(e) => setPlacaSelecionada(e.target.value)}
                maxLength={limite}
              />
            </div>

            <select
              className="form-select form-select-lg mb-4 mt-5"
              aria-label=".form-select-lg example"
              value={tempoSelecionado}
              onChange={(e) => setTempoSelecionado(e.target.value)}
            >
              <option value="00:30:00">30 Minutos</option>
              <option value="01:00:00">60 Minutos</option>
              <option value="01:30:00">90 Minutos</option>
              <option value="02:00:00">120 Minutos</option>
            </select>

            {/* Exibe o campo de motivo apenas se houver alteração na placa ou no tempo */}
            {(placaSelecionada !== selectedItem.placa_veiculo ||
              tempoSelecionado !== selectedItem.tempo) && (
              <div className="w-100 p-3">
                <label htmlFor="motivoEdicao" className="form-label">
                  Motivo da Edição
                </label>
                <input
                  type="text"
                  id="motivoEdicao"
                  className="form-control"
                  placeholder="Informe o motivo da edição"
                  value={motivoEdicao}
                  onChange={(e) => setMotivoEdicao(e.target.value)}
                />
              </div>
            )}

            <div className="mb-2 mt-3 gap-2 flex justify-center items-center w-full text-center">
              <Button
                loading={loadingButton}
                className="bg-blue-50 m-2"
                size="md"
                radius="md"
                onClick={() => {
                  editarMovimento(
                    index,
                    selectedItem.id_movimento,
                    tempoSelecionado,
                    placaSelecionada,
                    motivoEdicao
                  );
                }}
              >
                Salvar
              </Button>
              <Button
                className="bg-gray-500"
                size="md"
                radius="md"
                onClick={fecharModal}
              >
                Voltar
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <p className="mx-3 text-start fs-4 fw-bold">Listar Movimentos</p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-lg-6 col-6">
              <Filtro
                nome={"ListarMovimentosAdmin"}
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
                        {/* Mapeia os dados para renderizar as linhas da tabela */}
                        {data.map((item, index) => {
                          // Converte a hora do movimento para um objeto Date
                          const movimentoDate = new Date(item.hora);
                          // Obtém a data atual
                          const today = new Date();
                          // Verifica se o movimento é do mesmo dia
                          const isMovimentoToday = isSameDay(
                            movimentoDate,
                            today
                          );
                          return (
                            <tr key={index}>
                              <td id="tabelaUsuarios">{item.placa_veiculo}</td>
                              <td id="tabelaUsuarios">
                                {tipoMovimentoComAcentos[item.tipo_movimento]}
                              </td>
                              <td id="tabelaUsuarios">
                                {new Date(item.hora).toLocaleString()}
                              </td>
                              <td id="tabelaUsuarios2">{item.nome_setor}</td>
                              <td id="tabelaUsuarios">{item.numero_vaga}</td>
                              {item.tipo_movimento === "notificacao" ? (
                                <td
                                  id="tabelaUsuarios"
                                  colSpan="3"
                                  style={{
                                    fontWeight: "medium",
                                    marginTop: "2rem",
                                    color:
                                      item.estado_notificacao === "Cancelada"
                                        ? "black"
                                        : item.estado_notificacao ===
                                          "Regularizada"
                                        ? "#20E300"
                                        : item.estado_notificacao === "Pendente"
                                        ? "#E30000"
                                        : "black",
                                  }}
                                >
                                  Notificação {item.estado_notificacao}
                                </td>
                              ) : (
                                <>
                                  <td id="tabelaUsuarios2">
                                    {item.tipo || "..."}
                                  </td>
                                  <td id="tabelaUsuarios">
                                    {item.valor
                                      ? `R$ ${parseFloat(item.valor).toFixed(
                                          2
                                        )}`
                                      : "..."}
                                  </td>
                                  <td id="tabelaUsuarios">
                                    {item.tempo || "..."}
                                  </td>
                                </>
                              )}
                              <td id="tabelaUsuarios">{item.nome_usuario}</td>
                              <td id="tabelaUsuarios2">
                                {item.perfil_usuario.charAt(0).toUpperCase() +
                                  item.perfil_usuario.slice(1)}
                              </td>
                              {/* Ações */}
                              <td
                                className="fw-bolder col"
                                id="tabelaUsuarios3"
                              >
                                <div className="btn-group">
                                  {/* Verifica se deve esconder o botão de editar e deletar */}
                                  {item.estado_notificacao === "Cancelada" ||
                                  item.estado_notificacao === "Regularizada" ||
                                  item.tipo_movimento === "cancelamento" ||
                                  (!isMovimentoToday &&
                                    item.tipo_movimento !== "notificacao") ? (
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
                                    {item.tipo_movimento !== "notificacao" ||
                                    item.estado_notificacao ===
                                      "Regularizada" ? (
                                      <div>
                                        <h6
                                          className="dropdown-item d-flex justify-content-center align-items-center text-danger"
                                          onClick={() => deletar(item, index)}
                                        >
                                          <RiDeleteBinFill />
                                          ‎‎ Remover{" "}
                                          {item.tipo_movimento === "notificacao"
                                            ? "Regularização"
                                            : tipoMovimentoComAcentos[
                                                item.tipo_movimento
                                              ]}
                                        </h6>
                                        {item.tempo && (
                                          <h6
                                            className="dropdown-item d-flex justify-content-center align-items-center text-info"
                                            onClick={() =>
                                              abrirModalEditarMovimento(
                                                item,
                                                index
                                              )
                                            }
                                          >
                                            <RiEditLine />
                                            Editar Movimento
                                          </h6>
                                        )}
                                      </div>
                                    ) : (
                                      <h6
                                        className="dropdown-item d-flex justify-content-center align-items-center text-primary"
                                        onClick={() => cancelar(item, index)}
                                      >
                                        <FaPowerOff />
                                        ‎‎ ‎Cancelar
                                      </h6>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {/* Adiciona uma linha em branco ao final da tabela */}
                        <tr>
                          <td colSpan="12" style={{ height: "100px" }}></td>
                        </tr>
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
