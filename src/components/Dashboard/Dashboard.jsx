import React, { useState, useEffect } from "react";
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

  // Função para gerar uma cor aleatória bonita
  function gerarCorBonita() {
    return randomcolor({ hue: "blue", luminosity: "bright", format: "hex" });
  }

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

    requisicao
      .get("/setores/admin")
      .then((response) => {
        const newData = response?.data?.data?.setores.map((item) => ({
          id_setor: item.id_setor,
          nome: item.nome,
          ocupacao: item.ocupacao,
          notificacoes: item.notificacoes,
          tolerancia: item.tolerancia,
          ultimoMovimento: item.ultimoMovimento,
          cor: gerarCorBonita(),
        }));
        setSetores(newData);
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
    requisicaoSetores();

    const interval = setInterval(() => {
        requisicaoSetores();
    }, 120000);

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
                  </div>
                </div>
                                   <div className="card bg-white border-0 shadow divPers2 me-1">
                    <div
                      className={
                        window.innerWidth > 1474
                          ? "card-body13 p-4"
                          : "card-body4 p-3"
                      }
                    >
                      <h4 style={{ textAlign: "start", margin: "1rem" }}>
                      </h4>
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <div >
                          <GraficoDebito/>
                          </div>
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
