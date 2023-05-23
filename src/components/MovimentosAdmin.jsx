import axios from 'axios'
import React, { useState, useEffect } from 'react'
import {  FaParking } from 'react-icons/fa'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import VoltarComponente from '../util/VoltarComponente'

const MovimentosAdmin = () => {
    const [data, setData] = useState([]);

    function ArrumaHora(data, hora ) {
        console.log(data)
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
                setData(newData);
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
    <div className="dashboard-container mb-5">
            <div className="row">
                <div className="col-12 col-xl-8">
                    <h5 className="text-start mx-2">Consultar movimentos</h5>
                    <div className="row">
                        <div className="col-12 mb-4">
                            <div>
                            {data.map((item, index) => (
                            <div className="card border-0 mt-2" key={index} >
                                <div className="card-body2">
                                    <div className="d-flex align-items-center justify-content-between pb-3">
                                        <div>
                                            <div className="h4 mb-0 d-flex align-items-center">
                                                SETOR {item.nome}
                                            </div>
                                    
                                            <div className="h6 mt-2 d-flex align-items-center fs-6  text-danger" id="estacionadocarroo">
                                            <h6><AiOutlineInfoCircle />‎ N° de notificações: {item.notificacoes}</h6>
                                            </div>
                                           
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><AiOutlineInfoCircle />‎ N° de ocupações: {item.ocupacao} </h6>
                                            </div>

                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><FaParking />‎ N° de tolerâncias: {item.tolerancia} </h6>
                                            </div>

                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><FaParking />‎ Último movimento: {item.ultimoMovimento} </h6>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            ))}
                          </div >
                        </div>
                    </div>
                    <VoltarComponente />
                </div>
            </div>
    </div>
  )
}

export default MovimentosAdmin