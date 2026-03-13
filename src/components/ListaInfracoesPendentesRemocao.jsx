
import { React, useState, useEffect } from "react";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineCheck,
  AiOutlineReload,
} from "react-icons/ai";
import Swal from "sweetalert2";
import moment from "moment";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import createAPI from "../services/createAPI";
import { Button, Group, Pagination } from "@mantine/core";
import CarroLoading from "./Carregamento";

const ListaInfracoesPendentesRemocao = () => {
  const [data, setData] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const reload = () => {
    setIsLoading(true);
    setMensagem("");
    setData([]);
    fetchInfracoes();
  };

  const fetchInfracoes = async () => {
    const api = createAPI();
    try {
      const response = await api.get('/infracoes/pendentes-remocao');
      console.log(response.data);
      if (response.data.msg.resultado) {
        setData(response.data.data);
      } else {
        setMensagem(response.data.msg.msg);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setMensagem(error.response.data.msg);
    }
  };

  useEffect(() => {
    fetchInfracoes();
  }, []);

  const handleRemocao = (item) => {
   Swal.fire({
    title: 'Infração Pendente de Remoção Foi Cancelada?',
    text: 'Confirme somente se a infração foi cancelada juntamente ao sistema do DETRAN, caso contrário, não confirme.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
   }).then(async (result) => {
    if (result.isConfirmed) {
       const api = createAPI();
       try {
        const response = await api.post('/infracoes/remover', { infracao: item.id_infracao });
        if (response.data.msg.resultado) {
          Swal.fire({
            title: 'Infração Removida',
            text: 'A infração foi removida com sucesso.',
            icon: 'success',
          });
          reload();
        }
       } catch (error) {
        console.log(error);
       }
    }
   })
  }
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div className="dashboard-container">
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between">
        <p className="mx-3 text-start fs-4 fw-bold">Autos de Infração Pendentes de Remoção</p>
            <div className="text-end">
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
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card border-0 shadow">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr className="border-bottom">
                        <th>Placa</th>
                        <th>Código AI</th>
                        <th>Data</th>
                        <th id="tabelaUsuarios2">Cor</th>
                        <th id="tabelaUsuarios2">Modelo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.id} className="align-middle">
                          <td>{item.placa}</td>
                          <td>{item.codigo_ai}</td>
                          <td>{moment(item.data).format('DD/MM/YYYY HH:mm')}</td>
                          <td id="tabelaUsuarios2">{item.cor}</td>
                          <td id="tabelaUsuarios2">{item.modelo}</td>
                          <td>
                            <Button variant="gradient" gradient={{ from: "indigo", to: "blue", deg: 60 }} radius="md" size="sm" onClick={() => handleRemocao(item)}  >
                              <AiOutlineCheck color="white" size={20} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  className="alert alert-danger mt-4 mx-3"
                  role="alert"
                  style={{ display: mensagem ? "block" : "none" }}
                >
                  {mensagem}
                </div>
                {isLoading ? (
                  <CarroLoading />
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

export default ListaInfracoesPendentesRemocao;