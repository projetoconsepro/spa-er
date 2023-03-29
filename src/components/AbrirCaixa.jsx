import {React, useState, useEffect} from 'react'

const AbrirCaixa = () => {
    const [valor, setValor] = useState(0)
    const [estado, setEstado] = useState(false)

    const abrirCaixa = () => {
        if(estado === true){
            setEstado(false)
        }
        else{
            setEstado(true)
        }
    }

  return (
    <div className="container">
    <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
        <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="row">
                    <div className="col-12">
                        <button type="button" className="btn4 botao">Abrir turno</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h6 className="mt-2">O turno está: fechado.</h6>
                    </div>
                </div>
                {estado === true ?
                <button type="button" className="btn7 botao mt-4" onClick={() => {abrirCaixa()}}>Fechar caixa</button>
                :
                <button type="button" className="btn4 botao mt-4" onClick={() => {abrirCaixa()}}>Abrir caixa</button>}
                {estado === true ? <div className="card border-0 shadow mt-3">
                    <div className="card-body5">
                        <div className="align-items-center justify-content-between pb-3">

                            <div className="row justify-content-center align-items-center">
                                <div className="col-12">
                                    <h6>Defina o valor do caixa:</h6>
                                </div>
                                <div className="col-6">
                                <div className="input-group w-75">
                                    <input type="number" className="form-control fs-6" id="inputAbrirCaixa" placeholder="30" value={valor} onChange={(e) => setValor(e.target.value)} />
                                </div>
                                </div>
                            </div>

                            <div className="row justify-content-center align-items-center">
                                <div className="col-12">
                                    <h6 className="mt-4">Valor definido em: R${valor === 0 ? '00' : valor},00</h6>
                                </div>
                                <div className="col-12">
                                  
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div> : ""}
                </div>
            </div>
        </div>
    </div>
  )
}

export default AbrirCaixa