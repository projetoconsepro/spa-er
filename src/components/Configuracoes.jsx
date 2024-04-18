import { React, useState, useEffect } from "react";
import { TbHandClick } from "react-icons/tb";
import { BsFillTrashFill } from "react-icons/bs";
import Swal from "sweetalert2";
import VoltarComponente from "../util/VoltarComponente";
import { useDisclosure } from "@mantine/hooks";
import { Button, Card, Divider, Group, Modal, Text } from "@mantine/core";
import createAPI from "../services/createAPI";
import { IconCheck, IconX } from "@tabler/icons-react";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { BiErrorCircle } from "react-icons/bi";
import { AiFillCheckCircle } from "react-icons/ai";

const Configuracoes = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [cardBody] = useState("card-body3");
  const [estadoDiv, setEstadoDiv] = useState(false);
  const [estadoDiv2, setEstadoDiv2] = useState(true);

  const Atualizarequisicao = async () => {
    const requisicao = createAPI();

    requisicao
      .get("/veiculo")
      .then((response) => {
        const newData = response.data.data.map((item) => ({
          placa: item.usuario,
          id_veiculo: item.id_veiculo,
          debito: item.debito_automatico,
          debitoDisponivel: item.disponivel_debito_automatico,
          estado: true,
          estadoOn: false,
          check: false,
          idVeiculo: item.id_veiculo,
          estacionado: item?.estacionado || "N",
          vaga: item?.numerovaga || 0,
        }));
        for (let index = 0; index < newData.length; index++) {
          if (newData[index].debito == "S") {
            newData[index].check = true;
          } else {
            newData[index].check = false;
          }

          if (newData[index].estacionado === "S" && newData[index].vaga !== 0) {
            newData[index].estado = false;
          }

          if ((newData[index].debitoDisponivel === "N" && newData[index].debito === "N") ||
            (newData[index].debitoDisponivel === "N" && newData[index].debito !== "S")) {
            newData[index].estado = false;
          }
        }

        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cancelarTermos = () => {
    close()
    FuncTrocaComp("MeusVeiculos");
  }

  const confirmarTermos = () => {
    const checkbox = document.getElementById("termsCheckbox");
    if (checkbox.checked) {
      localStorage.setItem("termosDebito", "true");
      setEstadoDiv2(false)
      close();
      Atualizarequisicao();
    } else {
      setEstadoDiv(true)
      setTimeout(() => {
        setEstadoDiv(false)
      }, 3000);
    }
  }

  useEffect(() => {
    const debito = localStorage.getItem("termosDebito");
    if (debito == "true") {
      setEstadoDiv2(false)
      Atualizarequisicao();
    } else {
      open()
    }
  }, []);

  const salvarAlteracoes = (index) => {
    const requisicao = createAPI();
    const idVeiculo = data[index].idVeiculo;
    requisicao
      .put("/veiculo", {
        idVeiculo: idVeiculo,
        debitoAutomatico: !data[index].check ? "S" : "N",
      })
      .then((response) => {
        if (response.data.msg.resultado) {
          data[index].estadoOn = !data[index].estadoOn;
          setData([...data]);
          Atualizarequisicao();
          Swal.fire(
            "Confirmado!",
            "O débito automático foi alterado com sucesso!",
            "success"
          ).then((result) => {
            FuncTrocaComp("MeusVeiculos");
          })
        } else {
          setEstado(true);
          setMensagem(response.data.msg.msg);
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 5000);
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

  const removerVeiculo = (idVeiculo) => {
    Swal.fire({
      title: "Deseja realmente remover este veículo?",
      showCancelButton: true,
      confirmButtonText: `Sim`,
      cancelButtonText: `Não`,
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        const requisicao = createAPI();
        requisicao
          .put(`/veiculo/remover`, {
            id_veiculo: idVeiculo,
          })
          .then((response) => {
            if (response.data.msg.resultado === true) {
              Atualizarequisicao();
              Swal.fire({
                title: response.data.msg.msg,
                icon: "success",
                timer: 2000,
              });
            } else {
              Swal.fire({
                title: response.data.msg.msg,
                icon: "error",
                timer: 2000,
              });
            }
          });
      }
    });
  };

  const mudaEstado = (index) => {
    data[index].estadoOn = !data[index].estadoOn;
    setData([...data]);
  };

  return (
    <div className="col-12 px-3 mb-3">
      <div className="row">
        <div className="col-9">
          <p className="text-start fs-5 fw-bold">
            <VoltarComponente arrow={true} /> Débito automático
          </p>
        </div>
        <div className="col-3">
          <Button variant="outline" size="xs" color="gray" onClick={() => open()}>
            ?
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow mt-2 mb-3" style={{ display: estadoDiv2 ? 'block' : 'none' }}>
        <Group>
          <Text>Você precisa aceitar os termos de uso do débito automático para usar dessa funcionalidade. Clique no botão no canto superior direito para aceitar.</Text>
        </Group>
      </Card>

      {data.map((link, index) => (
        <div
          className="card border-0 shadow mt-2 mb-5"
          key={index}
          id="divD"
          disabled={
            (link.estacionado === "S" && link.vaga !== 0) ||
            (link.debitoDisponivel === "N" && link.debito === "N") ||
              (link.debitoDisponivel === "N" && link.debito !== "S")
              ? true
              : false
          }
        >
          <div
            className={cardBody}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="h2 mb-0 d-flex align-items-center">
                  {link.placa}
                </div>
                <div className="h6 mt-1 d-flex align-items-center fs-6 text-start">
                  <h6 className="fs-6">
                    <TbHandClick />{" "}
                    <small>Débito automático: {data[index].check ? "Ativado" : "Desativado"}</small>
                  </h6>
                </div>
              </div>
              <div>
                <div className="d-flex align-items-center fw-bold">
                  {data[index].check ? (
                     <AiFillCheckCircle size={30} color="green" /> ) 
                     : 
                     (   
                     <BiErrorCircle size={30} color="red" />
                     )}
                </div>
              </div>
            </div>
          </div>
          {data[index].estado ? (
            <div
              className="card-body5 pt-0"
              onChange={() => {
                mudaEstado(index);
              }}
            >
              {data[index].estado ? <div id="bordaBaixo"></div> : null}
              <Button
                type="submit"
                className="mt-4"
                variant="outline" color={data[index].check ? "red" : "blue"}
                fullWidth
                bold
                onClick={() => {
                  salvarAlteracoes(index);
                }}
              >
                {data[index].check ? "Desativar débito automático" : "Ativar débito automático"}
              </Button>
              <div className="row mt-3">
                <div className="col-2"></div>
                <div className="col-8"></div>
                <div className="col-2">
                  <BsFillTrashFill
                    size={25}
                    color="red"
                    onClick={() => {
                      removerVeiculo(link.id_veiculo);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <h6
            style={{
              display: (link.estacionado === "S" && link.vaga !== 0) ||
                (link.debitoDisponivel === "N" && link.debito === "N") ||
                  (link.debitoDisponivel === "N" && link.debito !== "S")
                  ? "block"
                  : "none",
            }}
            className="px-4 fs-6 text-center mt-4"
            id="modalTexto"
          >
            <small>
            {link.estacionado === "S" && link.vaga !== 0 ? "Não é possível ativar/desativar o débito automático de veículos que estão estacionados no momento."
            : "Este veículo já possui débito automático ativo em outro dispositivo."}
            </small>
          </h6>

        </div>
      ))}
      <VoltarComponente />
      <Modal opened={opened} onClose={() => { close() }} closeOnClickOutside={false} style={{ zIndex: 51 }} centered title="Termos de uso débito automático">
        <div id="modalTexto">
          <small><strong>Ao solicitar a ativação automática do estacionamento, o usuário concorda com os seguintes termos:</strong></small> <br />
          <small>a) Quando o monitor fiscalizar, será realizada uma ativação de 30 minutos, sendo repetida a ativação por um período máximo de 2 horas em cada vaga;</small> <br />
          <Divider my="sm" size="md" variant="dashed" />
          <small>b) Permanecendo por mais de 2 horas na mesma vaga, será emitida tarifa de regularização;</small> <br />
          <Divider my="sm" size="md" variant="dashed" />
          <small>c) Quando não possuir saldo mínimo de crédito para ativação no aplicativo CONSEPRO Taquara, será efetuado a notificação conforme a legislação vigente.</small> <br />
          <Divider my="sm" size="md" variant="dashed" />
          <small>d) Declaro ter ciência, que ao optar pela ativação automática, não terei direito ao período de tolerância de 10 minutos, sendo que na primeira fiscalização do monitor, será realizada a ativação de 30 minutos;</small> <br />
          <Divider my="sm" size="md" variant="dashed" />
          <small>e) A ativação fica vinculada a placa do veículo.</small> <br />
          <Divider my="sm" size="md" variant="dashed" />
          <small>f) Declaro ter ciência, que não será impresso o comprovante de estacionamento! E caso necessário, irei requisitar uma segunda via com uma monitora.</small> <br />
          <Divider my="sm" size="md" variant="dashed" />
          <small><strong> APÓS CONCORDAR COM OS TERMOS, HABILITE O DÉBITO AUTOMÁTICO NAS PLACAS DESEJADAS.</strong></small> <br />
        </div>
        {estadoDiv2 ?
          <>
            <div className="form-check mt-3">
              <input type="checkbox" className="form-check-input" id="termsCheckbox" />
              <label className={estadoDiv ? 'form-check-label text-danger' : 'form-check-label'} htmlFor="termsCheckbox">Concordo com os termos de uso</label>
            </div><div className="alert alert-danger mt-2" style={{ display: estadoDiv ? 'block' : 'none' }}>
              <small>É necessário concordar com os termos de uso para ativar o débito automático.</small>
            </div><div className="mt-3 d-flex justify-content-between px-4">
              <Button
                color="gray"
                mt="md"
                radius="md"
                onClick={() => {
                  cancelarTermos();
                }}
              >
                Não aceito ‎
                <IconX size="1.125rem" />
              </Button>
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "blue", deg: 60 }}
                mt="md"
                radius="md"
                onClick={() => {
                  confirmarTermos();
                }}
              >
                Confirmar ‎
                <IconCheck size="1.125rem" />
              </Button>
            </div>
          </>
          : null}
      </Modal>
      <div
              className="alert alert-danger mt-4"
              role="alert"
              style={{ display: estado ? "block" : "none" }}
            >
              {mensagem}
      </div>
    </div>
  );
};

export default Configuracoes;
