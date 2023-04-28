import axios from 'axios'
import { React, useEffect, useState } from 'react'
import { FaHistory } from 'react-icons/fa'
import CarroLoading from './Carregamento'
import { AiOutlineReload } from 'react-icons/ai'
import Swal from 'sweetalert2'

const HistoricoCaixa = () => {
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [estado, setEstado] = useState(false)
    const [mensagem, setMensagem] = useState("")
    const [dataHoje, setDataHoje] = useState("")
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

  
    function ArrumaHora(data, hora ) {
        const data2 = data.split("T");
        const data3 = data2[0].split("-");
        const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
        return data4;
    }

    const filtrarCaixa = () => {
        const filtro = document.getElementById("filtroSelect").value;

        if (filtro === "selectData") {
            Swal.fire({
                title: 'Filtrar por data',
                html: `<input type="date" id="data" class="form-control">`,
                showCancelButton: true,
                cancelButtonText: 'Fechar',
                confirmButtonText: 'Filtrar',
                preConfirm: () => {
                    const data = document.getElementById("data").value;
                    const requisicao = axios.create({
                        baseURL: process.env.REACT_APP_HOST,
                        headers: {
                          token: token,
                          id_usuario: user2.id_usuario,
                          perfil_usuario: user2.perfil[0],
                        },
                      });
                      const idrequisicao= `{where:{data=${data}}}`
                      const passar = btoa(idrequisicao)
                    requisicao.get(`/turno/caixa/admin/?query=${passar}`).then((response) => {
                       
                        const newData = response.data.data.map((item) => ({
                            nome: item.nome,
                            abertura: item.hora_abertura,
                            fechamento: item.hora_fechamento,
                            valor_abertura: item.valor_abertura,
                            valor_fechamento: item.valor_fechamento,
                            data: ArrumaHora(item.data)
                        }))
                        if(newData.length <= 0){
                          setEstado(true)
                          setMensagem("Nenhum registro encontrado")
                          }
                          else{
                            setEstado(false)
                            setMensagem("")
                            setData(newData)
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            })
        }
        if (filtro === "selectNome") {
          Swal.fire({
            title: 'Filtrar por nome',
            html: `<input type="text" id="nome" class="form-control">`,
            showCancelButton: true,
            cancelButtonText: 'Fechar',
            confirmButtonText: 'Filtrar',
            preConfirm: () => {
              const nome = document.getElementById("nome").value;
              const requisicao = axios.create({
                baseURL: process.env.REACT_APP_HOST,
                headers: {
                  token: token,
                  id_usuario: user2.id_usuario,
                  perfil_usuario: user2.perfil[0],
                },
              });
              const idrequisicao= `{where:{nome=${nome}}}`
              const passar = btoa(idrequisicao)
              requisicao.get(`/turno/caixa/admin/?query=${passar}`).then((response) => {
                console.log(response)
                const newData = response.data.data.map((item) => ({
                  nome: item.nome,
                  abertura: item.hora_abertura,
                  fechamento: item.hora_fechamento,
                  valor_abertura: item.valor_abertura,
                  valor_fechamento: item.valor_fechamento,
                  data: ArrumaHora(item.data)
                }))
                if(newData.length <= 0){
                  setEstado(true)
                  setMensagem("Nenhum registro encontrado")
                  }
                  else{
                    setEstado(false)
                    setMensagem("")
                    setData(newData)
                }
              }).catch((error) => {
                console.log(error)
              })
            }
        })
        }
    };

    useEffect(() => {
        const data = new Date();
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const dataHoje = ano + "-" + mes + "-" + dia;
        setDataHoje(dataHoje);

        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
              token: token,
              id_usuario: user2.id_usuario,
              perfil_usuario: user2.perfil[0],
            },
          });
          const idrequisicao= `{where:{data=${dataHoje}}}`
          const passar = btoa(idrequisicao)
          requisicao.get(`/turno/caixa/admin/?query=${passar}`).then((response) => {
            const newData = response.data.data.map((item) => ({
                nome: item.nome,
                abertura: item.hora_abertura,
                fechamento: item.hora_fechamento,
                valor_abertura: item.valor_abertura,
                valor_fechamento: item.valor_fechamento,
                data: ArrumaHora(item.data)
            }))
            if(newData.length <= 0){
              setEstado(true)
              setMensagem("Nenhum registro encontrado")
              }
              else{
                setEstado(false)
                setMensagem("")
                setData(newData)
            }
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const mostrarInformacoes = (item) => {
        Swal.fire({
            title: 'Histórico do caixa',
            html: `<p class="text-start mx-5"><b>Monitor:</b> ${item.nome}</p>
                   <p class="text-start mx-5"><b>Data:</b> ${item.data}</p>
                   <p class="text-start mx-5"><b>Abertura:</b> ${item.abertura}</p>
                   <p class="text-start mx-5"><b>Fechamento:</b> ${item.fechamento}</p>
                   <p class="text-start mx-5"><b>Valor abertura:</b> R$${item.valor_abertura},00</p>
                   <p class="text-start mx-5"><b>Valor fechamento:</b> ${item.valor_fechamento === null ? 'Caixa em aberto' : `R$${item.valor_fechamento},00`}</p>`,
            showCancelButton: true,
            cancelButtonText: 'Fechar',
            showConfirmButton: false,
            }).then((result) => {
            if (result.isConfirmed) {
                
            } else if (result.isDenied) {
                
            } else if (result.isDismissed) {
                Swal.close();
            }
            });
    }

    const reload = () => {
        const data = new Date();
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const dataHoje = ano + "-" + mes + "-" + dia;
        setDataHoje(dataHoje);

        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
              token: token,
              id_usuario: user2.id_usuario,
              perfil_usuario: user2.perfil[0],
            },
          });
          const idrequisicao= `{where:{data=${dataHoje}}}`
          const passar = btoa(idrequisicao)
          requisicao.get(`/turno/caixa/admin/?query=${passar}`).then((response) => {
            const newData = response.data.data.map((item) => ({
                nome: item.nome,
                abertura: item.hora_abertura,
                fechamento: item.hora_fechamento,
                valor_abertura: item.valor_abertura,
                valor_fechamento: item.valor_fechamento,
                data: ArrumaHora(item.data)
            }))
            if(newData.length <= 0){
              setEstado(true)
              setMensagem("Nenhum registro encontrado")
              }
              else{
                setEstado(false)
                setMensagem("")
                setData(newData)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className="dashboard-container">
        <p className="mx-3 text-start fs-4 fw-bold">Histórico do caixa:</p>
        <div> 
            <div className="row">
        <div className="col-8">
        <select className="mx-3 form-select form-select-sm mb-3" onChange={() => {filtrarCaixa()}} defaultValue="1" aria-label=".form-select-lg example" id="filtroSelect">
          <option disabled  value='1' id="filtro">Filtro</option>
          <option value="selectData">Data</option>
          <option value="selectNome">Nome</option>
          </select>
          </div>
          <div className="col-3 text-end">
            <AiOutlineReload className="mt-1" size={21} onClick={() => {reload()}}/>
          </div>
          <div className="col-1">

          </div>
          </div>
          </div>
        <div className="row">
          <div className="col-12 col-xl-8">
            <div className="row">
              <div className="col-12 mb-4">
                <div className="card border-0 shadow">
                  <div className="table-responsive">
                    <table className="table align-items-center table-flush">
                      <thead className="thead-light">
                        <tr>
                        <th className="border-bottom" scope="col">
                            Data
                          </th>
                          <th className="border-bottom" scope="col">
                            Monitor
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col">
                            Abertura
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col">
                            Fechamento
                          </th>
                          <th className="border-bottom" id="tabelaUsuarios2" scope="col">
                            Valor abertura
                          </th>
                          <th className="border-bottom" scope="col">
                            Valor fechamento
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                    {data.map((item, index) => (
                        <tr key={index} onClick={() => {mostrarInformacoes(item)}}>
                          <td>{item.data}</td>
                          <td> {item.nome.length > 14 ? item.nome.substring(0, 14) + "..." : item.nome}</td>
                          <td id="tabelaUsuarios2">{item.abertura}</td>
                          <td id="tabelaUsuarios2">{item.fechamento}</td>
                          <td id="tabelaUsuarios2">R${item.valor_abertura},00</td>
                          <td>{item.valor_fechamento === null ? 'Caixa em aberto' : `R$${item.valor_fechamento},00`}</td>
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

export default HistoricoCaixa