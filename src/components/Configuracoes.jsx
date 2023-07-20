import axios from "axios";
import { React, useState, useEffect, useRef } from "react";
import { FaCarAlt, FaParking } from "react-icons/fa";
import { TbHandClick } from "react-icons/tb";
import { BsFillTrashFill } from "react-icons/bs";
import Swal from "sweetalert2";
import VoltarComponente from "../util/VoltarComponente";
import { useDisclosure } from "@mantine/hooks";
import { Button, Grid, Modal, Text } from "@mantine/core";
import { Carousel } from '@mantine/carousel';
import createAPI from "../services/createAPI";

const Configuracoes = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [cardBody] = useState("card-body3");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const [currentSlide, setCurrentSlide] = useState(0);
  const user2 = JSON.parse(user);

  const handleCheckboxChange = (index) => {
    data[index].check = !data[index].check;
    setData([...data]);
  };

  const abrirDiv = (index) => {
    data[index].estado = !data[index].estado;
    setData([...data]);
  };

  const array = [
    {
        key: '1',
        title: "Bem vindo ao App",
        text: "O Aplicativo tem seu layout baseado no tema padrão do seu dispositivo, para que você possa ter uma melhor experiência",
    },
    {
        key: '2',
        title: "O SAIPP possui uma interface que ira te auxiliar", 
        text: "Possuimos um campo aonde voce pode consultar algumas informações sobre o seu plantio \n Como por exemplo o nivel de umidade ideal para diferentes tipos de plantas",
    },
    {
        key: '3',
        title: "Para te auxiliar ainda mais possuimos um campo de previsão do tempo",
        text: "Onde mesmo a distancia voce pode saber como esta o clima na região onde seu sistema esta instalado",
    },
    {
        key: '4',
        title: "Para um maior controle sobre seu sistema de irrigação",
        text: "Proporcionamos um campo onde voce pode controlar o nivel de umidade da sua plantação mesmo a distancia \n Por padrao o sistema inicia-se com o minimo de 0 % e o maximo de 100%.",
    }
];

  const Atualizarequisicao = async () => {
    const requisicao = createAPI();

    requisicao
      .get("/veiculo")
      .then((response) => {
        const newData = response.data.data.map((item) => ({
          placa: item.usuario,
          id_veiculo: item.id_veiculo,
          debito: item.debito_automatico,
          debitoDisponivel: item.disponivel_debito_automatico,
          estado: false,
          estadoOn: false,
          check: false,
          idVeiculo: item.id_veiculo,
        }));
        for (let index = 0; index < newData.length; index++) {
          if (newData[index].debito == "S") {
            newData[index].check = true;
          } else {
            newData[index].check = false;
          }
        }
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    Atualizarequisicao();
  }, []);

  const salvarAlteracoes = (index) => {
    const requisicao = createAPI();
    const idVeiculo = data[index].idVeiculo;
    requisicao
      .put("/veiculo", {
        idVeiculo: idVeiculo,
        debitoAutomatico: data[index].check ? "S" : "N",
      })
      .then((response) => {
        if (response.data.msg.resultado) {
          Swal.fire(
            "Confirmado!",
            "O débito automático foi alterado com sucesso!",
            "success"
          );
          data[index].estadoOn = !data[index].estadoOn;
          setData([...data]);
          Atualizarequisicao();
        } else {
          setEstado(true);
          setMensagem(response.data.msg.msg);
          setTimeout(() => {
            setEstado(false);
            setMensagem("");
          }, 5000);
        }
      })
      .catch((error) => {
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

  const removerVeiculo = (idVeiculo) => {
    Swal.fire({
      title: "Deseja realmente remover este veículo?",
      showCancelButton: true,
      confirmButtonText: `Sim`,
      cancelButtonText: `Não`,
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        const requisicao = createAPI();
        requisicao
          .put(`/veiculo/remover`, {
            id_veiculo: idVeiculo,
          })
          .then((response) => {
            if (response.data.msg.resultado === true) {
              Atualizarequisicao();
              Swal.fire({
                title: response.data.msg.msg,
                icon: "success",
                timer: 2000,
              });
            } else {
              Swal.fire({
                title: response.data.msg.msg,
                icon: "error",
                timer: 2000,
              });
            }
          });
      }
    });
  };

  const mudaEstado = (index) => {
    data[index].estadoOn = !data[index].estadoOn;
    setData([...data]);
  };

  const handleNextSlide = () => {
    if (currentSlide < array.length - 1) {
      setCurrentSlide((prevSlide) => prevSlide + 1);
    }
  };

  return (
    <div className="col-12 px-3 mb-3">
      <p className="text-start fs-5 fw-bold">
        <VoltarComponente arrow={true} /> Débito automático
      </p>
      <button onClick={()=>open()}>
        oi
      </button>
      {data.map((link, index) => (
        <div
          className="card border-0 shadow mt-5 mb-5"
          key={index}
          id="divD"
          disabled={
            (link.debitoDisponivel === "N" && link.debito === "N") ||
            (link.debitoDisponivel === "N" && link.debito !== "S")
              ? true
              : false
          }
        >
          <div
            className={cardBody}
            onClick={() => {
              abrirDiv(index);
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="h2 mb-0 d-flex align-items-center">
                  {link.placa}
                </div>
                <div className="h6 mt-1 d-flex align-items-center fs-6 text-start">
                  <h6 className="fs-6">
                    <TbHandClick />{" "}
                    <small>Abrir configurações do veículo:</small>
                  </h6>
                </div>
              </div>
              <div>
                <div className="d-flex align-items-center fw-bold">
                  <FaCarAlt size={40} />
                </div>
              </div>
            </div>
          </div>
          {data[index].estado ? (
            <div
              className="card-body5 pt-0"
              onChange={() => {
                mudaEstado(index);
              }}
            >
              {data[index].estado ? <div id="bordaBaixo"></div> : null}
              <div className="form-check2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="exampleCheckbox"
                  value="option1"
                  checked={data[index].check}
                  onChange={() => {
                    handleCheckboxChange(index);
                  }}
                />
                <label className="form-check-label">
                  ‎ ‎ Débito automático
                </label>
              </div>
              {data[index].estadoOn === true ? (
                <div className="row mt-3">
                  <div className="col-2"></div>
                  <div className="col-8">
                    <button
                      type="button"
                      className="btn3 botao"
                      onClick={() => {
                        salvarAlteracoes(index);
                      }}
                    >
                      Salvar
                    </button>
                  </div>
                  <div className="col-2">
                    <BsFillTrashFill
                      size={25}
                      color="red"
                      onClick={() => {
                        removerVeiculo(link.id_veiculo);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="row mt-3">
                  <div className="col-2"></div>
                  <div className="col-8"></div>
                  <div className="col-2">
                    <BsFillTrashFill
                      size={25}
                      color="red"
                      onClick={() => {
                        removerVeiculo(link.id_veiculo);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : null}
          <h6
            style={{
              display:
                (link.debitoDisponivel === "N" && link.debito === "N") ||
                (link.debitoDisponivel === "N" && link.debito !== "S")
                  ? "block"
                  : "none",
            }}
            className="px-4 fs-6"
          >
            <small>
              Este veículo já possui débito automático ativo em outro
              dispositivo.
            </small>
          </h6>
        </div>
      ))}
      <VoltarComponente />
    <Modal opened={opened} onClose={() => { close() }} centered size="lg" title="Tutorial débito automático">
      <Carousel height={200} align="center" slidesToScroll={1} index={currentSlide} maw={320} mx="auto">
        {array.map((item, index) => (
          <Carousel.Slide key={index}>
            <Grid
              style={{ height: 200 }}
              justify="center"
              align="center"
            >
              <Grid.Col span={12} style={{ textAlign: "center" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: 700 }}
                  align="center"
                  color="gray"
                >
                  {item.title}
                </Text>
                <Text
                  style={{ fontSize: 15, fontWeight: 400 }}
                  align="center"
                  color="gray"
                >
                  {item.text}
                </Text>
              </Grid.Col>
            </Grid>
          </Carousel.Slide>
        ))}
      </Carousel>
      <button onClick={handleNextSlide} disabled={currentSlide === array.length - 1}>
        NEXT
      </button>
    </Modal>
    </div>
  );
};

export default Configuracoes;
