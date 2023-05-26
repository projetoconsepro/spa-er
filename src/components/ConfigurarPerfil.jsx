import axios from 'axios';
import { React, useState, useEffect } from 'react'
import { IconCreditCard, IconUser, IconLock, IconBrandTwitter, IconUserCircle, IconMailbox, IconMail } from '@tabler/icons-react';
import { Accordion, ActionIcon, Badge, Button, Card, Grid, Group, Input, Text, rem } from '@mantine/core';
import { IconCar } from '@tabler/icons-react';
import { IconAdjustments } from '@tabler/icons-react';
import { IconAccessPoint } from '@tabler/icons-react';
import { IconArrowForwardUpDouble } from '@tabler/icons-react';
import FuncTrocaComp from '../util/FuncTrocaComp';

const ConfigurarPerfil = () => {
    const [data, setData] = useState([]);
    const [saldo, setSaldo] = useState([]);
    const [user2, setUser2] = useState('');
    const [user, setUser] = useState('');
    const [perfil, setPerfil] = useState('');
    const [email, setEmail] = useState('');
    const [email2, setEmail2] = useState('');
    const [isUsernameEnabled, setIsUsernameEnabled] = useState(false);
    const [isEmailEnabled, setIsEmailEnabled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    setUser2(user2.nome);
    setUser(user2.nome);
    setPerfil(user2.perfil[0]);
    setEmail(user2.email);
    setEmail2(user2.email);
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
          'token': token,
          'id_usuario': user2.id_usuario,
          'perfil_usuario': "cliente"
      }
    })

    requisicao.get('/usuario/saldo-credito').then(
      response => {
          setSaldo(response?.data?.data?.saldo)
      }
    )
  }, []);

  const handleUsernameIconClick = () => {
    setIsUsernameEnabled(!isUsernameEnabled);
  };

  const handleEmailIconClick = () => {
    setIsEmailEnabled(!isEmailEnabled);
  };

  const handleCancelClick = () => {
    setUser('');
    setEmail('');
    setIsUsernameEnabled(false);
    setIsEmailEnabled(false);
  };

  const handleSaveClick = () => {
    
  };

  const goDebito = () => {
    FuncTrocaComp('Configuracoes')
  }

  return (
    <div>
    <Card padding="lg" radius="md" withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Olá, {user2}!</Text>
        <Badge color="teal.8" variant="light">
          {perfil}
        </Badge>
      </Group>
      <Group position="apart" mt="md" mb="xs">
          <Text size="lg" weight={500}>
              <IconCreditCard color="indigo"/> R$ {saldo}
          </Text>
      </Group>
      <Text size="sm" color="dimmed">
        Você está no menu de configurações do seu perfil. Aqui você pode alterar suas informações pessoais.
      </Text>
      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Voltar aos meus veículos
      </Button>
    </Card>
    <Accordion variant="contained" styles={{  item: {backgroundColor: 'white'}}}>
    <Accordion.Item value="photos">
      <Accordion.Control icon={<IconUser size={rem(20)} color='teal' />}>
        Informações pessoais
      </Accordion.Control>
      <Accordion.Panel>
        <div className="text-start">
          <Input.Wrapper label="Nome de usuário:" className="mb-2">
            <Grid>
            <Grid.Col span={10}>
            <Input icon={<IconUserCircle size="1rem" />} placeholder={user2} value={user} 
              onChange={(e) => setUser(e.target.value)} disabled={!isUsernameEnabled}
            />
            </Grid.Col>
            <Grid.Col span={2}>
            <ActionIcon onClick={handleUsernameIconClick}>
                <IconAdjustments size="1.125rem" />
                </ActionIcon>
            </Grid.Col>
            </Grid>
          </Input.Wrapper>
          <Input.Wrapper label="Email:">
            <Grid>
            <Grid.Col span={10}>
            <Input icon={<IconMail size="1rem" />} placeholder={email} value={email} 
            onChange={(e) => setEmail(e.target.value)} disabled={!isEmailEnabled} 
            />
            </Grid.Col>
            <Grid.Col span={2}>
            <ActionIcon onClick={handleEmailIconClick}>
                <IconAdjustments size="1.125rem" />
                </ActionIcon>
            </Grid.Col>
            </Grid>
          </Input.Wrapper>
        </div>

        <div className="mt-4">
        {(isUsernameEnabled || isEmailEnabled) && (user !== user2 || email !== email2) && (
            <Group position="center" spacing="sm" grow>
              <Button color="gray" onClick={handleCancelClick}>
                Cancelar
              </Button>
              <Button onClick={handleSaveClick} loaderPosition="right">
                Salvar
              </Button>
            </Group>
          )}
        </div>
      </Accordion.Panel>
    </Accordion.Item>

    <Accordion.Item value="print">
      <Accordion.Control icon={<IconLock size={rem(20)} color='red' />}>
        Alterar senha
      </Accordion.Control>
      <Accordion.Panel>Content</Accordion.Panel>
    </Accordion.Item>

    <Accordion.Item value="camera">
      <Accordion.Control icon={<IconCar size={rem(20)} color='blue' />}>
        Alterar débito automático
      </Accordion.Control>
      <Accordion.Panel>

      <Button leftIcon={<IconArrowForwardUpDouble size="1rem" />} onClick={() => {goDebito()}}>
            Ir para o débito automático
      </Button>
      </Accordion.Panel>

    </Accordion.Item>
  </Accordion>
  </div>
  )
}

export default ConfigurarPerfil