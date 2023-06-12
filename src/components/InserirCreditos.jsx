import { Badge, Group, Text, Card, Button, Radio, Image, Input } from '@mantine/core'
import { IconCash } from '@tabler/icons-react'

const InserirCreditos = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>

      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>1. Escolha o método de pagamento:</Text>
      </Group>
      <Radio.Group>
      <Group mt="xs">
        <Radio value="react"/>
        <Image width={50} height={35} src="../../assets/img/cartaoCredito/mastercard.png"/>
        <Text weight={200}> Mastercard **35</Text>
      </Group>
      <Group mt="xs">
        <Radio value="rerere"/>
        <Image width={35} height={35} src="../../assets/img/cartaoCredito/pixxx.png"/>
        <Text weight={200}> PIX</Text>
      </Group>
      <Group mt="xs">
        <Radio value="rerdd"/>
        <Image width={35} height={35} src="../../assets/img/cartaoCredito/boletoo.png"/>
        <Text weight={200}> Boleto Bancário</Text>
      </Group>
    </Radio.Group>

    <Group position="apart" mt="md" mb="xs">
    <Text weight={500}>2. Selecione o valor:</Text>
    </Group>
    <Input
      icon={<IconCash />}
      placeholder="R$ 0,00"
    />

      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Finalizar processo
      </Button>
    </Card>
  )
}

export default InserirCreditos