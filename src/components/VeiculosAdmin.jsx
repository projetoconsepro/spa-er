import axios from 'axios'
import { React, useState, useEffect } from 'react'
import { FaUserPlus, FaPowerOff, FaEye, FaEllipsisH, FaSearch } from 'react-icons/fa'
import { BsFillShieldLockFill } from 'react-icons/bs'
import { AiFillPrinter, AiOutlinePlusCircle, AiOutlineReload } from 'react-icons/ai'
import ScrollTopArrow from "./ScrollTopArrow";
import CarroLoading from '../components/Carregamento'
import Swal from 'sweetalert2'
import RelatoriosPDF from '../util/RelatoriosPDF'

const VeiculosAdmin = () => {
  const [data, setData] = useState([])
  const [data2, setData2] = useState([])
  const [placa, setPlaca] = useState('')
  const [estado2, setEstado2] = useState(false)
  const [estado, setEstado] = useState(false)
  const [mensagem, setMensagem] = useState('')


  useEffect(() => {
    setEstado2(true)
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const requisicao = axios.create({
      baseURL: process.env.REACT_APP_HOST,
      headers: {
          'token': token,
          'id_usuario': user2.id_usuario,
          'perfil_usuario': user2.perfil[0]
      }
  })
    requisicao.get('/veiculo/listar').then((response) => {
      if (response.data.msg.resultado) {
        setEstado2(false)
      const newData = response.data.data.veiculos.map((item) => ({
          placa: item.placa,
          fabricante: item.modelo.fabricante.fabricante,
          modelo: item.modelo.modelo,
          notificacao: item.notificacao,
          debito: item.debito === "S" ? "Ativado" : "Desativado",
          id: item.id_veiculo,
      }))
      setData(newData)
      setData2(newData)
    } else {
    }
    }).catch((error) => {
      console.log(error)
    })
}, [])

useEffect(() => {
  if(placa === ""){
    setData(data2)
  } else {
  const newData = data2.filter((item) => item.placa.includes(placa))
  setData(newData)
  }
}, [placa])

const Imprimir = () => {
  const dataD = [];
  const nomeArquivo = 'Relatório de Veículos'
  const cabecalho = ['Placa', 'Fabricante', 'Modelo', 'Notificação', 'Débito']
  RelatoriosPDF(nomeArquivo, cabecalho, dataD)
}

const reload = () => {
  setData([])
  setEstado2(true)
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const user2 = JSON.parse(user);
  const requisicao = axios.create({
    baseURL: process.env.REACT_APP_HOST,
    headers: {
        'token': token,
        'id_usuario': user2.id_usuario,
        'perfil_usuario': user2.perfil[0]
    }
})
  requisicao.get('/veiculo/listar').then((response) => {
    if (response.data.msg.resultado) {
      setEstado2(false)
    const newData = response.data.data.veiculos.map((item) => ({
      placa: item.placa,
      fabricante: item.modelo.fabricante.fabricante,
      modelo: item.modelo.modelo,
      notificacao: item.notificacao,
      debito: item.debito === "S" ? "Ativado" : "Desativado",
      id: item.id_veiculo,
    }))
    setData(newData)
    setData2(newData)
  } else {
  }
  }).catch((error) => {
    console.log(error)
  })
}

const filtroSelect = async () => {
  const filtro = document.getElementById('filtroSelect').value
  if(filtro === "selectPlaca"){
    Swal.fire({
      title: 'Digite a placa',
      html: '<input type="text" id="placa4" class="swal2-input w-50">',
      confirmButtonText: 'Buscar',
      cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const placa2 = document.getElementById('placa4').value
          const newData = data2.filter((item) => item.placa.includes(placa2))
          setData(newData)
          if(newData.length === 0){
            setEstado(true)
            setMensagem("Nenhum veículo encontrado")
            setTimeout(() => {
              setEstado(false)
              setMensagem("")
            }, 3000);
          }
        } else {
          
        }
      })
  } else if (filtro === "selectDebito"){
    
  }
}


  return (
    <div className="dashboard-container mb-5">
    <div className="row">
        <div className="col-7">
    <h6 className="text-start mx-4 mb-4">Listar de veículos</h6>
    </div>
    <div className="col-5" id="adicionarUsuario">
    <AiOutlinePlusCircle id="iconeAddUsuario" color='#3a58c8'  size={23} />
    </div>

        <div className="col-12 col-xl-8">
            <div className="row">
                <div className="col-12 mb-4">
                <div className="row">
        <div className="col-12">
        <div className="row">
        <div className="col-7">
        <select className="mx-3 form-select form-select-sm mb-3" defaultValue="1" onChange={() => {filtroSelect()}} aria-label=".form-select-lg example" id="filtroSelect">
          <option disabled  value='1' id="filtro">Filtro</option>
          <option value="selectPlaca">Placa</option>
          <option value="selectDebito">Débito</option>
          </select>
          </div>
          <div className="col-3 text-end">
          <button className="btn3 botao p-0 w-75 h-75" type="button" onClick={()=>{Imprimir()}}><AiFillPrinter  size={21}/></button>
          </div>
          <div className="col-1 text-end">
            <AiOutlineReload onClick={() => {reload()}}className="mt-1" size={21}/>
          </div>
          </div>
          </div>
          </div>
                    <div className="card border-0 shadow">
                        <div className="table-responsive">
                            <table className="table align-items-center table-flush">
                                <thead className="thead-light">
                                    <tr>
                                        <th className="border-bottom" id="tabelaUsuarios" scope="col">Placa</th>
                                        <th className="border-bottom" id="tabelaUsuarios" scope="col">Modelo</th>
                                        <th className="border-bottom" id="tabelaUsuarios2" scope="col">Fabricante</th>
                                        <th className="border-bottom" id="tabelaUsuarios" scope="col">Notificações</th>
                                        <th className="border-bottom" id="tabelaUsuarios2" scope="col">Débito</th>
                                        <th className="border-bottom" scope="col">‎‎</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr className="card-list" key={index}>
                                            <th className="fw-bolder col" scope="row" id="tabelaUsuarios"> 
                                            {item.placa}
                                             </th>
                                            <td className="fw-bolder col" id="tabelaUsuarios"> <small> {item.modelo} </small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios2"> <small> {item.fabricante} </small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios"> <small> {item.notificacao} </small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios2"> <small> {item.debito} </small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios3">
                                              <div className="btn-group">
                                                <button className="btn btn-link text-dark dropdown-toggle dropdown-toggle-split m-0 p-0" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                  <FaEllipsisH /> 
                                                </button>
                                              <div className="dropdown-menu dashboard-dropdown dropdown-menu-start mt-3 py-1">
                                                <h6 className="dropdown-item d-flex align-items-center">
                                                  <FaEye />‎‎  Ver mais </h6>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 mb-3" style={{ display: estado2 ? 'block' : 'none'}}>
                          <CarroLoading  />       
                        </div>
                        <div className="alert alert-danger mt-4 mx-3" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                        {mensagem}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ScrollTopArrow />
</div>
  )
}

export default VeiculosAdmin