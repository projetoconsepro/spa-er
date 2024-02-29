import { Pie } from "react-chartjs-2";


const GraficoBola = ({ setores }) => {
  const labels = setores.map((item) => item.nome);
  const ocupacao = setores.map((item) => item.ocupacao);
  const cores = setores.map((item) => item.cor);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Número de movimentos",
        data: ocupacao,
        backgroundColor: cores,
        borderColor: cores,
      },
    ],
  };

  return (
    <>
      <Pie data={data} />
    </>
  );
};

export default GraficoBola;