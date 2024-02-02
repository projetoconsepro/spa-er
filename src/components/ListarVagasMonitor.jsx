import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ScrollTopArrow from "./ScrollTopArrow";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";
import createAPI from "../services/createAPI";
import { Button, Group } from "@mantine/core";
import { IconParking, IconReload } from "@tabler/icons-react";
import CalcularValidade from "../util/CalcularValidade";
import ValidarRequisicao from "../util/ValidarRequisicao";
import { VagaMonitor } from "./VagaMonitor";

const ListarVagasMonitor = () => {
  const [resposta, setResposta] = useState([]);
  const [vaga, setVaga] = useState("");
  const [resposta2, setResposta2] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [salvaSetor, setSalvaSetor] = useState("");
  const [vagasLivres, setVagasLivres] = useState(0);
  const [vagasOcupadas, setVagasOcupadas] = useState(0);
  const [vagasVencidas, setVagasVencidas] = useState(0);
  const [localVagas, setLocalVagas] = useState(true);
  const [attFunc, setAttFunc] = useState(false);
  let variavelAuxiliarVagas = [];

  const funcCalcVgas = (array) => {
    array = array.filter(item => item !== null);
    let estacionadoSCount = 0;
    let estacionadoNCount = 0;
    let estacionadoPCount = 0;

    const dataAtual = new Date();
    const hora = dataAtual.getHours().toString().padStart(2, "0");
    const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
    const segundos = dataAtual.getSeconds().toString().padStart(2, "0");
    const horaAtual = `${hora}:${minutos}:${segundos}`;

    array.forEach((objeto) => {
      if (objeto.numero !== 0) {
        if (objeto.estacionado === "S") {
          estacionadoSCount++;
          if (objeto.temporestante < horaAtual && objeto.numero_notificacoes_pendentess === 0) {
            estacionadoPCount++;
          }
        } else if (objeto.estacionado === "N") {
          estacionadoNCount++;
        }
      }
    });
    setVagasLivres(estacionadoNCount);
    setVagasOcupadas(estacionadoSCount);
    setVagasVencidas(estacionadoPCount);
  };


  const funcAttResposta = (Json, index) => {

    if (variavelAuxiliarVagas.length === 0) {
      variavelAuxiliarVagas = resposta;
    }

    variavelAuxiliarVagas[index] = Json;

    setResposta(variavelAuxiliarVagas);
    funcCalcVgas(variavelAuxiliarVagas);
    localStorage.setItem('listaVagas', JSON.stringify(variavelAuxiliarVagas));
  };

  const getVagas = async (setor, timeout) => {
    const requisicao = createAPI();
    const setor2 = document.getElementById("setoresSelect").value;
    if (setor2 !== undefined && setor2 !== null && setor2 !== "") {
      setor = setor2;
      if (timeout !== true && timeout !== null) {
      for (let i = 0; i < resposta.length; i++) {
        delete resposta[i];
        }
      }
    }

    localStorage.setItem("setorTurno", setor);
    setSalvaSetor(setor);
    setEstado(true);
    setMensagem("Carregando vagas...");

    const startTime = performance.now();
    if (localStorage.getItem("listaVagas") && timeout !== 'reset') {
        const items = localStorage.getItem("listaVagas");
        setResposta(JSON.parse(items));
        funcCalcVgas(JSON.parse(items));
        const endTime = performance.now();
        const tempoDecorrido = (endTime - startTime) / 1000;
        setMensagem(`Vagas carregadas em ${tempoDecorrido.toFixed(2)} segundos`);
    } else {
    const startTime = performance.now();
    await requisicao.get(`/vagas?setor=${setor}`).then((response) => {
      const endTime = performance.now();
      const tempoDecorrido = (endTime - startTime) / 1000;
      setMensagem(`Vagas carregadas em ${tempoDecorrido.toFixed(2)} segundos`);

      if (response.data.msg.resultado !== false) {
        const updatedResposta = resposta.map((item) => ({ ...item }));
        for (let i = 0; i < response?.data?.data.length; i++) {
          setSalvaSetor(response.data.data[0].nome);

          if (response.data.data[i].numero !== 0) {
            const updatedItem = {
              numero: response.data.data[i].numero,
              corvaga: response.data.data[i].cor,
              tipo: response.data.data[i].tipo,
              id_vaga: response.data.data[i].id_vaga,
            };

            if (response.data.data[i].estacionado === "N") {
              updatedItem.chegada = "";
              updatedItem.placa = "";
              updatedItem.temporestante = "";
              updatedItem.estacionado = response.data.data[i].estacionado;
              updatedItem.Countdown = "";
              updatedItem.variaDisplay = "escondido";
            } else {
              updatedItem.estacionado = response.data.data[i].estacionado;
              updatedItem.debito = response.data.data[i].debitar_automatico;
              updatedItem.numero_notificacoes = response.data.data[i].numero_notificacoes_pendentes;
              updatedItem.variaDisplay = "aparece";
              if (response.data.data[i].numero_notificacoes_pendentes !== 0) {
                updatedItem.display = "testeNot";
                updatedItem.numero_notificacoes_pendentes = response.data.data[i].numero_notificacoes_pendentess;
              } else {
                updatedItem.display = "testeNot2";
                updatedItem.numero_notificacoes_pendentes = 0;
              }
              updatedItem.id_vaga_veiculo = response.data.data[i].id_vaga_veiculo;
              updatedItem.chegada = response.data.data[i].chegada;
              updatedItem.placa = response.data.data[i].placa;
              updatedItem.temporestante = CalcularValidade( response.data.data[i].chegada, response.data.data[i].tempo);
              response.data.data[i].temporestante = updatedItem.temporestante;
              updatedItem.tempo = response.data.data[i].tempo;

              updatedItem.numero_notificacoes_pendentess = response.data.data[i].numero_notificacoes_pendentess;

              if (updatedItem.numero_notificacoes_pendentess !== 0) {
                const horaOriginal = new Date(response.data.data[i].hora_notificacao);
                horaOriginal.setHours(horaOriginal.getHours() + 2);
                const horaOriginalFormatada = horaOriginal.toLocaleTimeString("pt-BR", {timeZone: "America/Sao_Paulo",});
                updatedItem.hora_notificacao = horaOriginalFormatada;
              }
            }
            updatedResposta[i] = updatedItem;
          }
        }
        localStorage.setItem('listaVagas', JSON.stringify(updatedResposta));
        setResposta(updatedResposta);
        funcCalcVgas(updatedResposta);
      } else {
        setEstado(true);
        setMensagem(response.data.msg.msg);
      }
    });
  }
  };

useEffect(() => {
  localStorage.removeItem("id_vagaveiculo");
    if (localStorage.getItem("numero_vaga")) {
      setVaga(localStorage.getItem("numero_vaga"));
      setTimeout(() => {
        localStorage.removeItem("numero_vaga");
      }, 100);
    }

  const cardToScroll = document.querySelector(
    `.card-list[data-vaga="${vaga}"]`
  );
  if (cardToScroll) {
    setTimeout(() => {
      cardToScroll.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }
  }, [vaga, attFunc]);

  useEffect(() => {
      (async () => {
        const setor = localStorage.getItem("setorTurno");
        setSalvaSetor(setor);
        await getVagas(setor);
      })();
  }, [localVagas]);

  useEffect(() => {
    if (localStorage.getItem("listaVagas")) {
      const items = localStorage.getItem("listaVagas");
      setResposta(JSON.parse(items));
      setLocalVagas(true)
    } else {
      setLocalVagas(false)
    }

    if (localStorage.getItem("turno") != "true") {
      FuncTrocaComp("AbrirTurno");
    };

    const requisicao = createAPI();
    localStorage.removeItem("idVagaVeiculo");
    requisicao.get("/setores").then((response) => {
      if (response.data.msg.resultado) {
        const NewData = response.data.data.setores.map((item) => ({
          setores: item.nome,
        }));
        setResposta2(NewData);
      } else {
        setEstado(true);
        setMensagem(response.data.msg.msg);
      }
      }).catch(function (error) {
      ValidarRequisicao(error)
      });
    localStorage.removeItem("idVagaVeiculo");
    localStorage.removeItem("placa");
    localStorage.removeItem("vaga");
    localStorage.removeItem("placaCarro");
    localStorage.removeItem("tipoVaga");
    localStorage.removeItem("id_notificacao");
    for (let i = 0; i < 8; i++) {
      localStorage.removeItem(`foto${i}`);
    }
  }, []);

  return (
    <div className="dashboard-container mb-5">
      <div className="row">
        <div className="col-12 col-xl-8">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="row mx-2">
                <Group position="apart">
                  <Button
                    variant="gradient"
                    gradient={{ from: "indigo", to: "blue", deg: 60 }}
                    className="w-75"
                    mb="md"
                    radius="md"
                    size="md"
                    onClick={() =>
                      FuncTrocaComp("RegistrarEstacionamentoParceiro")
                    }
                  >
                    Registrar estacionamento ‎{" "}
                    <IconParking color="white" size={18} />
                  </Button>
                  <Button
                    variant="gradient"
                    gradient={{ from: "indigo", to: "blue", deg: 60 }}
                    mb="md"
                    radius="md"
                    size="md"
                    onClick={() => getVagas(salvaSetor, 'reset')}
                  >
                    <IconReload color="white" size={20} />
                  </Button>
                </Group>
              </div>
              <div className="row mx-2">
                <div className="col-6 align-middle">
                  <select
                    className="form-select form-select-lg mb-3 mt-2"
                    value={salvaSetor}
                    aria-label=".form-select-lg example"
                    id="setoresSelect"
                    onChange={(e) => {
                      getVagas(e.target.value, 'reset');
                    }}
                  >
                    {resposta2.map((link, index) => (
                      <option value={link.setores} key={index}>
                        Setor: {link.setores}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6 input-group w-50 h-25 mt-3">
                  <span
                    className="input-group-text bg-blue-50 text-white"
                    id="basic-addon1"
                  >
                    <FaSearch />
                  </span>
                  <input
                    className="form-control bg-white rounded-end border-bottom-0"
                    type="number"
                    value={vaga}
                    onChange={(e) => setVaga(e.target.value)}
                    placeholder="Número da vaga"
                    aria-describedby="basic-addon1"
                  />
                </div>
              </div>
              <div>
                <div className="row px-2 mb-1">
                  <div className="col-4 beetwen text-start">
                    {" "}
                    <small>
                      <small>Livres: {vagasLivres}</small>{" "}
                    </small>
                  </div>
                  <div className="col-4 beetwen">
                    <small>
                      <small>Ocupadas: {vagasOcupadas}</small>{" "}
                    </small>
                  </div>
                  <div className="col-4 beetwen text-end">
                    {" "}
                    <small>
                      <small>Tempo : {vagasVencidas}</small>{" "}
                    </small>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow">
                <div className="table-responsive">
                  <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th className="border-bottom" scope="col">
                          Vaga
                        </th>
                        <th className="border-bottom" scope="col">
                          Placa
                        </th>
                        <th className="border-bottom" scope="col">
                          Chegada
                        </th>
                        <th className="border-bottom" scope="col">
                          Tempo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {resposta.length !== 0 ? (
                        resposta.map((vaga, index) => (
                        vaga !== null && (
                          <VagaMonitor vaga={vaga} index={index} key={index} setMensagem={setMensagem} setEstado={setEstado} setResposta={setResposta} resposta={resposta} funcAttResposta={funcAttResposta} setor={salvaSetor} />
                        )
                      ))) : ( null )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className="alert alert-danger"
                id="sim"
                role="alert"
                style={{ display: estado ? "block" : "none" }}
              >
                {mensagem}
              </div>
            </div>
          </div>
          <VoltarComponente />
        </div>
      </div>
      <ScrollTopArrow />
    </div>
  );
};

export default ListarVagasMonitor;
