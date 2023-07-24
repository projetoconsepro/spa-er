
import sha256 from 'crypto-js/sha256';
import { React, useState, useEffect } from 'react'
import { IconCreditCard, IconUser, IconLock, IconUserCircle, IconMail, IconEdit, IconPhone, IconTrash } from '@tabler/icons-react';
import { Accordion, ActionIcon, Badge, Button, Card, Grid, Group, Input, PasswordInput, Text, rem } from '@mantine/core';
import { IconCar } from '@tabler/icons-react';
import { IconAdjustments } from '@tabler/icons-react';
import { IconArrowForwardUpDouble } from '@tabler/icons-react';
import FuncTrocaComp from '../util/FuncTrocaComp';
import { IconLockCheck } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import createAPI from '../services/createAPI';

const ConfigurarPerfil = () => {
  const [saldo, setSaldo] = useState([]);
  const [user2, setUser2] = useState('');
  const [user, setUser] = useState('');
  const [perfil, setPerfil] = useState('');
  const [email, setEmail] = useState('');
  const [email2, setEmail2] = useState('');
  const [telefone, setTelefone] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [senha, setSenha] = useState('');
  const [senha2, setSenha2] = useState('');
  const [token, setToken] = useState('');
  const [idUsuario, setIdUsuario] = useState(null);
  const [isUsernameEnabled, setIsUsernameEnabled] = useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isTelefoneEnabled, setIsTelefoneEnabled] = useState(false);
  const [estado, setEstado] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    setToken(token)
    setUser2(user2.nome);
    setUser(user2.nome);
    setIdUsuario(user2.id_usuario);
    setPerfil(user2.perfil[0]);
    setEmail(user2.email);
    setEmail2(user2.email);
    setTelefone(user2.telefone);
    setTelefone2(user2.telefone);
    const requisicao = createAPI();

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

  const handleTelefoneIconClick = () => {
    setIsTelefoneEnabled(!isTelefoneEnabled);
  };

  const handleCancelClick = () => {
    setUser(user2);
    setEmail(email2);
    setTelefone(telefone2)
    setIsUsernameEnabled(false);
    setIsEmailEnabled(false);
    setIsTelefoneEnabled(false);
  };

  const handleSaveClick = () => {
    if(user.length < 60 && telefone.length === 11){
    const requisicao = createAPI();
    requisicao.put('/usuario', {
      nome: user,
      telefone: telefone,
    }).then(response => {
      console.log(response)
        if (response.data.msg.resultado) {
          setIsUsernameEnabled(false);
          setIsTelefoneEnabled(false);
          setUser(response.data.data.nome);
          setUser2(response.data.data.nome);
          setTelefone(response.data.data.telefone);
          setTelefone2(response.data.data.telefone);

          const userJSON = localStorage.getItem('user');
          const user = JSON.parse(userJSON);

          user.nome = response.data.data.nome;
          user.telefone = response.data.data.telefone;

          const updatedUserJSON = JSON.stringify(user);
          localStorage.setItem('user', updatedUserJSON);
        } else {
            setEstado(true);
            setMensagem(response.data.msg.msg);
            setTimeout(() => {
                setEstado(false);
                setMensagem('');
            }, 3000);
        }
      })
  } else {
    setEstado(true);
    setMensagem('O seu nome deve ter no máximo 60 caracteres e o seu telefone deve ter 11 caracteres.');
    setTimeout(() => {
        setEstado(false);
        setMensagem('');
    }, 3000);
  }

}

  const handleCancelClickSenha = () => {
    setSenha('')
    setSenha2('')
  }

  const handleSaveClickSenha = () => {
    const requisicao = createAPI();
    if(senha.length >= 8 && !senha.match(/["']/) && senha === senha2){
    const password = sha256(senha).toString();
    requisicao.put('/usuario', {
      senha: password,
    }).then(response => {
      console.log(response)
        if (response.data.msg.resultado) {
          Swal.fire({
            icon: 'success',
            title: 'Senha alterada com sucesso!',
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Não foi possível alterar sua senha.',
            footer: 'Tente novamente!'
          })
        }
      })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Não foi possível alterar sua senha.',
      footer: 'Tente novamente!'
    })
  }
}

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
          <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => { FuncTrocaComp('MeusVeiculos') }}>
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
              <Input.Wrapper label="Email:" className="mb-2">
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
              <Input.Wrapper label="Número de celular:">
                <Grid>
                  <Grid.Col span={10}>
                    <Input icon={<IconPhone size="1rem" />} placeholder={telefone} value={telefone}
                      onChange={(e) => setTelefone(e.target.value)} disabled={!isTelefoneEnabled}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <ActionIcon onClick={handleTelefoneIconClick}>
                      <IconAdjustments size="1.125rem" />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>
            </div>

            <div className="mt-4">
              {(isUsernameEnabled || isEmailEnabled || isTelefoneEnabled) && (user !== user2 || email !== email2 || telefone !== telefone2) && (
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
          <Accordion.Panel>
          <div className="text-start">
              <Input.Wrapper label="Nova senha:" className="mb-2">
                <Grid>
                  <Grid.Col span={12}>
                    <PasswordInput icon={<IconLock size="1rem" />} placeholder="Digite sua nova senha" value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>
              <Input.Wrapper label="Confirmar nova senha:" className="mb-2">
                <Grid>
                  <Grid.Col span={12}>
                    <PasswordInput icon={<IconLockCheck size="1rem" />} placeholder="Confirme sua nova senha" value={senha2}
                      onChange={(e) => setSenha2(e.target.value)}
                    />
                  </Grid.Col>
                </Grid>
              </Input.Wrapper>
            </div>
            <div className="mt-4">
              {senha.length >= 8 && senha2.length >= 8 ?
                <Group position="center" spacing="sm" grow>
                  <Button color="gray" onClick={handleCancelClickSenha}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveClickSenha} loaderPosition="right">
                    Salvar
                  </Button>
                </Group>
              : null}
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        {perfil === 'cliente' && 1 === 2 ?
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

        {perfil === 'cliente' && 1 === 2 ?
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
      <div className="alert alert-danger mt-4 mx-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                    {mensagem}
      </div>
    </div>
  )
}

export default ConfigurarPerfil;