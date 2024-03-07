import React, { useEffect, useState } from 'react'
import createAPI from '../services/createAPI'
import ValidarRequisicao from '../util/ValidarRequisicao'
import { AiFillCheckCircle } from 'react-icons/ai'

const RelatorioMonitorAdmin = () => {
    const [monitor, setMonitor] = useState([])


  const HandleGetMonitor =  async () => {
    const requisicao = await createAPI()

    let query = `{"where": [{ "field": "perfil", "operator": "=", "value": "admin" },{ "field": "perfil", "operator": "=", "value": "monitor" }]}`;

    query = btoa(query)

    requisicao.get(`/usuario/listar/?query=${query}`).then((res) => {
        if (res.data.msg.resultado) {

            const ArrayAtivos = res.data.data.filter((item) => { return item.ativo === "S" })

            const newData = ArrayAtivos.map((item) => {
                return {
                    id: item.id_usuario,
                    nome: item.nome,
                    email: item.email === '' ? 'Não informado' : item.email,
                    telefone: item.telefone,
                    perfil: item.perfil,
                    checked: false
                }
            })

            setMonitor(newData)

        } else {
          console.log('Erro ao buscar monitor')
        }
    }).catch((err) => {
        ValidarRequisicao(err);
    });
    }



    const HandleGetMovByMonitor = async (id, nome, query) => {
        const requisicao = await createAPI()

        query = btoa(`{"where": [{ "field": "id_usuario", "operator": "=", "value": "${id}" }]}`)

        requisicao.get(`financeiro/monitor/relatorio/?query=${query}`).then((res) => {
            if (res.data.msg.resultado) {
                console.log(res.data.dados[0]);

            } else {
                console.log('Erro ao buscar movimento')
            }
        }).catch((err) => {
            ValidarRequisicao(err);
        });
    }

  useEffect(() => {
    HandleGetMonitor()
  }, [])

  return (
    <div className="row">

    <div className="row">
            <div className="col-12">
              <h6>Selecione a Monitora:</h6>
            </div>
          </div>
            <table className="table table-striped table-hover table-bordered table-responsive">
              <thead>
                <tr className="text-center">
                  <th>
                    <AiFillCheckCircle size={20} />
                  </th>
                  <th>Nome</th>
                  <th>Perfil</th>
                </tr>
              </thead>
              <tbody>
                {monitor.map(
                  (link, index) => link.pago !== "S" && (
                    monitor.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center">Carregando...</td>
                        </tr>
                    ) :
                    <tr key={index}>
                      <td
                        className="px-1"
                        style={{ width: "40px", textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={link.checked}
                          onChange={() => {
                            link.checked = !link.checked;
                            setMonitor([...monitor]);
                          }}
                          style={{ width: "20px", height: "20px" }} />
                      </td>
                      <td>{link.nome}</td>
                      <td>{link.perfil.toUpperCase().charAt(0) + link.perfil.slice(1).toLowerCase()}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
    </div>
  )
}

export default RelatorioMonitorAdmin;
