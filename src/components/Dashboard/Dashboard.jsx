import React, { useState, useEffect, useRef } from "react";
import Grafico from "./Grafico";
import { Card, Grid, Group, Text } from "@mantine/core";
import GraficoBola from "./GraficoBola";
import GraficoDebito from "./GraficoDebito";
import { Carousel } from "@mantine/carousel";
import axios from "axios";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaParking } from "react-icons/fa";
import randomcolor from "randomcolor";
import CarroLoading from "../Carregamento";

const Dashboard = () => {
  const [setores, setSetores] = useState([]);

  const DELAY_DEBITO = 200;
  const DELAY_VAGAS = 300;
  const DELAY_MONITORAS = 400;
  const DELAY_GRAFICO_OCUPACAO = 100;

  const isPrimeiraCargaRef = useRef(true);

  const requisicaoSetores = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: user2.perfil[0],
      },
    });
  // Função para gerar uma cor aleatória bonita
  function gerarCorBonita() {
    return randomcolor({ hue: "blue", luminosity: "bright", format: "hex" });
  }

  function formatarDataPT(data) {
    if (!data) return "-";
    try {
      const date = new Date(data);
      return date.toLocaleString("pt-BR");
    } catch {
      return data;
    }
  }

  const requisicaoSetores = async () => {
    setLoadingSetores(true);

    requisicao
      .get("/setores/admin")
      .then((response) => {
        const setoresData = response?.data?.data?.setores;
        if (setoresData && Array.isArray(setoresData)) {
          const newData = setoresData.map((item) => ({
            id_setor: item.id_setor,
            nome: item.nome,
            ocupacao: item.ocupacao,
            notificacoes: item.notificacoes,
            tolerancia: item.tolerancia,
            ultimoMovimento: formatarDataPT(item.ultimoMovimento),
            valor_total: item.valor_total,
            cor: gerarCorBonita(),
          }));
          setSetores(newData);
        } else {
          setSetores([]);
        }
      })
      .catch(function (error) {
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
      })
      .finally(() => {
        setLoadingSetores(false);
      });
  };

  const requisicaoVagaSetor = async () => {
    setLoadingVagas(true);
    requisicao
      .get("/setores/admin/vagas")
      .then((response) => {
        const resultadosData = response?.data?.data?.resultados;
        if (resultadosData && Array.isArray(resultadosData)) {
          const newData = resultadosData.map((item) => ({
            id_setor: item.id_setor,
            nome: item.nome,
            vagas_ocupadas: item.vagas_ocupadas,
            vagas_livres: item.vagas_livres,
            total: item.total_vagas,
            ocupacao_percentual: item.vagas_ocupadas > 0 ? ((item.vagas_ocupadas / item.total_vagas) * 100).toFixed(1) + "%" : "0%",
            cor: gerarCorBonita(),
          }));
          setInformacoesSetores(newData);
        } else {
          setInformacoesSetores([]);
        }
      })
      .catch(function (error) {
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

  useEffect(() => {
    const atualizarDados = async () => {
      const multiplicador = isPrimeiraCargaRef.current ? 1 : 5;
      
      await requisicaoSetores();
      
      setTimeout(() => {
        requisicaoDebito();
      }, DELAY_DEBITO * multiplicador);
      
      setTimeout(() => {
        requisicaoGraficoOcupacao();
      }, DELAY_GRAFICO_OCUPACAO * multiplicador);
      
      setTimeout(() => {
        requisicaoVagaSetor();
      }, DELAY_VAGAS * multiplicador);
      
      setTimeout(() => {
        requisicaoMonitoras();
      }, DELAY_MONITORAS * multiplicador);
      
      setUltimaAtualizacao(new Date());
      isPrimeiraCargaRef.current = false;
    };
  
    atualizarDados(); 
  
    const interval = setInterval(() => {
      atualizarDados();
    }, 600000);
  
    return () => clearInterval(interval);
}, []);



  return (
    <div>
      <div className="row">
        <Carousel
          slideGap="md"
          height={150}
          slideSize={window.innerWidth < 768 ? "90%" : "32.333333%"}
          dragFree
          align="center"
          slidesToScroll={window.innerWidth < 768 ? 1 : 3}
        >
          {setores.length === 0 && (
            <Carousel.Slide>
              <Card
                padding="lg"
                radius="md"
                withBorder
                className="text-center bg-blue-100"
              >
                <Grid>
                  <Grid.Col span={4} className="mx-auto">
                    <Group position="center" align="center" mt="md">
                      <Text fz="lg" weight={700}>
                        <CarroLoading />
                      </Text>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Card>
            </Carousel.Slide>
          )}

          {setores.map((item, index) => (
            <Carousel.Slide key={index}>
              <Card
                padding="lg"
                radius="md"
                withBorder
                className="text-start bg-blue-100 px-0"
              >
                <Grid className="pe-0 ps-1">
                  <Grid.Col span={3} className="px-0">
                    <Group position="center" mt="md">
                      <div className="icon-shape icon-shape bg-blue-200 rounded me-3 me-sm-0">
                        <Text fz="lg" className="text-white" weight={700}>
                          {item.nome}
                        </Text>
                      </div>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={9} className="px-0 pt-0">
                    <Text size="sm" weight={400}>
                      Setor: {item.nome}
                    </Text>
                    <Text size="sm" weight={400} color="red">
                      <AiOutlineInfoCircle />‎ N° de notificações:{" "}
                      {item.notificacoes}
                    </Text>
                    <Text size="sm" weight={400}>
                      <AiOutlineInfoCircle />‎ N° de ocupações: {item.ocupacao}
                    </Text>
                    <Text size="sm" weight={400}>
                      <FaParking />‎ N° de tolerâncias: {item.tolerancia}
                    </Text>
                    <Text size="sm" weight={400}>
                      <FaParking />‎ Último movimento: {item.ultimoMovimento} ‎
                      ‎
                    </Text>
                  </Grid.Col>
                </Grid>
              </Card>
            </Carousel.Slide>
          ))}
        </Carousel>
        {window.innerWidth > 768 ? (
          <div className="col-12 mb-4 mt-4">
            <div className="row">
              <Group position="center">
                <div className="card bg-white border-0 shadow divPers ms-1">
                  <div
                    className={
                      window.innerWidth > 1474
                        ? "card-body13 p-2"
                        : "card-body4 p-2"
                    }
                  >
                    <div className="row">
                      <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                        <Grafico />
                      </div>
                    </div> 
                    <AtualizacaoInfo data={ultimaAtualizacao} />
                  </div>

                </div>
                <div className="card bg-white border-0 shadow divPers mx-1">
                  <div
                    className={
                      window.innerWidth > 1474
                        ? "card-body13 p-2"
                        : "card-body4 p-2"
                    }
                  >
                    <h5 style={{ textAlign: "start", margin: "1.5rem", fontWeight: "normal" }}>
                      Movimentos dos setores
                    </h5>
                    <div className="row d-flex justify-content-center">
                      <div className="col-12 " style={{ width: "20rem", height: "20rem" }} >
                        <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                          <GraficoBola setores={setores} />
                        </div>
                      </div>
                    </div>
                     <AtualizacaoInfo data={ultimaAtualizacao} />
                  </div>
                </div>
                <div className="card bg-white border-0 shadow divPers me-1">
                  <div
                    className={
                      window.innerWidth > 1474
                        ? "card-body13 py-2 px-4"
                        : "card-body4 p-3"
                    }
                  >
                    <h4 style={{ textAlign: "start", margin: "1rem" }}>
                    </h4>
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <div >
                          <GraficoDebito dados={dadosDebito} totalAtivos={totalAtivos} />
                        </div>
                      </div>
                    </div>
                     <AtualizacaoInfo data={ultimaAtualizacao} />
                  </div>
                </div>
                <div className="card bg-white border-0 shadow divPers me-1" style={{ position: "relative" }}>
                  <div
                    className={
                      window.innerWidth > 1474
                        ? "card-body13 p-3"
                        : "card-body4 p-3"
                    }
                  >
                    <h5 style={{ textAlign: "start", margin: "0.7rem 0.4rem", fontWeight: "normal" }}>
                      Ocupação dos setores {loadingVagas && <span style={{ fontSize: "0.8rem", color: "#888" }}>(carregando...)</span>}
                    </h5>
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <div>
                          <GraficoSetor setores={informacoesSetores} />
                        </div>
                      </div>
                    </div>
                    <AtualizacaoInfo data={ultimaAtualizacao} />
                  </div>
                </div>
                                <div className="card bg-white border-0 shadow divPers me-1" style={{ position: "relative" }}>
                  <div
                    className={
                      window.innerWidth > 1474
                        ? "card-body13 p-3"
                        : "card-body4 p-3"
                    }
                  >
                    <h5 style={{ textAlign: "start", margin: "0.7rem 0.4rem", fontWeight: "normal" }}>
                      Total Setores
                    </h5>
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <div>
                          <GraficoValorSetor setores={setores} />
                        </div>
                      </div>
                    </div>
                    <AtualizacaoInfo data={ultimaAtualizacao} />
                  </div>
                </div>
                                <div className="card bg-white border-0 shadow divPers me-1" style={{ position: "relative" }}>
                  <div
                    className={
                      window.innerWidth > 1474
                        ? "card-body13 p-3"
                        : "card-body4 p-3"
                    }
                  >
                    <h5 style={{ textAlign: "start", margin: "0.7rem 0.4rem", fontWeight: "normal" }}>
                      Total Monitoras {loadingMonitoras && <span style={{ fontSize: "0.8rem", color: "#888" }}>(carregando...)</span>}
                    </h5>
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <div>
                          <GraficoMonitoras informacoesMonitoras={informacoesMonitoras} />
                        </div>
                      </div>
                    </div>
                  </div>
              </Group>
            </div>
          </div>
        ) : (
          <div className="col-12 mb-4 mt-4">
            <div className="row">
                    <div className="card bg-white border-0 shadow w-100">
                        <div className="card-body13 p-2">
                            <div className="row">
                                <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                                    <Grafico />
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <div className="row mt-3">
              <div className="card bg-white border-0 shadow w-100">
                <h4 style={{ textAlign: "start", margin: "1.5rem" }}>
                  Movimentos dos setores
                </h4>
                <div className="card-body13 p-2">
                  <div className="row">
                    <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                      <GraficoBola setores={setores} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
                        <div className="row mt-3">
                    <div className="card bg-white border-0 shadow w-100">
                        <div className="card-body13 px-4 py-4">
                            <div className="row">
                                <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                                    <GraficoDebito />
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
