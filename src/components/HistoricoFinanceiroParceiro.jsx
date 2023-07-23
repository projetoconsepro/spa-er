import axios from "axios";
import { React, useState, useEffect } from "react";
import { BsCashCoin } from "react-icons/bs";
import VoltarComponente from "../util/VoltarComponente";
import Filtro from "../util/Filtro";
import { Badge, Group, Pagination } from "@mantine/core";
import { IconCash } from "@tabler/icons-react";
import createAPI from "../services/createAPI";

const HistoricoFinanceiroParceiro = () => {
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
    const requisicao = createAPI();

    requisicao
      .get("/financeiro/parceiro")
      .then((response) => {
        console.log(response.data.dados);
        setSaldo(response?.data.dados.saldo);
        const newData = response?.data.dados.movimentos.map((item) => ({
          valor: item.valor,
          data: ArrumaHora(item.data),
          tipo: item.tipo,
          cpf: item.cpf === undefined ? "" : item.cpf,
          cnpj: item.cnpj === undefined ? "" : item.cnpj,
          placa: item.placa === undefined ? "" : item.placa,
        }));
        console.log("essa é a newdata", newData);

        for (let i = 0; i < newData.length; i++) {
          if (newData[i].tipo === "credito") {
            newData[i].debito = "S";
          } else if (newData[i].tipo === "Acréscimo de crédito") {
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

    const requisicao = createAPI();

    const base64 = btoa(where);
    requisicao
      .get(`/financeiro/parceiro/?query=${base64}`)
      .then((response) => {
        console.log(response);
        if (response.data.msg.resultado) {
          setEstadoLoading(false);
          setSaldo(response?.data.dados.saldo);
          const newData = response?.data.dados.movimentos.map((item) => ({
            valor: item.valor,
            data: ArrumaHora(item.data),
            tipo: item.tipo,
            cpf: item.cpf === undefined ? "" : item.cpf,
            cnpj: item.cnpj === undefined ? "" : item.cnpj,
            placa: item.placa === undefined ? "" : item.placa,
          }));
          for (let i = 0; i < newData.length; i++) {
            if (newData[i].tipo === "credito") {
              newData[i].debito = "S";
            } else if (newData[i].tipo === "Acréscimo de crédito") {
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
    <div>
      <p className="mx-3 text-start fs-4 fw-bold">Histórico financeiro:</p>
      <div className="row mb-3">
        <div className="col-5 mx-2">
          <Filtro
            nome={"HistoricoFinanceiroParceiro"}
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
                      color={item.tipo === "Transferencia" ? "red" : "#3DAE30"}
                      className="icon mt-1"
                    />
                    {currentItems[index + 1] === undefined ||
                    currentItems[index + 1] === null ? null : (
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
                      : item.tipo === "Transferencia"
                      ? "Transferência"
                      : item.tipo === "regularizacao"
                      ? "Regularizacao"
                      : "Acréscimo de crédito"}
                    {item.tipo === "regularizacao" && window.innerWidth > 1110
                      ? ` - ${item.placa}`
                      : item.tipo === "credito" && window.innerWidth > 1110
                      ? ` - ${item.placa}`
                      : item.tipo === "tolerancia" && window.innerWidth > 1110
                      ? ` - ${item.placa}`
                      : item.tipo === "Transferencia" &&
                        window.innerWidth > 1110
                      ? ` - ${item.cnpj === "" ? item.cpf : item.cnpj}`
                      : item.tipo === "Acrescimo de credito" &&
                        window.innerWidth > 1110
                      ? ` - ${item.cnpj === "" ? item.cpf : item.cnpj}`
                      : null}
                  </div>
                </div>
                <div className="col-5 p-0">
                  <div className="data text-end ">{item.data} </div>
                </div>
                <div className="col-2"></div>
                <div className="col-5 p-0">
                  <div className="preco text-start">{`R$ ${item.valor}`}</div>
                </div>
                <div className="col-5 text-end">
                  {item.tipo === "regularizacao" && window.innerWidth <= 1110
                    ? `${item.placa}`
                    : item.tipo === "credito" && window.innerWidth <= 1110
                    ? `${item.placa}`
                    : item.tipo === "tolerancia" && window.innerWidth <= 1110
                    ? `${item.placa}`
                    : item.tipo === "Transferencia" && window.innerWidth <= 1110
                    ? `${item.cnpj === "" ? item.cpf : item.cnpj}`
                    : item.tipo === "Acrescimo de credito" &&
                      window.innerWidth <= 1110
                    ? `${item.cnpj === "" ? item.cpf : item.cnpj}`
                    : null}
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

export default HistoricoFinanceiroParceiro;
