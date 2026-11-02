import { Button, Card, Text } from "@mantine/core";
import { IconArrowRight, IconRefresh } from "@tabler/icons-react";
import { formatarDataHora } from "../util/recargaAutomatica";

const TEXTO_PADRAO = "Confira o cartão ou escolha outro abaixo e toque em Tentar novamente.";

const tons = {
  vermelho: { fundo: "#FFF5F5", borda: "#FFC9C9", titulo: "#C92A2A", detalhe: "#E03131", texto: "#5C1D1D" },
  amarelo: { fundo: "#FFF9DB", borda: "#FFE066", titulo: "#8F5A00", detalhe: "#A86B00", texto: "#5F3B00" },
  cinza: { fundo: "#F8F9FA", borda: "#DEE2E6", titulo: "#343A40", detalhe: "#868E96", texto: "#495057" },
  azul: { fundo: "#F1F7FE", borda: "#D0EBFF", titulo: "#1864AB", detalhe: "#1C7ED6", texto: "#1B3A5C" },
};

export const CardAviso = ({ tom = "vermelho", titulo, detalhe, children, rodape, style }) => {
  const cores = tons[tom];
  return (
    <Card
      padding="md"
      radius="md"
      className="text-start"
      style={{
        backgroundColor: cores.fundo,
        border: `1px solid ${cores.borda}`,
        boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
        marginBottom: 16,
        ...style,
      }}
    >
      {titulo ? (
        <Text weight={700} style={{ color: cores.titulo, lineHeight: 1.3, textWrap: "balance" }}>
          {titulo}
        </Text>
      ) : null}
      {detalhe ? (
        <Text size="xs" style={{ color: cores.detalhe, lineHeight: 1.4, fontVariantNumeric: "tabular-nums" }}>
          {detalhe}
        </Text>
      ) : null}
      {children ? (
        <Text size="sm" style={{ marginTop: titulo ? 6 : 0, color: cores.texto, lineHeight: 1.45, textWrap: "pretty" }}>
          {children}
        </Text>
      ) : null}
      {rodape}
    </Card>
  );
};

export const AvisoLimiteDiario = ({ texto, style }) => (
  <CardAviso tom="amarelo" titulo="Limite diário atingido" style={style}>
    {texto}
  </CardAviso>
);

const AvisoFalhaRecarga = ({ onTentar, carregando, desabilitado, dica, data, texto, textoBotao, irParaRecarga, style }) => (
  <CardAviso
    tom="vermelho"
    titulo="Última recarga recusada"
    detalhe={data ? formatarDataHora(data) : null}
    style={style}
    rodape={
      <>
        <Button
          color="red"
          fullWidth
          mt="md"
          radius="md"
          leftIcon={irParaRecarga ? null : <IconRefresh size="1rem" />}
          rightIcon={irParaRecarga ? <IconArrowRight size="1rem" /> : null}
          loading={carregando}
          disabled={desabilitado}
          onClick={onTentar}
        >
          {textoBotao || "Tentar novamente"}
        </Button>
        {dica ? (
          <Text size="xs" className="mt-2" style={{ color: "#7a3b3b" }}>
            {dica}
          </Text>
        ) : null}
      </>
    }
  >
    {texto || TEXTO_PADRAO}
  </CardAviso>
);

export default AvisoFalhaRecarga;
