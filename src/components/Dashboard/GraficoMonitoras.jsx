import React from 'react';
import { Bar } from 'react-chartjs-2';

const GraficoMonitoras = ({ informacoesMonitoras }) => {
  const data = {
    labels: informacoesMonitoras.map(item => item.nome.split(' ')[0]),
    datasets: [
      {
        label: 'Total Monitora',
        data: informacoesMonitoras.map(item => item.total_geral),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

const options = {
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        title: (tooltipItems) => {
          const idx = tooltipItems[0].dataIndex;
          return informacoesMonitoras[idx].nome;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 10,
        },
        maxRotation: 0,
        minRotation: 0, 
      },
    },
    y: {
      ticks: {
        font: {
          size: 12,
        },
      },
    },
  },
};

  return (
    <div style={{ width: "100%", height: "330px" }}>   
      <Bar data={data} options={options} height={null} width={null}/>
    </div>
  );
};

export default GraficoMonitoras;