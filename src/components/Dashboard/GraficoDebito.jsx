import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import createAPI from "../../services/createAPI";

const GraficoDebito = () => {
  const [dados, setDados] = useState([]);
  const [totalAtivos, setTotalAtivos] = useState(0);

   useEffect(() => {
    const debito = async () => {
      const requisicao = createAPI();
      try {
        const response = await requisicao.get("/veiculo/debito/cont");
        if (response.status === 200 && response.data.msg.resultado) {
          const newData = response.data.data;
          setDados(newData);
          setTotalAtivos(newData[newData.length - 1].total_debitos_ativos);

        } else {
          setDados([]);
          setTotalAtivos(0);}
      } catch (error) {
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
      }
    };
    debito();
  }, []);

  const chartData = {
    labels: dados.map(item => item.mes),
    datasets: [
      {
        label: "Ativos",
        data: dados.map(item => Number(item.debitos_ativados)),
        backgroundColor: "#4594E5",
      },
      {
        label: "Inativos",
        data: dados.map(item => Number(item.debitos_desativados)),
        backgroundColor: "#FA5F5F",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
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
        ticks: {
          autoSkip: false 
        }
      }
    },
  };

  return (
    <div >
      <h4 style={{ fontSize: 14, marginBottom: 8 }}>
        Débitos Ativos: <span style={{ color: "#4594E5" }}>{totalAtivos}</span>
      </h4>
      <div style={{ width: "100%", height: "380px" }}>
        <Bar 
          data={chartData} 
          options={options}
          height={null}
          width={null} 
        />
      </div>
    </div>
  );
};

export default GraficoDebito;