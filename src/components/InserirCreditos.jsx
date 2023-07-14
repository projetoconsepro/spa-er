import { Group, Text, Card, Button, Radio, Image, Input, Notification, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconCash, IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { React, useState, useRef } from "react";
import FuncTrocaComp from "../util/FuncTrocaComp";
import ModalPix from "./ModalPix";
import { BsCreditCard2Back } from "react-icons/bs";

const InserirCreditos = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const socketRef = useRef(null);
  const [valor, setValor] = useState("");
  const [valor2, setValor2] = useState("");
  const [data, setData] = useState([]);
  const [notification, setNotification] = useState(true);
  const [tabsValue, setTabsValue] = useState("Meios de pagamento");
  const [metodo, setMetodo] = useState(null);
  const [divAvancar, setDivAvancar] = useState(false);
  const [divAvancar2, setDivAvancar2] = useState(false);
  const [pixExpirado, setPixExpirado] = useState("Sucesso!");
  const [txid, setTxId] = useState(null);
  const [onOpen, setOnOpen] = useState(false);

  const inserirCreditos = (campo, valor) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: user2.perfil[0],
      },
    });

    requisicao
      .post("/usuario/saldo/pix", {
        txid: campo,
        valor: valor,
        pagamento: 'pix'
      })
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          FuncTrocaComp("MeusVeiculos");
        } else {
          console.log(resposta);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fazerPix = () => {
    let ValorFinal = valor;

    if (ValorFinal === "outro") {
      ValorFinal = valor2;
    }

    ValorFinal = parseFloat(ValorFinal.replace(",", ".")).toFixed(2);

    if (
      ValorFinal <= 0 ||
      ValorFinal == "" ||
      ValorFinal == "" ||
      ValorFinal == null ||
      ValorFinal == undefined ||
      isNaN(ValorFinal)
    ) {
      console.log("toma");
      setDivAvancar2(true);
      setTimeout(() => {
        setDivAvancar2(false);
      }, 5000);
      return;
    } else {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const user2 = JSON.parse(user);
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });

      requisicao
        .post("/gerarcobranca", {
          valor: ValorFinal,
          campo: ValorFinal,
        })
        .then((resposta) => {
          console.log(resposta);
          if (resposta.data.msg.resultado) {
            console.log(resposta.data.data);
            console.log(resposta.data.data.txid);
            setData(resposta.data.data);
            setTxId(resposta.data.data.txid);
            inserirCreditos(resposta.data.data.txid, ValorFinal)
            setOnOpen(true);
            setNotification(true)
            open();
          } else {
            console.log("n abriu nkk");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleTabs = () => {
    console.log(metodo);
    if (metodo === "pix") {
      setTabsValue("Valor");
    } else if (metodo === "") {
      setDivAvancar(true);
      setTimeout(() => {
        setDivAvancar(false);
      }, 5000);
    }
    else {
      setDivAvancar(true);
      setTimeout(() => {
        setDivAvancar(false);
      }, 5000);
    }
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

    setValor2(valor);
  };

  return (
    <div>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Tabs defaultValue={tabsValue} value={tabsValue} inverted>
          <Tabs.List>
            <Tabs.Tab
              value="Meios de pagamento"
              icon={<IconCheck size="0.8rem" />}
              onClick={() => setTabsValue("Meios de pagamento")}
            >
              Pagamento
            </Tabs.Tab>
            <Tabs.Tab value="Valor" icon={<IconCheck size="0.8rem" />}>
              Valor
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Meios de pagamento" pt="xs">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>1. Escolha o método de pagamento:</Text>
              </Group>
              <Radio.Group>
                <Group mt="xs">
                  <Radio
                    value="cartaoCredito"
                    onClick={() => {
                      setMetodo("cartaoCredito");
                    }}
                  />
                  <BsCreditCard2Back  className="mx-1" size={25}/>
                  <Text weight={200}> Cartão de crédito</Text>
                </Group>
                <Group mt="xs">
                  <Radio
                    value="pix"
                    onClick={() => {
                      setMetodo("pix");
                    }}
                  />
                  <Image
                    width={35}
                    height={35}
                    src="../../assets/img/cartaoCredito/pixxx.png"
                  />
                  <Text weight={200}> PIX</Text>
                </Group>
                <Group mt="xs">
                  <Radio
                    value="cartaoDebito"
                    onClick={() => {
                      setMetodo("cartaoDebito");
                    }}
                  />
                  <BsCreditCard2Back className="mx-1" size={25}/>
                  <Text weight={200}> Cartão de débito</Text>
                </Group>
              </Radio.Group>
              <Button
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
                fullWidth
                mt="md"
                radius="md"
                onClick={() => handleTabs()}
              >
                Avançar ‎
                <IconArrowRight size="1.125rem" />
              </Button>
              {divAvancar ? (
                <Notification
                  className="mt-3"
                  icon={<IconX size="1.1rem" />}
                  color="red"
                  withBorder={false}
                >
                  <Text weight={500} color="red">
                    {metodo === null ? "Você precisa selecionar um método de pagamento!" :
                    "Método de pagamento ainda não implementado! Estamos trabalhando nisso. "}
                  </Text>
                </Notification>
              ) : null}
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="Valor" pt="xs">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group position="center" mt="md" mb="xs">
                <Text weight={500} fz="lg">
                  Quanto você quer recarregar?
                </Text>
              </Group>
              <Radio.Group>
                <Group mt="xs">
                  <Radio
                    value="1"
                    size="lg"
                    label="R$ 5,00"
                    onClick={() => {
                      setValor("5.00");
                    }}
                  />
                </Group>
                <Group mt="xs">
                  <Radio
                    value="2"
                    size="lg"
                    label="R$ 10,00"
                    onClick={() => {
                      setValor("10.00");
                    }}
                  />
                </Group>
                <Group mt="xs">
                  <Radio
                    value="3"
                    size="lg"
                    label="R$ 15,00"
                    onClick={() => {
                      setValor("15.00");
                    }}
                  />
                </Group>
                <Group mt="xs">
                  <Radio
                    value="4"
                    size="lg"
                    label="R$ 20,00"
                    onClick={() => {
                      setValor("20.00");
                    }}
                  />
                </Group>
                <Group mt="xs">
                  <Radio
                    value="5"
                    size="lg"
                    label="R$ 25,00"
                    onClick={() => {
                      setValor("25.00");
                    }}
                  />
                </Group>
                <Group mt="xs">
                  <Radio
                    value="6"
                    size="lg"
                    label="R$ 30,00"
                    onClick={() => {
                      setValor("30.00");
                    }}
                  />
                </Group>
                <Group mt="xs">
                  <Radio
                    value="7"
                    size="lg"
                    label="R$ 50,00"
                    onClick={() => {
                      setValor("50.00");
                    }}
                  />
                </Group>
                <Group mt="xs">
                  <Radio
                    value="9"
                    size="lg"
                    label="R$ 100,00"
                    onClick={() => {
                      setValor("100.00");
                    }}
                  />
                </Group>
                <Group mt="xs">
                  <Radio
                    value="8"
                    size="lg"
                    label="Outro valor:"
                    onClick={() => {
                      setValor("outro");
                    }}
                  />
                </Group>
                {valor === "outro" ? (
                  <div>
                    <Group position="apart" mt="md" mb="xs">
                      <Text weight={500}>2. Selecione o valor:</Text>
                    </Group>
                    <Input
                      icon={<IconCash />}
                      placeholder="R$ 0,00"
                      value={valor2}
                      onChange={(e) => FuncArrumaInput(e)}
                    />
                  </div>
                ) : null}
              </Radio.Group>
              <Button
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
                fullWidth
                mt="md"
                radius="md"
                onClick={() => {
                  fazerPix();
                }}
              >
                Registrar transferência ‎
                <IconCheck size="1.125rem" />
              </Button>
              {divAvancar2 ? (
                <Notification
                  className="mt-3"
                  icon={<IconX size="1.1rem" />}
                  color="red"
                  withBorder={false}
                >
                  {valor !== ""
                    ? "Você precisa selecionar um valor acima de R$ 2,00!"
                    : "Você precisa selecionar algum valor!"}
                </Notification>
              ) : null}
            </Card>
          </Tabs.Panel>

          <ModalPix
            qrCode={data.brcode}
            status={notification}
            mensagemPix={pixExpirado}
            onOpen={onOpen}
          />
        </Tabs>
      </Card>
    </div>
  );
};

export default InserirCreditos;
