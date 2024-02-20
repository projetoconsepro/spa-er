import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../pages/contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import FuncTrocaComp from '../util/FuncTrocaComp';

const DoisPerfis = () => {
    const { authenticated, logout } = useContext(AuthContext);
    const analisePerfil = localStorage.getItem('user');
    const analiseFeita = JSON.parse(analisePerfil);
    const [data, setData] = useState([]);
    
  useEffect(() => {
    localStorage.removeItem('componenteAnterior')
    const analisePerfil = localStorage.getItem('user');
    const analiseFeita = JSON.parse(analisePerfil);
    if(Array.isArray(analiseFeita.perfil[1].perfil)){
      setData(analiseFeita.perfil[1].perfil);
    }
  }, []);

    let perfil = [];
    for(let i = 0; i < analiseFeita.perfil.length; i++){
        perfil[i] = analiseFeita.perfil[i].perfil;
    }

function red(id) {
  const NewPerfil = perfil;
    for (let i = 0; i < perfil.length; i++) {
      NewPerfil[i] = perfil[i];
    }
    const perfill = [perfil[id] , {perfil: NewPerfil} ];
    analiseFeita.perfil = perfill;
    localStorage.setItem('user', JSON.stringify(analiseFeita));
    if(analiseFeita.perfil[0] === 'cliente'){
      FuncTrocaComp('MeusVeiculos');
    }else if (analiseFeita.perfil[0] === 'monitor'){
      FuncTrocaComp('ListarVagasMonitor');
    } else if (analiseFeita.perfil[0] === 'parceiro'){
      FuncTrocaComp('RegistrarEstacionamentoParceiro');
    }
    else if (analiseFeita.perfil[0] === 'admin'){
      FuncTrocaComp('Dashboard');
    }
    else if (analiseFeita.perfil[0] === 'agente'){
      FuncTrocaComp( 'ListarNotificacoesAgente');
    }
}

const trocaPerfil = (item) => {
  analiseFeita.perfil[0] = item;
  localStorage.setItem('user', JSON.stringify(analiseFeita));
  if(analiseFeita.perfil[0] === 'cliente'){
    FuncTrocaComp('MeusVeiculos');
  } else if (analiseFeita.perfil[0] === 'monitor'){
    FuncTrocaComp('ListarVagasMonitor');
  } else if (analiseFeita.perfil[0] === 'parceiro'){
    FuncTrocaComp('RegistrarEstacionamentoParceiro');
  } else if (analiseFeita.perfil[0] === 'admin'){
    FuncTrocaComp('Dashboard');
  } else if (analiseFeita.perfil[0] === 'agente'){
    FuncTrocaComp( 'ListarNotificacoesAgente');
  }
}
        return (
          <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
          <div className="container pb-5 mb-5">
          <div className="row justify-content-center form-bg-image">
          <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500 mb-6">
          <div className="text-center text-md-center mb-3 pt-3 mt-4 mt-md-0">
              <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-3 pb-3" />
              <h1 className="mb-5 mt-5 h3 text-muted fs-24"><small>Selecione o perfil desejado:</small></h1>
          </div>
            
            <div className="btn-group mb-5">
  <button type="button" className="btn btn-secondary dropdown-toggle" id="dropdown-basic" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
    Selecione
  </button>
  <ul className="dropdown-menu dropdown-menu-lg-end" id="dropdown-select">
    {data.length >= 2 ? data.map((item, index) => (
      <li key={index} className="dropdown-item" type="button" id="dropdown-item" onClick={()=> { trocaPerfil(item)}}>{item}</li>
    )) :
    perfil.map((item, index) => (
      <li key={index} className="dropdown-item" type="button" id="dropdown-item" onClick={()=> { red(index)}}>{item}</li>
    ))}
      </ul>
        </div>
        </div>
        </div>
        </div>
        </div>
      </section>
          );
}
export default DoisPerfis;