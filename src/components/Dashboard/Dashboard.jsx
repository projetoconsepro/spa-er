/*
import React, { useState, useEffect } from 'react'
import Grafico from './Grafico'
import { Card, Grid, Group, Text } from '@mantine/core'
import GraficoBola from './GraficoBola'
import { Carousel } from '@mantine/carousel';
import axios from 'axios';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaParking } from 'react-icons/fa';
 */

const Dashboard = () => {
    /*const [setores, setSetores] = useState([])

    function ArrumaHora(data, hora ) {
        if(data !== 'Nenhum registrado'){
            const data2 = data.split("T");
            const data3 = data2[0].split("-");
            const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
            const data6 = data2[1].split(":");
            const data5 = data4 + " " + (data6[0]-3) + ":" + data6[1];
            return data5;
        }
        else{
            return data;
        }
    }

    const requisicaoSetores = async () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        const user2 = JSON.parse(user);
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
              token: token,
              id_usuario: user2.id_usuario,
              perfil_usuario: user2.perfil[0]
            },
          });

          requisicao.get('/setores/admin'
          ).then(
              response => {
                  const newData = response?.data?.data?.setores.map((item) => ({
                        id_setor: item.id_setor,
                        nome: item.nome,
                        ocupacao: item.ocupacao,
                        notificacoes: item.notificacoes,
                        tolerancia: item.tolerancia,
                        ultimoMovimento: ArrumaHora(item.ultimoMovimento),
                    }))
                setSetores(newData);
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
          }
          );

    }

    useEffect(() => {
        requisicaoSetores()
    }, [])*/

  return (
    <div>
        <h1>RETIRADO DASHBOARD PARA TESTES.</h1>
       { /*<div className="row">
       <Carousel slideGap="md" height={200} slideSize={window.innerWidth <  768 ?  "90%" : "33.333333%"} dragFree align="center" slidesToScroll={window.innerWidth <  768 ?  1 : 3}>
        {setores.map((item, index) => (
        <Carousel.Slide key={index}>
                <Card padding="lg" radius="md" withBorder className="text-start bg-blue-100">
                <Grid>
                    <Grid.Col span={4}>
                    <Group position="center" mt="md">
                    <div className="icon-shape icon-shape bg-blue-200 rounded me-4 me-sm-0">
                        <Text fz="lg" className='text-white' weight={700}>{item.nome}</Text>
                    </div>
                    </Group>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Text size="lg" weight={500}>Setor: {item.nome}</Text>
                        <Text size="sm" weight={500} color="red"><AiOutlineInfoCircle />‎ N° de notificações: {item.notificacoes}</Text>
                        <Text size="sm" weight={500}><AiOutlineInfoCircle />‎ N° de ocupações: {item.ocupacao}</Text>
                        <Text size="sm" weight={500}><FaParking />‎ N° de tolerâncias: {item.tolerancia}</Text>
                        <Text size="sm" weight={500}><FaParking />‎ Último movimento: {item.ultimoMovimento} ‎ ‎</Text>
                    </Grid.Col>
                </Grid>
                </Card>
        </Carousel.Slide>
        ))}
            </Carousel>
                {window.innerWidth > 768 ? 
                <div className="col-12 mb-4 mt-4">
                    <div className="row">
                        <Group position="center">
                    <div className="card bg-white border-0 shadow divPers mx-2">
                        <div className={ window.innerWidth > 1474 ? "card-body8 p-2" : "card-body4 p-2" }>
                            <div className="row">
                                <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                                    <Grafico />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-white border-0 shadow divPers mx-3">
                        <div className={ window.innerWidth > 1474 ? "card-body8 p-2" : "card-body4 p-2" }>
                        <h4 style={{ textAlign: 'start', margin: '1rem' }}>Movimentos dos setores:</h4>
                            <div className="row">
                                <div className="col-3">
                                </div>

                                <div className="col-6">
                                <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                                    <GraficoBola />
                                    </div>
                                </div>
                                <div className="col-3">
                                </div>
                            </div>
                        </div>
                    </div>
                    </Group>
                    </div>
                </div>
                : 
                <div className="col-12 mb-4 mt-4">
                    <div className="row">
                    <div className="card bg-white border-0 shadow w-100">
                        <div className="card-body7 p-2">
                            <div className="row">
                                <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                                    <Grafico />
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="row mt-3">
                    <div className="card bg-white border-0 shadow w-100">
                    <h4 style={{ textAlign: 'start', margin: '1rem' }}>Movimentos dos setores:</h4>
                        <div className="card-body8 p-2">
                            <div className="row">
                            <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                            <GraficoBola />
                            </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                }
            </div> */ }
    </div>
  )
}

export default Dashboard