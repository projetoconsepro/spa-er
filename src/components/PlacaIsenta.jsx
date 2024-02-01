import { React, useState, useEffect } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import createAPI from "../services/createAPI";
import { useDisclosure } from "@mantine/hooks";
import { Button, Group, Pagination, Modal, TextInput } from "@mantine/core";
import CarroLoading from "./Carregamento";

const PlacaIsenta = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [textoPlaca, setTextoPlaca] = useState("");

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

  const mostrar = async (item) => {
    Swal.fire({
      title: "Veículo isento",
      html: `
                   <p><b>Placa:</b> ${item.placa}</p>
                   <p><b>Estado:</b> ${
                     item.ativo
                   }</p>
                   <p><b>Modelo:</b> ${item.modelo}</p>
                   <p><b>Cor do veículo:</b> ${item.cor}</p>`,
      background: item.ativo === "Ativo" ? "#fff" : "#f8d7da",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Editar",
      cancelButtonText: "Fechar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Editar placa isenta",
          html: `
          <div class="form-group">
          <label for="nome" class="form-label col-3 fs-6">Placa isenta:</label>
          <input type="radio" id="ativo" name="ativo" value="Ativo" ${
            item.ativo === "Ativo" ? "checked" : ""
          }>
          <label for="ativo">Ativo</label>
          <input type="radio" id="inativo" name="ativo" value="Inativo" ${
            item.ativo === "Inativo" ? "checked" : ""
          }>
          <label for="inativo">Inativo</label>
        </div>`,
          background: item.ativo === "Ativo" ? "#fff" : "#f8d7da",
          showCancelButton: true,
          confirmButtonText: "Salvar",
          confirmButtonColor: "#3A58C8",
          cancelButtonText: "Cancelar",
          showLoaderOnConfirm: true,
          preConfirm: () => {
            const ativoValue = document.querySelector(
              'input[name="ativo"]:checked'
            ).value;
            const requisicao = createAPI();
            requisicao.put(`/veiculo/veiculo-isento/`, {
                placa: item.placa,
                ativo: ativoValue === "Ativo" ? "S" : "N",
            }).then((response) => {
                if (response.data.msg.resultado) {
                    Swal.fire({
                    title: "Sucesso!",
                    text: "Placa isenta editada com sucesso!",
                    icon: "success",
                    confirmButtonText: "Fechar",
                    confirmButtonColor: "#3A58C8",
                    }).then((result) => {
                    if (result.isConfirmed) {
                        reload();
                    }
                    });
                } else {
                    Swal.fire({
                    title: "Erro!",
                    text: "Erro ao editar placa isenta!",
                    icon: "error",
                    confirmButtonText: "Fechar",
                    confirmButtonColor: "#3A58C8",
                    });
                }
                });
          },
          allowOutsideClick: () => !Swal.isLoading(),
        });
      }
    });
  };

  const reload = () => {
    setEstado(false);
    setMensagem("");
    const requisicao = createAPI();
    requisicao
      .get("/veiculo/veiculo-isento")
      .then((response) => {
        if (response.data.msg.resultado) {
          setEstado(false);
          const newData = response.data.data.map((item) => ({
            placa: item.placa,
            id_veiculo: item.veiculo_id_veiculo,
            cor: item.cor,
            ativo: item.ativo === "S" ? "Ativo" : "Inativo",
            modelo: item.modelo,
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

  const handleConsultaSelected = (consulta) => {
    handleFiltro(consulta);
  };

  const handleFiltro = (where) => {
    setEstado(false);
    setEstadoLoading(true);
    setMensagem("");
    const requisicao = createAPI();
    const base64 = btoa(where);
    requisicao
      .get(`/veiculo/veiculo-isento/?query=${base64}`)
      .then((response) => {
        setEstadoLoading(false);

        if (response.data.msg.resultado) {
            setEstado(false);
            const newData = response.data.data.map((item) => ({
              placa: item.placa,
              id_veiculo: item.veiculo_id_veiculo,
              cor: item.cor,
              ativo: item.ativo === "S" ? "Ativo" : "Inativo",
              modelo: item.modelo,
            }));
            setData(newData);
          } else {
            setData([]);
            setEstado(true);
            setMensagem("Não há placas para exibir");
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

  const adicionarPlacaIsenta = () => {
    const requisicao = createAPI();
    requisicao
      .post(`/veiculo/veiculo-isento/`, {
        placa: textoPlaca,
      })
      .then((response) => {
        if (response.data.msg.resultado) {
          Swal.fire({
            title: "Sucesso!",
            text: response.data.msg.msg,
            icon: "success",
            confirmButtonText: "Fechar",
            confirmButtonColor: "#3A58C8",
          }).then((result) => {
            if (result.isConfirmed) {
              reload();
              close();
            }
          });
        } else {
          Swal.fire({
            title: "Erro!",
            text: response.data.msg.msg,
            icon: "error",
            confirmButtonText: "Fechar",
            confirmButtonColor: "#3A58C8",
          });
        }
      });
  };

  return (
    <div className="dashboard-container">
      <p className="mx-3 text-start fs-4 fw-bold">Placas isentas</p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-7 mx-1">
              <Filtro
                nome={"PlacaIsenta"}
                onConsultaSelected={handleConsultaSelected}
                onLoading={estadoLoading}
              />
            </div>
            <div className="col-4 text-center">
              <Button
                variant="gradient"
                gradient={{ from: "cyan", to: "blue", deg: 60 }}
                fullWidth
                onClick={() => open()}
              >
                Adicionar Placa ‎
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
                          Estado
                        </th>
                        <th
                          className="border-bottom"
                          id="tabelaUsuarios"
                          scope="col"
                        >
                          Modelo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => (
                        <tr
                          key={index}
                          style={{ backgroundColor: item.ativo === 'Ativo' ? '#fff' : '#f8d7da'}}
                          onClick={() => {
                            mostrar(item);
                          }}
                        >
                          <td>{item.placa}</td>
                          <td id="tabelaUsuarios">{item.ativo}</td>
                          <td id="tabelaUsuarios">{item.modelo}</td>
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

                {data.length === 0 && mensagem !== "Não há placas para exibir" ?  (
                  <div>
                    <CarroLoading />
                  </div>
                ) : null}
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
          <VoltarComponente />
          <Modal
            opened={opened}
            onClose={close}
            title="Adicionar placa isenta"
            centered
          >
            <div className="mb-4">
              <TextInput
                label="Placa"
                placeholder="Digite a placa"
                value={textoPlaca}
                onChange={(e) => setTextoPlaca(e.target.value)}
              />
            </div>
            <div className="mt-auto">
              <Group position="center" spacing="sm" grow>
                <Button
                  color="gray"
                  onClick={() => {
                    close();
                  }}
                >
                  Voltar
                </Button>
                <Button
                  loading={estadoLoading}
                  onClick={() => {
                    adicionarPlacaIsenta();
                  }}
                  loaderPosition="right"
                >
                  Salvar
                </Button>
              </Group>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PlacaIsenta;
