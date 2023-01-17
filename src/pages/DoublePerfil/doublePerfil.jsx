import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth";
import 'bootstrap/dist/css/bootstrap.min.css'
import Dropdown from 'react-bootstrap/Dropdown';

const DoublePerfil = () => {
    const { authenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const analisePerfil = localStorage.getItem('user');
    const analiseFeita = JSON.parse(analisePerfil);
    console.log(analiseFeita.perfil)
    if(!authenticated){
        navigate('/login')
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
            <div className="justify-content-center align-itens-center mt-10 pt-10">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Escolha seu perfil
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/home" onClick={() => { red(0,analiseFeita)}}>{analiseFeita.perfil[0]}</Dropdown.Item>
                <Dropdown.Item href="/home" onClick={()=> { red(1,analiseFeita)}}>{analiseFeita.perfil[1]}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
          );
    }
    if(analiseFeita.perfil.length === 3 ){
        return (
            <div className="justify-content-center align-itens-center mt-10 pt-10">
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
          );
    }
    else if(analiseFeita.perfil.length === 4 ){
        return (
            <div className="justify-content-center align-itens-center mt-10 pt-10">
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
          );
    }
    else if(analiseFeita.perfil.length === 5 ){
        return (
        <div className="justify-content-center align-itens-center mt-10 pt-10">
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