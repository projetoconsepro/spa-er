import axios from 'axios';
import { React, useState, useEffect } from 'react'
import { IconCreditCard, IconUser, IconLock, IconBrandTwitter, IconUserCircle, IconMailbox, IconMail, IconSettings, IconEdit, IconTrash } from '@tabler/icons-react';
import { Accordion, ActionIcon, Badge, Button, Card, Grid, Group, Input, Text, rem } from '@mantine/core';
import { IconCar } from '@tabler/icons-react';
import { IconAdjustments } from '@tabler/icons-react';
import { IconAccessPoint } from '@tabler/icons-react';
import { IconArrowForwardUpDouble } from '@tabler/icons-react';
import FuncTrocaComp from '../util/FuncTrocaComp';
import { FaEllipsisH, FaEye } from 'react-icons/fa';

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
          <Badge color={perfil === 'parceiro' ? 'teal.8'
            : perfil === 'cliente' ? 'blue.8'
              : perfil === 'admin' ? 'red.8'
                : perfil === 'agente' ? 'yellow.8'
                  : 'gray'
          } variant="light">
            {perfil}
          </Badge>
        </Group>
        {perfil === 'cliente' ?
          <Group position="apart" mt="md" mb="xs">
            <Text size="lg" weight={500}>
              <IconCreditCard color="indigo" /> R$ {saldo}
            </Text>
          </Group>
          : null}
        <Text size="sm" color="dimmed">
          Você está no menu de configurações do seu perfil. Aqui você pode alterar suas informações pessoais.
        </Text>
        {perfil === 'cliente' ?
          <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => { FuncTrocaComp('ListarVeiculos') }}>
            Voltar aos meus veículos
          </Button>
          : perfil === 'monitor' ?
            <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => { FuncTrocaComp('ListarVagasMonitor') }}>
              Voltar às vagas
            </Button>
            : perfil === 'parceiro' ?
              <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => { FuncTrocaComp('RegistrarEstacionamentoParceiro') }}>
                Voltar ao registro de estacionamento
              </Button>
              : perfil === 'admin' ?
                <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => { FuncTrocaComp('Dashboard') }}>
                  Voltar ao dashboard
                </Button>
                : perfil === 'agente' ?
                  <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => { FuncTrocaComp('VeiculosAgente') }}>
                    Voltar aos veículos
                  </Button>
                  : null
        }
      </Card>
      <Accordion variant="contained" styles={{ item: { backgroundColor: 'white' } }}>
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

        {perfil === 'cliente' ?
          <Accordion.Item value="cartao">
            <Accordion.Control icon={<IconCreditCard size={rem(20)} />}>
              Meus cartões de crédito
            </Accordion.Control>
            <Accordion.Panel>
              <Card padding="lg" radius="md" withBorder>
              <div className="row">
                <div className='col-3 p-0 m-0'>
                <img src="../../assets/img/cartaoCredito/mastercard.png" alt="logo" className='logo w-75'/>
                </div>
                <div className='col-6 text-start p-0 m-0'>
                  VINICIUS K DE PAULA <br />
                  3333 **** **** 3333
              </div>

              <div className='col-2'>
              <Grid>
              <Grid.Col span={2}><ActionIcon><IconEdit color="#FF922B" size="1rem" /></ActionIcon></Grid.Col>
              <Grid.Col span={2}></Grid.Col>
              <Grid.Col span={2}><ActionIcon><IconTrash color="#E03131" size="1rem" /></ActionIcon></Grid.Col>
              </Grid>
                </div>
              </div>
              </Card>
                <Button className='mt-3' leftIcon={<IconArrowForwardUpDouble size="1rem" />} onClick={() => { FuncTrocaComp('CartaoCredito') }}>
                  Adioconar cartão de crédito
              </Button>
            </Accordion.Panel>
          </Accordion.Item>
          : null}

        {perfil === 'cliente' ?
          <Accordion.Item value="camera">
            <Accordion.Control icon={<IconCar size={rem(20)} color='blue' />}>
              Alterar débito automático
            </Accordion.Control>
            <Accordion.Panel>

              <Button leftIcon={<IconArrowForwardUpDouble size="1rem" />} onClick={() => { goDebito() }}>
                Ir para o débito automático
              </Button>
            </Accordion.Panel>

          </Accordion.Item>
          : null
        }
      </Accordion>
    </div>
  )
}

export default ConfigurarPerfil