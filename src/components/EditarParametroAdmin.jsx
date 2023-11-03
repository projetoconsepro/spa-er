import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import {
  IconPrinter,
  IconParking,
  IconEdit,
  IconCalendar,
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
  Text,
  rem
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import createAPI from "../services/createAPI";

const EditarParametroAdmin = () => {
  const [data, setData] = useState([]);
  const [dataAPI, setDataAPI] = useState([]);
  const [enabledInputs, setEnabledInputs] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [timePickerIndex, setTimePickerIndex] = useState(null);
  const manhaHoraInicioRef = useRef(null);
  const manhaHoraFimRef = useRef(null);
  const tardeHoraInicioRef = useRef(null);
  const tardeHoraFimRef = useRef(null);
  const [updated, setUpdated] = useState(false);

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

  const handleSaveChanges = () => {
  }

  const showTimePicker = (index) => {
    setTimePickerVisible(true);
    setTimePickerIndex(index);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
    setTimePickerIndex(null);
  };

  const handleSaveTimeChanges = (item, periodo) => {
    let id_turno;
    if (periodo === 'manha') {
      id_turno = item.manha.id_turno;
    } else {
      id_turno = item.tarde.id_turno;
    }
    const manhaHoraInicio = manhaHoraInicioRef.current.value;
    const manhaHoraFim = manhaHoraFimRef.current.value;
    const tardeHoraInicio = tardeHoraInicioRef.current.value;
    const tardeHoraFim = tardeHoraFimRef.current.value;
    
    const requisicao = createAPI();
    requisicao
      .put("/turno/turnoFuncionamento", {
        id_turno,
        hora_inicio: periodo === 'manha' ? manhaHoraInicio : tardeHoraInicio,
        hora_fim: periodo === 'manha' ? manhaHoraFim : tardeHoraFim,
      })
      .then((response) => {
        setUpdated(!updated);
      })
      .catch((error) => {
        console.log(error);
      });

    setIsModified(true);
    hideTimePicker();
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

          const groupedData = {};

          rawData.forEach((item) => {
            const dia = item.dia;
            const turnoData = {
              hora_inicio: item.hora_inicio,
              hora_fim: item.hora_fim,
              id_turno: item.id_turno_funcionamento,
            };

            if (!groupedData[dia]) {
              groupedData[dia] = {
                manha: turnoData,
              };
            } else {
              groupedData[dia].tarde = turnoData;
            }
          });

          const newData = Object.keys(groupedData).map((dia) => ({
            dia,
            ...groupedData[dia],
          }));
          setDataAPI(newData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updated]);

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
            Parâmetros turno
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion>
              {dataAPI.map((item, index) => (
                <Accordion.Item key={index} value={item.dia}>
                  <Accordion.Control
                    icon={<IconCalendar size={rem(20)} color="#845EF7" />}
                  >
                    {item.dia}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <div className="input-wrapper text-start mt-3">
                      <label className="mx-2">Manhã:</label>
                      <Grid>
                        <Grid.Col span={10}>
                          <Input
                            readOnly
                            value={item.manha?.hora_inicio || ""}
                            placeholder={
                              item.manha?.hora_inicio === "09:00:00"
                                ? "0"
                                : null
                            }
                          />
                        </Grid.Col>
                        <Grid.Col span={10}>
                          <Input
                            readOnly
                            value={item.manha?.hora_fim || ""}
                            placeholder={
                              item.manha?.hora_fim === "12:00:00" ? "0" : null
                            }
                          />
                        </Grid.Col>
                        <Grid.Col span={1}>
                          <ActionIcon>
                            <IconEdit
                              className="mt-1"
                              size="1.3rem"
                              color="#228BE6"
                              onClick={() => showTimePicker(index)}
                            />
                          </ActionIcon>
                        </Grid.Col>
                      </Grid>
                    </div>
                    {timePickerIndex === index && isTimePickerVisible && (
                      <div className="mt-3">
                        <TimeInput
                          className="mb-3"
                          ref={manhaHoraInicioRef}
                        />
                        <TimeInput
                          className="mb-3"
                          ref={manhaHoraFimRef}
                        />
                        <Button className="mx-2" onClick={hideTimePicker}>Fechar</Button>
                        <Button onClick={() => handleSaveTimeChanges(item, 'manha')}>Salvar</Button>
                      </div>
                    )}

                    <div className="input-wrapper text-start mt-3">
                      <label className="mx-2">Tarde:</label>
                      <Grid>
                        <Grid.Col span={10}>
                          <Input
                            readOnly
                            value={item.tarde?.hora_inicio || ""}
                            placeholder={
                              item.tarde?.hora_inicio === "13:00:00" ? "0" : null
                            }
                          />
                        </Grid.Col>
                        <Grid.Col span={10}>
                          <Input
                            readOnly
                            value={item.tarde?.hora_fim || ""}
                            placeholder={
                              item.tarde?.hora_fim === "18:00:00" ? "0" : null
                            }
                          />
                        </Grid.Col>
                        <Grid.Col span={1}>
                          <ActionIcon>
                            <IconEdit
                              className="mt-1"
                              size="1.3rem"
                              color="#228BE6"
                              onClick={() => showTimePicker(index)}
                            />
                          </ActionIcon>
                        </Grid.Col>
                      </Grid>
                    </div>
                    {timePickerIndex === index && isTimePickerVisible && (
                      <div className="mt-3">
                        <TimeInput
                          className="mb-3"
                          ref={tardeHoraInicioRef}
                        />
                        <TimeInput
                          className="mb-3"
                          ref={tardeHoraFimRef}
                        />
                        <Button className="mx-2" onClick={hideTimePicker}>Fechar</Button>
                        <Button onClick={() => handleSaveTimeChanges(item, 'tarde')}>Salvar</Button>
                      </div>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default EditarParametroAdmin;
