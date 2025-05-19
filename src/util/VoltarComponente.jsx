import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import BotaoPadrao from "./BotaoPadrao"; // ajuste o caminho conforme a estrutura do seu projeto

const VoltarComponente = ({ space, arrow }) => {
  const [componenteAnterior, setComponenteAnterior] = useState("");
  const [componenteProximo, setComponenteProximo] = useState("");

  useEffect(() => {
    const componenteAnterior = localStorage.getItem("componente");
    const componenteProximo = localStorage.getItem("componenteAnterior");
    setComponenteAnterior(componenteAnterior);
    setComponenteProximo(componenteProximo);
  }, []);

  const voltar = () => {
    if (componenteProximo === "EscolherPerfil") {
      return;
    }
    localStorage.setItem("componenteAnterior", componenteAnterior);
    localStorage.setItem("componente", componenteProximo);
  };

  return (
    <>
      {arrow ? (
        <IconArrowLeft
          className="mb-1"
          onClick={() => {
            voltar();
          }}
        />
      ) : (
        <BotaoPadrao space={space} onClick={voltar}>
          Voltar
        </BotaoPadrao>
      )}
    </>
  );
};

export default VoltarComponente;
