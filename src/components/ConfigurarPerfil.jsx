import sha256 from "crypto-js/sha256";
import { React, useState, useEffect } from "react";
import {
  IconCreditCard,
  IconUser,
  IconLock,
  IconUserCircle,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Input,
  PasswordInput,
  Text,
  rem,
} from "@mantine/core";
import { IconCar } from "@tabler/icons-react";
import { IconAdjustments } from "@tabler/icons-react";
import { IconArrowForwardUpDouble } from "@tabler/icons-react";
import FuncTrocaComp from "../util/FuncTrocaComp";
import { IconLockCheck } from "@tabler/icons-react";
import Swal from "sweetalert2";
import createAPI from "../services/createAPI";
import { FaCreditCard } from "react-icons/fa";

const ConfigurarPerfil = () => {
  const [saldo, setSaldo] = useState([]);
  const [user2, setUser2] = useState("");
  const [user, setUser] = useState("");
  const [perfil, setPerfil] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [isUsernameEnabled, setIsUsernameEnabled] = useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isTelefoneEnabled, setIsTelefoneEnabled] = useState(false);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [cartoesData, setCartoesData] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    setUser2(user2.nome);
    setUser(user2.nome);
    setPerfil(user2.perfil[0]);
    setEmail(user2.email);
    setEmail2(user2.email);
    setTelefone(user2.telefone);
    setTelefone2(user2.telefone);
    const requisicao = createAPI();

    requisicao.get("/usuario/saldo-credito").then((response) => {
      setSaldo(response?.data?.data?.saldo);
    });

    // getCartoes();


  }, []);

  const getCartoes = () => {
    const requisicao = createAPI();
    requisicao
    .get("/cartao/")
    .then((resposta) => {
      if (resposta.data.msg.resultado) {
        const newData = resposta.data.data.map((item) => ({
          cartao: `${item.id_cartao}`,
          bandeira: item.bandeira,
          numero: `#### #### #### ${item.cartao}`,
          background:
            item.bandeira === "visa"
              ? "linear-gradient(to right, #064789, #427AA1)"
              : item.bandeira === "mastercard"
              ? "linear-gradient(to right, #F4796B, #f79e21)"
              : item.bandeira === "elocard"
              ? "linear-gradient(to right, #322214, #2E282A)"
              : "white",
        }));
        setCartoesData(newData);
      } else {
        setCartoesData([]);
      }
    })
    .catch((err) => {
      setCartoesData([]);
    });
  }

  const handleUsernameIconClick = () => {
    setIsUsernameEnabled(!isUsernameEnabled);
  };

  const handleEmailIconClick = () => {
    setIsEmailEnabled(!isEmailEnabled);
  };

  const handleTelefoneIconClick = () => {
    setIsTelefoneEnabled(!isTelefoneEnabled);
  };

  const handleCancelClick = () => {
    setUser(user2);
    setEmail(email2);
    setTelefone(telefone2);
    setIsUsernameEnabled(false);
    setIsEmailEnabled(false);
    setIsTelefoneEnabled(false);
  };

  const handleSaveClick = () => {
    if (user.length < 60 && telefone.length === 11) {
      const requisicao = createAPI();
      requisicao
        .put("/usuario", {
          nome: user,
          telefone: telefone,
        })
        .then((response) => {
          if (response.data.msg.resultado) {
            setIsUsernameEnabled(false);
            setIsTelefoneEnabled(false);
            setUser(response.data.data.nome);
            setUser2(response.data.data.nome);
            setTelefone(response.data.data.telefone);
            setTelefone2(response.data.data.telefone);

            const userJSON = localStorage.getItem("user");
            const user = JSON.parse(userJSON);

            user.nome = response.data.data.nome;
            user.telefone = response.data.data.telefone;

            const updatedUserJSON = JSON.stringify(user);
            localStorage.setItem("user", updatedUserJSON);
          } else {
            setEstado(true);
            setMensagem(response.data.msg.msg);
            setTimeout(() => {
              setEstado(false);
              setMensagem("");
            }, 3000);
          }
        });
    } else {
      setEstado(true);
      setMensagem(
        "O seu nome deve ter no máximo 60 caracteres e o seu telefone deve ter 11 caracteres."
      );
      setTimeout(() => {
        setEstado(false);
        setMensagem("");
      }, 3000);
    }
  };

  const apagarCartao = (cartao) => {
    const finalDoNumero = cartao.numero.slice(-4);
    Swal.fire({
      title: "Tem certeza?",
      text: `Você deseja apagar o cartão de final ${finalDoNumero}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, apagar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const requisicao = createAPI();
        requisicao
          .delete(`/cartao/${parseInt(cartao.cartao)}`)
          .then((response) => {
            if (response.data.msg.resultado) {
              Swal.fire({
                icon: "success",
                title: response.data.msg.msg,
                showConfirmButton: false,
                timer: 1500,
              });
              const newData = cartoesData.filter(
                (item) => item.cartao !== cartao.cartao
              );
              setCartoesData(newData);
            } else {
              Swal.fire({
                icon: "error",
                title: response.data.msg.msg,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const handleCancelClickSenha = () => {
    setSenha("");
    setSenha2("");
  };

  const handleSaveClickSenha = () => {
    const requisicao = createAPI();
    if (senha.length >= 4 && !senha.match(/["']/) && senha === senha2) {
      const password = sha256(senha).toString();
      requisicao
        .put("/usuario", {
          senha: password,
        })
        .then((response) => {
          if (response.data.msg.resultado) {
            Swal.fire({
              icon: "success",
              title: "Senha alterada com sucesso!",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Não foi possível alterar sua senha.",
              footer: "Tente novamente!",
            });
          }
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Não foi possível alterar sua senha.",
        footer: "Tente novamente!",
      });
    }
  };

  const goDebito = () => {
    FuncTrocaComp("Configuracoes");
  };

  return (
    <div>
      <Card padding="lg" radius="md" withBorder>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>
            Olá,
            {window.innerWidth > 990
              ? `${user2}!`
              : window.innerWidth < 290
              ? user2.length > 15
                ? `${user2.substring(0, 15)}...`
                : `${user2}!`
              : user2.length > 25
              ? `${user2.substring(0, 25)}...`
              : `${user2}!`}
          </Text>
          <Badge
            color={
              perfil === "parceiro"
                ? "teal.8"
                : perfil === "cliente"
                ? "blue.8"
                : perfil === "admin"
                ? "red.8"
                : perfil === "agente"
                ? "yellow.8"
                : "gray"
            }
            variant="light"
          >
            {perfil}
          </Badge>
        </Group>
        {perfil === "cliente" ? (
          <Group position="apart" mt="md" mb="xs">
            <Text size="lg" weight={500}>
              <IconCreditCard color="indigo" /> R$ {saldo}
            </Text>
          </Group>
        ) : null}
        <Text size="sm" color="dimmed">
          Você está no menu de configurações do seu perfil. Aqui você pode
          alterar suas informações pessoais.
        </Text>
        {perfil === "cliente" ? (
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => {
              FuncTrocaComp("MeusVeiculos");
            }}
          >
            Voltar aos meus veículos
          </Button>
        ) : perfil === "monitor" ? (
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => {
              FuncTrocaComp("ListarVagasMonitor");
            }}
          >
            Voltar às vagas
          </Button>
        ) : perfil === "parceiro" ? (
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => {
              FuncTrocaComp("RegistrarEstacionamentoParceiro");
            }}
          >
            Voltar ao registro de estacionamento
          </Button>
        ) : perfil === "admin" ? (
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => {
              FuncTrocaComp("Dashboard");
            }}
          >
            Voltar ao dashboard
          </Button>
        ) : perfil === "agente" ? (
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => {
              FuncTrocaComp("VeiculosAgente");
            }}
          >
            Voltar aos veículos
          </Button>
        ) : null}
      </Card>
      <Accordion
        variant="contained"
        styles={{ item: { backgroundColor: "white" } }}
      >
        <Accordion.Item value="photos">
          <Accordion.Control icon={<IconUser size={rem(20)} color="teal" />}>
            Informações pessoais
          </Accordion.Control>
          <Accordion.Panel>
            <div className="text-start">
              <Input.Wrapper label="Nome de usuário:" className="mb-2">
                <Grid>
                  <Grid.Col span={10}>
                    <Input
                      icon={<IconUserCircle size="1rem" />}
                      placeholder={user2}
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      disabled={!isUsernameEnabled}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <ActionIcon onClick={handleUsernameIconClick}>
                      <IconAdjustments size="1.125rem" />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>
              <Input.Wrapper label="Email:" className="mb-2">
                <Grid>
                  <Grid.Col span={10}>
                    <Input
                      icon={<IconMail size="1rem" />}
                      placeholder={email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEmailEnabled}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <ActionIcon onClick={handleEmailIconClick}>
                      <IconAdjustments size="1.125rem" />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>
              <Input.Wrapper label="Número de celular:">
                <Grid>
                  <Grid.Col span={10}>
                    <Input
                      icon={<IconPhone size="1rem" />}
                      placeholder={telefone}
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      disabled={!isTelefoneEnabled}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <ActionIcon onClick={handleTelefoneIconClick}>
                      <IconAdjustments size="1.125rem" />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>
            </div>

            <div className="mt-4">
              {(isUsernameEnabled || isEmailEnabled || isTelefoneEnabled) &&
                (user !== user2 ||
                  email !== email2 ||
                  telefone !== telefone2) && (
                  <Group position="center" spacing="sm" grow>
                    <Button color="gray" onClick={handleCancelClick}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveClick} loaderPosition="right">
                      Salvar
                    </Button>
                  </Group>
                )}
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="print">
          <Accordion.Control icon={<IconLock size={rem(20)} color="red" />}>
            Alterar senha
          </Accordion.Control>
          <Accordion.Panel>
            <div className="text-start">
              <Input.Wrapper label="Nova senha:" className="mb-2">
                <Grid>
                  <Grid.Col span={12}>
                    <PasswordInput
                      icon={<IconLock size="1rem" />}
                      placeholder="Digite sua nova senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>
              <Input.Wrapper label="Confirmar nova senha:" className="mb-2">
                <Grid>
                  <Grid.Col span={12}>
                    <PasswordInput
                      icon={<IconLockCheck size="1rem" />}
                      placeholder="Confirme sua nova senha"
                      value={senha2}
                      onChange={(e) => setSenha2(e.target.value)}
                    />
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>
            </div>
            <div className="mt-4">
              {senha.length >= 4 && senha2.length >= 4 ? (
                <Group position="center" spacing="sm" grow>
                  <Button color="gray" onClick={handleCancelClickSenha}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveClickSenha} loaderPosition="right">
                    Salvar
                  </Button>
                </Group>
              ) : null}
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        {perfil === "cliente" && 1 === 2 ? (
          <Accordion.Item value="cartao">
            <Accordion.Control icon={<IconCreditCard size={rem(20)} />}>
              Meus cartões
            </Accordion.Control>
            <Accordion.Panel>
              <Accordion
                variant="contained"
                styles={{ item: { backgroundColor: "white" } }}
                className="text-start"
              >
                {cartoesData.length !== 0 ? (
                  cartoesData.map((cartao) => (
                    <Accordion.Item
                      style={{ background: cartao.background }}
                      className="text-white"
                      key={cartao.cartao}
                      value={cartao.cartao}
                    >
                      <Accordion.Control
                        style={{ background: cartao.background }}
                        className={
                          cartao.background === "white"
                            ? "text-black"
                            : "text-white"
                        }
                      >
                        <div className="row">
                          <div className="">
                            {cartao.bandeira === "mastercard" ||
                            cartao.bandeira === "visa" ||
                            cartao.bandeira === "elocard" ? (
                              <img
                                src={`../../assets/img/cartaoCredito/${cartao.bandeira}.png`}
                                alt="logo"
                                className="bandeira"
                              />
                            ) : (
                              <FaCreditCard size={rem(20)} />
                            )}
                            <span className="mx-2">{cartao.numero}</span>
                          </div>
                        </div>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <div className="row align-items-center justify-content-center">
                          <Button
                            variant="gradient"
                            gradient={{ from: "red", to: "red", deg: 90 }}
                            className="w-50"
                            onClick={() => apagarCartao(cartao)}
                          >
                            Apagar cartão
                          </Button>
                        </div>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))
                ) : (
                  <div>
                    <div
                      className="d-flex align-items-center justify-content-center"
                      onClick={() => FuncTrocaComp("CartaoCredito")}
                    >
                      <Box>
                        <Image
                          src="../../assets/img/cartaoCredito/creditCardPayment.png"
                          alt="image"
                          style={{ width: 160, height: 160 }}
                        />
                      </Box>
                    </div>
                    <div className="mt-3">
                      <Text className="text-center">
                        {" "}
                        Você não possui cartão registrado{" "}
                      </Text>
                    </div>
                  </div>
                )}
              </Accordion>
              <Button
                className="mt-3"
                leftIcon={<IconArrowForwardUpDouble size="1rem" />}
                onClick={() => {
                  FuncTrocaComp("CartaoCredito");
                }}
              >
                Adicionar cartão
              </Button>
            </Accordion.Panel>
          </Accordion.Item>
        ) : null}

        {perfil === "cliente" ? (
          <Accordion.Item value="camera">
            <Accordion.Control icon={<IconCar size={rem(20)} color="blue" />}>
              Alterar débito automático
            </Accordion.Control>
            <Accordion.Panel>
              <Button
                leftIcon={<IconArrowForwardUpDouble size="1rem" />}
                onClick={() => {
                  goDebito();
                }}
              >
                Ir para o débito automático
              </Button>
            </Accordion.Panel>
          </Accordion.Item>
        ) : null}
      </Accordion>
      <div
        className="alert alert-danger mt-4 mx-3"
        role="alert"
        style={{ display: estado ? "block" : "none" }}
      >
        {mensagem}
      </div>
    </div>
  );
};

export default ConfigurarPerfil;
