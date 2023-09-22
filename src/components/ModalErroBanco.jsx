import { Divider, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useEffect } from "react";

const ModalErroBanco = ({ onOpen, onClose, setOnOpen }) => {
    const [opened, { open, close }] = useDisclosure(false);


    useEffect(() => {
        if (onOpen) {
            open();
        } else {
            close();
        }
    }, [onOpen]);

    return (
        <Modal
            style={{ zIndex: 51 }}
            opened={opened}
            onClose={() => {
                close();
                setOnOpen(false)
            }}
            centered
            size="xl"
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "0 auto",
                textAlign: "center"
            }}>
                <IconAlertTriangle size={90} color="gray" />
                <div
                >
                <h2 style={{
                    marginTop: "20px",
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: "#333"
                }}>Não foi possível conectar ao banco!</h2>
                </div>
                <p style={{
                    marginBottom: "65px",
                    fontSize: '.9rem',
                    color: "#666"
                }}>Não conseguimos acessar o sistema do banco.</p>
            </div>
            <Divider className="mb-2" />
            <div
                style={{
                    margin: "0 auto"
                }}
            >
            <h6 style={{
                    fontSize: '.9rem',
                    marginBottom: "0px",
                    color: "#666",
                    textAlign: "center"
                }}>Por favor, tente novamente em instantes.</h6>
            </div>
        </Modal>

    )
}

export default ModalErroBanco;