import { Group, Input, Modal, Grid, ActionIcon, CopyButton, Tooltip, Notification } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconCash, IconCheck, IconCopy, IconKey, IconX } from "@tabler/icons-react";
import axios from "axios";
import { React, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import FuncTrocaComp from "../util/FuncTrocaComp";

const ModalPix = ({ qrCode, status, mensagemPix, onOpen }) => {
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        if (onOpen) {
            open();
        }
    }, [qrCode]);
    
  return (
    <div>
          <Modal opened={opened} onClose={() => {close()}} centered size="xl">
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
                    Por favor abra o aplicativo do seu banco e pague.
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