import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

const VoltarComponente = ({ space, arrow, fallback }) => {
  const [componenteAnterior, setComponenteAnterior] = useState("");
  const [componenteProximo, setComponenteProximo] = useState("");

  useEffect(() => {
    const compAnterior = localStorage.getItem("componente");
    const compProximo = localStorage.getItem("componenteAnterior");
    setComponenteAnterior(compAnterior);
    setComponenteProximo(compProximo);
  }, []);

  const voltar = () => {
    if (componenteProximo && componenteProximo !== "EscolherPerfil") {
      localStorage.setItem("componenteAnterior", componenteAnterior);
      localStorage.setItem("componente", componenteProximo);
      window.location.reload();
    } else if (fallback) {
      localStorage.setItem("componenteAnterior", componenteAnterior);
      localStorage.setItem("componente", fallback);
      window.location.reload();
    } else {
      console.warn("Nenhum componente válido para voltar.");
    }
  };

  return arrow ? (
    <IconArrowLeft className="mb-1" onClick={voltar} />
  ) : (
    <Button
      className={space ? "bg-gray-500 mx-2" : "bg-gray-500"}
      size="md"
      radius="md"
      onClick={voltar}
    >
      Voltar
    </Button>
  );
};

export default VoltarComponente;
