import axios from 'axios'
import {React, useState, useEffect} from 'react'

const AbrirCaixa = () => {
    const [valor, setValor] = useState(0)
    const [estado, setEstado] = useState(false)
    const [primeiro, setPrimeiro] = useState(null)
    const [abTurno, setAbTurno] = useState(false)
    const [botaoFecharTurno, setBotaoFecharTurno] = useState(false)
    const [botaoFecharCaixa, setBotaoFecharCaixa] = useState(false)
    const [caixaAberto, setCaixaAberto] = useState(false)
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
                for (let i = 0; i < response?.data?.data?.setores?.length; i++) {
                    resposta2[i] = {};
                    resposta2[i].setores = response.data.data.setores[i].nome;
                }
            }
        ).catch(function (error) {
            console.log(error)
        }
        );

        requisicao.get('/turno/primeiro'
        ).then(
            response => {
                console.log(response.data)
                if(response.data.resultado === true){
                    setPrimeiro(true)
                }else{
                    setPrimeiro(false)
                }
            }
        ).catch(function (error) {
            console.log(error)
        }
        );

        if(primeiro === true){
            setEstado(true)
        }

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
        console.log(horaAtual)
        //verificar se é a primeira abertura de caixa do dia (setprimeiro === true)


    }, [])

    const abrirTurno = () => {
        if(estado === true){
            setEstado(false)
        }
        else{
            setEstado(true)
        }
    }

    const abrirTurno2 = (botaoClicado) => {
        if (botaoClicado === 'fecharTurno') {
          setBotaoFecharTurno(false);
        } else if (botaoClicado === 'fecharCaixa') {
          setBotaoFecharCaixa(false);
        }
      
        if (botaoClicado !== 'fecharTurno' && botaoClicado !== 'fecharCaixa') {
            setBotaoFecharTurno(true);
            setBotaoFecharCaixa(true);
          if (abTurno === false) {
            setAbTurno(true);
          } else {
            setEstado(false);
            setAbTurno(false);
          }
        }
      };

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
            {botaoFecharTurno === true ? <button type="button" className="btn7 botao mt-3" onClick={() => {abrirTurno2('fecharTurno')}}>Fechar turno</button>
            : null
            }
            {botaoFecharCaixa === true ? <button type="button" className="btn7 botao mt-3" onClick={() => {abrirTurno2('fecharCaixa')}}>Fechar caixa</button>
            : null}
            </div>

            : 
            <div>
              <div className="row mt-4">
                <div className="col-12">
                    <h6 className="text-start">Escolha seu setor:</h6>
                </div>
                <div className="col-6">
                <select className="form-select form-select-sm mb-3 mt-2" aria-label=".form-select-lg example" id="setoresSelect2">
                    {resposta2.map((link, index) => (
                    <option value={link.setores} key={index}>Setor: {link.setores}</option>
                    ))}
                    </select>
                </div>
                </div>
            <div className="row">
                <div className="col-12">
                    <h6 className="text-start">Abrir turno:</h6>
                </div>
                    <div className="col-12 mt-2">
                        {estado === true ? <button type="button" className="btn8 botao" disabled onClick={() => {abrirTurno()}}>Abrir turno</button>
                        : <button type="button" className="btn4 botao" onClick={() => {abrirTurno()}}>Abrir turno</button>}
                    </div>
                </div>

                {estado === true ? 
                        <div className="align-items-center justify-content-between pb-3 mt-4">

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
                                <button type="button" className="btn5 botao mt-3"  onClick={() => {abrirTurno2()}}>Confirmar abertura</button>
                                </div>
                            </div>
                        </div> : ""}   
                    </div>
                }
                </div>
            </div>
        </div>
    </div>
  )
}

export default AbrirCaixa