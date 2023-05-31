import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ScrollTopArrow from "./ScrollTopArrow";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from '@mantine/core'
import { IconMapSearch } from "@tabler/icons-react";
import Mapa from "../util/Mapa";
import VoltarComponente from "../util/VoltarComponente";
import FuncTrocaComp from "../util/FuncTrocaComp";

const VeiculosAgente = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [vaga, setVaga] = useState("");
    const [estado, setEstado] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [salvaSetor, setSalvaSetor] = useState('');
    const [enderecoMapa, setEnderecoMapa] = useState('');

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
        await requisicao.get(`/vagas?setor=${setor}`
        ).then(
            response => {
                if (response.data.msg.resultado !== false) {
                    setEstado(false)
                    setMensagem('')
                    const newData = response.data.data.map((item) => ({
                        id_vaga: item.id_vaga,
                        numero_vaga: item.numero,
                        local: item.local,
                        placa: item.placa,
                        tipo: item.tipo,
                        cor: item.cor,
                        corStatus: item.corStatus,
                        status: item.status,
                        id_status_vaga: item.id_status_vaga,
                    }))
                    console.log(newData)
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

        if (localStorage.getItem('setor') === null || localStorage.getItem('setor') === undefined || localStorage.getItem('setor') === '') {
            getVagas('A')
            setSalvaSetor('A')
        } else {
            getVagas(localStorage.getItem('setor'))
            setSalvaSetor(localStorage.getItem('setor'))
        }
    }, []);

    const autoInfracao = (item) => {
        localStorage.setItem('autoInfracao', JSON.stringify(item))
        FuncTrocaComp( 'AutoInfracao')
    }

    const abrirMapa = (item) => {
    setEnderecoMapa(item.local)
    open()
    }

    return (

        <div className="dashboard-container mb-5">


            <Modal size="xl" opened={opened} onClose={() => { close(); }} title="Endereço no mapa" centered >
                
                <Mapa address={`${enderecoMapa}, Centro, Taquara, RS, 95600000`} />
                
            </Modal>


            <p className="text-start mx-3">Veículos notificados</p>
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <div className="row mx-2">
                                <div className="col-6 align-middle">
                                <select className="form-select form-select-sm mb-3 mt-2" value={salvaSetor} aria-label=".form-select-lg example" id="setoresSelect2"
                                    onChange={() => {getVagas(salvaSetor) }}>
                                    {data2.map((link, index) => (
                                        <option value={link.setores}  key={index}>Setor: {link.setores}</option>
                                    ))}
                                </select>
                                </div>

                                <div className="col-6 input-group w-50 h-25 mt-2">
                                <span className="input-group-text bg-blue-50 text-white" id="basic-addon1"><FaSearch /></span>
                                <input className="form-control bg-white rounded-end border-bottom-0" type="number" value={vaga} onChange={(e) => setVaga(e.target.value)} placeholder="Número da vaga" aria-describedby="basic-addon1" />
                                </div>
                                </div>

                            <div className="card border-0 shadow mb-5">
                                <div className="table-responsive">
                                    <table className="table align-items-center table-flush">
                                        <thead className="thead-light">
                                            <tr>
                                                <th className="border-bottom col-2" scope="col">Vaga</th>
                                                <th className="border-bottom col-3" scope="col">Placa</th>
                                                <th className="border-bottom col-5" scope="col">Endereço</th>
                                                <th className="border-bottom col-2" scope="col">*</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((vaga, index) => (
                                                <tr key={index} className="card-list" data-vaga={vaga.numero_vaga}>
                                                    <th className="text-white" scope="row" style={{ backgroundColor: vaga.cor, color: vaga.cor }}>{vaga.numero_vaga}</th>
                                                    <td className="fw-bolder"> {vaga.placa} </td>
                                                    <td className="fw-normal">{window.innerWidth < 768 ? vaga.local.substring(0, 19) + "..." : vaga.local } </td>
                                                    <td className="fw-normal" onClick={() => abrirMapa(vaga)}> <IconMapSearch size={18} /> </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-center">
                                    <div className="alert alert-danger w-75 mt-2" id="sim" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                        {mensagem}
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <VoltarComponente />
                        </div>
                    </div>
                </div>
            </div>
            <ScrollTopArrow />
        </div>
    );
}

export default VeiculosAgente;