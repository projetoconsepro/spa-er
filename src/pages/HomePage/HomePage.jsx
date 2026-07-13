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
    if (user == null) return undefined;
    const parsedUser = JSON.parse(user);
    if (!parsedUser?.perfil?.[0]) return undefined;

    const perfil = parsedUser.perfil[0];
    if (perfil !== 'monitor' && perfil !== 'agente') return undefined;

    const { id_usuario, nome } = parsedUser;
    const eventoSocket = perfil === 'monitor' ? 'localizacaoSalvar' : 'localizacaoAgenteSalvar';

    if (!navigator.geolocation) return undefined;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit(eventoSocket, {
          idUsuario: id_usuario,
          nome,
          coordenadas: `${latitude},${longitude}`,
        });
      },
      (error) => {
        console.error('Erro ao buscar localização', error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user]);


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
