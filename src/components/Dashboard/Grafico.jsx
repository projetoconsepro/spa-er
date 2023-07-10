import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-annotation';

const data = {
  labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
  datasets: [
    {
      label: 'Vendas',
      data: [12, 19, 3, 5, 2, 3],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 4,
      pointRadius: 2,
      lineTension: 0.5,
      cubicInterpolationMode: 'monotone',
    },
    {
      label: 'Lucro',
      data: [8, 15, 1, 7, 4, 5],
      fill: true,
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 4,
      pointRadius: 2,
      lineTension: 0.5,
      cubicInterpolationMode: 'monotone',
    },
  ],
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
        color: '#ddd',
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
    color: 'rgba(221, 221, 221, 0.3)', // cor com opacidade 0.3
    drawBorder: false,
    drawTicks: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 20,
        padding: 15,
      },
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y',
          value: 10,
          borderColor: 'rgba(255, 0, 0, 0.5)',
          borderWidth: 2,
          label: {
            enabled: true,
            position: 'right',
            content: 'Meta de Vendas',
          },
        },
      ],
    },
  },
};

const Grafico = () => (
    <div className="w-100">
        <h2 style={{ textAlign: 'center', margin: '1rem' }}>Estacionamentos por mês:</h2>
        <Line data={data} options={options} />
    </div>
)

export default Grafico