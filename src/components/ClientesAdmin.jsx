import axios from 'axios'
import { React, useEffect, useState } from 'react'
import { FaCar, FaEllipsisH, FaEye, FaPowerOff, FaSearch, FaUserPlus } from 'react-icons/fa'
import { GrDocumentConfig } from 'react-icons/gr'
import { BiEdit } from 'react-icons/bi'
import { MdManageSearch } from 'react-icons/md'
import ScrollTopArrow from './ScrollTopArrow'
import Swal from 'sweetalert2'
import sha256 from 'crypto-js/sha256';
import { BsFillShieldLockFill } from 'react-icons/bs'
import { AiFillPrinter } from 'react-icons/ai'
import RelatoriosPDF from '../util/RelatoriosPDF'
import { Modal } from 'react-bootstrap'
import ModalVeiculos from './ModalVeiculos'

const ClientesAdmin = () => {
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [data3, setData3] = useState([])
    const [nome, setNome] = useState("")
    const [senhaParam, setSenhaParam] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    function extrairNumeros(string) {
      return string ? string.replace(/\D/g, '') : string;
  }

    useEffect(() => {
      const parametros = axios.create({
        baseURL: process.env.REACT_APP_HOST,
      });
      parametros.get('/parametros').then(
      response => {
        setSenhaParam(response.data.data.param.usuario.default)
      });
    }, [])


    useEffect(() => {
    const newData = data2.filter((item) => {
       if(item.nome.toLowerCase().includes(nome.toLowerCase())){
           return item
       }
    })
    setData(newData)
    }, [nome])

    const filtrar = async (item) => {
        const newData = data2.filter((item2) => {
            if(item === 'monitor' || item === 'cliente' || item === 'parceiro' || item === 'admin' || item === 'agente'){
                return item2.perfil === item
            }
            else if(item === 'S' || item === 'N'){
                return item2.ativo === item
            }
        })
        setData(newData)
    }

    const filtroSelect = async () => {
        const select = document.getElementById("setoresSelect").value;

        if(select === '1'){
            setData([...data2])
        }

        else if (select === 'ativo') {
            const inputOptions = new Promise((resolve) => {
                setTimeout(() => {
                  resolve({
                    'S': 'Ativo',
                    'N': 'Não ativo',
                  })
                }, 1000)
              })
              
              const { value: status } = await Swal.fire({
                title: 'Selecione um status',
                input: 'radio',
                inputOptions: inputOptions,
                inputValidator: (value) => {
                  if (!value) {
                    return 'Você precisa selecionar uma opção.'
                  }
                }
              })
              
              if (status) {
                filtrar(status)
              }

        //FILTRAR POR TIPO DE PERFIL
        } else if (select === 'perfil') {
            const { value: perfil } = await Swal.fire({
                title: 'Selecione um perfil',
                input: 'select',
                inputOptions: {
                  'Tipos': {
                    monitor: 'Monitor',
                    cliente: 'Cliente',
                    parceiro: 'Parceiro',
                    admin: 'Admin',
                    agente: 'Agente'
                  }
                },
                inputPlaceholder: 'Selecione um perfil',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                      return 'Você deve selecionar um tipo de perfil'
                    }
                  }
                }
              )
              if (perfil) {
                filtrar(perfil)
                }
            }
        }

        const AtualizaFunc = async () => {
            const requisicao = axios.create({
                baseURL: process.env.REACT_APP_HOST,
                headers: {
                    'token': token,
                    'id_usuario': user2.id_usuario,
                    'perfil_usuario': "admin"
                }
            })
            requisicao.get('/usuario/listar?query=e3doZXJlOntwZXJmaWw6Y2xpZW50ZX19').then(
                response => {
                        const newData = response.data.data.map((item) => ({
                            id_usuario: item.id_usuario,
                            nome: item.nome,
                            email: item.email,
                            telefone: item.telefone,
                            cpf: item.cpf,
                            cnpj: item.cnpj,
                            ativo: item.ativo,
                            placa: item.veiculos ? item.veiculos.map((veiculo) => veiculo.placa) : [],
                            saldo: item.saldo
                        }))
                        console.log(response.data.data)
                        setData(newData)
                        setData2(newData)
                        }).catch(function (error) {
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
        AtualizaFunc();
    }, [data3])

    const informacoes = (item, index) => {
        Swal.fire({
            title: 'Informações do cliente',
            html: `<p><b>Nome:</b> ${item.nome}</p>
                   <p><b>Email:</b> ${item.email === null ? "Email não cadastrado" : item.email}</p>
                   <p><b>Telefone:</b> ${item.telefone}</p>
                   ${item.cpf === undefined ? `<p><b>CNPJ:</b> ${item.cnpj}</p>` : `<p><b>CPF:</b> ${item.cpf}</p>`}
                   <p><b>Status:</b> ${item.ativo === 'S' ? 'Ativado' : 'Desativado'}</p>
                   <p><p><b>Saldo:</b> R$${item.saldo > 0 ? item.saldo : `0${item.saldo}`},00</p>              
                    `,
                   
            background: item.ativo === 'S' ? '#fff' : '#f8d7da',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Fechar',
            showDenyButton: true,
            denyButtonText: 'Transferência',
            denyButtonColor: 'green',
            }).then((result) => {
            if (result.isConfirmed) {
                
            } else if (result.isDenied) {
                
            } else if (result.isDismissed) {
                Swal.close();
            }
            });
        
    }

    const informacoesVeiculos = () => {
       
       
        
    }

    const imprimir = () => {
      const dataD = [...data.map((item) => ([item.nome, item.telefone, item.email, item.saldo, item.perfil, item.ativo === 'S' ? 'Ativo' : 'Inativo']))];
      const nomeArquivo = 'Relatório de Usuários'
      const cabecalho = ['Nome', 'Telefone', 'Email', 'Saldo', 'Perfil', 'Status']
      RelatoriosPDF(nomeArquivo, cabecalho, dataD)
    }

  return (
    <div className="dashboard-container mb-5">
    <div className="row">
        <div className="col-7">
    <h6 className="text-start mx-4 mb-4">Clientes</h6>
    </div>

        <div className="col-12 col-xl-8">
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="row mx-2">
                    <div className="col-6 input-group w-50 h-25 mt-3">
                    <span className="input-group-text bg-blue-50 text-white" id="basic-addon1"><FaSearch /></span>
                    <input className="form-control bg-white rounded-end border-bottom-0" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome" aria-describedby="basic-addon1" />
                    </div>

                        <div className="col-4 align-middle" onChange={() => {filtroSelect()}}>
                        <select className="form-select form-select-sm mb-3 mt-3" aria-label=".form-select-lg example" id="setoresSelect">
                                <option value='1'>Filtro </option>
                                <option value='perfil'>Perfil </option>
                                <option value='ativo'>Status </option>
                        </select>
                        </div>
                        <div className="col-2 text-end">
                          <button className="btn3 botao p-0 m-0 w-100 h-50 mt-3" type="button" onClick={()=>{imprimir()}}><AiFillPrinter  size={21}/></button>
                        </div>

                </div>
                    <div className="card border-0 shadow">
                        <div className="table-responsive">
                            <table className="table align-items-center table-flush">
                                <thead className="thead-light">
                                    <tr>
                                        <th className="border-bottom" id="tabelaUsuarios" scope="col">Nome</th>
                                        <th className="border-bottom" id="tabelaUsuarios" scope="col">Telefone</th>
                                        <th className="border-bottom" id="tabelaUsuarios" scope="col">Email</th>
                                        <th className="border-bottom" id="tabelaUsuarios" scope="col">Saldo</th>
                                        <th className="border-bottom" scope="col">‎‎</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr className="card-list" key={index}>
                                            <th className="fw-bolder col" scope="row" id="tabelaUsuarios" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}> 
                                            {item.nome.length > 14 ? item.nome.substring(0, 14) + "..." : item.nome}
                                             </th>
                                            <td className="fw-bolder col" id="tabelaUsuarios" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}> <small> {item.telefone} </small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios2" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}> <small> {item.email} </small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}> <small> R${item.saldo > 0 ? item.saldo : `0${item.saldo}`},00</small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios3" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}>
                                              <div className="btn-group">
                                                <button className="btn btn-link text-dark dropdown-toggle dropdown-toggle-split m-0 p-0" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                  <FaEllipsisH /> 
                                                </button>
                                              <div className="dropdown-menu dashboard-dropdown dropdown-menu-start mt-3 py-1">
                                              <h6 className="dropdown-item d-flex align-items-center" onClick={()=>{informacoes(item)}}>
                                                  <FaEye />‎‎  Ver mais </h6>   
                                                <h6 className="dropdown-item d-flex align-items-center" onClick={()=>{informacoesVeiculos(item)}}>
                                                  <FaCar />‎‎  Veículos</h6>                       
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ModalVeiculos  />
    <ScrollTopArrow />
</div>
  )
}

export default ClientesAdmin