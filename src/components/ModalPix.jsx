import { Group, Input, Modal, Grid, ActionIcon, CopyButton, Tooltip, Notification, Text, Button, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconArrowsLeftRight, IconCash, IconCheck, IconCopy, IconHelp, IconHelpCircle, IconHelpCircleFilled, IconHelpSmall, IconKey, IconMessageCircle, IconPhoto, IconSettings, IconX } from "@tabler/icons-react";
import axios from "axios";
import { React, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { IconSearch } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";

const ModalPix = ({ qrCode, status, mensagemPix, onOpen }) => {

    const user = JSON.parse(localStorage.getItem('user'))
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        if (onOpen) { 
            open();
        } else {
            close();
        }
    }, [qrCode, onOpen]);
    
  return (
    <div>
          <Modal opened={opened} onClose={() => {close()}} centered size="xl" 
          title={
            <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
        variant="outline"
         sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
         >
           ? </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Instruções:</Menu.Label>
        <Text fz='sm' className="mx-2"><small>1º Clique no "<IconCopy size={10}/>" para copiar o código copia e cola;</small></Text>
        <Text fz='sm' className="mx-2"><small>2º No app do seu banco escolha a opção pix copia e cola;</small></Text> 
        <Text fz='sm' className="mx-2"><small>3º Cole o código no campo pix copia e cola;</small> </Text>
        <Text fz='sm' className="mx-2"><small>4º Retorne ao app e aguarde a confirmação do pagamento!</small> </Text> 
      </Menu.Dropdown>
    </Menu>
          }>
            <div id="borderimg">
              <Group position="center" mt="md" mb="xs">
                <QRCode value={qrCode === undefined ? "a" : qrCode} />
              </Group>
              <Input.Wrapper label="Pix Copia e Cola:" className="mx-2">
                <Grid>
                  <Grid.Col span={10}>
                    <Input
                      icon={<IconKey size="1.1rem" />}
                      placeholder={qrCode}
                      disabled
                    />
                  </Grid.Col>
                  <Grid.Col span={2} className="mt-1">
                    <CopyButton value={qrCode} timeout={2000}>
                      {({ copied, copy }) => (
                        <Tooltip
                          label={copied ? "Copied" : "Copy"}
                          withArrow
                          position="right"
                        >
                          <ActionIcon
                            color={copied ? "teal" : "gray"}
                            onClick={copy}
                          >
                            {copied ? (
                              <IconCheck size="1.2rem" />
                            ) : (
                              <IconCopy size="1.2rem" />
                            )}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>
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
                    icon={mensagemPix === "Pix expirado" ?  <IconX size="1.1rem" /> : <IconCheck size="1.1rem" />}
                    color={mensagemPix === "Pix expirado" ? "red" : "teal"}
                    title={mensagemPix === "Pix expirado" ? "Pix expirado" : "Sucesso!"}
                  >
                    {mensagemPix === "Pix expirado" ? "Tempo limite de pagamento excedido." : "O pix foi pago com sucesso!"}
                  </Notification>
                )}
              </div>
            </div>
          </Modal>
        </div>
  )
}

export default ModalPix