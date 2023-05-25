import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Group, Button, Input, Alert, Radio, Grid } from '@mantine/core';
import { DateInput, DatePickerInput } from '@mantine/dates';
import Select from "react-select"
import 'dayjs/locale/pt-br';
import { IconAlertCircle, IconCloudCheck, IconParking, IconStatusChange, IconUser } from '@tabler/icons-react';

const Filtro = ({ nome, onConsultaSelected }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [cardBody, setCardBody] = useState('');
    const [estado, setEstado] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(new Date());
    const [State , setState] = useState(false);
    const [valuePeriodo, setValuePeriodo] = useState([null, null]);
    const [estadoLoading, setEstadoLoading] = useState(false);
    const [inputNome, setInputNome] = useState('');
    const [inputPlaca, setInputPlaca] = useState('');
    const [inputVaga, setInputVaga] = useState('');
    const [inputTipo, setInputTipo] = useState('');

    const FormatDate =  (date) => {
      const data = new Date(date);
      const year = data.getFullYear();
      const month = String(data.getMonth() + 1).padStart(2, '0');
      const day = String(data.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
  
      return formattedDate;
    }

  useEffect(() => {
    if (nome === 'HistoricoCaixa') {
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Nome', label: 'Nome' },
        { value: 'Periodo', label: 'Período' }
      ]);
    }
    
    else if (nome === 'ListarNotificacoesAdmin') {
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Placa', label: 'Placa' },
        { value: 'Vaga', label: 'Vaga' },
        { value: 'Tipo', label: 'Tipo' },
        { value: 'Periodo', label: 'Período' }
      ]);
    }
    else {
      setOptions([]);
    }
  }, [nome]);

  useEffect(() => {
    if(selectedOption !== null) {
    if(selectedOption.value === 'Data' || selectedOption.value === 'Periodo') {
      setCardBody('card-body8 d-flex flex-column text-black');
    }
    else if(selectedOption.value === 'Tipo') {
      setCardBody('card-body7 d-flex flex-column text-black');
    }
    else {
      setCardBody('card-body7 d-flex flex-column text-black');
    }
  }
  else {
    setCardBody('card-body7 d-flex flex-column text-black');
  }
  }, [selectedOption]);

  const handleSelection = (selected) => {
    setSelectedOption(selected);
    if (selected) {
      setState(true);
    }
  };
  
  const handleSalvar = () => {
    if (selectedOption !== null) {
    let consulta = ''
    switch (selectedOption.value) {
      case 'Data':
        consulta = `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${FormatDate(value)}%" }]}`;
        break;
      case 'Nome':
        consulta = `{"where": [{ "field": "nome", "operator": "LIKE", "value": "%${inputNome}%" }]}`;
        break;
      case 'Periodo':
        consulta = `{"where": [{ "field": "periodo", "operator": "BETWEEN", "value": ["${FormatDate(valuePeriodo[0])}", "${FormatDate(valuePeriodo[1])}"] }]}`;
        break;
      case 'Placa':
        consulta = `{"where": [{ "field": "placa", "operator": "LIKE", "value": "%${inputPlaca}%" }]}`;
        break;
      case 'Vaga':
        consulta = `{"where": [{ "field": "vaga", "operator": "LIKE", "value": "%${inputVaga}%" }]}`;
        break;
      case 'Tipo':
        consulta = `{"where": [{ "field": "tipo", "operator": "LIKE", "value": "%${inputTipo}%" }]}`;
        break;
      default:
        break;
    }
    onConsultaSelected(
      consulta
    );
    setEstadoLoading(true);
    setTimeout(() => {
      setEstadoLoading(false);
      onClose();
      close();
    }, 1000);
  }
  else {
    setEstado(true);
    setTimeout(() => {
    setEstado(false);
    }, 4000);
  }
  };
  

  const onClose = () => {
    setInputNome('');
    setValue(new Date());
    setValuePeriodo([null, null]);
    setSelectedOption(null);
    setState(false);
  }

    return (
      <>
        <Modal opened={opened} onClose={() => {onClose(); close();}} title="Filtrar" centered>
        <div className={cardBody}>
        <Select options={options} value={selectedOption} onChange={handleSelection} isSearchable={false} placeholder="Selecione..."/>
        {estado ? (
          <div className="mt-4">
            <Alert icon={<IconAlertCircle size="1rem" />} className="" title="Cuidado!" color="red" >
              Você precisa selecionar uma opção antes de filtrar.
            </Alert>
          </div>) : (null
          )}
        {
           State ? (
            <div>
            <div className="mt-4">
            </div>
            { selectedOption.value === 'Data' ? (
              <div>
              <div className="mt-4 mb-1">
                Selecione a data:
              </div>
              <DatePickerInput
              locale='pt-br'
              value={value}
              onChange={setValue}
              placeholder="Data"
              maw={400}
              mx="auto"
            />
            </div>
            ) :
            selectedOption.value === 'Periodo' ? (
              <div>
              <div className="mt-4 mb-1">
                Selecione o período:
              </div>
              <DatePickerInput type="range" locale='pt-br' allowSingleDateInRange value={valuePeriodo} onChange={setValuePeriodo} />
              </div>
            ) :
            selectedOption.value === 'Nome' ? (
              <div>
              <div className="mt-4 mb-1">
                Digite o nome:
              </div>
              <Input icon={<IconUser size={16}/>} placeholder="Digite o nome" onChange={(e) => setInputNome(e.target.value)}/>
              </div>
            ) :
            selectedOption.value === 'Placa' ? (
              <div>
              <div className="mt-4 mb-1">
                Digite a placa:
              </div>
              <Input icon={<IconParking size={16}/>} placeholder="Digite a placa" onChange={(e) => setInputPlaca(e.target.value)}/>
              </div>
            ) :
            selectedOption.value === 'Vaga' ? (
              <div>
              <div className="mt-4 mb-1">
                Digite a vaga:
              </div>
              <Input icon={<IconParking size={16}/>} placeholder="Digite a vaga" onChange={(e) => setInputVaga(e.target.value)}/>
              </div>
            ) :
            selectedOption.value === 'Tipo' ? (
              <div>
              <div className="mt-4 mb-3">
                Selecione o tipo:
              </div>
              <Radio.Group name="Escolha algum opção">
                  <Grid>
                  <Grid.Col span={12}>
                  <Radio value="pago" label="Pago" />
                  </Grid.Col>
                  <Grid.Col span={12}>
                  <Radio value="pendente" label="Pendente" />
                  </Grid.Col>
                  </Grid>
              </Radio.Group>
              </div>
            ) :
            ( null )
            }
            </div>
              
          )
          :
          ( null )
        }
         <div className="mt-auto">
        <Group position="center" spacing="sm" grow>
        <Button color="gray" onClick={()=>{onClose(); close();}}>
          Voltar
        </Button>
        <Button loading={estadoLoading} onClick={()=>{handleSalvar()}} loaderPosition="right">
          Salvar
        </Button>
        </Group>
        </div>
        </div>
        
        </Modal>

        <Group position="center">
          <Button onClick={open} className="w-100 bg-blue-50">Filtrar</Button>
        </Group>
      </>
    );
}

export default Filtro;