import axios from 'axios'
import { React, useState, useEffect } from 'react'
import { AiOutlineReload } from 'react-icons/ai'

const ListarNotificacoesAdmin = () => {
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [estado, setEstado] = useState(false)
    const [mensagem, setMensagem] = useState('')
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    function ArrumaHora(data, hora ) {
        const data2 = data.split("T");
        const data3 = data2[0].split("-");
        const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
        return data4;
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
                id_notificacao: item.id_notificacao,
                data: ArrumaHora(item.data),
                placa: item.veiculo.placa,
                vaga: item.vaga,
                pendente: item.pago,
                fabricante: item.veiculo.modelo.fabricante.nome,
                modelo: item.veiculo.modelo.nome,
                tipo: item.tipo_notificacao.nome,
                valor: item.valor,
                monitor: item.monitor.nome,
            }));
            console.log('ESSA É A NEW DATA EM', newData)
            setData(newData)
        }).catch((error) => {
            console.log(error)
          })
    }, [])


  return (
    <div className="dashboard-container">
        <p className="mx-3 text-start fs-4 fw-bold">Listar notificações</p>
        <div>
        <div className="col-12 col-xl-8">
        <div className="row">
        <div className="col-8">
        <select className="mx-3 form-select form-select-sm mb-3" defaultValue="1" aria-label=".form-select-lg example" id="filtroSelect">
          <option disabled  value='1' id="filtro">Filtro</option>
          <option value="selectData">Data</option>
          <option value="selectPlaca">Placa</option>
          <option value="selectVaga">Vaga</option>
          <option value="selectTipo">Tipo</option>
          </select>
          </div>
          <div className="col-3 text-end">
            <AiOutlineReload className="mt-1" size={21}/>
          </div>
          <div className="col-1">
          </div>
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
                            Placa
                          </th>
                          <th className="border-bottom" scope="col">
                            Vaga
                          </th>
                          <th className="border-bottom" scope="col">
                            Pendente
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
                        </tr>
                      </thead>
                      <tbody>

                    {data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.data}</td>
                          <td>{item.placa}</td>
                          <td> {item.vaga}</td>
                          <td> {item.pendente === 'S' ? 'Sim' : 'Não'}</td>
                          <td id="tabelaUsuarios2">{item.fabricante}</td>
                          <td id="tabelaUsuarios2">{item.modelo}</td>
                          <td id="tabelaUsuarios2">{item.tipo}</td>
                          <td id="tabelaUsuarios2">{item.valor}</td>
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