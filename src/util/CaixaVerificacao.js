import MensagemCaixa from "../components/MensagemCaixa";
import createAPI from '../services/createAPI';
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`);

function CaixaVerificacao(Componente) {
  return function Verificado(props) {
    const [caixa, setCaixa] = useState(localStorage.getItem("caixa") ?? "false");
    const [userDados, setUserDados] = useState(() => {
      const user = localStorage.getItem("user"); 
      return user ? JSON.parse(user) : null;
    });

    const getUser = () => {
      const usuario = localStorage.getItem("user");
      return usuario ? JSON.parse(usuario) : null;
    };
  
    useEffect(() => {
      if (userDados && userDados.id_usuario) {
        socket.emit('registroCaixa', userDados.id_usuario);
      }
    }, [userDados]);
  
    const verificarCaixa = () => {
      const usuario = getUser();
      setUserDados(usuario);
      if (usuario && usuario.id_usuario) {
        const requisicao = createAPI();
        requisicao.get('/caixa/verificar').then((response) => {
          if (response.data.msg.resultado) {
            localStorage.setItem('caixa', "true");
            setCaixa("true");
          } else {
            localStorage.setItem('caixa', "false");
            setCaixa("false");
          }
        });
      } else {
        localStorage.setItem('caixa', "false");
        setCaixa("false");
      }
    };

    useEffect(() => {
      verificarCaixa();
      window.addEventListener("caixaChange", verificarCaixa);

      socket.on('caixaStatusChange', (data) => {
        const usuario = getUser();
        if (usuario && usuario.id_usuario === data.idUsuario) {
          verificarCaixa();
        }
      });

      return () => {
        window.removeEventListener("caixaChange", verificarCaixa);
        socket.off('caixaStatusChange');
      };
    }, []);

    if (
      userDados &&
      userDados.perfil &&
      userDados.perfil[0] === "monitor" &&
      caixa !== "true"
    ) {
      return <MensagemCaixa />;
    }
    return <Componente {...props} />;
  };
}

export default CaixaVerificacao;