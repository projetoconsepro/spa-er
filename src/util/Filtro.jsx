import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Group, Button, Input, Alert, Radio, Grid, Badge } from '@mantine/core';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import Select from "react-select";
import 'dayjs/locale/pt-br';
import { IconAlertCircle, IconParking, IconUser } from '@tabler/icons-react';
import moment from 'moment';
import createAPI from '../services/createAPI';

const Filtro = ({ nome, onConsultaSelected, onLoading }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [cardBody, setCardBody] = useState('');
    const [estado] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(new Date());
    const [State , setState] = useState(false);
    const [valuePeriodo, setValuePeriodo] = useState([null, null]);
    const [estadoLoading, setEstadoLoading] = useState(onLoading);
    const [inputNome, setInputNome] = useState('');
    const [inputPlaca, setInputPlaca] = useState('');
    const [inputVaga, setInputVaga] = useState('');
    const [radioTipo, setRadioTipo] = useState('');
    const [radioStatus, setRadioStatus] = useState('');
    const [tiposNot, setTiposNot] = useState([]);
    const [tipoFinanceiro, setTipoFinanceiro] = useState([]);
    const [valueTipoFinanceiro, setValueTipoFinanceiro] = useState('');
    const [valueMotivo, setValueMotivo] = useState('');
    const [tipoPerfil, setTipoPerfil] = useState([]);
    const [valuePerfil, setValuePerfil] = useState('');
    const [radioDebito, setRadioDebito] = useState('');
    const [radioNotificacaoPendente, setRadioNotificacaoPendente] = useState('');
    const [placaCarro, setPlacaCarro] = useState('');
    const [dataHoje, setDataHoje] = useState("");
    const [dataHora, setDataHora] = useState("09:00");
    const [dataHora2, setDataHora2] = useState("18:00");

    const FormatDate =  (date) => {
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
      setPlacaCarro(localStorage.getItem('placaCarro'));
      const requisicao = createAPI();
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
      const requisicao = createAPI();
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
      const requisicao = createAPI();
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
      const requisicao = createAPI();
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

    else if (nome === 'HistoricoFinanceiro') {
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Periodo', label: 'Período' },
        { value: 'Tipo financeiro', label: 'Tipo financeiro' }
      ]);
      setTipoFinanceiro([
        { value: 'Transferencia de credito', label: 'Transferência de crédito' },
        { value: 'Transferencia recebida', label: 'Transferência recebida' },
        { value: 'Acrescimo de credito', label: 'Acréscimo de crédito' },
        { value: 'credito', label: 'Estacionamento' },
      ]);
    }

    else if (nome === 'HistoricoFinanceiroParceiro') {
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Periodo', label: 'Período' },
        { value: 'Tipo financeiro', label: 'Tipo financeiro' }
      ]);
      setTipoFinanceiro([
        { value: 'Acrescimo de credito', label: 'Acréscimo de crédito' },
        { value: 'credito', label: 'Estacionamento' },
      ]);
    }

    else if (nome === 'PrestacaoContas') {
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Periodo', label: 'Período' },
        { value: 'DataHora', label: 'Data e hora' },
        { value: 'PeriodoHora', label: 'Período e hora' }
      ]);
    }

    else if (nome === 'ClientesAdmin'){
      setOptions([
        { value: 'Status', label: 'Status' },
      ]);
    }

    else if (nome === 'UsuariosAdmin'){
      setOptions([
        { value: 'Perfil', label: 'Perfil' },
        { value: 'Status', label: 'Status' },
      ]);
      setTipoPerfil([
        { value: 'admin', label: 'Administrador' },
        { value: 'agente', label: 'Agente' },
        { value: 'cliente', label: 'Cliente' },
        { value: 'monitor', label: 'Monitor' },
        { value: 'parceiro', label: 'Parceiro' },
        { value: 'supervisor', label: 'Supervisor' },
      ]);
    }

    else if (nome === 'VeiculosAdmin'){
        setOptions([
          { value: 'Placa', label: 'Placa' },
          { value: 'Debito automatico', label: 'Débito automático' },
          { value: 'Notificacoes pendentes', label: 'Notificações pendentes' },
        ]);
    }

    else if (nome === 'HistoricoVeiculoAdmin'){
      setPlacaCarro(localStorage.getItem('placaCarro'));
      setOptions([
        { value: 'Data', label: 'Data' },
        { value: 'Periodo', label: 'Período' },
        { value: 'Tipo', label: 'Tipo' },
        { value: 'Vaga', label: 'Vaga' },
      ]);
    }

    else if (nome === 'OcupacaoVagasAdmin'){
      const data = new Date();
      const dia = data.getDate();
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      const ano = data.getFullYear();
      const dataHoje = ano + "-" + mes + "-" + dia;
      setDataHoje(dataHoje);

      setOptions([
        { value: 'Placa', label: 'Placa' },
        { value: 'Data', label: 'Data' },
        { value: 'Periodo', label: 'Período' },
        { value: 'Tipo', label: 'Tipo' },
        { value: 'Vaga', label: 'Vaga' },
      ]);

    }

    else {
      setOptions([]);
    }
  }, [nome]);

  useEffect(() => {
    console.log('mkdjkf', dataHora)
  }, [dataHora]);

  useEffect(() => {
    if(selectedOption !== null) {
    if(selectedOption.value === 'Data' || selectedOption.value === 'Periodo' || selectedOption.value === 'Tipo financeiro'
      || selectedOption.value === 'Perfil' || selectedOption.value === 'DataHora'  || selectedOption.value === 'PeriodoHora') {
      setCardBody('card-body8 d-flex flex-column text-black');
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
  
  const handleSalvar = async () => {
    if (selectedOption !== null) {
    let consulta = ''
    switch (selectedOption.value) {
      case 'Data':
        if (nome === 'HistoricoVeiculoAdmin' || nome === 'ListarNotificacoesAdmin'){
          consulta = `{"where": [{ "field": "placa", "operator": "=", "value": "${placaCarro}" },{ "field": "data", "operator": "LIKE", "value": "%${FormatDate(value)}%" }]}`
        } else {
        consulta = `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${FormatDate(value)}%" }]}`;
        }
        break;
      case 'DataHora':
        const date = FormatDate(value);
        consulta = `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${date}%" },{ "field": "hora", "operator": "BETWEEN", "value": ["${dataHora}", "${dataHora2}"] }]}`;
        break;
      case 'PeriodoHora':
        const data3 = FormatDate(valuePeriodo[1]);
        const data4 = await calculateFinalDate(data3);
        consulta = `{"where": [{ "field": "periodo", "operator": "BETWEEN", "value": ["${FormatDate(valuePeriodo[0])}", "${data4}"] },{ "field": "hora", "operator": "BETWEEN", "value": ["${dataHora}", "${dataHora2}"] }]}`;
        break;
      case 'Nome':
        consulta = `{"where": [{ "field": "nome", "operator": "LIKE", "value": "%${inputNome}%" }]}`;
        break;
      case 'Periodo':
        const data = FormatDate(valuePeriodo[1]);
        const data2 = await calculateFinalDate(data);
        if (nome === 'HistoricoVeiculoAdmin' || nome === 'ListarNotificacoesAdmin'){
          consulta = `{"where": [{ "field": "placa", "operator": "=", "value": "${placaCarro}" },{ "field": "periodo", "operator": "BETWEEN", "value": ["${FormatDate(valuePeriodo[0])}", "${data2}"] }]}`
        } else {
        consulta = `{"where": [{ "field": "periodo", "operator": "BETWEEN", "value": ["${FormatDate(valuePeriodo[0])}", "${data2}"] }]}`;
        }
        break;
      case 'Placa':
        const placa = inputPlaca.toUpperCase();
        const placa2 = placa.replace(/[^a-zA-Z0-9]/g, '');

        if(nome === 'OcupacaoVagasAdmin'){
          consulta = `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${dataHoje}%" },{ "field": "placa", "operator": "=", "value": "${placa2}" }]}`;
        } else {
        consulta = `{"where": [{ "field": "placa", "operator": "=", "value": "${placa2}" }]}`;
        }
        break;
      case 'Vaga':
        if (nome === 'HistoricoVeiculoAdmin' || nome === 'ListarNotificacoesAdmin'){
        consulta = `{"where": [{ "field": "placa", "operator": "=", "value": "${placaCarro}" },{ "field": "vaga", "operator": "=", "value": "${inputVaga}" }]}`
        } else if(nome === 'OcupacaoVagasAdmin'){
          consulta = `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${dataHoje}%" },{ "field": "vaga", "operator": "=", "value": "${inputVaga}" }]}`;
        }
        else {
        consulta = `{"where": [{ "field": "vaga", "operator": "=", "value": "${inputVaga}" }]}`;
        }
        break;
      case 'Tipo':
        if(nome === 'HistoricoVeiculoAdmin' || nome === 'ListarNotificacoesAdmin'){
        consulta = `{"where": [{ "field": "placa", "operator": "=", "value": "${placaCarro}" },{ "field": "tipo", "operator": "=", "value": "${radioTipo}" }]}`;
        }
        else if(nome === 'OcupacaoVagasAdmin'){
        consulta = `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${dataHoje}%" },{ "field": "tipo", "operator": "=", "value": "${radioTipo}" }]}`;
        }
        else {
        consulta = `{"where": [{ "field": "tipo", "operator": "LIKE", "value": "${radioTipo}" }]}`;
        }
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
      case 'Tipo financeiro':
        consulta = `{"where": [{ "field": "tipo", "operator": "=", "value": "${valueTipoFinanceiro}" }]}`; 
        break;
      case 'Status':
        if (nome === 'ClientesAdmin'){
        consulta = `{"where": [{ "field": "perfil", "operator": "=", "value": "cliente" },{ "field": "ativo", "operator": "=", "value": "${radioStatus}" }]}`;
        }
        else if (nome === 'UsuariosAdmin'){
          consulta = `{"where": [{ "field": "perfil", "operator": "=", "value": "admin" },{ "field": "ativo", "operator": "=", "value": "${radioStatus}" }]}`;
        }
        break;
      case 'Perfil':
        consulta = `{"where": [{ "field": "perfil", "operator": "=", "value": "admin" },{ "field": "perfil", "operator": "=", "value": "${valuePerfil}" }]}`;
        break;
      case 'Debito automatico':
        consulta = `{"where": [{ "field": "debito", "operator": "=", "value": "${radioDebito}" }]}`;
        break;
      case 'Notificacoes pendentes':
        consulta = `{"where": [{ "field": "notificacao", "operator": "=", "value": "${radioNotificacaoPendente}" }]}`;
        break;
      default:
        break;
    }
    onConsultaSelected(consulta);
  }
  };

  const onClose = () => {
    setEstadoLoading(false);
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
              
              {(nome === 'HistoricoVeiculoAdmin' || nome === 'ListarNotificacoesAdmin') ?
              placaCarro !== null ?
              <div className="fs-6">
                Placa selecionada: ‎
                <Badge variant="dot" 
                size="md">
                  {placaCarro}
                  </Badge>
              </div> 
              : null 
              : null
              }

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
            </div>
            ) :
            selectedOption.value === 'Periodo' ? (
              <div>
              {(nome === 'HistoricoVeiculoAdmin' || nome === 'ListarNotificacoesAdmin') ?
              placaCarro !== null ?
              <div className="fs-6">
                Placa selecionada: ‎
                <Badge variant="dot" 
                size="md">
                  {placaCarro}
                  </Badge>
              </div> : null : null}
              <div>
              <div className="mt-4 mb-1">
                Selecione a data de inicio e fim:
              </div>
              <DatePickerInput type="range" locale='pt-br' allowSingleDateInRange placeholder='Selecione o periodo' value={valuePeriodo} onChange={setValuePeriodo} />
              </div>
              </div>
            ) :
            selectedOption.value === 'PeriodoHora' ? (
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
              {(nome === 'HistoricoVeiculoAdmin' || nome === 'ListarNotificacoesAdmin') ?
              placaCarro !== null ?
              <div className="fs-6">
                Placa selecionada: ‎
                <Badge variant="dot" 
                size="md">
                  {placaCarro}
                  </Badge>
              </div> : null : null}
              <div>
              <div className="mt-4 mb-1">
                Digite a vaga:
              </div>
              <Input icon={<IconParking size={16}/>} type="number" placeholder="Digite a vaga" maxLength={5} onChange={(e) => setInputVaga(e.target.value)}/>
              </div>
              </div>
            ) :
            selectedOption.value === 'Tipo' ? (
              <div>
              {(nome === 'HistoricoVeiculoAdmin' || nome === 'ListarNotificacoesAdmin') ?
              placaCarro !== null ?
              <div className="fs-6">
                Placa selecionada: ‎
                <Badge variant="dot" 
                size="md">
                  {placaCarro}
                  </Badge>
              </div> : null : null}
              <div>
              <div className="mt-2 mb-3">
                Selecione o tipo:
              </div>
              <Radio.Group name="Escolha algum opção" onChange={(e) => setRadioTipo(e)}>
                  {nome === 'HistoricoVeiculoAdmin' ?
                  <Grid>
                  <Grid.Col span={12}>
                  <Radio value="'S'" label="Notificado" />
                  </Grid.Col>
                  <Grid.Col span={12}>
                  <Radio value="'N'" label="Normal" />
                  </Grid.Col>
                  </Grid>
                  : 
                  <Grid>
                  <Grid.Col span={12}>
                  <Radio value="'PAGO'" label="Pago" />
                  </Grid.Col>
                  <Grid.Col span={12}>
                  <Radio value="'PENDENTE'" label="Pendente" />
                  </Grid.Col>
                  </Grid>
                  }
              </Radio.Group>
              </div>
              </div>
            ) :
            selectedOption.value === 'Estado' ? (
                <div>
                <div className="mt-4 mb-3">
                  Selecione o estado:
                </div>
                <Radio.Group name="Escolha alguma opção" onChange={(e) => setRadioTipo(e)}>
                    <Grid>
                    <Grid.Col span={12}>
                    <Radio value="'S'" label="Notificado" />
                    </Grid.Col>
                    <Grid.Col span={12}>
                    <Radio value="'N'" label="Normal" />
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
            selectedOption.value === 'Tipo financeiro' ? (
              <div>
                <div className="mt-4 mb-3">
                  Selecione o tipo:
                </div>
              <Select
                placeholder="Escolha o tipo"
                options={tipoFinanceiro}
                onChange={(e) => setValueTipoFinanceiro(e.value)}
              />
              </div>
            ) :
            selectedOption.value === 'Status' ? (
              <div>
              <div className="mt-4 mb-3">
                Selecione o status:
              </div>
              <Radio.Group name="Escolha alguma opção" onChange={(e) => setRadioStatus(e)}>
                  <Grid>
                  <Grid.Col span={12}>
                  <Radio value="S" label="Ativado" />
                  </Grid.Col>
                  <Grid.Col span={12}>
                  <Radio value="N" label="Desativado" />
                  </Grid.Col>
                  </Grid>
              </Radio.Group>
              </div>
            ) :
            selectedOption.value === 'Perfil' ? (
              <div>
              <div className="mt-4 mb-3">
                Selecione o perfil:
              </div>
              <Select
                placeholder="Escolha o perfil desejado"
                options={tipoPerfil}
                onChange={(e) => setValuePerfil(e.value)}
              />
              </div>
            ) :
            selectedOption.value === 'Debito automatico' ? (
              <div>
              <div className="mt-4 mb-3">
                Selecione o estado do débito automático:
              </div>
              <Radio.Group name="Escolha alguma opção" onChange={(e) => setRadioDebito(e)}>
                  <Grid>
                  <Grid.Col span={12}>
                  <Radio value="S" label="Ativado" />
                  </Grid.Col>
                  <Grid.Col span={12}>
                  <Radio value="N" label="Desativado" />
                  </Grid.Col>
                  </Grid>
              </Radio.Group>
              </div>
            ) :
            selectedOption.value === 'Notificacoes pendentes' ? (
              <div>
              <div className="mt-4 mb-3">
                Selecione o estado das notificações:
              </div>
              <Radio.Group name="Escolha alguma opção" onChange={(e) => setRadioNotificacaoPendente(e)}>
                  <Grid>
                  <Grid.Col span={12}>
                  <Radio value="S" label="Pendente" />
                  </Grid.Col>
                  <Grid.Col span={12}>
                  <Radio value="N" label="Normal" />
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
          Filtrar
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