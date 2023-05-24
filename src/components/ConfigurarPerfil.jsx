import axios from 'axios';
import { React, useState, useEffect } from 'react'
import { IconCreditCard, IconUser, IconLock } from '@tabler/icons-react';
import { Accordion, Badge, Button, Card, Group, Text, rem } from '@mantine/core';
import { IconCar } from '@tabler/icons-react';

const ConfigurarPerfil = () => {
    const [data, setData] = useState([]);
    const [saldo, setSaldo] = useState([]);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

  useEffect(() => {
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

  return (
    <div className="">
    <Card padding="lg" radius="md" withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Olá, {user2.nome}!</Text>
        <Badge color="teal.8" variant="light">
          {user2.perfil[0]}
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
      <Accordion.Panel>Content</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
  </div>
  )
}

export default ConfigurarPerfil