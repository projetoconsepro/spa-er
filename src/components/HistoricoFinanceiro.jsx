import { React, useState, useEffect } from "react";
import { BsCashCoin } from "react-icons/bs";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import { Box, Group, Pagination, Paper, Text } from "@mantine/core";
import { IconReceipt, IconWallet } from "@tabler/icons-react";
import createAPI from "../services/createAPI";
import {ArrumaHora} from "../util/ArrumaHora";

const HistoricoFinanceiro = (id_usuario = 0) => {
  const [resposta, setResposta] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [totalGasto, setTotalGasto] = useState();
  const [estadoLoading, setEstadoLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resposta.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    let id = id_usuario.id_usuario ?? 0;
    const requisicao = createAPI();
    requisicao
    .get(`/financeiro/cliente/${id}`)
      .then((response) => {
        setSaldo(response?.data.dados.saldo);
        setTotalGasto(response?.data.dados.totalGasto);
        const newData = response?.data.dados.movimentos.map((item) => ({
          valor: Math.abs(item.valor),
          data: ArrumaHora(item.data),
          tipo: item.tipo,
          placa: item.placa,
        }));
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].tipo === "credito") {
            newData[i].debito = "S";
          } else if (newData[i].tipo === "Acréscimo de crédito") {
            newData[i].debito = "N";
          } else if (newData[i].tipo === "regularizacao") {
            newData[i].debito = "S";
          }
        }
        setResposta(newData);
      })
      .catch((error) => {
        if (
          error?.response?.data?.msg === "Cabeçalho inválido!" ||
          error?.response?.data?.msg === "Token inválido!" ||
          error?.response?.data?.msg ===
            "Usuário não possui o perfil mencionado!"
        ) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("perfil");
        } else {
          console.log(error);
        }
      });
  }, []);

  const handleConsulta = (where) => {
    setEstado(false);
    setMensagem("");
    setCurrentPage(1);
    setEstadoLoading(true);
    setEstadoLoading(true);

    let id = id_usuario.id_usuario ?? 0;
    const requisicao = createAPI();

    const base64 = btoa(where);
    requisicao
    .get(`/financeiro/cliente/${id}/?query=${base64}`)
      .then((response) => {
        if (response.data.msg.resultado) {
          setEstadoLoading(false);
          setSaldo(response?.data.dados.saldo);
          setTotalGasto(response?.data.dados.totalGasto);
          const newData = response?.data.dados.movimentos.map((item) => ({
            valor: Math.abs(item.valor),
            data: ArrumaHora(item.data),
            tipo: item.tipo,
            placa: item.placa,
          }));
          for (let i = 0; i < newData.length; i++) {
            if (newData[i].tipo === "credito") {
              newData[i].debito = "S";
            } else if (newData[i].tipo === "Acréscimo de crédito") {
              newData[i].debito = "N";
            } else if (newData[i].tipo === "regularizacao") {
              newData[i].debito = "S";
            }
          }
          setResposta(newData);
        } else {
          setResposta([]);
          setTotalGasto("0,00");
          setEstadoLoading(false);
          setEstado(true);
          setMensagem(response.data.msg.msg);
        }
      })
      .catch((error) => {
        if (
          error?.response?.data?.msg === "Cabeçalho inválido!" ||
          error?.response?.data?.msg === "Token inválido!" ||
          error?.response?.data?.msg ===
            "Usuário não possui o perfil mencionado!"
        ) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("perfil");
        } else {
          console.log(error);
        }
      });
  };

  return (
    <div className="mb-3">
      <p className="text-start fs-4 fw-bold">
        <VoltarComponente arrow={true} /> Histórico financeiro:
      </p>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Paper
          px="xs"
          py={6}
          className="d-flex text-center"
          sx={{
            flex: "999 1 320px",
            minWidth: 0,
            borderRadius: "0.6rem",
            "@media (min-width: 768px)": {
              paddingTop: 4,
              paddingBottom: 4,
              "& .mantine-Text-root": { lineHeight: 1.3 },
            },
          }}
        >
          <div className="px-1" style={{ flex: "1 1 0", minWidth: 0 }}>
            <Text size="xs" color="dimmed"className="d-flex align-items-center justify-content-center gap-1">
              <IconWallet size={14} color="#3DAE30" /> Saldo atual
            </Text>
            <Text size="sm" weight={600}color="#525252" style={{ overflowWrap: "anywhere" }}>
              R$ {saldo}
            </Text>
          </div>
          {totalGasto !== undefined && (
            <div className="px-1 border-start" style={{ flex: "1 1 0", minWidth: 0 }}>
              <Text size="xs" color="dimmed"className="d-flex align-items-center justify-content-center gap-1">
                <IconReceipt size={14} color="#FB6660" /> Total gasto
              </Text>
              <Text size="sm" weight={600}color="#FB6660" style={{ overflowWrap: "anywhere" }}>
                R$ {totalGasto}
              </Text>
            </div>
          )}
        </Paper>
        <Box
          className="d-flex"
          sx={{
            flex: "1 1 300px",
            "& .mantine-Group-root": { flex: 1, alignItems: "stretch" },
            "& .mantine-Group-root > .mantine-Button-root": { height: "auto", minHeight: 36 },
          }}
        >
          <Filtro
            nome={"HistoricoFinanceiro"}
            onConsultaSelected={handleConsulta}
            onLoading={estadoLoading}
          />
        </Box>
      </div>
      <div id="kkk" className="mb-3">
        {currentItems.map((item, index) => (
          <div className="estacionamento" key={index}>
            <div className="container">
              <div className="row">
                <div className="col-2">
                  <div className="icon-container">
                    <BsCashCoin
                      size={25}
                      color={
                        item.tipo === "Acrescimo de credito" ||
                        item.tipo === "Transferencia recebida"
                          ? "#3DAE30"
                          : "#FB6660"
                      }
                      className="icon mt-1"
                    />
                    {currentItems[index + 1] === undefined || currentItems[index + 1] === null ? null : (
                      <div className="line"> </div>
                    )}
                    <div className="spacer"></div>
                  </div>
                </div>
                <div className="col-5 p-0">
                  <div className="titulo text-start">
                    {item.tipo === "credito"
                      ? "Estacionamento"
                      : item.tipo === "tolerancia"
                      ? "Estacionamento"
                      : item.tipo === "regularizacao"
                      ? "Regularização"
                      : item.tipo === "Acrescimo de credito"
                      ? "Acréscimo de crédito"
                      : item.tipo === "Transferencia recebida"
                      ? "Transferência recebida"
                      : item.tipo === "Transferencia de credito"
                      ? "Transferencia de crédito"
                      : item.tipo}
                      {item.placa && <span> - {item.placa}</span>}
                  </div>
                </div>
                <div className="col-5 p-0">
                  <div className="data text-end mt-2">{item.data}</div>
                </div>
                <div className="col-2"></div>
                <div className="col-5 p-0">
                  <div className="preco text-start">
                    {typeof item.valor === "number" &&
                    item.valor.toString()[0] === "0"
                      ? `R$ ${item.valor.toString().replace(".", ",")}`
                      : `${item.debito === 'S' ? '-' : '+'}  R$ ${item.valor}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className="alert alert-danger mt-4 mx-3"
        role="alert"
        style={{ display: estado ? "block" : "none" }}
      >
        {mensagem}
      </div>
      <Group position="center" mb="md">
        <Pagination
          value={currentPage}
          size="sm"
          onChange={handlePageChange}
          total={Math.max(1, Math.ceil(resposta.length / itemsPerPage))}
          limit={itemsPerPage}
        />
      </Group>

      <VoltarComponente />
    </div>
  );
};

export default HistoricoFinanceiro;
