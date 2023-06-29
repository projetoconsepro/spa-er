import { Accordion, Badge, Card, Group, Text } from '@mantine/core'
import { IconHandGrab, IconHandMove, IconHelpTriangle, IconMail, IconUser, IconVideo, IconWaveSine } from '@tabler/icons-react'
import React, { useState, useEffect } from 'react'

const Suporte = () => {
    const [nome, setNome] = useState('')

    useEffect(() => {
    const user = localStorage.getItem('user')
    const user2 = JSON.parse(user)
    setNome(user2.nome)

    }, [])

  return (
    <div>
        <Card padding="lg" radius="md" withBorder>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Olá, {nome}!</Text>
          <Badge color="red" variant="light"> SUPORTE </Badge>
        </Group>
        <Text size="sm" color="dimmed">
          Seja bem vindo(a) ao nosso suporte! Aqui você pode tirar suas dúvidas, fazer sugestões ou entrar em contato conosco.
        </Text>
        </Card>
        <Accordion variant="contained" styles={{ item: { backgroundColor: 'white' } }}>
        <Accordion.Item value="duvidas">
          <Accordion.Control icon={<IconHelpTriangle color='yellow' />}>
            Dúvidas frequentes
          </Accordion.Control>
          <Accordion.Panel>

          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="tutorial">
            <Accordion.Control icon={<IconVideo color='blue' />}>
            Como usar o sistema
            </Accordion.Control>
            <Accordion.Panel>
            </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="contato">
            <Accordion.Control icon={<IconMail color='red' />}>
            Contato
            </Accordion.Control>
            <Accordion.Panel>
            </Accordion.Panel>
        </Accordion.Item>
        </Accordion>
            

    </div>
  )
}

export default Suporte