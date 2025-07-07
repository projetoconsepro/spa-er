import { React, useState, useEffect } from "react";
import {
  Button,
  Card,
  Divider,
  Group,
  Input,
  Text,
  Pagination,
} from "@mantine/core";
import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import Swal from "sweetalert2";
import createAPI from "../services/createAPI";
import Filtro from "../util/Filtro";
import CarroLoading from "./Carregamento";
import VoltarComponente from "../util/VoltarComponente";
import { ArrumaHora } from "../util/ArrumaHora";
import { RiDeleteBinFill } from "react-icons/ri";

const AdicionarMensagem = () => {
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mensagemFinanceira, setMensagemFinanceira] = useState("");
  const [step, setStep] = useState(1);
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const itemsPerPage = 50;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  useEffect(() => {
    handleRequest();
  }, []);


  const submit = async () => {

    if (mensagemFinanceira !== "") {
      if (mensagemFinanceira.length <= 200) {
        const requisicao = createAPI();
        await requisicao
            .post(`/financeiro/mensagem/`, {
              mensagem: mensagemFinanceira,
            })
            .then((response) => {
              if (response.data.msg.resultado) {
                setEstado(false);
                setMensagem("");
                setMensagemFinanceira("");
                setStep(1);
                setData((prevData) => [
                  {
                    data: ArrumaHora(response.data.data),
                    texto: response.data.mensagem,
                  },
                  ...prevData,
                ]);
                Swal.fire({
                  icon: "success",
                  title: "Sucesso!",
                  text: "Mensagem adicionada com sucesso!",
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Erro!",
                  text: response.data.msg.msg,
                });
              }
            })
            .catch(function (error) {
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
                setEstado(true);
                setMensagem(error?.response?.data?.msg);
              }
            });
      
      } else {
        setEstado(true);
        setMensagem("Limite de 200 caracteres excedido!");
        setTimeout(() => {
          setEstado(false);
          setMensagem("");
        }, 3000);

      }
    } else {
      setEstado(true);
      setMensagem("Preencha a mensagem!");
      setTimeout(() => {
        setEstado(false);
        setMensagem("");
      }, 3000);
    }
  };

  const handleConsultaSelected = (consulta) => {
    handleRequest(consulta);
  };

  const handleRequest = (query) => {
    setEstadoLoading(true);
    const requisicao = createAPI();
    let url = `financeiro/mensagem/`;
    if (query !== undefined) {
      const base64 = btoa(query);
      url = `financeiro/mensagem/?query=${base64}`;
    }
    requisicao
      .get(url)
      .then((response) => {
        if (response.data.msg.resultado) {
          setMensagem("");
          setEstado(false);
          
          const newData = response?.data?.data?.map((item) => ({
            data: ArrumaHora(item.data),
            texto: item.texto,
            id_mensagem: item.id_mensagem,
          }));
          setData(newData);
          setEstadoLoading(false);
        } else {
          setData([]);
          setEstado(true);
          setMensagem(response.data.msg.msg);
          setEstadoLoading(false);
        }
      })
      .catch(function (error) {
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
          setEstado(true);
          setMensagem(error?.response?.data?.msg);
          setEstadoLoading(false);
        }
      });
  };
  const handleDelete = (item) => {
    Swal.fire({
      title: 'Tem certeza que deseja deletar a mensagem?',
      icon: "error",
      showCancelButton: true,
      cancelButtonText: "Não",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim",
    }).then((result) => {
      if (result.isConfirmed) {
        const requisicao = createAPI();
        const id_mensagem = item;
        requisicao
          .delete(`/financeiro/mensagem/${id_mensagem}`)
          .then((response) => {
            Swal.fire(
              "Deletado!",
              "A Mensagem foi deletada com sucesso.",
              "success"
            );
            setData((prevData) =>
              prevData.filter(
                (data) => data.id_mensagem !== item
              )
            );
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


  return (<div><p className="mx-3 text-start fs-4 fw-bold">Gerenciar Mensagens de Compra</p>

    <Card shadow="sm" radius="md" className="mx-lg-2 p-lg-3 p-0" withBorder>
      <Card
        shadow="sm"
        radius="xs"
        className="bg-admin-parceiro"
        withBorder={false}
      >
        {step === 2 ? (
          <>
            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>Adicionar Mensagem:</Text>
            </Group>
            <div className="text-start">
              <Divider my="sm" size="sm" variant="dashed" />


              <Input.Wrapper label="Digite a mensagem que os clientes verão após realizar uma compra" mt="md">
                <Input
                  component="textarea"
                  value={mensagemFinanceira}
                  onChange={(e) => setMensagemFinanceira(e.currentTarget.value)}
                  minRows={10}
                  maxLength={200}
                  styles={{
                    input: { minHeight: 110, fontWeight: "normal" }
                  }}
                />
              </Input.Wrapper>

              <Button
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
                fullWidth
                mt="lg"
                radius="md"
                onClick={() => submit()}
              >
                Adicionar ‎ <IconChevronRight color="white" mt="3" size={15} />
              </Button>
            </div>
            <div
              className="alert alert-danger mt-3"
              role="alert"
              style={{ display: estado ? "block" : "none" }}
            >
              {mensagem}
            </div>
            <Button
              className={"bg-gray-500 mx-2"}
              size="md"
              mt={40}
              radius="md"
              onClick={() => {
                setStep(1);
              }}
            >
              Voltar
            </Button>
          </>
        ) : (
          <>
            <div className="row mb-3">
              <div className="col-12">
                <div className="row" style={{ padding: "0.15rem" }}>
                  <div className="col-6">
                    <Filtro
                      nome={"AdicionarMensagem"}
                      onConsultaSelected={handleConsultaSelected}
                      onLoading={estadoLoading}
                    />
                  </div>
                  <div className="col-6 text-center">
                    <Button
                      variant="gradient"
                      gradient={{ from: "cyan", to: "blue", deg: 60 }}
                      fullWidth
                      onClick={() => {
                        setStep(2);
                        setEstado(false);
                      }}
                    >
                      <IconPlus color="white" mt="3" size={15} /> ‎ Adicionar Mensagem
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 ps-3">
                <div className="row">
                  <div className="col-12 mb-4 p-0 px-lg-3">
                    <div className="card border-0 shadow">
                      {data.length === 0 && mensagem !== "Nenhuma mensagem encontrada!" ? (
                        <div>
                          <CarroLoading />
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table align-items-center table-flush">
                            <thead className="thead-light">
                              <tr>
                                <th
                                  className="border-bottom text-start"
                                  id="tabelaUsuarios"
                                  scope="col"
                                >
                                  <span className="ps-2 ps-lg-4">Mensagem</span>
                                </th>
                                <th
                                  className="border-bottom border-start text-start"
                                  id="tabelaUsuarios2"
                                  scope="col"
                                  style={{ width: '20%' }}
                                ><span className="ps-4">
                                    Data
                                  </span>
                                </th>
                                <th className="border-bottom border-start d-table-cell d-lg-none" style={{ width: '15%' }}></th>

                                <th className="border-bottom border-start d-none d-lg-table-cell" style={{ width: '5%' }}></th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentItems.map((item, index) => (
                                <tr key={index}>

                                  <div className="ps-2 ps-lg-4 border-bottom"><td className=" text-start ps-2 ps-lg-4">
                                    <span
                                      style={{
                                        fontSize: "0.87em",
                                        whiteSpace: "pre-line",
                                        wordBreak: "break-word"
                                      }}
                                    >
                                      {item.texto}
                                    </span>

                                  </td></div>
                                  <td id="tabelaUsuarios2" className="text-start border-start"><span className="ps-4">{item.data}</span></td>
                                  <td className="border-start text-center">
                                    <RiDeleteBinFill
                                      style={{ cursor: "pointer", fontSize: "1.3em" }}
                                      onClick={() => handleDelete(item.id_mensagem)}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div
                        className="alert alert-danger mt-4 mx-3"
                        role="alert"
                        style={{ display: estado ? "block" : "none" }}
                      >
                        {mensagem}
                      </div>
                    </div>
                  </div>
                  <Group position="center" mb="md">
                    <Pagination
                      value={currentPage}
                      size="sm"
                      onChange={handlePageChange}
                      total={
                        Math.floor(data.length / 50) ===
                          data.length / 50
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
          </>
        )}
      </Card>
    </Card></div>
  );
};

export default AdicionarMensagem;
