import axios from 'axios'
import { React, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { GrDocumentConfig } from 'react-icons/gr'
import ScrollTopArrow from './ScrollTopArrow'
import Swal from 'sweetalert2'

const UsuariosAdmin = () => {
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [data3, setData3] = useState([])
    const [nome, setNome] = useState("")
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    useEffect(() => {
    const newData = data2.filter((item) => {
        const searchTerm = nome.toLowerCase();
        const itemName = item.nome.toLowerCase();
        for(let i = 0; i < searchTerm.length; i++){
    if(itemName[i] !== searchTerm[i]){
      return false;
    }
    }
  return true;
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

    useEffect(() => {
     const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "admin"
            }
        })
        requisicao.get('/usuario/listar?query=e3doZXJlOntwZXJmaWw6YWRtaW59fQ==').then(
            response => {
                const newData = response.data.msg.usuarios.map((item) => ({
                    ativo: item.ativo,
                    email: item.email,
                    id_usuario: item.id_usuario,
                    nome: item.nome,
                    perfil: item.perfil,
                    telefone: item.telefone,
                }))
                setData(newData)
                setData2(newData)
                }
        ).catch(function (error) {
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
    }, [data3])

    const informacoes = (item, index) => {
        Swal.fire({
            title: 'Informações do usuário',
            html: `<p><b>Nome:</b> ${item.nome}</p>
                   <p><b>Email:</b> ${item.email}</p>
                   <p><b>Telefone:</b> ${item.telefone}</p>
                   <p><b>Perfil:</b> ${item.perfil}</p>
                   <p><b>Status:</b> ${item.ativo === 'S' ? 'Ativo' : 'Não ativo'}</p>`,
            background: item.ativo === 'S' ? '#fff' : '#f8d7da',
            showCancelButton: true,
            confirmButtonText: 'Editar',
            cancelButtonText: 'Fechar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
            },
            allowOutsideClick: () => !Swal.isLoading(),
            didClose: () => {
                Swal.fire({
                    title: 'Editar informações do usuário',
                    html: `
                    <div className="form-group">
                    <label for="nome" class="form-label">Nome:</label>
                            <input id="swal-input1" class="swal2-input" value="${item.nome}">
                            </div>
                            <div className="form-group">
                            <label for="email" class="form-label">Email:</label>
                           <input id="swal-input2" class="swal2-input" value="${item.email}">
                           </div>
                           <div className="form-group">
                           <label for="telefone" class="form-label">Telefone:</label>
                           <input id="swal-input3" class="swal2-input" value="${item.telefone}">
                           </div>
                           <label for="perfil" class="form-label">Perfil:</label>
                           <input id="swal-input4" class="swal2-input" value="${item.perfil}">
                           <div className="form-group">
                           <label for="status" class="form-label">Status:</label>
                           <select id="swal-input" class="swal2-input">
                               <option value="S" ${item.ativo === 'S' ? 'selected' : ''}>Ativo</option>
                               <option value="N" ${item.ativo === 'N' ? 'selected' : ''}>Não ativo</option>
                           </select>
                           </div>`,
                    background: item.ativo === 'S' ? '#fff' : '#f8d7da',
                    showCancelButton: true,
                    confirmButtonText: 'Salvar',
                    cancelButtonText: 'Cancelar',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        const nome2 = document.getElementById('swal-input1').value;
                        const email = document.getElementById('swal-input2').value;
                        const telefone = document.getElementById('swal-input3').value;
                        const perfil = document.getElementById('swal-input4').value;
                        const ativo = document.getElementById('swal-input').value === 'S' ? 'S' : 'N';
                        const requisicao = axios.create({
                            baseURL: process.env.REACT_APP_HOST,
                            headers: {
                              token: token,
                              id_usuario: user2.id_usuario,
                              perfil_usuario: user2.perfil[0],
                            },
                          });
                          requisicao.put('/usuario', {
                            id_usuario: item.id_usuario,
                            nome: nome2,
                            email: email,
                            telefone: telefone,
                            ativo: ativo,
                            perfil: perfil,
                            }).then((response) => {
                                data3[index] = {ativo: ativo, email: email, id_usuario: item.id_usuario, nome: nome2, perfil: perfil, telefone: telefone}
                                console.log(data3[index])
                                setData3([...data])
                                Swal.fire({
                                    title: 'Sucesso!',
                                    text: 'Usuário editado com sucesso!',
                                    icon: 'success',
                                    confirmButtonText: 'Ok'
                                })
                            }).catch((error) => {
                                Swal.fire({
                                    title: 'Erro!',
                                    text: 'Erro ao editar usuário!',
                                    icon: 'error',
                                    confirmButtonText: 'Ok'
                                })
                            })
                       
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                });
            }
        });
            
        
    }

  return (
    <div className="dashboard-container mb-5">
    <div className="row">
    <h6 className="text-start mx-4 mb-4">Usuários</h6>
        <div className="col-12 col-xl-8">
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="row mx-2">
                    <div className="col-6 input-group w-50 h-25 mt-3">
                        <span className="input-group-text" id="basic-addon1"><FaSearch /></span>
                        <input className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome" aria-describedby="basic-addon1" />
                        </div>

                        <div className="col-6 align-middle" onChange={() => {filtroSelect()}}>
                        <select className="form-select form-select-lg mb-3 mt-2" aria-label=".form-select-lg example" id="setoresSelect">
                                <option value='1'>Filtro </option>
                                <option value='perfil'>Perfil </option>
                                <option value='ativo'>Status </option>
                        </select>
                        </div>

                </div>
                    <div className="card border-0 shadow">
                        <div className="table-responsive">
                            <table className="table align-items-center table-flush">
                                <thead className="thead-light">
                                    <tr>
                                        <th className="border-bottom" scope="col">Nome</th>
                                        <th className="border-bottom" scope="col">Telefone</th>
                                        <th className="border-bottom" scope="col">Perfil</th>
                                        <th className="border-bottom" scope="col">   ‎‎</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr className="card-list" key={index} onClick={() => {informacoes(item)}}>
                                            <th className="fw-bolder col-5" scope="row" id="tabelaUsuarios" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}> 
                                            {item.nome.length > 14 ? item.nome.substring(0, 14) + "..." : item.nome}
                                             </th>
                                            <td className="fw-bolder col-4" id="tabelaUsuarios" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}> <small> {item.telefone} </small></td>
                                            <td className="fw-bolder col-2" id="tabelaUsuarios" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}> <small> {item.perfil} </small></td>
                                            <td className="fw-bolder col-1" id="tabelaUsuarios" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}> <small><GrDocumentConfig /></small></td>
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

export default UsuariosAdmin