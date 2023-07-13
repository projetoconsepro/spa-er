import { Accordion, Badge, Button, Card, Group, Text } from "@mantine/core";
import { FaWhatsapp } from "react-icons/fa";
import { IconHelpTriangle, IconMail, IconVideo } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { FiMail, FiMap } from 'react-icons/fi';

const Suporte = () => {
  const [nome, setNome] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    setNome(user2.nome);
  }, []);

  return (
    <div>
      <Card padding="lg" radius="md" withBorder>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Olá, {nome}!</Text>
          <Badge color="red" variant="light">
            {" "}
            SUPORTE{" "}
          </Badge>
        </Group>
        <Text size="sm" color="dimmed">
          Seja bem vindo(a) ao nosso suporte! Aqui você pode tirar suas dúvidas,
          fazer sugestões ou entrar em contato conosco.
        </Text>
      </Card>
      <Accordion
        variant="contained"
        styles={{ item: { backgroundColor: "white" } }}
      >
        <Accordion.Item value="duvidas">
          <Accordion.Control icon={<IconHelpTriangle color="yellow" />}>
            Dúvidas frequentes
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion
              variant="contained"
              styles={{ item: { backgroundColor: "white" } }}
            >
              <Accordion.Item value="pergunta">
                <Accordion.Control>
                  Porque seu saldo sumiu agora do nada??????
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" color="dimmed">
                    RESPOSTA MUITO LEGAL EM PQP
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="pergunta2">
                <Accordion.Control>
                  Porque seu saldo sumiu agora do nada??????
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" color="dimmed">
                    RESPOSTA MUITO LEGAL EM PQP
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="pergunta3">
                <Accordion.Control>
                  Porque seu saldo sumiu agora do nada??????
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" color="dimmed">
                    RESPOSTA MUITO LEGAL EM PQP
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="tutorial">
          <Accordion.Control icon={<IconVideo color="blue" />}>
            Como usar o sistema
          </Accordion.Control>
          <Accordion.Panel></Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="contato">
          <Accordion.Control icon={<IconMail color="red" />}>
            Contato
          </Accordion.Control>
          <Accordion.Panel>
            <div className="mt-2">
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaWhatsapp
                  size={20}
                  style={{ marginRight: "5px", color: "green" }}
                />
                <span>Contato via WhatsApp</span>
              </div>
            </div>
            <div className={window.innerWidth > 768 ? "text-start mt-3 mx-3" : "text-center mt-3 mx-3"}>
              <a href="https://api.whatsapp.com/send?phone=5198007341&text=Olá!">
                <Button 
                  radius="sm"
                  className="text-start" 
                  variant="gradient"
                  size="md"
                  gradient={{ from: 'teal', to: 'green'}}>
                  Iniciar conversa
                </Button>
              </a>
            </div>
            <div className="mt-4">
              <div style={{ display: "flex", alignItems: "center" }}>
                <FiMap
                  size={20}
                  style={{ marginRight: "5px", color: "blue" }}
                />
                <span>Endereço</span>
              </div>
            </div>
            <div className="text-start mt-3 mx-3">
              <Text size="sm" color="dimmed">
                Condominio Viena Shopping - R. Júlio de Castilhos, 2500 - 12 - Centro, Taquara - RS, 95600-000
              </Text>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Suporte;