import { Group, Text, Card, Button, Radio, Image, Input, Modal, Grid, ActionIcon, CopyButton, Tooltip, Notification, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconCash, IconCheck, IconCopy, IconKey, IconX } from "@tabler/icons-react";
import axios from "axios";
import { React, useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import FuncTrocaComp from "../util/FuncTrocaComp";
import ModalPix from "./ModalPix";

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

  const inserirCreditos = (valor) => {
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

  requisicao.post("/usuario/saldo", {
    valor: valor,
    pagamento: metodo,
  })
  .then((resposta) => {
    if (resposta.data.msg.resultado) {
      FuncTrocaComp("MeusVeiculos")
    } else {
      console.log(resposta);
    }
  }
  ).catch((err) => {
    console.log(err)
  });
}

  const fazerPix = (valor) => {
    setOnOpen(true)
    if(valor === "outro"){
      valor = valor2
    }

    valor = parseFloat(valor.replace(",", ".")).toFixed(2);
    console.log(valor, 'valor1')
    if(valor <= 0 || valor == 'NAN'){
      setDivAvancar2(true)
      setTimeout(() => {
        setDivAvancar2(false)
      }, 3000);
    }
    else{
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

    requisicao.post("/gerarcobranca", {
        valor: valor,
      })
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          console.log(resposta.data.data);
          console.log(resposta.data.data.txid);
          setData(resposta.data.data);
          setTxId(resposta.data.data.txid);
          open();
        } else {
          console.log("n abriu nkk");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

  useEffect(() => {

    // Crie uma conexão WebSocket com o servidor
    socketRef.current = new WebSocket(`${process.env.REACT_APP_WS}/websocket`);
    

    // Quando a conexão é estabelecida
    socketRef.current.onopen = () => {
      
      socketRef.current.send("Conexão estabelecida");

      // Envie uma mensagem para o servidor
      socketRef.current.send("Olá, servidor!");
    };

    // Quando uma mensagem é recebida do servidor
    socketRef.current.onmessage = (event) => {
      funcPix(event);
    };

    // Cleanup da conexão WebSocket ao desmontar o componente
    return () => {
      socketRef.current.close();
    };
  }, [txid]);

  // Função para fechar a conexão em outro lugar
  const closeSocketConnection = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

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


  const funcPix = (event) => {
    console.log(txid, 'txid')
    const json = JSON.parse(event.data)
    if (txid !== undefined && json.txid === txid) {
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
    requisicao.get(`/verificarcobranca/${txid}`)
      .then((resposta) => {
        console.log(resposta.data)
        if (resposta.data.msg.resultado) {
          closeSocketConnection();
          inserirCreditos(json.valor);
          setNotification(false);
          setTimeout(() => {
            close();
            setTimeout(() => {
              setNotification(true);
            }, 2000);
          }, 3000);

        } else {
          console.log('deu 5 min')
          setNotification(false)
          setPixExpirado("Pix expirado")
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
              fazerPix(valor);
            }}
          >
            Registrar transferência ‎
            <IconCheck size="1.125rem" />
          </Button>
          {divAvancar2 ?
            <Notification className="mt-3" icon={<IconX size="1.1rem" />} color="red" withBorder={false}>
            {valor !== "" ? 'Você precisa selecionar um valor acima de R$ 2,00!' : 'Você precisa selecionar algum valor!'}
            </Notification>
            : null}
        </Card>
        </Tabs.Panel>

        <ModalPix qrCode={data.brcode} status={notification} mensagemPix={pixExpirado} onOpen={onOpen} />

      </Tabs>
      </Card>
    </div>
  );
};

export default InserirCreditos;
