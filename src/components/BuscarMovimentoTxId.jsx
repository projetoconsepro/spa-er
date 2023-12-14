import axios from "axios";
import { React, useState, useEffect } from "react";
import { ActionIcon, Badge, Button, Card, Divider, Grid, Group, Image, Input, Select, Text, Modal } from "@mantine/core";
import { IconAdjustments, IconArrowAutofitRight, IconArrowForward, IconArrowRight, IconCash, IconCheck, IconKeyboard, IconMail, IconMoneybag, IconSearch, IconUserCircle } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { useDisclosure } from "@mantine/hooks";
import ModalPix from "./ModalPix";
import createAPI from "../services/createAPI";
import ModalErroBanco from "./ModalErroBanco";

const BuscarMovimentoTxId = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState(false);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [data, setData] = useState([]);
  const [txId, setTxId] = useState("");
  const [placa, setPlaca] = useState("");
  const [tempo, setTempo] = useState("");
  const [vaga, setVaga] = useState("");
  const [status, setStatus] = useState("");
  const [valor, setValor] = useState("");
  const [dataMovimento, setDataMovimento] = useState("");
  const [onOpen, setOnOpen] = useState(false);
  const [notification, setNotification] = useState(true);
  const [pixExpirado, setPixExpirado] = useState("");
  const [onOpenError, setOnOpenError] = useState(false);
  const [onCloseError, setOnCloseError] = useState(false);

  const handleSearchMovimento = async () => {
    const requisicao = createAPI();
  
    requisicao.get(`/financeiro/verificar/pix/${txId}`).then((response) => {
      const { data } = response;
  
      let dadosMovimento;
      try {
        dadosMovimento = JSON.parse(data.data.dados_movimento);
      } catch (error) {
        dadosMovimento = data.data.dados_movimento;
      }
  
      setPlaca(dadosMovimento.placa || '');
      setTempo(dadosMovimento.tempo || '');
      setVaga(dadosMovimento.numero_vaga || '');
      setStatus(data.data.status || '');
      setDataMovimento(new Date(data.data.data).toLocaleString() || '');
  
      if (typeof dadosMovimento === 'number') {
        setValor(dadosMovimento);
      } else {
        setValor('');
      }
  
      setInfo(true);
    });
  };
  
  

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div>
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Buscar movimento PIX:</Text>
          </Group>

          <div className="text-start">
            <Input.Wrapper label="Informe o txId do movimento:" className="mb-2">
              <Grid>
                <Grid.Col span={12}>
                  <Input
                    icon={<IconKeyboard size="1rem" />}
                    placeholder={"Digite aqui"}
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                  />
                </Grid.Col>
              </Grid>
            </Input.Wrapper>
          </div>
          <Button variant="gradient" gradient={{ from: "teal", to: "blue", deg: 60 }} fullWidth mt="md" radius="md"
          onClick={() => handleSearchMovimento()}
          >
            Buscar ‎
            <IconSearch size="1.125rem" />
          </Button>
          <div className="alert alert-danger mt-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
              {mensagem}
          </div>
        </div>
        {info ? (
        <Card shadow="sm" padding="lg" radius="xs" className="bg-admin-parceiro mt-4" withBorder={false}>
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Informações do movimento:</Text>
          </Group>
          <Divider my="sm" size="sm" variant="dashed" />
          <div className="text-start">
          {placa && (
            <Grid>
              <Grid.Col span={12}>
                <Text fz="md">Placa: {placa}</Text>
              </Grid.Col>
            </Grid>
          )}
          {tempo && (
            <Grid>
              <Grid.Col span={12}>
                <Text fz="md">Tempo debitado: {tempo}</Text>
              </Grid.Col>
            </Grid>
          )}
          {vaga && (
            <Grid>
              <Grid.Col span={12}>
                <Text fz="md">Número da vaga: {vaga}</Text>
              </Grid.Col>
            </Grid>
          )}
          {dataMovimento && (
            <Grid>
              <Grid.Col span={12}>
                <Text fz="md">Data: {dataMovimento}</Text>
              </Grid.Col>
            </Grid>
          )}
          {status && (
            <Grid>
              <Grid.Col span={12}>
                <Text fz="md">Status: {status}</Text>
              </Grid.Col>
            </Grid>
          )}
          {valor !== '' && (
            <Grid>
              <Grid.Col span={12}>
                <Text fz="md">Valor: {valor}</Text>
              </Grid.Col>
            </Grid>
          )}
              <Divider my="sm" size="sm" variant="dashed" />
          </div>
          <div className="alert alert-danger mt-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
              {mensagem}
          </div>
        </Card>
      ) : null }
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
    </Card>
  );
};

export default BuscarMovimentoTxId;
