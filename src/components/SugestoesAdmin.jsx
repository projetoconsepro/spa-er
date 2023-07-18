import { Card, Group, Text, Table, Badge } from '@mantine/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const SugestoesAdmin = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const user2 = JSON.parse(user);
        const token = localStorage.getItem("token");
        const requisicao = axios.create({
          baseURL: process.env.REACT_APP_HOST,
          headers: {
            token: token,
            id_usuario: user2.id_usuario,
            perfil_usuario: user2.perfil[0],
          },
        });
    
        requisicao
          .get("/usuario/sugestao").then((res) => {
            const Newdata = res.data.data.map((item) => {
                return {
                    nome: item.nome,
                    descricao: item.descricao,
                    data: item.data,
                }
            }
            )
            setData(Newdata);
          }
        )
        .catch((err) => {
            console.log(err);
            }
        );
        
    }, []);


    function formatarDataHora(dataString) {
        const data = new Date(dataString);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');
      
        return `${mes}/${dia}/${ano} - ${hora}:${minutos}:${segundos}`;
      }

  return (
    <div className="mb-3">
        <Card padding="lg" radius="md" withBorder>
            <Group position="apart" mt="md" mb="xs">
                <Text weight={500} fz="lg">Sugestões:</Text>
            </Group>

        {data.length !== 0 ?
        data.map((item, index) => {
            return (
                <Card padding="sm" radius="md" withBorder mt="md" key={index}>
                    <Card.Section padding="sm" radius="md" withBorder style={{ backgroundColor: "#F7F7F7" }}>
                    <Group position="left" padding="sm">
                    <Text weight={400} className="mx-2">Deve melhorar nisso aqui</Text>
                    </Group>
                    </Card.Section>
                    <Group position="apart" mt="md" mb="xs">
                    <Text weight={500} fz="md">Nome: {item.nome}</Text>
                    <Badge color="indigo" size="md">CLIENTE</Badge>
                    </Group>
                    <Group position="left" mt="md" mb="xs">
                    <Text weight={500} fz="sm">Data: {formatarDataHora(item.data)}</Text>
                    </Group>
                    <Group position="apart" mt="md" mb="xs">
                    <Text weight={500} fz="sm">Descrição: {item.descricao}</Text>
                    </Group>
                </Card>
            )
        })
        : 
        <Card padding="sm" radius="md" withBorder mt="md">
        <Group position="apart" mt="md" mb="xs">
        <Text weight={500} fz="md">Nenhuma sugestão foi cadastrada no momento.</Text>
        </Group>
        </Card>
        }
    </Card>
    </div>
  )
}

export default SugestoesAdmin