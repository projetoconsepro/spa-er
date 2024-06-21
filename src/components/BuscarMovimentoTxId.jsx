import { React, useState } from "react";
import { Button, Card, Divider, Grid, Group, Input, Text } from "@mantine/core";
import { IconKeyboard, IconSearch } from "@tabler/icons-react";
import createAPI from "../services/createAPI";

const BuscarMovimentoTxId = () => {
  const [info, setInfo] = useState(false);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [txId, setTxId] = useState("");
  const [placa, setPlaca] = useState("");
  const [tempo, setTempo] = useState("");
  const [vaga, setVaga] = useState("");
  const [status, setStatus] = useState("");
  const [valor, setValor] = useState("");
  const [dataMovimento, setDataMovimento] = useState("");
  const [tipoMovimento, setTipoMovimento] = useState("");

  const handleSearchMovimento = async () => {
    if (txId === "") {
      setEstado(true);
      setMensagem("Preencha o campo");
      return;
    }
    setEstado(false);
    setInfo(false);
    const requisicao = createAPI();

    requisicao
      .get(`/financeiro/verificar/pix/${txId}`)
      .then((response) => {
        if (response.data.msg.resultado === false) {
          setEstado(true);
          setMensagem(response.data.msg.msg);
          return;
        }

        const { data } = response;

        let dadosMovimento;
        try {
          dadosMovimento = JSON.parse(data.data.dados_movimento);
        } catch (error) {
          dadosMovimento = data.data.dados_movimento;
        }

        setInfo(true);
        setPlaca(dadosMovimento.placa || "");
        setTempo(dadosMovimento.tempo || "");
        setVaga(dadosMovimento.numero_vaga || "");
        setStatus(data.data.status || "");
        setDataMovimento(new Date(data.data.data).toLocaleString() || "");

        if (typeof dadosMovimento === "number") {
          setValor(dadosMovimento);
          setTipoMovimento("Recarga");
        } else if (typeof dadosMovimento[0] === "number") {
          setTipoMovimento("Regularização");
        } else {
          setTipoMovimento("Estacionamento");
          setValor("");
        }
      })
      .catch((error) => {
        setEstado(true);
        setMensagem(error.response.data.message);
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
        <Button
          variant="gradient"
          gradient={{ from: "teal", to: "blue", deg: 60 }}
          fullWidth
          mt="md"
          radius="md"
          onClick={() => handleSearchMovimento()}
        >
          Buscar ‎
          <IconSearch size="1.125rem" />
        </Button>
        <div
          className="alert alert-danger mt-3"
          role="alert"
          style={{ display: estado ? "block" : "none" }}
        >
          {mensagem}
        </div>
      </div>
      {info ? (
        <Card
          shadow="sm"
          padding="lg"
          radius="xs"
          className="bg-admin-parceiro mt-4"
          withBorder={false}
        >
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Informações do movimento: {tipoMovimento}</Text>
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
            {valor !== "" && (
              <Grid>
                <Grid.Col span={12}>
                  <Text fz="md">Valor: {valor}</Text>
                </Grid.Col>
              </Grid>
            )}
            <Divider my="sm" size="sm" variant="dashed" />
          </div>
        </Card>
      ) : null}
    </Card>
  );
};

export default BuscarMovimentoTxId;
