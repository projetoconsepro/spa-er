import axios from 'axios';
import { React, useEffect, useState } from 'react'
import { BsCalendarDate, BsPaintBucket } from 'react-icons/bs';
import { FaCarAlt, FaClipboard, FaClipboardList, FaCode, FaParking } from 'react-icons/fa';
import Swal from 'sweetalert2';
import FuncTrocaComp from '../util/FuncTrocaComp';
import { Button, Card, Divider, Group, Input, Text } from '@mantine/core';
import { IconCamera, IconCodeCircle, IconCodeDots, IconFileCode, IconReceipt } from '@tabler/icons-react';

const AutoInfracao = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const [data, setData] = useState([])
    const [codigo, setCodigo] = useState('')

    useEffect(() => {
        document.title = 'Auto de Infração'
        const infos = JSON.parse(localStorage.getItem('autoInfracao'))
        setData([infos])
    }, [])

    const registrarProva = () => {
      FuncTrocaComp('CameraAutoInfracao')
    }

    const verFotos = () => {
    
    }

    const confirmarInfracao = () => {
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });

      requisicao.post('/notificacao/auto-infracao',{
          codigo: codigo,
          idVagaVeiculo: data[0].id_vaga_veiculo,
      }).then((response) => {
        if (response.data.msg.resultado){
          Swal.fire( 'Sucesso!', 'Auto de infração confirmado com sucesso!', 'success')
          setTimeout(() => {
            localStorage.removeItem('autoInfracao')
            FuncTrocaComp('ListarNotificacoesAgente')
            Swal.close()
          }, 1000);
        } else {
          Swal.fire( 'Erro!', `${response.data.msg.msg}`, 'error')

        }
    }).catch((error) => {
      if(error?.response?.data?.msg === "Cabeçalho inválido!" 
      || error?.response?.data?.msg === "Token inválido!" 
      || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("perfil");
      } else {
          console.log(error)
      }
    })
  }

  return (
    <div className="col-12 px-3">
      <p className="text-start fs-2 fw-bold">Auto de infração</p>
      
        {data.map((item, index) => (
        <Card padding="lg" radius="md" withBorder key={index}>
            <Group position="apart">
              <Text size={30}> {item.placa} </Text>
            </Group>
            <Group position="apart">
              <Text size={20}> <BsCalendarDate className="mb-1"/> {item.data} </Text>
            </Group>
            <Group position="apart">
              <Text size={20}> <FaClipboardList className="mb-1"/> Motivo: {item.tipo} </Text>
            </Group>
            <Divider my="sm" size="md" variant="dashed" />
            <Group position="apart">
              <Text size={20}> <FaParking className="mb-1"/> Vaga: {item.vaga} </Text>
            </Group>
            <Group position="apart">
              <Text size={20}> <FaCarAlt className="mb-1"/> Modelo: {item.fabricante} ({item.modelo}) </Text>
            </Group>
            <Group position="apart">
              <Text size={20}> <BsPaintBucket /> Cor: {item.cor} </Text>
            </Group>
            
            <Button variant="gradient" gradient={{ from: 'orange', to: 'red' }} fullWidth mt="md" radius="md"
            onClick={() => registrarProva()}>
            REGISTRAR PROVA ‎ <IconReceipt size={18}/>
            </Button>
            <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} fullWidth mt="md" radius="md"
            onClick={() => verFotos()}>
            VISUALIZAR FOTOS ‎ <IconCamera size={18}/>
            </Button>
        </Card>
    ))}

    <Card padding="lg" radius="md" withBorder mt="md">
      <Group position="apart" mb="md">
      <Text> Informe o código para confirmar: </Text>
      </Group>
      <Group position="left">
      <Input icon={<FaClipboard />} placeholder="Código do DETRAN:" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
      </Group>
      <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} fullWidth mt="md" radius="md" onClick={() => confirmarInfracao()}>
      CONFIRMAR AUTO DE INFRAÇÃO ‎ <IconReceipt size={18}/>
      </Button>
    </Card>
    </div>
  )
}

export default AutoInfracao