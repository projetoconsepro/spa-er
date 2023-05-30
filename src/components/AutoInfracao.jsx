import axios from 'axios';
import { React, useEffect, useState } from 'react'
import { BsCalendarDate, BsCashCoin } from 'react-icons/bs';
import { FaCarAlt, FaClipboardList, FaParking } from 'react-icons/fa';
import Swal from 'sweetalert2';
import FuncTrocaComp from '../util/FuncTrocaComp';

const AutoInfracao = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    const [data, setData] = useState([])
    const [codigo, setCodigo] = useState('')

    useEffect(() => {
        document.title = 'Auto de Infração'
        const infos = JSON.parse(localStorage.getItem('autoInfracao'))
        setData([infos])
        console.log([infos])
    }, [])

    const confirmarInfracao = () => {
      const requisicao = axios.create({
        baseURL: process.env.REACT_APP_HOST,
        headers: {
          token: token,
          id_usuario: user2.id_usuario,
          perfil_usuario: user2.perfil[0],
        },
      });

      requisicao.post('/notificacao/auto-infracao',{
          codigo: codigo,
          idVagaVeiculo: data[0].id_vaga_veiculo,
      }).then((response) => {
        if (response.data.msg.resultado){
          Swal.fire( 'Sucesso!', 'Auto de infração confirmado com sucesso!', 'success')
          setTimeout(() => {
            localStorage.removeItem('autoInfracao')
            FuncTrocaComp('ListarNotificacoesAgente')
            Swal.close()
          }, 1000);
        } else {
          Swal.fire( 'Erro!', `${response.data.msg.msg}`, 'error')

        }
    }).catch((error) => {
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
  }

  return (
    <div className="col-12 px-3">
      <p className="text-start fs-2 fw-bold">Auto de infração</p>
    
        {data.map((item, index) => (
        <div className="card border-0 shadow mt-2" key={index}>
          <div
            className="card-body">
            <div className="d-flex align-items-center justify-content-between pb-3">
              <div>
                <div className="h2 mb-0 d-flex align-items-center">
                  {item.placa}
                </div>
                <div
                  className="h6 mt-2 d-flex align-items-center fs-6"
                  id="estacionadocarro">
                  <h6> <BsCalendarDate />‎ {item.data}</h6>
                </div>
               
                <div
                  className="h6 d-flex align-items-center fs-6"
                  id="bordaBaixo">
                  <h6> <FaClipboardList />‎ Motivo: {item.tipo}</h6>
                </div>

              </div>

            </div>
          </div>
             <div className="justify-content-between pb-3 mb-1">
                <div
                  className="h6 align-items-start text-start px-4"
                  id="estacionadocarroo"
                >
                  <h6> <FaParking />‎ Vaga: {item.vaga}</h6>
                </div>
                <div
                  className="h6 align-items-start text-start px-4"
                  id="estacionadocarroo"
                >
                  <h6> <FaCarAlt />‎ Modelo: {item.fabricante} ({item.modelo})</h6>
                </div>
                <div
                  className="h6 align-items-start text-start px-4"
                  id="estacionadocarroo"
                >
                  <h6> <BsCashCoin />‎ Cor: {item.cor}</h6>
                </div>

            </div>
        </div>
    ))}

        <div className="row">
            <div className="col-12">
                <button className="btn3 botao mt-4 w-50"> REGISTRAR PROVA </button>
            </div>
            <div className="col-12">
                <button className="btn2 botao w-50 mt-3 mx-0"> VISUALIZAR FOTOS </button>
            </div>
            <div className="col-12 input-group mt-5">
                <span className="input-group-text bg-blue-50 text-white" id="basic-addon1"><FaClipboardList /></span>
                <input className="form-control bg-white rounded-end border-bottom-0" placeholder="Código do DETRAN" value={codigo} onChange={(e) => setCodigo(e.target.value)} aria-describedby="basic-addon1" />
            </div>
            <div className="col-12">
                <button className="btn4 botao mt-3 mb-5 w-50" onClick={() => {confirmarInfracao()}}> CONFIRMAR AUTO DE INFRAÇÃO </button>
            </div>
        </div>
    </div>
  )
}

export default AutoInfracao