import axios from 'axios'
import { React, useEffect, useState } from 'react'
import { FaSearch, FaUserPlus } from 'react-icons/fa'
import { GrDocumentConfig } from 'react-icons/gr'
import { BiEdit } from 'react-icons/bi'
import ScrollTopArrow from './ScrollTopArrow'
import Swal from 'sweetalert2'
import sha256 from 'crypto-js/sha256';

const UsuariosAdmin = () => {
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
        }
            

    useEffect(() => {
        AtualizaFunc();
    }, [data3])

    const informacoes = (item, index) => {
        Swal.fire({
            title: 'Informações do usuário',
            html: `<p><b>Nome:</b> ${item.nome}</p>
                   <p><b>Email:</b> ${item.email === null ? "Email não cadastrado" : item.email}</p>
                   <p><b>Telefone:</b> ${item.telefone}</p>
                   <p><b>Perfil:</b> ${item.perfil}</p>
                   <p><b>Status:</b> ${item.ativo === 'S' ? 'Ativado' : 'Desativado'}</p>`,
            background: item.ativo === 'S' ? '#fff' : '#f8d7da',
            showCancelButton: true,
            confirmButtonText: 'Editar',
            confirmButtonColor: 'orange',
            cancelButtonText: 'Fechar',
            showDenyButton: true,
            denyButtonText: 'Adicionar perfil',
            denyButtonColor: 'green',
            }).then((result) => {
            if (result.isConfirmed) {
                editaUsuario(item, index)
            } else if (result.isDenied) {
                adicionarPerfil(item, index)
            } else if (result.isDismissed) {
                Swal.close();
            }
            });
        
    }

    const AdicionarNovoUsuario = () => {
        Swal.fire({
            title: 'Adicionar novo usuario',
            html: `
            <div className="form-group">
                    <label for="nome" class="form-label col-3 fs-6">Nome:</label>
                    <input id="swal-input1" class="swal2-input" value="">
                    </div>
                    <div className="form-group">
                    <label for="email" class="form-label col-3 fs-6">Email:</label>
                    <input id="swal-input2" class="swal2-input" value="">
                   </div>
                   <div className="form-group">
                   <label for="telefone" class="form-label col-3 fs-6">Telefone:</label>
                   <input id="swal-input3" class="swal2-input" value="">
                   </div>
                   <div className="form-group">
                   <label for="status" class="form-label col-3 fs-6">Perfil:</label>
                   <select id="swal-input4" class="swal2-input">
                       <option value="cliente">cliente</option>
                       <option value="monitor">monitor</option>
                       <option value="parceiro">parceiro</option>
                       <option value="admin">admin</option>
                       <option value="agente">agente</option>
                       <option value="supervisor">supervisor</option>
                   </select>
                   </div>
                   <div className="form-group">
                   <span for="cpf" class="form-label col-3 fs-6">CPF/CNPJ:</span>
                   <input id="swal-input6" class="swal2-input" value="">
                   </div>
            </div>`,
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            confirmButtonColor: '#3A58C8',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: () => {
                return new Promise((resolve) => {
                  const requisicao = axios.create({
                    baseURL: process.env.REACT_APP_HOST,
                    headers: {
                      token: token,
                      id_usuario: user2.id_usuario,
                      perfil_usuario: user2.perfil[0],
                    },
                  });
                  const nome2 = document.getElementById('swal-input1').value;
                  const email = document.getElementById('swal-input2').value;
                  const telefone = document.getElementById('swal-input3').value;
                  const perfil = document.getElementById('swal-input4').value;
                  const cpf = document.getElementById('swal-input6').value;
                  const senha2 = sha256(senhaParam).toString();
                 
                  const cpf2 = extrairNumeros(cpf)
                  let cnpjNovo = ""
                  let cpfNovo = ""
                  if(cpf2.length === 11){
                     cpfNovo = cpf2
                     cnpjNovo = ''
                  }else{
                     cnpjNovo = cpf2
                     cpfNovo = ''
                  }
                  requisicao.post('/usuario/', {
                    nome: nome2,
                    email: email,
                    telefone: telefone,
                    perfil: perfil,
                    cpf: cpfNovo,
                    cnpj: cnpjNovo,
                    senha: senha2,
                  })
                    .then(response => {
                      console.log(response)
                      if (response.data.msg.resultado) {
                        AtualizaFunc();
                        resolve({
                          success: true,
                          message: response.data.msg.msg
                        })
                      } else {
                        resolve({
                          success: false,
                          message: response.data.msg.msg
                        })
                      }
                      console.log('resolve', resolve)
                    })
                    .catch(error => {
                      console.log(error)
                      resolve({
                        success: false,
                        message: 'Erro ao adicionar usuário'
                      })
                    });
                });
              },
              allowOutsideClick: () => !Swal.isLoading(),
              allowEnterKey: false,
              preOpen: () => {
                // desabilita o botão de confirmação
                Swal.showLoading()
                Swal.getConfirmButton().disabled = true
              },
              preClose: () => {
                // reabilita o botão de confirmação
                Swal.hideLoading()
                Swal.getConfirmButton().disabled = false
              }
            }).then(result => {
                console.log('result', result)
              if (result.value.success) {
                Swal.fire({
                  icon: 'success',
                  title: result.value.message,
                  showConfirmButton: false,
                  timer: 2000
                })
              } else {
                Swal.fire({
                  icon: 'error',
                  title: result.value.message,
                  showConfirmButton: false,
                  timer: 2000
                })
              }
            })
        };

    const adicionarPerfil = (item, index) => {
        Swal.fire({
            title: 'Adicionar perfil',
            html: `
            <div className="form-group">
            <label for="perfil" class="form-label col-3 fs-6">Perfil:</label>
            <select id="swal-input1" class="swal2-input">
                <option value="cliente">cliente</option>
                <option value="monitor">monitor</option>
                <option value="parceiro">parceiro</option>
                <option value="admin">admin</option>
                <option value="agente">agente</option>
                <option value="supervisor">supervisor</option>
            </select>
            </div>
            `,
            footer: `Nome do usuário: ${item.nome}`,
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            confirmButtonColor: '#3A58C8',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const perfil = document.getElementById('swal-input1').value;
                let perfil2 = 0;
                if (perfil === 'admin') {
                    perfil2 = 1;
                } else if (perfil === 'cliente') {
                    perfil2 = 2;
                } else if (perfil === 'monitor') {
                    perfil2 = 3;
                } else if (perfil === 'supervisor') {
                    perfil2 = 4;
                } else if (perfil === 'agente') {
                    perfil2 = 5;
                } else if (perfil === 'parceiro') {
                    perfil2 = 6;
                }
                const requisicao = axios.create({
                    baseURL: process.env.REACT_APP_HOST,
                    headers: {
                      token: token,
                      id_usuario: user2.id_usuario,
                      perfil_usuario: user2.perfil[0],
                    },
                  });
                  requisicao.post('/usuario/perfil', {
                    id_usuario: item.id_usuario,
                    perfil: perfil2,
                }).then(
                    response => {
                        if(response.data.msg.resultado){
                            AtualizaFunc();
                            Swal.fire({
                                icon: 'success',
                                title: `${response.data.msg.msg}`,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }else{
                            Swal.fire({
                                icon: 'error',
                                title: `${response.data.msg.msg}`,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }
                ).catch(function (error) {
                    console.log(error)
                });
            }
        });
        
    }

    const editaUsuario = async (item, index) => {
        Swal.fire({
            title: 'Editar informações do usuário',
            html: `
            <div className="form-group">
                    <label for="nome" class="form-label col-3 fs-6">Nome:</label>
                    <input id="swal-input1" class="swal2-input" value="${item.nome}">
                    </div>
                    <div className="form-group">
                    <label for="email" class="form-label col-3 fs-6">Email:</label>
                   <input id="swal-input2" class="swal2-input" value="${item.email === null ? "" : item.email}">
                   </div>
                   <div className="form-group">
                   <label for="telefone" class="form-label col-3 fs-6">Telefone:</label>
                   <input id="swal-input3" class="swal2-input" value="${item.telefone}">
                   </div>
                   <label for="perfil" class="form-label col-3 fs-6">Perfil:</label>
                   <input id="swal-input4" class="swal2-input" disabled value="${item.perfil}">
                   <div className="form-group">
                   <label for="status" class="form-label col-3 fs-6">Status:</label>
                   <select id="swal-input5" class="swal2-input">
                       <option value="S" ${item.ativo === 'S' ? 'selected' : ''}>Ativo</option>
                       <option value="N" ${item.ativo === 'N' ? 'selected' : ''}>Não ativo</option>
                   </select>
                   </div>`,
            background: item.ativo === 'S' ? '#fff' : '#f8d7da',
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            confirmButtonColor: '#3A58C8',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const nome2 = document.getElementById('swal-input1').value;
                const email = document.getElementById('swal-input2').value;
                const telefone = document.getElementById('swal-input3').value;
                const perfil = document.getElementById('swal-input4').value;
                const ativo = document.getElementById('swal-input5').value === 'S' ? 'S' : 'N';
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
                        if(response.data.msg.resultado){
                          Swal.fire({
                              title: 'Sucesso!',
                              text: 'Usuário editado com sucesso!',
                              icon: 'success',
                              confirmButtonText: 'Ok'
  
                          })
                      }else{
                          Swal.fire({
                              title: 'Erro!',
                              text: 'Erro ao editar usuário!',
                              icon: 'error',
                              confirmButtonText: 'Ok'
                          })
                      }
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

  return (
    <div className="dashboard-container mb-5">
    <div className="row">
        <div className="col-7">
    <h6 className="text-start mx-4 mb-4">Usuários</h6>
    </div>
    <div className="col-5" id="adicionarUsuario">
    <FaUserPlus id="iconeAddUsuario" color='#3a58c8'  size={23} onClick={()=>{AdicionarNovoUsuario()}}/>
    </div>

        <div className="col-12 col-xl-8">
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="row mx-2">
                    <div className="col-6 input-group w-50 h-25 mt-3">
                    <span className="input-group-text bg-blue-50 text-white" id="basic-addon1"><FaSearch /></span>
                    <input className="form-control bg-white rounded-end border-bottom-0" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome" aria-describedby="basic-addon1" />
                    </div>

                        <div className="col-6 align-middle" onChange={() => {filtroSelect()}}>
                        <select className="form-select form-select-sm mb-3 mt-3" aria-label=".form-select-lg example" id="setoresSelect">
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
                                        <th className="border-bottom" id="tabelaUsuarios" scope="col">Nome</th>
                                        <th className="border-bottom" id="tabelaUsuarios" scope="col">Telefone</th>
                                        <th className="border-bottom" id="tabelaUsuarios2" scope="col">Email</th>
                                        <th className="border-bottom" id="tabelaUsuarios" scope="col">Perfil</th>
                                        <th className="border-bottom" id="tabelaUsuarios2" scope="col">Status</th>
                                        <th className="border-bottom" scope="col">‎‎</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr className="card-list" key={index}>
                                            <th className="fw-bolder col" scope="row" id="tabelaUsuarios" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}  onClick={() => {informacoes(item)}}> 
                                            {item.nome.length > 14 ? item.nome.substring(0, 14) + "..." : item.nome}
                                             </th>
                                            <td className="fw-bolder col" id="tabelaUsuarios" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}  onClick={() => {informacoes(item)}}> <small> {item.telefone} </small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios2" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}  onClick={() => {informacoes(item)}}> <small> {item.email} </small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}  onClick={() => {informacoes(item)}}> <small> {item.perfil} </small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios2" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }}  onClick={() => {informacoes(item)}}> <small> {item.ativo === 'S' ? 'Ativado' : 'Desativado'} </small></td>
                                            <td className="fw-bolder col" id="tabelaUsuarios3" style={{ backgroundColor: item.ativo === 'S' ? '#fff' : '#F8D7DA' }} onClick={()=>{editaUsuario(item, index)}}> <small><BiEdit size={20} /></small></td>
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