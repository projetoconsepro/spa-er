import { React, useEffect, useState } from "react";
import { BsCalendarDate, BsPaintBucket } from "react-icons/bs";
import {
  FaCarAlt,
  FaClipboard,
  FaClipboardList,
  FaParking,
} from "react-icons/fa";
import Swal from "sweetalert2";
import FuncTrocaComp from "../util/FuncTrocaComp";
import {
  Button,
  Card,
  Divider,
  Group,
  Input,
  Modal,
  Text,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconCamera, IconReceipt } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import createAPI from "../services/createAPI";
import VoltarComponente from "../util/VoltarComponente";

const AutoInfracao = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [dataImagem, setDataImagem] = useState([]);
  const [imagemLocal, setImagemLocal] = useState("");
  const [local, setLocal] = useState('');

  useEffect(() => {
    let infos = JSON.parse(localStorage.getItem("autoInfracao"));
    setLocal(infos.local);
    setData([infos]);

    const requisicao = createAPI();

    requisicao
      .get(`/veiculo/${infos.placa}`)
      .then((response) => {
        if (
          response.data.msg.resultado === false &&
          response.data.msg.msg !== "Dados encontrados"
        ) {
        } else {
          const newdata = {
            ...infos,
            fabricante: response.data.data[0].modelo.fabricante.fabricante,
            modelo: response.data.data[0].modelo.modelo,
            cor: response.data.data[0].cor,
          };

          infos = newdata;

          setData([newdata]);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    if (
      localStorage.getItem("fotoInfracao") !== null &&
      localStorage.getItem("fotoInfracao") !== undefined &&
      localStorage.getItem("fotoInfracao") !== ""
    ) {
      setImagemLocal(localStorage.getItem("fotoInfracao"));
    }

    let idNotificacao;

    requisicao
      .get(`/notificacao/vagaveiculo/${infos.id_vaga_veiculo}`)
      .then((response) => {
        if (response.data.msg.resultado) {
          idNotificacao = response.data.data;

          requisicao
            .get(`/notificacao/imagens/${response.data.data}`)
            .then((response) => {
              if (response.data.msg.resultado) {
                setDataImagem(response.data.data);
              }
            });

          const newdata = {
            ...infos,
            id_notificacao: idNotificacao,
          };

          setData([newdata]);
        }
      });
  }, []);

  const registrarProva = () => {
    FuncTrocaComp("CameraAutoInfracao");
  };

  const verFotos = () => {
    open();
  };

  const confirmarInfracao = () => {

    if (codigo === "") {
      Swal.fire("Aviso!", "Necessário informar o código ( Auto de Infração - DETRAN )!", "warning");
      return;
    }
    const requisicao = createAPI();

    requisicao
      .post("/notificacao/auto-infracao", {
        codigo: codigo,
        idVagaVeiculo: data[0].id_vaga_veiculo,
      })
      .then((response) => {
        if (response.data.msg.resultado) {
          Swal.fire(
            "Sucesso!",
            "Auto de infração confirmado com sucesso!",
            "success"
          );
          setTimeout(() => {
            localStorage.removeItem("autoInfracao");
            FuncTrocaComp("ListarNotificacoesAgente");
            Swal.close();
          }, 1000);
        } else {
          Swal.fire("Erro!", `${response.data.msg.msg}`, "error");
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

    if (
      imagemLocal !== "" &&
      imagemLocal !== undefined &&
      imagemLocal !== null
    ) {
      requisicao
        .post("/notificacao/ticket", {
          id_notificacao: data[0].id_notificacao,
          foto: imagemLocal,
        })
        .then((response) => {
          if (response.data.msg.resultado) {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="col-12 px-3">
      <Modal
        size="xl"
        opened={opened}
        onClose={() => close()}
        title="Ver imagens"
        centered
      >
        <Carousel slideSize="100%" slideGap="sm" dragFree>
          {dataImagem === undefined ? (
            <Carousel.Slide>
              <img
                src="../../assets/img/imagemError.png"
                alt="Imagem notificação"
                width="100%"
              />
            </Carousel.Slide>
          ) : (
            dataImagem.map((item, index) => (
              <Carousel.Slide key={index}>
                {item ? (
                  <img
                    src={item.imagem}
                    alt="Imagem notificação"
                    width="100%"
                  />
                ) : (
                  <img
                    src="../../assets/img/imagemError.png"
                    alt="Imagem notificação"
                    width="100%"
                  />
                )}
              </Carousel.Slide>
            ))
          )}
        </Carousel>
      </Modal>
      <p className="text-start fs-2 fw-bold">Auto de infração</p>
      {data &&
        data.map((item, index) => (
          <Card padding="lg" radius="md" withBorder key={index}>
            <Group position="apart">
              <Text size={30}> {item.placa} </Text>
            </Group>
            <Group position="apart">
              <Text size={20}>
                {" "}
                <BsCalendarDate className="mb-1" /> {item.data}{" "}
              </Text>
            </Group>
            {item.tipo !== undefined ? (
              <Group position="apart">
                {item.tipo !== "Ocupando vaga de deficiente" &&
                item.tipo !== "Ocupando vaga de idoso" ? (
                  <Text size={20}>
                    {" "}
                    <FaClipboardList className="mb-1" /> Motivo: {item.tipo}{" "}
                  </Text>
                ) : (
                  <Text size={20}>
                    {" "}
                    <FaClipboardList className="mb-1" />{" "}
                    <small> Motivo: {item.tipo} </small>{" "}
                  </Text>
                )}
              </Group>
            ) : null}
            <Divider my="sm" size="md" variant="dashed" />
            <Group position="apart">
              <Text size={20}>
                {" "}
                <FaParking className="mb-1" /> Vaga:{" "}
                {item.vaga === undefined ? item.numero_vaga : item.vaga}{" "}
              </Text>
            </Group>
            {item.tipo_vaga === undefined ? null : (
              <Group position="apart">
                <Text size={20}>
                  {" "}
                  <FaParking className="mb-1" /> Tipo Vaga: {item.tipo_vaga}{" "}
                </Text>
              </Group>
            )}
              <Group position="apart">
                <Text size={20}>
                  {" "}
                  <FaParking className="mb-1" /> Local: {local}{" "}
                </Text>
              </Group>
            {item.fabricante === undefined ||
            item.modelo === undefined ? null : (
              <Group position="apart">
                <Text size={20}>
                  {" "}
                  <FaCarAlt className="mb-1" /> Modelo: {item.fabricante} (
                  {item.modelo}){" "}
                </Text>
              </Group>
            )}
            <Group position="apart">
              <Text size={20}>
                {" "}
                <BsPaintBucket /> Cor: {item.cor}{" "}
              </Text>
            </Group>

            <Button
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
              fullWidth
              mt="md"
              radius="md"
              onClick={() => registrarProva()}
            >
              REGISTRAR PROVA ‎ <IconReceipt size={18} />
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 60 }}
              fullWidth
              mt="md"
              radius="md"
              onClick={() => verFotos()}
            >
              VISUALIZAR FOTOS ‎ <IconCamera size={18} />
            </Button>
          </Card>
        ))}

      <Card padding="lg" radius="md" withBorder mt="md" className="mb-3">
        <Group position="apart" mb="md">
          <Text> Informe o código para confirmar: </Text>
        </Group>
        <Group position="left">
          <Input
            icon={<FaClipboard />}
            placeholder="Código do DETRAN:"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
        </Group>
        <Button
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          fullWidth
          mt="md"
          radius="md"
          onClick={() => confirmarInfracao()}
        >
          CONFIRMAR AUTO DE INFRAÇÃO ‎ <IconReceipt size={18} />
        </Button>
      </Card>
      <VoltarComponente />
    </div>
  );
};

export default AutoInfracao;
