import axios from 'axios';
import { React, useState, useEffect } from 'react'
import { IconPrinter, IconCameraSelfie, IconParking, IconBrandTwitter, IconEdit } from '@tabler/icons-react';
import { Accordion, ActionIcon, Badge, Button, Card, Grid, Group, Input, Text, rem } from '@mantine/core';
import { IconFilterEdit } from '@tabler/icons-react';

const EditarParametroAdmin = () => {
  const [data, setData] = useState([])
  const [enabledInputs, setEnabledInputs] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [inputValues2, setInputValues2] = useState({});
  const [initialValues2, setInitialValues2] = useState({});
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const user2 = JSON.parse(user);

  const handleToggleInput = (chave) => {
    setEnabledInputs((prevState) => ({
      ...prevState,
      [chave]: !prevState[chave]
    }));
  };
  
  const handleInputChange = (chave, valor) => {
    setInputValues((prevState) => ({
      ...prevState,
      [chave]: valor
    }));
  
    setIsModified(true); // Marcando como modificado assim que qualquer input for alterado
  };

  const handleInputChange2 = (chave, valor) => {
    setInputValues2((prevState) => ({
      ...prevState,
      [chave]: valor
    }));
  
    setIsModified(true); // Marcando como modificado assim que qualquer input for alterado
  };
  
  const handleSaveChanges = () => {
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
        token: token,
        id_usuario: user2.id_usuario,
        perfil_usuario: user2.perfil[0],
      },
    });
    const requestBody = {
      estacionamento: inputValues,
      turno: inputValues2,
      usuario: data.usuario
    };
console.log(requestBody)  
requisicao.put('/parametros', requestBody).then(
  response => {
    console.log(response)
  }).catch(
  error => {
    console.log(error)
  })
setIsModified(false);
    
  };

  useEffect(() => {
    const parametros = axios.create({
      baseURL: process.env.REACT_APP_HOST,
    });
    parametros.get('/parametros').then(
    response => {
      setData(response.data.data.param)
    });
  }, [])

useEffect(() => {
  if (data.estacionamento) {
    setInputValues(data.estacionamento);
    setInitialValues(data.estacionamento)
  }
  if(data.turno){
    setInputValues2(data.turno);
    setInitialValues2(data.turno)
  }
}, [data.estacionamento]);

//PARAMETROS ESTACIONAMENTO
useEffect(() => {
  const isAnyInputModified = Object.keys(inputValues).some(
    (key) => inputValues[key] != data.estacionamento[key]
  );

  setIsModified(isAnyInputModified);
}, [inputValues, data.estacionamento]);

//PARAMETROS TURNO
useEffect(() => {
  const isAnyInputModified = Object.keys(inputValues2).some(
    (key) => inputValues2[key] != data.turno[key]
  );

  setIsModified(isAnyInputModified);
}, [inputValues2, data.turno]);

  return (
    <div className="bg-white">

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
          // styles added to all items
          backgroundColor: '#fff',
          border: `${rem(1)} solid white`,

          '&[data-active]': {
            backgroundColor: '#fff',
          },
        },
      }}
    >

      
 <Accordion.Item value="estacionamento">
  <Accordion.Control icon={<IconParking size={rem(20)} color='blue' />}>
    Parâmetros estacionamento
  </Accordion.Control>
  <Accordion.Panel>
    {data.estacionamento && Object.keys(data.estacionamento).map((chave) => (
      <div key={chave} className="input-wrapper text-start mt-3">
        <label className="mx-2">{chave}:</label>
        <Grid>
        <Grid.Col span={10}>
            <Input
            value={inputValues[chave] || ''}
            disabled={!enabledInputs[chave]}
            placeholder={initialValues[chave] == 0 ? '0' : null}
            onChange={(e) => handleInputChange(chave, e.target.value)}
        />
        </Grid.Col>
        <Grid.Col span={1}>
        <ActionIcon>
          <IconEdit className="mt-1" size="1.3rem" color="#228BE6" onClick={() => handleToggleInput(chave)}/>
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
      <Accordion.Control icon={<IconPrinter size={rem(20)} color='#845EF7' />}>
        Parâmetros turno
      </Accordion.Control>
      <Accordion.Panel>
    {data.turno && Object.keys(data.turno).map((chave) => (
      <div key={chave} className="input-wrapper text-start mt-3">
        <label className="mx-2">{chave}:</label>
        <Grid>
        <Grid.Col span={10}>
            <Input
            value={inputValues2[chave] || ''}
            disabled={!enabledInputs[chave]}
            placeholder={initialValues2[chave] == 0 ? '0' : null}
            onChange={(e) => handleInputChange2(chave, e.target.value)}
        />
        </Grid.Col>
        <Grid.Col span={1}>
        <ActionIcon>
          <IconEdit className="mt-1" size="1.3rem" color="#228BE6" onClick={() => handleToggleInput(chave)}/>
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

  </Accordion>
  </div>
  )
}

export default EditarParametroAdmin