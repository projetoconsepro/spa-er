import axios from 'axios';
import { React, useState, useEffect } from 'react'
import '../pages/Style/styles.css';
import VoltarComponente from '../util/VoltarComponente';
import FuncTrocaComp from '../util/FuncTrocaComp';
import { Button, Card, Divider, Grid, Group, Input, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { rem } from '@mantine/core';
import { IconCar, IconCarOff, IconParking } from '@tabler/icons-react';
import { FaCar, FaCarAlt } from 'react-icons/fa';
import { BiCar, BiSolidCarGarage } from 'react-icons/bi';

const RegistrarVagaCliente = () => {
    const [mensagem, setMensagem] = useState("");
    const [estado, setEstado] = useState(false);
    const [inputVaga, setInputVaga] = useState("form-control fs-5");
    const [vaga, setVaga] = useState([]);
    const [resposta, setResposta] = useState([{}]);
    const [resposta2, setResposta2] = useState([]);
    const [valor, setValor] = useState(0);
    const [valorcobranca, setValorCobranca] = useState("");
    const [valorcobranca2, setValorCobranca2] = useState("2");
    const [selectedButton, setSelectedButton] = useState("01:00:00");
    const [placaSelecionada, setPlacaSelecionada] = useState("");

    const handleButtonClick = (buttonIndex) => {
        setSelectedButton(buttonIndex);
        const tempo1 = buttonIndex;
        if (tempo1 === "02:00:00") {
          setValorCobranca2(valorcobranca * 2);
        } else if (tempo1 === "01:00:00") {
          setValorCobranca2(valorcobranca);
        } else if (tempo1 === "01:30:00") {
          setValorCobranca2(valorcobranca * 1.5);
        } else if (tempo1 === "00:30:00") {
          setValorCobranca2(valorcobranca / 2);
        }
      };

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
   
    const parametros = axios.create({
        baseURL: process.env.REACT_APP_HOST,
    })

    useEffect(() => {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "cliente"
            }
        })
        requisicao.get('/veiculo').then(
            response => {
                setResposta(response?.data?.data);
                if (response.data.msg.resultado === false) {
                    FuncTrocaComp( "MeusVeiculos")
                    
                }
                for (let i = 0; i < response?.data?.data.length; i++) {
                    resposta2[i] = {};
                    resposta2[i].placa = response.data.data[i].usuario;
                }
            }
        ).catch(function (error) {
            if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });

        requisicao.get('/usuario/saldo-credito'
        ).then(
            response => {
                if(response.data.msg.resultado){
                    setValor(response.data.data.saldo);
                }
                else{
                    setValor(0);
                }
            }
        ).catch(function (error) {
            if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });

        parametros.get('/parametros').then(
            response => {
                setValorCobranca(response.data.data.param.estacionamento.valorHora)
            }
        ).catch(function (error) {
            if(error?.response?.data?.msg === "Cabeçalho inválido!" 
            || error?.response?.data?.msg === "Token inválido!" 
            || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
            } else {
                console.log(error)
            }
        });
    }, [])

    function mexerValores () {

        const tempo1 = selectedButton;

        if(tempo1 === "02:00:00"){
            return valorcobranca*2;
        }
        else if(tempo1 === "01:00:00"){
            return valorcobranca;
        }
        else if (tempo1 === "01:30:00"){
            return valorcobranca*1.5;
        }
        else if(tempo1 === "00:30:00"){
            return valorcobranca/2;
        }
    }

    const handleSubmit = async  () => {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "cliente"
            }
        })
        const tempo1 = selectedButton
        const placa2 = placaSelecionada;

        if (placaSelecionada === "") {
            setMensagem("Selecione um veículo.");
            setEstado(true);
            setTimeout(() => {
                setMensagem("");
                setEstado(false);
            }, 4000);
            return;
        }

        const resposta = await mexerValores();
        if(parseFloat(valor) <  parseFloat(resposta)){
            setMensagem("Saldo insuficiente.");
            setEstado(true);
            setTimeout(() => {
                setMensagem("");
                setEstado(false);
            }, 4000);
        }
        else{
                            
        if (vaga.length === 0) {
            vaga[0]= 0;
        }

            requisicao.post('/estacionamento', {
                placa: placa2,
                numero_vaga: vaga,
                tempo: tempo1,
                pagamento: "credito"
            }).then(
                response => {
                    if (response.data.msg.resultado === true) {
                        FuncTrocaComp("MeusVeiculos")
                        
                    }
                    else {
                        setMensagem(response.data.msg.msg);
                        setEstado(true);
                        setTimeout(() => {
                            setMensagem("");
                            setEstado(false);
                        }, 4000);
                    }
                }
            ).catch(function (error) {
                if(error?.response?.data?.msg === "Cabeçalho inválido!" 
                || error?.response?.data?.msg === "Token inválido!" 
                || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
                    localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("perfil");
                } else {
                    console.log(error)
                }
            });
        }
    }

    return (
        <div className="container">
                <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="h5 mt-2 align-items-center">
                                <small>Registrar estacionamento</small>
                            </div>

                            <Divider my="sm" size="md" variant="dashed" />

                            <div className="h6 mt-3 ">
                        <p className='text-start'>Selecione seu veículo:</p>
                    {resposta2.length > 3 ?
                    <Carousel slideGap="md" slideSize="25%" align="start" slidesToScroll={1} 
                    withIndicators
                    height={120}
                    styles={{
                        control: {
                            '&[data-inactive]': {
                              opacity: 0,
                              cursor: 'default',
                            },
                            marginTop: rem(40),
                            borderColor: 'rgba(0, 0, 0, .55)',
                        },
                      indicator: {
                        backgroundColor: 'rgba(0, 0, 0, .55)',
                        width: rem(12),
                        height: rem(4),
                        transition: 'width 250ms ease',
              
                        '&[data-active]': {
                          width: rem(40),
                        },
                      },
                    }}>
                        {resposta2.map((item, index) => (
                        <Carousel.Slide key={index}>
                                <Card padding="xs" radius="lg" 
                                className={placaSelecionada === item.placa ? 'bg-blue-500' : 'bg-blue-400'}
                                onClick={() => setPlacaSelecionada(item.placa)}>
                                <Grid>
                                    <Grid.Col span={12}>
                                    <Text fz="sm" weight={600}>{item.placa}</Text>
                                    <FaCar size={26} color="gray" className="mt-1" />
                                    </Grid.Col>
                                </Grid>
                                </Card>
                        </Carousel.Slide>
                        ))}
                        </Carousel>
                        :
                        <Group position="apart">
                        {resposta2.map((item, index) => (
                            <Grid>
                            <Grid.Col span={12}>
                            <Card padding="xs" radius="lg" 
                                className={placaSelecionada === item.placa ? 'bg-blue-500' : 'bg-blue-400'}
                                onClick={() => setPlacaSelecionada(item.placa)}>
                                    <Text fz="sm" weight={600}>{item.placa}</Text>
                                    <FaCar size={26} color="gray" className="mt-1" />
                            </Card>
                            </Grid.Col>
                            </Grid>
                        ))}
                        </Group>
                        }
                            </div>

                            <Divider my="sm" size="md" variant="dashed" />
                  <p className='text-start'>Determine o tempo (minutos):</p>
                  <div className="h6 mt-3 mx-2">
                  <Grid>
                    <Grid.Col span={3}>
                      <button 
                        type="button" className={`btn icon-shape icon-shape rounded align-center ${
                        selectedButton === "00:30:00" ? 'corTempoSelecionado ' : 'corTempo'}`}
                        onClick={() => handleButtonClick("00:30:00")}>
                        <Text fz="lg" weight={700}>30</Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button" className={`btn icon-shape icon-shape rounded align-center ${
                        selectedButton === "01:00:00" ? 'corTempoSelecionado' : 'corTempo'}`} 
                        onClick={() => handleButtonClick("01:00:00")}>
                        <Text fz="lg" weight={700}>60</Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button" className={`btn icon-shape icon-shape rounded align-center ${
                        selectedButton === "01:30:00" ? 'corTempoSelecionado' : 'corTempo'}`}
                        onClick={() => handleButtonClick("01:30:00")}>
                        <Text fz="lg" weight={700}>90</Text>
                      </button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <button
                        type="button" className={`btn icon-shape icon-shape rounded align-center ${
                        selectedButton === "02:00:00" ? 'corTempoSelecionado' : 'corTempo'}`}
                        onClick={() => handleButtonClick("02:00:00")}>
                        <Text fz="lg" weight={700}>120</Text>
                      </button>
                    </Grid.Col>
                  </Grid>
                <div className="mt-3">
              <p id="tempoCusto" className="text-end">
                {" "}
                Valor a ser cobrado: R$ {valorcobranca2}{" "}
              </p>
              </div>
            </div>

                    <Divider my="sm" size="md" variant="dashed" />

                            <div className="form-group mb-4 mt-4">
                                <p className='text-start m-0'>Número da vaga (opcional):</p>
                                <Input
                                icon={<IconParking />}
                                placeholder="Exemplo: 3"
                                mt="sm"
                                value={vaga} 
                                onChange={(e) => setVaga([e.target.value])}
                                />
                            </div>

                            <div className="mt-1 mb-5 gap-2 d-md-block">
                                <VoltarComponente space={true}/>
                                <Button onClick={handleSubmit} className="bg-blue-50" size="md" radius="md">Confirmar</Button>
                            </div>
                            <div className="alert alert-danger" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                {mensagem}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default RegistrarVagaCliente