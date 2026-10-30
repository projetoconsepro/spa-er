import React from "react";
import { Group, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import VoltarComponente from "./VoltarComponente";

const TituloComVoltar = ({ titulo, subtitulo, onVoltar, rotuloVoltar }) => (
  <>
    <Group spacing={8} noWrap className="titulo-com-voltar">
      {onVoltar ? (
        <IconArrowLeft
          role="button"
          tabIndex={0}
          aria-label={rotuloVoltar}
          onClick={onVoltar}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onVoltar();
            }
          }}
        />
      ) : (
        <VoltarComponente arrow={true} />
      )}
      <Text weight={700} size="xl">
        {titulo}
      </Text>
    </Group>
    <Text size="sm" color="dimmed" mb="xl" className="text-start">
      {subtitulo}
    </Text>
  </>
);

export default TituloComVoltar;
