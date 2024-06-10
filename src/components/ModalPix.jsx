import {
  Group,
  Input,
  Modal,
  Notification,
  Text,
  Button,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconCopy, IconX } from "@tabler/icons-react";
import VoltarComponente from "../util/VoltarComponente";
import RegistrarEstacionamentoParceiro from "./RegistrarEstacionamentoParceiro";
import ImpressaoTicketCredito from "../util/ImpressaoTicketCredito";
import ImpressaoTicketRegularizacao from "../util/ImpressaoTicketRegularizacao";
import ImpressaoTicketEstacionamento from "../util/ImpressaoTicketEstacionamento";
import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { FaCopy, FaCheck } from "react-icons/fa";

const ModalPix = ({ qrCode, status, mensagemPix, onOpen, onClose , funcao}) => {
  const inputRef = useRef(null);
  const [icon, setIcon] = useState("FaCopy");
  const [perfil, setPerfil] = useState(" ");
  const componente = localStorage.getItem("componente");
  const [opened, { open, close }] = useDisclosure(false);
  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand("copy");
      setIcon("FaCheck");

      setTimeout(() => {
        setIcon("FaCopy");
        }, 1000);
        }
  };

  useEffect(() => {
    if (onOpen) {
      open();
      } else {
        close();
        }
        }, [qrCode, onOpen]);
        
        useEffect(() => {
          if (!opened && onClose) {
            onClose();
    }
  }, [opened]);

  return (
    <div>
      <Modal
        style={{ zIndex: 51 }}
        opened={opened}
        onClose={close}
        centered
        size="xl"
        title={
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button
                variant="outline"
                sx={{ fontFamily: "Greycliff CF, sans-serif" }}
              >
                ?{" "}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Instruções:</Menu.Label>
              <Text fz="sm" className="mx-2">
                <small>
                  1º Clique no "<IconCopy size={10} />" para copiar o código
                  copia e cola;
                </small>
              </Text>
              <Text fz="sm" className="mx-2">
                <small>
                  2º No app do seu banco escolha a opção pix copia e cola;
                </small>
              </Text>
              <Text fz="sm" className="mx-2">
                <small>3º Cole o código no campo pix copia e cola;</small>{" "}
              </Text>
              <Text fz="sm" className="mx-2">
                <small>
                  4º Retorne ao app e aguarde a confirmação do pagamento!
                </small>{" "}
              </Text>
            </Menu.Dropdown>
          </Menu>
        }
      >
        <div id="borderimg">
          <Group position="center" mt="md" mb="xs">
            <QRCode value={qrCode === undefined ? "a" : qrCode} />
          </Group>
          <div style={{ alignItems: "center" }}>
          {perfil === "monitor" ? (
          <div>
            <Input
              ref={inputRef}
              type="text"
              value={qrCode}
              readOnly
              style={{ flex: 1 }}
            />
            <VoltarComponente space={true} />
            <Button
              mt={4}
              onClick={copyToClipboard}
              style={{
                color: "white",
                backgroundColor: icon === "FaCopy" ? "" : "green",
                padding: "8px",
                cursor: "pointer",
              }}
              fullWidth
            >
              <span className="material-icons" style={{ color: "white" }}>
                {icon === "FaCopy"
                  ? "Clique para copiar o código"
                  : "Código copiado"}
                {icon === "FaCopy" ? <FaCopy /> : <FaCheck color="white" />}
              </span>
            </Button>
          </div>
        ) : (
          <>
            <Input
              ref={inputRef}
              type="text"
              value={qrCode}
              readOnly
              style={{ flex: 1 }}
            />
            <div className="pt-4 mb-4 gap-4 d-flex alignItems-center">
              <Button
                mt={4}
                onClick={funcao}
                loaderPosition="right"
                className="bg-blue-50"
                radius="md"
                style={{
                  width: "300px",
                  height: "50px",
                  marginBottom: "2px",
                }}
              >
                Imprimir
              </Button>
              <VoltarComponente fechar={true} />
            </div>
          </>
        )}
          </div>
          <div className="mt-3">
            {status ? (
              <Notification
                loading
                color="green"
                title="Aguardando pagamento"
                withCloseButton={false}
              >
                A confirmação do pagamento será automática.
              </Notification>
            ) : (
              <Notification
                icon={
                  mensagemPix === "Pix expirado" ? (
                    <IconX size="1.1rem" />
                  ) : (
                    <IconCheck size="1.1rem" />
                  )
                }
                color={mensagemPix === "Pix expirado" ? "red" : "teal"}
                title={
                  mensagemPix === "Pix expirado" ? "Pix expirado" : "Sucesso!"
                }
              >
                {mensagemPix === "Pix expirado"
                  ? "Tempo limite de pagamento excedido."
                  : "O pix foi pago com sucesso!"}
              </Notification>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ModalPix;
