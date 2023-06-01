import axios from 'axios'
import { React, useState, useEffect } from 'react'
import { ActionIcon, Badge, Button, Card, Grid, Group, Image, Input, Text } from '@mantine/core'
import { IconAdjustments, IconCash, IconCheck, IconMail, IconUserCircle } from '@tabler/icons-react'

const TransferenciaParceiro = () => {
    const [cnpj, setCnpj] = useState('');
    const [valor, setValor] = useState('');

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder> 
        {window.innerWidth < 768 ? 
        <Card>
        <Card.Section style={{ display: "flex", justifyContent: "flex-start", position: "relative" }}>
          <div style={{ height: "50vw", width: "100%" }}>
            <Image
              src="https://blog.jeton.com/wp-content/uploads/2020/11/remittence-2048x1293.png"
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
              alt="Transfer"
            />
          </div>
        </Card.Section>
        </Card>
        :
        <Card>
        <Card.Section style={{ display: "flex" }}>
            <div style={{ position: "relative", top: "-250px" }}>
                <Image
                    src="https://blog.jeton.com/wp-content/uploads/2020/11/remittence-2048x1293.png"
                    style={{ height: "20vw", objectFit: "cover" }}
                    alt="Transfer"
                />
            </div>
        </Card.Section>
        </Card>
        }


      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Registrar transferência de parceiros:</Text>
      </Group>

      <div className="text-start">
          <Input.Wrapper label="Informe o CNPJ do parceiro:" className="mb-2">
            <Grid>
            <Grid.Col span={12}>
            <Input icon={<IconUserCircle size="1rem" />} placeholder={"Digite aqui"} value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            />
            </Grid.Col>
            </Grid>
          </Input.Wrapper>
          <Input.Wrapper label="Informe o valor da transferência:">
            <Grid>
            <Grid.Col span={12}>
            <Input icon={<IconCash size="1rem" />} placeholder={'R$0,00'} value={valor}
            onChange={(e) => setValor(e.target.value)}
            />
            </Grid.Col>
            </Grid>
          </Input.Wrapper>
        </div>

      <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} fullWidth mt="md" radius="md">
        Registrar transferência ‎
        <IconCheck size="1.125rem" />
      </Button>
    </Card>
  )
}

export default TransferenciaParceiro