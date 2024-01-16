import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ScrollTopArrow from "./ScrollTopArrow";
import { useDisclosure } from "@mantine/hooks";
import { Menu, Modal, Text, Button } from '@mantine/core'
import { IconCopy, IconMapSearch, IconReload } from "@tabler/icons-react";
import Mapa from "../util/Mapa";
import VoltarComponente from "../util/VoltarComponente";
import createAPI from "../services/createAPI";
import FuncTrocaComp from "../util/FuncTrocaComp";
import Swal from "sweetalert2";
import CarroLoading from "./Carregamento";

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
    const [onLoading, setOnLoading ] = useState(false);


    function ArrumaHora(data) {
        if (data === null || data === undefined || data === '') {
            return '';
        }
        const data2 = data.split("T");
        const data3 = data2[0].split("-");
        const data4 = data3[2] + "/" + data3[1] + "/" + data3[0];
        return data4;
    }

    function ArrumaHora2(data) {
        if (data === null || data === undefined || data === '') {
            return '';
        }
        const data2 = data.split("T");
        const data6 = data2[1].split(":");
        const data5 = (data6[0]-3) + ":" + data6[1] + ":";
        const data7 = data5 + data6[2].split(".")[0];
        return data7;
      }

    const getVagas = async (setor) => {
        setOnLoading(true)
        setEstado(false)
        const requisicao = createAPI();
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
                setOnLoading(false)
                if (response.data.msg.resultado !== false) {
                    setEstado(false)
                    setMensagem('')
                    const newData = response.data.data.map((item) => ({
                        id_vaga: item.id_vaga,
                        notificacoes: item.numero_notificacoes_pendentes,
                        notificacao_vaga: item.numero_notificacoes_pendentess,
                        numero_vaga: item.numero,
                        local: item.local,
                        placa: item.placa,
                        tipo_vaga: item.tipo,
                        cor: item.cor,
                        corStatus: item.corStatus,
                        status: item.status,
                        infracao: item.infracao,
                        id_status_vaga: item.id_status_vaga,
                        id_vaga_veiculo: item.id_vaga_veiculo,
                        data: `${ArrumaHora(item.hora_notificacao)} - ${ArrumaHora2(item.hora_notificacao)}`,
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
        const requisicao = createAPI();
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

    const abrirMapa = (item) => {
    setEnderecoMapa(item.local)
    open()
    }

    const openModal = (item) => {
        Swal.fire({
            title: 'Informações da notificação',
            html: `
                   <p><b>Placa:</b> ${item.placa}</p>
                   <p><b>Local:</b> ${item.local}</p>
                   <p><b>Notificações pendentes:</b> ${item.notificacoes}</p>
                   <p><b>Vaga:</b> ${item.numero_vaga}</p>
                   <p><b>Tipo da vaga:</b> ${item.tipo_vaga}</p>
                   `,
            showConfirmButton: item.notificacao_vaga > 0 ? item.infracao === "S" ? false : true : false,
            showCancelButton: true,
            confirmButtonText: 'Auto de infração',
            cancelButtonText: 'Fechar',
            }).then((result) => {
            if (result.isDismissed) {
                Swal.close();
            }
            else if (result.isConfirmed) {
                localStorage.setItem('autoInfracao', JSON.stringify(item))
                FuncTrocaComp('AutoInfracao')
            }
        })
    }

    return (

        <div className="dashboard-container mb-5">


            <Modal size="xl" opened={opened} onClose={() => { close(); }} title="Endereço no mapa" centered >
                
                <Mapa address={`${enderecoMapa}, Centro, Taquara, RS, 95600000`} />
                
            </Modal>


            <div className="row mb-3">
                <div className="col-7">
                    <h6 className="text-start align-middle mx-3 mt-2">Veículos estacionados</h6>      
                </div>   
                <div className="col-2">
            <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button
                variant="outline"
                sx={{ fontFamily: "Greycliff CF, sans-serif" }}
              >
                ?{" "}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Legenda:</Menu.Label>
              <Text fz="sm" className="mx-2">
                <small>
                    <span className="px-2 rounded-circle" style={{
                        backgroundColor: "#F8D7DA",
                        border: "1px solid black",
                    }}>
                        {" "}

                    </span> 
                       {"‎"} Veículo notificado
                </small>
              </Text>
              <Text fz="sm" className="mx-2">
                <small>
                    <span className="px-2 rounded-circle" style={{
                        backgroundColor: "#D3D3D4",
                        border: "1px solid black",
                    }}>
                        {" "}
                    </span>
                    {"‎"} Auto de infração emitido
                </small>
              </Text>
              <Text fz="sm" className="mx-2">
                <small>
                    <span className="px-2 rounded-circle" style={{
                        backgroundColor: "#FFF",
                        border: "1px solid black",
                    }}>
                        {" "}
                    </span>
                    {"‎"} Tempo esgotado
                </small>
              </Text>
            </Menu.Dropdown>
          </Menu>
            </div>
                <div className="col-2">
                <Button
                    variant="gradient"
                    gradient={{ from: "indigo", to: "blue", deg: 60 }}
                    mb="sm"
                    radius="sm"
                    size="sm"
                    onClick={() => getVagas(salvaSetor, 'reset')}
                  >
                    <IconReload  color="white" size={20} />
                  </Button>

                </div>

          </div>
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
                                                <th className="border-bottom col-2" scope="col"> </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((vaga, index) => (
                                                <tr key={index} className="card-list" data-vaga={vaga.numero_vaga}>
                                                    <th className="text-white" scope="row" style={{ backgroundColor: vaga.cor, color: vaga.cor }} onClick={()=>{openModal(vaga)}}>{vaga.numero_vaga}</th>
                                                    <td className="fw-bolder" onClick={() => { openModal(vaga) }} style={{ backgroundColor: vaga.notificacao_vaga > 0 ? vaga.infracao === "S" ? "#D3D3D4" : "#F8D7DA" : "#FFF", color: vaga.notificacao_vaga > 0 ? vaga.infracao === "S" ? "#141619" : "#842029" : "#000" }}>
                                                        {vaga.placa} {vaga.notificacoes > 0 ? (<span className="bg-danger px-2 text-white rounded-circle">{vaga.notificacoes}</span>) : null}
                                                    </td>
                                                    <td className="fw-normal" onClick={()=>{openModal(vaga)}} style={{ backgroundColor: vaga.notificacao_vaga > 0 ? vaga.infracao === "S" ? "#D3D3D4" : "#F8D7DA" : "#FFF", color: vaga.notificacao_vaga > 0 ? vaga.infracao === "S" ? "#141619" : "#842029" : "#000" }}>{window.innerWidth < 768 ? vaga.local.substring(0, 19) + "..." : vaga.local } </td>
                                                    <td className="fw-normal" onClick={() => abrirMapa(vaga)} style={{ backgroundColor: vaga.notificacao_vaga > 0 ? vaga.infracao === "S" ? "#D3D3D4" : "#F8D7DA" : "#FFF", color: vaga.notificacao_vaga > 0 ? vaga.infracao === "S" ? "#141619" : "#842029" : "#000" }}> <IconMapSearch size={18} /> </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-center">
                                    <div className="alert alert-danger w-75 mt-2" id="sim" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                        {mensagem}
                                    </div>
                                    </div>
                                    {onLoading ? (
                                        <div>
                                            <CarroLoading />
                                        </div>
                                    ) : null}
                                                      
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