import { React, useState, useEffect } from 'react'
import { IconPhoto, IconPrinter, IconCameraSelfie } from '@tabler/icons-react';
import { Accordion, Badge, Button, Card, Group, Text, rem } from '@mantine/core';

const ConfigurarPerfil = () => {

  return (
    <div className="">

    <Card padding="lg" radius="md" withBorder>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Olá, Vinicius Krummenauer!</Text>
        <Badge color="teal.8" variant="light">
          Cliente
        </Badge>
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
      <Accordion.Control icon={<IconPhoto size={rem(20)} color='red' />}>
        Alterar nome
      </Accordion.Control>
      <Accordion.Panel>Content</Accordion.Panel>
    </Accordion.Item>

    <Accordion.Item value="print">
      <Accordion.Control icon={<IconPrinter size={rem(20)} color='blue' />}>
        Alterar senha
      </Accordion.Control>
      <Accordion.Panel>Content</Accordion.Panel>
    </Accordion.Item>

    <Accordion.Item value="camera">
      <Accordion.Control icon={<IconCameraSelfie size={rem(20)} color='teal' />}>
        Alterar débito automático
      </Accordion.Control>
      <Accordion.Panel>Content</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
  </div>
  )
}

export default ConfigurarPerfil