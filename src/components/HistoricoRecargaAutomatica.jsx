import { useEffect, useState } from "react";
import { Button, Card, createStyles, Group, Loader, Pagination, Text, ThemeIcon } from "@mantine/core";
import { IconCheck, IconClock, IconX } from "@tabler/icons-react";
import createAPI from "../services/createAPI";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import AvisoFalhaRecarga, { CardAviso } from "./AvisoFalhaRecarga";
import FuncTrocaComp from "../util/FuncTrocaComp";
import {
  codificarFiltro,
  descreverCartao,
  formatarDataHora,
  formatarValor,
  tratarErroRequisicao,
} from "../util/recargaAutomatica";

const aparencia = {
  APROVADO: { cor: "#0CA678", fundo: "#E6FCF5", texto: "#087F5B", valor: "#212529", rotulo: "Sucesso", Icone: IconCheck },
  RECUSADO: { cor: "#E03131", fundo: "#FFF5F5", texto: "#C92A2A", valor: "#ADB5BD", rotulo: "Recusado", Icone: IconX },
  PROCESSANDO: { cor: "#F08C00", fundo: "#FFF4E6", texto: "#B35C00", valor: "#212529", rotulo: "Em processamento", Icone: IconClock },
};

const useStyles = createStyles((theme) => ({
  pagina: {
    [theme.fn.largerThan("sm")]: {
      maxWidth: 720,
    },
    [theme.fn.largerThan("lg")]: {
      maxWidth: 960,
    },
  },
}));

const ItemHistorico = ({ item, separado }) => {
  const { cor, fundo, texto, valor, rotulo, Icone } = aparencia[item.status] || aparencia.PROCESSANDO;
  const recusado = item.status === "RECUSADO";
  return (
    <div
      className="d-flex align-items-start text-start"
      style={{ padding: "14px 16px", borderTop: separado ? "1px solid #E9ECEF" : "none", gap: 12 }}
    >
      <ThemeIcon size={32} radius="xl" className="flex-shrink-0" style={{ backgroundColor: fundo, color: cor, marginTop: 2 }}>
        <Icone size={18} stroke={2.5} />
      </ThemeIcon>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="d-flex align-items-baseline justify-content-between" style={{ gap: 8 }}>
          <Text weight={600} size="sm" style={{ color: "#212529", lineHeight: 1.35 }}>
            Recarga automática
          </Text>
          <Text
            weight={700}
            className="flex-shrink-0"
            style={{
              color: valor,
              fontVariantNumeric: "tabular-nums",
              textDecoration: recusado ? "line-through" : "none",
            }}
          >
            {formatarValor(item.valor)}
          </Text>
        </div>
        {item.cartao ? (
          <Text size="sm" style={{ color: "#495057", lineHeight: 1.4 }}>
            {descreverCartao(item)}
          </Text>
        ) : null}
        <div className="d-flex align-items-center justify-content-between" style={{ gap: 8, marginTop: 6 }}>
          <Text size="xs" color="dimmed" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatarDataHora(item.data)}
          </Text>
          <span
            className="flex-shrink-0"
            style={{
              backgroundColor: fundo,
              color: texto,
              borderRadius: 999,
              padding: "2px 10px",
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
            }}
          >
            {rotulo}
          </span>
        </div>
      </div>
    </div>
  );
};

const HistoricoRecargaAutomatica = () => {
  const { classes } = useStyles();
  const [carregando, setCarregando] = useState(true);
  const [filtrando, setFiltrando] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [config, setConfig] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtroAtual, setFiltroAtual] = useState("");
  const [recarregar, setRecarregar] = useState(0);

  const carregarConfig = async () => {
    const requisicao = createAPI();
    try {
      const resposta = await requisicao.get("/cartao/recarga-automatica");
      if (resposta.data.msg.resultado) {
        setConfig(resposta.data.data);
      }
    } catch (error) {
      tratarErroRequisicao(error);
    }
  };

  const carregarHistorico = async (pagina, filtro) => {
    setCarregando(true);
    setMensagem("");
    const requisicao = createAPI();
    try {
      const params = { page: pagina };
      if (filtro) {
        params.query = codificarFiltro(filtro);
      }
      const resposta = await requisicao.get("/cartao/recarga-automatica/historico", { params });
      if (resposta.data.msg.resultado) {
        setRegistros(resposta.data.data);
        setTotalPages(resposta.data.totalPages || 1);
      } else {
        setRegistros([]);
        setTotalPages(1);
        setMensagem(resposta.data.msg.msg);
      }
    } catch (error) {
      tratarErroRequisicao(error);
    } finally {
      setCarregando(false);
      setFiltrando(false);
    }
  };

  useEffect(() => {
    carregarConfig();
  }, []);

  useEffect(() => {
    carregarHistorico(page, filtroAtual);
  }, [page, filtroAtual, recarregar]);

  const aoFiltrar = (consulta) => {
    setFiltrando(true);
    setPage(1);
    setFiltroAtual(consulta);
    setRecarregar((valor) => valor + 1);
  };

  const semElegibilidade = config !== null && config.elegivel !== true;
  const suspensa = config !== null && config.elegivel === true && config.ativo === "S" && config.suspensa;

  const filtrado = Boolean(filtroAtual);

  const limparFiltro = () => {
    setPage(1);
    setFiltroAtual("");
  };

  return (
    <div className={`col-12 px-3 mb-3 ${classes.pagina}`}>
      <p className="text-start fs-4 fw-bold mb-3">
        <VoltarComponente arrow={true} /> Histórico de recargas:
      </p>
      <div className="d-flex align-items-center mb-3" style={{ gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Filtro nome={"HistoricoRecargaAutomatica"} onConsultaSelected={aoFiltrar} onLoading={filtrando} />
        </div>
        {filtrado ? (
          <Button
            variant="default"
            className="flex-shrink-0"
            leftIcon={<IconX size="1rem" />}
            onClick={limparFiltro}
          >
            Limpar filtro
          </Button>
        ) : null}
      </div>

      {semElegibilidade ? (
        <CardAviso tom="cinza">
          Para ativar a recarga automática de novo, é preciso ter o débito automático ativo em pelo menos um veículo.
        </CardAviso>
      ) : null}

      {suspensa ? (
        <AvisoFalhaRecarga
          onTentar={() => FuncTrocaComp("RecargaAutomatica")}
          data={config.ultimaFalha?.data}
          texto="Confira o cartão na tela da recarga automática e toque em Tentar novamente."
          textoBotao="Ir para recarga automática"
          irParaRecarga
        />
      ) : null}

      {carregando ? (
        <div className="text-center mt-4 mb-4">
          <Loader />
        </div>
      ) : registros.length === 0 ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder className="text-center">
          <Text size="sm" color="dimmed">
            {mensagem || "Não há registros para exibir"}
          </Text>
        </Card>
      ) : (
        <Card shadow="sm" padding={0} radius="md" withBorder>
          {registros.map((item, posicao) => (
            <ItemHistorico key={item.id_log} item={item} separado={posicao > 0} />
          ))}
        </Card>
      )}

      {totalPages > 1 ? (
        <Group position="center" mt="md">
          <Pagination value={page} total={totalPages} onChange={setPage} radius="md" />
        </Group>
      ) : null}

      <Group position="center" mt="lg">
        <VoltarComponente />
      </Group>
    </div>
  );
};

export default HistoricoRecargaAutomatica;
