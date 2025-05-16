import { React, useState, useEffect } from 'react'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import Swal from 'sweetalert2'
import moment from 'moment'
import VoltarComponente from '../util/VoltarComponente';
import FuncTrocaComp from '../util/FuncTrocaComp';
import Filtro from '../util/Filtro'
import createAPI from '../services/createAPI'
import { Button, Group, Pagination } from '@mantine/core'
import CarroLoading from './Carregamento'
import { IconReload } from '@tabler/icons-react';
import {ArrumaHora2, ArrumaHora3} from "../util/ArrumaHora";
import { TfiWrite } from 'react-icons/tfi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useDisclosure } from "@mantine/hooks";
import { Modal } from '@mantine/core';
import { IconMapSearch } from "@tabler/icons-react";
import Mapa from "../util/Mapa";

const ListarNotificacoesAgente = () => {
    const [data, setData] = useState([])
    const [estado, setEstado] = useState(false)
    const [mensagem, setMensagem] = useState('')
    const [sortAsc, setSortAsc] = useState(true);
    const [estadoLoading, setEstadoLoading] = useState(false)
    const [mostrarColunasCompletas, setMostrarColunasCompletas] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const [enderecoMapa, setEnderecoMapa] = useState('');
      
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);

  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        localStorage.removeItem('autoInfracao')
        for (let i = 0; i < 8; i++) {
          localStorage.removeItem(`fotoInfracao`);
        }
        reload()
    }, [])

    const abrirMapa = (item) => {
      setEnderecoMapa(item.endereco || item.local || '');
      open();
    };

    const mostrar = async (item) => {
        const width = window.innerWidth
        if(width < 768){
        Swal.fire({
            title: 'Informações da notificação',
            html: `<p><b>Data:</b> ${item.data}</p>
                   <p><b>Placa:</b> ${item.placa}</p>
                   <p><b>Estado:</b> ${item.pendente === 'Pendente' ? 'Pendente' : 'Quitado'}</p>
                   <p><b>Modelo:</b> ${item.modelo}</p>
                   <p><b>Fabricante:</b> ${item.fabricante}</p>
                   <p><b>Cor do veículo:</b> ${item.cor}</p>
                   <p><b>Tipo:</b> ${item.tipo}</p>
                   <p><b>Valor:</b> R$${item.valor}</p>
                   <p><b>Monitor:</b> ${item.monitor}</p>
                   <p><b>Hora:</b> ${item.hora}</p>`,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Auto de infração',
            cancelButtonText: 'Fechar',
            }).then((result) => {
            if (result.isDismissed) {
                Swal.close();
            }
            else if (result.isConfirmed) {
                localStorage.setItem('autoInfracao', JSON.stringify(item))
                FuncTrocaComp('AutoInfracao')
            }
            });
        }else{
          localStorage.setItem('autoInfracao', JSON.stringify(item))
          FuncTrocaComp('AutoInfracao')
        }
        }

    const reload = () => {
      setEstado(false)
      setMensagem("")
      setMostrarColunasCompletas(false);
      const requisicao = createAPI();
      requisicao.get('/notificacao').then((response) => {
        console.log('reload: ',response.data)
        if (response.data.msg.resultado){
          setEstado(false)
          const newData = response.data.data.map((item) => ({
            placa: item.placa, // Agora vem direto do item
            vaga: item.vaga,
            notificacoesPendentes: item.notificacoes_pendentes,
            endereco: item.endereco,
            data: ArrumaHora3(item.data),
            cancelada: item.cancelada,
            cancelada_motivo: item.cancelada_motivo,
            pendente: item.pendente === 'S' ? 'Quitado' : 'Pendente', // Atualizado para usar item.pendente
            fabricante: item.fabricante, // Agora vem direto do item
            modelo: item.modelo, // Agora vem direto do item
            tipo: item.tipo?.nome || item.tipo, // Adaptado para ambos os formatos
            valor: item.valor,
            cor: item.cor,
            id_vaga_veiculo: item.id_vaga_veiculo,
            id_notificacao: item.id_notificacao,
            monitor: item.monitor,
            hora: ArrumaHora2(item.hora),
          }));
          setEstadoLoading(false)
          setData(newData)
        }
        else {
          setData([])
          setEstadoLoading(false)
          setEstado(true)
          setMensagem("Não há notificações para exibir")
        }
      }).catch((error) => {
      if(error?.response?.data?.msg === "Cabeçalho inválido!" 
      || error?.response?.data?.msg === "Token inválido!" 
      || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("perfil");
      } else {
          console.log(error)
      }
      })
  }

  const handleSort = () => {
    setData(data => [...data].sort((a, b) => {
      if (sortAsc) {
        return moment(a.data, 'DD/MM/YYYY').toDate() - moment(b.data, 'DD/MM/YYYY').toDate();
      } else {
        return moment(b.data, 'DD/MM/YYYY').toDate() - moment(a.data, 'DD/MM/YYYY').toDate();
      }
    }));
    setSortAsc(prevSortAsc => !prevSortAsc);
  };

  const handleConsultaSelected = (consulta) => {
    handleFiltro(consulta)
  }

  const handleFiltro = (where) => {
  setEstado(false);
  setEstadoLoading(true);
  setMensagem("");
  setMostrarColunasCompletas(true);
  const requisicao = createAPI();
  const base64 = btoa(where);
  
  requisicao.get(`/notificacao/?query=${base64}`).then((response) => {
    console.log('reload: ',response.data);
    if (response.data.data?.length > 0) {
      const newData = response.data.data.map((item) => ({
        // Mapeamento para o formato do FILTRO
        placa: item.veiculo?.placa || 'N/A',
        vaga: item.vaga || 'N/A',
        endereco: item.local || 'N/A', // campo "local" no filtro
        data: item.data ? ArrumaHora3(item.data) : 'N/A',
        cancelada: item.cancelada || 'N',
        pendente: item.pago === 'S' ? 'Quitado' : 'Pendente', // usa "pago" no filtro
        fabricante: item.veiculo?.modelo?.fabricante?.nome || 'N/A',
        modelo: item.veiculo?.modelo?.nome || 'N/A',
        tipo: item.tipo_notificacao?.nome || 'N/A', // campo "tipo_notificacao" no filtro
        valor: item.valor || 0,
        cor: item.veiculo?.cor || 'N/A',
        id_vaga_veiculo: item.id_vaga_veiculo || null,
        id_notificacao: item.id_notificacao || null,
        monitor: item.monitor?.nome || 'N/A', // objeto "monitor" no filtro
        hora: item.data ? ArrumaHora2(item.data) : 'N/A',
        notificacoesPendentes: 0 // não existe no filtro, coloquei 0 como padrão
      }));
      
      setData(newData);
    } else {
      setData([]);
      setEstado(true);
      setMensagem("Não há notificações para exibir");
    }
    setEstadoLoading(false);
  }).catch((error) => {
    if(error?.response?.data?.msg === "Cabeçalho inválido!" 
    || error?.response?.data?.msg === "Token inválido!" 
    || error?.response?.data?.msg === "Usuário não possui o perfil mencionado!"){
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("perfil");
    } else {
        console.log(error)
    }
    })
}



  return (
    <div className="dashboard-container">
        <p className="mx-3 text-start fs-4 fw-bold">Notificações</p>
        <div className="row mb-3">
        <div className="col-12">
        <div className="row">
        <div className="col-7 mx-2">
        <Filtro nome={'ListarNotificacoesAgente'} onConsultaSelected={handleConsultaSelected} onLoading={estadoLoading}/>
          </div>
          <div className="col-2 text-end">
          </div>
          <div className="col-2 text-end">
            <Button
                    variant="gradient"
                    gradient={{ from: "indigo", to: "blue", deg: 60 }}
                    radius="md"
                    size="sm"
                    onClick={() => reload()}
                  >
                    <IconReload color="white" size={20} />
                </Button>
          </div>
          </div>
          </div>
          </div>
            <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12 mb-4">
                <div className="card border-0 shadow">
                  <div className="table-responsive">
                    <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        {mostrarColunasCompletas ? (
                          <>
                            <th className="border-bottom" scope="col" onClick={() => handleSort()}>
                              Data {sortAsc ? <AiOutlineArrowUp className="mb-1" size={15} /> : <AiOutlineArrowDown className="mb-1" size={15} />}
                            </th>
                            <th className="border-bottom" scope="col">Hora</th>
                            <th className="border-bottom" scope="col">Placa</th>
                            <th className="border-bottom" scope="col">Vaga</th>
                            <th className="border-bottom" scope="col">Estado</th>
                            <th className="border-bottom" scope="col">Fabricante</th>
                            <th className="border-bottom" scope="col">Modelo</th>
                            <th className="border-bottom" scope="col">Tipo</th>
                            <th className="border-bottom" scope="col">Valor</th>
                            <th className="border-bottom" scope="col">Ação</th>
                          </>
                        ) : (
                          <>
                            <th className="border-bottom" scope="col">Placa</th>
                            <th className="border-bottom" scope="col">Vaga</th>
                            <th className="border-bottom" scope="col">Notificações Pendentes</th>
                            <th className="border-bottom" scope="col">Endereço</th>
                            <th className="border-bottom" scope="col">Ação</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => {
                        if (!item) return null; // Ignora itens nulos
                        
                        return (
                          <tr key={index}>
                            {mostrarColunasCompletas ? (
                              <>
                                <td>{item.data}</td>
                                <td>{item.placa}</td>
                                <td>{item.vaga}</td>
                                <td style={item.pendente === 'Quitado' ? {color: 'green'} : {color: 'red'}}>
                                  {item.pendente}
                                </td>
                                <td>{item.fabricante}</td>
                                <td>{item.modelo}</td>
                                <td>{item.tipo}</td>
                                <td>{item.valor}</td>
                                <td>{item.hora}</td>
                              </>
                            ) : (
                              <>
                                <td>{item.placa}</td>
                                <td>{item.vaga}</td>
                                <td style={{ color: 'red' }}>{item.notificacoesPendentes}</td>
                                <td>{item.endereco}</td>
                                <td>
                                  <div style={{ display: 'flex', gap: '10px' }}>
                                    {window.innerWidth < 768 ? (
                                      <AiOutlineInfoCircle 
                                        className="cursor-pointer hover:text-blue-500" 
                                        style={{ fontSize: '1.2rem' }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          mostrar(item);
                                        }} 
                                      />
                                    ) : (
                                      <TfiWrite 
                                        className="cursor-pointer hover:text-blue-500" 
                                        style={{ fontSize: '1.2rem' }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          localStorage.setItem('autoInfracao', JSON.stringify(item));
                                          FuncTrocaComp('AutoInfracao');
                                        }}
                                      />
                                    )}
                                    <IconMapSearch 
                                      className="cursor-pointer hover:text-blue-500" 
                                      style={{ fontSize: '1.2rem' }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        abrirMapa(item);
                                      }}
                                    />
                                  </div>
                                </td>
                              </>
                            )}
                            </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                  <div className="alert alert-danger mt-4 mx-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                        {mensagem}
                    </div>

                    {data.length === 0 ?
                    <div>
                      <CarroLoading />
                    </div>
                  : null}
                </div>
              </div>

            </div>
            {/* Modal do Mapa - NOVO CÓDIGO */}
            <Modal size="xl" opened={opened} onClose={close} title="Endereço no mapa" centered>
                <Mapa address={`${enderecoMapa}, Centro, Taquara, RS, 95600000`} />
            </Modal>
            <Group position="center" mb="md">
                <Pagination value={currentPage} size="sm" onChange={handlePageChange} total={Math.floor(data.length / 50) === data.length / 50 ? data.length / 50 : Math.floor(data.length / 50) + 1} limit={itemsPerPage} />
            </Group>
            <VoltarComponente />
          </div>
        </div>
      </div>
  )
}

export default ListarNotificacoesAgente;