import { React, useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Componentes from "./Componentes";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import CaixaVerificacao from "../../util/CaixaVerificacao";

const socket = io(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 2000,
  timeout: 10000
});
 
const HomePageComponente = () => {
    const [data, setData] = useState("");
    const user = localStorage.getItem("user");
    const userDados = JSON.parse(user);
    const [cont, setCont] = useState(0);  
    const [lastPosition, setLastPosition] = useState(null);
  
if (user === null || user === undefined) {
    const allowedComponents = [
      "RegisterPage",
      "LoginPage",
      "NewPassword",
      "Confirmation",
      "ResetPassword",
    ];
    if (!allowedComponents.includes(localStorage.getItem("componente"))) {
      localStorage.setItem("componente", "LoginPage");
    }   
  } else { 
    const allowedComponents = [
      "RegisterPage",
      "LoginPage",
      "NewPassword",
      "Confirmation",
      "ResetPassword",
    ];
    if (allowedComponents.includes(localStorage.getItem("componente"))) {
      const perfil = userDados.perfil[0];
      switch (perfil) {
        case "cliente":
          localStorage.setItem("componente", "MeusVeiculos");
          break;
        case "monitor":
          localStorage.setItem("componente", "ListarVagasMonitor");
          break;
        case "parceiro":
          localStorage.setItem("componente", "RegistrarEstacionamentoParceiro");
          break;
        case "admin":
          localStorage.setItem("componente", "Dashboard");
          break;
        default:
          break;
      }
    }
  }
  useEffect(() => {
    if (user != null && userDados.perfil[0] != null) {
      if (userDados.perfil[0] == 'monitor') {
        const { id_usuario, nome } = userDados;
        
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            const newPosition = { latitude, longitude };
            if (!lastPosition || lastPosition.latitude !== latitude || lastPosition.longitude !== longitude) {
              const data = {
                idUsuario: id_usuario,
                nome: nome,
                coordenadas: `${latitude},${longitude}`,
              };
              socket.emit('localizacaoSalvar', data);
              setLastPosition(newPosition);
            }
          }, (error) => {
            console.error('Error ao buscar localização', error);
          }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        } else {
          console.error('Localização não suportada');
        }
      }
    }
  }, []);


  useEffect(() => {
    setTimeout(() => {
      setCont(cont + 1);
    }, 500);
    setData(localStorage.getItem("componente"));
  }, [cont]);

  return (
    <>
      {userDados === null || data === "EscolherPerfil" ? null : <Sidebar />}
      {userDados !== null && data !== "EscolherPerfil" ? (
        <main className="content">
          {data === "" ? null : <Componentes Componente={data} />}
        </main>
      ) : (
        <main className="main">
          {data === "" ? null : <Componentes Componente={data} />}
        </main>
      )}
    </>
  );
};
const HomePage = CaixaVerificacao(HomePageComponente);
export default HomePage;
