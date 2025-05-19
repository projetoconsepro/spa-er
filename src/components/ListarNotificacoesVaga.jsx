import { React, useState, useEffect } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import Swal from "sweetalert2";
import moment from "moment";
import FuncTrocaComp from "../util/FuncTrocaComp";
import Filtro from "../util/Filtro";
import createAPI from "../services/createAPI";
import { Button, Group, Pagination } from "@mantine/core";
import CarroLoading from "./Carregamento";
import { IconReload } from "@tabler/icons-react";
import { ArrumaHora2, ArrumaHora3 } from "../util/ArrumaHora";
import { TfiWrite } from "react-icons/tfi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { IconMapSearch } from "@tabler/icons-react";
import Mapa from "../util/Mapa";
import BotaoPadrao from "../util/BotaoPadrao"; // ajuste o caminho se necessário


const ListarNotificacoesVaga = () => {
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [mostrarColunasCompletas, setMostrarColunasCompletas] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [enderecoMapa, setEnderecoMapa] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    localStorage.removeItem("autoInfracao");
    for (let i = 0; i < 8; i++) {
      localStorage.removeItem(`fotoInfracao`);
    }

    reload();
  }, []);

  const abrirMapa = (item) => {
    setEnderecoMapa(item.endereco || item.local || "");
    open();
  };

  const mostrar = async (item) => {
    const width = window.innerWidth;
    if (width < 768) {
      Swal.fire({
        title: "Informações da notificação",
        html: `<p><b>Data:</b> ${item.data}</p>
                   <p><b>Placa:</b> ${item.placa}</p>
                   <p><b>Estado:</b> ${
                     item.pendente === "Pendente" ? "Pendente" : "Quitado"
                   }</p>
                   <p><b>Modelo:</b> ${item.modelo}</p>
                   <p><b>Fabricante:</b> ${item.fabricante}</p>
                   <p><b>Cor do veículo:</b> ${item.cor}</p>
                   <p><b>Tipo:</b> ${item.tipo}</p>
                   <p><b>Valor:</b> R$${item.valor}</p>
                   <p><b>Monitor:</b> ${item.monitor}</p>
                   <p><b>Hora:</b> ${item.hora}</p>`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Auto de infração",
        cancelButtonText: "Fechar",
      }).then((result) => {
        if (result.isDismissed) {
          Swal.close();
        } else if (result.isConfirmed) {
          localStorage.setItem("autoInfracao", JSON.stringify(item));
          FuncTrocaComp("AutoInfracao");
        }
      });
    } else {
      localStorage.setItem("autoInfracao", JSON.stringify(item));
      FuncTrocaComp("AutoInfracao");
    }
  };

  const reload = () => {
    setEstado(false);
    setMensagem("");
    setMostrarColunasCompletas(false);
    setEstadoLoading(true);
    const requisicao = createAPI();

    requisicao
      .get("/notificacao/recentes")
      .then((response) => {
        const rawData = response.data.data;

        rawData.forEach((item, i) => {
          if (!item) {
            console.warn(`Item nulo no índice ${i}`);
          } else if (!item.placa) {
            console.warn(`Item sem placa no índice ${i}:`, item);
          }
        });

        if (response.data.msg.resultado && rawData.length > 0) {
          const newData = rawData
            .filter((item) => item && item.placa)
            .map((item) => ({
              placa: item.placa,
              vaga: item.vaga,
              notificacoesPendentes: item.notificacoes_pendentes,
              endereco: item.endereco,
              data: ArrumaHora3(item.data),
              cancelada: item.cancelada,
              cancelada_motivo: item.cancelada_motivo,
              pendente: item.pendente === "S" ? "Quitado" : "Pendente",
              fabricante: item.fabricante,
              modelo: item.modelo,
              tipo: item.tipo?.nome || item.tipo,
              valor: item.valor,
              cor: item.cor,
              id_vaga_veiculo: item.id_vaga_veiculo,
              id_notificacao: item.id_notificacao,
              monitor: item.monitor,
              hora: ArrumaHora2(item.hora),
            }));
          setData(newData);
          setEstado(false);
        } else {
          setData([]);
          setEstado(true);
          setMensagem("Não há notificações para exibir");
        }

        setEstadoLoading(false);
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

  const handleSort = () => {
    setData((data) =>
      [...data].sort((a, b) => {
        if (sortAsc) {
          return (
            moment(a.data, "DD/MM/YYYY").toDate() -
            moment(b.data, "DD/MM/YYYY").toDate()
          );
        } else {
          return (
            moment(b.data, "DD/MM/YYYY").toDate() -
            moment(a.data, "DD/MM/YYYY").toDate()
          );
        }
      })
    );
    setSortAsc((prevSortAsc) => !prevSortAsc);
  };


  return (
    <div className="dashboard-container">
      
      <div className="row mb-4">
        <div className="col-12">
          <div className="row g-0">
            <div className="col-7 mx-2">
             <p className="text-start fs-4 fw-bold mb-0">Notificações Emitidas Recentemente</p>
            </div>
            <div className="col-2 text-end"></div>
            <div className="col-2 text-end">
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "blue", deg: 60 }}
                radius="md"
                size="sm"
                onClick={() => reload()}
              >
                <IconReload color="white" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card border-0 shadow">
                <div className="table-responsive">
                  <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        {mostrarColunasCompletas ? (
                          <>
                            <th
                              className="border-bottom"
                              scope="col"
                              onClick={() => handleSort()}
                            >
                              Data{" "}
                              {sortAsc ? (
                                <AiOutlineArrowUp className="mb-1" size={15} />
                              ) : (
                                <AiOutlineArrowDown
                                  className="mb-1"
                                  size={15}
                                />
                              )}
                            </th>
                            <th
                              className="border-bottom coluna-mobile-hide"
                              scope="col"
                            >
                              Hora
                            </th>
                            <th className="border-bottom" scope="col">
                              Placa
                            </th>
                            <th className="border-bottom" scope="col">
                              Vaga
                            </th>
                            <th
                              className="border-bottom coluna-mobile-hide"
                              scope="col"
                            >
                              Estado
                            </th>
                            <th
                              className="border-bottom coluna-mobile-hide"
                              scope="col"
                            >
                              Fabricante
                            </th>
                            <th
                              className="border-bottom coluna-mobile-hide"
                              scope="col"
                            >
                              Modelo
                            </th>
                            <th
                              className="border-bottom coluna-mobile-hide"
                              scope="col"
                            >
                              Tipo
                            </th>
                            <th
                              className="border-bottom coluna-mobile-hide"
                              scope="col"
                            >
                              Valor
                            </th>
                            <th className="border-bottom" scope="col">
                              Ação
                            </th>
                          </>
                        ) : (
                          <>
                            <th className="border-bottom" scope="col">
                              Placa
                            </th>
                            <th className="border-bottom" scope="col">
                              Vaga
                            </th>
                            <th className="border-bottom" scope="col">
                              Notificações
                            </th>
                            <th className="border-bottom coluna-mobile-hide">
                              Endereço
                            </th>
                            <th className="border-bottom" scope="col">
                              Ação
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => {
                        if (!item || !item.placa) {
                          console.warn("Item inválido na renderização:", item);
                          return null;
                        }
                        return (
                          <tr key={index}>
                            {mostrarColunasCompletas ? (
                              <>
                                <td>{item.data}</td>
                                <td className="coluna-mobile-hide">
                                  {item.hora}
                                </td>
                                <td>{item.placa}</td>
                                <td>{item.vaga}</td>
                                <td
                                  className="coluna-mobile-hide"
                                  style={
                                    item.pendente === "Quitado"
                                      ? { color: "green" }
                                      : { color: "red" }
                                  }
                                >
                                  {item.pendente}
                                </td>
                                <td className="coluna-mobile-hide">
                                  {item.fabricante}
                                </td>
                                <td className="coluna-mobile-hide">
                                  {item.modelo}
                                </td>
                                <td className="coluna-mobile-hide">
                                  {item.tipo}
                                </td>
                                <td className="coluna-mobile-hide">
                                  {item.valor}
                                </td>
                                <td className="text-center">
                                  <div className="d-flex justify-content-center gap-3">
                                    {window.innerWidth < 768 ? (
                                      <AiOutlineInfoCircle
                                        className="cursor-pointer hover:text-blue-500"
                                        style={{ fontSize: "1.2rem" }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          mostrar(item);
                                        }}
                                      />
                                    ) : (
                                      <TfiWrite
                                        className="cursor-pointer hover:text-blue-500"
                                        style={{ fontSize: "1.2rem" }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          localStorage.setItem(
                                            "autoInfracao",
                                            JSON.stringify(item)
                                          );
                                          FuncTrocaComp("AutoInfracao");
                                        }}
                                      />
                                    )}
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{item.placa}</td>
                                <td>{item.vaga}</td>
                                <td style={{ color: "red" }}>
                                  {item.notificacoesPendentes}
                                </td>
                                <td className="coluna-mobile-hide">
                                  {item.endereco}
                                </td>
                                {/* Esconde no mobile */}
                                <td className="text-center">
                                  <div className="d-flex justify-content-center gap-3">
                                    {window.innerWidth < 768 ? (
                                      <AiOutlineInfoCircle
                                        className="cursor-pointer hover:text-blue-500"
                                        style={{ fontSize: "1.2rem" }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          mostrar(item);
                                        }}
                                      />
                                    ) : (
                                      <TfiWrite
                                        className="cursor-pointer hover:text-blue-500"
                                        style={{ fontSize: "1.2rem" }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          localStorage.setItem(
                                            "autoInfracao",
                                            JSON.stringify(item)
                                          );
                                          FuncTrocaComp("AutoInfracao");
                                        }}
                                      />
                                    )}
                                    <IconMapSearch
                                      strokeWidth={1.3}
                                      className="cursor-pointer hover:text-blue-500"
                                      style={{ fontSize: "1.2rem" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        abrirMapa(item);
                                      }}
                                    />
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
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
                {estadoLoading ? (
                  <div>
                    <CarroLoading />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <Modal
            size="xl"
            opened={opened}
            onClose={close}
            title="Endereço no mapa"
            centered
          >
            <Mapa address={`${enderecoMapa}, Centro, Taquara, RS, 95600000`} />
          </Modal>
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
          <BotaoPadrao
            onClick={() => {
              localStorage.setItem(
                "componenteAnterior",
                localStorage.getItem("componente")
              );
              localStorage.setItem("componente", "ListaAutoInfracao");
              window.location.reload();
            }}
          >
            Voltar
          </BotaoPadrao>
        </div>
      </div>
    </div>
  );
};

export default ListarNotificacoesVaga;
