import axios from 'axios';
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
    const [radioTipo, setRadioTipo] = useState('');
    const [tiposNot, setTiposNot] = useState([]);
    const [valueMotivo, setValueMotivo] = useState('');

    const FormatDate =  (date) => {
      const data = new Date(date);
      const year = data.getFullYear();
      const month = String(data.getMonth() + 1).padStart(2, '0');
      const day = String(data.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
  
      return formattedDate;
    }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    if (nome === 'HistoricoCaixa') {
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Nome', label: 'Nome' },
        { value: 'Periodo', label: 'Período' }
      ]);
    }
    
    else if (nome === 'ListarNotificacoesAdmin') {
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });
      requisicao.get('/notificacao/tipos').then(
        response => {
            const newData = response?.data?.data?.map(item => ({
                label: item.nome,
                value: item.id_tipo_notificacao
              }));
            setTiposNot(newData);
        });
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Placa', label: 'Placa' },
        { value: 'Vaga', label: 'Vaga' },
        { value: 'Tipo', label: 'Tipo' },
        { value: 'Periodo', label: 'Período' },
        { value: 'Motivo', label: 'Motivo' }
      ]);
    }

    else if (nome === 'ListarNotificacoesAgente') {
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });
      requisicao.get('/notificacao/tipos').then(
        response => {
            const newData = response?.data?.data?.map(item => ({
                label: item.nome,
                value: item.id_tipo_notificacao
              }));
            setTiposNot(newData);
        });
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Placa', label: 'Placa' },
        { value: 'Vaga', label: 'Vaga' },
        { value: 'Periodo', label: 'Período' },
        { value: 'Motivo', label: 'Motivo' },
        { value: 'Todos', label: 'Todos' }
      ]);
    }

    else if(nome === 'ListarNotificacoes'){
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const user2 = JSON.parse(user);
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });
      requisicao.get('/notificacao/tipos').then(
        response => {
            const newData = response?.data?.data?.map(item => ({
                label: item.nome,
                value: item.id_tipo_notificacao
              }));
            setTiposNot(newData);
        });
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Placa', label: 'Placa' },
        { value: 'Vaga', label: 'Vaga' },
        { value: 'Periodo', label: 'Período' },
        { value: 'Motivo', label: 'Motivo' },
        { value: 'Tipo', label: 'Tipo' }
      ]);
    }

    else if(nome === 'Irregularidades'){
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });
      requisicao.get('/notificacao/tipos').then(
        response => {
            const newData = response?.data?.data?.map(item => ({
                label: item.nome,
                value: item.id_tipo_notificacao
              }));
            setTiposNot(newData);
        });
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Placa', label: 'Placa' },
        { value: 'Vaga', label: 'Vaga' },
        { value: 'Periodo', label: 'Período' },
        { value: 'Motivo', label: 'Motivo' },
        { value: 'Tipo', label: 'Tipo' }
      ]);
    }

    else if (nome === 'HistoricoVeiculo') {
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Placa', label: 'Placa' },
        { value: 'Vaga', label: 'Vaga' },
        { value: 'Periodo', label: 'Período' },
        { value: 'Estado', label: 'Estado' }
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
    else if(selectedOption.value === 'Motivo'){
      setCardBody('card-body4 d-flex flex-column text-black');
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
        consulta = `{"where": [{ "field": "placa", "operator": "=", "value": "${inputPlaca}" }]}`;
        break;
      case 'Vaga':
        consulta = `{"where": [{ "field": "vaga", "operator": "=", "value": "${inputVaga}" }]}`;
        break;
      case 'Tipo':
        consulta = `{"where": [{ "field": "tipo", "operator": "LIKE", "value": "${radioTipo}" }]}`;
        break;
      case 'Motivo':
        consulta = `{"where": [{ "field": "tipo_notificacao", "operator": "LIKE", "value": "%${valueMotivo}%" }]}`;
        break;
      case 'Todos':
        consulta = `{"where": [{ "field": "todos", "operator": "=", "value": "all" }]}`;
        break;
      case 'Estado':
        consulta = `{"where": [{ "field": "tipo", "operator": "=", "value": "${radioTipo}" }]}`;
        break;
      default:
        break;
    }
    onConsultaSelected(
      consulta
    );
    if (nome === 'HistoricoVeiculo') {
    setEstadoLoading(true);
    setTimeout(() => {
      setEstadoLoading(false);
      onClose();
      close();
    }, 8000);

  }
  else {
    setEstadoLoading(true);
    setTimeout(() => {
      setEstadoLoading(false);
      onClose();
      close();
    }, 2000);
  }

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
              <Input icon={<IconParking size={16}/>} placeholder="Digite a placa" maxLength={15} onChange={(e) => setInputPlaca(e.target.value)}/>
              </div>
            ) :
            selectedOption.value === 'Vaga' ? (
              <div>
              <div className="mt-4 mb-1">
                Digite a vaga:
              </div>
              <Input icon={<IconParking size={16}/>} type="number" placeholder="Digite a vaga" maxLength={5} onChange={(e) => setInputVaga(e.target.value)}/>
              </div>
            ) :
            selectedOption.value === 'Tipo' ? (
              <div>
              <div className="mt-4 mb-3">
                Selecione o tipo:
              </div>
              <Radio.Group name="Escolha algum opção" onChange={(e) => setRadioTipo(e)}>
                  <Grid>
                  <Grid.Col span={12}>
                  <Radio value='PAGO' label="Pago" />
                  </Grid.Col>
                  <Grid.Col span={12}>
                  <Radio value='PENDENTE' label="Pendente" />
                  </Grid.Col>
                  </Grid>
              </Radio.Group>
              </div>
            ) :
            selectedOption.value === 'Estado' ? (
                <div>
                <div className="mt-4 mb-3">
                  Selecione o estado:
                </div>
                <Radio.Group name="Escolha algum opção" onChange={(e) => setRadioTipo(e)}>
                    <Grid>
                    <Grid.Col span={12}>
                    <Radio value="'S'" label="Notificado" />
                    </Grid.Col>
                    <Grid.Col span={12}>
                    <Radio value="'N'" label="Regular" />
                    </Grid.Col>
                    </Grid>
                </Radio.Group>
                </div>
              ) :
            selectedOption.value === 'Motivo' ? (
              <div>
              <div className="mt-4 mb-3">
                Selecione o motivo:
              </div>
              <Select
                placeholder="Escolha o motivo"
                options={tiposNot}
                onChange={(e) => setValueMotivo(e.label)}
              />
              </div>
            ) :
            selectedOption.value === 'Todos' ? (
              <div>
                Clique em salvar para listar todas as notificações.
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