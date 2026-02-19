import React from 'react';
import { Bar } from 'react-chartjs-2';

const GraficoValorSetor = ({ setores }) => {
        console.log('setores', setores);
  const data = {
    labels: setores.map(item => item.nome),
    datasets: [
      {
        label: 'Total por Setor',
        data: setores.map(item => Number(item.valor_total) || 0),
        backgroundColor: setores.map(item => item.cor),
      },
    ],
  };

  const options = {   
    responsive: true,       
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const idx = tooltipItems[0].dataIndex;
            return setores[idx].nome;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 10 },
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        ticks: { font: { size: 12 } },
      },
    },
  };

  return <div style={{ width: "100%", height: "330px" }}> <Bar data={data} options={options} height={null} width={null} /></div>;
};

export default GraficoValorSetor;