import axios from "axios";
import { React, useState, useEffect } from "react";
import { BsCashCoin } from "react-icons/bs";
import { FaCoins } from "react-icons/fa";
import Swal from "sweetalert2";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import { Badge, Box, Group, Pagination } from "@mantine/core";
import { IconCash } from "@tabler/icons-react";
import { createAPI } from "../services/createAPI";

const HistoricoFinanceiro = () => {
  const [resposta, setResposta] = useState([]);
  const [resposta2, setResposta2] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [estadoLoading, setEstadoLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resposta.slice(indexOfFirstItem, indexOfLastItem);

  function ArrumaHora(data) {
    const data2 = data.split("T");
    const data3 = data2[0].split("-");
    const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
    const data6 = data2[1].split(":");
    const data5 = data4 + " " + (data6[0] - 3) + ":" + data6[1];
    return data5;
  }

  useEffect(() => {
    const requisicao = createAPI;
    requisicao
      .get("/financeiro/cliente")
      .then((response) => {
        setSaldo(response?.data.dados.saldo);
        const newData = response?.data.dados.movimentos.map((item) => ({
          valor: Math.abs(item.valor),
          data: ArrumaHora(item.data),
          tipo: item.tipo,
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
        setResposta2(newData);
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
    setEstadoLoading(true);
    setEstadoLoading(true);

    const requisicao = createAPI;

    const base64 = btoa(where);
    requisicao
      .get(`/financeiro/cliente/?query=${base64}`)
      .then((response) => {
        if (response.data.msg.resultado) {
          setEstadoLoading(false);
          setSaldo(response?.data.dados.saldo);
          const newData = response?.data.dados.movimentos.map((item) => ({
            valor: Math.abs(item.valor),
            data: ArrumaHora(item.data),
            tipo: item.tipo,
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
      <p className="mx-3 text-start fs-4 fw-bold">
        <VoltarComponente arrow={true} /> Histórico financeiro:
      </p>
      <div className="row mb-3">
        <div className="col-5 mx-2">
          <Filtro
            nome={"HistoricoFinanceiro"}
            onConsultaSelected={handleConsulta}
            onLoading={estadoLoading}
          />
        </div>
        <div className="col-6 text-end mt-1">
          <Badge
            variant="gradient"
            fz="sm"
            w={window.innerWidth < 768 ? 150 : 200}
            h={30}
            gradient={{ from: "teal", to: "blue", deg: 210 }}
            leftSection={<IconCash />}
          >
            R${saldo}
          </Badge>
        </div>
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
                      : `R$ ${item.valor}`}
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
          total={resposta.length / 50 + 1}
          limit={itemsPerPage}
        />
      </Group>

      <VoltarComponente />
    </div>
  );
};

export default HistoricoFinanceiro;
