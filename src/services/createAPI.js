import axios from 'axios';

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const user2 = JSON.parse(user);

const headers = {
  token: token,
  id_usuario: user2.id_usuario,
  perfil_usuario: user2.perfil[0],
};

const api = axios.create({
  baseURL: process.env.REACT_APP_HOST,
  headers: headers,
});

let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 3;
const requestQueue = [];

const logQueue = () => {
  console.log('Lista de requisições na fila:', requestQueue);
};

const processQueue = async () => {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS || requestQueue.length === 0) return;

  activeRequests++;
  const { method, url, data, config, resolve, reject } = requestQueue[0];
  try {
    const response = await api.request({ method, url, data, ...config });
    resolve(response);
  } catch (error) {
    reject(error);
  } finally {
    activeRequests--;
    requestQueue.shift();
    processQueue();
    logQueue();
  }
};

const requisicao = (method, url, data, config) => {
  return new Promise((resolve, reject) => {
    const newRequest = { method, url, data, config, resolve, reject };
    requestQueue.push(newRequest);
    if (activeRequests === 0) {
      processQueue();
    }
    logQueue();
  });
};

export const createAPI = {
  get: (url, config) => requisicao('get', url, null, config),
  post: (url, data, config) => requisicao('post', url, data, config),
  put: (url, data, config) => requisicao('put', url, data, config),
  delete: (url, config) => requisicao('delete', url, data, config),
};
