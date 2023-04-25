import axios from "axios";
import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { FaParking, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import Cronometro from "./Cronometro";
import ScrollTopArrow from "./ScrollTopArrow";

const VagasAdmin = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
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
        const setor2 = document.getElementById('setoresSelect').value;
        if (setor2 !== undefined && setor2 !== null && setor2 !== '') {
            setor = setor2;
            for (let i = 0; i < data.length; i++) {
                delete data[i];
            }
        }
        setSalvaSetor(setor);
        await requisicao.get(`/vagas/admin`,{
            nome_setor: setor,
        }
        ).then(
            response => {
                console.log('a', response)
                if (response.data.msg.resultado !== false) {

                    
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
        console.log(vaga)
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
                console.log(response.data.data)
                const newData = response.data.data.setores.map((item) => ({
                        setores: item.nome
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
        getVagas('A');
    }, [])

    return (

        <div className="dashboard-container mb-5">
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <div className="row mx-2">
                                <div className="col-6 align-middle">
                                <select className="form-select form-select-sm mb-3 mt-2" value={salvaSetor} aria-label=".form-select-lg example" id="setoresSelect"
                                    onChange={() => { getVagas(salvaSetor) }}>
                                    {data2.map((link, index) => (
                                        <option value={link.setores}  key={index}>Setor: {link.setores}</option>
                                    ))}
                                </select>
                                </div>

                                <div className="col-6 input-group w-50 h-25 mt-3">
                                <span className="input-group-text" id="basic-addon1"><FaSearch /></span>
                                <input className="form-control" type="number" value={vaga} onChange={(e) => setVaga(e.target.value)} placeholder="Número da vaga" aria-describedby="basic-addon1" />
                                </div>
                        </div>
                            <div className="card border-0 shadow">
                                <div className="table-responsive">
                                    <table className="table align-items-center table-flush">
                                        <thead className="thead-light">
                                            <tr>
                                                <th className="border-bottom" scope="col">Vaga</th>
                                                <th className="border-bottom" scope="col">Endereço</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((vaga, index) => (
                                                <tr key={index} className="card-list" data-vaga={vaga.numero}>
                                                    <th className="text-white" scope="row" style={{ backgroundColor: vaga.corvaga, color: vaga.cor }}>{vaga.numero}</th>
                                                    <td className="fw-bolder" style={{ backgroundColor: vaga.corline, color: vaga.cor }}>{vaga.placa} <small id={vaga.display}>{vaga.numero_notificaoes}</small></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="alert alert-danger" id="sim" role="alert" style={{ display: estado ? 'block' : 'none' }}>
                                {mensagem}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ScrollTopArrow />
        </div>
    );
}

export default VagasAdmin;