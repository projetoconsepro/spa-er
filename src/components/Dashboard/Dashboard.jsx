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
  const [dadosDebito, setDadosDebito] = useState([]);
  const [totalAtivos, setTotalAtivos] = useState(0);
  const [dadosGraficoOcupacao, setDadosGraficoOcupacao] = useState({});
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());
  
  const [loadingSetores, setLoadingSetores] = useState(true);
  const [loadingVagas, setLoadingVagas] = useState(true);
  const [loadingMonitoras, setLoadingMonitoras] = useState(true);
  const [loadingDebito, setLoadingDebito] = useState(true);
  const [loadingGraficoOcupacao, setLoadingGraficoOcupacao] = useState(true);

  const DELAY_VAGAS = 1500;
  const DELAY_MONITORAS = 3000;
  const DELAY_DEBITO = 2000; 
  const DELAY_GRAFICO_OCUPACAO = 1000;

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
            ultimoMovimento: item.ultimoMovimento,
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
      })
      .finally(() => {
        setLoadingVagas(false);
      });
  };

  const requisicaoMonitoras = async () => {
    setLoadingMonitoras(true);
    requisicao
      .get("/usuario/total/monitoras")
      .then((response) => {
        const resultadosData = response?.data?.data?.resultados;
        if (resultadosData && Array.isArray(resultadosData)) {
          const newData = resultadosData.map((item) => ({
            nome: item.nome,
            total_geral: item.total_geral,
            total_pix: item.total_pix,
            total_dinheiro: item.total_dinheiro,
            movimentos: item.movimentos,
            notificacoes: item.notificacoes,
          }));
          setInformacoesMonitoras(newData);
        } else {
          setInformacoesMonitoras([]);
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
        setLoadingMonitoras(false);
      });
  };

  const requisicaoDebito = async () => {
    setLoadingDebito(true);
    requisicao
      .get("/veiculo/debito/cont")
      .then((response) => {
        if (response.status === 200 && response.data.msg.resultado) {
          const newData = response.data.data;
          setDadosDebito(newData);
          if (newData && newData.length > 0) {
            setTotalAtivos(newData[newData.length - 1].total_debitos_ativos);
          } else {
            setTotalAtivos(0);
          }
        } else {
          setDadosDebito([]);
          setTotalAtivos(0);
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
        setDadosDebito([]);
        setTotalAtivos(0);
      })
      .finally(() => {
        setLoadingDebito(false);
      });
  };

  const requisicaoGraficoOcupacao = async () => {
    setLoadingGraficoOcupacao(true);
    
    const labels = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];

    function gerarCorBonita() {
      return randomcolor({ hue: "blue", luminosity: "bright", format: "hex" });
    }

    function lightenAndFadeColor(hexColor, lightenAmount, fadeAmount) {
      if (!hexColor || typeof hexColor !== 'string') {
        return '#4594E580'; // Cor padrão com transparência
      }
      
      hexColor = hexColor.replace("#", "");
      let red, green, blue, alpha;
      
      if (hexColor.length === 8) {
        red = parseInt(hexColor.slice(0, 2), 16);
        green = parseInt(hexColor.slice(2, 4), 16);
        blue = parseInt(hexColor.slice(4, 6), 16);
        alpha = parseInt(hexColor.slice(6, 8), 16);
      } else {
        red = parseInt(hexColor.slice(0, 2), 16);
        green = parseInt(hexColor.slice(2, 4), 16);
        blue = parseInt(hexColor.slice(4, 6), 16);
        alpha = 255;
      }

      red = Math.min(255, red + lightenAmount);
      green = Math.min(255, green + lightenAmount);
      blue = Math.min(255, blue + lightenAmount);
      alpha = Math.max(0, alpha - fadeAmount);

      const newRed = red.toString(16).padStart(2, "0");
      const newGreen = green.toString(16).padStart(2, "0");
      const newBlue = blue.toString(16).padStart(2, "0");
      const newAlpha = alpha.toString(16).padStart(2, "0");

      return `#${newRed}${newGreen}${newBlue}${newAlpha}`;
    }

    requisicao
      .get("/setores/dashboard/admin")
      .then((response) => {
        const dados = response?.data?.data;
        
        if (!dados || !Array.isArray(dados)) {
          setDadosGraficoOcupacao({});
          return;
        }
        
        const NewData = dados.map((item) => {
          const corBonita = gerarCorBonita();
          const backgroundColor = lightenAndFadeColor(corBonita, 30, 200);
          return {
            nome: item.nome,
            quantidade: item.numero_movimento,
            hora: item.intervalo_horario,
            cor: corBonita,
            backgroundColor: backgroundColor,
          };
        });

        const novoObjeto = {};
        
        for (const item of NewData) {
          const { cor, nome, quantidade, backgroundColor, hora } = item;

          if (!novoObjeto[nome]) {
            novoObjeto[nome] = {
              label: ` ${nome} `,
              data: [],
              backgroundColor: backgroundColor,
              borderColor: cor,
              borderWidth: 4,
              fill: true,
              pointRadius: 2,
              lineTension: 0.5,
              cubicInterpolationMode: "monotone",
            };
          }
          novoObjeto[nome].data[labels.indexOf(hora)] = quantidade;
        }
        setDadosGraficoOcupacao(novoObjeto);
      })
      .catch((error) => {
        console.log(error);
        setDadosGraficoOcupacao({});
      })
      .finally(() => {
        setLoadingGraficoOcupacao(false);
      });
  };

  useEffect(() => {
    const atualizarDados = async () => {
      await requisicaoSetores();
      
      setTimeout(() => {
        requisicaoDebito();
      }, DELAY_DEBITO);
      
      setTimeout(() => {
        requisicaoGraficoOcupacao();
      }, DELAY_GRAFICO_OCUPACAO);
      
      setTimeout(() => {
        requisicaoVagaSetor();
      }, DELAY_VAGAS);
      
      setTimeout(() => {
        requisicaoMonitoras();
      }, DELAY_MONITORAS);
      
      setUltimaAtualizacao(new Date());
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
      body: (setores || []).map(item => [
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
      body: (informacoesMonitoras || []).map(item => [
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
      body: (informacoesSetores || []).map(item => [
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ flex: '0 0 33.33%', margin: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                        {loadingSetores ? <CarroLoading /> : "Nenhum setor encontrado"}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Carousel.Slide>
          )}
        {(setores || []).map((item, index) => {
          const setorInfo = (informacoesSetores || []).find(s => s.nome === item.nome);

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
                        <Grafico dados={dadosGraficoOcupacao} />
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
                          <GraficoDebito dados={dadosDebito} totalAtivos={totalAtivos} />
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
                      <Grafico dados={dadosGraficoOcupacao} />
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
                                    <GraficoDebito dados={dadosDebito} totalAtivos={totalAtivos} />
                                </div>
                            </div>
                        </div>
                    </div>
              </div>
              <div className="row mt-3">
                <div className="card bg-white border-0 shadow w-100">
                  <h4 style={{ textAlign: "start", margin: "1.5rem" }}>
                      Ocupação dos setores {loadingVagas && <span style={{ fontSize: "0.9rem", color: "#888" }}>(carregando...)</span>}
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
                      Total Monitoras {loadingMonitoras && <span style={{ fontSize: "0.9rem", color: "#888" }}>(carregando...)</span>}
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
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ flex: '0 0 33.33%', margin: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
                          <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                            {loadingMonitoras ? <CarroLoading /> : "Nenhuma monitora encontrada"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Carousel.Slide>
              )}

              {(informacoesMonitoras || []).map((item, index) => (
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
