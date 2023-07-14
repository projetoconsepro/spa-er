import axios from "axios";
import { Group, Input, Button, Modal, Stepper } from "@mantine/core";
import {
  IconCash,
  IconClipboardList,
  IconCoin,
  IconMail,
  IconPhoneCall,
  IconUser,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import VoltarComponente from "../util/VoltarComponente";

const TransferirCreditoCliente = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [step, setStep] = useState(0);
  const [mensagemStep, setMensagemStep] = useState(false);
  const [infoDestinatario, setInfoDestinatario] = useState("");
  const [infoDestinatarioValor, setInfoDestinatarioValor] = useState("");
  const [arrayDestinatario, setArrayDestinatario] = useState([]);
  const [estadoInfoDestinatario, setEstadoInfoDestinatario] = useState(false);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [readyTransfer, setReadyTransfer] = useState(false);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);

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
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: user2.perfil[0],
      },
    });
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


  const FuncArrumaInput = (e) => {
    let valor = e.target.value;

    if (valor.length === 1 && valor !== '0') {
      valor = `0,0${valor}`;
    } else if (valor.length > 1) {
      valor = valor.replace(/\D/g, "");
      valor = valor.replace(/^0+/, "");
  
      if (valor.length < 3) {
        valor = `0,${valor}`;
      } else {
        valor = valor.replace(/(\d{2})$/, ',$1');
      }
  
      valor = valor.replace(/(?=(\d{3})+(\D))\B/g, ".");
    }

    setInfoDestinatarioValor(valor);
  };

  const handleTransfer = async () => {
    setIsButtonDisabled(true);
    setTimeout(() => {
      // Habilitar o botão após o atraso
      setIsButtonDisabled(false);
    }, 2000);
    


    const cpf = extrairNumeros(infoDestinatario);
    let campo = "";
    if (cpf.length === 11) {
      campo = "Destinatariocpf";
    } else {
      campo = "Destinatariocnpj";
    }
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: user2.perfil[0],
      },
    });

    const valor2 = parseFloat(infoDestinatarioValor.replace(",", ".")).toFixed(2);
    if (campo === "Destinatariocpf") {
      requisicao
        .post(`/financeiro/credito/transferir`, {
          Destinatariocpf: infoDestinatario,
          valor: valor2,
        })
        .then((response) => {
          console.log(response);
          if (response.data.msg.resultado) {
            open();
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
          console.log(error);
        });
    } else if (campo === "Destinatariocnpj") {
      requisicao
        .post(`/financeiro/credito/transferir`, {
          Destinatariocnpj: infoDestinatario,
          valor: valor2,
        })
        .then((response) => {
          if (response.data.msg.resultado) {
            open();
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
          console.log(error);
        });
    }
  };

  const closeHandle = () => {
    setStep(0);
    setEstadoInfoDestinatario(false);
    setMensagemStep(false);
    setInfoDestinatario("");
    setInfoDestinatarioValor("");
  };

  return (
    <div className="container">
      <Modal
        size="xl"
        opened={opened}
        onClose={() => {
          closeHandle();
          close();
        }}
        title="Transferência de créditos"
        centered
      >
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
                  close();
                }}
              >
                Ok
              </Button>
            </Group>
          ) : null}
        </div>
      </Modal>
      <div
        className="row justify-content-center form-bg-image"
        data-background-lg="../../assets/img/illustrations/signin.svg"
      >
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="row">
              <div className="col-12">
                <h5 className="mt-1">Transferir Créditos</h5>
              </div>
              <div className="col-12">
                <Input.Wrapper
                  label="Digite o CPF/CNPJ do usuário"
                  required
                  maw={320}
                  mx="auto"
                >
                  <Input
                    icon={<IconClipboardList />}
                    placeholder="CPF/CNPJ do usuário"
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
                      icon={<IconCash />}
                      placeholder="R$ 0,00"
                      value={infoDestinatarioValor}
                      onChange={(e) => FuncArrumaInput(e)}
                    />
                </Input.Wrapper>
              </div>
              {estadoInfoDestinatario ? (
                <div>
                  {arrayDestinatario.map((info, index) => (
                    <div className="card shadow mt-3" key={index}>
                      <div className="card-body7">
                        <div className="d-flex align-items-center justify-content-between pb-3">
                          <div className="text-start">
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
                                <IconCoin size={17} />‎ R$
                                {infoDestinatarioValor}
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
                      disabled={isButtonDisabled}
                    >
                      Confirmar
                    </Button>
                  </Group>
                </div>
              ) : (
                <div className="col-12">
                  <Group position="center" mt="xl">
                    <VoltarComponente />
                    <Button 
                    className="bg-blue-50"
                    size="md"
                    radius="md"
                    onClick={() => getInfo()}>
                      Confirmar
                    </Button>
                  </Group>
                </div>
              )}
            </div>
            <div
              className="alert alert-danger mt-3 fs-6 text-center"
              role="alert"
              style={{ display: estado ? "block" : "none" }}
            >
              {mensagem}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferirCreditoCliente;
