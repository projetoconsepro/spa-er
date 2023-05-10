import axios from 'axios'
import { React, useEffect, useState } from 'react'
import { FaCar, FaCarAlt, FaEllipsisH, FaEye, FaParking, FaPowerOff, FaSearch, FaUserPlus } from 'react-icons/fa'
import { GrDocumentConfig } from 'react-icons/gr'
import { BiEdit } from 'react-icons/bi'
import { MdManageSearch } from 'react-icons/md'
import ScrollTopArrow from './ScrollTopArrow'
import Swal from 'sweetalert2'
import sha256 from 'crypto-js/sha256';
import { BsCashCoin, BsFillShieldLockFill, BsPaintBucket } from 'react-icons/bs'
import { AiFillPrinter, AiOutlineInfoCircle } from 'react-icons/ai'
import RelatoriosPDF from '../util/RelatoriosPDF'
import { Modal, Select } from '@mantine/core'
import Filtro from '../util/Filtro'
import { useDisclosure } from '@mantine/hooks'
import { RxLapTimer } from 'react-icons/rx'
import Cronometro from './Cronometro'


const ClientesAdmin = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [data3, setData3] = useState([])
    const [veiculos, setVeiculos] = useState([])
    const [detalhesVeiculo, setDetalhesVeiculo] = useState([])
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
                            perfil: 'cliente',
                            placa: item.veiculos ? item.veiculos.map((veiculo) => veiculo.placa) : [],
                            saldo: item.saldo
                        }))
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
            
        const desativaUsuario = async (item, index) => {
          Swal.fire({
              title: item.ativo === 'S' ? 'Desativar usuário' : 'Ativar usuário',
              text: item.ativo === 'S' ? 'Tem certeza que deseja desativar esse usuário?' : 'Tem certeza que deseja ativar esse usuário?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sim',
              cancelButtonText: 'Não',
              confirmButtonColor: '#3A58C8',
              cancelButtonColor: '#d33',
              showLoaderOnConfirm: true,
              preConfirm: () => {
                  const requisicao = axios.create({
                      baseURL: process.env.REACT_APP_HOST,
                      headers: {
                        token: token,
                        id_usuario: user2.id_usuario,
                        perfil_usuario: user2.perfil[0],
                      },
                    });
                    requisicao.put('/usuario', {
                      nome: item.nome,
                      telefone: item.telefone,
                      email: item.email,
                      perfil: item.perfil,
                      ativo: item.ativo === 'N' ? 'S' : 'N',
                      id_usuario: item.id_usuario,
                      }).then((response) => {
                          if(response.data.msg.resultado){
                          data3[index] = {ativo: 'N', email: item.email, id_usuario: item.id_usuario, nome: item.nome, perfil: item.perfil, telefone: item.telefone}
                          setData3([...data])
                            Swal.fire({
                                title: 'Sucesso!',
                                text: item.ativo === 'N' ? 'Usuário ativado com sucesso!' : 'Usuário desativado com sucesso!',
                                icon: 'success',
                              })
                          }else{
                                Swal.fire({
                                    title: 'Erro!',
                                    text: 'Erro ao alterar usuário!',
                                    icon: 'error',
                                    confirmButtonText: 'Ok'
                                })
                            }
                      }).catch((error) => {
                          console.log(error)
                      })
                    }
          })
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

    useEffect(() => {
      console.log('a')
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': user2.perfil[0]
        }
    })
    requisicao.get(`/veiculo/${selectedOption}`)
    .then((response) => {
        console.log(response.data)
        if (response.data.msg.resultado === false && response.data.msg.msg !== "Dados encontrados") {
            
        }
        else{
            const newData = response?.data.data.map((item) => ({
                placa: item.placa,
                modelo: item.modelo.modelo,
                fabricante: item.modelo.fabricante.fabricante,
                cor: item.cor,
                vaga: item.estacionado[0].numerovaga,
                numero_notificacoes_pendentes: item.numero_notificacoes_pendentes,
                saldo_devedor: item.saldo_devedorr,
                estacionado: item.estacionado[0].estacionado,
                tempo: item.estacionado[0].tempo,
                chegada: item.estacionado[0].chegada,
                temporestante: item.estacionado[0].temporestante,
                estado: false
              }));
            setDetalhesVeiculo(newData)
        }
    })
    .catch((error) => {
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
    }, [selectedOption])

    const informacoesVeiculos = (item) => {
       setVeiculos(item.placa.map((veiculo) => veiculo))
       open()
    }

    const handleOptionChange = (event) => {
      console.log(event)
      setSelectedOption(event);
    };
    
    const imprimir = () => {
      const dataD = [...data.map((item) => ([item.nome, item.telefone, item.email, item.saldo, item.perfil, item.ativo === 'S' ? 'Ativo' : 'Inativo']))];
      const nomeArquivo = 'Relatório de Usuários'
      const cabecalho = ['Nome', 'Telefone', 'Email', 'Saldo', 'Perfil', 'Status']
      RelatoriosPDF(nomeArquivo, cabecalho, dataD)
    }

  return (
    <div className="dashboard-container mb-5">
      <Modal opened={opened} onClose={close} title="Informações dos veículos" centered>
      <Select label="Selecione uma opção" data={veiculos} style={{ marginTop: '16px' }} 
      value={selectedOption} onChange={handleOptionChange} />
                    <div className="card-body4">
                         {detalhesVeiculo.map((link, index) => (
                            <div className="card border-0 mt-2" key={index} >
                                <div className="card-body7">
                                    <div className="d-flex align-items-center justify-content-between pb-3">
                                        <div>
                                            <div className="h2 mb-0 d-flex align-items-center">
                                                {link.placa}
                                            </div>
                                            {link.numero_notificacoes_pendentes === 0  ?
                                            <div className="h6 mt-2 d-flex align-items-center fs-6" id="estacionadocarroo">
                                            <h6><AiOutlineInfoCircle />‎ Sem notificações pendentes</h6>
                                            </div>
                                            :
                                            <div className="h6 mt-2 d-flex align-items-center fs-6 text-danger" id="estacionadocarroo">
                                                <h6><AiOutlineInfoCircle />‎ {link.numero_notificacoes_pendentes} {link.numero_notificacoes_pendentes > 1 ? 'notificações' : 'notificação' } pendentes</h6>
                                            </div>
                                            }
                                            {link.estacionado === 'N' ?  
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><FaParking />‎ Não estacionado</h6>
                                            </div>
                                            :
                                            <div>
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><FaParking />‎ Estacionado - Vaga: {link.vaga} </h6>
                                            </div>
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><RxLapTimer />‎ Tempo restante: <Cronometro time={link.temporestante}/> </h6>
                                            </div>
                                            </div>
                                            }
                                            {link.modelo === null || link.modelo === undefined ?
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><FaCarAlt/>‎ Modelo: Sem informações</h6>
                                            </div>
                                            :
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><FaCarAlt/>‎ Modelo: {link.modelo}</h6>
                                            </div>
                                            }
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><BsCashCoin/>‎ Saldo devedor: {link.saldo_devedor}</h6>
                                            </div>
                                            {link.cor === null || link.cor === undefined ?
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><BsPaintBucket/>‎ Cor: Sem informações</h6>
                                            </div>
                                            :
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><BsPaintBucket/>‎ Cor: {link.cor}</h6>
                                            </div>
                                            }
                                            {link.fabricante === null || link.fabricante === undefined ?
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><FaCarAlt/>‎ Fabricante: Sem informações</h6>
                                            </div>
                                            :
                                            <div className="h6 d-flex align-items-center fs-6" id="estacionadocarroo">
                                                <h6><FaCarAlt/>‎ Fabricante: {link.fabricante}</h6>
                                            </div>
                                            }
                                        </div>

                                        <div id='sumirCarro'>
                                            <div className="d-flex align-items-center fw-bold">
                                                <FaCarAlt size={40} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" mb-5 gap-2 d-md-block justify-content-between w-100">
                                    {link.numero_notificacoes_pendentes === 0  ?
                                            null
                                            :
                                            <button type="submit" className="btn4 mb-2 bg-danger botao">Notificações</button>
                                            }
                                        <button type="submit" className="btn4 bg-gray-400 botao">Histórico</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div >
      </Modal>
    <div className="row">
        <div className="col-7">
    <h6 className="text-start mx-4 mb-4">Clientes</h6>
    </div>
        <div className="col-12 col-xl-8">
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="row mx-2 mb-4">
                    <div className="col-6 input-group w-50 h-25 mt-2 pt-1">
                    <span className="input-group-text bg-blue-50 text-white" id="basic-addon1"><FaSearch /></span>
                    <input className="form-control bg-white rounded-end border-bottom-0" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome" aria-describedby="basic-addon1" />
                    </div>
                        <div className="col-4 align-middle mt-2">
                        <Filtro />
                        </div>
                        <div className="col-2">
                          <button className="btn3 botao p-0 m-0 w-100 h-75 mt-2" type="button" onClick={()=>{imprimir()}}><AiFillPrinter  size={21}/></button>
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
                                                <h6 className="dropdown-item d-flex align-items-center" onClick={() => {informacoesVeiculos(item)}}>
                                                  <FaCar />‎‎  Veículos</h6>          
                                                  <h6 className="dropdown-item d-flex align-items-center">
                                                  <BsCashCoin />‎‎  Transferir saldo</h6>
                                                  <h6 className="dropdown-item d-flex align-items-center" onClick={() => {desativaUsuario(item)}} style={{ color : item.ativo === 'S' ?  'red' :'#0F5132' }}>
                                                    <FaPowerOff size={13} className='mb-1'/> ‎‎   {item.ativo === 'S' ? 'Desativar' : 'Ativar'}</h6>            
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
    <ScrollTopArrow />
</div>
  )
}

export default ClientesAdmin