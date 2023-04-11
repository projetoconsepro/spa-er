import axios from 'axios'
import {React, useState, useEffect} from 'react'

const AbrirTurno = () => {
    const [valor, setValor] = useState(0)
    const [estado, setEstado] = useState(true)
    const [estado2, setEstado2] = useState(false);
    const [mensagem, setMensagem] = useState("")
    const [abTurno, setAbTurno] = useState(false)
    const [setorSelecionado, setSetorSelecionado] = useState(1)
    const [setorSelecionado2, setSetorSelecionado2] = useState("A")
    const [botaoFecharTurno, setBotaoFecharTurno] = useState(false)
    const [nome, setNome] = useState("")
    const [tempoAtual, setTempoAtual] = useState("")
    const [resposta2] = useState([])
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const user2 = JSON.parse(user);

    useEffect(() => {
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        })
        requisicao.get('/setores'
        ).then(
            response => {
                console.log(response)
                for (let i = 0; i < response?.data?.data?.setores?.length; i++) {
                    resposta2[i] = {};
                    resposta2[i].setores = response.data.data.setores[i].nome;
                    resposta2[i].id_setores = response.data.data.setores[i].id_setor;
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
        }
        );

        setNome(user2.nome)
        const data = new Date();
        let hora = data.getHours();
        if(hora < 10){
            hora = "0" + hora;
        }
        let minuto = data.getMinutes();
        if(minuto < 10){
            minuto = "0" + minuto;
        }
        let segundos = data.getSeconds();
        if(segundos < 10){
            segundos = "0" + segundos;
        }
        const horaAtual = hora + ":" + minuto + ":" + segundos;
        setTempoAtual(horaAtual);

        if(localStorage.getItem("turno") === "true" || localStorage.getItem("caixa") === 'true'){
            localStorage.setItem("componente", "FecharTurno")
        }
    }, [])

    const setarSetor = () => {
        const setor2 = document.getElementById("setoresSelect2").value;
        setSetorSelecionado2(setor2)
        console.log(setor2)

        const setorA = resposta2.find((setor) => setor.setores === setor2);
        const setorId2 = setorA && setorA.id_setores;
        console.log(setorId2)
        setSetorSelecionado(setorId2)
    }


    const abrirTurno = () => {
        //parametros requisicao
        const requisicao = axios.create({
            baseURL: process.env.REACT_APP_HOST,
            headers: {
                'token': token,
                'id_usuario': user2.id_usuario,
                'perfil_usuario': "monitor"
            }
        })
        //abrir turno
        console.log(setorSelecionado)
        console.log(valor)
        console.log(tempoAtual)

        requisicao.post('/turno/abrir',{
            hora: tempoAtual,
            idSetor: setorSelecionado,
            caixa: {
                valor_abertura: valor
            }
        }
        ).then(
            response => {
               console.log(response.data.msg.resultado)
               if(response.data.msg.resultado === true){
                    localStorage.setItem("turno", true)
                    localStorage.setItem("caixa", true)
                    localStorage.setItem("horaTurno", tempoAtual)
                    localStorage.setItem("setorTurno", setorSelecionado2)
                    localStorage.setItem("componente", "ListarVagasMonitor")
               }
               else{
                setEstado2(true);
                setMensagem(response.data.msg.msg, 'Redirecionando para fechar turno...');
                setTimeout(() => {
                  setEstado2(false);
                  setMensagem("")
                  localStorage.setItem("turno", true)
                localStorage.setItem("caixa", true)
                localStorage.setItem("componente", "FecharTurno")
                }, 5000);
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
        }
        );
       

        //condições
        
    }

  return (
    <div className="container">
    <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
        <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="row">
                <div className="col-12">
                    <h5 className="mt-1">Abertura de turno</h5>
                </div>
                <div className="col-12">
                    <h6 className="mt-2">Nome do monitor: {nome}</h6>
                </div>
                <div className="col-12">
                    <small className="mt-2">Horário: {tempoAtual}</small>
                </div>
            </div>
            {abTurno === true 
            ?

            <div>
            {botaoFecharTurno === true ? <button type="button" className="btn7 botao mt-3" onClick={() => {abrirTurno('fecharTurno')}}>Fechar turno</button>
            : null
            }
            </div>

            : 
            <div>
              <div className="row mt-4">
                <div className="col-12">
                    <h6 className="text-start">Escolha seu setor:</h6>
                </div>
                <div className="col-6">
                <select className="form-select form-select-sm mb-3 mt-2" aria-label=".form-select-lg example" id="setoresSelect2"
                onChange={() => {setarSetor()}}>
                    {resposta2.map((link, index) => (
                    <option value={link.setores} key={index}>Setor: {link.setores}</option>
                    ))}
                    </select>
                </div>
                </div>

                {estado === true ? 
                        <div className="align-items-center justify-content-between pb-3 mt-2">

                            <div className="row justify-content-center align-items-center">
                                <div className="col-12">
                                    <h6 className="text-start">Defina o valor do caixa:</h6>
                                </div>
                                <div className="col-4">
                                <div className="input-group w-75">
                                    <input type="number" className="form-control fs-6" maxLength="2" id="inputAbrirCaixa" placeholder="30" value={valor} onChange={(e) => setValor(e.target.value)} />
                                </div>
                                </div>
                                <div className="col-8">
                                </div>
                            </div>

                            <div className="row justify-content-center align-items-center">
                                <div className="col-12">
                                    <h6 className="mt-4 text-start">Valor definido em: R${valor === 0 ? '00' : valor},00</h6>
                                </div>
                                <div className="col-12">
                                <button type="button" className="btn5 botao mt-3"  onClick={() => {abrirTurno()}}>Confirmar abertura</button>
                                </div>
                            </div>
                        </div> : ""}   
                    </div>
                }
                </div>
            </div>
            <div className="alert alert-danger mt-4 mx-3" role="alert" style={{ display: estado2 ? 'block' : 'none' }}>
                      {mensagem}
                  </div>
        </div>
    </div>
  )
}

export default AbrirTurno