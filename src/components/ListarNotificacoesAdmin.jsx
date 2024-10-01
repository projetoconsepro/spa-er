import "jspdf-autotable";
import { React, useState, useEffect } from "react";
import { AiFillPrinter, AiOutlineReload } from "react-icons/ai";
import { FaEllipsisH, FaEye, FaImages, FaPowerOff } from "react-icons/fa";
import Swal from "sweetalert2";
import RelatoriosPDF from "../util/RelatoriosPDF";
import { Button, Group, Loader, Modal, Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import createAPI from "../services/createAPI";

const ListarNotificacoesAdmin = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [dataImagem, setDataImagem] = useState([]);
  const [estado, setEstado] = useState(false);
  const [estado2, setEstado2] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  function ArrumaHora(data, hora) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    return data4;
  }

  function ArrumaHora2(data) {
    const data2 = data.split("T");
    const data6 = data2[1].split(":");
    const data5 = data6[0] - 3 + ":" + data6[1] + ":";
    const data7 = data5 + data6[2].split(".")[0];
    return data7;
  }

  const createPDF = () => {
    const nomeArquivo = "Relatório de irregularidades";
    const dataD = data.map((item) => {
      return [
        item.data,
        item.placa,
        item.vaga,
        item.pendente,
        item.fabricante,
        item.modelo,
        item.tipo,
        item.valor,
      ];
    });
    const cabecalho = [
      "Data",
      "Placa",
      "Vaga",
      "Estado",
      "Fabricante",
      "Modelo",
      "Tipo",
      "Valor",
    ];
    RelatoriosPDF(nomeArquivo, cabecalho, dataD);
  };

  const mostrar = async (item, index) => {
    const requisicao = createAPI();
    if (item.pendente === "Pendente") {
      Swal.fire({
        title: "Informações da notificação",
        html: `<p><b>Data:</b> ${item.data}</p>
                   <p><b>Placa:</b> ${item.placa}</p>
                   <p><b>Estado:</b> ${item.pendente}</p>
                   <p><b>Modelo:</b> ${item.modelo}</p>
                   <p><b>Fabricante:</b> ${item.fabricante}</p>
                   <p><b>Tipo:</b> ${item.tipo}</p>
                   <p><b>Valor:</b> R$${item.valor}</p>
                   <p><b>Monitor:</b> ${item.monitor}</p>
                   <p><b>Hora:</b> ${item.hora}</p>`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Regularizar",
        confirmButtonColor: "#3A58C8",
        cancelButtonText: "Fechar",
      }).then((result) => {
        if (result.isDismissed) {
          Swal.close();
        } else if (result.isConfirmed) {
          requisicao
            .put("/notificacao/", {
              id_vaga_veiculo: item.id_vaga_veiculo,
            })
            .then((response) => {
              if (response.data.msg.resultado) {
                Swal.fire(
                  "Regularizado!",
                  "A notificação foi regularizada.",
                  "success"
                );
                data[index].pendente = "Quitado";
                setData([...data]);
              } else {
                setEstado(true);
                setMensagem(response.data.msg.msg);
                setTimeout(() => {
                  setEstado(false);
                  setMensagem("");
                }, 5000);
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
    } else {
      Swal.fire({
        title: "Informações da notificação",
        html: `<p><b>Data:</b> ${item.data}</p>
                     <p><b>Placa:</b> ${item.placa}</p>
                     <p><b>Estado:</b> ${item.pendente}</p>
                     <p><b>Modelo:</b> ${item.modelo}</p>
                     <p><b>Fabricante:</b> ${item.fabricante}</p>
                     <p><b>Tipo:</b> ${item.tipo}</p>
                     <p><b>Valor:</b> R$${item.valor}</p>
                     <p><b>Monitor:</b> ${item.monitor}</p>
                     <p><b>Hora:</b> ${item.hora}</p>`,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: "Fechar",
      }).then((result) => {
        if (result.isDismissed) {
          Swal.close();
        }
      });
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    setEstado(false);
    setMensagem("");
    const requisicao = createAPI();
    requisicao
      .get("/notificacao")
      .then((response) => {
        setEstado2(true);
        if (response.data.msg.resultado) {
          setEstado(false);
          const newData = response.data.data.map((item) => ({
            data: ArrumaHora(item.data),
            placa: item.veiculo.placa,
            cancelada: item.cancelada,
            cancelada_motivo: item.cancelada_motivo,
            vaga: item.vaga,
            pendente:
              item.pago === "S"
                ? "Quitado"
                : item.cancelada === "S"
                ? "Cancelado"
                : item.infracao === "S"
                ? "Infração"
                : "Pendente",
            fabricante: item.veiculo.modelo.fabricante.nome,
            modelo: item.veiculo.modelo.nome,
            tipo: item.tipo_notificacao.nome,
            valor: item.valor,
            id_vaga_veiculo: item.id_vaga_veiculo,
            id_notificacao: item.id_notificacao,
            monitor: item.monitor.nome,
            hora: ArrumaHora2(item.data),
          }));
          setData(newData);
        } else {
          setData([]);
          setEstado(true);
          setMensagem("Não há notificações para exibir");
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

    const imagens = async (item) => {
    const requisicao = createAPI();
  
    try {
      let response = await requisicao.get(`/notificacao/imagens/${item.id_notificacao}`);
      let newData =
        response.data.data && response.data.data.length > 0
          ? response.data.data.map((item) => ({
              imagem: item.imagem ? item.imagem : undefined,
            }))
          : undefined;
  console.log(newData);
      if (!newData || newData.every((item) => item.imagem === undefined)) {
        response = await requisicao.get(`/trigger/imagens/${item.id_notificacao}`);
        newData =
          response.data.data && response.data.data.length > 0
            ? response.data.data.map((item) => ({
                imagem: item.imagem ? item.imagem : undefined,
              }))
            : undefined;
      }
  
      setDataImagem(newData);
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
  
    open();
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
              data[index].cancelada = "S";
              data[index].cancelada_motivo = motivo;
              data[index].pendente = "Cancelado";
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

  const handleConsultaSelected = (consulta) => {
    handleFiltro(consulta);
  };

  const handleFiltro = (where) => {
    setEstadoLoading(true);
    setEstado(false);
    setMensagem("");
    const requisicao = createAPI();
    const base64 = btoa(where);
    requisicao
      .get(`/notificacao/?query=${base64}`)
      .then((response) => {
        setEstadoLoading(false);
        if (response.data.msg.resultado) {
          setEstado(false);
          const newData = response.data.data.map((item) => ({
            data: ArrumaHora(item.data),
            placa: item.veiculo.placa,
            cancelada: item.cancelada,
            cancelada_motivo: item.cancelada_motivo,
            vaga: item.vaga,
            pendente:
              item.pago === "S"
                ? "Quitado"
                : item.cancelada === "S"
                ? "Cancelado"
                : item.infracao === "S"
                ? "Infração"
                : "Pendente",
            fabricante: item.veiculo.modelo.fabricante.nome,
            modelo: item.veiculo.modelo.nome,
            tipo: item.tipo_notificacao.nome,
            valor: item.valor,
            id_vaga_veiculo: item.id_vaga_veiculo,
            id_notificacao: item.id_notificacao,
            monitor: item.monitor.nome,
            hora: ArrumaHora2(item.data),
          }));
          setData(newData);
        } else {
          setData([]);
          setEstado(true);
          setMensagem("Não há notificações para exibir");
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
      <Modal
        size="xl"
        opened={opened}
        onClose={() => close()}
        title="Ver imagens"
        centered
      >
        <Carousel slideSize="80%" slideGap="sm">
          {dataImagem === undefined || dataImagem.length === 0 ? (
            <Carousel.Slide>
              <img
                src="../../assets/img/imagemError.png"
                alt="Imagem notificação"
                width="100%"
              />
            </Carousel.Slide>
          ) : (
            dataImagem.map((item, index) => (
              <Carousel.Slide key={index}>
                {item.imagem ? (
                  <img
                    src={item.imagem}
                    alt="Imagem notificação"
                    width="100%"
                  />
                ) : (
                  <img
                    src="../../assets/img/imagemError.png"
                    alt="Imagem notificação"
                    width="100%"
                  />
                )}
              </Carousel.Slide>
            ))
          )}
        </Carousel>
      </Modal>
      <p className="mx-3 text-start fs-4 fw-bold">Listar notificações</p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-6 mx-2">
              <Filtro
                nome={"ListarNotificacoesAdmin"}
                onConsultaSelected={handleConsultaSelected}
                onLoading={estadoLoading}
              />
            </div>
            <div className="col-2 text-end">
              <button
                className="btn3 botao p-0 w-75 h-100"
                type="button"
                onClick={() => {
                  createPDF();
                }}
              >
                <AiFillPrinter size={21} />
              </button>
            </div>
            <div className="col-2 text-end">
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "blue", deg: 60 }}
                radius="md"
                size="sm"
                onClick={() => reload()}
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
                            Data
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Placa
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Vaga
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Estado
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Fabricante
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Modelo
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Tipo
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Valor
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios2"
                            scope="col"
                          >
                            Hora
                          </th>
                          <th className="border-bottom" scope="col">
                            ‎‎
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, index) => (
                          <tr
                            key={index}
                            className={
                              item.cancelada === "S" ? "bg-gray-50" : ""
                            }
                          >
                            <td>{item.data}</td>
                            <td>{item.placa}</td>
                            <td> {item.vaga}</td>
                            <td
                              style={
                                item.pendente === "Quitado"
                                  ? { color: "green" }
                                  : { color: "red" }
                              }
                            >
                              {" "}
                              {item.pendente}
                            </td>
                            <td id="tabelaUsuarios2">{item.fabricante}</td>
                            <td id="tabelaUsuarios2">{item.modelo}</td>
                            <td id="tabelaUsuarios2">{item.tipo}</td>
                            <td id="tabelaUsuarios2">{item.valor}</td>
                            <td id="tabelaUsuarios2">{item.hora}</td>
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
                                <div className="dropdown-menu dashboard-dropdown dropdown-menu-start mt-3 py-1">
                                  <h6
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={() => imagens(item, index)}
                                  >
                                    <FaImages /> ‎‎ Ver imagens
                                  </h6>
                                  <h6
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={() => mostrar(item, index)}
                                  >
                                    <FaEye />
                                    ‎‎ Ver mais
                                  </h6>
                                  {item.cancelada === "N" &&
                                  item.pendente === "Pendente" ? (
                                    <h6
                                      className="dropdown-item d-flex align-items-center text-danger"
                                      onClick={() => cancelar(item, index)}
                                    >
                                      <FaPowerOff />
                                      ‎‎ Cancelar notificação
                                    </h6>
                                  ) : null}
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
          <Pagination
            value={currentPage}
            size="sm"
            onChange={handlePageChange}
            total={
              Math.floor(data.length / 50) === data.length / 50
                ? data.length / 50
                : Math.floor(data.length / 50) + 1
            }
            limit={itemsPerPage}
          />
        </Group>
      </div>
      <VoltarComponente />
    </div>
  );
};

export default ListarNotificacoesAdmin;