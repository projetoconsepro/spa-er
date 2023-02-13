import axios from "axios";
import { FcPlus } from "react-icons/fc";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaCarAlt, FaParking } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { IoTrashSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import '../pages/LoginPage/styles.css';
import Detalhesveiculos from "./Detalhesveiculos.jsx";
import Swal from "sweetalert2";

const ListarVeiculos = () => {
    const [resposta] = useState([]);
    const [valorcobranca,setValorCobranca] = useState("");
    const [valorcobranca2,setValorCobranca2] = useState("2");
    const [mostrar, setMostrar] = useState(false);
    const [mostrar2] = useState([]);
    const [mostrardiv] = useState([]);
    const [nofityvar] = useState([]);
    const [saldoCredito, setSaldoCredito] = useState("");
    const [vaga, setVaga] = useState([]);
    const [estado] = useState([]);
    const [mensagem] = useState([]);

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    const saldo = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })
    const estacionamento = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })

    const parametros = axios.create({
        baseURL: process.env.REACT_APP_HOST,
    })

    const veiculo = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
            'token': token,
            'id_usuario': user2.id_usuario,
            'perfil_usuario': "cliente"
        }
    })

    const atualizafunc = () => {
        const tempo1 = document.getElementById("tempos").value;

        if(tempo1 === "02:00:00"){
            setValorCobranca2(valorcobranca*2);
        }
        else if(tempo1 === "01:00:00"){
            setValorCobranca2(valorcobranca);
        }
        else if(tempo1 === "00:30:00"){
            setValorCobranca2(valorcobranca/2);
        }
    }

    const atualizacomp = async () => {
        await veiculo.get('/veiculo').then(
            response => {
                if(response.data.msg.resultado === false){
                    localStorage.setItem("componente", "CadastrarVeiculo")
                    window.location.reload();
                }
                for (let i = 0; i < response?.data?.data.length; i++) {
                    resposta[i] = {};
                    mostrar2[i] = { "estado": false };
                    mostrardiv[i] = { "estado": true };
                    nofityvar[i] = { "notifi": "notify" };
                    resposta[i].placa = response.data.data[i].usuario;
                    if (response.data.data[i].estacionado === 'N') {
                        resposta[i].estacionado = "Não estacionado"
                    }
                    else {
                        mostrardiv[i] = { "estado": false };
                        resposta[i].vaga = response.data.data[i].numerovaga;
                        resposta[i].estacionado ="Estacionado - Vaga: " + response.data.data[i].numerovaga;
                        resposta[i].tempo = response.data.data[i].tempo;
                        resposta[i].chegada = response.data.data[i].chegada;
                        resposta[i].id_vaga_veiculo =  response.data.data[i].id_vaga_veiculo;
                        resposta[i].temporestante = response.data.data[i].temporestante;
                    }
                    if (response.data.data[i].numero_notificacoes_pendentes === 0) {
                        resposta[i].numero_notificacoes_pendentes ="Sem notificações";
                    }
                    else if (response.data.data[i].numero_notificacoes_pendentes === 1) {
                        resposta[i].numero_notificacoes_pendentes = "Uma notificação"
                        nofityvar[i] = { "notifi": "notify2" };
                    }
                    else {
                        resposta[i].numero_notificacoes_pendentes = `${response.data.data[i].numero_notificacoes_pendentes}` + " notificações";
                        nofityvar[i] = { "notifi": "notify2" };
                    }
                }
            }

        ).catch(function (error) {
            console.log(error);
        });

        await saldo.get('/usuario/saldo-credito').then(
            response => {
                setSaldoCredito(response?.data?.data?.saldo)
            }
        ).catch(function (error) {
            console.log(error);
        });

        await parametros.get('/parametros').then(
            response => {
                setValorCobranca(response.data.data.param.estacionamento.valorHora)
            }
        ).catch(function (error) {
            console.log(error);
        });
    }


    useEffect(() => {
       atualizacomp();
    }, [])

    function mexerValores () {

        const tempo1 = document.getElementById("tempos").value;

        if(tempo1 === "02:00:00"){
            return valorcobranca*2;
        }
        else if(tempo1 === "01:00:00"){
            return valorcobranca;
        }
        else if(tempo1 === "00:30:00"){
            return valorcobranca/2;
        }
    }
    


    function handleClick(index) {
        setMostrar(!mostrar);
        mostrar2[index].estado = !mostrar2[index].estado;
    }

    const hangleplaca = async (placa, index) => {

        const tempo1 = document.getElementById("tempos").value;

        const resposta = await mexerValores();

        if (vaga.length === 0) {
            vaga[0]= 0;
        }

        if(saldoCredito < resposta){
            Swal.fire({
                icon: 'error',
                title: 'Saldo insuficiente',
                footer: '<a href="">Clique aqui para adicionar crédito.</a>'
              })
        }
        else{
            estacionamento.post('/estacionamento', {
                placa: placa,
                numero_vaga: vaga,
                tempo: tempo1,
                pagamento: "credito"
            }).then(
                response => {
                    if (response.data.msg.resultado === true) {
                        atualizacomp();
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.msg.msg,
                            footer: '<a href="">Por favor, tente novamente.</a>'
                          })

                    }
                }
            ).catch(function (error) {
                console.log(error);
            });
            }
}
 const AddTempo = async (placa , index ,id_vaga_veiculo,vaga) => {

    const vagaa = [];

    vagaa[0] = vaga;

    const tempo1 = document.getElementById("tempos").value;

    const resposta = await mexerValores();

    if(saldoCredito < resposta){
        Swal.fire({
            icon: 'error',
            title: 'Saldo insuficiente',
            footer: '<a href="">Clique aqui para adicionar crédito.</a>'
          })
    }
    else{
        estacionamento.post('/estacionamento', {
            placa: placa,
            numero_vaga: vagaa,
            tempo: tempo1,
            pagamento: "credito",
            id_vaga_veiculo: id_vaga_veiculo
        }).then(
            response => {
                if (response.data.msg.resultado === true) {
                    atualizacomp();
                    window.location.reload();
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: response.data.msg.msg,
                        footer: '<a href="">Por favor, tente novamente.</a>'
                      })

                }
            }
        ).catch(function (error) {
            console.log(error);
        });
        }
    }

    return (
        <div className="col-12 px-3 mb-4">
            <p className="text-start fs-2 fw-bold">Meus veículos</p>
            <div className="card border-0 shadow">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between pb-3">
                        <div>
                            <div className="h6 mb-0 d-flex align-items-center">
                                Seu saldo é de:
                            </div>
                            <div className="h1 mt-2 d-flex align-items-center">
                                R$ {saldoCredito},00
                            </div>
                        </div>
                        <div>
                            <div className="d-flex align-items-center fw-bold">
                                <FcPlus size={40} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            {resposta.map((link, index) => (
                <div class="card border-0 shadow mt-5" key={index} >
                    <div class="card-body" onClick={()=>{handleClick(index)}}>
                        <div class="d-flex align-items-center justify-content-between pb-3">
                            <div>
                                <div class="h2 mb-0 d-flex align-items-center">
                                    {link.placa}
                                </div>
                                <div class="h6 mt-2 d-flex align-items-center fs-6" id="estacionadocarro">
                                    <h6><FaParking />‎ {link.estacionado}</h6>
                                </div>
                                {mostrardiv[index].estado ?  null
                                :
                                <div class="h6 d-flex align-items-center fs-6">
                                    <h6><RxLapTimer />‎ Tempo restante: {link.temporestante} </h6>
                                </div>
                                }
                            </div>
                            <div>
                                <div class="d-flex align-items-center fw-bold">
                                    <FaCarAlt size={40} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {mostrar2[index].estado ? 
                    <div className="mb-1">
                        {mostrardiv[index].estado ? 
                         <div className="h6 mt-3 mx-5" onChange={atualizafunc}>
                            <select class="form-select form-select-lg mb-1" aria-label=".form-select-lg example" id="tempos">
                                 <option value="00:30:00">30 Minutos</option>
                                 <option value="01:00:00" selected>60 Minutos</option>
                                 <option value="02:00:00">120 Minutos</option>
                            </select>
                                 <p id="tempoCusto" className="text-end">Esse tempo irá custar: R$ {valorcobranca2},00 </p>
                                     <div className="form-group mb-4 mt-4">
                                         <p className='text-start' id='vagaInput'>Numero da vaga:</p>
                                         <div className="input-group">
                                             <input className="form-control" value={vaga} onChange={(e) => setVaga([e.target.value])} placeholder="Exemplo: 3" />
                                         </div>
                                     </div>
                                     <div className="mt-1 mb-5 gap-2 d-flex justify-content-between">
                                        <div>
                                        </div>
                                         <button type="submit" onClick={()=> {hangleplaca(link.placa, index)}} className="btn3 botao">Ativar</button>
                                         <div>
                                         <span><IoTrashSharp color="red" size={25}/></span>
                                         </div>
                                     </div>
                             </div>
                                : 
                                <div className="h6 mx-5" onChange={atualizafunc}>
                                <select class="form-select form-select-lg mb-1" aria-label=".form-select-lg example" id="tempos">
                                 <option value="00:30:00">30 Minutos</option>
                                 <option value="01:00:00" selected>60 Minutos</option>
                                 <option value="02:00:00">120 Minutos</option>
                                 </select>
                                 <p id="tempoCusto" className="text-end">Esse tempo irá custar: R$ {valorcobranca2},00 </p>
                                    <p className="text-start" id="horarioChegada">Horário chegada: {link.chegada} </p>
                                    <p className="text-start pb-3" id="horarioChegada">Tempo Creditado: {link.tempo} </p>
                                    <button type="submit" onClick={()=> {AddTempo(link.placa, index , link.id_vaga_veiculo, link.vaga)}} className="btn3 botao">Ativar</button>
                                </div>
                            }
                    </div>
                    : null}
                </div>
            ))}
        </div>
    );
}

export default ListarVeiculos;