import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Group, Button, Alert } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import Select from "react-select";
import 'dayjs/locale/pt-br';
import { IconAlertCircle } from '@tabler/icons-react';
import moment from 'moment';

const AtualizarPix = ({ nome, onConsultaSelected, onLoading }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [cardBody, setCardBody] = useState('');
  const [estado] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(new Date());
  const [State, setState] = useState(false);
  const [valuePeriodo, setValuePeriodo] = useState([null, null]);
  const [estadoLoading, setEstadoLoading] = useState(onLoading);
  const [dataHora, setDataHora] = useState("09:00");
  const [dataHora2, setDataHora2] = useState("18:00");

  const FormatDate = (date) => {
    const data = new Date(date);
    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const day = String(data.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  function calculateFinalDate(initialDate) {
    const parsedDate = moment(initialDate);

    const lastDayOfMonth = parsedDate.clone().endOf('month');
    const nextDay = parsedDate.clone().add(1, 'day');

    if (parsedDate.isSame(lastDayOfMonth, 'day')) {
      const newDate = parsedDate.clone().add(1, 'month').startOf('month');
      return newDate.format('YYYY-MM-DD');
    } else {
      return nextDay.format('YYYY-MM-DD');
    }
  }

  useEffect(() => {
    setEstadoLoading(onLoading);
    if (onLoading === false) {
      onClose()
      close()
    }
  }, [onLoading]);

  useEffect(() => {
    setOptions([
        { value: 'DataHora', label: 'Data e hora' },
        { value: 'PeriodoHora', label: 'Periodo e hora' },
        ]);
  }, [nome]);

  useEffect(() => {
    if (selectedOption !== null) {
      if (selectedOption.value === 'DataHora' || selectedOption.value === 'PeriodoHora') {
        setCardBody('card-body8 d-flex flex-column text-black');
      }
    } else {
        setCardBody('card-body7 d-flex flex-column text-black');
      }
  }, [selectedOption]);

  const handleSelection = (selected) => {
    setSelectedOption(selected);
    if (selected) {
      setState(true);
    }
  };

  const handleSalvar = async () => {
    if (selectedOption !== null) {
      let consulta = ''
      switch (selectedOption.value) {
        case 'DataHora':
          const date = FormatDate(value);
          consulta = `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${date}%" },{ "field": "hora", "operator": "BETWEEN", "value": ["${dataHora}", "${dataHora2}"] }]}`;
          break;
        case 'PeriodoHora':
          const data3 = FormatDate(valuePeriodo[1]);
          const data4 = await calculateFinalDate(data3);
          consulta = `{"where": [{ "field": "periodo", "operator": "BETWEEN", "value": ["${FormatDate(valuePeriodo[0])}", "${data4}"] },{ "field": "hora", "operator": "BETWEEN", "value": ["${dataHora}", "${dataHora2}"] }]}`;
          break;
        default:
          break;
      }
      onConsultaSelected(consulta);
    }
  };

  const onClose = () => {
    setEstadoLoading(false);
    setValue(new Date());
    setValuePeriodo([null, null]);
    setSelectedOption(null);
    setState(false);
  }

  return (
    <>
      <Modal opened={opened} onClose={() => { onClose(); close(); }} title="Atualizar" centered>
        <div className={cardBody}>
          <Select options={options} value={selectedOption} onChange={handleSelection} isSearchable={false} placeholder="Selecione..." />
          {estado ? (
            <div className="mt-4">
              <Alert icon={<IconAlertCircle size="1rem" />} className="" title="Cuidado!" color="red" >
                Você precisa selecionar uma opção antes de atualizar.
              </Alert>
            </div>) : (null
          )}
          {
            State ? (
              <div>
                <div className="mt-4">
                </div>
                {selectedOption.value === 'PeriodoHora' ? (
                      <div>
                        <div className="mt-4 mb-1">
                          Selecione o periodo:
                          <DatePickerInput type="range" locale='pt-br' allowSingleDateInRange placeholder='Selecione o periodo' value={valuePeriodo} onChange={setValuePeriodo} />

                          <div className="mt-3 mb-1">
                            <div className='mb-3'>
                              Selecione o intervalo de tempo:
                            </div>

                            <input
                              type="time"
                              value={dataHora}
                              onChange={(e) => setDataHora(e.target.value)}
                              min="00:01"
                              max="23:59"
                              className='text-gray-700'
                            />
                            <span className="mx-2">-</span>
                            <input
                              type="time"
                              value={dataHora2}
                              onChange={(e) => setDataHora2(e.target.value)}
                              min="00:01"
                              className='text-gray-700'
                              max="23:59"
                            />
                          </div>
                        </div>
                      </div>
                    ) :
                      selectedOption.value === 'DataHora' ? (
                        <div>
                          <div className="mt-4 mb-1">
                            Selecione a data e hora:
                            <DatePickerInput
                              placeholder="Escolha a data"
                              onChange={setValue}
                              locale='pt-br'
                              maw={400}
                              mx="auto"
                            />

                            <div className="mt-3 mb-1">
                              <div className='mb-3'>
                                Selecione o intervalo de tempo:
                              </div>

                              <input
                                type="time"
                                value={dataHora}
                                onChange={(e) => setDataHora(e.target.value)}
                                min="00:01"
                                max="23:59"
                                className='text-gray-700'
                              />
                              <span className="mx-2">-</span>
                              <input
                                type="time"
                                value={dataHora2}
                                onChange={(e) => setDataHora2(e.target.value)}
                                min="00:01"
                                className='text-gray-700'
                                max="23:59"
                              />
                            </div>
                          </div>
                        </div>
                      )  :
                        (null)
                }
              </div>
            )
              :
              (null)
          }
          <div className="mt-auto">
            <Group position="center" spacing="sm" grow>
              <Button color="gray" onClick={() => { onClose(); close(); }}>
                Voltar
              </Button>
              <Button loading={estadoLoading} onClick={() => { handleSalvar() }} loaderPosition="right">
                Confirmar
              </Button>
            </Group>
          </div>
        </div>

      </Modal>

      <Group position="center">
        <Button onClick={open} className="w-100 bg-blue-50">Atualizar pix</Button>
      </Group>
    </>
  );
}

export default AtualizarPix;