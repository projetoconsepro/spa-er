import axios from 'axios'
import { React, useState, useEffect } from 'react'
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineReload } from 'react-icons/ai'
import Swal from 'sweetalert2'
import moment from 'moment'
import VoltarComponente from '../util/VoltarComponente';
import FuncTrocaComp from '../util/FuncTrocaComp';
import Filtro from '../util/Filtro'
import createAPI from '../services/createAPI'
import { Group, Pagination } from '@mantine/core'

const ListarNotificacoesAgente = () => {
    const [data, setData] = useState([])
    const [estado, setEstado] = useState(false)
    const [mensagem, setMensagem] = useState('')
    const [sortAsc, setSortAsc] = useState(true);
    const [estadoLoading, setEstadoLoading] = useState(false)
      
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);

  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);



    function ArrumaHora(data, hora ) {
        const data2 = data.split("T");
        const data3 = data2[0].split("-");
        const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
        return data4;
    }

    function ArrumaHora2(data) {
      const data2 = data.split("T");
      const data6 = data2[1].split(":");
      const data5 = (data6[0]-3) + ":" + data6[1] + ":";
      const data7 = data5 + data6[2].split(".")[0];
      return data7;
    }

    useEffect(() => {
        localStorage.removeItem('autoInfracao')
        for (let i = 0; i < 8; i++) {
          localStorage.removeItem(`fotoInfracao`);
        }
        reload()
    }, [])

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
      const requisicao = createAPI();
      requisicao.get('/notificacao').then((response) => {
        if (response.data.msg.resultado){
          setEstado(false)
          const newData = response.data.data.map((item) => ({
            data: ArrumaHora(item.data),
            placa: item.veiculo.placa,
            cancelada: item.cancelada,
            cancelada_motivo: item.cancelada_motivo,
            vaga: item.vaga,
            pendente: item.pago === 'S' ? 'Quitado' : 'Pendente',
            fabricante: item.veiculo.modelo.fabricante.nome,
            modelo: item.veiculo.modelo.nome,
            tipo: item.tipo_notificacao.nome,
            valor: item.valor,
            cor : item.veiculo.cor,
            id_vaga_veiculo: item.id_vaga_veiculo,
            id_notificacao: item.id_notificacao,
            monitor: item.monitor.nome,
            hora: ArrumaHora2(item.data),
          }));
          setData(newData)
        }
        else {
          setData([])
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
    setEstado(false)
    setEstadoLoading(true)
    setMensagem("")
    const requisicao = createAPI();
    const base64 = btoa(where)
    requisicao.get(`/notificacao/?query=${base64}`).then((response) => {
      if (response.data.data.length !== 0){
      setEstadoLoading(false)
      setEstado(false)
      const newData = response.data.data.map((item) => ({
        data: ArrumaHora(item.data),
        placa: item.veiculo.placa,
        cancelada: item.cancelada,
        cancelada_motivo: item.cancelada_motivo,
        vaga: item.vaga,
        pendente: item.pago === 'S' ? 'Quitado' : 'Pendente',
        fabricante: item.veiculo.modelo.fabricante.nome,
        modelo: item.veiculo.modelo.nome,
        tipo: item.tipo_notificacao.nome,
        valor: item.valor,
        cor : item.veiculo.cor,
        id_vaga_veiculo: item.id_vaga_veiculo,
        id_notificacao: item.id_notificacao,
        monitor: item.monitor.nome,
        hora: ArrumaHora2(item.data),
      }));
      setData(newData)
    }
    else {
      setEstadoLoading(false)
      setData([])
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



  return (
    <div className="dashboard-container">
        <p className="mx-3 text-start fs-4 fw-bold">Notificações pendentes</p>
        <div className="row mb-3">
        <div className="col-12">
        <div className="row">
        <div className="col-7 mx-2">
        <Filtro nome={'ListarNotificacoesAgente'} onConsultaSelected={handleConsultaSelected} onLoading={estadoLoading}/>
          </div>
          <div className="col-3 text-end">
          </div>
          <div className="col-1 text-end">
            <AiOutlineReload onClick={() => {reload()}} className="mt-1" size={21} />
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
                        <th className="border-bottom" id="tabelaUsuarios" scope="col" onClick={()=>{handleSort()}}>
                            Data {sortAsc ? <AiOutlineArrowUp className="mb-1" size={15} /> : <AiOutlineArrowDown className="mb-1" size={15} />}
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios" scope="col">
                            Placa
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios" scope="col">
                            Vaga
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col">
                            Estado
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col">
                            Fabricante
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col">
                            Modelo
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col">
                            Tipo
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col">
                            Valor
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col">
                            Hora
                          </th>
                        </tr>
                      </thead>
                      <tbody>

                    {currentItems.map((item, index) => (
                        <tr key={index} onClick={()=>{mostrar(item)}}>
                          <td>{item.data}</td>
                          <td>{item.placa}</td>
                          <td> {item.vaga}</td>
                          <td id="tabelaUsuarios2" style={
                            item.pendente === 'Quitado' ? {color: 'green'} : {color: 'red'}
                          }> {item.pendente}</td>
                          <td id="tabelaUsuarios2">{item.fabricante}</td>
                          <td id="tabelaUsuarios2">{item.modelo}</td>
                          <td id="tabelaUsuarios2">{item.tipo}</td>
                          <td id="tabelaUsuarios2">{item.valor}</td>
                          <td id="tabelaUsuarios2">{item.hora}</td>
                        </tr>
                    ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="alert alert-danger mt-4 mx-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                        {mensagem}
                    </div>
                </div>
              </div>

            </div>
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