import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "chartjs-plugin-annotation";
import createAPI from "../../services/createAPI";
import randomColor from "randomcolor";

const Grafico = () => {
  const [contador, setContador] = useState(0);
  const [dataSetor, setData] = useState([]);
  const [ocupacao, setOcupacao] = useState([]);
  const [cores, setCores] = useState([]);
  const [nome, setNome] = useState([]);

  function gerarCorBonita() {
    return randomColor({ hue: "blue", luminosity: "bright", format: "hex" });
  }

  function lightenAndFadeColor(hexColor, lightenAmount, fadeAmount) {
    // Remover o caractere '#' do código hexadecimal (caso esteja presente)
    hexColor = hexColor.replace("#", "");

    // Separar o código hexadecimal em componentes R, G, B e A (se existir)
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
      alpha = 255; // Se não houver valor de alpha, consideramos 255 (totalmente opaco)
    }

    // Aumentar o valor de cada componente RGB (tornar a cor mais clara)
    red = Math.min(255, red + lightenAmount);
    green = Math.min(255, green + lightenAmount);
    blue = Math.min(255, blue + lightenAmount);

    // Reduzir o valor do canal alfa (tornar a cor mais opaca)
    alpha = Math.max(0, alpha - fadeAmount);

    // Converter os componentes em valores hexadecimais
    const newRed = red.toString(16).padStart(2, "0");
    const newGreen = green.toString(16).padStart(2, "0");
    const newBlue = blue.toString(16).padStart(2, "0");
    const newAlpha = alpha.toString(16).padStart(2, "0");

    // Criar o código hexadecimal da nova cor
    const newHexColor = `#${newRed}${newGreen}${newBlue}${newAlpha}`;

    return newHexColor;
  }

  const data = {
    labels: [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ],
    datasets: Object.values(nome),
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
        grid: {
          display: false,
          borderDash: [2],
          borderDashOffset: [3],
          color: "#ddd",
          drawBorder: false,
          drawTicks: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
          drawTicks: false,
        },
      },
    },
    grid: {
      borderDash: [2],
      borderDashOffset: [3],
      color: "rgba(221, 221, 221, 0.3)", // cor com opacidade 0.3
      drawBorder: false,
      drawTicks: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
    },
  };
  const requisicaoSetores = async () => {
    const requisicao = createAPI();

    requisicao
      .get("/setores/dashboard/admin")
      .then((response) => {
        const NewData = response?.data?.data?.map((item) => {
          const corBonita = gerarCorBonita();
          const backgroundColor = lightenAndFadeColor(corBonita, 30, 200);
          return {
            nome: item.nome,
            quantidade: item.id_movimento,
            hora: item.hora,
            cor: corBonita,
            backgroundColor: backgroundColor,
          };
        });

        const novoObjeto = {};

        for (const item of NewData) {
          const { cor, nome, quantidade, backgroundColor } = item;

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

          novoObjeto[nome].data.push(quantidade);
        }
        setNome(novoObjeto);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h4 style={{ textAlign: "start", margin: "1rem" }}>
        Ocupação classificado por hora:
      </h4>
      <Line data={data} options={options} />
    </>
  );
};

export default Grafico;
