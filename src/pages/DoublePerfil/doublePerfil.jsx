import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import Dropdown from 'react-bootstrap/Dropdown';
import './style.css';

const DoublePerfil = () => {
    const { authenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const analisePerfil = localStorage.getItem('user');
    const analiseFeita = JSON.parse(analisePerfil);
    console.log(analiseFeita)
    if(!authenticated){
        navigate('/')
    }

const handleLogout = () => {
    logout();
}

function red(id,analiseFeita) {
    const perfil = [analiseFeita.perfil[id]];
    analiseFeita.perfil = perfil;
    localStorage.setItem('user', JSON.stringify(analiseFeita));
    console.log(analiseFeita)
    navigate('/home')
    
}

if(analiseFeita.perfil.length > 1){

    if(analiseFeita.perfil.length === 2 ){
        return (
          <section class="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
          <div className="container">
          <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
          <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
          <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
              <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-3 pb-3" />
              <h1 className="mb-5 mt-5 h3 text-muted fs-24"><small>Selecione o perfil desejado:</small></h1>
          </div>
            
            <div class="btn-group">
  <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdown-basic" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
    Selecione
  </button>
  <ul class="dropdown-menu dropdown-menu-lg-end" id="dropdown-select">
    <li><button class="dropdown-item" type="button" id="dropdown-item" onClick={()=> { red(0,analiseFeita)}}>{analiseFeita.perfil[0]}</button></li>
    <li><button class="dropdown-item" type="button" id="dropdown-item" onClick={()=> { red(1,analiseFeita)}}>{analiseFeita.perfil[1]}</button></li>
  </ul>
</div>

          </div>
          </div>
          </div>
          </div>
          </section>
          );
    }
    if(analiseFeita.perfil.length === 3 ){
        return (
          <section class="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
          <div className="container">
          <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
          <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
          <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
              <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
              <h1 className="mb-0 h3">Selecione seu perfil</h1>
          </div>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Escolha seu perfil
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={()=> { red(0,analiseFeita)}}>{analiseFeita.perfil[0]}</Dropdown.Item>
                <Dropdown.Item onClick={()=> { red(1,analiseFeita)}}>{analiseFeita.perfil[1]}</Dropdown.Item>
                <Dropdown.Item onClick={()=> { red(2,analiseFeita)}}>{analiseFeita.perfil[2]}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
          </div>
          </div>
          </div>
          </section>
          );
    }
    else if(analiseFeita.perfil.length === 4 ){
        return (
          <section class="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
          <div className="container">
          <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
          <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
          <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
              <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
              <h1 className="mb-0 h3">Selecione seu perfil</h1>
          </div>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Escolha seu perfil
              </Dropdown.Toggle>

              <Dropdown.Menu>
              <Dropdown.Item onClick={()=> { red(0,analiseFeita)}}>{analiseFeita.perfil[0]}</Dropdown.Item>
                <Dropdown.Item onClick={()=> { red(1,analiseFeita)}}>{analiseFeita.perfil[1]}</Dropdown.Item>
                <Dropdown.Item onClick={()=> { red(2,analiseFeita)}}>{analiseFeita.perfil[2]}</Dropdown.Item>
                <Dropdown.Item onClick={()=> { red(3,analiseFeita)}}>{analiseFeita.perfil[3]}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
          </div>
          </div>
          </div>
          </section>
          );
    }
    else if(analiseFeita.perfil.length === 5 ){
        return (
          <section class="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
          <div className="container">
          <div className="row justify-content-center form-bg-image" data-background-lg="../../assets/img/illustrations/signin.svg">
          <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="bg-gray-50 shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
          <div className="text-center text-md-center mb-3 pt-3 mt-4mt-md-0">
              <img src="../../assets/img/logoconseproof2.png" alt="logo" className="mb-4" />
              <h1 className="mb-0 h3">Selecione seu perfil</h1>
          </div>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Escolha seu perfil
          </Dropdown.Toggle>

          <Dropdown.Menu>
                <Dropdown.Item onClick={()=> { red(0,analiseFeita)}}>{analiseFeita.perfil[0]}</Dropdown.Item>
                <Dropdown.Item onClick={()=> { red(1,analiseFeita)}}>{analiseFeita.perfil[1]}</Dropdown.Item>
                <Dropdown.Item onClick={()=> { red(2,analiseFeita)}}>{analiseFeita.perfil[2]}</Dropdown.Item>
                <Dropdown.Item onClick={()=> { red(3,analiseFeita)}}>{analiseFeita.perfil[3]}</Dropdown.Item>
                <Dropdown.Item onClick={()=> { red(4,analiseFeita)}}>{analiseFeita.perfil[4]}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </div>
          </div>
          </div>
          </div>
          </section>
        );
    }
    return (
        <div className="justify-content-center align-itens-center mt-10 pt-10">
            <h1 className='text-danger'>Você ultrapassou os limites de usuários.</h1>
        </div>
    );
}
}
export default DoublePerfil;