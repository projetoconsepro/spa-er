import { useDisclosure } from '@mantine/hooks';
import { Modal, Group, Button, TextInput, Select, Radio, Grid } from '@mantine/core';
import { DateInput } from '@mantine/dates';

const Filtro = () => {
    const [opened, { open, close }] = useDisclosure(false);

    const options = [
      { label: 'Opção 1', value: 'opcao1' },
      { label: 'Opção 2', value: 'opcao2' },
      { label: 'Opção 3', value: 'opcao3' },
      { label: 'Opção 4', value: 'opcao4' },
    ];

    return (
      <>
        <Modal opened={opened} onClose={close} title="Filtrar" centered>
        <Grid>
            <Grid.Col span={6}><TextInput label="Input 1" placeholder="Digite algo aqui..." /></Grid.Col>
            <Grid.Col span={6}><TextInput label="Input 2" placeholder="Digite algo aqui..." /></Grid.Col>
        </Grid>
          <Select label="Selecione uma opção" data={options} style={{ marginTop: '16px' }} />
          <Radio.Group label="Selecione uma opção" style={{ marginTop: '16px' }}>
            <Radio label="Opção 1" value="opcao1" />
            <Radio label="Opção 2" value="opcao2" />
            <Radio label="Opção 3" value="opcao3" />
            <Radio label="Opção 4" value="opcao4" />
          </Radio.Group>
          <DateInput
            valueFormat="YYYY MMM DD"
            label="Escolha uma data"
            placeholder="..."
            maw={400}
            mx="auto"
          />
          <Grid className="mt-3">
          <Grid.Col span={2}></Grid.Col>
           <Grid.Col span={4}><Button className="bg-blue-50">Filtrar</Button> </Grid.Col>
           <Grid.Col span={4}><Button className="bg-gray-500">Voltar</Button> </Grid.Col>
           <Grid.Col span={2}></Grid.Col>
           </Grid>
        </Modal>

        <Group position="center">
          <Button onClick={open} className="w-100 bg-blue-50">Filtrar</Button>
        </Group>
      </>
    );
}

export default Filtro;