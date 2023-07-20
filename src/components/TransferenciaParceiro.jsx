import axios from "axios";
import { React, useState, useEffect } from "react";
import { ActionIcon, Badge, Button, Card, Divider, Grid, Group, Image, Input, Select, Text, Modal } from "@mantine/core";
import { IconAdjustments, IconArrowAutofitRight, IconArrowForward, IconArrowRight, IconCash, IconCheck, IconMail, IconUserCircle } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { useDisclosure } from "@mantine/hooks";
import ModalPix from "./ModalPix";
import createAPI from "../services/createAPI";

const TransferenciaParceiro = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [cnpj, setCnpj] = useState("");
  const [valor, setValor] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [saldo, setSaldo] = useState("");
  const [idParceiro, setIdParceiro] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [info, setInfo] = useState(false);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [data, setData] = useState([]);
  const [txId, setTxId] = useState("");
  const [onOpen, setOnOpen] = useState(false);
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const options = [{ value: "pix", label: "Pix" }, { value: "dinheiro", label: "Dinheiro" }];

  const FuncArrumaInput = (e) => {
    let valor = e.target.value;

    if (valor.length === 1 && valor !== "0") {
      valor = `0,0${valor}`;
    } else if (valor.length > 1) {
      valor = valor.replace(/\D/g, "");
      valor = valor.replace(/^0+/, "");

      if (valor.length < 3) {
        valor = `0,${valor}`;
      } else {
        valor = valor.replace(/(\d{2})$/, ",$1");
      }

      valor = valor.replace(/(?=(\d{3})+(\D))\B/g, ".");
    }

    setValor(valor);
  };

  const getInfoDestinatario = () => {
    const requisicao = createAPI();

    const cnpjFormatado = cnpj.replace(/[.-/]/g, '');

    requisicao.get(`/verificar?cnpj=${cnpjFormatado}`).then((response) => {
      console.log(response)
      if (response.data.msg.resultado) {
        requisicao.get(`/financeiro/saldo/parceiro/${response.data.usuario[0].id_usuario}`).then((res) => {
          console.log(res)
          if (res.data.msg.resultado) {
            setSaldo(res.data.msg.saldo);
            setNome(response.data.usuario[0].nome);
            setEmail(response.data.usuario[0].email);
            setSaldo(res.data.data.saldo);
            setIdParceiro(response.data.usuario[0].id_usuario);
            setInfo(true);
          } else {
            setEstado(true)
            setMensagem(res.data.msg.msg)
            setTimeout(() => {
              setEstado(false)
              setMensagem("")
            }, 3000)
          }
        });
          } else {
            setEstado(true)
            setMensagem(response.data.msg.msg)
            setTimeout(() => {
              setEstado(false)
              setMensagem("")
            }, 3000)
          }
    });
  };

  const validarTransferencia = () => {
    if (valor === "") {
      setEstado(true)
      setMensagem("Preencha o campo valor")
      setTimeout(() => {
        setEstado(false)
        setMensagem("")
      }, 3000)
      return false;
    } else if (valor === "0,00") {
      setEstado(true)
      setMensagem("Valor inválido")
      setTimeout(() => {
        setEstado(false)
        setMensagem("")
      }, 3000)
      return false;
    } else if (parseFloat(valor) > parseFloat(saldo)) {
      setEstado(true)
      setMensagem("Saldo insuficiente")
      setTimeout(() => {
        setEstado(false)
        setMensagem("")
      }, 3000)
      return false;
    }

    if(metodoPagamento === "pix"){
      fazerPix();
    }
    else {
      realizarTransferencia();
    }
  }

  const fazerPix = () => {
    const requisicao = createAPI();

    const valor2 = parseFloat(valor.replace(",", ".")).toFixed(2);
    const campo = {
      id_usuario: idParceiro,
      valor: valor2,
      pagamento: metodoPagamento,
    };
    console.log(JSON.stringify(campo))
    requisicao.post("/gerarcobranca", { valor: valor2, campo: JSON.stringify(campo) }).then((resposta) => {
        if (resposta.data.msg.resultado) {
          console.log(resposta);
          setData(resposta.data.data);
          setTxId(resposta.data.data.txid);
          transferencia(resposta.data.data.txid);
          setOnOpen(true);
          open();
        } else {
          console.log("n abriu nkk");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const transferencia = (campo) => {
    const requisicao = createAPI();
    requisicao.post(`/financeiro/debito/transferir/pix`, {
      txid: campo,
    }).then((response) => {
      if (response.data.msg.resultado) {
        setNotification(false);
        setOnOpen(false)
        close();
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          timer: 2000,
          text: "Transferência realizada com sucesso!",
        });
        getInfoDestinatario();
      } else {
        setNotification(false);
        setPixExpirado("Pix expirado");
      }
    });
  }

  const realizarTransferencia = () => {
    const requisicao = createAPI();
    let valor2;
    if (valor.includes(",")) {
      valor2 = valor.replace(",", ".")
    }
    requisicao.post(`/financeiro/debito/transferir`, {
      id_usuario: idParceiro,
      valor: valor2,
      pagamento: metodoPagamento,
    }).then((response) => {
      if (response.data.msg.resultado) {
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Transferência realizada com sucesso!",
        });
        getInfoDestinatario();
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: response.data.msg.msg,
        });
      }
    });
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {window.innerWidth < 768 ? (
        <Card>
          <Card.Section style={{
              display: "flex",
              justifyContent: "flex-start",
              position: "relative",
            }}
          >
            <div style={{ height: "50vw", width: "100%" }}>
              <Image
                src="https://blog.jeton.com/wp-content/uploads/2020/11/remittence-2048x1293.png"
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                alt="Transfer"
              />
            </div>
          </Card.Section>
        </Card>
      ) : (
        <Card>
          <Card.Section style={{ display: "flex" }}>
            <div style={{ position: "relative", top: "-250px" }}>
              <Image
                src="https://blog.jeton.com/wp-content/uploads/2020/11/remittence-2048x1293.png"
                style={{ height: "20vw", objectFit: "cover" }}
                alt="Transfer"
              />
            </div>
          </Card.Section>
        </Card>
      )}
      {info ? (
        <Card shadow="sm" padding="lg" radius="xs" className="bg-admin-parceiro" withBorder={false}>
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Informações do destinatário:</Text>
          </Group>
          <div className="text-start">
              <Grid>
                <Grid.Col span={12}>
                  <Text fz="md">Nome do destinatário: {nome}</Text>
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={12}>
                  <Text fz="md">Email do destinatário: {email}</Text>
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={12}>
                <Text fz="md">Saldo disponível do parceiro: <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>R${saldo}</span></Text>

                </Grid.Col>
              </Grid>
              <Divider my="sm" size="sm" variant="dashed" />
            <Input.Wrapper label="Digite o valor da transferência:" size={18} weight={600} mt="md">
            <Input
              icon={<IconCash />}
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => FuncArrumaInput(e)}
            />
            </Input.Wrapper>

            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>Selecione o método de pagamento:</Text>
              <Select value={metodoPagamento} data={options} onChange={(e) => setMetodoPagamento(e)} />
            </Group>

            <Button variant="gradient" gradient={{ from: "teal", to: "blue", deg: 60 }} fullWidth mt="md" radius="md"
            onClick={() => validarTransferencia()}>
              Realizar transferência ‎ <IconCash color="white" size={15} />
            </Button>
          </div>
          <div className="alert alert-danger mt-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
              {mensagem}
          </div>
        </Card>
      ) : (
        <div>
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Registrar transferência de parceiros:</Text>
          </Group>

          <div className="text-start">
            <Input.Wrapper label="Informe o CNPJ do parceiro:" className="mb-2">
              <Grid>
                <Grid.Col span={12}>
                  <Input
                    icon={<IconUserCircle size="1rem" />}
                    placeholder={"Digite aqui"}
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                  />
                </Grid.Col>
              </Grid>
            </Input.Wrapper>
          </div>
          <Button variant="gradient" gradient={{ from: "teal", to: "blue", deg: 60 }} fullWidth mt="md" radius="md"
            onClick={() => getInfoDestinatario()}>
            Avançar ‎
            <IconArrowRight size="1.125rem" />
          </Button>
          <div className="alert alert-danger mt-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
              {mensagem}
          </div>
        </div>
      )}
       <ModalPix
        qrCode={data.brcode}
        status={notification}
        mensagemPix={pixExpirado}
        onOpen={onOpen}
      />
    </Card>
  );
};

export default TransferenciaParceiro;
