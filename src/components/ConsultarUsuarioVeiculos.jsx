import { React, useState, useEffect } from "react";
import {
  Input,
  Button,
  Badge,
  Paper,
  Alert,
  Modal,
  LoadingOverlay,
  Tooltip,
} from "@mantine/core";
import { IconSearch, IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaCar, FaUser } from "react-icons/fa";
import { MdCarCrash } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import { cpf, cnpj } from "cpf-cnpj-validator";
import Swal from "sweetalert2";
import VoltarComponente from "../util/VoltarComponente";
import createAPI from "../services/createAPI";
import validarPlaca from "../util/validarPlaca";
import extrairNumeros from "../util/extrairNumeros";

const ConsultarUsuarioVeiculos = () => {
  const [valor, setValor] = useState("");
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [resultados, setResultados] = useState(null);

  const [modalVeiculoAberto, setModalVeiculoAberto] = useState(false);
  const [idUsuarioVeiculo, setIdUsuarioVeiculo] = useState(null);
  const [placaClasse, setPlacaClasse] = useState("placa");
  const [textoPlacaNovo, setTextoPlacaNovo] = useState("");
  const [limitePlaca, setLimitePlaca] = useState(8);
  const [inputPlacaClasse, setInputPlacaClasse] = useState("inputvazio");
  const [contPlaca, setContPlaca] = useState(0);
  const [estadoPlaca, setEstadoPlaca] = useState(false);
  const [mensagemPlaca, setMensagemPlaca] = useState("");
  const [loadingPlaca, setLoadingPlaca] = useState(false);

  const [alturaResultados, setAlturaResultados] = useState(
    typeof window !== "undefined" && window.innerWidth < 576 ? 640 : 580
  );

  useEffect(() => {
    const atualizarAlturaResultados = () => {
      setAlturaResultados(window.innerWidth < 576 ? 640 : 580);
    };

    atualizarAlturaResultados();
    window.addEventListener("resize", atualizarAlturaResultados);
    return () =>
      window.removeEventListener("resize", atualizarAlturaResultados);
  }, []);

  const identificarCampo = (texto) => {
    const placaFormatada = texto.trim().toUpperCase().replace(/[\s-]/g, "");

    if (validarPlaca(placaFormatada)) {
      return { campo: "placa", valorConsulta: placaFormatada };
    }

    const numeros = extrairNumeros(texto);

    if (numeros.length === 11 && cpf.isValid(numeros)) {
      return { campo: "cpf", valorConsulta: numeros };
    }

    if (numeros.length === 14 && cnpj.isValid(numeros)) {
      return { campo: "cnpj", valorConsulta: numeros };
    }

    return null;
  };

  const exibirErro = (texto) => {
    setEstado(true);
    setMensagem(texto);
    setTimeout(() => {
      setEstado(false);
      setMensagem("");
    }, 4000);
  };

  const tratarErroAutenticacao = (error) => {
    if (
      error?.response?.data?.msg === "Cabeçalho inválido!" ||
      error?.response?.data?.msg === "Token inválido!" ||
      error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"
    ) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("perfil");
      return true;
    }
    return false;
  };

  const buscar = () => {
    if (valor.trim() === "") {
      exibirErro("Informe uma placa, CPF ou CNPJ para consulta");
      return;
    }

    const identificado = identificarCampo(valor);

    if (!identificado) {
      exibirErro("Informe uma placa, CPF ou CNPJ válido");
      return;
    }

    setEstadoLoading(true);
    const requisicao = createAPI();
    const consulta = `{"where": [{ "field": "${identificado.campo}", "operator": "=", "value": "${identificado.valorConsulta}" }]}`;
    const base64 = btoa(consulta);

    requisicao
      .get(`/usuario/consulta/?query=${base64}`)
      .then((response) => {
        setEstadoLoading(false);

        if (!response.data.msg.resultado) {
          setResultados(null);
          exibirErro(response.data.msg.msg);
          return;
        }

        setEstado(false);
        setMensagem("");
        setResultados(response.data.data);
      })
      .catch((error) => {
        setEstadoLoading(false);
        if (!tratarErroAutenticacao(error)) {
          setResultados(null);
          console.log(error);
        }
      });
  };

  const atualizarBuscaAtual = () => {
    if (resultados) {
      buscar();
    }
  };

  const mostrarResultadoOperacao = (resultado, mensagemPadrao) => {
    const sucesso = resultado?.data?.msg?.resultado === true;

    Swal.fire({
      title: sucesso ? "Sucesso!" : "Erro!",
      text: resultado?.data?.msg?.msg || mensagemPadrao,
      icon: sucesso ? "success" : "error",
      confirmButtonText: "Fechar",
      confirmButtonColor: "#3A58C8",
    }).then(() => {
      if (sucesso) {
        atualizarBuscaAtual();
      }
    });
  };

  const abrirModalAdicionarVeiculo = (idUsuario) => {
    setIdUsuarioVeiculo(idUsuario);
    setPlacaClasse("placa");
    setTextoPlacaNovo("");
    setLimitePlaca(8);
    setInputPlacaClasse("inputvazio");
    setContPlaca(0);
    setEstadoPlaca(false);
    setMensagemPlaca("");
    setModalVeiculoAberto(true);
  };

  const handlePlacaEstrangeira = () => {
    const elemento = document.getElementById("flexSwitchCheckDefaultVeiculo");
    const clicado = elemento ? elemento.checked : false;
    if (clicado) {
      setPlacaClasse("placa2");
      setLimitePlaca(10);
      setInputPlacaClasse("inputvazio2");
    } else {
      setPlacaClasse("placa");
      setLimitePlaca(8);
      setInputPlacaClasse("inputvazio");
    }
  };

  useEffect(() => {
    const elemento = document.getElementById("flexSwitchCheckDefaultVeiculo");
    if (!elemento) {
      return;
    }
    const clicado = elemento.checked;
    if (clicado) {
      return;
    }
    if (
      textoPlacaNovo[4] === "1" ||
      textoPlacaNovo[4] === "2" ||
      textoPlacaNovo[4] === "3" ||
      textoPlacaNovo[4] === "4" ||
      textoPlacaNovo[4] === "5" ||
      textoPlacaNovo[4] === "6" ||
      textoPlacaNovo[4] === "7" ||
      textoPlacaNovo[4] === "8" ||
      textoPlacaNovo[4] === "9" ||
      textoPlacaNovo[4] === "0"
    ) {
      setPlacaClasse("placa3");
      if (contPlaca === 0) {
        const fim = textoPlacaNovo.substring(3, textoPlacaNovo.length);
        const texto = textoPlacaNovo.substring(0, 3);
        setTextoPlacaNovo(`${texto}-${fim}`);
        setContPlaca(contPlaca + 1);
      } else {
        const fim = textoPlacaNovo.substring(4, textoPlacaNovo.length);
        const texto = textoPlacaNovo.substring(0, 3);
        setTextoPlacaNovo(`${texto}-${fim}`);
        setContPlaca(contPlaca + 1);
      }
    } else {
      setPlacaClasse("placa");
      setContPlaca(0);
    }
  }, [textoPlacaNovo]);

  const confirmarAdicionarVeiculo = () => {
    const elemento = document.getElementById("flexSwitchCheckDefaultVeiculo");
    const clicado = elemento ? elemento.checked : false;

    let placaFinal = "";
    if (!clicado && placaClasse !== "placa") {
      const split = textoPlacaNovo.split("-");
      placaFinal = `${split[0] || ""}${split[1] || ""}`;
    } else {
      placaFinal = textoPlacaNovo;
    }
    placaFinal = placaFinal.toUpperCase();

    const placaValida = clicado
      ? placaFinal.length >= 6 && placaFinal.length <= 8
      : validarPlaca(placaFinal);

    if (!placaValida) {
      setEstadoPlaca(true);
      setMensagemPlaca("Placa inválida");
      setTimeout(() => {
        setEstadoPlaca(false);
        setMensagemPlaca("");
      }, 4000);
      return;
    }

    setLoadingPlaca(true);
    const requisicao = createAPI();
    requisicao
      .post("/veiculo", {
        id_usuario: idUsuarioVeiculo,
        placa: placaFinal,
      })
      .then((response) => {
        setLoadingPlaca(false);
        const sucesso = response.data?.msg?.resultado;

        if (!sucesso) {
          setEstadoPlaca(true);
          setMensagemPlaca(
            response.data?.msg?.msg || "Erro ao adicionar veículo"
          );
          setTimeout(() => {
            setEstadoPlaca(false);
            setMensagemPlaca("");
          }, 4000);
          return;
        }

        setModalVeiculoAberto(false);
        Swal.fire({
          title: "Sucesso!",
          text: response.data.msg.msg,
          icon: "success",
          confirmButtonColor: "#3A58C8",
        }).then(() => {
          atualizarBuscaAtual();
        });
      })
      .catch((error) => {
        setLoadingPlaca(false);
        if (!tratarErroAutenticacao(error)) {
          setEstadoPlaca(true);
          setMensagemPlaca("Ocorreu um erro ao adicionar o veículo");
          setTimeout(() => {
            setEstadoPlaca(false);
            setMensagemPlaca("");
          }, 4000);
        }
      });
  };

  const alternarDebitoAutomatico = (veiculo, idUsuario) => {
    if (veiculo.estacionado === "S") {
      Swal.fire({
        title: "Veículo estacionado",
        text: "Não é possível alterar o débito automático de um veículo que está estacionado.",
        icon: "warning",
        confirmButtonColor: "#3A58C8",
      });
      return;
    }

    const novoStatus = veiculo.debito_automatico === "S" ? "N" : "S";

    Swal.fire({
      title:
        novoStatus === "S"
          ? "Ativar débito automático"
          : "Desativar débito automático",
      text: `Deseja realmente ${
        novoStatus === "S" ? "ativar" : "desativar"
      } o débito automático da placa ${veiculo.placa}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3A58C8",
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const requisicao = createAPI();
      requisicao
        .put("/veiculo", {
          idVeiculo: veiculo.id_veiculo,
          debitoAutomatico: novoStatus,
          id_usuario: idUsuario,
        })
        .then((response) => {
          mostrarResultadoOperacao(
            response,
            "Ocorreu um erro ao alterar o débito automático"
          );
        })
        .catch((error) => {
          if (!tratarErroAutenticacao(error)) {
            Swal.fire({
              title: "Erro!",
              text: "Ocorreu um erro ao alterar o débito automático",
              icon: "error",
              confirmButtonColor: "#3A58C8",
            });
          }
        });
    });
  };

  const removerVeiculoUsuario = (idVeiculo, idUsuario) => {
    Swal.fire({
      title: "Remover veículo",
      text: "Deseja realmente remover este veículo do usuário?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3A58C8",
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const requisicao = createAPI();
      requisicao
        .put("/veiculo/remover", {
          id_veiculo: idVeiculo,
          id_usuario: idUsuario,
        })
        .then((response) => {
          mostrarResultadoOperacao(
            response,
            "Ocorreu um erro ao remover o veículo"
          );
        })
        .catch((error) => {
          if (!tratarErroAutenticacao(error)) {
            Swal.fire({
              title: "Erro!",
              text: "Ocorreu um erro ao remover o veículo",
              icon: "error",
              confirmButtonColor: "#3A58C8",
            });
          }
        });
    });
  };

  return (
    <div className="container">
      <style>{`
        .veiculo-card-col {
          width: 100%;
        }
        @container (min-width: 480px) {
          .veiculo-card-col {
            width: 50%;
          }
        }
      `}</style>
      <Modal
        opened={modalVeiculoAberto}
        onClose={() => setModalVeiculoAberto(false)}
        centered
      >
        <div className="row">
          <div className="col-9 ps-4 pt-1 pb-3">
            <h6>&nbsp;Placa estrangeira/Outra</h6>
          </div>
          <div className="col-3">
            <div className="form-check3 form-switch d-md-block">
              <input
                className="form-check-input align-self-end"
                type="checkbox"
                role="switch"
                onClick={handlePlacaEstrangeira}
                id="flexSwitchCheckDefaultVeiculo"
              />
            </div>
          </div>
        </div>

        <div className="pt-1 mt-md-0 w-100 p-3" id={placaClasse}>
          <input
            type="text"
            id={inputPlacaClasse}
            className="mt-5 fs-1 justify-content-center align-items-center text-center"
            value={textoPlacaNovo}
            onChange={(e) => setTextoPlacaNovo(e.target.value)}
            maxLength={limitePlaca}
          />
        </div>

        <div className="mt-3 mb-1 d-flex gap-2 justify-content-center">
          <Button
            variant="default"
            onClick={() => setModalVeiculoAberto(false)}
          >
            Cancelar
          </Button>
          <Button
            loading={loadingPlaca}
            onClick={confirmarAdicionarVeiculo}
            loaderPosition="right"
            className="bg-blue-50"
          >
            Adicionar
          </Button>
        </div>

        <div
          className="alert alert-danger mt-3"
          role="alert"
          style={{ display: estadoPlaca ? "block" : "none" }}
        >
          {mensagemPlaca}
        </div>
      </Modal>

      <div
        className={
          resultados
            ? "row justify-content-center form-bg-image "
            : "row justify-content-center form-bg-image"
        }
        style={{
          minHeight: resultados ? "auto" : "70vh",
          transition: "min-height .2s ease",
        }}
      >
        <div
          className={
            resultados
              ? "col-12 d-flex align-items-stretch justify-content-center p-1"
              : "col-12 d-flex align-items-center justify-content-center p-1"
          }
          style={{ maxWidth: resultados ? "1100px" : "640px" }}
        >
          <Paper shadow="md" radius="lg" p={0} className="w-100">
            <div className={resultados ? "row g-0" : ""}>
              <div
                className={
                  resultados ? "col-12 col-lg-5 p-4 pe-lg-0 p-lg-5" : "p-4 p-lg-5"
                }
              >
                <div className="d-flex align-items-center gap-3 pb-3 mb-4 border-bottom">
                  <div style={{ minWidth: 0 }}>
                    <div className="h5 fw-bold mb-0 text-start">Consultar usuário/veículo</div>
                    <p
                      className="text-muted mb-0 text-start"
                      style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)" }}
                    >
                      Pesquise por placa, CPF ou CNPJ para ver o usuário e os
                      veículos vinculados.
                    </p>
                  </div>
                </div>

                <Input
                  icon={<IconSearch size="1.1rem" />}
                  placeholder="Digite a placa, CPF ou CNPJ"
                  size="md"
                  radius="md"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      buscar();
                    }
                  }}
                />

                <div className="d-flex align-items-center gap-2 mt-2 mb-1">
                  <div className="d-grid flex-fill">
                    <Button
                      loading={estadoLoading}
                      onClick={() => {
                        buscar();
                      }}
                      loaderPosition="right"
                      className="bg-blue-50"
                      size="md"
                      radius="md"
                      leftIcon={<IconSearch size="1rem" />}
                      sx={{
                        transition: "background-color .15s ease, color .15s ease, border-color .15s ease",
                        border: "1px solid #3a58c8",
                        "&:hover": {
                          backgroundColor: "#fff !important",
                          color: "#3a58c8",
                        },
                      }}
                    >
                      Buscar
                    </Button>
                  </div>
                  <div className="d-grid flex-fill">
                    <VoltarComponente space={false} />
                  </div>
                </div>

                {estado ? (
                  <Alert
                    icon={<IconAlertCircle size="1.1rem" />}
                    color="red"
                    variant="light"
                    radius="md"
                    mt="md"
                    styles={{ message: { color: "#c92a2a" } }}
                  >
                    {mensagem}
                  </Alert>
                ) : null}
              </div>

              {resultados ? (
                <>
                  <div className="d-none d-lg-flex col-lg-1 px-0 justify-content-center">
                    <div
                      style={{ width: 1, backgroundColor: "#e9ecef" }}
                    />
                  </div>

                  <div
                    className="col-12 col-lg-6"
                    style={{
                      height: alturaResultados,
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                    }}
                  >
                    <LoadingOverlay
                      visible={estadoLoading}
                      overlayBlur={2}
                      radius="md"
                    />
                    <div className="d-lg-none mx-4" style={{ height: 1, backgroundColor: "#e9ecef" }} />
                    <div
                      className="p-4 ps-lg-0 p-lg-5"
                      style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
                    >
                {resultados?.map((resultado, index) => (
                  <div
                    className={index === 0 ? "" : "mt-4 pt-4 border-top"}
                    key={index}
                  >
                    {resultado.usuario ? (
                      <div className="d-flex align-items-center flex-nowrap gap-2 pb-3 mb-3 border-bottom">
                        <div
                          className="h5 mb-0 d-flex align-items-center"
                          style={{ minWidth: 0 }}
                        >
                          <FaUser className="me-2 ms-2 flex-shrink-0" />
                          <span className="text-truncate">
                            &nbsp;{resultado.usuario.nome}
                          </span>
                        </div>
                        <Badge
                          color={
                            resultado.usuario.ativo === "S" ? "green" : "red"
                          }
                          variant="light"
                          size="sm"
                          className="d-none d-sm-inline-flex flex-shrink-0 order-sm-1"
                        >
                          {resultado.usuario.ativo === "S"
                            ? "Usuário ativo"
                            : "Usuário inativo"}
                        </Badge>
                        <Button
                          variant="light"
                          color="blue"
                          size="xs"
                          radius="md"
                          leftIcon={<IconPlus size="0.9rem" />}
                          onClick={() =>
                            abrirModalAdicionarVeiculo(
                              resultado.usuario.id_usuario
                            )
                          }
                          className="order-sm-2 ms-sm-auto"
                          sx={(theme) => ({
                            transition: "background-color .15s ease, color .15s ease",
                            "&:hover": {
                              backgroundColor: theme.colors.blue[6],
                              color: theme.white,
                            },
                          })}
                        >
                          Veículo
                        </Button>
                      </div>
                    ) : (
                      <div className="h6 d-flex align-items-center fs-6 text-muted pb-3 mb-3 border-bottom">
                        <AiOutlineInfoCircle className="me-2" /> Nenhum
                        usuário associado a este veículo
                      </div>
                    )}

                    {resultado.veiculos.length > 0 ? (
                      <div
                        className="row g-3"
                        style={{ containerType: "inline-size" }}
                      >
                        {resultado.veiculos.map((veiculo, i) => (
                          <div className="veiculo-card-col" key={i}>
                            <div
                              className="border rounded-3 p-3 h-100 d-flex flex-column"
                              id="veiculoConsultaCard"
                            >
                              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                                <div className="h6 fw-bolder d-flex align-items-center mb-0">
                                  <FaCar className="me-2 ms-2 flex-shrink-0" /> {veiculo.placa}
                                </div>
                                <Badge
                                  color={
                                    veiculo.debito_automatico === "S"
                                      ? "green"
                                      : "gray"
                                  }
                                  variant="light"
                                  size="sm"
                                  leftSection={
                                    <MdCarCrash
                                      size={12}
                                      style={{ marginTop: 2 }}
                                    />
                                  }
                                >
                                  {veiculo.debito_automatico === "S"
                                    ? "Débito automático ativo"
                                    : "Débito automático inativo"}
                                </Badge>
                              </div>
                              {resultado.usuario ? (
                                <div className="d-flex gap-2 mt-auto pt-2">
                                  <Tooltip
                                    label="Veículo estacionado: não é possível alterar o débito automático"
                                    disabled={veiculo.estacionado !== "S"}
                                    multiline
                                    width={220}
                                    withArrow
                                  >
                                    <Button
                                      variant="outline"
                                      color={
                                        veiculo.estacionado === "S"
                                          ? "gray"
                                          : veiculo.debito_automatico === "S"
                                          ? "red"
                                          : "blue"
                                      }
                                      size="xs"
                                      radius="md"
                                      className="flex-grow-1"
                                      disabled={veiculo.estacionado === "S"}
                                      onClick={() =>
                                        alternarDebitoAutomatico(
                                          veiculo,
                                          resultado.usuario.id_usuario
                                        )
                                      }
                                      sx={(theme) => {
                                        const corBotao =
                                          veiculo.debito_automatico === "S"
                                            ? "red"
                                            : "blue";
                                        return {
                                          transition:
                                            "background-color .15s ease, color .15s ease",
                                          "&:hover":
                                            veiculo.estacionado === "S"
                                              ? undefined
                                              : {
                                                  backgroundColor:
                                                    theme.colors[corBotao][6],
                                                  color: theme.white,
                                                },
                                        };
                                      }}
                                    >
                                      {veiculo.estacionado === "S"
                                        ? "Estacionado"
                                        : veiculo.debito_automatico === "S"
                                        ? "Desativar débito"
                                        : "Ativar débito"}
                                    </Button>
                                  </Tooltip>
                                  <Button
                                    variant="outline"
                                    color="red"
                                    size="xs"
                                    radius="md"
                                    onClick={() =>
                                      removerVeiculoUsuario(
                                        veiculo.id_veiculo,
                                        resultado.usuario.id_usuario
                                      )
                                    }
                                    sx={(theme) => ({
                                      transition:
                                        "background-color .15s ease, color .15s ease",
                                      "&:hover": {
                                        backgroundColor: theme.colors.red[6],
                                        color: theme.white,
                                      },
                                    })}
                                  >
                                    <BsFillTrashFill />
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h6 d-flex align-items-center fs-6 text-muted">
                        <AiOutlineInfoCircle className="me-2" /> Nenhum
                        veículo associado a este usuário
                      </div>
                    )}
                  </div>
                ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default ConsultarUsuarioVeiculos;