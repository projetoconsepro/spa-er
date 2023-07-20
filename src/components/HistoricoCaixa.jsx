import axios from 'axios'
import { React, useEffect, useState } from 'react'
import { AiFillPrinter, AiOutlineReload } from 'react-icons/ai'
import Swal from 'sweetalert2'
import RelatoriosPDF from '../util/RelatoriosPDF'
import VoltarComponente from '../util/VoltarComponente'
import Filtro from '../util/Filtro'
import createAPI from '../services/createAPI'

const HistoricoCaixa = () => {
    const [data, setData] = useState([])
    const [estado, setEstado] = useState(false)
    const [mensagem, setMensagem] = useState("")
    const [dataHoje, setDataHoje] = useState("")
    const [estadoLoading, setEstadoLoading] = useState(false)
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

  
    function ArrumaHora(data, hora ) {
        const data2 = data.split("T");
        const data3 = data2[0].split("-");
        const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
        return data4;
    }

    const createPDF = () => {
      const dataD = [];
      const nomeArquivo = 'Relatório do caixa'
      const cabecalho = ['Data', 'Nome', 'Abertura', 'Fechamento', 'Valor de abertura', 'Valor de fechamento'];
      dataD.push(...data.map((item) => ([item.data, item.nome, item.abertura, item.fechamento, `R$${item.valor_abertura}`, `${item.valor_fechamento === null ? 'Caixa em aberto' : `R$${item.valor_fechamento}`}`])))
      RelatoriosPDF(nomeArquivo, cabecalho, dataD)
    };
    
    useEffect(() => {
        reload();
    }, [])

    const mostrarInformacoes = (item) => {
        Swal.fire({
            title: 'Histórico do caixa',
            html: `<p class="text-start mx-5"><b>Monitor:</b> ${item.nome}</p>
                   <p class="text-start mx-5"><b>Data:</b> ${item.data}</p>
                   <p class="text-start mx-5"><b>Abertura:</b> ${item.abertura}</p>
                   <p class="text-start mx-5"><b>Fechamento:</b> ${item.fechamento}</p>
                   <p class="text-start mx-5"><b>Valor abertura:</b> R$${item.valor_abertura}</p>
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

        const dataHoje = ano + "-" + `${mes < 10 ? `0${mes}` : mes }` + "-" + dia;
        setDataHoje(dataHoje);

        const requisicao = createAPI();
          const idrequisicao= `{"where": [{ "field": "data", "operator": "LIKE", "value": "%${dataHoje}%" }]}`
          const passar = btoa(idrequisicao)
          requisicao.get(`/turno/caixa/admin/?query=${passar}`).then((response) => {
            const newData = response.data.data.map((item) => ({
              data: ArrumaHora(item.data),
              nome: item.nome,
              abertura: item.hora_abertura,
              fechamento: item.hora_fechamento,
              valor_abertura: item.valor_abertura,
              valor_fechamento: item.valor_fechamento,
            }))
            setData(newData)
            if(newData.length <= 0){
              setEstado(true)
              setMensagem("Nenhum registro encontrado")
              }
              else{
                setEstado(false)
                setMensagem("")
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

    const handleConsultaSelected = (consulta) => {
      setEstadoLoading(true)
      const requisicao = createAPI();
      const base64 = btoa(consulta)
      requisicao.get(`/turno/caixa/admin/?query=${base64}`).then((response) => {
        setEstadoLoading(false)
        const newData = response.data.data.map((item) => ({
          data: ArrumaHora(item.data),
          nome: item.nome,
          abertura: item.hora_abertura,
          fechamento: item.hora_fechamento,
          valor_abertura: item.valor_abertura,
          valor_fechamento: item.valor_fechamento,
        }))
        setData(newData)
        if(newData.length <= 0){
          setEstado(true)
          setMensagem("Nenhum registro encontrado")
          }
          else{
            setEstado(false)
            setMensagem("")
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
      
    };

    return (
        <div className="dashboard-container">
        <p className="mx-3 text-start fs-4 fw-bold">Histórico do caixa:</p>
        <div className="mb-3"> 
        <div className="row">
        <div className="col-7">
        <div className="w-50 mx-4">
        <Filtro nome="HistoricoCaixa" onConsultaSelected={handleConsultaSelected} onLoading={estadoLoading} />
        </div>
        </div>
          <div className="col-3 text-end">
          <button className="btn3 botao p-0 w-75 h-100" type="button" onClick={() => {createPDF()}}><AiFillPrinter size={21}/></button>
          </div>
          <div className="col-1 text-end">
            <AiOutlineReload className="mt-1" size={21} onClick={() => {reload()}}/>
          </div>
          <div className="col-1">
          </div>
          </div>
          </div>
        <div className="row">
          <div className="col-12 col-xl-12">
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

        <VoltarComponente />
        
      </div>
  )
}

export default HistoricoCaixa