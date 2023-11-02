import { React, useState, useEffect } from "react";
import { Button, Card, Divider, Group, Input, Select, Text, Checkbox } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Swal from "sweetalert2";
import createAPI from "../services/createAPI";
import { FaCarAlt } from "react-icons/fa";

const AdicionarModelo = () => {
    const [estado, setEstado] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [fabricante, setFabricante] = useState("");
    const [fabricantes, setFabricantes] = useState([]);
    const [fabricantesSelect, setFabricantesSelect] = useState([]);
    const [modelo, setModelo] = useState("");
    const [checked, setChecked] = useState(false);


    const getFabricantes = () => {
        const requisicao = createAPI();
        requisicao.get(`/veiculo/fabricantes/`).then(
            response => {
                const newData = response?.data?.data?.fabricantes.map(item => ({
                    label: item.nome,
                    value: item.id_fabricante_veiculo
                }));
                setFabricantes(newData);
            }
        ).catch(function (error) {
            if (error?.response?.data?.msg === "Cabeçalho inválido!"
                || error?.response?.data?.msg === "Token inválido!"
                || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!") {
                localStorage.removeItem("user")
                localStorage.removeItem("token")
                localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });
    }

    useEffect(() => {
        getFabricantes();
    }, []);

    const submit = async () => {
        if ((fabricante !== "" || fabricantesSelect.length !== 0) && modelo !== "") {
        const findByIndex = fabricantes.find(item => item.value === fabricantesSelect);
        const requisicao = createAPI();
        console.log(checked ? fabricante : findByIndex.label)
        console.log(modelo)

        const postModelos = async () => {
            await requisicao.post(`/veiculo/modelos/`, {
                fabricante: checked ? fabricante : findByIndex.label,
                modelo: modelo
            }).then(
                response => {
                    if(response.data.msg.resultado){
                    setEstado(false);
                    setMensagem("");
                    setModelo("");
                    getFabricantes();
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: 'Modelo adicionado com sucesso!',
                    });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro!',
                            text: response.data.msg.msg,
                        });
                    }
                }
            ).catch(function (error) {
                if (error?.response?.data?.msg === "Cabeçalho inválido!"
                    || error?.response?.data?.msg === "Token inválido!"
                    || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!") {
                    localStorage.removeItem("user")
                    localStorage.removeItem("token")
                    localStorage.removeItem("perfil");
                } else {
                    setEstado(true);
                    setMensagem(error?.response?.data?.msg);
                }
            });
        }

        if (checked) {
            await requisicao.post(`/veiculo/fabricante/`, {
                fabricante: checked ? fabricante : findByIndex.label,
            }).then(
                response => {
                    console.log(response.data.msg.resultado)
                    if (response.data.msg.resultado){
                    postModelos();
                    setEstado(false);
                    setMensagem("");
                    setModelo("");
                    getFabricantes();
                    } else {
                        console.log("b")
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro!',
                            text: response.data.msg.msg,
                        });
                    }
                }
            ).catch(function (error) {
                if (error?.response?.data?.msg === "Cabeçalho inválido!"
                    || error?.response?.data?.msg === "Token inválido!"
                    || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!") {
                    localStorage.removeItem("user")
                    localStorage.removeItem("token")
                    localStorage.removeItem("perfil");
                } else {
                    setEstado(true);
                    setMensagem(error?.response?.data?.msg);
                }
                });
            } else {
                postModelos();
            }
            }  else {
            setEstado(true);
            setMensagem("Preencha todos os campos!");
            setTimeout(() => {
                setEstado(false);
                setMensagem("");
            }, 3000);
        }
}

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card shadow="sm" padding="lg" radius="xs" className="bg-admin-parceiro" withBorder={false}>
                <Group position="apart" mt="md" mb="xs">
                    <Text weight={500}>Adicionar veículo:</Text>
                </Group>
                <div className="text-start">
                    <Divider my="sm" size="sm" variant="dashed" />

                    <Checkbox
                        label="Fabricante não cadastrado"
                        onChange={(e) => setChecked(e.currentTarget.checked)}
                    />

                    {checked ? (
                    <Input.Wrapper label="Escolha o fabricante do veículo" mt="md">
                        <Input
                            icon={<FaCarAlt />}
                            placeholder=""
                            value={fabricante}
                            onChange={(e) => setFabricante(e.currentTarget.value)}
                        />
                    </Input.Wrapper>
                    ) : (
                        <Select 
                        label="Escolha o fabricante" 
                        className="mt-4" value={fabricantesSelect} 
                        data={fabricantes} 
                        onChange={(e) => setFabricantesSelect(e)} 
                        searchable
                        nothingFound="Sem resultados" />
                    )}

                    <Group position="left" mt="md" mb="xs">
                        <Input.Wrapper label="Escolha o modelo do veículo" mt="md">
                        <Input
                            icon={<FaCarAlt />}
                            placeholder=""
                            value={modelo}
                            onChange={(e) => setModelo(e.currentTarget.value)}
                        />
                    </Input.Wrapper>
                    </Group>

                    <Button variant="gradient" gradient={{ from: "teal", to: "blue", deg: 60 }} fullWidth mt="md" radius="md"
                    onClick={() => submit()}
                    >
                        Adicionar ‎ <IconChevronRight color="white" mt="3" size={15} />
                    </Button>
                </div>
                <div className="alert alert-danger mt-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                    {mensagem}
                </div>
            </Card>
        </Card>
    );
};

export default AdicionarModelo;
