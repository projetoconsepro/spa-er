import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import ScrollTopArrow from "./ScrollTopArrow";
import { BsPlus } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import VoltarComponente from "../util/VoltarComponente";

const VagasAdmin = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [tipoVaga, setTipoVaga] = useState([]);
    const [vaga, setVaga] = useState("");
    const [estado, setEstado] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [salvaSetor, setSalvaSetor] = useState('');

    const getVagas = async (setor) => {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': user2.perfil[0]
            }
        })
        const setor2 = document.getElementById('setoresSelect2').value;
        if (setor2 !== undefined && setor2 !== null && setor2 !== '') {
            setor = setor2;
            for (let i = 0; i < data.length; i++) {
                delete data[i];
            }
        }
        setSalvaSetor(setor);
        localStorage.setItem('setor', setor);
        await requisicao.get(`/vagas/admin/${setor}`
        ).then(
            response => {
                if (response.data.msg.resultado !== false) {
                    setEstado(false)
                    setMensagem('')
                    const newData = response.data.data.map((item) => ({
                        id_vaga: item.id_vaga,
                        numero_vaga: item.numero,
                        local: item.local,
                        tipo: item.tipo,
                        cor: item.cor,
                        corStatus: item.corStatus,
                        status: item.status,
                        id_status_vaga: item.id_status_vaga,
                    }))
                    setData(newData);
                }
                else {
                    setEstado(true);
                    setMensagem(response.data.msg.msg);
                }
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
        });

        await requisicao.get(`/vagas/status`).then(
            response => {
                console.log('b', response)
                const newData = response.data.data.map((item) => ({
                    status: item.status,
                    id_status_vaga: item.id_status_vaga,
                    cor: item.cor,
                }))
                setData3(newData)
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
        });
    }

    useEffect(() => {
  const cardToScroll = document.querySelector(`.card-list[data-vaga="${vaga}"]`);
  if (cardToScroll) {
    setTimeout(() => {
        cardToScroll.scrollIntoView({behavior: 'smooth', block: 'center'});
      }, 100);
}
}, [vaga]);
    

    useEffect(() => {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': user2.perfil[0]
            }
        })
        requisicao.get('/setores'
        ).then(
            response => {
                const newData = response.data.data.setores.map((item) => ({
                        setores: item.nome,
                        id_setor: item.id_setor
                    })
                )
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

        requisicao.get('/vagas/tipos').then(
            response => {
            
                const newData = response.data.data.map((item) => ({
                    tipo: item.tipo,
                    id_tipo: item.id_tipo_vaga,
                }))
                setTipoVaga(newData)
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
            }});

        if (localStorage.getItem('setor') === null || localStorage.getItem('setor') === undefined || localStorage.getItem('setor') === '') {
            getVagas('A')
            setSalvaSetor('A')
        } else {
            getVagas(localStorage.getItem('setor'))
            setSalvaSetor(localStorage.getItem('setor'))
        }
    }, []);

    const adicionarVaga = async () => {
        const setoresMap = data2.map(option => `<option value="${option.id_setor}" ${option.setores === salvaSetor ? 'selected' : null }>${option.setores}</option>`);
        const tiposMap = tipoVaga.map(option => `<option value="${option.id_tipo}">${option.tipo}</option>`);
        Swal.fire({
            title: 'Adicionar vaga',
            html: `
            <div className="form-group">
                    <label for="numero" class="form-label col-3 fs-6">Número da vaga:</label>
                    <input id="swal-input1" class="swal2-input" value="">
                    </div>
                    <div className="form-group">
                   <label for="endereco" class="form-label col-3 fs-6">Endereço:</label>
                   <input id="swal-input2" class="swal2-input" value="">
                   </div>
                   <div className="form-group">
                   <label for="setor" class="form-label col-3 fs-6">Setor da vaga:</label>
                   <select id="swal-input3" class="swal2-input">
                   ${setoresMap.join('')}
                   </select>
                   </div>
                   <div className="form-group">
                   <label for="tipo" class="form-label col-3 fs-6">Tipo da vaga:</label>
                   <select id="swal-input4" class="swal2-input">
                   ${tiposMap.join('')}
                   </select>
                   </div>
                   <div className="form-group">
                   <label for="status" class="form-label col-3 fs-6">Status:</label>
                   <select id="swal-input5" class="swal2-input">
                       <option value="1">Ativo</option>
                       <option value="2">Não ativo</option>
                   </select>
                   </div>`,
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            confirmButtonColor: '#3A58C8',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const numero = document.getElementById('swal-input1').value;
                const endereco = document.getElementById('swal-input2').value;
                const setor = document.getElementById('swal-input3').value;
                const tipo = document.getElementById('swal-input4').value;
                const status = document.getElementById('swal-input5').value;

                const requisicao = axios.create({
                    baseURL: process.env.REACT_APP_HOST,
                    headers: {
                      token: token,
                      id_usuario: user2.id_usuario,
                      perfil_usuario: user2.perfil[0],
                    },
                  });
                 
                requisicao.post('/vagas', {
                    numero: numero,
                    local: endereco,
                    setor: setor,
                    tipo: tipo,
                    status: status
                }).then(
                    response => {
                        if(response.data.msg.resultado){
                            getVagas(salvaSetor)
                            Swal.fire({
                                title: 'Sucesso!',
                                text: `${response.data.msg.msg}`,
                                icon: 'success',
                                })
                        }else {
                            Swal.fire({
                                title: 'Erro!',
                                text: `${response.data.msg.msg}`,
                                icon: 'error',
                                })
                        }
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
                    });
            }
        });
    }

    const editarVaga = async (vaga, index) => {
        Swal.fire({
            title: 'Editar vaga',
            html: `
            <div className="form-group">
                    <label for="numero" class="form-label col-3 fs-6">Número da vaga:</label>
                    <input id="swal-input1" class="swal2-input" value="${vaga.numero_vaga}">
                    </div>
                    <div className="form-group">
                     <label for="endereco" class="form-label col-3 fs-6">Endereço:</label>
                        <input id="swal-input2" class="swal2-input" value="${vaga.local}">
                    </div>
                    <div className="form-group">
                    <label for="setor" class="form-label col-3 fs-6">Setor da vaga:</label>
                    <select id="swal-input3" class="swal2-input">
                    ${data2.map(option => `<option value="${option.id_setor}" ${option.setores === salvaSetor ? 'selected' : null }>${option.setores}</option>`).join('')}
                    </select>
                    </div>
                    <div className="form-group">
                    <label for="tipo" class="form-label col-3 fs-6">Tipo da vaga:</label>
                    <select id="swal-input4" class="swal2-input">
                    ${tipoVaga.map(option => `<option value="${option.id_tipo}" ${option.tipo === vaga.tipo ? 'selected' : null }>${option.tipo}</option>`).join('')}
                    </select>
                    </div>
                    <div className="form-group">
                    <label for="status" class="form-label col-3 fs-6">Status:</label>
                    <select id="swal-input5" class="swal2-input">
                    ${data3.map(option => `<option value="${option.id_status_vaga}" ${option.status === vaga.status ? 'selected' : null }>${option.status}</option>`).join('')}
                    </select>
                    </div>`
                    ,
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            confirmButtonColor: '#3A58C8',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const numero = document.getElementById('swal-input1').value;
                const endereco = document.getElementById('swal-input2').value;
                const setor = document.getElementById('swal-input3').value;
                const tipo = document.getElementById('swal-input4').value;
                const status = document.getElementById('swal-input5').value;


                const requisicao = axios.create({
                    baseURL: process.env.REACT_APP_HOST,
                    headers: {
                      token: token,
                      id_usuario: user2.id_usuario,
                      perfil_usuario: user2.perfil[0],
                    },
                  });
                requisicao.put(`/vagas/${vaga.id_vaga}`, {
                    numero: numero,
                    local: endereco,
                    setor: setor,
                    tipo: tipo,
                    status: status
                }).then(
                    response => {
                        if(response.data.msg.resultado){
                            getVagas(salvaSetor)
                            Swal.fire({
                                title: 'Sucesso!',
                                text: `${response.data.msg.msg}`,
                                icon: 'success',
                                })
                        }else {
                            Swal.fire({
                                title: 'Erro!',
                                text: `${response.data.msg.msg}`,
                                icon: 'error',
                                })
                        }
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
                    });
            }});
    }

    return (

        <div className="dashboard-container mb-5">
            <p className="text-start mx-3">Vagas dos setores</p>
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <div className="row mx-2">
                                <div className="col-4 align-middle">
                                <select className="form-select form-select-sm mb-3 mt-2" value={salvaSetor} aria-label=".form-select-lg example" id="setoresSelect2"
                                    onChange={() => {getVagas(salvaSetor) }}>
                                    {data2.map((link, index) => (
                                        <option value={link.setores}  key={index}>Setor: {link.setores}</option>
                                    ))}
                                </select>
                                </div>

                                <div className="col-5 input-group w-50 h-25 mt-2">
                                <span className="input-group-text bg-blue-50 text-white" id="basic-addon1"><FaSearch /></span>
                                <input className="form-control bg-white rounded-end border-bottom-0" type="number" value={vaga} onChange={(e) => setVaga(e.target.value)} placeholder="Número da vaga" aria-describedby="basic-addon1" />
                                </div>

                                <div className="col-2">
                                <button className="btn9 botao mt-2 w-100 p-0" type="button" onClick={() => {adicionarVaga()}}><BsPlus size={21} className="w-100" /></button>
                                </div>
                                </div>

                            <div className="card border-0 shadow mb-3">
                                <div className="table-responsive">
                                    <table className="table align-items-center table-flush">
                                        <thead className="thead-light">
                                            <tr>
                                                <th className="border-bottom col-2" scope="col">Vaga</th>
                                                <th className="border-bottom" scope="col">Endereço</th>
                                                <th className="border-bottom" id="tabelaUsuarios2" scope="col">Tipo</th>
                                                <th className="border-bottom" id="tabelaUsuarios2" scope="col">Status</th>
                                                <th className="border-bottom col-2" scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((vaga, index) => (
                                                <tr key={index} className="card-list" data-vaga={vaga.numero_vaga} onClick={() => {editarVaga(vaga, index)}}>
                                                    <th className="text-white" scope="row" style={{ backgroundColor: vaga.cor, color: vaga.cor }}>{vaga.numero_vaga}</th>
                                                    <td className="fw-bolder" style={{ backgroundColor: vaga.corStatus, color: vaga.status === 'inativo' ? '#842029' : '#141619'}}>{vaga.placa} <small id={vaga.display}>{vaga.local}</small></td>
                                                    <td className="fw-bolder" id="tabelaUsuarios2" style={{ backgroundColor: vaga.corStatus, color: vaga.status === 'inativo' ? '#842029' : '#141619'}}>Vaga {vaga.tipo !== 'normal' ? 'de' : null} {vaga.tipo}</td>
                                                    <td className="fw-bolder" id="tabelaUsuarios2" style={{ backgroundColor: vaga.corStatus, color: vaga.status === 'inativo' ? '#842029' : '#141619'}}>{vaga.status}</td>
                                                    <td className="fw-bolder" style={{ backgroundColor: vaga.corStatus, color: vaga.status === 'inativo' ? '#842029' : '#141619'}}><BiEdit size={19} /> </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="alert alert-danger" id="sim" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                {mensagem}
                            </div>
                            <VoltarComponente/>
                        </div>
                    </div>
                </div>
            </div>
            <ScrollTopArrow />
        </div>
    );
}

export default VagasAdmin;