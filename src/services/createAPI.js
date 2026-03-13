import axios from "axios";

const createAPI = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const user2 = JSON.parse(user);

  const headers = {
    token: token,
    id_usuario: user2.id_usuario,
    perfil_usuario: user2.perfil[0],
  };

  const apiCall = axios.create({
    baseURL: process.env.REACT_APP_HOST,
    headers: headers,
  });

  apiCall.interceptors.response.use(
    response => response,
    error => {
      if (
        error.response &&
        error.response.status === 403 &&
        error.response.data.tipo === "caixa_bloqueado"
      ) {
        window.location.href = "/";
        return;
      }
      return Promise.reject(error);
    }
  );

  return apiCall;
};

export default createAPI;
