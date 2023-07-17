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





  return (
    <div>
        <Card padding="lg" radius="md" withBorder>
            <Group position="apart" mt="md" mb="xs">
                <Text weight={500} fz="lg">Sugestões:</Text>
            </Group>

        {data.map((item) => {
            return (
                <Card padding="sm" radius="md" withBorder mt="md">
                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>Nome: {item.nome}</Text>
                        <Badge color="red" size="md">Data: {item.data}</Badge>
                    </Group>
                    <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>Descrição: {item.descricao}</Text>
                    </Group>
                </Card>
            )
        })}
    </Card>
    </div>
  )
}

export default SugestoesAdmin