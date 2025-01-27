import { React, useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Componentes from "./Componentes";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
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

export default HomePage;
