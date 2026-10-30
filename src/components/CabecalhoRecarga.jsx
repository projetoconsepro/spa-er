import { useLayoutEffect, useRef, useState } from "react";
import { Text } from "@mantine/core";
import { IconAlertTriangle, IconArrowLeft } from "@tabler/icons-react";
import FuncTrocaComp from "../util/FuncTrocaComp";

export const aparenciaChave = {
  ativa: { cor: "#1C7ED6", trilho: "#228BE6", fundo: "#F1F7FE", borda: "#D0EBFF" },
  suspensa: { cor: "#E03131", trilho: "#FA5252", fundo: "#FFF5F5", borda: "#FFE3E3" },
  desativada: { cor: "#868E96", trilho: "#CED4DA", fundo: "#FFFFFF", borda: "#DEE2E6" },
};

export const estadoRecarga = (config) => {
  const ativa = config?.ativo === "S" && config?.elegivel !== false;
  const foraDoAr = config ? !config.disponivel : false;
  const suspensa = ativa && Boolean(config.suspensa);
  if (foraDoAr) return { aparencia: aparenciaChave.desativada, subtitulo: "Indisponível no momento", alerta: false };
  if (suspensa) return { aparencia: aparenciaChave.suspensa, subtitulo: "Suspensa", alerta: true };
  if (ativa) return { aparencia: aparenciaChave.ativa, subtitulo: "Ligada", alerta: false };
  return { aparencia: aparenciaChave.desativada, subtitulo: "Desligada", alerta: false };
};

export const StatusRecarga = ({ cor, texto, alerta }) => (
  <div className="d-flex align-items-center" style={{ marginTop: 3 }}>
    {alerta ? (
      <IconAlertTriangle size={14} color={cor} style={{ marginRight: 4 }} />
    ) : (
      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: cor, marginRight: 6 }} />
    )}
    <Text size="sm" weight={600} style={{ color: cor, lineHeight: 1.2 }}>
      {texto}
    </Text>
  </div>
);

const CabecalhoRecarga = ({ aparencia, titulo, subtitulo, acao }) => {
  const espacoRef = useRef(null);
  const cabecalhoRef = useRef(null);
  const [fixo, setFixo] = useState({ ativo: false, topo: 0, espaco: 0 });

  useLayoutEffect(() => {
    const nav = document.getElementById("nav");
    const medir = () => {
      const espaco = espacoRef.current;
      const cabecalho = cabecalhoRef.current;
      if (!espaco || !cabecalho) return;
      const estiloNav = nav ? window.getComputedStyle(nav) : null;
      const navFixa = Boolean(estiloNav) && estiloNav.display !== "none" && estiloNav.position === "fixed";
      if (!navFixa) {
        setFixo({ ativo: false, topo: 0, espaco: 0 });
        return;
      }
      const fundoNav = nav.getBoundingClientRect().bottom;
      const topoEspaco = espaco.getBoundingClientRect().top + window.scrollY;
      setFixo({
        ativo: true,
        topo: fundoNav,
        espaco: Math.max(0, fundoNav + cabecalho.offsetHeight - topoEspaco),
      });
    };
    medir();
    const redimensionamento = typeof ResizeObserver !== "undefined" ? new ResizeObserver(medir) : null;
    if (redimensionamento) {
      if (nav) redimensionamento.observe(nav);
      if (cabecalhoRef.current) redimensionamento.observe(cabecalhoRef.current);
    }
    const mudancaNav = nav && typeof MutationObserver !== "undefined" ? new MutationObserver(medir) : null;
    if (mudancaNav) mudancaNav.observe(nav, { attributes: true, attributeFilter: ["class", "style"] });
    window.addEventListener("resize", medir);
    return () => {
      if (redimensionamento) redimensionamento.disconnect();
      if (mudancaNav) mudancaNav.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);

  return (
    <div ref={espacoRef} style={fixo.ativo ? { height: fixo.espaco } : undefined}>
      <div
        ref={cabecalhoRef}
        className="text-start"
        style={{
          backgroundColor: aparencia.fundo,
          transition: "background-color 300ms ease-out, border-color 300ms ease-out",
          ...(fixo.ativo
            ? {
                position: "fixed",
                top: fixo.topo,
                left: 0,
                right: 0,
                zIndex: 100,
                borderBottom: `1px solid ${aparencia.borda}`,
                boxShadow: "0 4px 12px rgba(16, 24, 40, 0.06)",
              }
            : {
                margin: "0 16px",
                border: `1px solid ${aparencia.borda}`,
                borderRadius: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }),
        }}
      >
        <div className="d-flex align-items-center" style={{ padding: "10px 16px 10px 6px" }}>
          <span className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40 }}>
            <IconArrowLeft style={{ cursor: "pointer" }} onClick={() => FuncTrocaComp("MeusVeiculos")} />
          </span>
          <div className="flex-grow-1 ms-1 text-start" style={{ minWidth: 0 }}>
            {titulo}
            {subtitulo}
          </div>
          {acao}
        </div>
      </div>
    </div>
  );
};

export default CabecalhoRecarga;
