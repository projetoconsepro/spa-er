import axios from "axios";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import randomcolor from 'randomcolor';
import createAPI from "../../services/createAPI";


const GraficoBola = () => {
  const [setores, setSetores] = useState("");
  const [labels, setLabels] = useState([]);
  const [ocupacao, setOcupacao] = useState([]);
  const [cores, setCores] = useState([]);
  const [contador, setContador] = useState(0);

// Função para gerar uma cor aleatória bonita
function gerarCorBonita() {
  return randomcolor({ hue: 'blue', luminosity: 'bright', format: 'hex' });
}

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

  const requisicaoSetores = async () => {
    const requisicao = createAPI();

    requisicao
      .get("/setores/admin")
      .then((response) => {
        const newData = response?.data?.data?.setores.map((item) => ({
          nome: item.nome,
          ocupacao: item.ocupacao,
          cor: gerarCorBonita(),
        }));
        setSetores(newData);

        const labels = newData.map((item) => item.nome);
        setLabels(labels);
        const ocupacao = newData.map((item) => item.ocupacao);
        setOcupacao(ocupacao);
        const cores = newData.map((item) => item.cor);
        setCores(cores)

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
      });
  };


  useEffect(() => {
    if (contador === 60) {
      setContador(0);
      requisicaoSetores();
    }
    setTimeout(() => {
      setContador(contador + 1);
    }, 1000);
  }, [contador]);

  useEffect(() => {
    requisicaoSetores();
  }, []);

  return (
    <>
      <Pie data={data} />
    </>
  );
};

export default GraficoBola;