import { Group, Text, Card, Button, Radio, Image, Input, Modal, Grid, ActionIcon, CopyButton, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCash, IconCheck, IconClipboard, IconClipboardCopy, IconCopy, IconKey } from '@tabler/icons-react'
import axios from 'axios'
import { React, useState, useEffect } from 'react'
import QRCode from 'react-qr-code'


const InserirCreditos = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [valor, setValor] = useState('')
    const [data, setData] = useState([]);

    const TestePix = (valor) => {
        axios.post("https://localhost:3001/gerarcobranca", {
                valor: valor,
        })
        .then((resposta) => {
            console.log(resposta.data.data)
            if(resposta.status === 200){
            setData(resposta.data.data);
            open();
            }
            else{
                console.log('n abriu nkk')
            }
        })
        .catch((err) => {
            console.log(err)
        })
        }

        const handleValorChange = (event) => {
            const { value } = event.target;
            setValor(formatarValor(value));
          };
        
          const formatarValor = (value) => {
            const valorFormatado = value.replace(/[^\d]/g, ''); // Remover caracteres não numéricos
            const quantidadeDigitos = valorFormatado.length;
        
            if (quantidadeDigitos === 0) {
              return '';
            }
        
            let valorFinal = '';
            let contador = 0;
        
            for (let i = 0; i < quantidadeDigitos; i++) {
              if (contador === 2) {
                valorFinal += ',';
                contador = 0;
              }
              valorFinal += valorFormatado[i];
              contador++;
            }
        
            return valorFinal;
          };

  return (
    <div>


    <Modal opened={opened} onClose={close} centered size="xl">
   <div id="borderimg">
    <Group position="center" mt="md" mb="xs">
    <Image src="../../assets/img/cartaoCredito/backpix.png" fit="contain" width={200} height={80}/> 
    </Group>
    <Group position="center" mt="md" mb="xs" >
    <QRCode value={data.brcode}/>
    </Group>

            <Input.Wrapper label="Pix Copia e Cola:" className="mx-2">
                    <Grid>
                    <Grid.Col span={10}>
                    <Input icon={<IconKey size="1.1rem" />} placeholder={data.brcode} value={data.brcode} 
                    />
                    </Grid.Col>
                    <Grid.Col span={2} className="mt-1">
                    <CopyButton value={data.brcode} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                            <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                                {copied ? <IconCheck size="1.2rem" /> : <IconCopy size="1.2rem" />}
                            </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                    </Grid.Col>
                    </Grid>
            </Input.Wrapper>

    </div>
    </Modal>


    <Card shadow="sm" padding="lg" radius="md" withBorder>

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
      value={valor}
      onChange={handleValorChange}
    />
    
      <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => {TestePix(valor)}}>
        Finalizar processo
      </Button>
    </Card>
    </div>

  )
}

export default InserirCreditos