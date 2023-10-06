import { Group, Text, Card, Button, Radio, Image, Input, Notification, Tabs, Stack, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowForwardUpDouble, IconArrowRight, IconCash, IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { React, useState, useRef, useEffect } from "react";
import FuncTrocaComp from "../util/FuncTrocaComp";
import ModalPix from "./ModalPix";
import { BsCreditCard2Back, BsCreditCard2Front } from "react-icons/bs";
import createAPI from "../services/createAPI";
import VoltarComponente from "../util/VoltarComponente";
import ModalErroBanco from "./ModalErroBanco";
import { MdPix } from "react-icons/md";
import { FaSave, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const InserirCreditos = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const socketRef = useRef(null);
  const [valor, setValor] = useState("15.00");
  const [valor2, setValor2] = useState("");
  const [data, setData] = useState([]);
  const [notification, setNotification] = useState(true);
  const [tabsValue, setTabsValue] = useState("Meios de pagamento");
  const [metodo, setMetodo] = useState('pix');
  const [divAvancar, setDivAvancar] = useState(false);
  const [divAvancar2, setDivAvancar2] = useState(false);
  const [pixExpirado, setPixExpirado] = useState("Sucesso!");
  const [txid, setTxId] = useState(null);
  const [onOpen, setOnOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [onOpenError, setOnOpenError] = useState(false);
  const [onCloseError, setOnCloseError] = useState(false);
  const [CreditCardSelected, setCreditCardSelected] = useState(null);
  const [creditCard, setCreditCard] = useState([]);
  const [valorPadrao, setValorPadrao] = useState('3');

  useEffect(() => {
    if (metodo === 'pix') {
      setValorPadrao('3');
    } else {
      setValorPadrao('4');
    }
  }, [metodo]);


  const getCreditCardFUNC = async () => {
    const requisicao = createAPI();

    await requisicao
      .get("/cartao/")
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          const newData = resposta.data.data.map((item) => ({
            cartao: item.id_cartao,
            bandeira: item.bandeira,
            numero:  `#### #### #### ${item.cartao}`,
            debito: item.debito,
            credito: item.credito,
          }));
          setCreditCard(newData);
        } else {
          setCreditCard([]);
        }
      })
      .catch((err) => {
        setCreditCard([]);
      });
    }
    
  useEffect(() => {
    getCreditCardFUNC();
  }, []);


  const inserirCreditos = async (campo, valor) => {
    const requisicao = await createAPI();

    await requisicao
      .post("/usuario/saldo/pix", {
        txid: campo,
        valor: valor,
        pagamento: 'pix'
      })
      .then((resposta) => {
        if (resposta.data.msg.resultado) {
          FuncTrocaComp("MeusVeiculos");
        } else {
          setNotification(false);
          setPixExpirado("Pix expirado");
        }
      })
      .catch((err) => {
        setButtonDisabled(false);
        setOnOpenError(true);
      });
  };

  const fazerPix = () => {
    setButtonDisabled(true);

    let ValorFinal = valor;
    if (ValorFinal === "outro") {
      ValorFinal = valor2;
    }
    ValorFinal = parseFloat(ValorFinal.replace(",", ".")).toFixed(2);

    if (
      ValorFinal <= 2 ||
      ValorFinal == "" ||
      ValorFinal == "" ||
      ValorFinal == null ||
      ValorFinal == undefined ||
      isNaN(ValorFinal)
    ) {
      setButtonDisabled(false);
      setDivAvancar2(true);
      setTimeout(() => {
        setDivAvancar2(false);
      }, 5000);
      return;
    } else {
      const requisicao = createAPI();

      requisicao
        .post("/gerarcobranca", {
          valor: ValorFinal,
          campo: ValorFinal,
        })
        .then((resposta) => {
          setButtonDisabled(false);
          if (resposta.data.msg.resultado) {
            setData(resposta.data.data);
            setTxId(resposta.data.data.txid);
            inserirCreditos(resposta.data.data.txid, ValorFinal)
            setOnOpen(true);
            setNotification(true)
            open();
          } else {
          }
        })
        .catch((err) => {
          setButtonDisabled(false);
          setOnOpenError(true);
        });
    }
  };

  const handleTabs = () => {
    if (metodo === "pix") {
      setTabsValue("Valor");
    } else if (metodo === "cartaoDeb" || metodo === "cartaoCred") {
      if (creditCard.length > 0) {
        if (CreditCardSelected !== null) {
          setTabsValue("Valor");
        } else {
          setDivAvancar(true);
          setTimeout(() => {
            setDivAvancar(false);
          }, 5000);
        }
      } else {
        setDivAvancar(true);
        setTimeout(() => {
          setDivAvancar(false);
        }, 5000);
      }
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

  const pagamentoCartao = () => {
    const id_cartao = creditCard[CreditCardSelected].cartao;
    setButtonDisabled(true);
    let ValorFinal = valor;
    if (ValorFinal === "outro") {
      ValorFinal = valor2;
    }
    ValorFinal = parseFloat(ValorFinal.replace(",", ".")).toFixed(2);
    console.log(ValorFinal, ValorFinal < 20)
    if (
      ValorFinal < 20 ||
      ValorFinal == "" ||
      ValorFinal == "" ||
      ValorFinal == null ||
      ValorFinal == undefined ||
      isNaN(ValorFinal)
    ) {
      setButtonDisabled(false);
      setDivAvancar2(true);
      setTimeout(() => {
        setDivAvancar2(false);
      }, 5000);
      return;
    } 


    const requisicao = createAPI();

    requisicao.post("/cartao/credito", {
      cartao: id_cartao,
      valor: ValorFinal,
      tipo: metodo === 'cartaoDeb' ? 'debit' : 'credit',
    }).then((resposta) => {
      if (resposta.data.msg.resultado){
        setButtonDisabled(false);
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Crédito inserido com sucesso!',
          showConfirmButton: true,
          confirmButtonText: 'Ok',
        }).then(() => {
          FuncTrocaComp('MeusVeiculos')
        })
      } else {
        setButtonDisabled(false);
        Swal.fire({
          icon: 'warning',
          title: 'Aviso!',
          text: 'Ops, parece que o pagamento não foi concluído como esperado. Por favor, revise suas informações e tente realizar o pagamento novamente quando possível.',
          showConfirmButton: true,
          confirmButtonText: 'Ok',
        })
      }
  })
}

  useEffect(() => {
    if (metodo === 'pix') {
      setValor('15.00');
    } else {
      setValor('20.00');
    }
  }, [metodo]);

  const validaFormato = () => {
    if (metodo === 'pix' ) {
      fazerPix();
    } else {
      pagamentoCartao();
    }
  }


  return (
    <div>
      <Card shadow="sm" padding="lg" radius="md" className="mb-4" withBorder>
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
                <Text weight={500}>1. Selecione o método de pagamento:</Text>
              </Group>


              <Group position="apart" mt="lg">

                <Group position="apart" className="d-block">
                <div className="col-3 d-flex align-items-center justify-content-center border border-success rounded" style={{ height: '75px', width: '80px',  background: metodo === 'pix' ? 'linear-gradient(to right, #0CA678,  #1098AD)' : 'transparent' }}
                  onClick={() => setMetodo('pix')}>

                  <MdPix className="mx-1" size={35}
                  color={metodo === 'pix' ? 'white' : 'black'}
                  />

                </div>
                <Text weight={500} color='green'>Pix</Text>
                </Group>

                <Group position="apart" className="d-block">
                <div className='col-3 d-flex align-items-center justify-content-center border border-success rounded' style={{ height: '75px', width: '80px',background: metodo === 'cartaoDeb' ? 'linear-gradient(to right, #0CA678,  #1098AD)' : 'transparent' }}
                onClick={() => setMetodo('cartaoDeb')}>
                  <BsCreditCard2Back className="mx-1" size={35}
                    style={{ color: metodo === 'cartaoDeb' ? 'white' : 'black' }}
                  />
                </div>
                <Text weight={500} color='green'>Débito</Text>
                </Group>
                <Group position="apart" className="d-block">
                <div className="col-3 d-flex align-items-center justify-content-center border border-success rounded" style={{ height: '75px', width: '80px', background: metodo === 'cartaoCred' ? 'linear-gradient(to right, #0CA678,  #1098AD)' : 'transparent' }}
                onClick={() => setMetodo('cartaoCred')}>
                <BsCreditCard2Front className="mx-1" size={35}
                style={{ color: metodo === 'cartaoCred' ? 'white' : 'black' }}
                />
                </div>
                 <Text weight={500} color='green'>Crédito</Text>
              </Group>
              </Group>

              {metodo !== "pix" ? (
                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500}>2. Selecione seu cartão:</Text>
                </Group>
              ) : ( null )}

                {metodo !== "pix" && creditCard.length > 0 ? (
                  <div>
                  {creditCard.map((item, index) => (
                    item.credito === 'S' && metodo === 'cartaoCred' || item.debito === 'S' && metodo === 'cartaoDeb' ? (
                    <div key={index}>
                    <Box className="border border-black rounded mb-2 align-items-center" 
                    style={{ maxWidth: '400px', minHeight : '50px', backgroundImage: CreditCardSelected === index ?'linear-gradient(45deg, #0CA678,  #1098AD)' : 'none'  }}
                    onClick={() => setCreditCardSelected(index)}
                    >
                      <div className="d-flex align-items-center">
                        <div className="align-items-center">
                        {item.bandeira === 'visa' ? (
                              CreditCardSelected !== index ? (
                                <Image
                                  src='../../assets/img/cartaoCredito/visa-unselected.png'
                                  alt="image"
                                  style={{ width: 45, height: 45, display: 'flex', alignItems: 'center', marginLeft: '5px'  }}
                                />
                              ) : (
                                <Image
                                  src='../../assets/img/cartaoCredito/visa.png'
                                  alt="image"
                                  style={{ width: 45, height: 45, display: 'flex', alignItems: 'center', marginLeft: '5px'  }}
                                />
                              )
                          ) : item.bandeira === 'mastercard' ? (
                            <Image
                              src='../../assets/img/cartaoCredito/mastercard.png'
                              alt="image"
                              style={{ width: 50, height: 50, display: 'flex', alignItems: 'center'}}
                            />
                          ) : item.bandeira === 'elocard' ? (
                            CreditCardSelected === index ? (
                            <Image
                              src='../../assets/img/cartaoCredito/elocard.png'
                              alt="image"
                              style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', marginLeft: '2px'}}
                            />
                            ) : (
                              <Image
                              src='../../assets/img/cartaoCredito/elocard-unselected.png'
                              alt="image"
                              style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', marginLeft: '2px'}}
                            />
                          )
                          )
                          :
                          <BsCreditCard2Back className="m-2"
                          size={30}
                          color={CreditCardSelected === index ? 'white' : 'black'}
                          />
                          }
                        </div>
                        <div className={CreditCardSelected === index ? "text-start text-white mx-2" : "text-start mx-2" }>
                          <Text weight={400}  style={{ marginTop: '-3px' }}>{item.numero}</Text>
                        </div>
                      </div>
                    </Box>
                  </div>
                    ) : null 
                  ))}
                      <Button className='mt-3 mb-3' variant="outline" leftIcon={<IconArrowForwardUpDouble size="1rem" />} onClick={() => { FuncTrocaComp('CartaoCredito') }}>
                            Adicionar novo cartão
                      </Button>
                </div>
                ) : metodo !== "pix" && creditCard.length === 0 ? (
                  <div className="mb-5">
                <div>
                  <div className="d-flex align-items-center justify-content-center" onClick={()=> FuncTrocaComp('CartaoCredito')}>
                    <Box >
                    <Image
                        src='https://media.discordapp.net/attachments/894696108926832711/1140737633958498314/creditCardPayment.png?width=364&height=367'
                        alt="image"
                        style={{ width: 160, height: 160 }}
                      />
                    </Box>
                  </div>
                </div>
                <div className="mt-1">
                  <Text> Você não possui cartão registrado </Text>
                  <Button color="#65A059"
                  fullWidth
                  mt="md"
                  radius="md"
                  rightIcon={<FaSave />}


                  onClick={()=> FuncTrocaComp('CartaoCredito')}
                  >
                  <Text> Adicionar um cartão </Text> 
                  </Button>
                  
                </div>
                  </div>
                ) : null}

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
                    metodo !== 'pix' && CreditCardSelected === null ?
                    "Você precisa selecionar um cartão!" :
                    "Você precisa cadastrar um cartão! "}
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
              <Radio.Group
                value={valorPadrao}
                >
                {metodo === 'pix' ? (
                <Group mt="xs">
                  <Radio
                    value="3"
                    size="lg"
                    label="R$ 15,00"
                    onClick={() => {
                      setValor("15.00");
                      setValorPadrao('3');
                    }}
                  />
                </Group>
                ) :                 
                <Group mt="xs">
                <Radio
                  value="4"
                  size="lg"
                  label="R$ 20,00"
                  onClick={() => {
                    setValor("20.00");
                    setValorPadrao('4');
                  }}
                />
                </Group> 
                }
                <Group mt="xs">
                  <Radio
                    value="6"
                    size="lg"
                    label="R$ 30,00"
                    onClick={() => {
                      setValor("30.00");
                      setValorPadrao('6');
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
                      setValorPadrao('7');
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
                      setValorPadrao('9');
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
                      setValorPadrao('8');
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
                loading={buttonDisabled} 
                loaderPosition="right"
                radius="md"
                onClick={() => {
                  validaFormato();
                }}
              >
                Registrar transferência ‎
                {buttonDisabled ? (
                  null
                ) : (
                <IconCheck size="1.125rem" />
                )}
              </Button>
              {divAvancar2 ? (
                <Notification
                  className="mt-3"
                  icon={<IconX size="1.1rem" />}
                  color="red"
                  withBorder={false}
                >
                  {valor !== '' && metodo === 'pix' ? 
                   "Você precisa selecionar um valor acima de R$ 2,00!" :
                    valor !== '' && metodo !== 'pix' ?
                    "Você precisa selecionar um valor acima de R$ 20,00!" :
                    "Você precisa selecionar algum valor!"}
                </Notification>
              ) : null}
            </Card>
          </Tabs.Panel>

          <ModalErroBanco
          onOpen={onOpenError}
          onClose={onCloseError}
        />
          <ModalPix
            qrCode={data.brcode}
            status={notification}
            mensagemPix={pixExpirado}
            onOpen={onOpen}
          />
        </Tabs>
      </Card>
      <VoltarComponente />
    </div>
  );
};

export default InserirCreditos;
