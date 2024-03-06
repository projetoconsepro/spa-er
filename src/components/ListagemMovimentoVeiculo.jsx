import "jspdf-autotable";
import { React, useState, useEffect } from "react";
import { AiFillPrinter, AiOutlineReload } from "react-icons/ai";
import RelatoriosPDF from "../util/RelatoriosPDF";
import { Button, Group, Loader, Pagination } from "@mantine/core";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import createAPI from "../services/createAPI";

const ListagemMovimentoVeiculo = () => {
  const [data, setData] = useState([]);
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

  const createPDF = () => {
    const nomeArquivo = "Relatório de irregularidades";
    const dataD = data.map((item) => {
      return [
        item.hora,
        item.placa,
        item.movimento,
        item.usuario,
      ];
    });
    const cabecalho = [
      "Data",
      "Placa",
      "Movimento",
      "Usuário",
    ];
    RelatoriosPDF(nomeArquivo, cabecalho, dataD);
  };

  const FixDate = (date) => {
    const data = new Date(date);
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, "0");
    const minuto = data.getMinutes().toString().padStart(2, "0");
    const segundo = data.getSeconds().toString().padStart(2, "0");
    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
  };

  useEffect(() => {
    handdleFunc();
  }, []);

  const handdleFunc = (consulta) => {
    setEstadoLoading(true);
    setEstado(false);
    setMensagem("");

    const url = consulta
      ? `/veiculo/historico/movimento?query=${btoa(consulta)}`
      : "/veiculo/historico/movimento/";

    const requisicao = createAPI();
    requisicao
      .get(url)
      .then((response) => {
        setEstado2(true);
        setEstadoLoading(false);
        if (response.data.msg.resultado) {
          setEstado(false);
          const newData = response.data.data.map((item) => ({
            placa: item.placa,
            movimento:
              item.acao === "v.add"
                ? "Veículo Cadastrado"
                : item.acao === "v.rm"
                ? "Veículo Removido"
                : item.acao === "da.add"
                ? "Débito Automático Ativado"
                : item.acao === "da.rm"
                ? "Débito Automático Desativado"
                : "",
            usuario: item.nome,
            hora: FixDate(item.hora),
          }));
          setData(newData);
        } else {
          setData([]);
          setEstado(true);
          setMensagem("Não há histórico para exibir");
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

  const handleConsultaSelected = (consulta) => {
    handdleFunc(consulta);
  };

  return (
    <div className="dashboard-container mb-3">
      <p className="mx-3 text-start fs-4 fw-bold">Listar registros veículo</p>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-6 mx-2">
              <Filtro
                nome={"ListagemMovimentoVeiculo"}
                onConsultaSelected={handleConsultaSelected}
                onLoading={estadoLoading}
              />
            </div>
            <div className="col-3 text-end">
              <button
                className="btn3 botao p-0 w-75 h-75"
                type="button"
                onClick={() => {
                  createPDF();
                }}
              >
                <AiFillPrinter size={21} />
              </button>
            </div>
            <div className="col-1 text-end">
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "blue", deg: 60 }}
                mb="md"
                radius="md"
                size="md"
                onClick={() => {
                  handdleFunc();
                }}
              >
                <AiOutlineReload size={20} />
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
                    <table className="table table-striped table-hover table-bordered table-responsive">
                      <thead className="thead-light">
                        <tr className="text-center">
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
                            Data
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Movimento
                          </th>
                          <th
                            className="border-bottom"
                            id="tabelaUsuarios"
                            scope="col"
                          >
                            Usuário
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.placa}</td>
                            <td>{item.hora}</td>
                            <td> {item.movimento}</td>
                            <td>{item.usuario}</td>
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

export default ListagemMovimentoVeiculo;
