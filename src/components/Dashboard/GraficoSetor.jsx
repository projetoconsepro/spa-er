import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip } from "chart.js";
import { max } from "moment";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip);

const GraficoSetor = ({ setores }) => {
  const setoresValidos = setores.filter(
    s => s.nome && s.vagas_ocupadas !== undefined && s.vagas_livres !== undefined && s.total !== undefined
  );

  const labels = setoresValidos.map((item) => item.nome);
  const vagasOcupadas = setoresValidos.map((item) => item.vagas_ocupadas);
  const vagasLivres = setoresValidos.map((item) => item.vagas_livres);
  const totalVagas = setoresValidos.map((item) => item.total);
  const cores = setoresValidos.map((item) => item.cor);

  const data = {
    labels,
    datasets: [
{
  type: "line",
  data: vagasOcupadas,
  backgroundColor: cores,
  borderColor: cores,
  borderWidth: 1,
  label: "",
  datalabels: { display: false },
  tooltip: { enabled: false }
},
      {
        type: "bar",
        label: "Vagas Livres",
        data: vagasLivres,
        backgroundColor: cores,
        borderColor: cores,
        borderWidth: 1,
        hidden: true,
      },
      {
        type: "bar",
        label: "Vagas Ocupadas",
        data: vagasOcupadas,
        backgroundColor: cores.map(cor => cor + "99"), 
        borderColor: cores,
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Total de Vagas",
        data: totalVagas,
        borderColor: "#333",
        backgroundColor: "#333",
        fill: false,
        tension: 0.3,
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: {
      legend: { position: "top",
        labels: {
        filter: (legendItem, chartData) => legendItem.text !== undefined && legendItem.text !== "",
      }},
          tooltip: {
      mode: "index",
      intersect: false,
      filter: (tooltipItem) => tooltipItem.dataset.label !== "",
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
        ticks: {
          autoSkip: false 
        }
      }
    },
  };

  return <div style={{ width: "100%", height: "330px" }}>        
        <Bar 
          data={data} 
          options={options}
          height={null}
          width={null}/>
          </div>;
};

export default GraficoSetor;