import { Accordion, Badge, Button, Card, Group, Text } from "@mantine/core";
import { FaWhatsapp } from "react-icons/fa";
import { Icon24Hours, IconArrowAutofitContent, IconCheck, IconHelpTriangle, IconLamp, IconLamp2, IconMail, IconVideo } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { FiMail, FiMap } from 'react-icons/fi';
import { FcIdea } from "react-icons/fc";
import axios from "axios";
import Swal from "sweetalert2";

const Suporte = () => {
  const [nome, setNome] = useState("");
  const [textoSuporte, setTextoSuporte] = useState("");



  const handleSugestao = async () => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const token = localStorage.getItem("token");
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: "cliente",
      },
    });

    await requisicao
      .post("/usuario/sugestao", {
        descricao: textoSuporte,
      })
      .then((res) => {
        if (res.data.msg.resultado) {
          setTextoSuporte("");
          Swal.fire( "Sucesso!", res.data.msg.msg, "success");
        } else {
          Swal.fire( "Erro!", res.data.msg.msg, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };







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
          <Accordion.Control icon={<IconHelpTriangle color="orange" />}>
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
        <Accordion.Item value="sugestões">
          <Accordion.Control icon={<FcIdea color="red" />}>
            Sugestões
          </Accordion.Control>
          <Accordion.Panel>

          <div className='text-start'style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            Sua contribuição é extremamente importante para nós!
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Ela nos ajuda a melhorar constantemente o nosso sistema.
          </p>
        </div>
        <textarea
          value={textoSuporte}
          onChange={(e) => setTextoSuporte(e.target.value)}
          placeholder="Digite sua sugestão aqui"
          style={{
            width: '100%',
            color: '#666',
            height: '150px',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />

        <Button
          variant="gradient"
          gradient={{ from: 'green', to: 'blue'}}
          radius="sm"
          size="md"
          style={{ marginTop: '1rem' }}
          onClick={() => {handleSugestao()}}
        >
          Enviar  ‎ ‎ <IconCheck />
        </Button>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Suporte;