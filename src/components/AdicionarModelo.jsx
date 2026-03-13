import { React, useState, useEffect } from "react";
import {
  Button,
  Card,
  Divider,
  Group,
  Input,
  Select,
  Text,
  Checkbox,
  Pagination,
} from "@mantine/core";
import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import Swal from "sweetalert2";
import createAPI from "../services/createAPI";
import { FaCarAlt } from "react-icons/fa";
import Filtro from "../util/Filtro";
import CarroLoading from "./Carregamento";
import VoltarComponente from "../util/VoltarComponente";

const AdicionarModelo = () => {
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [fabricantes, setFabricantes] = useState([]);
  const [fabricantesSelect, setFabricantesSelect] = useState([]);
  const [modelo, setModelo] = useState("");
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(1);
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fabricanteModelo, setFabricanteModelo] = useState("");
  const itemsPerPage = 50;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fabricanteModelo.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const getFabricantes = () => {
    const requisicao = createAPI();
    requisicao
      .get(`/veiculo/fabricantes/`)
      .then((response) => {
        const newData = response?.data?.data?.fabricantes.map((item) => ({
          label: item.nome,
          value: item.id_fabricante_veiculo,
        }));
        setFabricantes(newData);
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
          console.log(error);
        }
      });
  };

  useEffect(() => {
    handleRequest();
    getFabricantes();
  }, []);

  const submit = async () => {
    if (
      (fabricante !== "" || fabricantesSelect.length !== 0) &&
      modelo !== ""
    ) {
      const findByIndex = fabricantes.find(
        (item) => item.value === fabricantesSelect
      );
      const requisicao = createAPI();
      const postModelos = async () => {
        await requisicao
          .post(`/veiculo/modelos/`, {
            fabricante: checked ? fabricante : findByIndex.label,
            modelo: modelo,
          })
          .then((response) => {
            if (response.data.msg.resultado) {
              setEstado(false);
              setMensagem("");
              setModelo("");
              getFabricantes();
              handleRequest();
              setStep(1);
              Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Modelo adicionado com sucesso!",
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
      };

      if (checked) {
        await requisicao
          .post(`/veiculo/fabricante/`, {
            fabricante: checked ? fabricante : findByIndex.label,
          })
          .then((response) => {
            if (response.data.msg.resultado) {
              postModelos();
              setEstado(false);
              setMensagem("");
              setModelo("");
              getFabricantes();
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
        postModelos();
      }
    } else {
      setEstado(true);
      setMensagem("Preencha todos os campos!");
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

    let url = `veiculo/fabricantes/modelos/`;

    if (query !== undefined) {
      const base64 = btoa(query);

      url = `veiculo/fabricantes/modelos/?query=${base64}`;
    }

    requisicao
      .get(url)
      .then((response) => {
        if (response.data.msg.resultado) {
          setMensagem("");
          setEstado(false);
          const newData = response?.data?.data?.map((item) => ({
            fabricante: item.fabricante,
            modelo: item.modelo,
          }));

          setFabricanteModelo(newData);

          setEstadoLoading(false);
        } else {
          setFabricanteModelo([]);
          setEstado(true);
          setMensagem(response.data.msg.msg);
          setEstadoLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error?.response?.data);
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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card
        shadow="sm"
        padding="lg"
        radius="xs"
        className="bg-admin-parceiro"
        withBorder={false}
      >
        {step === 2 ? (
          <>
            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>Adicionar veículo:</Text>
            </Group>
            <div className="text-start">
              <Divider my="sm" size="sm" variant="dashed" />

              <Checkbox
                label="Fabricante não cadastrado"
                onChange={(e) => setChecked(e.currentTarget.checked)}
              />

              {checked ? (
                <Input.Wrapper label="Escolha o fabricante do veículo" mt="md">
                  <Input
                    icon={<FaCarAlt />}
                    placeholder=""
                    value={fabricante}
                    onChange={(e) => setFabricante(e.currentTarget.value)}
                  />
                </Input.Wrapper>
              ) : (
                <Select
                  label="Escolha o fabricante"
                  className="mt-4"
                  value={fabricantesSelect}
                  data={fabricantes}
                  onChange={(e) => setFabricantesSelect(e)}
                  searchable
                  nothingFound="Sem resultados"
                />
              )}

              <Group position="left" mt="md" mb="xs">
                <Input.Wrapper label="Escolha o modelo do veículo" mt="md">
                  <Input
                    icon={<FaCarAlt />}
                    placeholder=""
                    value={modelo}
                    onChange={(e) => setModelo(e.currentTarget.value)}
                  />
                </Input.Wrapper>
              </Group>

              <Button
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
                fullWidth
                mt="md"
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
                <div className="row">
                  <div className="col-5 mx-1">
                    <Filtro
                      nome={"AdicionarModelo"}
                      onConsultaSelected={handleConsultaSelected}
                      onLoading={estadoLoading}
                    />
                  </div>
                  <div className="col-6 text-center">
                    <Button
                      variant="gradient"
                      gradient={{ from: "cyan", to: "blue", deg: 60 }}
                      fullWidth
                      onClick={() => setStep(2)}
                    >
                      <IconPlus color="white" mt="3" size={15} /> ‎ Adicionar
                      Modelo / Fabricante
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
                      {fabricanteModelo.length === 0 && mensagem !== "Nenhum registro encontrado" ? (
                        <div>
                          <CarroLoading />
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table align-items-center table-flush">
                            <thead className="thead-light">
                              <tr>
                                <th
                                  className="border-bottom"
                                  id="tabelaUsuarios"
                                  scope="col"
                                >
                                  Fabricante
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
                                <tr key={index}>
                                  <td>{item.fabricante}</td>
                                  <td id="tabelaUsuarios">{item.modelo}</td>
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
                        Math.floor(fabricanteModelo.length / 50) ===
                        fabricanteModelo.length / 50
                          ? fabricanteModelo.length / 50
                          : Math.floor(fabricanteModelo.length / 50) + 1
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
    </Card>
  );
};

export default AdicionarModelo;
