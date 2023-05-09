import axios from 'axios'
import { React, useState, useEffect } from 'react'
import { AiFillPrinter, AiOutlineReload } from 'react-icons/ai'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2'
import Paginacao from '../util/Paginacao';
import RelatoriosPDF from '../util/RelatoriosPDF';

const ListarNotificacoesAdmin = () => {
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [data3, setData3] = useState([])
    const [estado, setEstado] = useState(false)
    const [mensagem, setMensagem] = useState('')
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
  
    function handlePaginatedData(currentItems) {
      setData(currentItems);
    }

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

      const createPDF = () => {
        const nomeArquivo = 'Relatório de irregularidades'
        const cabecalho = ['Data', 'Placa', 'Vaga', 'Estado', 'Fabricante', 'Modelo', 'Tipo', 'Valor'];
        RelatoriosPDF(nomeArquivo, cabecalho, data)
      }

      const mostrar = async (item, index) => {
        const requisicao = axios.create({
          baseURL: process.env.REACT_APP_HOST,
          headers: {
            token: token,
            id_usuario: user2.id_usuario,
            perfil_usuario: user2.perfil[0],
          },
        });
        if(item.pendente === 'Pendente') {
        Swal.fire({
            title: 'Informações da notificação',
            html: `<p><b>Data:</b> ${item.data}</p>
                   <p><b>Placa:</b> ${item.placa}</p>
                   <p><b>Estado:</b> ${item.pendente}</p>
                   <p><b>Modelo:</b> ${item.modelo}</p>
                   <p><b>Fabricante:</b> ${item.fabricante}</p>
                   <p><b>Tipo:</b> ${item.tipo}</p>
                   <p><b>Valor:</b> R$${item.valor},00</p>
                   <p><b>Monitor:</b> ${item.monitor}</p>
                   <p><b>Hora:</b> ${item.hora}</p>`,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Regularizar',
            confirmButtonColor: '#3A58C8',
            cancelButtonText: 'Fechar',
            }).then((result) => {
            if (result.isDismissed) {
                Swal.close();
            }
            else if(result.isConfirmed){
              requisicao.put('/notificacao/',{
                "id_vaga_veiculo": item.id_vaga_veiculo,
            }).then((response) => {
              if (response.data.msg.resultado) {
                Swal.fire("Regularizado!", "A notificação foi regularizada.", "success");
                data[index].pendente = 'Quitado';
                setData([...data]);
              }
              else {
                setEstado(true);
                setMensagem(response.data.msg.msg);
                setTimeout(() => {
                  setEstado(false);
                  setMensagem("")
                }, 5000);
              }
            }).catch((error) => {
            })
            }
            });
          }else{
            Swal.fire({
              title: 'Informações da notificação',
              html: `<p><b>Data:</b> ${item.data}</p>
                     <p><b>Placa:</b> ${item.placa}</p>
                     <p><b>Estado:</b> ${item.pendente}</p>
                     <p><b>Modelo:</b> ${item.modelo}</p>
                     <p><b>Fabricante:</b> ${item.fabricante}</p>
                     <p><b>Tipo:</b> ${item.tipo}</p>
                     <p><b>Valor:</b> R$${item.valor},00</p>
                     <p><b>Monitor:</b> ${item.monitor}</p>
                     <p><b>Hora:</b> ${item.hora}</p>`,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: 'Fechar',
              }).then((result) => {
              if (result.isDismissed) {
                  Swal.close();
              }
              });
          }
        }

    const filtroSelect = async () => {
        const select = document.getElementById('filtroSelect').value
        if (select === 'selectData') {
          setEstado(false)
          setMensagem('')
          Swal.fire({
            title: 'Filtrar por data',
            html: `<input type="date" id="data" class="form-control">`,
            showCancelButton: true,
            cancelButtonText: 'Fechar',
            confirmButtonText: 'Filtrar',
            preConfirm: () => {
                const data = document.getElementById("data").value;
                const data4 = ArrumaHora(data)
                const newData = data2.filter((item) => item.data === data4)
                setData(newData)
                if (newData.length === 0) {
                    setEstado(true)
                    setMensagem('Nenhum dado encontrado')
                }
            }
        })
        }
        else if(select === 'selectTodos'){
          setEstado(false)
          setMensagem('')
          setData(data3)
        }
        else if(select === 'selectPlaca'){
          setEstado(false)
          setMensagem('')
            Swal.fire({
                title: 'Filtrar por placa',
                html: `<input type="text" id="placaId" class="form-control">`,
                showCancelButton: true,
                cancelButtonText: 'Fechar',
                confirmButtonText: 'Filtrar',
                preConfirm: () => {
                    const placa = document.getElementById("placaId").value;
                    const placa2 = placa.toUpperCase()
                    const newData = data2.filter((item) => item.placa === placa2)
                    setData(newData)
                    if (newData.length === 0) {
                        setEstado(true)
                        setMensagem('Nenhum dado encontrado')
                    }
                }
            })
        }
      else if(select === 'selectVaga'){
        setEstado(false)
        setMensagem('')
        Swal.fire({
            title: 'Filtrar por vaga',
            html: `<input type="number" id="vaga" class="form-control">`,
            showCancelButton: true,
            cancelButtonText: 'Fechar',
            confirmButtonText: 'Filtrar',
            preConfirm: () => {
                const vaga = document.getElementById("vaga").value;
                const newData = data2.filter((item) => item.vaga == vaga)
                setData(newData)
                if (newData.length === 0) {
                    setEstado(true)
                    setMensagem('Nenhum dado encontrado')
                }
            }
        })
      }
      else if(select === 'selectTipo'){
        setEstado(false)
        setMensagem('')
        const inputOptions = new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              'S': 'Quitado',
              'N': 'Pendente'
            })
          }, 1000)
        })
        
        const { value: color } = await Swal.fire({
          title: 'Selecione o estado da notificação',
          input: 'radio',
          inputOptions: inputOptions,
          inputValidator: (value) => {
            if (!value) {
              return 'Você deve selecionar um estado de notificação!'
            }
          }
        })
        if (color) {
          const newData = data2.filter((item) => item.pendente === color)
          setData(newData)
          if (newData.length === 0) {
            setEstado(true)
            setMensagem('Nenhum dado encontrado')
        }
        }
        
      }
    }

    useEffect(() => {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
              token: token,
              id_usuario: user2.id_usuario,
              perfil_usuario: user2.perfil[0],
            },
          });
          requisicao.get('/notificacao').then((response) => {
            console.log(response)
            const newData = response.data.data.map((item) => ({
                data: ArrumaHora(item.data),
                placa: item.veiculo.placa,
                vaga: item.vaga,
                pendente: item.pago === 'S' ? 'Quitado' : 'Pendente',
                fabricante: item.veiculo.modelo.fabricante.nome,
                modelo: item.veiculo.modelo.nome,
                tipo: item.tipo_notificacao.nome,
                valor: item.valor,
                id_vaga_veiculo: item.id_vaga_veiculo,
                id_notificacao: item.id_notificacao,
                monitor: item.monitor.nome,
                hora: ArrumaHora2(item.data),
            }));
            setData(newData)
            setData2(newData)
            setData3(newData)

        }).catch((error) => {
            console.log(error)
          })
    }, [])

    const reload = () => {
      setEstado(false)
      setMensagem("")
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });
      requisicao.get('/notificacao').then((response) => {
        const newData = response.data.data.map((item) => ({
          data: ArrumaHora(item.data),
          placa: item.veiculo.placa,
          vaga: item.vaga,
          pendente: item.pago === 'S' ? 'Quitado' : 'Pendente',
          fabricante: item.veiculo.modelo.fabricante.nome,
          modelo: item.veiculo.modelo.nome,
          tipo: item.tipo_notificacao.nome,
          valor: item.valor,
          id_vaga_veiculo: item.id_vaga_veiculo,
          id_notificacao: item.id_notificacao,
          monitor: item.monitor.nome,
          hora: ArrumaHora2(item.data),
        }));
        setData(newData)
        setData2(newData)
        setData3(newData)
    }).catch((error) => {
        console.log(error)
      })
  }


  return (
    <div className="dashboard-container">
        <p className="mx-3 text-start fs-4 fw-bold">Listar notificações</p>
        <div className="row">
        <div className="col-12">
        <div className="row">
        <div className="col-7">
        <select className="mx-3 form-select form-select-sm mb-3" defaultValue="1" onChange={() => {filtroSelect()}} aria-label=".form-select-lg example" id="filtroSelect">
          <option disabled  value='1' id="filtro">Filtro</option>
          <option value="selectData">Data</option>
          <option value="selectPlaca">Placa</option>
          <option value="selectVaga">Vaga</option>
          <option value="selectTipo">Tipo</option>
          <option value="selectTodos">Todos</option>
          </select>
          </div>
          <div className="col-3 text-end">
          <button className="btn3 botao p-0 w-75 h-75" type="button" onClick={() => {createPDF()}}><AiFillPrinter  size={21}/></button>
          </div>
          <div className="col-1 text-end">
            <AiOutlineReload onClick={() => {reload()}} className="mt-1" size={21}/>
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
                        <th className="border-bottom" id="tabelaUsuarios" scope="col">
                            Data
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios" scope="col">
                            Placa
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios" scope="col">
                            Vaga
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios" scope="col">
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

                    {data.map((item, index) => (
                        <tr key={index} onClick={()=>mostrar(item, index)}>
                          <td>{item.data}</td>
                          <td>{item.placa}</td>
                          <td> {item.vaga}</td>
                          <td style={
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
          </div>
        </div>
      </div>
  )
}

export default ListarNotificacoesAdmin