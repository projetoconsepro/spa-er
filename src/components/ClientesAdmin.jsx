import axios from "axios";
import { React, useEffect, useState } from "react";
import {
  FaCar,
  FaCarAlt,
  FaEllipsisH,
  FaEye,
  FaParking,
  FaPowerOff,
  FaHistory,
} from "react-icons/fa";
import HistoricoFinanceiro from './HistoricoFinanceiro'; 
import ScrollTopArrow from "./ScrollTopArrow";
import Swal from "sweetalert2";
import { BsCashCoin, BsPaintBucket } from "react-icons/bs";
import { AiFillPrinter, AiOutlineInfoCircle } from "react-icons/ai";
import RelatoriosPDF from "../util/RelatoriosPDF";
import {
  Modal,
  Select,
  Group,
  Stepper,
  Button,
  Input,
  ActionIcon,
  Pagination,
  Loader,
} from "@mantine/core";
import {
  IconClipboardList,
  IconCoin,
  IconMail,
  IconPhoneCall,
  IconSearch,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";
import Filtro from "../util/Filtro";
import { useDisclosure } from "@mantine/hooks";
import { RxLapTimer } from "react-icons/rx";
import Cronometro from "./Cronometro";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import createAPI from "../services/createAPI";

const ClientesAdmin = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [opened2, { open: open2, close: close2 }] = useDisclosure(false);
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState([]);
  const [data3, setData3] = useState([]);
  const [mensagemStep, setMensagemStep] = useState(false);
  const [infoRemetente, setInfoRemetente] = useState("");
  const [infoDestinatario, setInfoDestinatario] = useState("");
  const [infoDestinatarioValor, setInfoDestinatarioValor] = useState(null);
  const [arrayDestinatario, setArrayDestinatario] = useState([]);
  const [estadoInfoDestinatario, setEstadoInfoDestinatario] = useState(false);
  const [veiculos, setVeiculos] = useState([]);
  const [detalhesVeiculo, setDetalhesVeiculo] = useState([]);
  const [nome, setNome] = useState("");
  const [estado, setEstado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [readyTransfer, setReadyTransfer] = useState(false);
  const [estadoLoading, setEstadoLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [modalAberto, setModalAberto] = useState(false);
  const [UserId, setUserId] = useState(null);
  const [nomeHistorico, setNomeHistorico] = useState(null);

  const abreModalUserId = (id_usuario, nome) => {
    setUserId(id_usuario);
    setNomeHistorico(nome);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  function extrairNumeros(string) {
    return string ? string.replace(/\D/g, "") : string;
  }

  useEffect(() => {
    if (step >= 1 && step <= 4) {
      setTimeout(() => {
        nextStep();
        setStep(step + 1);
      }, 1000);
    }
    if (step === 4) {
      setMensagemStep(true);
    } else if (step === 0) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          prevStep();
        }, 500);
        setReadyTransfer(false);
      }
    }
  }, [step]);

  const AtualizaFunc = async () => {
    const requisicao = createAPI();
    setEstadoLoading(true);

    requisicao
      .get(
        "/usuario/listar/?query=eyJ3aGVyZSI6IFt7ICJmaWVsZCI6ICJwZXJmaWwiLCAib3BlcmF0b3IiOiAiPSIsICJ2YWx1ZSI6ICJjbGllbnRlIn1dfQ=="
      )
      .then((response) => {
        setEstadoLoading(false);
        const newData = response.data.data.map((item) => ({
          id_usuario: item.id_usuario,
          nome: item.nome,
          email: item.email,
          telefone: item.telefone,
          documento: item.documento,
          ativo: item.ativo,
          perfil: "cliente",
          placa: item.veiculos
            ? item.veiculos.map((veiculo) => veiculo.placa)
            : [],
          saldo: parseFloat(item.saldo),
        }));
        setData(newData);
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

  const desativaUsuario = async (item, index) => {
    Swal.fire({
      title: item.ativo === "S" ? "Desativar usuário" : "Ativar usuário",
      text:
        item.ativo === "S"
          ? "Tem certeza que deseja desativar esse usuário?"
          : "Tem certeza que deseja ativar esse usuário?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      confirmButtonColor: "#3A58C8",
      cancelButtonColor: "#d33",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const requisicao = createAPI();
        requisicao
          .put("/usuario", {
            nome: item.nome,
            telefone: item.telefone,
            email: item.email,
            perfil: item.perfil,
            ativo: item.ativo === "N" ? "S" : "N",
            id_usuario: item.id_usuario,
          })
          .then((response) => {
            if (response.data.msg.resultado) {
              data3[index] = {
                ativo: "N",
                email: item.email,
                id_usuario: item.id_usuario,
                nome: item.nome,
                perfil: item.perfil,
                telefone: item.telefone,
              };
              setData3([...data]);
              Swal.fire({
                title: "Sucesso!",
                text:
                  item.ativo === "N"
                    ? "Usuário ativado com sucesso!"
                    : "Usuário desativado com sucesso!",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Erro!",
                text: "Erro ao alterar usuário!",
                icon: "error",
                confirmButtonText: "Ok",
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
    });
  };

  useEffect(() => {
    AtualizaFunc();
  }, [data3]);

  const informacoes = (item, index) => {
    Swal.fire({
      title: "Informações do cliente",
      html: `<p><b>Nome:</b> ${item.nome}</p>
                   <p><b>Email:</b> ${
                     item.email === null ? "Email não cadastrado" : item.email
                   }</p>
                   <p><b>Telefone:</b> ${item.telefone}</p>
                   ${
                     item.documento && item.documento.length === 11
                       ? `<p><b>CPF:</b> ${item.documento}</p>`
                       : `<p><b>CNPJ:</b> ${item.documento}</p>`
                   }
                   <p><b>Status:</b> ${
                     item.ativo === "S" ? "Ativado" : "Desativado"
                   }</p>
                   <p><p><b>Saldo:</b> R$${
                     item.saldo > 0 ? item.saldo : `0${item.saldo}`
                   }</p>              
                    `,

      background: item.ativo === "S" ? "#fff" : "#f8d7da",
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Fechar",
      showDenyButton: true,
      denyButtonText: "Transferência",
      denyButtonColor: "green",
    }).then((result) => {
      if (result.isConfirmed) {
      } else if (result.isDenied) {
        open2();
      } else if (result.isDismissed) {
        Swal.close();
      }
    });
  };

  useEffect(() => {
    const requisicao = createAPI();
    requisicao
      .get(`/veiculo/${selectedOption}`)
      .then((response) => {
        if (
          response.data.msg.resultado === false &&
          response.data.msg.msg !== "Dados encontrados"
        ) {
        } else {
          const newData = response?.data.data.map((item) => ({
            placa: item.placa,
            modelo: item.modelo.modelo,
            fabricante: item.modelo.fabricante.fabricante,
            cor: item.cor,
            vaga: item.estacionado[0].numerovaga,
            numero_notificacoes_pendentes: item.numero_notificacoes_pendentes,
            saldo_devedor: item.saldo_devedorr,
            estacionado: item.estacionado[0].estacionado,
            tempo: item.estacionado[0].tempo,
            chegada: item.estacionado[0].chegada,
            temporestante: item.estacionado[0].temporestante,
            estado: false,
          }));

          setDetalhesVeiculo(newData);
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
  }, [selectedOption]);

  const getInfo = async () => {
    if (infoDestinatarioValor <= 0) {
      setEstado(true);
      setMensagem(`Digite um valor válido para tranferência!`);
      setTimeout(() => {
        setEstado(false);
      }, 4000);
      setEstadoInfoDestinatario(false);
      return;
    }
    const requisicao = createAPI();
    const cpf = extrairNumeros(infoDestinatario);
    let campo = "";
    if (cpf.length === 11) {
      campo = "cpf";
    } else {
      campo = "cnpj";
    }
    await requisicao
      .get(`/verificar?${campo}=${infoDestinatario}`)
      .then((response) => {
        if (response.data.msg.resultado) {
          setEstadoInfoDestinatario(true);
          const newData = response.data.usuario.map((item) => ({
            nome: item.nome,
            email: item.email === null ? "Email não cadastrado" : item.email,
            telefone: item.telefone,
          }));
          setArrayDestinatario(newData);
        } else {
          setEstado(true);
          setMensagem(`${response.data.msg.msg}`);
          setTimeout(() => {
            setEstado(false);
          }, 4000);
          setEstadoInfoDestinatario(false);
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

  const handleTransfer = () => {
    const cpf = extrairNumeros(infoDestinatario);
    let campo = "";
    if (cpf.length === 11) {
      campo = "Destinatariocpf";
    } else {
      campo = "Destinatariocnpj";
    }
    const requisicao = createAPI();
    if (campo === "Destinatariocpf") {
      requisicao
        .post(`/financeiro/credito/transferir`, {
          Destinatariocpf: infoDestinatario,
          valor: infoDestinatarioValor,
          id_usuario: infoRemetente,
        })
        .then((response) => {
          if (response.data.msg.resultado) {
            setReadyTransfer(true);
            setStep(1);
          } else {
            setEstado(true);
            setMensagem(`${response.data.msg.msg}`);
            setTimeout(() => {
              setEstado(false);
            }, 4000);
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
    } else if (campo === "Destinatariocnpj") {
      requisicao
        .post(`/financeiro/credito/transferir`, {
          Destinatariocnpj: infoDestinatario,
          valor: infoDestinatarioValor,
          id_usuario: infoRemetente,
        })
        .then((response) => {
          if (response.data.msg.resultado) {
            setReadyTransfer(true);
            setStep(1);
          } else {
            setEstado(true);
            setMensagem(`${response.data.msg.msg}`);
            setTimeout(() => {
              setEstado(false);
            }, 4000);
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
    } else {
    }
  };

  const informacoesVeiculos = (item) => {
    setVeiculos(item.placa.map((veiculo) => veiculo));
    open();
  };

  const closeHandle = () => {
    setStep(0);
    setDetalhesVeiculo([]);
    setEstadoInfoDestinatario(false);
    setMensagemStep(false);
    setInfoDestinatario("");
    setInfoDestinatarioValor(null);
    setSelectedOption(null);
    AtualizaFunc();
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event);
  };

  const transferirSaldo = (item) => {
    setInfoRemetente(item.id_usuario);
    open2();
  };

  const imprimir = () => {
    const dataD = [
      ...data.map((item) => [
        item.nome,
        item.telefone,
        item.email,
        `R$${item.saldo}`,
        item.perfil,
        item.ativo === "S" ? "Ativo" : "Inativo",
      ]),
    ];
    const nomeArquivo = "Relatório de Clientes";
    const cabecalho = [
      "Nome",
      "Telefone",
      "Email",
      "Saldo",
      "Perfil",
      "Status",
    ];
    RelatoriosPDF(nomeArquivo, cabecalho, dataD);
  };

  const notificacoes = (link) => {
    localStorage.setItem("placaCarro", link.placa);
    FuncTrocaComp("ListarNotificacoes");
  };

  const goHistorico = (link) => {
    localStorage.setItem("placaCarro", link.placa);
    FuncTrocaComp("HistoricoVeiculo");
  };

  const handleConsultaSelected = (consulta) => {
    setEstadoLoading(true);
    const requisicao = createAPI();
    const base64 = btoa(consulta);
    requisicao
      .get(`/usuario/listar/?query=${base64}`)
      .then((response) => {
        setEstadoLoading(false);
        const newData = response.data.data.map((item) => ({
          id_usuario: item.id_usuario,
          nome: item.nome,
          email: item.email,
          telefone: item.telefone,
          documento: item.documento,
          ativo: item.ativo,
          perfil: "cliente",
          placa: item.veiculos
            ? item.veiculos.map((veiculo) => veiculo.placa)
            : [],
          saldo: parseFloat(item.saldo),
        }));
        setData(newData);
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

  const pesquisarUsuario = () => {
    setEstadoLoading(true);
    const requisicao = createAPI();
    const consulta = `{"where": [{ "field": "prefil", "operator": "=", "value": "cliente" },{ "field": "nome", "operator": "LIKE", "value": "%${nome}%" }]}`;
    const base64 = btoa(consulta);
    requisicao
      .get(`/usuario/listar/?query=${base64}`)
      .then((response) => {
        setEstadoLoading(false);
        const newData = response.data.data.map((item) => ({
          id_usuario: item.id_usuario,
          nome: item.nome,
          email: item.email,
          telefone: item.telefone,
          documento: item.documento,
          ativo: item.ativo,
          perfil: "cliente",
          placa: item.veiculos
            ? item.veiculos.map((veiculo) => veiculo.placa)
            : [],
          saldo: parseFloat(item.saldo),
        }));
        setData(newData);
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

  return (
    <div className="dashboard-container mb-5">
      <Modal
        opened={modalAberto}
        onClose={fecharModal}
        title={`Histórico de ${nomeHistorico}`}
        centered
      > 
        <HistoricoFinanceiro id_usuario={UserId}/>
      </Modal>

      <Modal
        opened={opened}
        onClose={() => {
          closeHandle();
          close();
        }}
        title="Informações dos veículos"
        centered
      >
        <Select
          label="Selecione uma opção"
          data={veiculos}
          style={{ marginTop: "16px" }}
          value={selectedOption}
          onChange={handleOptionChange}
        />
        <div className="card-body4">
          {selectedOption !== null ? (
            <div>
              {detalhesVeiculo.map((link, index) => (
                <div className="card border-0 mt-2" key={index}>
                  <div className="card-body7">
                    <div className="d-flex align-items-center justify-content-between pb-3">
                      <div>
                        <div className="h2 mb-0 d-flex align-items-center">
                          {link.placa}
                        </div>
                        {link.numero_notificacoes_pendentes === 0 ? (
                          <div
                            className="h6 mt-2 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <AiOutlineInfoCircle />‎ Sem notificações
                              pendentes
                            </h6>
                          </div>
                        ) : (
                          <div
                            className="h6 mt-2 d-flex align-items-center fs-6 text-danger"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <AiOutlineInfoCircle />‎{" "}
                              {link.numero_notificacoes_pendentes}{" "}
                              {link.numero_notificacoes_pendentes > 1
                                ? "notificações"
                                : "notificação"}{" "}
                              pendentes
                            </h6>
                          </div>
                        )}
                        {link.estacionado === "N" ? (
                          <div
                            className="h6 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <FaParking />‎ Não estacionado
                            </h6>
                          </div>
                        ) : (
                          <div>
                            <div
                              className="h6 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <FaParking />‎ Estacionado - Vaga: {link.vaga}{" "}
                              </h6>
                            </div>
                            <div
                              className="h6 d-flex align-items-center fs-6"
                              id="estacionadocarroo"
                            >
                              <h6>
                                <RxLapTimer />‎ Tempo restante:{" "}
                                <Cronometro time={link.temporestante} />{" "}
                              </h6>
                            </div>
                          </div>
                        )}
                        {link.modelo === null || link.modelo === undefined ? (
                          <div
                            className="h6 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <FaCarAlt />‎ Modelo: Sem informações
                            </h6>
                          </div>
                        ) : (
                          <div
                            className="h6 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <FaCarAlt />‎ Modelo: {link.modelo}
                            </h6>
                          </div>
                        )}
                        <div
                          className="h6 d-flex align-items-center fs-6"
                          id="estacionadocarroo"
                        >
                          <h6>
                            <BsCashCoin />‎ Saldo devedor: {link.saldo_devedor}
                          </h6>
                        </div>
                        {link.cor === null || link.cor === undefined ? (
                          <div
                            className="h6 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <BsPaintBucket />‎ Cor: Sem informações
                            </h6>
                          </div>
                        ) : (
                          <div
                            className="h6 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <BsPaintBucket />‎ Cor: {link.cor}
                            </h6>
                          </div>
                        )}
                        {link.fabricante === null ||
                        link.fabricante === undefined ? (
                          <div
                            className="h6 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <FaCarAlt />‎ Fabricante: Sem informações
                            </h6>
                          </div>
                        ) : (
                          <div
                            className="h6 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <FaCarAlt />‎ Fabricante: {link.fabricante}
                            </h6>
                          </div>
                        )}
                      </div>

                      <div id="sumirCarro">
                        <div className="d-flex align-items-center fw-bold">
                          <FaCarAlt size={40} />
                        </div>
                      </div>
                    </div>
                    <div className=" mb-5 gap-2 d-md-block justify-content-between w-100">
                      {link.numero_notificacoes_pendentes === 0 ? null : (
                        <button
                          type="submit"
                          className="btn4 mb-2 bg-danger botao"
                          onClick={() => {
                            notificacoes(link);
                          }}
                        >
                          Notificações
                        </button>
                      )}
                      <button
                        type="submit"
                        className="btn4 bg-blue-50 botao"
                        onClick={() => {
                          goHistorico(link);
                        }}
                      >
                        Histórico
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Modal>

      <Modal
        size="xl"
        opened={opened2}
        onClose={() => {
          closeHandle();
          close2();
        }}
        title="Transferência de créditos"
        centered
      >
        {readyTransfer ? (
          <div>
            <Stepper active={active} breakpoint="sm">
              <Stepper.Step
                label="Verificar usuários"
                description="Verificação de usuários"
              >
                Passo 1: Verificar usuários
              </Stepper.Step>
              <Stepper.Step
                label="Verificar saldo"
                description="Verificação de saldo"
              >
                Passo 2: Verificar saldo
              </Stepper.Step>
              <Stepper.Step
                label="Transferência"
                description="Transferência de créditos"
              >
                Passo 3: Transferir créditos
              </Stepper.Step>
              <Stepper.Completed className="mt-3">
                Crédito transferido com sucesso!
              </Stepper.Completed>
            </Stepper>

            {mensagemStep ? (
              <Group position="center" mt="xl">
                <Button
                  onClick={() => {
                    closeHandle();
                    close2();
                  }}
                >
                  Ok
                </Button>
              </Group>
            ) : null}
          </div>
        ) : (
          <div>
            <Input.Wrapper
              label="Digite o CPF/CNPJ do usuário"
              required
              maw={320}
              mx="auto"
            >
              <Input
                icon={<IconClipboardList />}
                placeholder="..."
                value={infoDestinatario}
                onChange={(e) => setInfoDestinatario(e.target.value)}
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="Digite o valor que deseja transferir"
              required
              maw={320}
              mx="auto"
              className="mt-2"
            >
              <Input
                icon={<IconCoin />}
                placeholder="..."
                type="number"
                value={infoDestinatarioValor}
                onChange={(e) => setInfoDestinatarioValor(e.target.value)}
              />
            </Input.Wrapper>
            {estadoInfoDestinatario ? null : (
              <Group position="center" mt="xl">
                <Button
                  variant="default"
                  onClick={() => {
                    closeHandle();
                    close2();
                  }}
                >
                  Voltar
                </Button>
                <Button className="bg-blue-50" onClick={() => getInfo()}>
                  Confirmar
                </Button>
              </Group>
            )}

            {estadoInfoDestinatario ? (
              <div>
                {arrayDestinatario.map((info, index) => (
                  <div className="card shadow mt-3" key={index}>
                    <div className="card-body7">
                      <div className="d-flex align-items-center justify-content-between pb-3">
                        <div>
                          <div className="fw-bolder">
                            Confirme as informações da transferência:
                          </div>
                          Destinatario:
                          <div
                            className="h6 mt-2 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <IconUser size={17} />‎ {info.nome}{" "}
                            </h6>
                          </div>
                          <div
                            className="h6 mt-2 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <IconMail size={17} />‎ {info.email}
                            </h6>
                          </div>
                          <div
                            className="h6 mt-2 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <IconPhoneCall size={17} />‎ {info.telefone}{" "}
                            </h6>
                          </div>
                          Valor a ser transferido:
                          <div
                            className="h6 mt-2 d-flex align-items-center fs-6"
                            id="estacionadocarroo"
                          >
                            <h6>
                              <IconCoin size={17} />‎ R${infoDestinatarioValor}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Group position="center" mt="xl">
                  <Button
                    variant="default"
                    onClick={() => {
                      setEstadoInfoDestinatario(false);
                    }}
                  >
                    Voltar
                  </Button>
                  <Button
                    className="bg-blue-50"
                    onClick={() => {
                      handleTransfer();
                    }}
                  >
                    Confirmar
                  </Button>
                </Group>
              </div>
            ) : null}
            <div
              className="alert alert-danger mt-3 fs-6 text-center"
              role="alert"
              style={{ display: estado ? "block" : "none" }}
            >
              {mensagem}
            </div>
          </div>
        )}
      </Modal>

      <div className="row">
        <div className="col-7">
          <h6 className="text-start mx-4 mb-4">Clientes</h6>
        </div>
        <div className="col-12 col-xl-8">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="row mx-2 mb-4">
                <div className="col-6 text-start mt-2">
                  <Input
                    icon={<IconUserCircle size="1rem" />}
                    placeholder="Usuário"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="p-0"
                    rightSection={
                      <ActionIcon
                        onClick={() => pesquisarUsuario()}
                        variant="filled"
                        color="indigo"
                      >
                        <IconSearch size="1.125rem" />
                      </ActionIcon>
                    }
                  />
                </div>
                <div className="col-4 align-middle mt-2">
                  <Filtro
                    nome={"ClientesAdmin"}
                    onConsultaSelected={handleConsultaSelected}
                    onLoading={estadoLoading}
                  />
                </div>
                <div className="col-2">
                  <button
                    className="btn3 botao p-0 m-0 w-100 h-75 mt-2"
                    type="button"
                    onClick={() => {
                      imprimir();
                    }}
                  >
                    <AiFillPrinter size={21} />
                  </button>
                </div>
              </div>
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
                          Nome
                        </th>
                        <th
                          className="border-bottom"
                          id="tabelaUsuarios"
                          scope="col"
                        >
                          Telefone
                        </th>
                        <th
                          className="border-bottom"
                          id="tabelaUsuarios2"
                          scope="col"
                        >
                          Email
                        </th>
                        <th
                          className="border-bottom"
                          id="tabelaUsuarios"
                          scope="col"
                        >
                          Saldo
                        </th>
                        <th className="border-bottom" scope="col">
                          ‎‎
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => (
                        <tr className="card-list" key={index}>
                          <th
                            className="fw-bolder col"
                            scope="row"
                            id="tabelaUsuarios"
                            style={{
                              backgroundColor:
                                item.ativo === "S" ? "#fff" : "#F8D7DA",
                            }}
                          >
                            {item.nome.length > 14
                              ? item.nome.substring(0, 14) + "..."
                              : item.nome}
                          </th>
                          <td
                            className="fw-bolder col"
                            id="tabelaUsuarios"
                            style={{
                              backgroundColor:
                                item.ativo === "S" ? "#fff" : "#F8D7DA",
                            }}
                          >
                            {" "}
                            <small> {item.telefone} </small>
                          </td>
                          <td
                            className="fw-bolder col"
                            id="tabelaUsuarios2"
                            style={{
                              backgroundColor:
                                item.ativo === "S" ? "#fff" : "#F8D7DA",
                            }}
                          >
                            {" "}
                            <small> {item.email} </small>
                          </td>
                          <td
                            className="fw-bolder col"
                            id="tabelaUsuarios"
                            style={{
                              backgroundColor:
                                item.ativo === "S" ? "#fff" : "#F8D7DA",
                            }}
                          >
                            {" "}
                            <small>
                              {" "}
                              R$
                              {item.saldo != 0
                                ? Number.isInteger(item.saldo)
                                  ? `${item.saldo}`
                                  : item.saldo
                                : `0${item.saldo}`}
                            </small>
                          </td>
                          <td
                            className="fw-bolder col"
                            id="tabelaUsuarios3"
                            style={{
                              backgroundColor:
                                item.ativo === "S" ? "#fff" : "#F8D7DA",
                            }}
                          >
                            <div>
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
                                  onClick={() => {
                                    informacoes(item);
                                  }}
                                >
                                  <FaEye />
                                  ‎‎ Ver mais{" "}
                                </h6>
                                <h6
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() => {
                                    informacoesVeiculos(item);
                                  }}
                                >
                                  <FaCar />
                                  ‎‎ Veículos
                                </h6>
                                {item.saldo > 0 ? (
                                  <h6
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={() => {
                                      transferirSaldo(item);
                                    }}
                                  >
                                    <BsCashCoin />
                                    ‎‎ Transferir saldo
                                  </h6>
                                ) : null}
                                <h6
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() => {
                                    desativaUsuario(item);
                                  }}
                                  style={{
                                    color:
                                      item.ativo === "S" ? "red" : "#0F5132",
                                  }}
                                >
                                  <FaPowerOff size={13} className="mb-1" /> ‎‎{" "}
                                  {item.ativo === "S" ? "Desativar" : "Ativar"}
                                </h6>
                                <h6
                                   className="dropdown-item d-flex align-items-center"
                                   onClick={() => abreModalUserId(item.id_usuario, item.nome)}
                                   >
                                      <FaHistory />
                                       ‎‎ Histórico
                                </h6>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                { estadoLoading ?
                <div className="col-12 text-center mt-4 mb-4">
                  <Loader />
                </div>
                : null
                }
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
      </div>
      <ScrollTopArrow />
    </div>
  );
};

export default ClientesAdmin;
