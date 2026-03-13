import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "chartjs-plugin-annotation";

const Grafico = ({ dados = {} }) => {
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

  const hasData = dados && Object.keys(dados).length > 0;
  
  const data = {
    labels: labels,
    datasets: hasData ? Object.values(dados) : [],
  };

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
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
  plugins: {
    
    legend: {
      display: true,
      position: 'top',
      align: 'start', 
      labels: {
        boxWidth: 20,
        padding: 10,
        font: {
          size: 12,
        },
      },
    },
  },
  layout: {
    padding: {
      top: 0,
      bottom: 0,
      left: 20,
      right: 20,
    }
  }
};

  return (
    <>
      <h5 style={{ textAlign: "start", margin: "1.5rem", fontWeight: "normal" }}>
        Ocupação classificado por hora
      </h5>
    <div style={{ height: '300px', width: '100%' }}>
      {hasData ? (
        <Line data={data} options={options} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
          Carregando dados...
        </div>
      )}
    </div>
    </>
  );
};

export default Grafico;
