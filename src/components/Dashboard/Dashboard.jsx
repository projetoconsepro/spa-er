import React, { useState, useEffect } from 'react'
import Grafico from './Grafico'
import { Card, Grid, Group, Text } from '@mantine/core'
import GraficoBola from './GraficoBola'
import { Carousel } from '@mantine/carousel';
import axios from 'axios';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaParking } from 'react-icons/fa';

const Dashboard = () => {
    const [setores, setSetores] = useState([])

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
    }, [])

  return (
    <div>
       <div className="row">
       <Carousel slideGap="md" height={200} slideSize={window.innerWidth <  768 ?  "90%" : "33.333333%"} dragFree loop align="center" slidesToScroll={window.innerWidth <  768 ?  1 : 3}>
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
                        <Text size="sm" weight={500}><FaParking />‎ Último movimento: {item.ultimoMovimento}</Text>
                    </Grid.Col>
                </Grid>
                </Card>
        </Carousel.Slide>
        ))}
            </Carousel>
                {window.innerWidth > 768 ? 
                <div className="col-12 mb-4 mt-4">
                    <div className="row">
                    <div className="card bg-white border-0 shadow divPers mx-2">
                        <div className={window.innerWidth > 1474 ? "card-body8 p-2" : "card-body4 p-2"}>
                            <div className="row">
                                <div className="ct-chart-sales-value ct-double-octave ct-series-g">
                                    <Grafico />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-white border-0 shadow divPers mx-3">
                        <div className={window.innerWidth > 1474 ? "card-body8 p-2" : "card-body4 p-2"}>
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
            </div>
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <div className="card border-0 shadow">
                                <div className="card-header">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h2 className="fs-5 fw-bold mb-0">Page visits</h2>
                                        </div>
                                        <div className="col text-end">
                                            <a href="#" className="btn btn-sm btn-primary">See all</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table align-items-center table-flush">
                                        <thead className="thead-light">
                                        <tr>
                                            <th className="border-bottom" scope="col">Page name</th>
                                            <th className="border-bottom" scope="col">Page Views</th>
                                            <th className="border-bottom" scope="col">Page Value</th>
                                            <th className="border-bottom" scope="col">Bounce rate</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <th className="text-gray-900" scope="row">
                                                /demo/admin/index.html
                                            </th>
                                            <td className="fw-bolder text-gray-500">
                                                3,225
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                $20
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                <div className="d-flex">
                                                    <svg className="icon icon-xs text-danger me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"></path></svg>
                                                    42,55%
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-gray-900" scope="row">
                                                /demo/admin/forms.html
                                            </th>
                                            <td className="fw-bolder text-gray-500">
                                                2,987
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                0
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                <div className="d-flex">
                                                    <svg className="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"></path></svg>
                                                    43,24%
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-gray-900" scope="row">
                                                /demo/admin/util.html
                                            </th>
                                            <td className="fw-bolder text-gray-500">
                                                2,844
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                            294
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                <div className="d-flex">
                                                    <svg className="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"></path></svg>
                                                    32,35%
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-gray-900" scope="row">
                                                /demo/admin/validation.html
                                            </th>
                                            <td className="fw-bolder text-gray-500">
                                                2,050
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                $147
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                <div className="d-flex">
                                                    <svg className="icon icon-xs text-danger me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"></path></svg>
                                                    50,87%
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-gray-900" scope="row">
                                                /demo/admin/modals.html
                                            </th>
                                            <td className="fw-bolder text-gray-500">
                                                1,483
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                $19
                                            </td>
                                            <td className="fw-bolder text-gray-500">
                                                <div className="d-flex">
                                                    <svg className="icon icon-xs text-success me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"></path></svg>
                                                    26,12%
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-xl-4">
                    <div className="col-12 px-0 mb-4">
                        <div className="card border-0 shadow">
                            <div className="card-body7">
                                <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
                                    <div>
                                        <div className="h6 mb-0 d-flex align-items-center">
                                            <svg className="icon icon-xs text-gray-500 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"></path></svg>
                                            Global Rank
                                        </div>
                                    </div>
                                    <div>
                                        <a href="#" className="d-flex align-items-center fw-bold">
                                            #755
                                            <svg className="icon icon-xs text-gray-500 ms-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"></path></svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between border-bottom py-3">
                                    <div>
                                        <div className="h6 mb-0 d-flex align-items-center">
                                            <svg className="icon icon-xs text-gray-500 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"></path></svg>
                                            Country Rank
                                        </div>
                                        <div className="small card-stats">
                                            United States
                                            <svg className="icon icon-xs text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"></path></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <a href="#" className="d-flex align-items-center fw-bold">
                                            #32
                                            <svg className="icon icon-xs text-gray-500 ms-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"></path></svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between pt-3">
                                    <div>
                                        <div className="h6 mb-0 d-flex align-items-center">
                                            <svg className="icon icon-xs text-gray-500 me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"></path><path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"></path></svg>
                                            Category Rank
                                        </div>
                                        <div className="small card-stats">
                                            Computers Electronics  Technology
                                            <svg className="icon icon-xs text-success" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"></path></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <a href="#" className="d-flex align-items-center fw-bold">
                                            #11
                                            <svg className="icon icon-xs text-gray-500 ms-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"></path></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default Dashboard