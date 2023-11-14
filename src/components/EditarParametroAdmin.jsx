import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2"; // Importe o SweetAlert
import {
  IconParking,
  IconEdit,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Input,
  Select,
  Text,
  rem,
} from "@mantine/core";
import createAPI from "../services/createAPI";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const EditarParametroAdmin = () => {
  const [data, setData] = useState([]);
  const [dataAPI, setDataAPI] = useState([]);
  const [dataIntervalo, setDataIntervalo] = useState([]);
  const [enabledInputs, setEnabledInputs] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [updated, setUpdated] = useState(false);
  const [enabledInputs2, setEnabledInputs2] = useState({});
  const [inputValues2, setInputValues2] = useState({});
  const [enabledInputs3, setEnabledInputs3] = useState({});
  const [inputValues3, setInputValues3] = useState({});

  const handleToggleInput3 = (index) => {
    setEnabledInputs3((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleAddNewInterval = async () => {
    const diasSemana = dataAPI.map((dia) => dia.dia);
    const hourOptions = generateHourOptions();

    const { value: selectedValues } = await Swal.fire({
        title: "Adicionar Novo Intervalo",
        html: `
            <div style="display: flex; flex-wrap: wrap;">
                ${diasSemana
                    .map(
                        (dia) => `
                            <div style="margin-right: 15px;">
                                <input type="checkbox" id="dia-${dia}" class="swal2-control-input">
                                <label for="dia-${dia}" class="swal2-checkbox-label">${dia}</label>
                            </div>
                        `
                    )
                    .join("")}
            </div>
            <div style="margin-top: 10px;">
                <label for="hora-inicio">Hora de Início:</label>
                <input type="text" id="hora-inicio" class="flatpickr swal2-input" data-enable-time="true" data-no-calendar="true" data-time_24hr="true">
            </div>
            <div style="margin-top: 10px;">
                <label for="hora-fim">Hora de Fim:</label>
                <input type="text" id="hora-fim" class="flatpickr swal2-input" data-enable-time="true" data-no-calendar="true" data-time_24hr="true">
            </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            const selectedDays = diasSemana.filter(
                (dia) => document.getElementById(`dia-${dia}`).checked
            );

            const selectedHoraInicio = document.getElementById("hora-inicio").value;
            const selectedHoraFim = document.getElementById("hora-fim").value;

            return {
                selectedDays,
                horaInicio: selectedHoraInicio,
                horaFim: selectedHoraFim,
            };
        },
        showCancelButton: true,
        confirmButtonText: "Adicionar",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        didOpen: () => {
            flatpickr('.flatpickr', {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
            });
        },
    });

    if (
        selectedValues &&
        selectedValues.selectedDays.length > 0 &&
        selectedValues.horaInicio &&
        selectedValues.horaFim
    ) {
        const { selectedDays, horaInicio, horaFim } = selectedValues;

        const selectedTurnos = dataAPI.filter((dia) =>
            selectedDays.includes(dia.dia)
        );

        const idTurnos = [...new Set(selectedTurnos.map((turno) => turno.id_turno))];

        const requisicao = createAPI();
        requisicao
            .post("/turno/intervalos", {
                id_turno: idTurnos,
                hora_inicio: horaInicio,
                hora_fim: horaFim,
            })
            .then((response) => {
                console.log(response);
                if (response.data.msg.resultado) {
                    setUpdated(!updated);
                    Swal.fire({
                        icon: "success",
                        title: "Intervalo(s) adicionado(s) com sucesso!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    Swal.fire(response.data.msg.msg, "", "error");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
};




  const handleDeletePeriod = (item, periodo) => {
    console.log(item);
    Swal.fire({
      title: `Confirmar exclusão do período de ${item.dia}`,
      text: `Tem certeza de que deseja excluir?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        const requisicao = createAPI();
        requisicao
          .delete("/turno/turnoFuncionamento", {
            data: {
              id_turno: item.id_turno,
            },
          })
          .then((response) => {
            console.log(response.data);
            if (response.data.msg.resultado) {
              setUpdated(!updated);
            } else {
              Swal.fire("Erro ao excluir período!", "", "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        Swal.fire("Período excluído!", "", "success");
      }
    });
  };

  const handleDeleteInterval = (item, periodo) => {
    console.log(item);
    Swal.fire({
      title: `Confirmar exclusão desse intervalo`,
      text: `Tem certeza de que deseja excluir?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        const requisicao = createAPI();
        requisicao
          .delete("/turno/intervalos", {
            data: {
              id_intervalo: item.id_intervalo,
            },
          })
          .then((response) => {
            console.log(response.data);
            if (response.data.msg.resultado) {
              setUpdated(!updated);
            } else {
              Swal.fire("Erro ao excluir período!", "", "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        Swal.fire("Período excluído!", "", "success");
      }
    });
  };

  const handleToggleInput = (chave) => {
    setEnabledInputs((prevState) => ({
      ...prevState,
      [chave]: !prevState[chave],
    }));
  };

  const handleInputChange = (chave, valor) => {
    setInputValues((prevState) => ({
      ...prevState,
      [chave]: valor,
    }));

    setIsModified(true);
  };

  useEffect(() => {
    const parametros = axios.create({
      baseURL: process.env.REACT_APP_HOST,
    });
    parametros.get("/parametros").then((response) => {
      setData(response.data.data.param);
    });
  }, []);

  useEffect(() => {
    if (data.estacionamento) {
      setInputValues(data.estacionamento);
      setInitialValues(data.estacionamento);
    }
  }, [data.estacionamento]);

  useEffect(() => {
    const isAnyInputModified = Object.keys(inputValues).some(
      (key) => inputValues[key] !== data.estacionamento[key]
    );

    setIsModified(isAnyInputModified);
  }, [inputValues, data.estacionamento]);

  useEffect(() => {
    const requisicao = createAPI();
    requisicao
      .get("/turno/turnoFuncionamento")
      .then((response) => {
        if (response.data.msg.resultado) {
          const rawData = response.data.data;

          const newData = rawData.map((item) => ({
            dia: item.dia,
            id_dia: item.id_dia,
            abertura: item.turno_inicio,
            fechamento: item.turno_fim,
            id_turno: item.id_turno,
          }));

          setDataAPI(newData);
          setInputValues2(newData);
          console.log(newData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updated]);

  useEffect(() => {
    const requisicao = createAPI();
    requisicao
      .get("/turno/intervalos")
      .then((response) => {
        console.log(response.data)
        if (response.data.msg.resultado) {
          const rawData = response.data.data;

          const newData = rawData.map((item) => ({
            dia: item.dia,
            horario_inicio: item.horario_inicio,
            horario_fim: item.horario_fim,
            id_intervalo: item.id_intervalo,
            turno_id_turno: item.turno_id_turno,
          }));

          setDataIntervalo(newData);
          setInputValues3(newData);
        } else {
          setDataIntervalo([]);
          setInputValues3([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updated]);

  const handleToggleInput2 = (index) => {
    setEnabledInputs2((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleInputChange2 = (index, chave, valor) => {
    setInputValues2((prevState) => ({
      ...prevState,
      [index]: {
        ...prevState[index],
        [chave]: valor,
      },
    }));
  };

  const handleSaveChanges = () => {
    const requisicao = createAPI();
    const requestBody = {
      estacionamento: inputValues,
      turno: inputValues2,
      usuario: data.usuario,
    };
    requisicao
      .put("/parametros", requestBody)
      .then((response) => {
        setEnabledInputs(false);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsModified(false);
  };

  const handleSaveChanges2 = (index) => {
    const id_turno = dataAPI[index]?.id_turno;
    if (!id_turno) {
      console.error("Id_turno não encontrado para o índice", index);
      return;
    }
    const editedValues = inputValues2[index];
    console.log("Id_turno:", id_turno);
    console.log("Edited Values:", editedValues);

    const requisicao = createAPI();
    requisicao
      .put("/turno/turnoFuncionamento", {
        id_turno,
        id_dia: editedValues.id_dia,
        hora_inicio: editedValues.abertura,
        hora_fim: editedValues.fechamento,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.msg.resultado) {
          setEnabledInputs2((prevState) => ({
            ...prevState,
            [index]: false,
          }));
        } else {
          Swal.fire("Erro ao salvar alterações!", "", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handleAddNewPeriod = () => {
    const diasDaSemana = [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo",
    ];

    Swal.fire({
        title: "Adicionar novo período",
        html: `
            <div style="display: flex; flex-wrap: wrap;">
                ${diasDaSemana
                    .map(
                        (dia) => `
                            <div style="margin-right: 15px;">
                                <input type="checkbox" id="dia-${dia}" class="swal2-control-input">
                                <label for="dia-${dia}" class="swal2-checkbox-label">${dia}</label>
                            </div>
                        `
                    )
                    .join("")}
            </div>
            <div style="margin-top: 15px;">
                <label for="abertura">Hora de Abertura:</label>
                <input type="text" id="abertura" class="flatpickr swal2-input m-0" data-enable-time="true" data-no-calendar="true" data-time_24hr="true">
            </div>
            <div style="margin-top: 30px;">
                <label for="fechamento">Hora de Fechamento:</label>
                <input type="text" id="fechamento" class="flatpickr swal2-input m-0" data-enable-time="true" data-no-calendar="true" data-time_24hr="true">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Sim, adicionar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "green",
        didOpen: () => {
            flatpickr('.flatpickr', {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
            });
        },
    }).then((result) => {
      if (result.isConfirmed) {
        const diasSelecionados = diasDaSemana.map((dia, index) => ({
        dia: dia,
        value: index + 1,
        checked: document.getElementById(`dia-${dia}`).checked
        })).filter((item) => item.checked).map((item) => item.value);
        const aberturaSelecionada = document.getElementById("abertura").value;
        const fechamentoSelecionado = document.getElementById("fechamento").value;

        const formatHora = (hora) => hora < 10 ? `0${hora}:00:00` : `${hora}:00:00`;
        
        const requisicao = createAPI();
        requisicao
          .post("/turno/turnoFuncionamento", {
            dia: diasSelecionados,
            hora_inicio: formatHora(aberturaSelecionada),
            hora_fim: formatHora(fechamentoSelecionado),
          })
          .then((response) => {
            console.log(response.data);
            if (response.data.msg.resultado) {
              setUpdated(!updated);
              Swal.fire({
                icon: "success",
                title: "Período adicionado com sucesso!",
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              Swal.fire("Erro ao adicionar novo período!", "", "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        
  
      }
    });
  };
  
  
  const generateHourOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}` : `${i}`;
      options.push(`${hour}:00:00`);
    }
    return options;
  };

  return (
    <div className="bg-white rounded">
      <Card padding="lg">
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Olá, Admin!</Text>
          <Badge color="red.6" variant="light">
            Admin
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
          Aqui você pode alterar os parâmetros do sistema.
        </Text>
      </Card>
      <Accordion
        styles={{
          item: {
            backgroundColor: "#fff",
            border: `${rem(1)} solid white`,

            "&[data-active]": {
              backgroundColor: "#fff",
            },
          },
        }}
      >
        <Accordion.Item value="estacionamento">
          <Accordion.Control icon={<IconParking size={rem(20)} color="blue" />}>
            Parâmetros estacionamento
          </Accordion.Control>
          <Accordion.Panel>
            {data.estacionamento &&
              Object.keys(data.estacionamento).map((chave) => (
                <div key={chave} className="input-wrapper text-start mt-3">
                  <label className="mx-2">{chave}:</label>
                  <Grid>
                    <Grid.Col span={10}>
                      <Input
                        value={inputValues[chave] || ""}
                        disabled={!enabledInputs[chave]}
                        placeholder={initialValues[chave] === 0 ? "0" : null}
                        onChange={(e) =>
                          handleInputChange(chave, e.target.value)
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={1}>
                      <ActionIcon>
                        <IconEdit
                          className="mt-1"
                          size="1.3rem"
                          color="#228BE6"
                          onClick={() => handleToggleInput(chave)}
                        />
                      </ActionIcon>
                    </Grid.Col>
                  </Grid>
                </div>
              ))}
            {isModified && (
              <div className="mt-3">
                <Grid>
                  <Grid.Col span={10}>
                    <Button onClick={() => handleSaveChanges()}>Salvar</Button>
                  </Grid.Col>
                </Grid>
              </div>
            )}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="turno">
          <Accordion.Control
            icon={<IconCalendar size={rem(20)} color="#845EF7" />}
          >
            Parâmetros Turno
          </Accordion.Control>
          <Accordion.Panel>
            <div className="input-wrapper text-start mt-3">
              {dataAPI.map((item, index) => (
                <div key={index} className="mb-3">
                  <Text size="lg" weight={700} className="mr-2">
                    {item.dia}:
                  </Text>
                  <Grid>
                    <Grid.Col span={4}>
                      <label className="mx-2">Abertura</label>
                      {enabledInputs2[index] ? (
                        <Select
                          data={generateHourOptions()}
                          searchable
                          placeholder="Selecione..."
                          value={inputValues2[index]?.abertura}
                          onChange={(value) =>
                            handleInputChange2(index, "abertura", value)
                          }
                        />
                      ) : (
                        <Select
                          data={[inputValues2[index]?.abertura]}
                          disabled
                          value={inputValues2[index]?.abertura}
                        />
                      )}
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <label className="mx-2">Fechamento</label>
                      {enabledInputs2[index] ? (
                        <Select
                          data={generateHourOptions()}
                          searchable
                          placeholder="Selecione..."
                          value={inputValues2[index]?.fechamento}
                          onChange={(value) =>
                            handleInputChange2(index, "fechamento", value)
                          }
                        />
                      ) : (
                        <Select
                          data={[inputValues2[index]?.fechamento]}
                          disabled
                          value={inputValues2[index]?.fechamento}
                        />
                      )}
                    </Grid.Col>
                    <Grid.Col span={4} className="d-flex align-items-center">
                      {enabledInputs2[index] ? (
                        <>
                          <Button
                            onClick={() => handleSaveChanges2(index)}
                            style={{ marginTop: "30px", marginRight: "5px" }}
                            color="blue"
                          >
                            Salvar
                          </Button>
                          <Button
                            onClick={() => handleDeletePeriod(item)}
                            style={{ marginTop: "30px" }}
                            color="red"
                          >
                            Excluir
                          </Button>
                        </>
                      ) : (
                        <IconEdit
                          size="1.3rem"
                          color="#228BE6"
                          onClick={() => handleToggleInput2(index)}
                          style={{ marginTop: "25px", marginLeft: "10px" }}
                        />
                      )}
                    </Grid.Col>
                  </Grid>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Grid>
                <Grid.Col span={10}>
                  <Button onClick={() => handleAddNewPeriod()}>
                    Adicionar Turno
                  </Button>
                </Grid.Col>
              </Grid>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="intervalo">
          <Accordion.Control
            icon={<IconClock size={rem(20)} color="#845EF7" />}
          >
            Parâmetros Intervalo
          </Accordion.Control>
          <Accordion.Panel>
            <div className="input-wrapper text-start mt-3">
              {dataIntervalo.map((item, index) => (
                <div key={index} className="mb-3">
                  <Text size="lg" weight={700} className="mr-2">
                    {item.dia}:
                  </Text>
                  <Grid>
                    <Grid.Col span={4}>
                      <label className="mx-2">Início intervalo</label>
                        <Select
                          data={[inputValues3[index]?.horario_inicio]}
                          disabled
                          value={inputValues3[index]?.horario_inicio}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <label className="mx-2">Término intervalo</label>
                        <Select
                          data={[inputValues3[index]?.horario_fim]}
                          disabled
                          value={inputValues3[index]?.horario_fim}
                        />
                    </Grid.Col>
                    <Grid.Col span={4} className="d-flex align-items-center">
                      {enabledInputs3[index] ? (
                        <>
                          <Button
                            onClick={() => handleDeleteInterval(item)}
                            style={{ marginTop: "30px" }}
                            color="red"
                          >
                            Excluir
                          </Button>
                        </>
                      ) : (
                        <IconEdit
                          size="1.3rem"
                          color="#228BE6"
                          onClick={() => handleToggleInput3(index)}
                          style={{ marginTop: "25px", marginLeft: "10px" }}
                        />
                      )}
                    </Grid.Col>
                  </Grid>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Grid>
                <Grid.Col span={10}>
                  <Button onClick={() => handleAddNewInterval()}>
                    Adicionar Intervalo
                  </Button>
                </Grid.Col>
              </Grid>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default EditarParametroAdmin;
