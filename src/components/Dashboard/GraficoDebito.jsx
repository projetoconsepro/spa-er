import React from "react";
import { Bar } from "react-chartjs-2";

const GraficoDebito = ({ dados = [], totalAtivos = 0 }) => {
  const hasData = dados && Array.isArray(dados) && dados.length > 0;
  
  const chartData = {
    labels: hasData ? dados.map(item => item.mes) : [],
    datasets: [
      {
        label: "Ativações",
        data: hasData ? dados.map(item => Number(item.debitos_ativados || 0)) : [],
        backgroundColor: "#4594E5",
      },
      {
        label: "Desativações",
        data: hasData ? dados.map(item => Number(item.debitos_desativados || 0)) : [],
        backgroundColor: "#FA5F5F",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: { 
      legend: { 
        position: "top",
        labels: {
          boxWidth: 12 
        }
      } 
    },
    scales: { 
      x: { 
        beginAtZero: true,
        ticks: {
          autoSkip: true,
          maxRotation: 0 
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          autoSkip: false 
        }
      }
    },
  };

  return (
    <div >
      <h4 style={{ fontSize: 15, marginBottom: 9 }}>
        Débitos Ativos <span style={{ color: "#4594E5" }}>{totalAtivos}</span>
      </h4>
      <div style={{ width: "100%", height: "340px" }}>
        {hasData ? (
          <Bar 
            data={chartData} 
            options={options}
            height={null}
            width={null} 
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
            Carregando dados...
          </div>
        )}
      </div>
    </div>
  );
};

export default GraficoDebito;