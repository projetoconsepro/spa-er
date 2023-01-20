import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3001"
});

export const createSession = async (login, senha) => {
    return api.post('/usuarios/login', { login, senha });
};

export const registrar = async (nome, email, cpf, telefone , senha) => {
    return api.post('/usuarios/cadastro', { nome, email, cpf, telefone , senha });
};