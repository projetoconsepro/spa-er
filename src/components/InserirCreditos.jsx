import { Group, Text, Card, Button, Radio, Image, Input, Modal, Grid, ActionIcon, CopyButton, Tooltip, Notification, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconCash, IconCheck, IconCopy, IconKey, IconX } from "@tabler/icons-react";
import axios from "axios";
import { React, useState, useEffect } from "react";
import QRCode from "react-qr-code";

const InserirCreditos = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [valor, setValor] = useState("");
  const [valor2, setValor2] = useState("");  
  const [data, setData] = useState([]);
  const [notification, setNotification] = useState(true);
  const [tabsValue, setTabsValue] = useState("Meios de pagamento");
  const [metodo, setMetodo] = useState(null);
  const [divAvancar, setDivAvancar] = useState(false);

  const TestePix = (valor) => {
    if(valor === "outro"){
      valor = valor2
    }

    valor = parseFloat(valor.replace(",", ".")).toFixed(2);
    console.log(valor)

    axios.post("https://localhost:3001/gerarcobranca", {
        valor: valor,
      })
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          setData(resposta.data.data);
          open();
        } else {
          console.log("n abriu nkk");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // Crie uma conexão WebSocket com o servidor
    const socket = new WebSocket("ws://localhost:8080/websocket");

    // Quando a conexão é estabelecida
    socket.onopen = () => {
      socket.send("Conexão estabelecida");

      // Envie uma mensagem para o servidor
      socket.send("Olá, servidor!");
    };

    // Quando uma mensagem é recebida do servidor
    socket.onmessage = (event) => {
      console.log(data.txid);
      if (data.txid !== undefined) {
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
      requisicao.get(`/verificarcobranca/${data.txid}`)
        .then((resposta) => {
          console.log(resposta.data)
          if (resposta.data.msg.resultado) {
            setNotification(false);
            setTimeout(() => {
              close();
              setTimeout(() => {
                setNotification(true);
              }, 1000);
            }, 2000);
          } else {
            console.log("nao");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      }
    };


    // Cleanup da conexão WebSocket ao desmontar o componente
    return () => {
      socket.close();
    };
  }, []);

  const handleTabs = () => {
    if(metodo !== null){
      setTabsValue("Valor");
    }
    else {
      setDivAvancar(true)
      setTimeout(() => {
        setDivAvancar(false)
      }, 2000);
    }
  };

  return (
    <div>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Tabs defaultValue={tabsValue} value={tabsValue} inverted>
        <Tabs.List>
          <Tabs.Tab value="Meios de pagamento" icon={<IconCheck size="0.8rem" />} onClick={() => setTabsValue("Meios de pagamento")}>
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
                <Radio value="cartao" disabled/>
                <Image
                  width={50}
                  height={35}
                  src="../../assets/img/cartaoCredito/mastercard.png"
                />
                <Text weight={200}> Mastercard **35</Text>
              </Group>
              <Group mt="xs">
                <Radio value="pix" onClick={()=>{setMetodo('pix')}}/>
                <Image
                  width={35}
                  height={35}
                  src="../../assets/img/cartaoCredito/pixxx.png"
                />
                <Text weight={200}> PIX</Text>
              </Group>
              <Group mt="xs">
                <Radio value="boleto"  disabled/>
                <Image
                  width={35}
                  height={35}
                  src="../../assets/img/cartaoCredito/boletoo.png"
                />
                <Text weight={200} > Boleto Bancário</Text>
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
          {divAvancar ?
            <Notification className="mt-3" icon={<IconX size="1.1rem" />} color="red" withBorder={false}>
            Você precisa selecionar um método de pagamento válido!
            </Notification>
            : null}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="Valor" pt="xs">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group position="center" mt="md" mb="xs">
          <Text weight={500} fz="lg">Quanto você quer recarregar?</Text>
          </Group>
          <Radio.Group>
              <Group mt="xs">
                <Radio value="1" size="lg" label="R$ 5,00" onClick={()=>{setValor('5.00')}}/>
              </Group>
              <Group mt="xs">
                <Radio value="2" size="lg" label="R$ 10,00" onClick={()=>{setValor('10.00')}}/>
              </Group>
              <Group mt="xs">
                <Radio value="3" size="lg" label="R$ 15,00" onClick={()=>{setValor('15.00')}}/>
              </Group>
              <Group mt="xs">
                <Radio value="4" size="lg" label="R$ 20,00" onClick={()=>{setValor('20.00')}}/>
              </Group>
              <Group mt="xs">
                <Radio value="5" size="lg" label="R$ 25,00" onClick={()=>{setValor('25.00')}}/>
              </Group>
              <Group mt="xs">
                <Radio value="6" size="lg" label="R$ 30,00" onClick={()=>{setValor('30.00')}}/> 
              </Group>
              <Group mt="xs">
                <Radio value="7" size="lg" label="R$ 50,00" onClick={()=>{setValor('50.00')}}/>
              </Group>
              <Group mt="xs">
                <Radio value="9" size="lg" label="R$ 100,00" onClick={()=>{setValor('100.00')}}/>
              </Group>
              <Group mt="xs">
                <Radio value="8" size="lg" label="Outro valor:" onClick={()=>{setValor('outro')}}/>
              </Group>
              {
                valor === "outro" ? (
                  <div>
                  <Group position="apart" mt="md" mb="xs">
                      <Text weight={500}>2. Selecione o valor:</Text>
                  </Group>
                    <Input
                      icon={<IconCash />}
                      placeholder="R$ 0,00"
                      value={valor2}
                      onChange={(e) => setValor2(e.target.value)}
                    />
                  </div>
                ) : (
                  null
                )

              }
            </Radio.Group>
          <Button
            variant="gradient"
            gradient={{ from: "teal", to: "blue", deg: 60 }}
            fullWidth
            mt="md"
            radius="md"
            onClick={() => {
              TestePix(valor);
            }}
          >
            Registrar transferência ‎
            <IconCheck size="1.125rem" />
          </Button>
        </Card>
        </Tabs.Panel>

        <div>
          <Modal opened={opened} onClose={close} centered size="xl">
            <div id="borderimg">
              <Group position="center" mt="md" mb="xs">
                <QRCode value={data.brcode === undefined ? "a" : data.brcode} />
              </Group>
              <Input.Wrapper label="Pix Copia e Cola:" className="mx-2">
                <Grid>
                  <Grid.Col span={10}>
                    <Input
                      icon={<IconKey size="1.1rem" />}
                      placeholder={data.brcode}
                      disabled
                    />
                  </Grid.Col>
                  <Grid.Col span={2} className="mt-1">
                    <CopyButton value={data.brcode} timeout={2000}>
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
                {notification ? (
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
                    icon={<IconCheck size="1.1rem" />}
                    color="teal"
                    title="Sucesso!"
                  >
                    Sucesso!
                  </Notification>
                )}
              </div>
            </div>
          </Modal>
        </div>
      </Tabs>
      </Card>
    </div>
  );
};

export default InserirCreditos;
