import { React, useState, useEffect } from "react";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineReload,
} from "react-icons/ai";
import Swal from "sweetalert2";
import moment from "moment";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import createAPI from "../services/createAPI";
import { Button, Group, Pagination } from "@mantine/core";
import CarroLoading from "./Carregamento";
import {ArrumaHora2, ArrumaHora3} from "../util/ArrumaHora";

const ListaAutoInfracao = () => {
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [estadoLoading, setEstadoLoading] = useState(false);

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
    const width = window.innerWidth;
    if (width < 768) {
      Swal.fire({
        title: "Informações da notificação",
        html: `<p><b>Data:</b> ${item.data}</p>
                   <p><b>Placa:</b> ${item.placa}</p>
                   <p><b>Modelo:</b> ${item.modelo}</p>
                   <p><b>Cor do veículo:</b> ${item.cor}</p>
                   <p><b>Hora:</b> ${item.hora}</p>`,
        showConfirmButton: true,
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isDismissed) {
          Swal.close();
        } else if (result.isConfirmed) {
          Swal.close();
        }
      });
    } else {
      Swal.close();
    }
  };

  const reload = () => {
    setEstado(false);
    setEstadoLoading(true);
    setMensagem("");
    const requisicao = createAPI();
    requisicao
      .get("/notificacao/infracao")
      .then((response) => {
        setEstadoLoading(false);
        if (response.data.msg.resultado) {
          setEstado(false);
          const newData = response.data.data.map((item) => ({
            data: ArrumaHora3(item.hora),
            placa: item.placa,
            modelo: item.modelo,
            cor: item.cor,
            vaga: item.numero,
            hora: ArrumaHora2(item.hora),
          }));
          setData(newData);
        } else {
          setData([]);
          setEstado(true);
          setMensagem("Nenhum auto de infração encontrado");
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
      .get(`/notificacao/infracao/?query=${base64}`)
      .then((response) => {
        setEstadoLoading(false);
        if (response.data.msg.resultado) {
          setEstado(false);
          const newData = response.data.data.map((item) => ({
            data: ArrumaHora3(item.hora),
            placa: item.placa,
            modelo: item.modelo,
            cor: item.cor,
            vaga: item.numero,
            hora: ArrumaHora2(item.hora),
          }));
          setData(newData);
        } else {
          setData([]);
          setEstado(true);
          setMensagem(response.data.msg.msg);
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
    <div className="dashboard-container">
      <p className="mx-3 text-start fs-4 fw-bold">Autos de Infração</p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-7 mx-2">
              <Filtro
                nome={"ListaAutoInfracao"}
                onConsultaSelected={handleConsultaSelected}
                onLoading={estadoLoading}
              />
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
              <div className="card border-0 shadow">
                <div className="table-responsive">
                  <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th
                          className="border-bottom"
                          id="tabelaUsuarios"
                          scope="col"
                          onClick={() => {
                            handleSort();
                          }}
                        >
                          Data{" "}
                          {sortAsc ? (
                            <AiOutlineArrowUp className="mb-1" size={15} />
                          ) : (
                            <AiOutlineArrowDown className="mb-1" size={15} />
                          )}
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
                          Hora
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => (
                        <tr
                          key={index}
                          onClick={() => {
                            mostrar(item);
                          }}
                        >
                          <td>{item.data}</td>
                          <td>{item.placa}</td>
                          <td> {item.vaga}</td>
                          <td id="tabelaUsuarios2">{item.modelo}</td>
                          <td id="tabelaUsuarios2">{item.hora}</td>
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
                {data.length === 0 &&
                mensagem !== "Nenhuma infração encontrada" ? (
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
        </div>
      </div>
    </div>
  );
};

export default ListaAutoInfracao;
