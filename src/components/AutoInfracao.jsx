import { React, useEffect, useState } from 'react'
import { AiFillCheckCircle, AiFillPrinter } from 'react-icons/ai';
import { BiErrorCircle } from 'react-icons/bi';
import { BsCalendarDate, BsCashCoin, BsFillPersonFill } from 'react-icons/bs';
import { FaCarAlt, FaClipboardList, FaParking, FaSearch } from 'react-icons/fa';

const AutoInfracao = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        document.title = 'Auto de Infração'
        const infos = JSON.parse(localStorage.getItem('autoInfracao'))
        setData([infos])
        console.log([infos])
    }, [])

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
                <button className="btn4 botao mt-4"> REGISTRAR PROVA </button>
            </div>
            <div className="col-12">
                <button className="btn2 botao w-100 mt-3"> VISUALIZAR FOTOS </button>
            </div>
            <div className="col-12 input-group w-100 mt-5">
                <span className="input-group-text bg-blue-50 text-white" id="basic-addon1"><FaClipboardList /></span>
                <input className="form-control bg-white rounded-end border-bottom-0" placeholder="Código do DETRAN" aria-describedby="basic-addon1" />
            </div>
            <div className="col-12">
                <button className="btn4 botao mt-3 mb-5"> CONFIRMAR AUTO DE INFRAÇÃO </button>
            </div>
        </div>
    </div>
  )
}

export default AutoInfracao