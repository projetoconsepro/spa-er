import {
  Accordion,
  Badge,
  Button,
  Card,
  Group,
  Input,
  Text,
} from "@mantine/core";
import { FaWhatsapp } from "react-icons/fa";
import {
  IconCheck,
  IconHelpTriangle,
  IconMail,
  IconVideo,
} from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { FiMail, FiMap } from "react-icons/fi";
import { FcIdea } from "react-icons/fc";
import axios from "axios";
import Swal from "sweetalert2";
import createAPI from "../services/createAPI";

const Suporte = () => {
  const [nome, setNome] = useState("");
  const [textoSuporte, setTextoSuporte] = useState("");
  const [assunto, setAssunto] = useState("");
  const [perfil, setPerfil] = useState("");

  const handleSugestao = async () => {
    if (textoSuporte === "" || assunto === "") {
      Swal.fire("Aviso!", "Preencha todos os campos!", "error");
      return;
    }

    const requisicao = createAPI();

    await requisicao
      .post("/usuario/sugestao", {
        descricao: textoSuporte,
        assunto: assunto,
      })
      .then((res) => {
        if (res.data.msg.resultado) {
          setTextoSuporte("");
          setAssunto("");
          Swal.fire("Sucesso!", res.data.msg.msg, "success");
        } else {
          Swal.fire("Erro!", res.data.msg.msg, "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    setPerfil(user2.perfil[0]);
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
        className="text-start"
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
              <Accordion.Item value="pergunta6">
                <Accordion.Control>
                  Qual é o horário de funcionamento do estacionamento rotativo?
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" color="dimmed">
                    O horário de funcionamento do estacionamento rotativo é das
                    9h às 18h, de segunda a sexta-feira, e aos sábados até às
                    13h.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="pergunta">
                <Accordion.Control>
                  Qual o tempo limite de duração do meu saldo?
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" color="dimmed">
                    Não há limite de tempo para o uso do saldo, ele é seu e você
                    pode utilizá-lo quando desejar.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="pergunta2">
                <Accordion.Control>
                  Qual é o prazo para a regularização de uma notificação do meu
                  veículo?
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" color="dimmed">
                    Você tem um prazo de dois dias para realizar a regularização
                    de uma notificação do seu veículo.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="pergunta3">
                <Accordion.Control>
                  Qual é o período de tolerância do estacionamento rotativo?
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" color="dimmed">
                    O período de tolerância para o estacionamento rotativo é de
                    10 minutos.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="pergunta4">
                <Accordion.Control>
                  É permitido estacionar o veículo na vaga destinada a idosos?
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" color="dimmed">
                    Para estacionar na vaga destinada a idosos, é necessário
                    possuir o cartão de idoso. Caso contrário, estará sujeito a
                    receber notificações.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="pergunta5">
                <Accordion.Control>
                  Onde posso solicitar o cartão de estacionamento para idosos?
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" color="dimmed">
                    No setor de trânsito da Prefeitura de Taqura, localizado na
                    Rua Tristão Monteiro, 1278 - Centro, Taquara.
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
          <Accordion.Panel>
            {perfil === "cliente" ?
          <Accordion
              variant="contained"
              styles={{ item: { backgroundColor: "white" } }}
            >
              <Accordion.Item value="Debito">
                <Accordion.Control>
                  Como habilitar o débito automático?
                </Accordion.Control>
                <Accordion.Panel>
                <iframe width="100%" height="500" src="https://www.youtube.com/embed/bn9r5PDI4WE" title="Habilitando o débito automático" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="credito">
                <Accordion.Control>
                  Como faço para comprar créditos?
                </Accordion.Control>
                <Accordion.Panel>
                <iframe width="100%" height="500" src="https://www.youtube.com/embed/_pI2x798syo" title="Adicionar crédito" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="estacionar">
                <Accordion.Control>
                  Como estacionar pelo aplicativo?
                </Accordion.Control>
                <Accordion.Panel>
                <iframe width="100%" height="500" src="https://www.youtube.com/embed/TTZyZRaq7Og" title="Estacionamento pelo App" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="whatsapp">
                <Accordion.Control>
                  Como estacionar pelo WhatsApp?
                </Accordion.Control>
                <Accordion.Panel>
                <iframe width="100%" height="500" src="https://www.youtube.com/embed/qpaxJ7In8Mg" title="Estacionamento pelo WhatsApp" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            : null }
          </Accordion.Panel>
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
            <div
              className={
                window.innerWidth > 768
                  ? "text-start mt-3 mx-3"
                  : "text-center mt-3 mx-3"
              }
            >
              <a href="https://api.whatsapp.com/send?phone=5186604241&text=Olá!">
                <Button
                  radius="sm"
                  className="text-start"
                  variant="gradient"
                  size="md"
                  gradient={{ from: "teal", to: "green" }}
                >
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
                Condominio Viena Shopping - R. Júlio de Castilhos, 2500 - 12 -
                Centro, Taquara - RS, 95600-000
              </Text>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="sugestões">
          <Accordion.Control icon={<FcIdea color="red" />}>
            Sugestões
          </Accordion.Control>
          <Accordion.Panel>
            <div className="text-start" style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                Sua contribuição é extremamente importante para nós!
              </p>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Ela nos ajuda a melhorar constantemente o nosso sistema.
              </p>
            </div>
            <Input
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="mb-3"
              placeholder="Qual o assunto da sua sugestão?"
            />
            <textarea
              value={textoSuporte}
              onChange={(e) => setTextoSuporte(e.target.value)}
              placeholder="Digite sua sugestão aqui"
              style={{
                width: "100%",
                color: "#666",
                height: "150px",
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />

            <Button
              variant="gradient"
              gradient={{ from: "green", to: "blue" }}
              radius="sm"
              size="md"
              style={{ marginTop: "1rem" }}
              onClick={() => {
                handleSugestao();
              }}
            >
              Enviar ‎ ‎ <IconCheck />
            </Button>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Suporte;
