import { React, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { GrDocumentConfig } from 'react-icons/gr'
import ScrollTopArrow from './ScrollTopArrow'

const UsuariosAdmin = () => {
    const [vaga, setVaga] = useState('')

  return (
    <div className="dashboard-container mb-5">
    <div className="row">
        <div className="col-12 col-xl-8">
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="row mx-2">
                        <div className="col-6 align-middle">
                        <select className="form-select form-select-lg mb-3 mt-2" aria-label=".form-select-lg example" id="setoresSelect">

                                <option value='sim'>Setor: </option>
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
                                        <th className="border-bottom" scope="col">Nome</th>
                                        <th className="border-bottom" scope="col">Telefone</th>
                                        <th className="border-bottom" scope="col">Perfil</th>
                                        <th className="border-bottom" scope="col">   ‎‎</th>

                                    </tr>
                                </thead>
                                <tbody>
                                        <tr className="card-list">
                                            <th className="fw-bolder" scope="row"> Wendel Gustavo</th>
                                            <td className="fw-bolder"> <small>51 995633760</small></td>
                                            <td className="fw-bolder"> <small>Parceiro</small></td>
                                            <td className="fw-bolder"> <small><GrDocumentConfig /></small></td>
                                        </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ScrollTopArrow />
</div>
  )
}

export default UsuariosAdmin