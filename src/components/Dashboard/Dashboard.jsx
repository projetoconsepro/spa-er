import React, { useState, useEffect } from "react";
import Grafico from "./Grafico";
import { Card, Grid, Group, Text } from "@mantine/core";
import GraficoBola from "./GraficoBola";
import GraficoDebito from "./GraficoDebito";
import GraficoSetor from "./GraficoSetor";
import { Carousel } from "@mantine/carousel";
import axios from "axios";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaParking } from "react-icons/fa";
import randomcolor from "randomcolor";
import CarroLoading from "../Carregamento";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import GraficoMonitoras from './GraficoMonitoras';
import GraficoValorSetor from "./GraficoValorSetor";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "../../util/logoconseproof2.png";

const Dashboard = () => {
  const [setores, setSetores] = useState([]);
  const [informacoesSetores, setInformacoesSetores] = useState([]);
  const [informacoesMonitoras, setInformacoesMonitoras] = useState([]);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());

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

  const requisicaoSetores = async () => {


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
          valor_total: item.valor_total,
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

  const requisicaoVagaSetor = async () => {
    requisicao
      .get("/setores/admin/vagas")
      .then((response) => {
        const newData = response?.data?.data?.resultados.map((item) => ({
          id_setor: item.id_setor,
          nome: item.nome,
          vagas_ocupadas: item.vagas_ocupadas,
          vagas_livres: item.vagas_livres,
          total: item.total_vagas,
          ocupacao_percentual: item.vagas_ocupadas > 0 ? ((item.vagas_ocupadas / item.total_vagas) * 100).toFixed(1) + "%" : "0%",
          cor: gerarCorBonita(),
        }));
        setInformacoesSetores(newData);
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

  const requisicaoMonitoras = async () => {
    requisicao
      .get("/usuario/total/monitoras")
      .then((response) => {
        const newData = response?.data?.data?.resultados.map((item) => ({
          nome: item.nome,
          total_geral: item.total_geral,
          total_pix: item.total_pix,
          total_dinheiro: item.total_dinheiro,
          movimentos: item.movimentos,
          notificacoes: item.notificacoes,
        }));
        setInformacoesMonitoras(newData);
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
    const atualizarDados = () => {
      Promise.all([
        requisicaoSetores(),
        requisicaoVagaSetor(),
        requisicaoMonitoras()
      ]).finally(() => {
        setUltimaAtualizacao(new Date());
      });
    };
  
    atualizarDados(); 
  
    const interval = setInterval(() => {
      atualizarDados();
    }, 120000);
  
    return () => clearInterval(interval);
  }, []);

const AtualizacaoInfo = ({ data }) => {
  if (!data) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: "0.8rem",
        bottom: "0.6rem",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        width: "auto",
      }}
    >
      <span
        style={{
          fontSize: "0.8rem",
          color: "#888",
          marginRight: "0.5rem",
        }}
      >
        Atualizado em: {data.toLocaleString()}
      </span>
    </div>
  );
};

    const gerarRelatorioPDF = () => {
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const doc = new jsPDF();
      const header = () => {
      const logoWidth = 30;
      const logoHeight = 12;
      const logoPositionX = doc.internal.pageSize.width - 15 - logoWidth;
      const logoPositionY = 6;
      doc.addImage(
        Logo,
        "PNG",
        logoPositionX,
        logoPositionY,
        logoWidth,
        logoHeight
      );
  
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text("Relatório Dashboard", 15, 10);
      doc.setFontSize(10);
      doc.setTextColor(100);
  
      const dateNow = ultimaAtualizacao || new Date();
      const day = dateNow.getDate().toString().padStart(2, "0");
      const month = (dateNow.getMonth() + 1).toString().padStart(2, "0");
      const year = dateNow.getFullYear().toString();
      const hour = dateNow.getHours().toString().padStart(2, "0");
      const minute = dateNow.getMinutes().toString().padStart(2, "0");
      const formattedDate = `${day}/${month}/${year} ${hour}:${minute}`;
  
      doc.text(`Gerado por: ${user2.nome}`, 15, 17);
      doc.text(`Informações atualizadas em: ${formattedDate}`, 15, 23);
    };
  
    header();
  
    let finalY = 35;

    doc.setFontSize(12);
    doc.text("Setores", 15, finalY);
    finalY += 4;
    autoTable(doc, {
      startY: finalY,
      head: [["Setor", "N° Ocupações", "N° Notificações", "N° Tolerâncias", "Valor total"]],
      body: setores.map(item => [
        item.nome,
        item.ocupacao,
        item.notificacoes,
        item.tolerancia,
        `R$ ${item.valor_total}`
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 }
    });
    finalY = doc.lastAutoTable.finalY + 10;
  
    doc.text("Monitoras", 15, finalY);
    finalY += 4;
    autoTable(doc, {
      startY: finalY,
      head: [["Monitor", "N° Movimentos", "N° Notificações", "Dinheiro", "Pix", "Valor total"]],
      body: informacoesMonitoras.map(item => [
        item.nome,
        item.movimentos,
        item.notificacoes,
        `R$ ${item.total_dinheiro}`,
        `R$ ${item.total_pix}`,
        `R$ ${item.total_geral}`
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 }
    });
    finalY = doc.lastAutoTable.finalY + 10;
  
    doc.text("Vagas por Setor", 15, finalY);
    finalY += 4;
    autoTable(doc, {
      startY: finalY,
      head: [["Setor", "Ocupadas", "Livres", "Total", "Ocupação (%)"]],
      body: informacoesSetores.map(item => [
        item.nome,
        item.vagas_ocupadas ?? 0,
        item.vagas_livres ?? 0,
        item.total ?? 0,
        item.ocupacao_percentual
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 }
    });
  
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      const text = `Página ${i} / ${totalPages}`;
      const textWidth = doc.getTextWidth(text);
      const textX = (doc.internal.pageSize.width - textWidth) / 2;
      const textY = doc.internal.pageSize.height - 3;
      doc.text(text, textX, textY);
    }
  
    const dateNow = ultimaAtualizacao || new Date();
    const day = dateNow.getDate().toString().padStart(2, "0");
    const month = (dateNow.getMonth() + 1).toString().padStart(2, "0");
    const year = dateNow.getFullYear().toString().slice(-2);
    const hour = dateNow.getHours().toString().padStart(2, "0");
    const minute = dateNow.getMinutes().toString().padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}_${hour}-${minute}`;
    const fileName = `${formattedDate} - Relatório Dashboard.pdf`;
    doc.save(fileName);
  };
  return (
    <div>
      <button
        id="gerar-relatorio-btn"
        onClick={gerarRelatorioPDF}
      >
        Gerar Relatório
      </button>
      <div className="row mt-5 mt-lg-0">
        <Carousel
          slideGap="md"
          height={175}
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
        {setores.map((item, index) => {
          const setorInfo = informacoesSetores.find(s => s.nome === item.nome);

          return (
            <Carousel.Slide key={index}>
              <Card
                padding="lg"
                radius="md"
                withBorder
                className="text-start bg-blue-100 px-0 py-3"
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
                      <AiOutlineInfoCircle />‎ N° de notificações: {item.notificacoes}
                    </Text>
                    <Text size="sm" weight={400}>
                      % ‎ Ocupação: {setorInfo ? setorInfo.ocupacao_percentual : "0%"}
                    </Text>

                    <Text size="sm" weight={400}>
                      <AiOutlineInfoCircle />‎ N° de ocupações: {item.ocupacao}
                    </Text>
                    <Text size="sm" weight={400}>
                      <RiMoneyDollarCircleLine />‎ Valor total: R$ {item.valor_total}
                    </Text>
                    <Text size="sm" weight={400}>
                      <FaParking />‎ N° de tolerâncias: {item.tolerancia}
                    </Text>
                    <Text size="sm" weight={400}>
                      <FaParking />‎ Último movimento: {item.ultimoMovimento}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Card>
            </Carousel.Slide>
          );
        })}
        </Carousel>
                
        {window.innerWidth > 768 ? (
          <div className="col-12 mb-4 mt-5">
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
                <div className="card bg-white border-0 shadow divPers me-1">
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
                          <GraficoDebito />
                        </div>
                      </div>
                    </div>
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
                    <h5 style={{ textAlign: "start", margin: "1.0rem 0.4rem", fontWeight: "normal" }}>
                      Ocupação dos setores
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
                      Total Monitoras
                    </h5>
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <div>
                          <GraficoMonitoras informacoesMonitoras={informacoesMonitoras} />
                        </div>
                      </div>
                    </div>
                    <AtualizacaoInfo data={ultimaAtualizacao} />
                  </div>
                </div>
              </Group>
            </div>

          </div>
        ) : (
          <div className="col-12 mb-1 mt-4">
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
              <div className="row mt-3">
                <div className="card bg-white border-0 shadow w-100">
                  <h4 style={{ textAlign: "start", margin: "1.5rem" }}>
                      Ocupação dos setores
                  </h4>
                  <div className="card-body13 px-4 py-4">
                    <div className="row">
                      <div className="ct-chart-sales-value ct-double-octave ct-series-g" style={{ height: "400px" }}>
                        <GraficoSetor setores={informacoesSetores} />
                      </div>
                    </div>
                  </div>
                  <AtualizacaoInfo data={ultimaAtualizacao} />
                </div>
              </div>
              <div className="row mt-3">
                <div className="card bg-white border-0 shadow w-100">
                  <h4 style={{ textAlign: "start", margin: "1.5rem" }}>
                      Total Setores
                  </h4>
                  <div className="card-body13 px-4 py-4">
                    <div className="row">
                      <div className="ct-chart-sales-value ct-double-octave ct-series-g" style={{ height: "400px" }}>
                          <GraficoValorSetor setores={setores} />
                      </div>
                    </div>
                  </div>
                  <AtualizacaoInfo data={ultimaAtualizacao} />
                </div>
              </div>
                            <div className="row mt-3">
                <div className="card bg-white border-0 shadow w-100">
                  <h4 style={{ textAlign: "start", margin: "1.5rem" }}>
                      Total Monitoras
                  </h4>
                  <div className="card-body13 px-4 py-4">
                    <div className="row">
                      <div className="ct-chart-sales-value ct-double-octave ct-series-g" style={{ height: "400px" }}>
                        <GraficoMonitoras informacoesMonitoras={informacoesMonitoras} />
                      </div>
                    </div>
                  </div>
                  <AtualizacaoInfo data={ultimaAtualizacao} />
                </div>
              </div>

          </div>
        )}              <Carousel
                slideGap="md"
                height={160}
                slideSize={window.innerWidth < 768 ? "90%" : "24%"}
              dragFree
              align={informacoesMonitoras.length === 0 ? "center" : "start"}
              slidesToScroll={window.innerWidth < 768 ? 1 : 3}
              className="mt-3 mb-4 ms-3"
            >
              {informacoesMonitoras.length === 0 && (
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

              {informacoesMonitoras.map((item, index) => (
                <Carousel.Slide key={index}>
                  <Card
                    padding="lg"
                    radius="md"
                    withBorder
                    className="text-start bg-blue-100 px-0 py-3"
                  >
                    <Grid className="pe-0 ps-4">

                      <Grid.Col span={9} className="px-0 pt-0">
                        <Text size="sm" className="py-1" weight={500} style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          Monitor: {item.nome}
                        </Text>

                        <Text size="sm" weight={400}>
                          <RiMoneyDollarCircleLine />‎ Valor total: R$ {item.total_geral}
                        </Text>
                        <Text size="sm" weight={400}>
                          <RiMoneyDollarCircleLine />‎ Total dinheiro: R$ {item.total_dinheiro}
                        </Text>
                        <Text size="sm" weight={400}>
                          <RiMoneyDollarCircleLine />‎ Total pix: R${item.total_pix} ‎
                          ‎
                        </Text>
                        <Text size="sm" weight={400}>
                          <AiOutlineInfoCircle />‎ N° de movimentos: {item.movimentos}
                        </Text>
                        <Text size="sm" weight={400} color="red">
                          <AiOutlineInfoCircle />‎ N° de notificações:{" "}
                          {item.notificacoes}
                        </Text>

                      </Grid.Col>
                    </Grid>
                  </Card>
                </Carousel.Slide>
              ))}
            </Carousel>
      </div>
    </div>
  );
};

export default Dashboard;
